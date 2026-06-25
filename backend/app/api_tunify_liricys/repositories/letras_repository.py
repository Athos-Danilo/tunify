# Tipos opcionais.
from typing import Optional
# O Collection do Motor, que permite rodar queries de forma assíncrona.
from motor.motor_asyncio import AsyncIOMotorCollection

# Importa o nosso gerenciador do MongoDB.
from app.core.mongo import db
# Importa o molde (Schema) que valida as letras (agora na nova pasta!).
from app.api_tunify_liricys.schemas.letras import LetraSchema


# ======> Repositório de Letras (Padrão Data Access).
# 1) Isola o banco de dados das rotas (controllers);
# 2) Se um dia trocarmos de banco, só precisamos alterar este arquivo;
# 3) Garante a tipagem e segurança nas queries.
# ------------------------------------------------------------------------- #
class LetrasRepository:
    
    # ======> Pegar a Coleção.
    # Pega o banco de dados 'tunify' e a coleção 'letras'.
    # ---------------------------------------------------------- #
    def _get_collection(self) -> AsyncIOMotorCollection:
        return db.client.tunify.letras
        
    # ======> Salvar Letra.
    # Insere uma nova letra validada pelo Pydantic direto no MongoDB.
    # ---------------------------------------------------------- #
    async def save_letra(self, letra: LetraSchema) -> None:
        collection = self._get_collection()
        # O Motor requer dicionários nativos do Python, por isso usamos model_dump().
        await collection.insert_one(letra.model_dump())
        
    # ======> Buscar Letra pelo Spotify ID.
    # Tenta achar a letra no MongoDB. Se achar, reconstrói o modelo Pydantic.
    # ---------------------------------------------------------- #
    async def get_letra_by_spotify_id(self, id_musica_spotify: str) -> Optional[LetraSchema]:
        collection = self._get_collection()
        document = await collection.find_one({"id_musica_spotify": id_musica_spotify})
        
        if document:
            return LetraSchema(**document)
            
        return None
        
    # ======> Atualizar Status.
    # Altera rapidamente apenas o status (PENDENTE -> PROCESSANDO -> CONCLUIDO).
    # ---------------------------------------------------------- #
    async def update_status(self, id_musica_spotify: str, status: str) -> None:
        collection = self._get_collection()
        await collection.update_one(
            {"id_musica_spotify": id_musica_spotify},
            {"$set": {"status": status}}
        )
