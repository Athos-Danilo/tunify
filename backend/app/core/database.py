# backend/app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# 1. O Motor (Engine): É ele que faz a conexão real com o PostgreSQL
engine = create_engine(settings.DATABASE_URL)

# 2. A Sessão (Session): É a "conversa" aberta com o banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. A Base (Base): Todas as nossas tabelas vão herdar dessa classe
Base = declarative_base()

# Função para pegar a sessão do banco (vamos usar muito nas rotas)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()