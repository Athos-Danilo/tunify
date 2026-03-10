# Ferramentas do SQLAlchemy, a biblioteca que traduz código Python para comandos SQL.
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Importa as configurações (onde está a DATABASE_URL escondida).
from app.core.config import settings


# ======> O Motor (Engine) do Banco de Dados.
# 1) Lê a URL de conexão que o config.py pegou do cofre .env;
# 2) Cria o "motor" que vai gerenciar a comunicação física com o PostgreSQL.
# ---------------------------------------------------------------------------- #
print("[INFO] Configurando o motor de conexão com o PostgreSQL...")
engine = create_engine(settings.DATABASE_URL)


# ======> Sessão.
# 1) Cria uma "fábrica de sessões" baseada no motor acima;
# 2) autocommit=False: Exige que chame 'db.commit()' para salvar as coisas;
# 3) autoflush=False: Não envia os dados pro banco antes da hora certa.
# ---------------------------------------------------------------------------- #
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ======> A Base dos Moldes.
# 1) Cria uma classe mãe que todas as tabelas vão herdar;
# --------------------------------------------------------- #
Base = declarative_base()


# ======> Porteiro do Banco.
# 1) Abre uma nova conversa (sessão) com o banco de dados toda vez que uma rota é chamada;
# 2) Entrega (yield) essa sessão para a rota usar;
# 3) O 'finally' garante que a porta do banco será fechada no final, mesmo se der erro no meio.
# ------------------------------------------------------------------------------------------------ #
def get_db():
    db = SessionLocal()
    try:
        # Entrega a sessão para a rota trabalhar.
        yield db
    except Exception as error:
        # Se a rota explodir no meio de uma transação, mostra o erro no terminal.
        print(f"[ERRO CRÍTICO - Banco de Dados]: A transação falhou. Detalhes: {error}")
        raise error
    finally:
        # Garante que a conexão seja fechada para não esgotar o limite do PostgreSQL.
        db.close()