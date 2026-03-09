# Ferramentas do FastAPI para criar rotas, injetar dependências e lançar erros HTTP.
from fastapi import APIRouter, Depends, HTTPException

# Ferramenta para redirecionar o usuário para outra página (neste caso, o site do Spotify).
from fastapi.responses import RedirectResponse

# Gerenciador de sessão do SQLAlchemy para realizar operações no PostgreSQL.
from sqlalchemy.orm import Session

# Bibliotecas nativas do Python para formatar URLs, fazer requisições na web e criptografar dados.
import urllib.parse
import requests
import base64

# Importa as variáveis de ambiente.
from app.core.config import settings

# Importa a função que abre e fecha a porta do banco de dados.
from app.core.database import get_db

# Importa o schema do Usuário no banco.
from app.models.user import User

router = APIRouter()


# ======> Inicia o Login com o Spotify.
# 1) Defini a lista de permissões que precisamos;
# 2) Monta os parâmetros da URL usando o ID do aplicativo (Client ID);
# 3) Redireciona o usuário para a página oficial de autorização do Spotify.
# --------------------------------------------------------------------------- #
@router.get("/login")
def login_spotify():
    try:
        print("[INFO] Iniciando redirecionamento para o login do Spotify...")
        
        # Lista de permissões (scope) que o Tunify está pedindo ao usuário.
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
        
        # Parâmetros obrigatórios exigidos pela documentação do Spotify.
        params = {
            "client_id": settings.SPOTIFY_CLIENT_ID,
            "response_type": "code",
            "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
            "scope": " ".join(scopes),
            "show_dialog": "true"
        }
        
        # Junta a URL base do Spotify com os nossos parâmetros formatados.
        url = f"https://accounts.spotify.com/authorize?{urllib.parse.urlencode(params)}"
        
        print("[SUCESSO] Usuário sendo redirecionado para a tela de autorização.")
        return RedirectResponse(url)

    except Exception as error:
        # Log do erro no terminal.
        print(f"[ERRO - login_spotify]: {error}")
        raise HTTPException(status_code=500, detail="Erro interno ao tentar redirecionar para o Spotify.")


# ======> Processa o Retorno (Callback) do Spotify e Salvar no Banco.
# 1) Recebe o "código" temporário devolvido pelo Spotify na URL;
# 2) Troca esse código pelos tokens definitivos (Access e Refresh Token);
# 3) Usa o token para buscar o perfil público do usuário no Spotify;
# 4) Verifica se o usuário já existe no nosso banco de dados;
# 5) Se existir, atualizar os tokens; se for novo, criar o registro.
# ------------------------------------------------------------------------- #
@router.get("/callback")
def callback_spotify(code: str, db: Session = Depends(get_db)):
    print(f"[INFO] Processando callback. Código temporário recebido com sucesso.")
    
    try:
        # --- TROCA O CÓDIGO PELOS TOKENS ---
        
        # Prepara a string de autenticação (ID:Secret) e converte para o formato Base64.
        auth_string = f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}"
        auth_bytes = auth_string.encode("utf-8")
        auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

        # Configura para qual endereço e de que forma vamos pedir os tokens.
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

        # Bate na porta do Spotify pedindo as chaves.
        token_response = requests.post(token_url, headers=token_headers, data=token_data)
        token_json = token_response.json()

        # Trava de segurança: Se o Spotify não devolveu o token.
        if "access_token" not in token_json:
            print(f"[ERRO] Falha na troca de tokens. Resposta do Spotify: {token_json}")
            raise HTTPException(status_code=400, detail="Falha ao obter token de acesso do Spotify.")

        # Guarda as chaves devolvidas.
        access_token = token_json["access_token"]
        refresh_token = token_json.get("refresh_token")
        print("[INFO] Tokens de acesso gerados com sucesso.")

        
        # --- BUSCA OS DADOS DO PERFIL DO USUÁRIO ---
        
        me_url = "https://api.spotify.com/v1/me"
        me_headers = {"Authorization": f"Bearer {access_token}"}
        me_response = requests.get(me_url, headers=me_headers)
        
        if me_response.status_code != 200:
            print(f"[ERRO] Falha ao buscar perfil. Status: {me_response.status_code}")
            raise HTTPException(status_code=400, detail="Não foi possível buscar o perfil no Spotify.")
            
        user_profile = me_response.json()
        spotify_id = user_profile.get("id")
        display_name = user_profile.get("display_name")
        email = user_profile.get("email")


        # --- SALVA OU ATUALIZA O USUÁRIO NO BANCO DE DADOS ---
        
        # Busca na tabela User para ver se o ID do Spotify já foi cadastrado antes.
        db_user = db.query(User).filter(User.spotify_id == spotify_id).first()

        if db_user:
            # O usuário já é nosso parceiro! Só atualizamos as chaves e o nome dele.
            db_user.access_token = access_token
            if refresh_token:
                db_user.refresh_token = refresh_token
            db_user.display_name = display_name
            
            # O commit "salva" as alterações no banco de fato.
            db.commit()
            mensagem = "Bem-vindo de volta! Seus tokens foram atualizados no banco."
            print(f"[SUCESSO] Usuário '{display_name}' atualizado no banco de dados.")
        else:
            # É a primeira vez do usuário! Vamos criar a ficha dele.
            novo_usuario = User(
                spotify_id=spotify_id,
                display_name=display_name,
                email=email,
                access_token=access_token,
                refresh_token=refresh_token
            )
            # Adiciona o novo molde à sessão e salva.
            db.add(novo_usuario)
            db.commit()
            mensagem = "Novo usuário registrado com sucesso no banco de dados!"
            print(f"[SUCESSO] Novo usuário '{display_name}' criado no banco de dados.")

        # Retorna o resultado final para o Front-end.
        return {
            "status": mensagem,
            "usuario": display_name,
            "email": email
        }

    except HTTPException as http_exc:
        # Se for um erro que nós mesmos lançamos (como o HTTPException acima), apenas repassamos ele.
        raise http_exc
    except Exception as error:
        # Caso o banco de dados caia ou aconteça um erro bizarro não previsto.
        print(f"[ERRO CRÍTICO - callback_spotify]: {error}")
        # Desfaz qualquer tentativa de salvar no banco para não corromper os dados.
        db.rollback()
        raise HTTPException(status_code=500, detail="Aconteceu um erro no servidor, tente novamente mais tarde!")