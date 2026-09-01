from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timezone, timedelta
import dateutil.parser

from app.core.database import get_db
from app.models.user import User
from app.models.history import MonthlyHistory
from app.models.track import TrackCache

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
                    "album": "-", # Poderíamos salvar o nome do álbum no cache no futuro
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
                if not track_cache and spotify_id not in added_tracks_in_session:
                    artists_str = ", ".join([a.get("name") for a in track_data.get("artists", [])])
                    images = track_data.get("album", {}).get("images", [])
                    img_url = images[0].get("url") if images else None

                    new_track = TrackCache(
                        spotify_id=spotify_id,
                        name=track_data.get("name"),
                        artist_name=artists_str,
                        album_cover_url=img_url,
                        duration_ms=track_data.get("duration_ms", 0),
                        popularity=track_data.get("popularity", 0)
                    )
                    db.add(new_track)
                    added_tracks_in_session.add(spotify_id)
                
                added_count += 1
        except Exception as e:
            print(f"[ERROR] Falha ao salvar música Delta: {e}")
            pass

    # Efetiva todas as adições de uma vez
    db.commit()

    return {"status": "success", "added_count": added_count}
