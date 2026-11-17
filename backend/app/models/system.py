from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base


class SystemMetadata(Base):
    __tablename__ = "system_metadata"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    last_run = Column(DateTime(timezone=True), nullable=True)
    next_run = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), nullable=False, default="IDLE", server_default="IDLE")
    last_started_at = Column(DateTime(timezone=True), nullable=True)
    consecutive_failures = Column(Integer, nullable=False, default=0, server_default="0")
    last_error = Column(String(500), nullable=True)

