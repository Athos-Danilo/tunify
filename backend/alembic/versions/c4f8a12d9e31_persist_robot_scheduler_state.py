"""Persist robot execution state for restart-safe scheduler timers.

Revision ID: c4f8a12d9e31
Revises: b82fa031c9de
"""
from alembic import op
import sqlalchemy as sa

revision = "c4f8a12d9e31"
down_revision = "b82fa031c9de"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if not inspector.has_table("system_metadata"):
        op.create_table(
            "system_metadata",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("key", sa.String(), nullable=False),
            sa.Column("last_run", sa.DateTime(timezone=True), nullable=True),
            sa.Column("next_run", sa.DateTime(timezone=True), nullable=True),
            sa.Column("status", sa.String(length=20), nullable=False, server_default="IDLE"),
            sa.Column("last_started_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("consecutive_failures", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("last_error", sa.String(length=500), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_system_metadata_id"), "system_metadata", ["id"], unique=False)
        op.create_index(op.f("ix_system_metadata_key"), "system_metadata", ["key"], unique=True)
        return

    existing_columns = {col["name"] for col in inspector.get_columns("system_metadata")}
    columns_to_add = [
        ("status", sa.Column("status", sa.String(length=20), nullable=False, server_default="IDLE")),
        ("last_started_at", sa.Column("last_started_at", sa.DateTime(timezone=True), nullable=True)),
        ("consecutive_failures", sa.Column("consecutive_failures", sa.Integer(), nullable=False, server_default="0")),
        ("last_error", sa.Column("last_error", sa.String(length=500), nullable=True)),
    ]
    for name, column in columns_to_add:
        if name not in existing_columns:
            op.add_column("system_metadata", column)


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    if not inspector.has_table("system_metadata"):
        return

    existing_columns = {col["name"] for col in inspector.get_columns("system_metadata")}
    for name in ("last_error", "consecutive_failures", "last_started_at", "status"):
        if name in existing_columns:
            op.drop_column("system_metadata", name)
