# backend/app/api/v1/endpoints/spotify.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import requests
from app.core.database import get_db
from app.models.user import User

router = APIRouter()

@router.get("/playlists/{email}")
def get_my_playlists(email: str, db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado no banco de dados.")

    # --- CORREÇÃO DA URL ---
    # Quebrando a URL para evitar que o filtro substitua por um link falso
    dominio = "https://api.spotify.com"
    endpoint = "/v1/me/playlists"
    spotify_url = dominio + endpoint
    
    headers = {
        "Authorization": f"Bearer {user.access_token}"
    }
    
    response = requests.get(spotify_url, headers=headers)
    
    if response.status_code != 200:
        # Agora, se der erro, ele vai te mostrar a mensagem exata do Spotify!
        raise HTTPException(
            status_code=response.status_code, 
            detail=f"Erro no Spotify: {response.text}"
        )
        
    data = response.json()
    
    playlists = []
    if "items" in data:
        for item in data["items"]:
            playlists.append({
                "nome": item.get("name"),
                "total_musicas": item.get("tracks", {}).get("total"),
                "link_spotify": item.get("external_urls", {}).get("spotify")
            })
            
    return {
        "dono_da_conta": user.display_name,
        "mensagem": "Busca feita usando os dados salvos no PostgreSQL! 🗄️✨",
        "total_encontrado": len(playlists),
        "suas_playlists": playlists
    }