# backend/app/core/config.py
import os
from dotenv import load_dotenv

# Carrega o .env
# O caminho sobe 3 níveis (core -> app -> backend) para achar o .env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(env_path)

class Settings:
    PROJECT_NAME: str = "Tunify"
    SPOTIFY_CLIENT_ID: str = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET: str = os.getenv("SPOTIFY_CLIENT_SECRET")
    SPOTIFY_REDIRECT_URI: str = os.getenv("SPOTIFY_REDIRECT_URI")

    def check_setup(self):
        if not self.SPOTIFY_CLIENT_ID:
            raise ValueError("❌ ERRO: SPOTIFY_CLIENT_ID não encontrado no .env")
        
settings = Settings()