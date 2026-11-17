"""Testes dos cronômetros persistentes, recuperação pós-reinício e proteção contra OOM."""
import asyncio
import importlib.util
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import AsyncMock

import pytest
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.database import Base
from app.models.system import SystemMetadata
from app.services import tasks
from app.services.robot_scheduler import (
    CATCHUP_INITIAL_DELAY_SECONDS,
    CATCHUP_STAGGER_SECONDS,
    INTERRUPTED_ERROR_MSG,
    RobotDefinition,
    STATUS_FAILED,
    STATUS_IDLE,
    STATUS_RUNNING,
    as_utc,
    execute_managed_robot,
    initialize_robots,
)


@pytest.fixture
def db_factory():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False)
    try:
        yield Session
    finally:
        engine.dispose()


def make_scheduler():
    return AsyncIOScheduler(
        timezone=timezone.utc,
        job_defaults={"coalesce": True, "max_instances": 1, "misfire_grace_time": None},
    )


def make_robots(recorder=None):
    async def noop():
        if recorder is not None:
            recorder.append("ran")

    return [
        RobotDefinition(
            key="rastreador_spotify",
            name="Rastreador",
            kind="interval",
            interval_minutes=100,
            runner=noop,
        ),
        RobotDefinition(
            key="agregador_mensal",
            name="Agregador",
            kind="cron",
            cron_kwargs={"day": 1, "hour": 3, "minute": 0},
            runner=noop,
        ),
        RobotDefinition(
            key="faxineiro_artistas",
            name="Faxineiro",
            kind="cron",
            cron_kwargs={"hour": 4, "minute": 0},
            runner=noop,
        ),
        RobotDefinition(
            key="semeador_letras",
            name="Semeador",
            kind="cron",
            cron_kwargs={"hour": 5, "minute": 0},
            runner=noop,
        ),
    ]


def test_first_boot_initializes_all_robots_in_db_and_scheduler(db_factory):
    now = datetime(2026, 11, 17, 10, 0, tzinfo=timezone.utc)

    async def scenario():
        scheduler = make_scheduler()
        try:
            plans = initialize_robots(scheduler, make_robots(), db_factory, now_fn=lambda: now)
            assert plans["rastreador_spotify"].reason == "initial"
            assert plans["rastreador_spotify"].next_run == now + timedelta(minutes=100)
            assert plans["agregador_mensal"].next_run == datetime(2026, 12, 1, 3, 0, tzinfo=timezone.utc)
            assert plans["faxineiro_artistas"].next_run == datetime(2026, 11, 18, 4, 0, tzinfo=timezone.utc)
            assert plans["semeador_letras"].next_run == datetime(2026, 11, 18, 5, 0, tzinfo=timezone.utc)

            with db_factory() as db:
                rows = {row.key: row for row in db.query(SystemMetadata).all()}
                assert set(rows.keys()) == {
                    "rastreador_spotify",
                    "agregador_mensal",
                    "faxineiro_artistas",
                    "semeador_letras",
                }
                for key, row in rows.items():
                    assert row.status == STATUS_IDLE
                    assert row.consecutive_failures == 0
                    assert as_utc(row.next_run) == plans[key].next_run
                    assert as_utc(scheduler.get_job(key).next_run_time) == plans[key].next_run
        finally:
            if scheduler.running:
                scheduler.shutdown(wait=False)

    asyncio.run(scenario())


def test_restart_preserves_remaining_timer_before_expiration(db_factory):
    now = datetime(2026, 11, 17, 11, 30, tzinfo=timezone.utc)
    expected_tracker_next = now + timedelta(minutes=10)
    expected_cleaner_next = datetime(2026, 11, 18, 4, 0, tzinfo=timezone.utc)

    with db_factory() as db:
        db.add_all([
            SystemMetadata(
                key="rastreador_spotify",
                last_run=now - timedelta(minutes=90),
                next_run=expected_tracker_next,
                status=STATUS_IDLE,
                consecutive_failures=0,
            ),
            SystemMetadata(
                key="faxineiro_artistas",
                last_run=datetime(2026, 11, 17, 4, 0, tzinfo=timezone.utc),
                next_run=expected_cleaner_next,
                status=STATUS_IDLE,
                consecutive_failures=0,
            ),
        ])
        db.commit()

    async def scenario():
        scheduler = make_scheduler()
        try:
            plans = initialize_robots(scheduler, make_robots(), db_factory, now_fn=lambda: now)
            assert plans["rastreador_spotify"].reason == "resumed"
            assert plans["rastreador_spotify"].next_run == expected_tracker_next
            assert as_utc(scheduler.get_job("rastreador_spotify").next_run_time) == expected_tracker_next
            assert plans["faxineiro_artistas"].reason == "resumed"
            assert as_utc(scheduler.get_job("faxineiro_artistas").next_run_time) == expected_cleaner_next
        finally:
            if scheduler.running:
                scheduler.shutdown(wait=False)

    asyncio.run(scenario())


def test_restart_staggers_overdue_robots_for_catchup(db_factory):
    now = datetime(2026, 11, 17, 12, 0, tzinfo=timezone.utc)
    with db_factory() as db:
        db.add_all([
            SystemMetadata(
                key="rastreador_spotify",
                last_run=now - timedelta(minutes=120),
                next_run=now - timedelta(minutes=20),
                status=STATUS_IDLE,
            ),
            SystemMetadata(
                key="faxineiro_artistas",
                last_run=datetime(2026, 11, 16, 4, 0, tzinfo=timezone.utc),
                next_run=datetime(2026, 11, 17, 4, 0, tzinfo=timezone.utc),
                status=STATUS_IDLE,
            ),
        ])
        db.commit()

    async def scenario():
        scheduler = make_scheduler()
        try:
            plans = initialize_robots(scheduler, make_robots(), db_factory, now_fn=lambda: now)
            first_expected = now + timedelta(seconds=CATCHUP_INITIAL_DELAY_SECONDS)
            second_expected = now + timedelta(
                seconds=CATCHUP_INITIAL_DELAY_SECONDS + CATCHUP_STAGGER_SECONDS
            )
            assert plans["rastreador_spotify"].reason == "catchup"
            assert plans["rastreador_spotify"].next_run == first_expected
            assert plans["faxineiro_artistas"].reason == "catchup"
            assert plans["faxineiro_artistas"].next_run == second_expected

            with db_factory() as db:
                row = db.query(SystemMetadata).filter_by(key="rastreador_spotify").one()
                assert as_utc(row.next_run) == first_expected
        finally:
            if scheduler.running:
                scheduler.shutdown(wait=False)

    asyncio.run(scenario())


def test_interrupted_running_robot_applies_backoff_and_prevents_oom_loop(db_factory):
    now = datetime(2026, 11, 17, 4, 1, tzinfo=timezone.utc)
    with db_factory() as db:
        db.add(
            SystemMetadata(
                key="faxineiro_artistas",
                next_run=datetime(2026, 11, 17, 4, 0, tzinfo=timezone.utc),
                status=STATUS_RUNNING,
                last_started_at=datetime(2026, 11, 17, 4, 0, 5, tzinfo=timezone.utc),
                consecutive_failures=0,
            )
        )
        db.commit()

    async def scenario():
        # 1ª interrupção -> cooldown de 5 minutos
        s1 = make_scheduler()
        try:
            p1 = initialize_robots(s1, make_robots(), db_factory, now_fn=lambda: now)
            assert p1["faxineiro_artistas"].reason == "interrupted_recovery"
            assert p1["faxineiro_artistas"].status == STATUS_FAILED
            assert p1["faxineiro_artistas"].consecutive_failures == 1
            assert p1["faxineiro_artistas"].next_run == now + timedelta(minutes=5)
            assert p1["faxineiro_artistas"].last_error == INTERRUPTED_ERROR_MSG
        finally:
            if s1.running:
                s1.shutdown(wait=False)

        # Reinício antes do cooldown vencer preserva o horário sem somar falha
        later_before_cooldown = now + timedelta(minutes=2)
        s_mid = make_scheduler()
        try:
            p_mid = initialize_robots(
                s_mid, make_robots(), db_factory, now_fn=lambda: later_before_cooldown
            )
            assert p_mid["faxineiro_artistas"].reason == "resumed"
            assert p_mid["faxineiro_artistas"].consecutive_failures == 1
            assert p_mid["faxineiro_artistas"].next_run == now + timedelta(minutes=5)
        finally:
            if s_mid.running:
                s_mid.shutdown(wait=False)

        # 2ª interrupção -> cooldown de 15 minutos
        with db_factory() as db:
            db.query(SystemMetadata).filter_by(key="faxineiro_artistas").update({"status": STATUS_RUNNING})
            db.commit()
        t2 = now + timedelta(minutes=6)
        s2 = make_scheduler()
        try:
            p2 = initialize_robots(s2, make_robots(), db_factory, now_fn=lambda: t2)
            assert p2["faxineiro_artistas"].consecutive_failures == 2
            assert p2["faxineiro_artistas"].next_run == t2 + timedelta(minutes=15)
        finally:
            if s2.running:
                s2.shutdown(wait=False)

        # 3ª interrupção -> desiste da retentativa imediata e pula para o próximo ciclo natural (dia seguinte 04:00)
        with db_factory() as db:
            db.query(SystemMetadata).filter_by(key="faxineiro_artistas").update({"status": STATUS_RUNNING})
            db.commit()
        t3 = t2 + timedelta(minutes=16)
        s3 = make_scheduler()
        try:
            p3 = initialize_robots(s3, make_robots(), db_factory, now_fn=lambda: t3)
            assert p3["faxineiro_artistas"].consecutive_failures == 3
            assert p3["faxineiro_artistas"].next_run == datetime(2026, 11, 18, 4, 0, tzinfo=timezone.utc)
        finally:
            if s3.running:
                s3.shutdown(wait=False)

    asyncio.run(scenario())


def test_execute_managed_robot_tracks_running_success_failure_and_recovery(db_factory):
    clock = [datetime(2026, 11, 17, 10, 0, tzinfo=timezone.utc)]
    observed_status_during_run = []
    should_fail = [True]

    async def worker():
        with db_factory() as db:
            observed_status_during_run.append(
                db.query(SystemMetadata).filter_by(key="rastreador_spotify").one().status
            )
        if should_fail[0]:
            raise RuntimeError("falha simulada no Spotify")

    robot = RobotDefinition(
        key="rastreador_spotify",
        name="Rastreador",
        kind="interval",
        interval_minutes=100,
        runner=worker,
    )

    async def scenario():
        scheduler = make_scheduler()
        try:
            scheduler.add_job(
                lambda: None,
                trigger="interval",
                minutes=100,
                id="rastreador_spotify",
                next_run_time=clock[0] + timedelta(minutes=100),
            )
            # Execução com falha: aplica backoff de 5 min e atualiza scheduler
            await execute_managed_robot(robot, scheduler, db_factory, now_fn=lambda: clock[0])
            assert observed_status_during_run == [STATUS_RUNNING]
            with db_factory() as db:
                meta = db.query(SystemMetadata).filter_by(key="rastreador_spotify").one()
                assert meta.status == STATUS_FAILED
                assert meta.consecutive_failures == 1
                assert "falha simulada no Spotify" in meta.last_error
                assert as_utc(meta.next_run) == clock[0] + timedelta(minutes=5)
                assert (
                    as_utc(scheduler.get_job("rastreador_spotify").next_run_time)
                    == clock[0] + timedelta(minutes=5)
                )

            # Recuperação com sucesso: limpa falhas e agenda próximo ciclo
            clock[0] = clock[0] + timedelta(minutes=5)
            should_fail[0] = False
            await execute_managed_robot(robot, scheduler, db_factory, now_fn=lambda: clock[0])
            with db_factory() as db:
                meta = db.query(SystemMetadata).filter_by(key="rastreador_spotify").one()
                assert meta.status == STATUS_IDLE
                assert meta.consecutive_failures == 0
                assert meta.last_error is None
                assert as_utc(meta.last_run) == clock[0]
                assert as_utc(meta.next_run) == clock[0] + timedelta(minutes=100)
        finally:
            if scheduler.running:
                scheduler.shutdown(wait=False)

    asyncio.run(scenario())


def test_managed_robots_never_overlap_in_memory(db_factory):
    active = 0
    max_active = 0

    async def slow_worker():
        nonlocal active, max_active
        active += 1
        max_active = max(max_active, active)
        await asyncio.sleep(0.05)
        active -= 1

    r1 = RobotDefinition(
        key="rastreador_spotify", name="R1", kind="interval", interval_minutes=100, runner=slow_worker
    )
    r2 = RobotDefinition(
        key="faxineiro_artistas", name="R2", kind="cron", cron_kwargs={"hour": 4}, runner=slow_worker
    )

    async def scenario():
        await asyncio.gather(
            execute_managed_robot(r1, None, db_factory),
            execute_managed_robot(r2, None, db_factory),
        )

    asyncio.run(scenario())
    assert max_active == 1


def test_real_scheduler_fires_remaining_countdown_and_advances_next_run(db_factory):
    async def scenario():
        fired = asyncio.Event()

        async def short_worker():
            fired.set()

        robots = [
            RobotDefinition(
                key="rastreador_spotify",
                name="Rastreador",
                kind="interval",
                interval_minutes=100,
                runner=short_worker,
            )
        ]

        now = datetime.now(timezone.utc)
        remaining_target = now + timedelta(seconds=0.15)
        with db_factory() as db:
            db.add(
                SystemMetadata(
                    key="rastreador_spotify",
                    last_run=now - timedelta(minutes=99),
                    next_run=remaining_target,
                    status=STATUS_IDLE,
                    consecutive_failures=0,
                )
            )
            db.commit()

        scheduler = make_scheduler()
        try:
            initialize_robots(scheduler, robots, db_factory)
            await asyncio.wait_for(fired.wait(), timeout=2.0)
            for _ in range(20):
                with db_factory() as db:
                    meta = db.query(SystemMetadata).filter_by(key="rastreador_spotify").one()
                    if meta.last_run and as_utc(meta.last_run) >= remaining_target:
                        break
                await asyncio.sleep(0.05)

            with db_factory() as db:
                meta = db.query(SystemMetadata).filter_by(key="rastreador_spotify").one()
                assert meta.status == STATUS_IDLE
                assert as_utc(meta.last_run) >= remaining_target
                diff = as_utc(meta.next_run) - remaining_target
                assert timedelta(minutes=99) <= diff <= timedelta(minutes=101)
                assert as_utc(scheduler.get_job("rastreador_spotify").next_run_time) == as_utc(meta.next_run)
        finally:
            if scheduler.running:
                scheduler.shutdown(wait=False)

    asyncio.run(scenario())


def test_real_scheduler_cron_catchup_reschedules_to_next_cron_window(db_factory, monkeypatch):
    from app.services import robot_scheduler as rs

    monkeypatch.setattr(rs, "CATCHUP_INITIAL_DELAY_SECONDS", 0.1)

    async def scenario():
        fired = asyncio.Event()

        async def cron_worker():
            fired.set()

        robots = [
            RobotDefinition(
                key="faxineiro_artistas",
                name="Faxineiro",
                kind="cron",
                cron_kwargs={"hour": 4, "minute": 0},
                runner=cron_worker,
            )
        ]

        now = datetime.now(timezone.utc)
        with db_factory() as db:
            db.add(
                SystemMetadata(
                    key="faxineiro_artistas",
                    last_run=now - timedelta(days=1),
                    next_run=now - timedelta(minutes=5),
                    status=STATUS_IDLE,
                )
            )
            db.commit()

        scheduler = make_scheduler()
        try:
            initialize_robots(scheduler, robots, db_factory)
            await asyncio.wait_for(fired.wait(), timeout=2.0)
            for _ in range(20):
                with db_factory() as db:
                    meta = db.query(SystemMetadata).filter_by(key="faxineiro_artistas").one()
                    if meta.last_run and as_utc(meta.last_run) >= now:
                        break
                await asyncio.sleep(0.05)

            with db_factory() as db:
                meta = db.query(SystemMetadata).filter_by(key="faxineiro_artistas").one()
                next_run = as_utc(meta.next_run)
                assert next_run > now
                assert next_run.hour == 4 and next_run.minute == 0
                assert as_utc(scheduler.get_job("faxineiro_artistas").next_run_time) == next_run
        finally:
            if scheduler.running:
                scheduler.shutdown(wait=False)

    asyncio.run(scenario())


def test_iniciar_robos_registers_all_four_robots(db_factory, monkeypatch):
    async def scenario():
        test_scheduler = make_scheduler()
        monkeypatch.setattr(tasks, "scheduler", test_scheduler)
        monkeypatch.setattr(tasks, "SessionLocal", db_factory)
        monkeypatch.setattr(tasks.asyncio, "sleep", AsyncMock())

        try:
            tasks.iniciar_robos()
            assert test_scheduler.running is True
            job_ids = {job.id for job in test_scheduler.get_jobs()}
            assert job_ids == {
                "rastreador_spotify",
                "agregador_mensal",
                "faxineiro_artistas",
                "semeador_letras",
            }
            with db_factory() as db:
                assert db.query(SystemMetadata).count() == 4
        finally:
            if test_scheduler.running:
                test_scheduler.shutdown(wait=False)

    asyncio.run(scenario())


def test_alembic_migration_preserves_existing_metadata_and_downgrades():
    from alembic.migration import MigrationContext
    from alembic.operations import Operations

    path = (
        Path(__file__).resolve().parents[1]
        / "alembic/versions/c4f8a12d9e31_persist_robot_scheduler_state.py"
    )
    spec = importlib.util.spec_from_file_location("robot_scheduler_migration", path)
    migration = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)

    engine = create_engine("sqlite://")
    try:
        with engine.begin() as conn:
            conn.execute(
                text(
                    "CREATE TABLE system_metadata ("
                    "id INTEGER PRIMARY KEY, key TEXT UNIQUE NOT NULL, "
                    "last_run TIMESTAMP, next_run TIMESTAMP)"
                )
            )
            conn.execute(
                text(
                    "INSERT INTO system_metadata (id, key, last_run, next_run) "
                    "VALUES (1, 'rastreador_spotify', '2026-11-17 10:00:00', '2026-11-17 11:40:00')"
                )
            )
            migration.op = Operations(MigrationContext.configure(conn))
            migration.upgrade()

            cols = {c["name"] for c in inspect(conn).get_columns("system_metadata")}
            assert {"status", "last_started_at", "consecutive_failures", "last_error"} <= cols
            row = conn.execute(
                text("SELECT key, status, consecutive_failures, last_error FROM system_metadata")
            ).one()
            assert row == ("rastreador_spotify", "IDLE", 0, None)

            migration.downgrade()
            cols_after = {c["name"] for c in inspect(conn).get_columns("system_metadata")}
            assert not ({"status", "last_started_at", "consecutive_failures", "last_error"} & cols_after)
    finally:
        engine.dispose()
