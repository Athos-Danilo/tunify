import asyncio
import importlib.util
from datetime import datetime, timezone, timedelta
from pathlib import Path
from unittest.mock import patch

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException

from app.core.database import Base
from app.models import User, MonthlyHistory, DailyMinutesListened
from app.services.listening_history import record_play
from app.api.v1.endpoints.history import save_recent_delta, get_daily_minutes

@pytest.fixture
def db():
    engine = create_engine('sqlite://')
    Base.metadata.create_all(engine)
    with sessionmaker(bind=engine, autoflush=False)() as session:
        session.add(User(id=1, spotify_id='audit', email='audit@test', access_token='fake'))
        session.commit()
        yield session
    engine.dispose()

NOW = datetime(2026, 10, 18, 15, tzinfo=timezone.utc)

@pytest.fixture(autouse=True)
def fixed_clock(monkeypatch):
    from app.api.v1.endpoints import history
    from app.services import tasks
    class Clock(datetime):
        @classmethod
        def now(cls, tz=None):
            return NOW.astimezone(tz) if tz else NOW.replace(tzinfo=None)
    monkeypatch.setattr(history, "datetime", Clock)
    from types import SimpleNamespace
    monkeypatch.setattr(tasks, "datetime", SimpleNamespace(datetime=Clock, timedelta=timedelta, timezone=timezone))

def test_batch_retry_and_later_increment(db):
    for i in range(20):
        assert record_play(db, 1, 'track', NOW + timedelta(seconds=i), 180000)
    db.commit()
    assert db.query(DailyMinutesListened).count() == 1
    assert not record_play(db, 1, 'track', NOW, 180000)
    assert record_play(db, 1, 'track', NOW + timedelta(minutes=100), 60000)
    db.commit()
    db.expire_all()
    assert db.query(DailyMinutesListened).one().total_ms == 3660000
    assert db.query(MonthlyHistory).count() == 21

def test_brazil_day_and_offsets(db):
    record_play(db, 1, 'a', datetime.fromisoformat('2026-11-01T02:59:59+00:00'), 60000)
    record_play(db, 1, 'b', datetime.fromisoformat('2026-11-01T05:00:00+02:00'), 120000)
    db.commit()
    assert {r.date_referencia:r.total_ms for r in db.query(DailyMinutesListened)} == {'2026-10-31':60000,'2026-11-01':120000}

def test_rollback_preserves_both_tables(db):
    record_play(db, 1, 'a', NOW, 60000)
    db.rollback()
    assert db.query(MonthlyHistory).count() == 0
    assert db.query(DailyMinutesListened).count() == 0

def item(duration=420000):
    return {'played_at':NOW.isoformat(),'track':{'id':'a','name':'A','duration_ms':duration,'artists':[], 'album':{'images':[]}}}

def test_delta_duplicate_in_same_batch_and_retry(db):
    result=asyncio.run(save_recent_delta('audit@test', {'items':[item(),item()]}, db))
    assert result['added_count']==1
    assert asyncio.run(save_recent_delta('audit@test', {'items':[item()]}, db))['added_count']==0
    assert db.query(DailyMinutesListened).one().total_ms==420000

def test_invalid_delta_rolls_back_batch(db):
    bad=item(-1)
    bad['track']['id']='b'
    with pytest.raises(HTTPException) as error:
        asyncio.run(save_recent_delta('audit@test', {'items':[item(),bad]},db))
    assert error.value.status_code==422
    assert db.query(MonthlyHistory).count()==0
    assert db.query(DailyMinutesListened).count()==0

def test_read_legacy_export_totals_and_user_isolation(db):
    # Legacy schema intentionally has no uniqueness yet.
    db.execute(text('DROP TABLE daily_minutes_listened'))
    db.execute(text('CREATE TABLE daily_minutes_listened (id INTEGER PRIMARY KEY, user_id INTEGER, date_referencia TEXT, total_ms INTEGER)'))
    today=(NOW-timedelta(hours=3)).date().isoformat()
    durations=[174560,212868,191307,180000,209438,169839,203569,376169,153633,261826,295502,264254,169824,208946,302952,246500,309120,207837,240294,272535]
    for n,ms in enumerate(durations,1):
        db.execute(text('INSERT INTO daily_minutes_listened VALUES (:id,1,:day,:ms)'),dict(id=n,day=today,ms=ms))
    db.execute(text('INSERT INTO daily_minutes_listened VALUES (21,2,:day,9999999)'),dict(day=today))
    db.commit()
    result=asyncio.run(get_daily_minutes('audit@test',db))
    assert result[-1]['minutos']==77
    assert result[-1]['is_atual']
    assert len(result)==int(today[-2:])
    assert all(row['minutos']==0 for row in result[:-1])

def test_migration_consolidates_without_changing_total():
    path=Path(__file__).parents[1]/'alembic/versions/a71d9e2c4b10_daily_accumulator_integrity.py'
    spec=importlib.util.spec_from_file_location('daily_migration',path)
    migration=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(migration)
    engine=create_engine('sqlite://')
    with engine.begin() as conn:
        conn.execute(text('CREATE TABLE daily_minutes_listened (id INTEGER PRIMARY KEY,user_id INTEGER,date_referencia TEXT,total_ms INTEGER)'))
        conn.execute(text("INSERT INTO daily_minutes_listened VALUES (1,1,'2026-10-18',4000000),(2,1,'2026-10-18',650973),(3,2,'2026-10-18',60000)"))
        conn.execute(text('CREATE TABLE monthly_history (id INTEGER PRIMARY KEY,user_id INTEGER,spotify_track_id TEXT,played_at TEXT)'))
        conn.execute(text("INSERT INTO monthly_history VALUES (1,1,'a','2026-10-18'),(2,1,'a','2026-10-18')"))
        class Operations:
            def execute(self,sql):
                if not sql.startswith('LOCK TABLE'):
                    conn.execute(text(sql))
            def create_unique_constraint(self,name,table,columns):
                conn.execute(text(f'CREATE UNIQUE INDEX {name} ON {table} ({", ".join(columns)})'))
        with patch.object(migration,'op',Operations()):
            migration.upgrade()
        assert conn.execute(text('SELECT SUM(total_ms) FROM daily_minutes_listened')).scalar()==4710973
        assert conn.execute(text('SELECT COUNT(*) FROM daily_minutes_listened')).scalar()==2
        assert conn.execute(text('SELECT COUNT(*) FROM monthly_history')).scalar()==1
        assert len(conn.execute(text("PRAGMA index_list('daily_minutes_listened')")).all())==1

def test_robot_batch_then_frontend_retry(db, monkeypatch):
    from unittest.mock import AsyncMock
    from app.services import tasks
    db.query(User).filter_by(id=1).update({'refresh_token':'fake'})
    db.commit()
    play=item()
    play['track']['album']['name']='Album'
    next_play=item()
    next_play['played_at']=(NOW+timedelta(seconds=1)).isoformat()
    class Spotify:
        get_recently_played=AsyncMock(return_value=[play,next_play,play])
    monkeypatch.setattr(tasks,'SpotifyService',Spotify)
    monkeypatch.setattr(tasks,'SessionLocal',sessionmaker(bind=db.bind,autoflush=False))
    monkeypatch.setattr(tasks.asyncio,'sleep',AsyncMock())
    asyncio.run(tasks.robo_rastreador_hourly())
    db.expire_all()
    assert db.query(MonthlyHistory).count()==2
    assert db.query(DailyMinutesListened).one().total_ms==840000
    result=asyncio.run(save_recent_delta('audit@test', {'items':[play,next_play]},db))
    assert result['added_count']==0
    db.expire_all()
    assert db.query(DailyMinutesListened).one().total_ms==840000
