import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

# O 'func' do SQLAlchemy para fazer as somas matemáticas direto no banco!
from sqlalchemy import func

import httpx

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
    
    spotify = SpotifyService()
    
    # 🚨 A BLINDAGEM DA AUTO-CURA: Obtém os dados básicos dos usuários ativos
    usuarios_ativos = []
    for tentativa_db in range(3):
        db_inicial = SessionLocal()
        try:
            usuarios_ativos = db_inicial.query(
                User.id, 
                User.display_name, 
                User.email
            ).filter(User.refresh_token.isnot(None)).all()
            break 
        except Exception as db_error:
            if tentativa_db < 2:
                logger.warning(f"⚠️ [RASTREADOR] Neon dormindo. Tentativa {tentativa_db + 1}/3...")
                await asyncio.sleep(5) 
            else:
                logger.error(f"❌ [RASTREADOR] Banco não acordou: {db_error}")
                return
        finally:
            db_inicial.close()

    try:
        for user_id, user_display_name, user_email in usuarios_ativos:
            nome_usuario = user_display_name or user_email or "Usuário"
            
            # Abre uma nova sessão dedicada a este usuário
            db = SessionLocal()
            try:
                # Carrega a instância do usuário nesta sessão
                user = db.query(User).filter(User.id == user_id).first()
                if not user:
                    continue

                ultima_musica = db.query(MonthlyHistory).filter(MonthlyHistory.user_id == user.id)\
                                      .order_by(MonthlyHistory.played_at.desc()).first()
                
                after_ts = int(ultima_musica.played_at.timestamp() * 1000) if ultima_musica else None
                faixas_recentes = []

                for tentativa in range(2):
                    try:
                        # 🚨 Camada 1: Tentamos a busca otimizada com o cursor 'after'
                        faixas_recentes = await spotify.get_recently_played(user.access_token, after_timestamp=after_ts)
                        break 
                    except ValueError as e:
                        if str(e) == "TOKEN_EXPIRADO" and tentativa == 0:
                            logger.warning(f"⚠️ [RASTREADOR] Renovando token do {nome_usuario}...")
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
                    except httpx.HTTPStatusError as e:
                        # 🚨 Camada 2: A NOSSA CAMADA DE AUTO-CURA
                        # Se o Spotify der erro 500 porque se perdeu com o nosso cursor 'after_ts', ativamos o Fallback.
                        if e.response.status_code == 500 and after_ts is not None:
                            logger.warning(f"⚠️ [RASTREADOR] Erro 500 do Spotify para {nome_usuario}. Ativando Auto-Cura (Fallback)...")
                            # Fazemos a busca padrão geral (traz as últimas 50 sem filtro) que nunca falha com 500
                            faixas_recentes_brutas = await spotify.get_recently_played(user.access_token)
                            
                            faixas_recentes = []
                            # Filtramos manualmente no Python: mantemos apenas as músicas tocadas DEPOIS da nossa ultima_musica
                            if ultima_musica:
                                limite_data = ultima_musica.played_at
                                for item in faixas_recentes_brutas:
                                    item_played_at = datetime.datetime.fromisoformat(item['played_at'].replace('Z', '+00:00'))
                                    # Se a música do Spotify for mais recente que o último registro do banco, nós a guardamos
                                    if item_played_at > limite_data:
                                        faixas_recentes.append(item)
                            else:
                                faixas_recentes = faixas_recentes_brutas
                                
                            logger.info(f"🛡️ [AUTO-CURA] Filtro manual aplicado. Encontradas {len(faixas_recentes)} faixas novas.")
                            break
                        else:
                            # Se for outro erro ou já estávamos tentando sem o 'after_ts', repassa o erro para abortar o usuário
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

                    # Cache da Música
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
                    
                    # Histórico
                    played_at = datetime.datetime.fromisoformat(item['played_at'].replace('Z', '+00:00'))
                    novo_historico = MonthlyHistory(
                        user_id=user.id,
                        spotify_track_id=track_id,
                        played_at=played_at
                    )
                    db.add(novo_historico)

                db.commit()

                if faixas_recentes:
                    logger.info(f"✅ [RASTREADOR] +{len(faixas_recentes)} faixas salvas para {nome_usuario}")

            except Exception as ex:
                logger.error(f"❌ [RASTREADOR] Erro no usuário {nome_usuario}: {ex}")
                db.rollback() 
            finally:
                db.close() # Garante a liberação dos recursos da sessão deste usuário imediatamente

            await asyncio.sleep(35) 
    finally:
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
        limite_vencimento = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=15)
        fila_artistas = db.query(ArtistCache).filter(
            (ArtistCache.profile_image_url.is_(None)) | (ArtistCache.last_updated_at < limite_vencimento)
        ).limit(100).all()

        if not fila_artistas:
            logger.info("✅ [FAXINEIRO] Tudo limpo! Nenhuma foto para atualizar.")
            return

        logger.info(f"🔄 [FAXINEIRO] Fila de trabalho limitada: Processando {len(fila_artistas)} artistas hoje.")

        # 🚨 A MÁGICA ACONTECE AQUI: O robô abre UMA única conexão de internet para a fila toda
        async with httpx.AsyncClient() as client:
            for artista in fila_artistas:
                try:
                    # Passamos o 'client' aberto para o serviço usar
                    nova_foto = await genius.buscar_foto_artista(client, artista.name)

                    if nova_foto:
                        artista.profile_image_url = nova_foto
                        db.commit()
                        logger.info(f"✨ [FAXINEIRO] Foto atualizada: {artista.name}")
                    else:
                        logger.warning(f"⚠️ [FAXINEIRO] Foto não encontrada para {artista.name}.")

                except Exception as e:
                    logger.error(f"❌ [FAXINEIRO] Falha no artista {artista.name}: {e}")
                    db.rollback()

                db.expunge_all()
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