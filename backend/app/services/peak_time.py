"""Monthly playback counts in Brazil's UTC-3 timezone."""
from datetime import datetime, timezone
from sqlalchemy import text
from app.services.listening_history import BRAZIL_TZ

PERIODS = ("madrugada", "manha", "tarde", "noite")
PEAK_TIME_QUERY = text("""
    SELECT
        COUNT(*) FILTER (WHERE local_hour BETWEEN 0 AND 5) AS madrugada,
        COUNT(*) FILTER (WHERE local_hour BETWEEN 6 AND 11) AS manha,
        COUNT(*) FILTER (WHERE local_hour BETWEEN 12 AND 17) AS tarde,
        COUNT(*) FILTER (WHERE local_hour BETWEEN 18 AND 23) AS noite
    FROM (
        SELECT EXTRACT(HOUR FROM played_at AT TIME ZONE 'America/Fortaleza') AS local_hour
        FROM monthly_history
        WHERE user_id = :uid AND played_at >= :inicio_mes AND played_at <= :agora
    ) AS plays
""")


def month_window(now=None):
    now = now or datetime.now(timezone.utc)
    local = now.astimezone(BRAZIL_TZ)
    start = local.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return start.astimezone(timezone.utc), now.astimezone(timezone.utc)


def summarize_periods(values):
    counts = dict(zip(PERIODS, (int(value or 0) for value in values)))
    maximum = max(counts.values())
    winners = [key for key, value in counts.items() if maximum > 0 and value == maximum]
    return {
        "periodos": counts,
        # Preserve the existing field for older frontend versions during deployment.
        "dominante": winners[0] if winners else "nenhum",
        "dominantes": winners,
        "total_plays": sum(counts.values()),
    }
