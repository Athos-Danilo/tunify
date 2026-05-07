# Ferramenta principal para criar a nossa API e o gerenciador de permissões de acesso (CORS).
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
from app.services.tasks import iniciar_robos

# ======> Sincronização.
# 1) O SQLAlchemy olha para todos os modelos importados acima;
# 2) Verifica se cada tabela existe, se não existir, ele cria. 
# --------------------------------------------------------------- #
Base.metadata.create_all(bind=engine)


# ======> Instância do FastAPI.
# 1) Cria o servidor passando o nome do nosso projeto;
# 2) A partir daqui, a variável 'app' é o coração do backend.
# -------------------------------------------------------------- #
app = FastAPI(title=settings.PROJECT_NAME)


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


# ======> Eventos de Inicialização.
# 1) Executa comandos assim que o servidor é ligado no terminal.
# --------------------------------------------------------------------------- #
@app.on_event("startup")
async def startup_event():
    print(f"> Tunify rodando! Link de login: http://127.0.0.1:8000/api/v1/auth/login")
    print("> Banco de Dados conectado e tabelas verificadas!")
    
    # Liga a nossa central de robôs!
    iniciar_robos()


# ======> Rota Raiz.
# 1) Rota simples apenas para checar se o servidor está online pelo navegador.
# --------------------------------------------------------------------------- #
@app.get("/")
def read_root():
    return {"message": f"{settings.PROJECT_NAME} Backend Online"}