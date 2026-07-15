import datetime
from typing import List, Optional
from pydantic import BaseModel

# Ferramentas do FastAPI para criar rotas e injetar dependências.
from fastapi import APIRouter, Depends, HTTPException

# Gerenciador de sessão do SQLAlchemy.
from sqlalchemy.orm import Session

# Importa a função que abre a porta do banco de dados.
from app.core.database import get_db

# Importa os moldes que vamos usar para ler os dados.
from app.models.user import User
from app.models.selo import SeloCatalog, UserSelo

router = APIRouter()


# ==============================================================================
# SCHEMAS PYDANTIC (DTOs)
# ==============================================================================

class SeloCatalogResponse(BaseModel):
    id: int
    name: str
    description: str
    badge_type: str
    icon_path: str
    criteria_type: str
    criteria_value: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class UserSeloResponse(BaseModel):
    id: int
    user_id: int
    selo_id: int
    unlocked_at: datetime.datetime
    reference_period: Optional[str] = None
    is_pinned: bool
    notified: bool
    selo: SeloCatalogResponse  # Objeto do selo aninhado

    class Config:
        from_attributes = True


class PinSeloRequest(BaseModel):
    is_pinned: bool


class TrophyRoomResponse(BaseModel):
    pinned: List[UserSeloResponse]
    all_unlocked: List[UserSeloResponse]


# ==============================================================================
# ROTAS / ENDPOINTS
# ==============================================================================

# ======> Rota: Obter Vitrine de Selos (Trophy Room)
# 1) Recebe o e-mail na URL;
# 2) Retorna a lista de selos fixados (pins) e todos os selos desbloqueados.
# --------------------------------------------------------------------------- #
@router.get("/vitrine/{email}", response_model=TrophyRoomResponse)
async def obter_vitrine_selos(email: str, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # Stub / Dados simulados temporários para validação dos DTOs no Swagger
    # Em seguida, substituiremos pela lógica de banco real
    return {
        "pinned": [],
        "all_unlocked": []
    }


# ======> Rota: Fixar/Desfixar Selo (Pin/Unpin)
# 1) Recebe o ID da conquista do usuário na URL;
# 2) Atualiza o estado de fixação do selo, validando o limite máximo de 3.
# --------------------------------------------------------------------------- #
@router.put("/fixar/{user_selo_id}", response_model=UserSeloResponse)
async def alterar_fixacao_selo(user_selo_id: int, payload: PinSeloRequest, db: Session = Depends(get_db)):
    user_selo = db.query(UserSelo).filter(UserSelo.id == user_selo_id).first()
    
    if not user_selo:
        raise HTTPException(status_code=404, detail="Conquista não encontrada.")

    # Stub / Simulação para responder de acordo com o DTO
    # Em seguida, substituiremos pela lógica real de negócio
    raise HTTPException(status_code=501, detail="Lógica de fixação de selos não implementada.")


# ======> Rota: Marcar Novas Conquistas como Notificadas
# 1) Recebe o e-mail na URL;
# 2) Marca a flag notified = True para todos os selos recém-desbloqueados do usuário.
# --------------------------------------------------------------------------- #
@router.put("/notificar/{email}")
async def marcar_selos_notificados(email: str, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.email == email).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # Stub / Lógica simulada
    return {
        "status": "sucesso",
        "mensagem": "Novas conquistas marcadas como visualizadas."
    }
