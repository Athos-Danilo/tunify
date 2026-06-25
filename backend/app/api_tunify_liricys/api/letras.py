# Roteador do FastAPI e ferramentas de Resposta HTTP.
from fastapi import APIRouter, HTTPException, status, Response

# Repositório de acesso a dados do MongoDB
from app.api_tunify_liricys.repositories.letras_repository import LetrasRepository
# Schema de resposta
from app.api_tunify_liricys.schemas.letras import LetraSchema

# ======> Roteador de Letras.
# 1) Agrupa todas as rotas relacionadas ao microserviço de letras.
# ------------------------------------------------------------------------- #
router = APIRouter()


# ======> Rota de Leitura de Letras (Semeamento Background).
# 1) Rota passiva, não altera o banco de dados.
# 2) Se estiver CONCLUIDO, devolve a letra imediatamente (HTTP 200).
# 3) Se estiver PENDENTE/PROCESSANDO, devolve HTTP 202 para o frontend saber que está a caminho.
# 4) Se for inexistente ou NAO_ENCONTRADA, devolve HTTP 404.
# ------------------------------------------------------------------------- #
@router.get("/{id_musica}", response_model=LetraSchema)
async def get_letra(id_musica: str, response: Response):
    letras_repo = LetrasRepository()
    letra = await letras_repo.get_letra_by_spotify_id(id_musica)
    
    # Se o robô semeador ainda não passou por essa música...
    if not letra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Ainda não temos essa música no nosso banco de dados. O robô a processará em breve."
        )
        
    # Se o robô já enfileirou mas o microserviço Go ainda não raspou...
    if letra.status in ["PENDENTE", "PROCESSANDO"]:
        # Retorna o status 202 Accepted sem travar a conexão (O frontend exibirá a arte de 'encomendado')
        response.status_code = status.HTTP_202_ACCEPTED
        return letra
        
    # Se o Go tentou raspar e não achou em nenhum site...
    if letra.status == "NAO_ENCONTRADA":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Esta música é instrumental ou não possui letra disponível na internet."
        )
        
    # Se achou e raspou com sucesso!
    return letra
