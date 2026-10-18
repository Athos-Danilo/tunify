"""Consolidate daily totals and make play ingestion idempotent.

Revision ID: a71d9e2c4b10
Revises: ede0ca8e1881
"""
from alembic import op

revision = "a71d9e2c4b10"
down_revision = "ede0ca8e1881"
branch_labels = None
depends_on = None


def upgrade():
    # PostgreSQL transactional DDL: no writer can change totals during consolidation.
    op.execute("LOCK TABLE monthly_history, daily_minutes_listened IN ACCESS EXCLUSIVE MODE")
    op.execute("""
        WITH totals AS (
            SELECT MIN(id) AS keep_id, SUM(total_ms) AS total_ms
            FROM daily_minutes_listened GROUP BY user_id, date_referencia
        )
        UPDATE daily_minutes_listened AS d SET total_ms = totals.total_ms
        FROM totals WHERE d.id = totals.keep_id
    """)
    op.execute("""
        DELETE FROM daily_minutes_listened
        WHERE id NOT IN (
            SELECT MIN(id) FROM daily_minutes_listened
            GROUP BY user_id, date_referencia
        )
    """)
    # Preserve the accumulated totals; do not infer historical durations from today's cache.
    op.execute("""
        DELETE FROM monthly_history
        WHERE id NOT IN (
            SELECT MIN(id) FROM monthly_history
            GROUP BY user_id, spotify_track_id, played_at
        )
    """)
    op.create_unique_constraint("uq_monthly_history_play", "monthly_history",
                                ["user_id", "spotify_track_id", "played_at"])
    op.create_unique_constraint("uq_daily_minutes_user_date", "daily_minutes_listened",
                                ["user_id", "date_referencia"])


def downgrade():
    op.drop_constraint("uq_daily_minutes_user_date", "daily_minutes_listened", type_="unique")
    op.drop_constraint("uq_monthly_history_play", "monthly_history", type_="unique")
    # Consolidated rows are deliberately not split back into duplicates.
