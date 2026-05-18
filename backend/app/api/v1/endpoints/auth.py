# Ferramentas do FastAPI para criar rotas, injetar dependências e lançar erros HTTP.
from fastapi import APIRouter, Depends, HTTPException, status

# Ferramenta para redirecionar o usuário para outra página (neste caso, o site do Spotify).
from fastapi.responses import RedirectResponse

# Gerenciador de sessão do SQLAlchemy para realizar operações no PostgreSQL.
from sqlalchemy.orm import Session

# Bibliotecas nativas do Python para formatar URLs, fazer requisições na web e criptografar dados.
import urllib.parse
import requests
import base64
import os

# Importa as variáveis de ambiente.
from app.core.config import settings

# Importa a função que abre e fecha a porta do banco de dados.
from app.core.database import get_db

# Importa o schema do Usuário no banco.
from app.models.user import User

from fastapi import Query

# 🚨 NOVIDADES AQUI NO TOPO: Importando o nosso chaveiro e as ferramentas do Pydantic
from app.core.security import get_password_hash, verify_password, criar_token_jwt
from pydantic import BaseModel, EmailStr

router = APIRouter()


# ======> MOLDES DO PYDANTIC (Para o FastAPI ler o que o Angular manda)
# --------------------------------------------------------------------------- #
class CadastrarSenhaRequest(BaseModel):
    email: EmailStr
    nova_senha: str

class LoginLocalRequest(BaseModel):
    email: EmailStr
    senha: str


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
            "streaming",
            "user-follow-read",
            "user-read-recently-played",
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-library-modify",
            "user-follow-modify",
            "user-read-currently-playing",
            "user-read-playback-position",
            "ugc-image-upload"
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
def callback_spotify(
    # 🚨 1. Mudamos a porta de entrada para aceitar o "error" e tornar o "code" opcional
    code: str | None = None, 
    error: str | None = None, 
    db: Session = Depends(get_db)
):
    # 🚨 2. Trava de segurança 1: A usuária clicou em "Cancelar"
    if error == "access_denied":
        print("[AVISO] O login foi cancelado na tela do Spotify.")
        
        # Puxa a URL do Render, se não achar, usa o Localhost
        base_url = os.getenv("FRONTEND_URL", "http://localhost:4200")
        
        # Manda ela de volta para a tela de login para tentar de novo
        return RedirectResponse(url=f"{base_url}/login?erro=cancelado", status_code=302)
        
    # 🚨 3. Trava de segurança 2: A URL veio vazia, sem código e sem erro
    if not code:
        print("[ERRO] Callback chamado sem código de autorização.")
        raise HTTPException(status_code=400, detail="Código de autorização não encontrado.")

    # Se passou das duas travas acima, temos o código! O fluxo segue normal.
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

        # Retorna o resultado final para o Angular usando a variável de ambiente.
        base_url = os.getenv("FRONTEND_URL", "http://localhost:4200")
        frontend_url = f"{base_url}/callback"
        
        # Empacotamos o token e o nome para o Angular salvar na memória (LocalStorage).
        params = {
            "token": access_token,
            "nome": display_name,
            "email": email
        }
        
        # Juntamos tudo e mandamos o usuário de volta pro Front-end.
        url_redirecionamento = f"{frontend_url}?{urllib.parse.urlencode(params)}"
        
        print(f"[SUCESSO] Redirecionando usuário para o Angular...")
        
        # Usamos o status_code=302 (Found) que é o padrão da web para redirecionamentos temporários.
        return RedirectResponse(url=url_redirecionamento, status_code=302)

    except HTTPException as http_exc:
        # Se for um erro que nós mesmos lançamos (como o HTTPException acima), apenas repassamos ele.
        raise http_exc
    except Exception as error:
        # Caso o banco de dados caia ou aconteça um erro bizarro não previsto.
        print(f"[ERRO CRÍTICO - callback_spotify]: {error}")
        # Desfaz qualquer tentativa de salvar no banco para não corromper os dados.
        db.rollback()
        raise HTTPException(status_code=500, detail="Aconteceu um erro no servidor, tente novamente mais tarde!")


# =========================================================================== #
#                      🔐 MODO DE CONTENÇÃO (LOGIN LOCAL)                     #
# =========================================================================== #

# ======> Cadastrar Senha Local
# Rota usada lá na tela de Configurações para a Ainoã criar a senha dela.
# Recebe o e-mail dela e a senha nova, e salva tudo criptografado no banco.
# --------------------------------------------------------------------------- #
@router.post("/local/cadastrar-senha")
def cadastrar_senha(dados: CadastrarSenhaRequest, db: Session = Depends(get_db)):
    print(f"[INFO] Tentando cadastrar senha local para o email: {dados.email}")
    
    # 1. Verifica se a pessoa já existe no banco (ela TÊM que ter entrado pelo Spotify antes)
    usuario = db.query(User).filter(User.email == dados.email).first()
    
    if not usuario:
        print(f"[ERRO] Usuário não encontrado no banco.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Usuário não encontrado. Você precisa fazer login com o Spotify pelo menos uma vez."
        )

    # 2. Transforma a senha "123456" num Hash (ex: $2b$12$X5G...)
    senha_criptografada = get_password_hash(dados.nova_senha)
    
    # 3. Salva a versão criptografada na gaveta nova que criamos
    usuario.password_hash = senha_criptografada
    db.commit()
    
    print(f"[SUCESSO] Senha cadastrada e criptografada para o email: {dados.email}")
    return {"message": "Senha configurada com sucesso! Agora você pode logar sem o Spotify."}


# ======> Login com Senha Local
# A rota que salva o dia se o Spotify der erro 429! 
# --------------------------------------------------------------------------- #
@router.post("/local/login")
def login_local(dados: LoginLocalRequest, db: Session = Depends(get_db)):
    print(f"[INFO] Tentativa de login local com email: {dados.email}")
    
    usuario = db.query(User).filter(User.email == dados.email).first()
    
    if not usuario or not usuario.password_hash:
        print("[ERRO] E-mail não cadastrado ou senha não configurada.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="E-mail ou senha incorretos."
        )

    senha_valida = verify_password(dados.senha, usuario.password_hash)
    
    if not senha_valida:
        print("[ERRO] Senha incorreta digitada.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="E-mail ou senha incorretos."
        )

    print(f"[SUCESSO] Login local aprovado para o email: {dados.email}")
    
    # 🚨 A MÁGICA ACONTECE AQUI: Geramos o passaporte!
    # O padrão do JWT é usar a chave "sub" (subject) para guardar quem é o dono.
    dados_do_token = {"sub": usuario.email}
    passaporte_jwt = criar_token_jwt(dados_do_token)
    
    # Devolvemos o token no formato que o Angular (e o mercado) espera receber
    return {
        "access_token": passaporte_jwt,
        "token_type": "bearer",
        "message": "Login realizado com sucesso!",
        "usuario": {
            "nome": usuario.display_name,
            "email": usuario.email,
            "spotify_token": usuario.access_token 
        }
    }