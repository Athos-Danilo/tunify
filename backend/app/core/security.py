# Importa o CryptContext do passlib e a biblioteca JWT
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta, timezone
import hashlib
import os
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

# ======> Configurações do JWT e Senhas
# A chave secreta é a assinatura do seu servidor. NUNCA vaze isso.
# Em produção, usa TUNIFY_SECRET_KEY; caso ausente ou curta, deriva uma chave estável de 64 caracteres.
SECRET_KEY = os.getenv("TUNIFY_SECRET_KEY")
if not SECRET_KEY or len(SECRET_KEY) < 32 or SECRET_KEY == "chave_super_secreta_temporaria_123":
    seed = os.getenv("SPOTIFY_CLIENT_SECRET") or "tunify-fallback-jwt-secret-key-2026"
    SECRET_KEY = hashlib.sha256(f"tunify-jwt:{seed}".encode("utf-8")).hexdigest()
ALGORITHM = "HS256"
DIAS_DE_VALIDADE = 7 # O token vai durar 7 dias sem precisar logar de novo

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================================================================== #
#                      🔐 FUNÇÕES DE SENHA (BCRYPT)                           #
# =========================================================================== #

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha digitada bate com o hash do banco."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Transforma a senha pura em um Hash embaralhado."""
    return pwd_context.hash(password)


# =========================================================================== #
#                      🎫 FUNÇÃO DO PASSAPORTE (JWT)                          #
# =========================================================================== #

def criar_token_jwt(dados: dict) -> str:
    """
    Recebe os dados (ex: email do usuário) e gera o Token JWT assinado.
    """
    to_encode = dados.copy()
    
    # Calcula a data e hora exata em que o token vai vencer
    expire = datetime.now(timezone.utc) + timedelta(days=DIAS_DE_VALIDADE)
    to_encode.update({"exp": expire})
    
    # Carimba o token com a nossa chave secreta e o algoritmo HS256
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


bearer = HTTPBearer(auto_error=False)


def obter_usuario_atual(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    erro = HTTPException(status_code=401, detail="Sessão inválida ou expirada. Faça login novamente.",
                         headers={"WWW-Authenticate": "Bearer"})
    if credentials is None:
        raise erro
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM],
                             options={"require": ["exp", "sub"]})
        email = payload["sub"]
        if not isinstance(email, str) or not email:
            raise erro
    except jwt.InvalidTokenError:
        raise erro
    usuario = db.query(User).filter(User.email == email).first()
    if usuario is None:
        raise erro
    return usuario


def obter_usuario_opcional(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User | None:
    return obter_usuario_atual(credentials, db) if credentials else None
