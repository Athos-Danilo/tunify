# Ferramentas do FastAPI para criar rotas e injetar dependências.
from fastapi import APIRouter, Depends, HTTPException

# Gerenciador de sessão do SQLAlchemy.
from sqlalchemy.orm import Session
from sqlalchemy import desc

# Importa a função que abre a porta do banco de dados.
from app.core.database import get_db

# Importa os moldes que vamos usar para ler os dados.
from app.models.user import User
from app.models.history import MinutesListened, TopTwoHundred
from app.models.track import TrackCache

router = APIRouter()

# ======> Rota: Total de Minutos Ouvidos (Fechamento Mensal)
# 1) Recebe o e-mail na URL.
# 2) Puxa o último registro de minutos salvos pelo Robô da Faxina.
# --------------------------------------------------------------------------- #
@router.get("/minutos/{email}")
async def obter_minutos_totais(email: str, db: Session = Depends(get_db)):
    # 1. Acha o usuário pelo email
    usuario = db.query(User).filter(User.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # 2. Busca o último fechamento de minutos dele (ordenado do mais recente pro mais antigo)
    ultimo_fechamento = db.query(MinutesListened).filter(
        MinutesListened.user_id == usuario.id
    ).order_by(
        desc(MinutesListened.created_at)
    ).first()

    # Se o robô ainda não rodou no dia 1º, retornamos zero para o Angular não quebrar.
    if not ultimo_fechamento:
        return {
            "mensagem": "Fechamento ainda não realizado.",
            "mes_referencia": "N/A",
            "total_minutos": 0
        }

    return {
        "mes_referencia": ultimo_fechamento.mes_referencia,
        "total_minutos": ultimo_fechamento.total_minutes
    }


# ======> Rota: Top 200 (Ranking Consolidado)
# 1) Recebe o e-mail na URL.
# 2) Puxa o ranking consolidado e cruza com a tabela de Cache para pegar nomes e capas.
# --------------------------------------------------------------------------- #
@router.get("/top200/{email}")
async def obter_top_200(email: str, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # Fazemos um JOIN da tabela TopTwoHundred com a TrackCache para hidratar os dados
    ranking = db.query(
        TopTwoHundred.rank_position,
        TopTwoHundred.play_count,
        TrackCache.spotify_id,
        TrackCache.name,
        TrackCache.artist_name,
        TrackCache.album_cover_url
    ).join(
        TrackCache, TopTwoHundred.spotify_track_id == TrackCache.spotify_id
    ).filter(
        TopTwoHundred.user_id == usuario.id
    ).order_by(
        TopTwoHundred.rank_position
    ).all()

    if not ranking:
        return {"mensagem": "O Top 200 será gerado no dia 1º!", "dados": []}

    resultado_formatado = []
    for faixa in ranking:
        resultado_formatado.append({
            "rank": faixa.rank_position,
            "id": faixa.spotify_id,
            "nome": faixa.name,
            "artista": faixa.artist_name,
            "capa_url": faixa.album_cover_url,
            "total_plays": faixa.play_count
        })

    return {"dados": resultado_formatado}