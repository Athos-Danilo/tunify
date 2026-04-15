# Ferramentas do FastAPI para criar rotas, injetar dependências e lançar erros HTTP.
from fastapi import APIRouter, Depends, HTTPException

# Gerenciador de sessão do SQLAlchemy para realizar operações no PostgreSQL.
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

# Biblioteca para fazer requisições HTTP assíncronas.
import httpx

# Importa a função que abre e fecha a porta do banco de dados.
from app.core.database import get_db

# Importa o schema do Usuário no banco.
from app.models.user import User

# Importa o Histórico Mensal e o Cache de Músicas.
from app.models.history import MonthlyHistory
from app.models.track import TrackCache

router = APIRouter()

# ======> Buscar as Playlists do Usuário.
# 1) Recebe o e-mail na URL e procura o dono no banco de dados;
# 2) Recupera a chave mestra (Access Token) salva no banco;
# 3) Bate na porta do Spotify silenciosamente para ler as playlists;
# 4) Limpa e formata os dados brutos;
# 5) Retorna a lista pronta para o Front-end.
# --------------------------------------------------------------------------- #

# 🚨 OLHA A CORREÇÃO AQUI: Adicionamos o db nos parâmetros da função!
@router.get("/playlists/{email}")
async def get_resumo_perfil(email: str, db: Session = Depends(get_db)):
    print(f"[INFO] Requisição recebida para o resumo do perfil. E-mail: {email}")
    
    # ==========================================
    # 🕵️‍♂️ BUSCANDO O USUÁRIO NO BANCO DE DADOS
    # ==========================================
    usuario = db.query(User).filter(User.email == email).first()
    
    # Se algum hacker tentar mandar um e-mail que não existe, a gente barra!
    if not usuario:
        print("[ALERTA] Usuário não encontrado no banco!")
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # Pegamos o token que você salvou no banco
    token = usuario.access_token 
    
    print("[SUCESSO] Usuário achado no banco e Token resgatado!")

    # ==========================================
    # 🎧 FAZENDO AS CHAMADAS PARA O SPOTIFY
    # ==========================================
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient() as client:
        try:
            # 🚪 PORTA 1: Dados do Perfil (URL REAL)
            print("[INFO] Bateu na porta do Spotify (/v1/me)...")
            resp_me = await client.get("https://api.spotify.com/v1/me", headers=headers)
            resp_me.raise_for_status()
            dados_me = resp_me.json()

            # 🚪 PORTA 2: Artistas Seguidos (URL REAL)
            print("[INFO] Bateu na porta do Spotify (/v1/me/following)...")
            resp_seguindo = await client.get("https://api.spotify.com/v1/me/following?type=artist", headers=headers)
            resp_seguindo.raise_for_status()
            dados_seguindo = resp_seguindo.json()

            # 🚪 PORTA 3: Total de Playlists (URL REAL)
            print("[INFO] Bateu na porta do Spotify (/v1/me/playlists)...")
            resp_playlists = await client.get("https://api.spotify.com/v1/me/playlists", headers=headers)
            resp_playlists.raise_for_status()
            dados_playlists = resp_playlists.json()

            # ==========================================
            # 🧠 TRATAMENTO DOS DADOS (O filtro do Python)
            # ==========================================
            
            # Foto: O Spotify retorna uma lista de imagens. Pegamos a URL da primeira.
            foto_url = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            if dados_me.get("images") and len(dados_me["images"]) > 0:
                foto_url = dados_me["images"][0]["url"]

            # Tipo de Conta: A API retorna "premium" ou "free"
            tipo_conta = "PREMIUM" if dados_me.get("product") == "premium" else "FREE"

            # O Pacotão que vai pro Front-end Angular!
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

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                print("[ALERTA] Token do Spotify expirado! (Erro 401)")
                raise HTTPException(status_code=401, detail="Token expirado. Faça login novamente.")
                
            print(f"[ERRO] O Spotify recusou a conexão: {e}")
            raise HTTPException(status_code=e.response.status_code, detail="Erro ao buscar dados no Spotify")


# ======> Rota: Top 10 Mês Atual 
# 1) O Angular chama essa rota.
# 2) O banco conta os plays da Tabela Quente e junta com o Nome/Capa do Cache.
# -------------------------------------------------------------------------------------- #
@router.get("/top-mensal")
async def obter_top_mensal(
    db: Session = Depends(get_db),
    # user = Depends(get_current_user) # Descomente e ajuste de acordo com o seu sistema de Login
):
    # Para testarmos agora sem o sistema de login travar a gente, 
    # vamos forçar o ID do seu usuário temporariamente (troque pelo ID do seu banco, provavelmente 1)
    meu_user_id = 1 

    # A Mágica do SQL (JOIN + COUNT + GROUP BY)
    top_tracks = db.query(
        MonthlyHistory.spotify_track_id,
        func.count(MonthlyHistory.id).label('play_count'), # Conta quantas vezes repetiu
        TrackCache.name,
        TrackCache.artist_name,
        TrackCache.album_cover_url
    ).join(
        TrackCache, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
    ).filter(
        MonthlyHistory.user_id == meu_user_id # Filtra só as SUAS músicas
    ).group_by(
        MonthlyHistory.spotify_track_id,
        TrackCache.name,
        TrackCache.artist_name,
        TrackCache.album_cover_url
    ).order_by(
        desc('play_count') # Ordena da mais ouvida para a menos ouvida
    ).limit(10).all() # Pega apenas o Top 10!

    # Se o usuário for novo e o robô ainda não pegou nada (Cold Start)
    if not top_tracks:
        return {"mensagem": "O robô ainda está mapeando sua vibe!", "dados": []}

    # Formata a resposta para o Angular ler facilmente
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