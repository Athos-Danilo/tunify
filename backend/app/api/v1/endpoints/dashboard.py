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

    hoje = datetime.datetime.now(datetime.timezone.utc)
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
# 4) Devolve os Top 10 mastigadinhos pro Angular (AGORA COM FAIXAS ÚNICAS)!
# --------------------------------------------------------------------------- #
@router.get("/top_artistas/{email}")
async def obter_top_artistas(email: str, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # 1. Definir o início do mês atual (Com fuso horário para não dar bug no Postgres!)
    hoje = datetime.datetime.now(datetime.timezone.utc)
    primeiro_dia_atual = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    mes_atual_str = f"{hoje.year}-{hoje.month:02d}"

    # 2. A MÁGICA DO TEMPO REAL: Calcula o Top 10 agora lendo a tabela quente
    ranking_atual = db.query(
        TrackCache.artist_name.label('artist_name'),
        func.sum(TrackCache.duration_ms).label('tempo_total_ms'),
        func.max(TrackCache.album_cover_url).label('capa_url'),
        # ✨ A NOVA MÁGICA AQUI: Conta quantas músicas únicas geraram esse tempo!
        func.count(func.distinct(MonthlyHistory.spotify_track_id)).label('musicas_unicas')
    ).join(
        MonthlyHistory, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
    ).filter(
        MonthlyHistory.user_id == usuario.id,
        MonthlyHistory.played_at >= primeiro_dia_atual
    ).group_by(
        TrackCache.artist_name
    ).order_by(
        desc('tempo_total_ms')
    ).limit(10).all()

    # 3. BUSCAR O MÊS PASSADO: Olha o álbum de fotos para a comparação
    ultimo_fechamento = db.query(MonthlyTopArtist.mes_referencia)\
                          .filter(MonthlyTopArtist.user_id == usuario.id)\
                          .order_by(desc(MonthlyTopArtist.mes_referencia))\
                          .first()
    
    mapa_anterior = {}
    if ultimo_fechamento:
        mes_passado = ultimo_fechamento[0]
        top_anterior = db.query(MonthlyTopArtist).filter(
            MonthlyTopArtist.user_id == usuario.id,
            MonthlyTopArtist.mes_referencia == mes_passado
        ).all()
        # Cria um dicionário rápido: { "The Weeknd": 1, "Drake": 2 }
        mapa_anterior = {artista.artist_name: artista.rank_position for artista in top_anterior}

    # 4. MONTAR A VITRINE DO FRONTEND
    resultado_formatado = []
    for rank_atual, artista in enumerate(ranking_atual, start=1):
        status_rank = "new"
        posicoes_mudadas = 0
        nome_artista = artista.artist_name
        minutos_ouvidos = int(artista.tempo_total_ms / 60000)

        # Se o artista já estava no top 15 do mês passado...
        if nome_artista in mapa_anterior:
            rank_antigo = mapa_anterior[nome_artista]
            
            if rank_atual < rank_antigo:
                status_rank = "up"
                posicoes_mudadas = rank_antigo - rank_atual # Ex: era 5, virou 2 (Subiu 3)
            elif rank_atual > rank_antigo:
                status_rank = "down"
                posicoes_mudadas = rank_atual - rank_antigo # Ex: era 1, virou 3 (Caiu 2)
            else:
                status_rank = "same"
        
        resultado_formatado.append({
            "rank": rank_atual,
            "nome": nome_artista,
            "capa_url": artista.capa_url,
            "minutos": minutos_ouvidos,
            "musicas_diferentes": artista.musicas_unicas, # ✨ NOSSO NOVO DADO ENTRANDO AQUI
            "status": status_rank,
            "posicoes_mudadas": posicoes_mudadas
        })

    return {
        "mes_referencia": mes_atual_str,
        "dados": resultado_formatado
    }