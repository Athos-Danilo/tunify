# Ferramentas do SQLAlchemy
from sqlalchemy import Column, String

# Importa a classe Base
from app.core.database import Base

# ======> O Molde da Tabela de Cache de Músicas.
# 1) Funciona como um dicionário interno do Tunify.
# 2) Evita que a gente tenha que perguntar o nome da música pro Spotify toda hora.
# -------------------------------------------------------------------------------------- #
class TrackCache(Base):
    __tablename__ = "tracks_cache"

    # 1. ID da Música (Chave Primária)
    # Diferente das outras tabelas, a chave primária AQUI é o próprio ID do Spotify!
    # Afinal, cada música é única no universo.
    spotify_id = Column(String, primary_key=True, index=True)

    # 2. Nome da Música
    name = Column(String, nullable=False)

    # 3. Nome do Artista (ou artistas, separados por vírgula)
    artist_name = Column(String, nullable=False)

    # 4. URL da Capa do Álbum
    # Salvamos o link da imagem (geralmente uma URL que começa com 'i.scdn.co')
    album_cover_url = Column(String, nullable=True)