# backend/app/api/v1/endpoints/auth.py
from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import urllib.parse
import requests
import base64

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

router = APIRouter()

@router.get("/login")
def login_spotify():
    scopes = [
        "user-read-private",
        "user-read-email",
        "playlist-modify-public",
        "playlist-modify-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-top-read",
        "user-library-read",
        "streaming"
    ]
    
    params = {
        "client_id": settings.SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
        "scope": " ".join(scopes),
        "show_dialog": "true"
    }
    
    url = f"https://accounts.spotify.com/authorize?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url)

# Adicionamos "db: Session = Depends(get_db)" para o FastAPI injetar o banco aqui
@router.get("/callback")
def callback_spotify(code: str, db: Session = Depends(get_db)):
    # 1. Trocar o código pelos Tokens
    auth_string = f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    token_url = "https://accounts.spotify.com/api/token"
    token_headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI
    }

    token_response = requests.post(token_url, headers=token_headers, data=token_data)
    token_json = token_response.json()

    if "access_token" not in token_json:
        return {"erro": "Falha ao obter token", "detalhes": token_json}

    access_token = token_json["access_token"]
    refresh_token = token_json.get("refresh_token") # Pegamos o token de renovação também

    # 2. Buscar os dados do seu perfil no Spotify
    me_url = "https://api.spotify.com/v1/me"
    me_headers = {"Authorization": f"Bearer {access_token}"}
    me_response = requests.get(me_url, headers=me_headers)
    
    if me_response.status_code != 200:
        return {"erro": "Não foi possível buscar o perfil no Spotify"}
        
    user_profile = me_response.json()
    spotify_id = user_profile.get("id")
    display_name = user_profile.get("display_name")
    email = user_profile.get("email")

    # --- 🗄️ A MÁGICA DO BANCO DE DADOS COMEÇA AQUI 🗄️ ---
    
    # 3. Verifica se o usuário já existe no nosso banco (buscando pelo spotify_id)
    db_user = db.query(User).filter(User.spotify_id == spotify_id).first()

    if db_user:
        # Usuário já existe! Só atualizamos os tokens dele.
        db_user.access_token = access_token
        if refresh_token:
            db_user.refresh_token = refresh_token
        db_user.display_name = display_name # Atualiza o nome caso ele tenha mudado lá no Spotify
        db.commit()
        mensagem = "Bem-vindo de volta! Seus tokens foram atualizados no banco."
    else:
        # Usuário novo! Vamos criar a ficha dele no banco.
        novo_usuario = User(
            spotify_id=spotify_id,
            display_name=display_name,
            email=email,
            access_token=access_token,
            refresh_token=refresh_token
        )
        db.add(novo_usuario)
        db.commit()
        mensagem = "Novo usuário registrado com sucesso no banco de dados!"

    return {
        "status": mensagem,
        "usuario": display_name,
        "email": email
    }