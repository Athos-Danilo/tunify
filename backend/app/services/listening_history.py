"""Persist a play and its daily increment in the caller's transaction."""
from datetime import timezone, timedelta

from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert

from app.models.history import MonthlyHistory, DailyMinutesListened

BRAZIL_TZ = timezone(timedelta(hours=-3))


def record_play(db, user_id, track_id, played_at, duration_ms):
    if played_at.tzinfo is None:
        raise ValueError("A reprodução precisa informar o fuso horário.")
    if not track_id or not isinstance(duration_ms, int) or duration_ms < 0:
        raise ValueError("Faixa ou duração inválida.")
    played_at = played_at.astimezone(timezone.utc)
    insert = sqlite_insert if db.bind.dialect.name == "sqlite" else pg_insert
    # RETURNING distinguishes a new play from a retry, including concurrent requests.
    play_id = db.execute(
        insert(MonthlyHistory).values(
            user_id=user_id, spotify_track_id=track_id, played_at=played_at
        ).on_conflict_do_nothing(
            index_elements=["user_id", "spotify_track_id", "played_at"]
        ).returning(MonthlyHistory.id)
    ).scalar_one_or_none()
    if play_id is None:
        return False
    db.execute(
        insert(DailyMinutesListened).values(
            user_id=user_id,
            date_referencia=played_at.astimezone(BRAZIL_TZ).date().isoformat(),
            total_ms=duration_ms,
        ).on_conflict_do_update(
            index_elements=["user_id", "date_referencia"],
            set_={"total_ms": DailyMinutesListened.total_ms + duration_ms},
        )
    )
    return True
