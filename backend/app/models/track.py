# Ferramentas do SQLAlchemy
from sqlalchemy import Column, String, Integer, JSON, DateTime
from sqlalchemy.sql import func

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

    # 5. Duração da Música
    # Salva o tempo total da música em milissegundos para uso no Dashboard.
    duration_ms = Column(Integer, nullable=False, default=0)

    # 6. O "DNA" da Música (Áudio Features)
    # Guardará os vetores matemáticos como Energia, Valência, Acústica, etc.
    audio_features = Column(JSON, nullable=True)

    # 7. Gêneros Musicais
    # Uma lista com as classificações de gênero dessa faixa específica.
    genres = Column(JSON, nullable=True)

    # 8. Popularidade
    # Um número de 0 a 100 indicando o quão famosa essa música é no Spotify atualmente.
    popularity = Column(Integer, nullable=True)

    # 9. Data de Atualização
    # Registra automaticamente quando foi a última vez que consultamos os dados dessa música.
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())