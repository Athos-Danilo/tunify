"""Fix missing album_name

Revision ID: 9b6530305a60
Revises: dc654b4202e8
Create Date: 2026-10-09 12:34:25.922489

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9b6530305a60'
down_revision: Union[str, Sequence[str], None] = 'dc654b4202e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('tracks_cache')]
    if 'album_name' not in columns:
        op.add_column('tracks_cache', sa.Column('album_name', sa.String(), nullable=True))

def downgrade() -> None:
    """Downgrade schema."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('tracks_cache')]
    if 'album_name' in columns:
        op.drop_column('tracks_cache', 'album_name')
