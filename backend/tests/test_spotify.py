import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from unittest.mock import patch

from main import app
from app.core.database import Base, get_db
from app.models.user import User

# ========================================================================= #
# 1. O LABORATÓRIO (Banco de Dados Falso na Memória RAM)
# ========================================================================= #
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool 
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria as tabelas na memória
Base.metadata.create_all(bind=engine)

# 🚨 PREPARAÇÃO EXCLUSIVA DESTE ARQUIVO:
# Já vamos injetar um "Usuário Cobaia" no banco falso para usarmos nos testes!
db = TestingSessionLocal()
db.add(User(
    spotify_id="id_cobaia_123",
    display_name="Athos DJ",
    email="dj@tunify.com",
    access_token="token_abrir_spotify_456",
    refresh_token="refresh_secreto_789"
))
db.commit()
db.close()

# Sobrescreve o banco original pelo falso
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

client = TestClient(app)

# 🚨 A MÁGICA DO ISOLAMENTO
@pytest.fixture(autouse=True)
def isolamento_de_banco():
    # Antes do teste começar: Força o app a usar o banco deste arquivo
    app.dependency_overrides[get_db] = override_get_db
    yield
    # Depois que o teste termina: Limpa a conexão para não vazar pro próximo arquivo!
    app.dependency_overrides.clear()

# ========================================================================= #
# --- TESTE 1: O CAMINHO FELIZ (Trazendo as Playlists)
# ========================================================================= #
# Sequestramos o 'requests.get' que fica dentro do seu arquivo spotify.py
@patch("app.api.v1.endpoints.spotify.requests.get")
def test_buscar_playlists_com_sucesso(mock_get):
    
    # Falsificando a resposta do Spotify (O JSON gigante simulado)
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        "items": [
            {
                "name": "Rock Coding 2026",
                "tracks": {"total": 42},
                "external_urls": {"spotify": "link_do_rock"}
            },
            {
                "name": "Foco nos Estudos (TCC)",
                "tracks": {"total": 15},
                "external_urls": {"spotify": "link_do_foco"}
            }
        ]
    }
    
    # O robô bate na sua rota usando o e-mail do nosso "Usuário Cobaia"
    response = client.get("/api/v1/spotify/playlists/dj@tunify.com")
    
    # Verificações da perfeição
    assert response.status_code == 200
    data = response.json()
    
    assert data["dono_da_conta"] == "Athos DJ"
    assert data["total_encontrado"] == 2
    assert data["suas_playlists"][0]["nome"] == "Rock Coding 2026"
    assert data["suas_playlists"][1]["total_musicas"] == 15

# ========================================================================= #
# --- TESTE 2: USUÁRIO FANTASMA (Erro de Banco de Dados)
# ========================================================================= #
def test_buscar_playlists_usuario_nao_encontrado():
    # O robô tenta buscar as playlists de um e-mail que não existe no SQLite
    response = client.get("/api/v1/spotify/playlists/fantasma@tunify.com")
    
    # O seu código tem que bloquear e devolver 404 (Not Found)
    assert response.status_code == 404
    assert response.json()["detail"] == "Usuário não encontrado no banco de dados."

# ========================================================================= #
# --- TESTE 3: SPOTIFY REVOLTADO (Erro de Token Expirado)
# ========================================================================= #
@patch("app.api.v1.endpoints.spotify.requests.get")
def test_buscar_playlists_spotify_recusa_token(mock_get):
    
    # Simulamos o Spotify dizendo "Não te conheço, vaza!" (Status 401)
    mock_get.return_value.status_code = 401
    mock_get.return_value.text = "The access token expired"
    
    # O robô tenta buscar a playlist com o e-mail certo
    response = client.get("/api/v1/spotify/playlists/dj@tunify.com")
    
    # O seu código tem que repassar o erro bloqueando o acesso
    assert response.status_code == 401
    assert "Erro no Spotify" in response.json()["detail"]