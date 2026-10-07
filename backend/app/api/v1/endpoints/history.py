from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime, timezone, timedelta
import dateutil.parser

from app.core.database import get_db
from app.models.user import User
from app.models.history import MonthlyHistory, MonthlyTopTrack, TopTwoHundred, MinutesListened, MonthlyTopArtist
from app.models.track import TrackCache
from app.models.artist import ArtistCache

router = APIRouter()

@router.get("/recent/{email}")
async def get_recent_history(email: str, db: Session = Depends(get_db)):
    """
    Retorna o histórico recente armazenado no banco para o usuário.
    Traz os dados hidratados (completos) do TrackCache e o último timestamp salvo.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # [CINTO DE SEGURANÇA] Calculamos o limite do mês atual no Brasil (UTC-3)
    # para garantir que, caso haja sujeira no banco, o frontend nunca as receba.
    agora_utc = datetime.now(timezone.utc)
    agora_br = agora_utc - timedelta(hours=3)
    primeiro_dia_br = agora_br.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    corte_mes_utc = primeiro_dia_br + timedelta(hours=3)

    # Busca os registros do banco (limitando a 2000 para segurança de memória)
    history_records = db.query(MonthlyHistory).filter(
        MonthlyHistory.user_id == user.id,
        MonthlyHistory.played_at >= corte_mes_utc
    ).order_by(desc(MonthlyHistory.played_at)).limit(2000).all()

    response_items = []
    last_played_at_ms = 0

    if history_records:
        # A primeira linha é a reprodução mais recente do banco de dados (maior played_at)
        last_played = history_records[0].played_at
        last_played_at_ms = int(last_played.timestamp() * 1000)

        # Hidrata os dados juntando com a tabela de Cache de Tracks
        for record in history_records:
            track = db.query(TrackCache).filter(TrackCache.spotify_id == record.spotify_track_id).first()
            if track:
                response_items.append({
                    "nome": track.name,
                    "artistas": track.artist_name,
                    "imagem": track.album_cover_url,
                    "album": track.album_name or "-",
                    "generos": ", ".join(track.genres) if track.genres else "-",
                    "tocadaEm": record.played_at.isoformat(),
                    "duracaoMs": track.duration_ms,
                    "source": "db"
                })

    return {
        "last_played_at_ms": last_played_at_ms,
        "items": response_items
    }

@router.post("/recent/{email}")
async def save_recent_delta(email: str, data: dict = Body(...), db: Session = Depends(get_db)):
    """
    Recebe um array de faixas recém ouvidas pelo usuário (Delta) e salva no banco.
    Assim adiantamos o trabalho do robô e mantemos o banco 100% sincronizado.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    items = data.get("items", [])
    if not items:
        return {"status": "empty"}

    added_count = 0
    added_tracks_in_session = set()
    
    for item in items:
        try:
            track_data = item.get("track", {})
            if not track_data:
                continue

            spotify_id = track_data.get("id")
            played_at_str = item.get("played_at")
            if not spotify_id or not played_at_str:
                continue

            # Parsing seguro da data UTC ISO8601
            played_at_dt = dateutil.parser.isoparse(played_at_str)

            # Verifica se já não existe no banco para evitar duplicidade
            exists = db.query(MonthlyHistory).filter(
                MonthlyHistory.user_id == user.id,
                MonthlyHistory.spotify_track_id == spotify_id,
                MonthlyHistory.played_at == played_at_dt
            ).first()

            if not exists:
                # Cria a entrada no histórico
                new_history = MonthlyHistory(
                    user_id=user.id,
                    spotify_track_id=spotify_id,
                    played_at=played_at_dt
                )
                db.add(new_history)
                
                # Salva no TrackCache se não existir no DB e ainda não tiver sido adicionada nesta execução
                track_cache = db.query(TrackCache).filter(TrackCache.spotify_id == spotify_id).first()
                album_name = track_data.get("album", {}).get("name")
                
                if not track_cache and spotify_id not in added_tracks_in_session:
                    artists_str = ", ".join([a.get("name") for a in track_data.get("artists", [])])
                    images = track_data.get("album", {}).get("images", [])
                    img_url = images[0].get("url") if images else None

                    new_track = TrackCache(
                        spotify_id=spotify_id,
                        name=track_data.get("name"),
                        artist_name=artists_str,
                        album_name=album_name,
                        album_cover_url=img_url,
                        duration_ms=track_data.get("duration_ms", 0),
                        popularity=track_data.get("popularity", 0)
                    )
                    db.add(new_track)
                    added_tracks_in_session.add(spotify_id)
                elif track_cache and track_cache.album_name is None and album_name:
                    # 🌿 CRESCIMENTO ORGÂNICO no envio Delta pelo Frontend
                    track_cache.album_name = album_name
                
                added_count += 1
        except Exception as e:
            print(f"[ERROR] Falha ao salvar música Delta: {e}")
            pass

    # Efetiva todas as adições de uma vez
    db.commit()

    return {"status": "success", "added_count": added_count}


@router.get("/months/{email}")
async def get_available_months(email: str, db: Session = Depends(get_db)):
    """
    Retorna a lista de meses disponíveis no histórico do usuário.
    Fonte estrita de dados: tabela MonthlyTopTrack + mês atual.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # Mês Atual no Fuso do Brasil (UTC-3)
    agora_utc = datetime.now(timezone.utc)
    agora_br = agora_utc - timedelta(hours=3)
    mes_atual_codigo = f"{agora_br.year}-{agora_br.month:02d}"

    # Busca meses salvos ESTRITAMENTE na tabela MonthlyTopTrack
    meses_consolidados = db.query(MonthlyTopTrack.mes_referencia).filter(
        MonthlyTopTrack.user_id == user.id
    ).distinct().all()

    meses_set = {m[0] for m in meses_consolidados if m[0]}
    meses_set.add(mes_atual_codigo)

    NOMES_MESES = {
        1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril",
        5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto",
        9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro"
    }

    meses_ordenados = sorted(list(meses_set), reverse=True)

    resultado = []
    for cod in meses_ordenados:
        try:
            ano, mes = map(int, cod.split("-"))
            nome_mes = NOMES_MESES.get(mes, f"Mês {mes}")
            is_atual = (cod == mes_atual_codigo)
            label = f"{nome_mes} {ano}" + (" (Atual)" if is_atual else "")
            resultado.append({
                "codigo": cod,
                "label": label,
                "nome_mes": nome_mes,
                "ano": ano,
                "is_atual": is_atual
            })
        except Exception:
            resultado.append({
                "codigo": cod,
                "label": cod,
                "is_atual": (cod == mes_atual_codigo)
            })

    return resultado


@router.get("/top-tracks/{email}")
async def get_monthly_top_tracks(email: str, mes: str = None, db: Session = Depends(get_db)):
    """
    Retorna o Top 10 de músicas mais ouvidas de um mês específico.
    Se 'mes' for omitido ou for o mês atual, calcula em tempo real com tendência.
    Se 'mes' for um mês passado, busca ESTRITAMENTE da tabela MonthlyTopTrack.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    agora_utc = datetime.now(timezone.utc)
    agora_br = agora_utc - timedelta(hours=3)
    mes_atual_codigo = f"{agora_br.year}-{agora_br.month:02d}"

    mes_solicitado = mes if mes else mes_atual_codigo
    is_mes_atual = (mes_solicitado == mes_atual_codigo)

    if is_mes_atual:
        # Mês Atual em Tempo Real
        primeiro_dia_br = agora_br.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        corte_mes_utc = primeiro_dia_br + timedelta(hours=3)

        top_tracks_raw = db.query(
            MonthlyHistory.spotify_track_id,
            func.count(MonthlyHistory.id).label('play_count'),
            TrackCache.name,
            TrackCache.artist_name,
            TrackCache.album_cover_url,
            TrackCache.duration_ms,
            TrackCache.album_name
        ).join(
            TrackCache, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
        ).filter(
            MonthlyHistory.user_id == user.id,
            MonthlyHistory.played_at >= corte_mes_utc
        ).group_by(
            MonthlyHistory.spotify_track_id,
            TrackCache.name,
            TrackCache.artist_name,
            TrackCache.album_cover_url,
            TrackCache.duration_ms,
            TrackCache.album_name
        ).order_by(
            desc('play_count')
        ).limit(10).all()

        ano, m = map(int, mes_atual_codigo.split("-"))
        mes_ant_ano = ano if m > 1 else ano - 1
        mes_ant_m = m - 1 if m > 1 else 12
        mes_anterior_codigo = f"{mes_ant_ano}-{mes_ant_m:02d}"

        mapa_tendencias = {}
        top_anterior = db.query(MonthlyTopTrack).filter(
            MonthlyTopTrack.user_id == user.id,
            MonthlyTopTrack.mes_referencia == mes_anterior_codigo
        ).all()

        for track in top_anterior:
            mapa_tendencias[track.spotify_track_id] = track.rank_position

        dados_formatados = []
        for rank, item in enumerate(top_tracks_raw, start=1):
            tendencia = 'nova'
            valor_tendencia = 0

            if item.spotify_track_id in mapa_tendencias:
                pos_ant = mapa_tendencias[item.spotify_track_id]
                diff = pos_ant - rank
                if diff > 0:
                    tendencia = 'sobe'
                    valor_tendencia = diff
                elif diff < 0:
                    tendencia = 'desce'
                    valor_tendencia = abs(diff)
                else:
                    tendencia = 'estavel'
                    valor_tendencia = 0

            dados_formatados.append({
                "rank": rank,
                "id": item.spotify_track_id,
                "nome": item.name,
                "artista": item.artist_name,
                "capa_url": item.album_cover_url,
                "album": item.album_name,
                "total_plays": item.play_count,
                "duracaoMs": item.duration_ms,
                "tendencia": tendencia,
                "valorTendencia": valor_tendencia
            })

        resultado = {
            "mes_referencia": mes_solicitado,
            "is_atual": True,
            "dados": dados_formatados
        }
    else:
        # Mês Passado Consolidado - ESTRITAMENTE da tabela MonthlyTopTrack
        top_consolidado = db.query(
            MonthlyTopTrack.rank_position,
            MonthlyTopTrack.play_count,
            MonthlyTopTrack.spotify_track_id,
            TrackCache.name,
            TrackCache.artist_name,
            TrackCache.album_cover_url,
            TrackCache.duration_ms,
            TrackCache.album_name
        ).join(
            TrackCache, MonthlyTopTrack.spotify_track_id == TrackCache.spotify_id
        ).filter(
            MonthlyTopTrack.user_id == user.id,
            MonthlyTopTrack.mes_referencia == mes_solicitado
        ).order_by(
            MonthlyTopTrack.rank_position
        ).all()

        ano, m = map(int, mes_solicitado.split("-"))
        mes_ant_ano = ano if m > 1 else ano - 1
        mes_ant_m = m - 1 if m > 1 else 12
        mes_anterior_codigo = f"{mes_ant_ano}-{mes_ant_m:02d}"

        mapa_tendencias = {}
        top_anterior = db.query(MonthlyTopTrack).filter(
            MonthlyTopTrack.user_id == user.id,
            MonthlyTopTrack.mes_referencia == mes_anterior_codigo
        ).all()

        for track in top_anterior:
            mapa_tendencias[track.spotify_track_id] = track.rank_position

        dados_formatados = []
        for item in top_consolidado:
            rank = item.rank_position
            tendencia = 'nova'
            valor_tendencia = 0

            if item.spotify_track_id in mapa_tendencias:
                pos_ant = mapa_tendencias[item.spotify_track_id]
                diff = pos_ant - rank
                if diff > 0:
                    tendencia = 'sobe'
                    valor_tendencia = diff
                elif diff < 0:
                    tendencia = 'desce'
                    valor_tendencia = abs(diff)
                else:
                    tendencia = 'estavel'
                    valor_tendencia = 0

            dados_formatados.append({
                "rank": rank,
                "id": item.spotify_track_id,
                "nome": item.name,
                "artista": item.artist_name,
                "capa_url": item.album_cover_url,
                "album": item.album_name,
                "total_plays": item.play_count,
                "duracaoMs": item.duration_ms,
                "tendencia": tendencia,
                "valorTendencia": valor_tendencia
            })

        resultado = {
            "mes_referencia": mes_solicitado,
            "is_atual": False,
            "dados": dados_formatados
        }

    return resultado

@router.get("/top-artists/{email}")
async def get_monthly_top_artists(email: str, mes: str = None, db: Session = Depends(get_db)):
    """
    Retorna o Top 15 de artistas mais ouvidos de um mês específico.
    Se 'mes' for omitido ou for o mês atual, calcula em tempo real com tendência.
    Se 'mes' for um mês passado, busca da tabela MonthlyTopArtist.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    agora_utc = datetime.now(timezone.utc)
    agora_br = agora_utc - timedelta(hours=3)
    mes_atual_codigo = f"{agora_br.year}-{agora_br.month:02d}"

    mes_solicitado = mes if mes else mes_atual_codigo
    is_mes_atual = (mes_solicitado == mes_atual_codigo)

    if is_mes_atual:
        # Mês Atual em Tempo Real
        primeiro_dia_br = agora_br.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        corte_mes_utc = primeiro_dia_br + timedelta(hours=3)

        top_artists_raw = db.query(
            TrackCache.artist_name,
            func.sum(TrackCache.duration_ms).label('tempo_total_ms'),
            func.max(TrackCache.album_cover_url).label('capa_album_exemplo')
        ).join(
            MonthlyHistory, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
        ).filter(
            MonthlyHistory.user_id == user.id,
            MonthlyHistory.played_at >= corte_mes_utc
        ).group_by(
            TrackCache.artist_name
        ).order_by(
            desc('tempo_total_ms')
        ).limit(15).all()

        ano, m = map(int, mes_atual_codigo.split("-"))
        mes_ant_ano = ano if m > 1 else ano - 1
        mes_ant_m = m - 1 if m > 1 else 12
        mes_anterior_codigo = f"{mes_ant_ano}-{mes_ant_m:02d}"

        mapa_tendencias = {}
        top_anterior = db.query(MonthlyTopArtist).filter(
            MonthlyTopArtist.user_id == user.id,
            MonthlyTopArtist.mes_referencia == mes_anterior_codigo
        ).all()

        for artista in top_anterior:
            mapa_tendencias[artista.artist_name] = artista.rank_position

        dados_formatados = []
        for rank, item in enumerate(top_artists_raw, start=1):
            tendencia = 'nova'
            valor_tendencia = 0

            if item.artist_name in mapa_tendencias:
                pos_ant = mapa_tendencias[item.artist_name]
                diff = pos_ant - rank
                if diff > 0:
                    tendencia = 'sobe'
                    valor_tendencia = diff
                elif diff < 0:
                    tendencia = 'desce'
                    valor_tendencia = abs(diff)
                else:
                    tendencia = 'estavel'
                    valor_tendencia = 0
            
            # Buscar foto do artista real, se houver
            foto_oficial = db.query(ArtistCache.profile_image_url).filter(ArtistCache.name == item.artist_name).first()
            img_url = foto_oficial[0] if foto_oficial and foto_oficial[0] else item.capa_album_exemplo

            dados_formatados.append({
                "rank": rank,
                "nome": item.artist_name,
                "imagem": img_url,
                "minutos": int(item.tempo_total_ms / 60000),
                "tendencia": tendencia,
                "valorTendencia": valor_tendencia
            })

        resultado = {
            "mes_referencia": mes_solicitado,
            "is_atual": True,
            "dados": dados_formatados
        }
    else:
        # Mês Passado Consolidado
        top_consolidado = db.query(MonthlyTopArtist).filter(
            MonthlyTopArtist.user_id == user.id,
            MonthlyTopArtist.mes_referencia == mes_solicitado
        ).order_by(
            MonthlyTopArtist.rank_position
        ).all()

        ano, m = map(int, mes_solicitado.split("-"))
        mes_ant_ano = ano if m > 1 else ano - 1
        mes_ant_m = m - 1 if m > 1 else 12
        mes_anterior_codigo = f"{mes_ant_ano}-{mes_ant_m:02d}"

        mapa_tendencias = {}
        top_anterior = db.query(MonthlyTopArtist).filter(
            MonthlyTopArtist.user_id == user.id,
            MonthlyTopArtist.mes_referencia == mes_anterior_codigo
        ).all()

        for artista in top_anterior:
            mapa_tendencias[artista.artist_name] = artista.rank_position

        dados_formatados = []
        for item in top_consolidado:
            rank = item.rank_position
            tendencia = 'nova'
            valor_tendencia = 0

            if item.artist_name in mapa_tendencias:
                pos_ant = mapa_tendencias[item.artist_name]
                diff = pos_ant - rank
                if diff > 0:
                    tendencia = 'sobe'
                    valor_tendencia = diff
                elif diff < 0:
                    tendencia = 'desce'
                    valor_tendencia = abs(diff)
                else:
                    tendencia = 'estavel'
                    valor_tendencia = 0

            dados_formatados.append({
                "rank": rank,
                "nome": item.artist_name,
                "imagem": item.artist_image_url,
                "minutos": item.minutes_listened,
                "tendencia": tendencia,
                "valorTendencia": valor_tendencia
            })

        resultado = {
            "mes_referencia": mes_solicitado,
            "is_atual": False,
            "dados": dados_formatados
        }

    return resultado
