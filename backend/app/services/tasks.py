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

import asyncio
import time  # 🚨 IMPORT NOVO: Necessário para o robô saber esperar o banco acordar
import datetime
from app.core.database import SessionLocal # Usado para abrir a conexão com o banco
from app.models.user import User
from app.models.history import MonthlyHistory, TopTwoHundred, MinutesListened
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
                
                for item in faixas_recentes:
                    track_data = item['track']
                    track_id = track_data['id']
                    
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
# 2) Faz as contas, salva os Top 200 e apaga o histórico detalhado do mês passado.
# -------------------------------------------------------------------------------------- #
async def robo_agregador_mensal():
    logger.info("🧹 [AGREGADOR] Iniciando a faxina mensal e calculando as métricas...")
    db = SessionLocal()
    
    try:
        # 1. Descobrir qual é o mês que acabou de passar
        hoje = datetime.datetime.now()
        # O limite é o primeiro segundo do mês atual
        primeiro_dia_atual = hoje.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Formatar o mês de referência (Ex: "2026-03")
        if hoje.month == 1:
            mes_ref = f"{hoje.year - 1}-12"
        else:
            mes_ref = f"{hoje.year}-{hoje.month - 1:02d}"

        # 🚨 A BLINDAGEM DA AUTO-CURA (WAKE-UP CALL)
        # Tentamos bater no banco 3 vezes para acordar a Neon antes de puxar as somas pesadas
        somas_por_usuario = []
        for tentativa_db in range(3):
            try:
                # 2. A MÁGICA DOS MINUTOS OUVIDOS (JOIN + SUM)
                somas_por_usuario = db.query(
                    MonthlyHistory.user_id,
                    func.sum(TrackCache.duration_ms).label('total_ms')
                ).join(
                    TrackCache, MonthlyHistory.spotify_track_id == TrackCache.spotify_id
                ).filter(
                    MonthlyHistory.played_at < primeiro_dia_atual
                ).group_by(
                    MonthlyHistory.user_id
                ).all()
                
                # Se conseguiu ler o banco, quebra o loop e segue a faxina!
                break 
                
            except Exception as db_error:
                if tentativa_db < 2:
                    logger.warning(f"⚠️ [AGREGADOR] Neon dormindo. Tentativa {tentativa_db + 1}/3. Aguardando 5s...")
                    await asyncio.sleep(5) # Espera assíncrona
                else:
                    logger.error(f"❌ [AGREGADOR] Falha crítica: O banco não acordou para o fechamento mensal. Erro: {db_error}")
                    return # Aborta o fechamento para não apagar os dados errados

        # 3. Salva os minutos calculados na tabela MinutesListened
        for user_id, total_ms in somas_por_usuario:
            minutos_totais = int(total_ms / 60000)
            novo_fechamento = MinutesListened(
                user_id=user_id,
                mes_referencia=mes_ref,
                total_minutes=minutos_totais
            )
            db.add(novo_fechamento)
            logger.info(f"📊 [FECHAMENTO] Usuário {user_id} ouviu {minutos_totais} minutos em {mes_ref}.")

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
            
            logger.info(f"🏆 [TOP 200] Ranking de {mes_ref} gerado com sucesso para o usuário {u_id}.")

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

    # Liga a chave geral
    scheduler.start()
    logger.info("Central de Robôs do Tunify iniciada com sucesso!")