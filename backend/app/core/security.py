# Importa o CryptContext do passlib e a biblioteca JWT
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import os

# ======> Configurações do JWT e Senhas
# A chave secreta é a assinatura do seu servidor. NUNCA vaze isso.
# O ideal é que depois você coloque TUNIFY_SECRET_KEY no seu arquivo .env!
SECRET_KEY = os.getenv("TUNIFY_SECRET_KEY", "chave_super_secreta_temporaria_123")
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
    expire = datetime.utcnow() + timedelta(days=DIAS_DE_VALIDADE)
    to_encode.update({"exp": expire})
    
    # Carimba o token com a nossa chave secreta e o algoritmo HS256
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt