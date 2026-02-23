# backend/main.py
from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.endpoints import auth
from app.api.v1.endpoints import auth, spotify
from app.core.database import engine, Base

# Importamos nosso modelo para o SQLAlchemy saber que ele existe
from app.models.user import User 

# Isso aqui é a mágica: cria as tabelas no banco se elas não existirem!
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(spotify.router, prefix="/api/v1/spotify", tags=["Spotify"])

@app.on_event("startup")
async def startup_event():
    print(f"> Tunify rodando! Link de login: http://127.0.0.1:8000/api/v1/auth/login")
    print("> Banco de Dados conectado e tabelas verificadas!")

@app.get("/")
def read_root():
    return {"message": "Tunify Backend Online"}