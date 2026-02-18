# backend/app/api/v1/endpoints/auth.py
from fastapi import APIRouter
from fastapi.responses import RedirectResponse
import urllib.parse
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
    return {"message": "Login feito com sucesso! Recebemos o código.", "code": code}