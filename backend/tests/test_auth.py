import sys
import os
# Hack Sênior: Força o Python a enxergar a pasta 'backend' como a raiz do projeto
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import patch
from sqlalchemy.pool import StaticPool

# Importações do seu projeto
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

# Cria as tabelas (O molde que você fez no user.py) nesse banco de mentirinha
Base.metadata.create_all(bind=engine)

# ========================================================================= #
# 2. SEQUESTRANDO O PORTEIRO (Sobrescrita de Dependência)
# ========================================================================= #
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
# --- TESTE 1: O REDIRECIONAMENTO DE LOGIN
# ========================================================================= #
def test_login_spotify_redireciona_corretamente():
    # Dispara um GET na sua rota, mas pede pro robô NÃO seguir o redirecionamento
    response = client.get("/api/v1/auth/login", follow_redirects=False)
    
    # O FastAPI usa o status 307 para RedirectResponse
    assert response.status_code == 307
    
    # A URL do Spotify tem que estar no cabeçalho "location"
    assert "accounts.spotify.com" in response.headers["location"]
    assert "client_id" in response.headers["location"]

# ========================================================================= #
# --- TESTE 2: O CALLBACK E A CRIAÇÃO DO USUÁRIO (A Mágica do Mock)
# ========================================================================= #
# Usamos o @patch para "sequestrar" o requests.get e requests.post lá dentro do seu auth.py
@patch("app.api.v1.endpoints.auth.requests.post")
@patch("app.api.v1.endpoints.auth.requests.get")
def test_callback_spotify_cria_usuario_novo(mock_get, mock_post):
    
    # 1. Falsificando a resposta do POST (A troca do Código pelo Token)
    mock_post.return_value.json.return_value = {
        "access_token": "token_super_secreto_123",
        "refresh_token": "refresh_infinito_456"
    }
    
    # 2. Falsificando a resposta do GET (A busca do Perfil do Spotify)
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        "id": "spotify_id_do_athos",
        "display_name": "Athos Sênior",
        "email": "athos@tunify.com"
    }

    # 3. Ação: O robô bate na sua rota de callback fingindo que é o Spotify devolvendo o código
    response = client.get("/api/v1/auth/callback?code=codigo_falso_de_retorno")

    # 4. Verificação da Resposta da API
    assert response.status_code == 200
    assert response.json()["usuario"] == "Athos Sênior"
    assert response.json()["status"] == "Novo usuário registrado com sucesso no banco de dados!"

    # 5. A PROVA DE FOGO: O usuário REALMENTE foi salvo no banco de dados falso?
    db = TestingSessionLocal()
    user_no_banco = db.query(User).filter(User.email == "athos@tunify.com").first()
    
    assert user_no_banco is not None
    assert user_no_banco.spotify_id == "spotify_id_do_athos"
    assert user_no_banco.access_token == "token_super_secreto_123"
    
# ========================================================================= #
# --- TESTE 3: O CALLBACK ATUALIZANDO UM USUÁRIO EXISTENTE
# ========================================================================= #
@patch("app.api.v1.endpoints.auth.requests.post")
@patch("app.api.v1.endpoints.auth.requests.get")
def test_callback_spotify_atualiza_usuario_existente(mock_get, mock_post):
    
    # 1. PREPARANDO O TERRENO: Criamos um usuário com tokens velhos no banco falso
    db = TestingSessionLocal()
    usuario_antigo = User(
        spotify_id="spotify_id_de_athos", # O mesmo ID que o mock vai devolver
        display_name="Athos Danilo",
        email="athosdanilo@tunify.com",
        access_token="token_velho_expirado",
        refresh_token="refresh_velho"
    )
    db.add(usuario_antigo)
    db.commit()
    db.close()

    # 2. Falsificando a resposta do POST (O Spotify mandando os tokens NOVOS)
    mock_post.return_value.json.return_value = {
        "access_token": "NOVO_TOKEN_BRILHANTE_789",
        "refresh_token": "NOVO_REFRESH_000"
    }

    # 3. Falsificando a resposta do GET (O ID é o mesmo, mas o nome de exibição mudou)
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        "id": "spotify_id_de_athos",
        "display_name": "Athos Sênior Atualizado", 
        "email": "athosdanilo@tunify.com"
    }

    # 4. Ação: O robô bate na rota de callback simulando o retorno do login
    response = client.get("/api/v1/auth/callback?code=codigo_falso_de_retorno")

    # 5. Verificações da Resposta da API
    assert response.status_code == 200
    # Garante que caiu no "Caminho B" do seu if/else!
    assert response.json()["status"] == "Bem-vindo de volta! Seus tokens foram atualizados no banco."

    # 6. A PROVA DE FOGO: O banco atualizou mesmo e NÃO duplicou o usuário?
    db = TestingSessionLocal()
    usuarios_no_banco = db.query(User).filter(User.spotify_id == "spotify_id_de_athos").all()
    
    # A lista só pode ter 1 usuário com esse ID (prova de que não criou duplicata)
    assert len(usuarios_no_banco) == 1
    
    # O token velho sumiu e o novo assumiu o lugar?
    usuario_atualizado = usuarios_no_banco[0]
    assert usuario_atualizado.access_token == "NOVO_TOKEN_BRILHANTE_789"
    assert usuario_atualizado.display_name == "Athos Sênior Atualizado"
    
    db.close()