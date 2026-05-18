from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
import httpx

from app.core.database import get_db
from app.models.user import User
from app.models.history import MonthlyHistory
from app.models.track import TrackCache

# 🚨 [NOVO] Importando o nosso Motor de Busca e Configurações
from app.services.spotify_service import SpotifyService
from app.core.config import settings

router = APIRouter()
spotify_service_engine = SpotifyService() # Instancia o motor

@router.get("/playlists/{email}")
async def get_resumo_perfil(email: str, db: Session = Depends(get_db)):
    print(f"[INFO] Requisição recebida para o resumo do perfil. E-mail: {email}")
    
    usuario = db.query(User).filter(User.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    token = usuario.access_token 
    
    # ==========================================
    # 🚨 FUNÇÃO INTERNA: O Batedor de Portas
    # Criamos essa função para poder chamá-la duas vezes (Tentativa 1 e Repescagem)
    # ==========================================
    async def buscar_dados_no_spotify(access_token: str):
        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            resp_me = await client.get("https://api.spotify.com/v1/me", headers=headers)
            resp_me.raise_for_status()
            
            resp_seguindo = await client.get("https://api.spotify.com/v1/me/following?type=artist", headers=headers)
            resp_seguindo.raise_for_status()
            
            resp_playlists = await client.get("https://api.spotify.com/v1/me/playlists", headers=headers)
            resp_playlists.raise_for_status()
            
            return resp_me.json(), resp_seguindo.json(), resp_playlists.json()


    # ==========================================
    # 🎧 TENTATIVA 1 (Pode dar erro 401)
    # ==========================================
    try:
        dados_me, dados_seguindo, dados_playlists = await buscar_dados_no_spotify(token)
    
    except httpx.HTTPStatusError as e:
        # Se for erro 401 (Token Expirado), o Socorrista entra em ação!
        if e.response.status_code == 401:
            print("[ALERTA] Token do Spotify expirado! (Erro 401). Iniciando Socorrista...")
            
            try:
                # 1. Pede um token novo
                novos_tokens = await spotify_service_engine.atualizar_token(
                    refresh_token=usuario.refresh_token,
                    client_id=settings.SPOTIFY_CLIENT_ID,
                    client_secret=settings.SPOTIFY_CLIENT_SECRET
                )
                
                # 2. Salva a chave nova no banco
                usuario.access_token = novos_tokens["access_token"]
                if "refresh_token" in novos_tokens:
                    usuario.refresh_token = novos_tokens["refresh_token"]
                
                db.commit()
                db.refresh(usuario)
                print("[SUCESSO] Chave Mestra renovada e salva!")

                # 3. TENTATIVA 2 (A Repescagem com o token novo!)
                dados_me, dados_seguindo, dados_playlists = await buscar_dados_no_spotify(usuario.access_token)

            except Exception as erro_renovacao:
                print(f"[ERRO CRÍTICO] O Socorrista falhou. O usuário revogou acesso? {erro_renovacao}")
                raise HTTPException(status_code=401, detail="Sessão revogada. Faça login pelo Spotify.")
        else:
            # Se for outro erro bizarro do Spotify (500, etc)
            raise HTTPException(status_code=e.response.status_code, detail="Erro ao buscar dados no Spotify")

    # ==========================================
    # 🧠 TRATAMENTO DOS DADOS (O filtro do Python)
    # ==========================================
    # Se chegou aqui (seja na Tentativa 1 ou 2), os dados estão prontos!
    
    foto_url = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    if dados_me.get("images") and len(dados_me["images"]) > 0:
        foto_url = dados_me["images"][0]["url"]

    tipo_conta = "PREMIUM" if dados_me.get("product") == "premium" else "FREE"

    pacote_resumo = {
        "dono_da_conta": dados_me.get("display_name"),
        "foto_perfil": foto_url,
        "tipo_conta": tipo_conta,
        "seguidores": dados_me.get("followers", {}).get("total", 0),
        "seguindo": dados_seguindo.get("artists", {}).get("total", 0),
        "total_playlists": dados_playlists.get("total", 0)
    }
    
    print("[SUCESSO] Pacote de Resumo montado! Enviando para o Angular...")
    return pacote_resumo


# A Rota top-mensal continua intocada aqui embaixo...
@router.get("/top-mensal/{email}")
async def obter_top_mensal(email: str, db: Session = Depends(get_db)):
    usuario_real = db.query(User).filter(User.email == email).first()
    if not usuario_real:
        raise HTTPException(status_code=404, detail="Usuário não encontrado no banco.")

    user_id_dinamico = usuario_real.id

    top_tracks = db.query(
        MonthlyHistory.spotify_track_id,
        func.count(MonthlyHistory.id).label('play_count'),
        TrackCache.name,
        TrackCache.artist_name,
        TrackCache.album_cover_url
    ).join(
        TrackCache, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
    ).filter(
        MonthlyHistory.user_id == user_id_dinamico
    ).group_by(
        MonthlyHistory.spotify_track_id,
        TrackCache.name,
        TrackCache.artist_name,
        TrackCache.album_cover_url
    ).order_by(
        desc('play_count')
    ).limit(10).all()

    if not top_tracks:
        return {"mensagem": "O robô ainda está mapeando sua vibe!", "dados": []}

    resultado_formatado = []
    for posicao, track in enumerate(top_tracks, start=1):
        resultado_formatado.append({
            "rank": posicao,
            "id": track.spotify_track_id,
            "nome": track.name,
            "artista": track.artist_name,
            "capa_url": track.album_cover_url,
            "total_plays": track.play_count
        })

    return {"dados": resultado_formatado}