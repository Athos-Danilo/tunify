import httpx
from typing import List, Dict, Any

import base64
# ======> O Motor de Busca.
# 1) Classe isolada responsável apenas por falar com a API do Spotify;
# 2) Usa o 'httpx' para fazer requisições de forma assíncrona (não bloqueia o servidor);
# 3) Traduz as regras de negócio da nossa RN13.
# ----------------------------------------------------------------------------------------- #
class SpotifyService:
    
    def __init__(self):
        # A URL base oficial de todos os endpoints do Spotify
        self.base_url = "https://api.spotify.com/v1"

    # ======> Rota: Músicas Tocadas Recentemente
    # access_token: A chave da porta do usuário.
    # after_timestamp: O "Cursor de Tempo" (ex: 1713195000). Se passado, só pega o que tocou DEPOIS disso.
    # ------------------------------------------------------------------------------------------------------- #
    async def get_recently_played(self, access_token: str, after_timestamp: int = None) -> List[Dict[str, Any]]:
        url = f"{self.base_url}/me/player/recently-played"
        
        # Preparamos a mochila de parâmetros
        # O Spotify permite pedir no máximo 50 músicas por vez.
        params = {"limit": 50}
        
        if after_timestamp:
            params["after"] = after_timestamp

        # O cabeçalho com o crachá de acesso (Bearer Token)
        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        # Abrimos um "rádio comunicador" assíncrono com o Spotify
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params)
            
            # Se o token expirou (Erro 401), o robô da madrugada vai bater de cara na porta.
            # Lançamos um erro específico para o robô saber que precisa usar o Refresh Token!
            if response.status_code == 401:
                raise ValueError("TOKEN_EXPIRADO")
            
            # Se batermos rápido demais e tomarmos Rate Limit (Erro 429)
            if response.status_code == 429:
                raise Exception("RATE_LIMIT_ATINGIDO")

            # Se der qualquer outro erro bizarro (500, 404), ele estoura aqui
            response.raise_for_status()
            
            # Pegamos a resposta em JSON e extraímos apenas a lista "items"
            data = response.json()
            return data.get("items", [])
    
    # 🚨 [ATUALIZADO] ======> Rota: Buscar Múltiplos Artistas (Lote/Batch)
    # 1) Permite buscar até 50 artistas de uma única vez para economizar requisições.
    # 2) Retorna os dados completos do artista, incluindo a foto de perfil oficial.
    # -------------------------------------------------------------------------------------- #
    async def get_artists(self, access_token: str, artist_ids: List[str]) -> Dict[str, Any]:
        # O Spotify exige os IDs separados por vírgula.
        ids_string = ",".join(artist_ids)
        
        # 🚨 Bypass 2: Colocamos os IDs direto na string da URL para o httpx não transformar a vírgula em '%2C'
        url = f"{self.base_url}/artists?ids={ids_string}"
        
        # 🚨 Bypass 1: A Carteirada Anti-Bot! 
        # Colocamos o User-Agent e o Accept para o Spotify achar que somos um App oficial de verdade.
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Tunify/1.0 (Windows NT 10.0; Win64; x64)" 
        }

        # Não enviamos 'params' aqui embaixo, pois já colamos na URL ali em cima!
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            
            if response.status_code == 401:
                raise ValueError("TOKEN_EXPIRADO")
                
            if response.status_code == 429:
                raise Exception("RATE_LIMIT_ATINGIDO")

            # Se ainda der erro, isso vai nos mostrar no terminal exatamente qual foi
            response.raise_for_status()
            
            # Devolve o JSON completo (que contém uma chave "artists" com a lista)
            return response.json()

    # ======> Rota: Renovar o Crachá (Refresh Token)
    # 1) O Token do Spotify morre em 1 hora.
    # 2) Essa função usa o refresh_token (que não morre) para pegar um novo access_token.
    # -------------------------------------------------------------------------------------- #
    async def atualizar_token(self, refresh_token: str, client_id: str, client_secret: str) -> dict:
        url = "https://accounts.spotify.com/api/token"
        
        # O Spotify exige que a gente mande os dados como "formulário" e não como JSON
        payload = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": client_id,
        }

        # A autenticação secreta do nosso App
        auth_str = f"{client_id}:{client_secret}"
        import base64
        b64_auth = base64.b64encode(auth_str.encode()).decode()

        headers = {
            "Authorization": f"Basic {b64_auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, data=payload)
            response.raise_for_status()
            
            # Devolve o novo Access Token (e às vezes um novo Refresh Token)
            return response.json()