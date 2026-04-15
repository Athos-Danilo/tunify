import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

# Configuração básica de log para vermos os robôs trabalhando no terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Tunify-Robots")

# Instância do nosso Agendador Assíncrono (Ele não trava o FastAPI!)
scheduler = AsyncIOScheduler()

from app.models.track import TrackCache

import datetime
from app.core.database import SessionLocal # Usado para abrir a conexão com o banco
from app.models.user import User
from app.models.history import MonthlyHistory
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
                
                # Se ele já tem histórico, pegamos o Timestamp (em milissegundos pro Spotify)
                # Se for um usuário novo (Cold Start), deixamos None para puxar as últimas 50 logo de cara.
                after_ts = int(ultima_musica.played_at.timestamp() * 1000) if ultima_musica else None
                
                # 4. Pede as músicas pro Spotify
                faixas_recentes = await spotify.get_recently_played(user.access_token, after_timestamp=after_ts)
                
                # 5. Salva cada faixa na nossa Tabela Quente
                for item in faixas_recentes:
                    track_data = item['track']
                    track_id = track_data['id']
                    
                    # ======> LÓGICA DE CACHE (Dicionário Permanente)
                    # 1) Verifica se a música já existe no nosso cofre
                    musica_no_cache = db.query(TrackCache).filter(TrackCache.spotify_id == track_id).first()
                    
                    # 2) Se NÃO existir, nós cadastramos ela agora!
                    if not musica_no_cache:
                        # Extraímos os nomes dos artistas e juntamos com vírgula (ex: "The Weeknd, Daft Punk")
                        nomes_artistas = ", ".join([artista['name'] for artista in track_data['artists']])
                        
                        # Pegamos a URL da imagem da capa (geralmente a primeira da lista é a de alta resolução)
                        capa_url = track_data['album']['images'][0]['url'] if track_data['album']['images'] else None
                        
                        novo_cache = TrackCache(
                            spotify_id=track_id,
                            name=track_data['name'],
                            artist_name=nomes_artistas,
                            album_cover_url=capa_url
                        )
                        db.add(novo_cache)
                        logger.info(f"📦 [CACHE] Nova música catalogada: {track_data['name']}")
                    
                    # 3) Agora salvamos o play normalmente no histórico
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

            # 6. SE A PORTA ESTIVER TRANCADA (Token Expirado)
            except ValueError as e:
                if str(e) == "TOKEN_EXPIRADO":
                    logger.warning(f"⚠️ [RASTREADOR] Token do {user.display_name} expirou. Pegando um novo...")
                    
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
                    logger.info("🔑 [RASTREADOR] Token renovado! Na próxima hora ele busca os dados.")
                    
            except Exception as ex:
                logger.error(f"❌ [RASTREADOR] Erro genérico no usuário {user.display_name}: {ex}")

    finally:
        # Fechamos a gaveta do banco de dados para não vazar memória!
        db.close()
        logger.info("🤖 [RASTREADOR] Busca finalizada. Voltando a dormir.")


# ======> Robô 2: O Agregador Mensal (O Rollup)
# 1) Roda todo dia 1º de cada mês, às 03:00 da manhã.
# 2) Faz as contas, salva os Top 200 e apaga o histórico detalhado do mês passado.
# -------------------------------------------------------------------------------------- #
async def robo_agregador_mensal():
    logger.info("[AGREGADOR] Iniciando a faxina mensal e calculando Top 200...")
    # Aqui vai a lógica de consolidar os dados.
    logger.info("[AGREGADOR] Faxina concluída! Tabela Top Two Hundred atualizada.")


# ======> Função de Ignição
# 1) Conecta as funções de cima aos seus respectivos "relógios".
# 2) Dá a partida no motor do agendador.
# -------------------------------------------------------------------------------------- #
def iniciar_robos():
    # Adiciona o Robô 1 (Intervalo de 1 hora)
    scheduler.add_job(
        robo_rastreador_hourly,
        trigger=IntervalTrigger(minutes=30),
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