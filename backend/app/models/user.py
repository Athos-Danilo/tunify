# backend/app/models/user.py
from sqlalchemy import Column, Integer, String
from app.core.database import Base

class User(Base):
    __tablename__ = "users" # O nome da tabela lá no pgAdmin

    id = Column(Integer, primary_key=True, index=True)
    spotify_id = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    
    # As chaves do castelo!
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=True)