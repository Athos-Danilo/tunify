# Ferramenta principal para criar a nossa API e o gerenciador de permissões de acesso (CORS).
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# 🚨 ADICIONADO: Biblioteca nativa para gerenciar o ciclo de vida do servidor
from contextlib import asynccontextmanager

# Importa as configurações globais.
from app.core.config import settings

# Importa as rotas.
from app.api.v1.endpoints import auth, spotify, dashboard


# Importa o motor do banco de dados e a classe Base.
from app.core.database import engine, Base

# Importa os moldes para o SQLAlchemy saber quais tabelas precisam ser criadas.
# 🚨 [AJUSTE] Adicionamos o ArtistCache aqui para o banco criar a tabela de fotos oficiais!
from app.models import User, MonthlyHistory, TopTwoHundred, TrackCache, MinutesListened
from app.models.artist import ArtistCache 


# Robôs de Busca.
# 🚨 AJUSTE: Importamos também o 'scheduler' para podermos desligá-lo com segurança no shutdown
from app.services.tasks import iniciar_robos, scheduler


# ======> Eventos de Inicialização e Ciclo de Vida (Lifespan).
# 1) Executa comandos assim que o servidor é ligado;
# 2) Aguarda o servidor rodar (yield);
# 3) Executa a limpeza e desliga os robôs com educação quando o servidor para.
# --------------------------------------------------------------------------- #
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- [STARTUP]: O que roda ao ligar o servidor ----
    print("> Conectando ao Banco de Dados e verificando tabelas...")
    
    # Sincronização: O SQLAlchemy olha para todos os modelos importados e cria as tabelas se não existirem.
    Base.metadata.create_all(bind=engine)
    
    print(f"> {settings.PROJECT_NAME} rodando! Link de login: http://127.0.0.1:8000/api/v1/auth/login")
    print("> Banco de Dados conectado e tabelas verificadas com sucesso!")
    
    # Liga a nossa central de robôs!
    iniciar_robos()
    
    yield # <--- O Servidor fica aqui respirando enquanto o app está online
    
    # ---- [SHUTDOWN]: O que roda ao desligar o servidor (ex: Re-deploy no Render) ----
    print("> Desligando a central de robôs com segurança...")
    if scheduler.running:
        scheduler.shutdown()
    print("> Central de Robôs desligada. Servidor encerrado com sucesso! 💤")


# ======> Instância do FastAPI.
# 1) Cria o servidor passando o nome do nosso projeto e o gerenciador de ciclo de vida;
# 2) A partir daqui, a variável 'app' é o coração do backend.
# -------------------------------------------------------------- #
app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)


# ======> A Ponte com o Frontend (CORS).
# 1) Libera o acesso para o frontend.
# ---------------------------------------- #

# A Lista VIP de quem pode conversar com a sua API
origens_permitidas = [
    "http://localhost:4200",               # Para você continuar testando no seu PC
    "https://tunify-pearl.vercel.app",     # O seu prédio oficial no Vercel (SEM barra no final)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens_permitidas,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======> Conectando as Rotas.
# 1) Pega as rotas de autenticação (login, callback) e coloca no corredor '/api/v1/auth';
# 2) Pega as rotas do Spotify (playlists) e coloca no corredor '/api/v1/spotify';
# 3) As tags organizam a documentação automática do FastAPI.
# ------------------------------------------------------------------------------------------- #
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(spotify.router, prefix="/api/v1/spotify", tags=["Spotify"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])


# ======> Rota Raiz.
# 1) Rota simples apenas para checar se o servidor está online pelo navegador.
# --------------------------------------------------------------------------- #
@app.get("/")
def read_root():
    return {"message": f"{settings.PROJECT_NAME} Backend Online"}