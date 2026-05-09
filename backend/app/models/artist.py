# Ferramentas do SQLAlchemy
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func

# Importa a classe Base
from app.core.database import Base

# ======> O Molde da Tabela de Cache de Artistas (Perfil Oficial)
# 1) Armazena a foto de perfil oficial do artista (diferente da capa do álbum).
# 2) Controla a validade da foto para o robô de faxina (3h - 4h da manhã).
# -------------------------------------------------------------------------------------- #
class ArtistCache(Base):
    __tablename__ = "artists_cache"

    # 1. ID do Artista (Chave Primária)
    # É o ID único do Spotify (Ex: 1Xyo4u8uXC1ZmMpatF05PJ).
    # Essencial para fazermos as requisições em lote (Batch).
    spotify_id = Column(String, primary_key=True, index=True)

    # 2. Nome do Artista
    # Guardamos o nome para facilitar consultas e relatórios.
    name = Column(String, nullable=False)

    # 3. Foto de Perfil Oficial
    # Aqui salvamos a URL da foto oficial (geralmente redonda) do perfil do artista.
    profile_image_url = Column(String, nullable=True)

    # 4. Data da Última Atualização
    # O PULO DO GATO: O robô de faxina vai olhar para este campo.
    # Se 'last_updated_at' for mais antigo que 15 dias, o robô coloca o ID na fila.
    last_updated_at = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )