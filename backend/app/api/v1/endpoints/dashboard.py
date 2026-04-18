# Ferramentas do FastAPI para criar rotas e injetar dependências.
from fastapi import APIRouter, Depends, HTTPException

# Gerenciador de sessão do SQLAlchemy.
from sqlalchemy.orm import Session
from sqlalchemy import desc
from sqlalchemy import func

# Importa a função que abre a porta do banco de dados.
from app.core.database import get_db

# Importa os moldes que vamos usar para ler os dados.
from app.models.user import User
from app.models.history import MinutesListened, TopTwoHundred, MonthlyHistory
from app.models.track import TrackCache

import datetime
router = APIRouter()

# ======> Rota: Total de Minutos Ouvidos (TEMPO REAL DO MÊS ATUAL)
# 1) Recebe o e-mail na URL.
# 2) Pega o primeiro dia do mês atual.
# 3) Soma a duração de todas as músicas na Tabela Quente neste período.
# --------------------------------------------------------------------------- #
@router.get("/minutos/{email}")
async def obter_minutos_totais(email: str, db: Session = Depends(get_db)):
    # 1. Acha o usuário pelo email
    usuario = db.query(User).filter(User.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # 2. Descobre qual é o mês atual e o primeiro dia dele
    hoje = datetime.datetime.now()
    primeiro_dia_atual = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    mes_atual_str = f"{hoje.year}-{hoje.month:02d}" # Ex: "2026-04"

    # 3. A Mágica do Tempo Real (Soma a tabela Quente + Cache)
    resultado = db.query(
        func.sum(TrackCache.duration_ms).label('total_ms')
    ).join(
        MonthlyHistory, TrackCache.spotify_id == MonthlyHistory.spotify_track_id
    ).filter(
        MonthlyHistory.user_id == usuario.id,
        MonthlyHistory.played_at >= primeiro_dia_atual # 🚨 Só pega as músicas deste mês!
    ).first()

    # 4. Tratamento do resultado
    # Se o resultado vier vazio (None), quer dizer que o usuário não ouviu nada esse mês ainda.
    total_ms = resultado.total_ms if resultado and resultado.total_ms else 0
    minutos_totais = int(total_ms / 60000)

    # 5. Devolvemos no mesmo formato que o Angular já está esperando!
    return {
        "mes_referencia": mes_atual_str,
        "total_minutos": minutos_totais
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