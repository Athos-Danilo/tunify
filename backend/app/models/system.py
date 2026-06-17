from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base

class SystemMetadata(Base):
    __tablename__ = "system_metadata"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    last_run = Column(DateTime(timezone=True), nullable=True)
    next_run = Column(DateTime(timezone=True), nullable=True)
