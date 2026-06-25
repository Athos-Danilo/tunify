# Cliente oficial assíncrono para o MongoDB.
from motor.motor_asyncio import AsyncIOMotorClient

# ======> Gerenciador Global do MongoDB.
# 1) Classe simples para armazenar a conexão do MotorClient;
# 2) Permite que a conexão (pool) seja aberta lá no main.py (lifespan) 
#    e importada de forma limpa em qualquer repository da aplicação.
# --------------------------------------------------------------------- #
class MongoDB:
    client: AsyncIOMotorClient = None

# A instância vazia que será preenchida no startup e consumida pela aplicação.
db = MongoDB()
