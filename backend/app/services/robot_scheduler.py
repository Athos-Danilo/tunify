"""Gerenciamento persistente de cronômetros e recuperação de robôs após reinícios."""
from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Awaitable, Callable, Literal, Optional
from weakref import WeakKeyDictionary

from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

from app.models.system import SystemMetadata

logger = logging.getLogger("Tunify-Robots")

STATUS_IDLE = "IDLE"
STATUS_RUNNING = "RUNNING"
STATUS_FAILED = "FAILED"

COOLDOWN_STEPS_MINUTES = (5, 15)
MAX_IMMEDIATE_RETRIES = len(COOLDOWN_STEPS_MINUTES)
CATCHUP_INITIAL_DELAY_SECONDS = 15
CATCHUP_STAGGER_SECONDS = 20
INTERRUPTED_ERROR_MSG = (
    "Execução interrompida antes da conclusão (possível reinício ou limite de memória)."
)

_loop_locks: WeakKeyDictionary[asyncio.AbstractEventLoop, asyncio.Lock] = WeakKeyDictionary()


def get_robot_lock() -> asyncio.Lock:
    """Retorna um Lock exclusivo por event loop para serializar os robôs."""
    loop = asyncio.get_running_loop()
    lock = _loop_locks.get(loop)
    if lock is None:
        lock = asyncio.Lock()
        _loop_locks[loop] = lock
    return lock


def as_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """Normaliza datetimes naive (como os retornados pelo SQLite) para UTC."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def default_now_utc() -> datetime:
    return datetime.now(timezone.utc)


@dataclass(frozen=True)
class RobotDefinition:
    key: str
    name: str
    kind: Literal["interval", "cron"]
    runner: Callable[[], Awaitable[None]]
    interval_minutes: Optional[int] = None
    cron_kwargs: Optional[dict] = None


@dataclass(frozen=True)
class StartupPlan:
    next_run: datetime
    status: str
    consecutive_failures: int
    last_error: Optional[str]
    reason: str
    next_overdue_index: int


def build_trigger(robot: RobotDefinition, start_date: Optional[datetime] = None):
    if robot.kind == "interval":
        if not robot.interval_minutes or robot.interval_minutes <= 0:
            raise ValueError(f"Intervalo inválido para robô '{robot.key}'.")
        return IntervalTrigger(
            minutes=robot.interval_minutes,
            start_date=as_utc(start_date),
            timezone=timezone.utc,
        )
    return CronTrigger(**(robot.cron_kwargs or {}), timezone=timezone.utc)


def compute_initial_next_run(robot: RobotDefinition, now_utc: datetime) -> datetime:
    ref = as_utc(now_utc)
    if robot.kind == "interval":
        return ref + timedelta(minutes=robot.interval_minutes)
    trigger = build_trigger(robot)
    return as_utc(trigger.get_next_fire_time(None, ref))


def compute_next_future_run(robot: RobotDefinition, reference_time: datetime) -> datetime:
    """Calcula a próxima execução estritamente posterior a reference_time."""
    ref = as_utc(reference_time)
    if robot.kind == "interval":
        return ref + timedelta(minutes=robot.interval_minutes)
    trigger = build_trigger(robot)
    return as_utc(trigger.get_next_fire_time(ref, ref))


def compute_retry_time(
    robot: RobotDefinition,
    now_utc: datetime,
    failures: int,
    stagger_seconds: int = 0,
) -> datetime:
    ref = as_utc(now_utc)
    natural_next = compute_next_future_run(robot, ref)
    if failures <= MAX_IMMEDIATE_RETRIES:
        cooldown_minutes = COOLDOWN_STEPS_MINUTES[failures - 1]
        candidate = ref + timedelta(minutes=cooldown_minutes, seconds=stagger_seconds)
        return candidate if candidate < natural_next else natural_next
    return natural_next


def plan_startup_schedule(
    meta: Optional[SystemMetadata],
    robot: RobotDefinition,
    now_utc: datetime,
    overdue_index: int,
) -> StartupPlan:
    ref = as_utc(now_utc)
    saved_next = as_utc(meta.next_run) if meta else None

    if meta is None or saved_next is None:
        target = compute_initial_next_run(robot, ref)
        return StartupPlan(
            next_run=target,
            status=STATUS_IDLE,
            consecutive_failures=0,
            last_error=None,
            reason="initial",
            next_overdue_index=overdue_index,
        )

    if meta.status == STATUS_RUNNING:
        failures = (meta.consecutive_failures or 0) + 1
        stagger = CATCHUP_STAGGER_SECONDS * overdue_index
        target = compute_retry_time(robot, ref, failures, stagger_seconds=stagger)
        next_idx = overdue_index + 1 if failures <= MAX_IMMEDIATE_RETRIES else overdue_index
        return StartupPlan(
            next_run=target,
            status=STATUS_FAILED,
            consecutive_failures=failures,
            last_error=INTERRUPTED_ERROR_MSG,
            reason="interrupted_recovery",
            next_overdue_index=next_idx,
        )

    if saved_next <= ref:
        delay = CATCHUP_INITIAL_DELAY_SECONDS + CATCHUP_STAGGER_SECONDS * overdue_index
        target = ref + timedelta(seconds=delay)
        return StartupPlan(
            next_run=target,
            status=meta.status or STATUS_IDLE,
            consecutive_failures=meta.consecutive_failures or 0,
            last_error=meta.last_error,
            reason="catchup",
            next_overdue_index=overdue_index + 1,
        )

    return StartupPlan(
        next_run=saved_next,
        status=meta.status or STATUS_IDLE,
        consecutive_failures=meta.consecutive_failures or 0,
        last_error=meta.last_error,
        reason="resumed",
        next_overdue_index=overdue_index,
    )


def _get_or_create_metadata(db, key: str) -> SystemMetadata:
    meta = db.query(SystemMetadata).filter(SystemMetadata.key == key).first()
    if meta is None:
        meta = SystemMetadata(key=key, status=STATUS_IDLE, consecutive_failures=0)
        db.add(meta)
    return meta


def upsert_robot_success_metadata(
    session_factory,
    key: str,
    finished_at: datetime,
    next_run: datetime,
) -> None:
    """Atualiza o estado do robô após execução concluída com sucesso."""
    db = session_factory()
    try:
        meta = _get_or_create_metadata(db, key)
        meta.last_run = as_utc(finished_at)
        meta.next_run = as_utc(next_run)
        meta.status = STATUS_IDLE
        meta.consecutive_failures = 0
        meta.last_error = None
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def _mark_robot_running(session_factory, key: str, started_at: datetime) -> None:
    db = session_factory()
    try:
        meta = _get_or_create_metadata(db, key)
        meta.status = STATUS_RUNNING
        meta.last_started_at = as_utc(started_at)
        meta.last_error = None
        db.commit()
    except Exception as exc:
        db.rollback()
        logger.warning(f"⚠️ [AGENDADOR] Não foi possível marcar '{key}' como RUNNING: {exc}")
    finally:
        db.close()


async def _mark_robot_idle_with_retry(
    session_factory,
    key: str,
    finished_at: datetime,
    next_run: datetime,
) -> None:
    for attempt in range(3):
        try:
            upsert_robot_success_metadata(session_factory, key, finished_at, next_run)
            return
        except Exception as exc:
            if attempt < 2:
                logger.warning(
                    f"⚠️ [AGENDADOR] Falha ao salvar conclusão de '{key}' ({attempt + 1}/3): {exc}"
                )
                await asyncio.sleep(1)
            else:
                logger.error(
                    f"❌ [AGENDADOR] Não foi possível salvar conclusão de '{key}' após 3 tentativas: {exc}"
                )


def _mark_robot_failed(
    session_factory,
    robot: RobotDefinition,
    finished_at: datetime,
    error_message: str,
) -> tuple[datetime, int]:
    db = session_factory()
    try:
        meta = _get_or_create_metadata(db, robot.key)
        failures = (meta.consecutive_failures or 0) + 1
        retry_at = compute_retry_time(robot, finished_at, failures)
        meta.status = STATUS_FAILED
        meta.consecutive_failures = failures
        meta.last_error = error_message[:500] if error_message else "Erro desconhecido"
        meta.next_run = retry_at
        db.commit()
        return retry_at, failures
    except Exception as exc:
        db.rollback()
        logger.error(f"❌ [AGENDADOR] Erro ao registrar falha de '{robot.key}': {exc}")
        return compute_next_future_run(robot, finished_at), 1
    finally:
        db.close()


def _sync_scheduler_next_run(scheduler, key: str, next_run: datetime) -> None:
    if scheduler is None:
        return
    try:
        if scheduler.get_job(key) is not None:
            scheduler.modify_job(key, next_run_time=as_utc(next_run))
    except Exception as exc:
        logger.warning(f"⚠️ [AGENDADOR] Não foi possível atualizar next_run_time de '{key}': {exc}")


def _resolve_next_run_after_success(
    scheduler,
    robot: RobotDefinition,
    finished_at: datetime,
) -> datetime:
    if scheduler is not None:
        job = scheduler.get_job(robot.key)
        if job is not None and job.next_run_time is not None:
            scheduled = as_utc(job.next_run_time)
            if scheduled > finished_at:
                return scheduled

    next_run = compute_next_future_run(robot, finished_at)
    _sync_scheduler_next_run(scheduler, robot.key, next_run)
    return next_run


async def execute_managed_robot(
    robot: RobotDefinition,
    scheduler,
    session_factory,
    now_fn: Callable[[], datetime] = default_now_utc,
) -> None:
    """Executa um robô sob exclusão mútua e persiste início, sucesso ou backoff de falha."""
    async with get_robot_lock():
        started_at = as_utc(now_fn())
        _mark_robot_running(session_factory, robot.key, started_at)
        try:
            await robot.runner()
        except Exception as exc:
            finished_at = as_utc(now_fn())
            retry_at, failures = _mark_robot_failed(
                session_factory, robot, finished_at, str(exc)
            )
            _sync_scheduler_next_run(scheduler, robot.key, retry_at)
            logger.error(
                f"❌ [AGENDADOR] Robô '{robot.key}' falhou (tentativa {failures}). "
                f"Próxima tentativa em {retry_at.isoformat()}: {exc}"
            )
            return

        finished_at = as_utc(now_fn())
        next_run = _resolve_next_run_after_success(scheduler, robot, finished_at)
        await _mark_robot_idle_with_retry(
            session_factory, robot.key, finished_at, next_run
        )


def _format_remaining(now_utc: datetime, target: datetime) -> str:
    seconds = max(int((target - now_utc).total_seconds()), 0)
    minutes, secs = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    if hours > 0:
        return f"{hours}h {minutes}m"
    if minutes > 0:
        return f"{minutes}m {secs}s"
    return f"{secs}s"


def _log_startup_plan(robot: RobotDefinition, plan: StartupPlan, now_utc: datetime) -> None:
    remaining = _format_remaining(now_utc, plan.next_run)
    target_iso = plan.next_run.isoformat()
    if plan.reason == "resumed":
        logger.info(
            f"🕒 [AGENDADOR] '{robot.key}' retomado: faltam {remaining} (próxima em {target_iso})."
        )
    elif plan.reason == "catchup":
        logger.info(
            f"⚡ [AGENDADOR] '{robot.key}' estava atrasado; recuperação em {remaining} ({target_iso})."
        )
    elif plan.reason == "interrupted_recovery":
        logger.warning(
            f"🛡️ [AGENDADOR] '{robot.key}' foi interrompido antes de concluir "
            f"(tentativa {plan.consecutive_failures}); retry agendado em {remaining} ({target_iso})."
        )
    else:
        logger.info(
            f"🆕 [AGENDADOR] '{robot.key}' inicializado para {target_iso} (em {remaining})."
        )


def initialize_robots(
    scheduler,
    robots: list[RobotDefinition],
    session_factory,
    now_fn: Callable[[], datetime] = default_now_utc,
) -> dict[str, StartupPlan]:
    """Lê os cronômetros salvos no banco, agenda os robôs e inicia o scheduler."""
    now_utc = as_utc(now_fn())
    plans: dict[str, StartupPlan] = {}
    overdue_index = 0

    db = session_factory()
    try:
        keys = [robot.key for robot in robots]
        existing_rows = {
            row.key: row
            for row in db.query(SystemMetadata).filter(SystemMetadata.key.in_(keys)).all()
        }

        for robot in robots:
            meta = existing_rows.get(robot.key)
            plan = plan_startup_schedule(meta, robot, now_utc, overdue_index)
            overdue_index = plan.next_overdue_index
            plans[robot.key] = plan

            if meta is None:
                meta = SystemMetadata(key=robot.key)
                db.add(meta)
            meta.next_run = plan.next_run
            meta.status = plan.status
            meta.consecutive_failures = plan.consecutive_failures
            meta.last_error = plan.last_error

        db.commit()
    except Exception as exc:
        db.rollback()
        logger.error(
            f"⚠️ [AGENDADOR] Falha ao ler/persistir metadados no startup; usando agenda padrão: {exc}"
        )
        plans = {}
        for robot in robots:
            target = compute_initial_next_run(robot, now_utc)
            plans[robot.key] = StartupPlan(
                next_run=target,
                status=STATUS_IDLE,
                consecutive_failures=0,
                last_error=None,
                reason="initial",
                next_overdue_index=0,
            )
    finally:
        db.close()

    for robot in robots:
        plan = plans[robot.key]
        trigger = build_trigger(robot, start_date=plan.next_run)

        async def _job_runner(r: RobotDefinition = robot) -> None:
            await execute_managed_robot(r, scheduler, session_factory, now_fn=now_fn)

        scheduler.add_job(
            _job_runner,
            trigger=trigger,
            id=robot.key,
            name=robot.name,
            next_run_time=plan.next_run,
            replace_existing=True,
            coalesce=True,
            max_instances=1,
            misfire_grace_time=None,
        )
        _log_startup_plan(robot, plan, now_utc)

    if not scheduler.running:
        scheduler.start()

    return plans
