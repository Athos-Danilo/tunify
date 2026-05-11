import httpx
import logging
from app.core.config import settings

logger = logging.getLogger("Tunify-Genius")

class GeniusService:
    def __init__(self):
        self.base_url = "https://api.genius.com"
        self.headers = {
            "Authorization": f"Bearer {settings.GENIUS_ACCESS_TOKEN}",
            "User-Agent": "Tunify/1.0"
        }

    async def buscar_foto_artista(self, nome_artista: str) -> str:
        """
        Busca um artista no Genius e retorna a URL da foto de perfil.
        """
        url = f"{self.base_url}/search"
        params = {"q": nome_artista}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                data = response.json()

                # O Genius retorna "hits" (músicas). Vamos pegar o artista da primeira música.
                hits = data.get("response", {}).get("hits", [])
                if hits:
                    # Pegamos o 'primary_artist' do primeiro resultado da busca
                    artista_data = hits[0]["result"]["primary_artist"]
                    return artista_data.get("image_url")
                
                return None
            except Exception as e:
                logger.error(f"❌ [GENIUS] Erro ao buscar artista {nome_artista}: {e}")
                return None