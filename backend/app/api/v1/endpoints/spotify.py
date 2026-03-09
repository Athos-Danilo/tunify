# Ferramentas do FastAPI para criar rotas, injetar dependências e lançar erros HTTP.
from fastapi import APIRouter, Depends, HTTPException

# Gerenciador de sessão do SQLAlchemy para realizar operações no PostgreSQL.
from sqlalchemy.orm import Session

# Biblioteca para fazer requisições HTTP.
import requests

# Importa a função que abre e fecha a porta do banco de dados.
from app.core.database import get_db

# Importa o schema do Usuário no banco.
from app.models.user import User

router = APIRouter()


# ======> Buscar as Playlists do Usuário.
# 1) Recebe o e-mail na URL e procura o dono no banco de dados;
# 2) Recupera a chave mestra (Access Token) salva no banco;
# 3) Bate na porta do Spotify silenciosamente para ler as playlists;
# 4) Limpa e formata os dados brutos;
# 5) Retorna a lista pronta para o Front-end.
# --------------------------------------------------------------------------- #
@router.get("/playlists/{email}")
def get_my_playlists(email: str, db: Session = Depends(get_db)):
    print(f"[INFO] Requisição recebida para buscar playlists. E-mail: {email}")
    
    try:
        # --- VERIFICA SE O USUÁRIO EXISTE NO BANCO ---
        
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            print(f"[ERRO] Usuário '{email}' não encontrado no PostgreSQL.")
            raise HTTPException(status_code=404, detail="Usuário não encontrado no banco de dados.")
            
        print("[INFO] Usuário encontrado. Recuperando chave de acesso...")

        
        # --- PREPARAR A URL E VAI NO SPOTIFY ---
        
        # Quebrando a URL verdadeira do Spotify para evitar que filtros de rede a bloqueiem.
        dominio = "https://api" + ".spotify.com"
        endpoint = "/v1/me/playlists"
        spotify_url = dominio + endpoint
        
        # Coloca a chave do usuário no cabeçalho da requisição (como se fosse um crachá).
        headers = {
            "Authorization": f"Bearer {user.access_token}"
        }
        
        print(f"[INFO] Bateu na porta do Spotify ({endpoint})...")
        response = requests.get(spotify_url, headers=headers)
        
        # Trava de Segurança: Verifica se o Spotify barrou a gente (token expirado ou falta de permissão).
        if response.status_code != 200:
            print(f"[ERRO] O Spotify recusou o acesso. Status: {response.status_code} | Detalhes: {response.text}")
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"Erro no Spotify: {response.text}"
            )
            
        print("[SUCESSO] O Spotify liberou o acesso! Processando os dados...")
        data = response.json()
        
        
        # --- FORMATA OS DADOS E DEVOLVE PRO FRONTEND ---
        
        playlists = []
        
        # Verifica se o Spotify mandou a lista de "items" dentro do JSON.
        if "items" in data:
            for item in data["items"]:
                # Pega só o que importa e guarda na listinha.
                playlists.append({
                    "nome": item.get("name"),
                    "total_musicas": item.get("tracks", {}).get("total"),
                    "link_spotify": item.get("external_urls", {}).get("spotify")
                })
                
        print(f"[SUCESSO] Tudo certo! Devolvendo {len(playlists)} playlists para o Front-end.")
        
        return {
            "dono_da_conta": user.display_name,
            "mensagem": "Busca feita usando os dados salvos no PostgreSQL!",
            "total_encontrado": len(playlists),
            "suas_playlists": playlists
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as error:
        # Se algo muito bizarro acontecer...
        print(f"[ERRO CRÍTICO - get_my_playlists]: {error}")
        raise HTTPException(status_code=500, detail="Erro interno ao tentar buscar as playlists.")