# Importa o CryptContext do passlib, que é o nosso motor de criptografia
from passlib.context import CryptContext

# ======> Configuração do Motor de Senhas
# Avisamos ao passlib que queremos usar o 'bcrypt' (algoritmo hiper seguro).
# O 'deprecated="auto"' faz com que, se no futuro o bcrypt atualizar, 
# ele consiga ler os hashes antigos sem quebrar o sistema.
# -------------------------------------------------------------------------------------- #
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Recebe a senha que o usuário digitou no frontend (plain_password) e o hash 
    que tá salvo no banco de dados (hashed_password). 
    Retorna True se a senha estiver certa, ou False se estiver errada.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Recebe a senha pura (ex: 'minhasenha123') e devolve a versão embaralhada
    (ex: '$2b$12$X5G...'). É essa string bizarra que a gente salva na tabela User!
    """
    return pwd_context.hash(password)