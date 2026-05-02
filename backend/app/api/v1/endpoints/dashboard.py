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
from app.models.history import MinutesListened, TopTwoHundred, MonthlyHistory, MonthlyTopArtist
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
    usuario = db.query(User).filter(User.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    hoje = datetime.datetime.now()
    primeiro_dia_atual = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    mes_atual_str = f"{hoje.year}-{hoje.month:02d}"

    # A Mágica do Tempo Real Turbinada (Soma os ms + Conta Artistas Únicos)
    resultado = db.query(
        func.sum(TrackCache.duration_ms).label('total_ms'),
        func.count(func.distinct(TrackCache.artist_name)).label('total_artistas') # 🚨 Conta os artistas aqui!
    ).join(
        MonthlyHistory, TrackCache.spotify_id == MonthlyHistory.spotify_track_id
    ).filter(
        MonthlyHistory.user_id == usuario.id,
        MonthlyHistory.played_at >= primeiro_dia_atual 
    ).first()

    total_ms = resultado.total_ms if resultado and resultado.total_ms else 0
    total_artistas = resultado.total_artistas if resultado and resultado.total_artistas else 0
    minutos_totais = int(total_ms / 60000)

    return {
        "mes_referencia": mes_atual_str,
        "total_minutos": minutos_totais,
        "total_artistas_ouvidos": total_artistas # 🚨 Manda pro Angular aqui!
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

# ======> Rota: Top Artistas (Compara o último mês com o mês anterior)
# 1) Recebe o e-mail na URL.
# 2) Descobre quais são os dois últimos fechamentos do usuário.
# 3) Calcula quem subiu, quem desceu e quem é novidade.
# 4) Devolve os Top 10 mastigadinhos pro Angular!
# --------------------------------------------------------------------------- #
@router.get("/top_artistas/{email}")
async def obter_top_artistas(email: str, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # 1. Busca os dois últimos meses que temos salvos para esse usuário
    meses_disponiveis = db.query(MonthlyTopArtist.mes_referencia)\
                          .filter(MonthlyTopArtist.user_id == usuario.id)\
                          .distinct()\
                          .order_by(desc(MonthlyTopArtist.mes_referencia))\
                          .limit(2).all()
    
    if not meses_disponiveis:
        return {"mensagem": "Nenhum histórico de artistas fechado ainda.", "dados": []}
    
    # O primeiro da lista é o mês mais recente (Ex: 2026-04)
    mes_fechado = meses_disponiveis[0][0]
    # Se ele for usuário novo, pode não ter um mês anterior
    mes_retrasado = meses_disponiveis[1][0] if len(meses_disponiveis) > 1 else None

    # 2. Pega os Top 10 do mês mais recente
    top_atual = db.query(MonthlyTopArtist).filter(
        MonthlyTopArtist.user_id == usuario.id,
        MonthlyTopArtist.mes_referencia == mes_fechado
    ).order_by(MonthlyTopArtist.rank_position).limit(10).all()

    # 3. Pega os Top 15 do mês anterior (se existir)
    top_anterior = []
    if mes_retrasado:
        top_anterior = db.query(MonthlyTopArtist).filter(
            MonthlyTopArtist.user_id == usuario.id,
            MonthlyTopArtist.mes_referencia == mes_retrasado
        ).all()

    # Cria um "Dicionário de Consulta Rápida" pro mês anterior (O(1) de performance)
    mapa_anterior = {artista.artist_spotify_id: artista.rank_position for artista in top_anterior}

    # 4. A Mágica da Matemática (Subiu, Desceu, Novo)
    resultado_formatado = []
    for artista in top_atual:
        status_rank = "new"
        posicoes_mudadas = 0

        if artista.artist_spotify_id in mapa_anterior:
            rank_antigo = mapa_anterior[artista.artist_spotify_id]
            rank_novo = artista.rank_position

            if rank_novo < rank_antigo:
                status_rank = "up"
                posicoes_mudadas = rank_antigo - rank_novo # Ex: era 5, virou 2 (subiu 3)
            elif rank_novo > rank_antigo:
                status_rank = "down"
                posicoes_mudadas = rank_novo - rank_antigo # Ex: era 1, virou 3 (caiu 2)
            else:
                status_rank = "same"
        
        resultado_formatado.append({
            "rank": artista.rank_position,
            "nome": artista.artist_name,
            "capa_url": artista.artist_image_url,
            "minutos": artista.minutes_listened,
            "status": status_rank,
            "posicoes_mudadas": posicoes_mudadas
        })

    # 5. Pega o número total de artistas ouvidos no mês
    registro_minutos = db.query(MinutesListened).filter(
        MinutesListened.user_id == usuario.id,
        MinutesListened.mes_referencia == mes_fechado
    ).first()

    total_artistas_ouvidos = registro_minutos.total_unique_artists if registro_minutos else 0

    return {
        "mes_referencia": mes_fechado,
        "total_artistas_ouvidos": total_artistas_ouvidos, # 🚨 Manda pro Angular desenhar!
        "dados": resultado_formatado
    }