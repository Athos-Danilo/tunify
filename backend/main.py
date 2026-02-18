# backend/main.py
from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.endpoints import auth

app = FastAPI(title=settings.PROJECT_NAME)

# Registra a rota de login
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

@app.on_event("startup")
async def startup_event():
    print(f"🚀 Tunify rodando! Link de login: http://127.0.0.1:8000/api/v1/auth/login")

@app.get("/")
def read_root():
    return {"message": "Tunify Backend Online"}