from fastapi import APIRouter
from fastapi.responses import RedirectResponse
import urllib.parse
import requests
import base64
from app.core.config import settings

router = APIRouter()

@router.get("/login")
def login_spotify():
    scopes = [
        "user-read-private",
        "user-read-email",
        "playlist-modify-public",
        "playlist-modify-private",
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

@router.get("/callback")
def callback_spotify(code: str):
    # 1. Preparar a autenticação (Client ID + Secret codificados em Base64)
    auth_string = f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    # 2. Configurar o pedido (Request) para pegar o Token
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI
    }

    # 3. Fazer a troca (POST)
    response = requests.post(url, headers=headers, data=data)
    
    # 4. Retornar o resultado (O Access Token real!)
    return response.json()