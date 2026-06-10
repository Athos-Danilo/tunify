import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

# O 'func' do SQLAlchemy para fazer as somas matemáticas direto no banco!
from sqlalchemy import func

# Configuração básica de log para vermos os robôs trabalhando no terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Tunify-Robots")

# Instância do nosso Agendador Assíncrono (Ele não trava o FastAPI!)
scheduler = AsyncIOScheduler()

from app.models.track import TrackCache
from app.models.artist import ArtistCache # 🚨 REATIVADO: Importando a tabela de artistas
import asyncio
import time 
import datetime
from app.core.database import SessionLocal 
from app.models.user import User
from app.models.history import MonthlyHistory, TopTwoHundred, MinutesListened, MonthlyTopArtist
from app.services.spotify_service import SpotifyService
from app.services.genius_service import GeniusService # 🚨 NOVO: O carteiro do Genius
from app.core.config import settings

# ======> Robô 1: O Rastreador Diário (O Olheiro)
# 1) Roda a cada 100 minutos.
# 2) Salva as músicas e "planta a semente" dos artistas novos na tabela ArtistCache.
# -------------------------------------------------------------------------------------- #
async def robo_rastreador_hourly():
    logger.info("🤖 [RASTREADOR] Acordando para buscar novas músicas...")
    
    db = SessionLocal()
    spotify = SpotifyService()
    
    try:
        # 🚨 A BLINDAGEM DA AUTO-CURA
        usuarios_ativos = []
        for tentativa_db in range(3):
            try:
                usuarios_ativos = db.query(User).filter(User.refresh_token.isnot(None)).all()
                break 
            except Exception as db_error:
                if tentativa_db < 2:
                    logger.warning(f"⚠️ [RASTREADOR] Neon dormindo. Tentativa {tentativa_db + 1}/3...")
                    await asyncio.sleep(5) 
                else:
                    logger.error(f"❌ [RASTREADOR] Banco não acordou: {db_error}")
                    return

        for user in usuarios_ativos:
            try:
                ultima_musica = db.query(MonthlyHistory).filter(MonthlyHistory.user_id == user.id)\
                                      .order_by(MonthlyHistory.played_at.desc()).first()
                
                after_ts = int(ultima_musica.played_at.timestamp() * 1000) if ultima_musica else None
                faixas_recentes = []

                for tentativa in range(2):
                    try:
                        faixas_recentes = await spotify.get_recently_played(user.access_token, after_timestamp=after_ts)
                        break 
                    except ValueError as e:
                        if str(e) == "TOKEN_EXPIRADO" and tentativa == 0:
                            logger.warning(f"⚠️ [RASTREADOR] Renovando token do {user.display_name}...")
                            novos_tokens = await spotify.atualizar_token(
                                user.refresh_token, 
                                settings.SPOTIFY_CLIENT_ID, 
                                settings.SPOTIFY_CLIENT_SECRET
                            )
                            user.access_token = novos_tokens['access_token']
                            if 'refresh_token' in novos_tokens:
                                user.refresh_token = novos_tokens['refresh_token']
                            db.commit()
                        else:
                            raise e

                # 4. Processamento das músicas e sementes de artistas
                musicas_adicionadas_agora = set()
                artistas_adicionados_agora = set() # 🚨 A NOSSA NOVA TRAVA DE SEGURANÇA
                
                for item in faixas_recentes:
                    track_data = item['track']
                    track_id = track_data['id']
                    
                    # 🚨 [PLANTANDO SEMENTES] Verifica cada artista da música
                    for art_item in track_data.get('artists', []):
                        artista_id = art_item.get('id')
                        
                        # Só processa se tiver ID e se a gente JÁ NÃO TIVER botado no carrinho agora mesmo
                        if artista_id and artista_id not in artistas_adicionados_agora:
                            
                            # Verifica se já existe no banco (de rodadas anteriores)
                            artista_existe = db.query(ArtistCache).filter(ArtistCache.spotify_id == artista_id).first()
                            
                            if not artista_existe:
                                novo_artista_vazio = ArtistCache(
                                    spotify_id=artista_id,
                                    name=art_item['name'],
                                    profile_image_url=None
                                )
                                db.add(novo_artista_vazio)
                                # 🚨 Salva na memória curta pra não repetir na próxima música da fila!
                                artistas_adicionados_agora.add(artista_id) 
                                logger.info(f"🌱 [SEMENTE] Novo artista detectado: {art_item['name']}")

                    # Cache da Música (continua igual...)
                    musica_no_cache = db.query(TrackCache).filter(TrackCache.spotify_id == track_id).first()
                    if not musica_no_cache and track_id not in musicas_adicionadas_agora:
                        nomes_artistas = ", ".join([artista['name'] for artista in track_data['artists']])
                        capa_url = track_data['album']['images'][0]['url'] if track_data['album']['images'] else None
                        
                        novo_cache = TrackCache(
                            spotify_id=track_id,
                            name=track_data['name'],
                            artist_name=nomes_artistas,
                            album_cover_url=capa_url,
                            duration_ms=track_data.get('duration_ms', 0)
                        )
                        db.add(novo_cache)
                        musicas_adicionadas_agora.add(track_id) 
                        logger.info(f"📦 [CACHE] Música catalogada: {track_data['name']}")
                    
                    # Histórico (continua igual...)
                    played_at = datetime.datetime.fromisoformat(item['played_at'].replace('Z', '+00:00'))
                    novo_historico = MonthlyHistory(
                        user_id=user.id,
                        spotify_track_id=track_id,
                        played_at=played_at
                    )
                    db.add(novo_historico)

                db.commit()
                
                # 🚨 ADICIONADO: Esvazia a memória RAM do SQLAlchemy após salvar as coisas deste usuário.
                # Isso impede o acúmulo de objetos na memória durante o 'sleep' de 35 segundos abaixo.
                db.expunge_all()

                if faixas_recentes:
                    logger.info(f"✅ [RASTREADOR] +{len(faixas_recentes)} faixas salvas para {user.display_name}")

            except Exception as ex:
                logger.error(f"❌ [RASTREADOR] Erro no usuário {user.display_name}: {ex}")
                db.rollback() 

            await asyncio.sleep(35) 
    finally:
        db.close()
        logger.info("🤖 [RASTREADOR] Ciclo finalizado.")


# ======> Robô 2: O Agregador Mensal (O Rollup)
# -------------------------------------------------------------------------------------- #
async def robo_agregador_mensal():
    logger.info("🧹 [AGREGADOR] Iniciando a faxina mensal...")
    db = SessionLocal()
    
    try:
        hoje = datetime.datetime.now(datetime.timezone.utc)
        primeiro_dia_atual = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        if hoje.month == 1:
            mes_ref = f"{hoje.year - 1}-12"
        else:
            mes_ref = f"{hoje.year}-{hoje.month - 1:02d}"

        somas_por_usuario = db.query(
            MonthlyHistory.user_id,
            func.sum(TrackCache.duration_ms).label('total_ms'),
            func.count(func.distinct(TrackCache.artist_name)).label('total_artistas') 
        ).join(
            TrackCache, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
        ).filter(
            MonthlyHistory.played_at < primeiro_dia_atual
        ).group_by(
            MonthlyHistory.user_id
        ).all()

        for user_id, total_ms, total_artistas in somas_por_usuario:
            minutos_totais = int(total_ms / 60000)
            novo_fechamento = MinutesListened(
                user_id=user_id,
                mes_referencia=mes_ref,
                total_minutes=minutos_totais,
                total_unique_artists=total_artistas 
            )
            db.add(novo_fechamento)

        usuarios_com_historico = db.query(MonthlyHistory.user_id).filter(
            MonthlyHistory.played_at < primeiro_dia_atual
        ).distinct().all()

        for (u_id,) in usuarios_com_historico:
            # Top 200 Músicas
            ranking_musicas = db.query(
                MonthlyHistory.spotify_track_id,
                func.count(MonthlyHistory.id).label('play_count')
            ).filter(
                MonthlyHistory.user_id == u_id,
                MonthlyHistory.played_at < primeiro_dia_atual
            ).group_by(MonthlyHistory.spotify_track_id).order_by(func.count(MonthlyHistory.id).desc()).limit(200).all()

            for rank, (track_id, play_count) in enumerate(ranking_musicas, start=1):
                db.add(TopTwoHundred(user_id=u_id, mes_referencia=mes_ref, spotify_track_id=track_id, play_count=play_count, rank_position=rank))

            # Top 15 Artistas (Usando capa do álbum como backup caso a foto do Genius falhe)
            ranking_artistas = db.query(
                TrackCache.artist_name,
                func.sum(TrackCache.duration_ms).label('tempo_total_ms'),
                func.max(TrackCache.album_cover_url).label('capa_album_exemplo')
            ).join(
                MonthlyHistory, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
            ).filter(
                MonthlyHistory.user_id == u_id, MonthlyHistory.played_at < primeiro_dia_atual
            ).group_by(TrackCache.artist_name).order_by(func.sum(TrackCache.duration_ms).desc()).limit(15).all()

            for rank_artista, (artist_name, tempo_total_ms, capa_url) in enumerate(ranking_artistas, start=1):
                db.add(MonthlyTopArtist(
                    user_id=u_id, mes_referencia=mes_ref, artist_spotify_id=artist_name,
                    artist_name=artist_name, artist_image_url=capa_url, 
                    minutes_listened=int(tempo_total_ms / 60000), rank_position=rank_artista
                ))

        db.query(MonthlyHistory).filter(MonthlyHistory.played_at < primeiro_dia_atual).delete()
        db.commit()
        logger.info("✅ [AGREGADOR] Faxina concluída!")

    except Exception as e:
        logger.error(f"❌ [AGREGADOR] Erro: {e}")
        db.rollback()
    finally:
        db.close()


# 🚨 [NOVO] Robô 3: O Faxineiro de Artistas (A Fila do Genius)
# 1) Roda todo dia às 04:00 da manhã.
# 2) Pega quem está sem foto OU com foto vencida (> 15 dias).
# 3) Processa em fila lenta para o Genius não bloquear.
# -------------------------------------------------------------------------------------- #
async def robo_faxineiro_artistas():
    logger.info("🧹 [FAXINEIRO] Iniciando manutenção de fotos via Genius...")
    db = SessionLocal()
    genius = GeniusService()

    try:
        # Data limite para considerar foto "velha"
        limite_vencimento = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=15)

        # Busca a FILA: artistas sem foto OU com foto desatualizada
        # 🚨 MODIFICADO: Trocamos o .all() por .limit(100).all() para proteger a memória RAM de um pico massivo.
        fila_artistas = db.query(ArtistCache).filter(
            (ArtistCache.profile_image_url.is_(None)) | (ArtistCache.last_updated_at < limite_vencimento)
        ).limit(100).all()

        if not fila_artistas:
            logger.info("✅ [FAXINEIRO] Tudo limpo! Nenhuma foto para atualizar.")
            return

        logger.info(f"🔄 [FAXINEIRO] Fila de trabalho montada: {len(fila_artistas)} artistas.")

        for artista in fila_artistas:
            try:
                # Busca no Genius pelo nome do artista
                nova_foto = await genius.buscar_foto_artista(artista.name)

                if nova_foto:
                    artista.profile_image_url = nova_foto
                    db.commit()
                    logger.info(f"✨ [FAXINEIRO] Foto atualizada: {artista.name}")
                else:
                    logger.warning(f"⚠️ [FAXINEIRO] Foto não encontrada para {artista.name}.")

            except Exception as e:
                logger.error(f"❌ [FAXINEIRO] Falha no artista {artista.name}: {e}")
                db.rollback()

            # 🚨 ADICIONADO: Desanexa o objeto processado da sessão atual do banco.
            # Evita o vazamento de memória enquanto o robô tira o seu cochilo de 1.5 segundos.
            db.expunge_all()

            # 🚨 O respiro do robô (1.5s entre cada artista para evitar bloqueios)
            await asyncio.sleep(1.5)

    except Exception as e:
        logger.error(f"❌ [FAXINEIRO] Erro crítico na faxina: {e}")
    finally:
        db.close()
        logger.info("🎉 [FAXINEIRO] Turno de madrugada encerrado.")


# ======> Função de Ignição
# -------------------------------------------------------------------------------------- #
def iniciar_robos():
    # Robô 1: De 100 em 100 min (Rastreador + Olheiro)
    scheduler.add_job(
        robo_rastreador_hourly,
        trigger=IntervalTrigger(minutes=100),
        id="rastreador_spotify",
        name="Busca histórico e planta sementes",
        replace_existing=True
    )

    # Robô 2: Todo dia 1º (Calcula as métricas)
    scheduler.add_job(
        robo_agregador_mensal,
        trigger=CronTrigger(day=1, hour=3, minute=0),
        id="agregador_mensal",
        name="Consolida dados mensais",
        replace_existing=True
    )

    # 🚨 Robô 3: Todo dia às 4 da manhã (Faxineiro do Genius)
    scheduler.add_job(
        robo_faxineiro_artistas,
        trigger=CronTrigger(hour=4, minute=0),
        id="faxineiro_artistas",
        name="Atualiza fotos de artistas via Genius",
        replace_existing=True
    )

    scheduler.start()
    logger.info("Central de Robôs do Tunify iniciada com Integração Genius! 🚀")