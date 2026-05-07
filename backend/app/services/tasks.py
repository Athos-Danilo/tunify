import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

# 🚨 IMPORT NOVO: O 'func' do SQLAlchemy para fazer as somas matemáticas direto no banco!
from sqlalchemy import func

# Configuração básica de log para vermos os robôs trabalhando no terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Tunify-Robots")

# Instância do nosso Agendador Assíncrono (Ele não trava o FastAPI!)
scheduler = AsyncIOScheduler()

from app.models.track import TrackCache
from app.models.artist import ArtistCache # 🚨 IMPORT NOVO: Nosso novo modelo de artistas!

import asyncio
import time  # 🚨 IMPORT NOVO: Necessário para o robô saber esperar o banco acordar
import datetime
from app.core.database import SessionLocal # Usado para abrir a conexão com o banco
from app.models.user import User
from app.models.history import MonthlyHistory, TopTwoHundred, MinutesListened, MonthlyTopArtist
from app.services.spotify_service import SpotifyService
from app.core.config import settings

# ======> Robô 1: O Rastreador Diário
# 1) Roda a cada 1 hora cravada.
# 2) Vai varrer o banco, pegar o token de quem está ativo e buscar músicas novas.
# -------------------------------------------------------------------------------------- #
async def robo_rastreador_hourly():
    logger.info("🤖 [RASTREADOR] Acordando para buscar novas músicas...")
    
    # 1. Abre uma sessão com o banco de dados
    db = SessionLocal()
    spotify = SpotifyService()
    
    try:
        # 🚨 A BLINDAGEM DA AUTO-CURA (WAKE-UP CALL)
        # Tentamos ler os usuários 3 vezes para dar tempo da Neon ligar os motores
        usuarios_ativos = []
        for tentativa_db in range(3):
            try:
                usuarios_ativos = db.query(User).filter(User.refresh_token.isnot(None)).all()
                break 
            except Exception as db_error:
                if tentativa_db < 2:
                    logger.warning(f"⚠️ [RASTREADOR] Neon dormindo ou conexão instável. Tentativa {tentativa_db + 1}/3. Aguardando 5s...")
                    await asyncio.sleep(5) # Espera assíncrona (não trava o app)
                else:
                    logger.error(f"❌ [RASTREADOR] Falha crítica: Banco não acordou. Erro: {db_error}")
                    return

        # 2. Se chegamos aqui, a Neon está acordada!
        for user in usuarios_ativos:
            try:
                # 3. Descobre qual foi a última música salva para esse usuário
                ultima_musica = db.query(MonthlyHistory).filter(MonthlyHistory.user_id == user.id)\
                                  .order_by(MonthlyHistory.played_at.desc()).first()
                
                after_ts = int(ultima_musica.played_at.timestamp() * 1000) if ultima_musica else None
                faixas_recentes = []

                # 🚨 SISTEMA DE TENTATIVAS (SPOTIFY + TOKEN)
                for tentativa in range(2):
                    try:
                        faixas_recentes = await spotify.get_recently_played(user.access_token, after_timestamp=after_ts)
                        break 
                    except ValueError as e:
                        if str(e) == "TOKEN_EXPIRADO" and tentativa == 0:
                            logger.warning(f"⚠️ [RASTREADOR] Token do {user.display_name} expirou. Renovando...")
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

                # 4. Processamento das músicas encontradas
                musicas_adicionadas_agora = set()
                artist_ids_to_check = set() # 🚨 [NOVO] Guarda os IDs dos artistas dessa leva
                
                for item in faixas_recentes:
                    track_data = item['track']
                    track_id = track_data['id']
                    
                    # 🚨 [NOVO] Coleta todos os IDs dos artistas dessa música
                    for artista in track_data.get('artists', []):
                        if artista.get('id'):
                            artist_ids_to_check.add(artista['id'])
                    
                    # Verifica se a música já existe no nosso Dicionário (Cache)
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
                        logger.info(f"📦 [CACHE] Nova música catalogada: {track_data['name']}")
                    
                    # Salva o play no histórico mensal
                    played_at = datetime.datetime.fromisoformat(item['played_at'].replace('Z', '+00:00'))
                    
                    novo_historico = MonthlyHistory(
                        user_id=user.id,
                        spotify_track_id=track_id,
                        played_at=played_at
                    )
                    db.add(novo_historico)
                
                # 🚨 [NOVO] 4.5 MÁGICA DOS ARTISTAS: Catalogar novos artistas encontrados
                if artist_ids_to_check:
                    # Verifica quais artistas já temos no banco
                    artistas_existentes = db.query(ArtistCache.spotify_id).filter(
                        ArtistCache.spotify_id.in_(artist_ids_to_check)
                    ).all()
                    
                    ids_existentes = {row[0] for row in artistas_existentes}
                    ids_faltantes = list(artist_ids_to_check - ids_existentes)

                    # Se falta algum, pede em lotes de 20 pro Spotify com pausa preventiva
                    if ids_faltantes:
                        for i in range(0, len(ids_faltantes), 20):
                            lote_ids = ids_faltantes[i:i+20]
                            try:
                                # Chama o novo método do seu spotify_service!
                                resposta_artistas = await spotify.get_artists(user.access_token, lote_ids)
                                
                                for art_data in resposta_artistas.get('artists', []):
                                    if not art_data: continue
                                    
                                    foto_url = art_data['images'][0]['url'] if art_data.get('images') else None
                                    novo_artista = ArtistCache(
                                        spotify_id=art_data['id'],
                                        name=art_data['name'],
                                        profile_image_url=foto_url
                                    )
                                    db.add(novo_artista)
                                
                                logger.info(f"🎨 [CACHE ARTISTA] +{len(lote_ids)} novos artistas catalogados com foto oficial!")
                            except Exception as e:
                                logger.error(f"❌ [CACHE ARTISTA] Erro ao buscar lote de artistas: {e}")
                                db.rollback() # Previne travar o resto em caso de erro no lote

                            # 🚨 A SUA PAUSA ESTRATÉGICA DE 35 SEGUNDOS AQUI
                            if i + 20 < len(ids_faltantes):
                                logger.info("⏳ [CACHE ARTISTA] Pausando 35s para esfriar a API antes do próximo lote de artistas...")
                                await asyncio.sleep(35)

                # Salva tudo o que foi feito para este usuário
                db.commit()
                if faixas_recentes:
                    logger.info(f"✅ [RASTREADOR] +{len(faixas_recentes)} faixas salvas para {user.display_name}")

            except Exception as ex:
                logger.error(f"❌ [RASTREADOR] Erro no usuário {user.display_name}: {ex}")
                db.rollback() 

            await asyncio.sleep(30)
    finally:
        db.close()
        logger.info("🤖 [RASTREADOR] Ciclo finalizado.")


# ======> Robô 2: O Agregador Mensal (O Rollup)
# 1) Roda todo dia 1º de cada mês, às 03:00 da manhã.
# 2) Faz as contas, salva os Top 200, Top 15 Artistas e apaga o histórico do mês passado.
# -------------------------------------------------------------------------------------- #
async def robo_agregador_mensal():
    logger.info("🧹 [AGREGADOR] Iniciando a faxina mensal e calculando as métricas...")
    db = SessionLocal()
    
    try:
        # 1. Descobrir qual é o mês que acabou de passar
        hoje = datetime.datetime.now(datetime.timezone.utc)
        # O limite é o primeiro segundo do mês atual
        primeiro_dia_atual = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Formatar o mês de referência (Ex: "2026-03")
        if hoje.month == 1:
            mes_ref = f"{hoje.year - 1}-12"
        else:
            mes_ref = f"{hoje.year}-{hoje.month - 1:02d}"

        # 🚨 A BLINDAGEM DA AUTO-CURA (WAKE-UP CALL)
        somas_por_usuario = []
        for tentativa_db in range(3):
            try:
                somas_por_usuario = db.query(
                    MonthlyHistory.user_id,
                    func.sum(TrackCache.duration_ms).label('total_ms'),
                    func.count(func.distinct(TrackCache.artist_name)).label('total_artistas') # 🚨 Conta os artistas sem repetir!
                ).join(
                    TrackCache, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
                ).filter(
                    MonthlyHistory.played_at < primeiro_dia_atual
                ).group_by(
                    MonthlyHistory.user_id
                ).all()
                break 
            except Exception as db_error:
                if tentativa_db < 2:
                    logger.warning(f"⚠️ [AGREGADOR] Neon dormindo. Tentativa {tentativa_db + 1}/3. Aguardando 5s...")
                    await asyncio.sleep(5)
                else:
                    logger.error(f"❌ [AGREGADOR] Falha crítica: O banco não acordou. Erro: {db_error}")
                    return 

        # 3. Salva os minutos E artistas calculados na tabela MinutesListened
        for user_id, total_ms, total_artistas in somas_por_usuario:
            minutos_totais = int(total_ms / 60000)
            novo_fechamento = MinutesListened(
                user_id=user_id,
                mes_referencia=mes_ref,
                total_minutes=minutos_totais,
                total_unique_artists=total_artistas # 🚨 Salva o total calculado aqui!
            )
            db.add(novo_fechamento)
            logger.info(f"📊 [FECHAMENTO] Usuário {user_id} ouviu {minutos_totais} min e {total_artistas} artistas em {mes_ref}.")

        # 4. A MÁGICA DO TOP 200 (GROUP BY + COUNT + LIMIT)
        usuarios_com_historico = db.query(MonthlyHistory.user_id).filter(
            MonthlyHistory.played_at < primeiro_dia_atual
        ).distinct().all()

        for (u_id,) in usuarios_com_historico:
            ranking_musicas = db.query(
                MonthlyHistory.spotify_track_id,
                func.count(MonthlyHistory.id).label('play_count')
            ).filter(
                MonthlyHistory.user_id == u_id,
                MonthlyHistory.played_at < primeiro_dia_atual
            ).group_by(
                MonthlyHistory.spotify_track_id
            ).order_by(
                func.count(MonthlyHistory.id).desc()
            ).limit(200).all()

            for rank, (track_id, play_count) in enumerate(ranking_musicas, start=1):
                novo_top = TopTwoHundred(
                    user_id=u_id,
                    mes_referencia=mes_ref,
                    spotify_track_id=track_id,
                    play_count=play_count,
                    rank_position=rank
                )
                db.add(novo_top)
            
            logger.info(f"🏆 [TOP 200] Ranking gerado com sucesso para o usuário {u_id}.")

            # -------------------------------------------------------------------------
            # 4.5 A MÁGICA DO TOP 15 ARTISTAS (GROUP BY ARTIST_NAME + SUM DURATION)
            # -------------------------------------------------------------------------
            ranking_artistas = db.query(
                TrackCache.artist_name,
                func.sum(TrackCache.duration_ms).label('tempo_total_ms'),
                func.max(TrackCache.album_cover_url).label('capa_album_exemplo') # Pega a capa para servir de foto
            ).join(
                MonthlyHistory, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
            ).filter(
                MonthlyHistory.user_id == u_id,
                MonthlyHistory.played_at < primeiro_dia_atual
            ).group_by(
                TrackCache.artist_name
            ).order_by(
                func.sum(TrackCache.duration_ms).desc()
            ).limit(15).all()

            for rank_artista, (artist_name, tempo_total_ms, capa_url) in enumerate(ranking_artistas, start=1):
                minutos_artista = int(tempo_total_ms / 60000)
                
                novo_top_artista = MonthlyTopArtist(
                    user_id=u_id,
                    mes_referencia=mes_ref,
                    artist_spotify_id=artist_name, # Usamos o nome como ID único aqui
                    artist_name=artist_name,
                    artist_image_url=capa_url,
                    minutes_listened=minutos_artista,
                    rank_position=rank_artista
                )
                db.add(novo_top_artista)
                
            logger.info(f"🎤 [TOP ARTISTAS] Top 15 Artistas gerado para o usuário {u_id}.")

        # 5. A PURGA (Limpeza da tabela quente)
        linhas_deletadas = db.query(MonthlyHistory).filter(MonthlyHistory.played_at < primeiro_dia_atual).delete()
        
        # Só comitamos no final!
        db.commit()
        logger.info(f"✅ [AGREGADOR] Faxina concluída! {linhas_deletadas} plays antigos apagados do sistema.")

    except Exception as e:
        logger.error(f"❌ [AGREGADOR] Erro no fechamento mensal: {e}")
        db.rollback()
    
    finally:
        db.close()

# 🚨 [NOVO] Robô 3: O Faxineiro de Artistas
# 1) Roda todo dia às 04:00 da manhã.
# 2) Encontra fotos antigas (> 15 dias) e atualiza fatiando em lotes de 30.
# 3) Pausa de 30 segundos entre lotes para não ser bloqueado pelo Spotify.
# -------------------------------------------------------------------------------------- #
async def robo_faxineiro_artistas():
    logger.info("🧹 [FAXINEIRO] Acordando para limpar e atualizar fotos de artistas...")
    db = SessionLocal()
    spotify = SpotifyService()

    try:
        # Pega um usuário válido para usar o Token de Acesso à API do Spotify
        usuario = db.query(User).filter(User.refresh_token.isnot(None)).first()
        if not usuario:
            logger.warning("⚠️ [FAXINEIRO] Nenhum usuário com token para usar a API.")
            return

        # 🚨 SISTEMA DE TENTATIVAS (RENOVA O TOKEN SE NECESSÁRIO)
        try:
            # Simula um refresh preventivo para garantir que o token vai durar a faxina inteira
            novos_tokens = await spotify.atualizar_token(
                usuario.refresh_token, 
                settings.SPOTIFY_CLIENT_ID, 
                settings.SPOTIFY_CLIENT_SECRET
            )
            usuario.access_token = novos_tokens['access_token']
            if 'refresh_token' in novos_tokens:
                usuario.refresh_token = novos_tokens['refresh_token']
            db.commit()
        except Exception as e:
            logger.error(f"❌ [FAXINEIRO] Erro ao renovar token inicial: {e}")
            return

        # Calcular a data limite (15 dias atrás)
        limite_dias = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=15)

        # Buscar IDs de artistas que estão com a foto vencida
        artistas_vencidos = db.query(ArtistCache.spotify_id).filter(
            ArtistCache.last_updated_at < limite_dias
        ).all()

        ids_vencidos = [row[0] for row in artistas_vencidos]

        if not ids_vencidos:
            logger.info("✅ [FAXINEIRO] Nenhuma foto de artista vencida hoje. Voltando a dormir.")
            return

        logger.info(f"🔄 [FAXINEIRO] Encontrados {len(ids_vencidos)} artistas para atualizar. Iniciando o fatiamento...")

        # FATIAMENTO MÁGICO: Separa em pacotes de 30
        for i in range(0, len(ids_vencidos), 30):
            lote = ids_vencidos[i:i+30]
            try:
                # Dispara a requisição em lote pro Spotify
                resposta = await spotify.get_artists(usuario.access_token, lote)
                
                # Aplica as novas fotos no banco de dados
                for art_data in resposta.get('artists', []):
                    if not art_data: continue
                    
                    artista_db = db.query(ArtistCache).filter(ArtistCache.spotify_id == art_data['id']).first()
                    if artista_db:
                        foto_url = art_data['images'][0]['url'] if art_data.get('images') else None
                        artista_db.profile_image_url = foto_url
                        # Obs: o 'last_updated_at' atualiza sozinho pelo 'onupdate=func.now()' do SQLAlchemy!
                
                db.commit()
                logger.info(f"✨ [FAXINEIRO] Lote de {len(lote)} artistas atualizado com sucesso.")
                
            except Exception as e:
                logger.error(f"❌ [FAXINEIRO] Erro ao atualizar o lote atual: {e}")
                db.rollback()

            # Pausa de segurança de 30 segundos entre os lotes (Rate Limit Protection)
            if i + 30 < len(ids_vencidos):
                logger.info("⏳ [FAXINEIRO] Pausando 30 segundos antes do próximo lote para esfriar a API...")
                await asyncio.sleep(30)

        logger.info("🎉 [FAXINEIRO] Turno encerrado. Todas as fotos foram atualizadas!")

    except Exception as e:
        logger.error(f"❌ [FAXINEIRO] Erro geral na faxina: {e}")
    finally:
        db.close()

# ======> Função de Ignição
# 1) Conecta as funções de cima aos seus respectivos "relógios".
# 2) Dá a partida no motor do agendador.
# -------------------------------------------------------------------------------------- #
def iniciar_robos():
    # Adiciona o Robô 1 (Intervalo de 5 minutos - Teste)
    scheduler.add_job(
        robo_rastreador_hourly,
        trigger=IntervalTrigger(minutes=100),
        id="rastreador_spotify",
        name="Busca histórico a cada hora",
        replace_existing=True
    )

    # Adiciona o Robô 2 (Cron Job: Dia 1, 03:00 da manhã)
    scheduler.add_job(
        robo_agregador_mensal,
        trigger=CronTrigger(day=1, hour=3, minute=0),
        id="agregador_mensal",
        name="Consolida dados no dia 1 de cada mês",
        replace_existing=True
    )

    # 🚨 [NOVO] Adiciona o Robô 3 (Cron Job: Diário, 04:00 da manhã)
    scheduler.add_job(
        robo_faxineiro_artistas,
        trigger=CronTrigger(hour=4, minute=0),
        id="faxineiro_artistas",
        name="Atualiza fotos de artistas vencidas a cada 15 dias",
        replace_existing=True
    )

    # Liga a chave geral
    scheduler.start()
    logger.info("Central de Robôs do Tunify iniciada com sucesso!")