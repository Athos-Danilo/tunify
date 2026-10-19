"""Persist Spotify profile photos for social connections."""
from alembic import op
import sqlalchemy as sa

revision = "b82fa031c9de"
down_revision = "a71d9e2c4b10"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("foto_perfil", sa.String(), nullable=True))


def downgrade():
    op.drop_column("users", "foto_perfil")
