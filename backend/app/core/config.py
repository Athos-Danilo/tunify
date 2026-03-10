# Biblioteca nativa do Python para interagir com o sistema operacional (caminhos de pastas, variáveis).
import os

# Ferramenta para ler o nosso arquivo secreto '.env' e jogar as variáveis na memória do computador.
from dotenv import load_dotenv

# ======> Carregar o .env.
# 1) Calcula o caminho exato onde o arquivo .env está escondido;
# 2) O comando sobe 3 níveis de pastas (core -> app -> backend) para achá-lo;
# 3) Carrega tudo que está lá dentro para o Python usar.
# ------------------------------------------------------------------------------ #
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(env_path)


# ======> Defini as Configurações Globais.
# 1) Cria uma classe que vai segurar todas as chaves como se fossem propriedades;
# 2) Puxa cada variável de ambiente (os.getenv) e guarda na respectiva gaveta;
# 3) Cria um sistema de "Trava de Segurança" (check_setup) para não ligar o servidor faltando chave.
# ---------------------------------------------------------------------------------------------------- #
class Settings:
    PROJECT_NAME: str = "Tunify"
    
    # Chaves de acesso da API do Spotify.
    SPOTIFY_CLIENT_ID: str = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET: str = os.getenv("SPOTIFY_CLIENT_SECRET")
    SPOTIFY_REDIRECT_URI: str = os.getenv("SPOTIFY_REDIRECT_URI")
    
    # Chave de conexão com o Banco de Dados PostgreSQL.
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # Função que verifica se o arquivo .env foi lido corretamente.
    def check_setup(self):
        print("[INFO] Verificando as chaves de segurança do sistema...")
        
        # Se a chave do Spotify estiver vazia, trava tudo e avisa no terminal.
        if not self.SPOTIFY_CLIENT_ID:
            print("[ERRO CRÍTICO] SPOTIFY_CLIENT_ID não encontrado no arquivo .env!")
            raise ValueError("ERRO: O servidor não pode ligar sem a chave do Spotify.")
            
        # Se a chave do banco estiver vazia, trava tudo e avisa no terminal.
        if not self.DATABASE_URL:
            print("[ERRO CRÍTICO] DATABASE_URL não encontrada no arquivo .env!")
            raise ValueError("ERRO: O servidor não pode ligar sem o caminho do PostgreSQL.")
            
        print("[SUCESSO] Cofre de chaves validado com sucesso!")


# Instancia a classe para podermos importar apenas a palavra 'settings' em outros arquivos.
settings = Settings()

# Roda a verificação de segurança automaticamente assim que esse arquivo é lido pelo FastAPI.
settings.check_setup()