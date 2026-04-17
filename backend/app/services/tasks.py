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
    
    # 1. Abre uma sessão com o banco de dados (Abre a gaveta)
    db = SessionLocal()
    spotify = SpotifyService()
    
    try:
        # 2. Pega TODOS os usuários que têm o refresh_token salvo (Estão ativos no Tunify)
        usuarios_ativos = db.query(User).filter(User.refresh_token.isnot(None)).all()
        
        for user in usuarios_ativos:
            try:
                # 3. Descobre qual foi a última música salva para esse usuário
                ultima_musica = db.query(MonthlyHistory).filter(MonthlyHistory.user_id == user.id)\
                                  .order_by(MonthlyHistory.played_at.desc()).first()
                
                after_ts = int(ultima_musica.played_at.timestamp() * 1000) if ultima_musica else None
                
                faixas_recentes = [] # Inicia a gaveta vazia aqui fora

                # 🚨 A NOVA MÁGICA: Sistema de Tentativas (Retry)
                for tentativa in range(2):
                    try:
                        # Pede as músicas pro Spotify (Agora APENAS dentro do loop seguro)
                        faixas_recentes = await spotify.get_recently_played(user.access_token, after_timestamp=after_ts)
                        
                        # Se passou dessa linha sem dar erro, deu tudo certo! Quebramos o loop.
                        break 
                        
                    except ValueError as e:
                        if str(e) == "TOKEN_EXPIRADO" and tentativa == 0:
                            logger.warning(f"⚠️ [RASTREADOR] Token do {user.display_name} expirou. Trocando o pneu com o carro andando...")
                            
                            # Usa o SpotifyService para renovar o crachá
                            novos_tokens = await spotify.atualizar_token(
                                user.refresh_token, 
                                settings.SPOTIFY_CLIENT_ID, 
                                settings.SPOTIFY_CLIENT_SECRET
                            )
                            
                            # Atualiza no banco o novo Access Token
                            user.access_token = novos_tokens['access_token']
                            if 'refresh_token' in novos_tokens:
                                user.refresh_token = novos_tokens['refresh_token']
                            db.commit()
                            
                            logger.info("🔑 [RASTREADOR] Token renovado! Buscando as músicas IMEDIATAMENTE (Tentativa 2).")
                        else:
                            # Se der erro na 2ª tentativa, levanta a bandeira vermelha
                            raise e

                # 🚨 A PRANCHETA (Memória de curto prazo)
                musicas_adicionadas_agora = set()
                
                # 5. Salva cada faixa na nossa Tabela Quente
                for item in faixas_recentes:
                    track_data = item['track']
                    track_id = track_data['id']
                    
                    # ======> LÓGICA DE CACHE (Dicionário Permanente)
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
                    
                    # Salva o play no histórico
                    played_at = datetime.datetime.fromisoformat(item['played_at'].replace('Z', '+00:00'))
                    
                    novo_historico = MonthlyHistory(
                        user_id=user.id,
                        spotify_track_id=track_id,
                        played_at=played_at
                    )
                    db.add(novo_historico)
                
                # Confirma as alterações no banco de dados!
                db.commit()
                logger.info(f"✅ [RASTREADOR] +{len(faixas_recentes)} faixas salvas para o usuário {user.display_name}")

            # 🚨 Tratamento de Erro Genérico (O fantasma foi exorcizado daqui!)
            except Exception as ex:
                logger.error(f"❌ [RASTREADOR] Erro genérico no usuário {user.display_name}: {ex}")
                db.rollback() 

    finally:
        # Fechamos a gaveta do banco de dados para não vazar memória!
        db.close()
        logger.info("🤖 [RASTREADOR] Busca finalizada. Voltando a dormir.")


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
        # Primeiro, pegamos a lista de todos os usuários que ouviram alguma coisa no mês passado
        usuarios_com_historico = db.query(MonthlyHistory.user_id).filter(
            MonthlyHistory.played_at < primeiro_dia_atual
        ).distinct().all()

        for (u_id,) in usuarios_com_historico:
            # Pede pro banco contar os plays, ordenar do maior pro menor e limitar aos 200 primeiros!
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

            # Varre o ranking gerado pelo banco e salva na nossa tabela definitiva
            # O enumerate(start=1) cria a posição automaticamente (1, 2, 3...)
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
        # O banco já calculou os minutos e já salvou o Top 200, então podemos deletar o passado!
        linhas_deletadas = db.query(MonthlyHistory).filter(MonthlyHistory.played_at < primeiro_dia_atual).delete()
        
        # Só comitamos no final! A transação garante que, se algo der erro, nada é apagado pela metade.
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
        trigger=IntervalTrigger(minutes=10),
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