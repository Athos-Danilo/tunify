from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.core.security import obter_usuario_atual, obter_usuario_opcional
from app.services.sync_service import SyncService
from app.schemas.sync import (
    CreateInviteRequest,
    InviteDetailsResponse,
    AcceptInviteRequest,
    InviteSummaryResponse,
    ConnectionResponse,
    SyncPermissionsSchema
)

router = APIRouter()


# ======> 1. Criar Novo Convite P2P com Permissões Granulares
# --------------------------------------------------------------------------- #
@router.post("/convites", response_model=InviteSummaryResponse)
def criar_convite(
    payload: CreateInviteRequest,
    usuario: User = Depends(obter_usuario_atual),
    db: Session = Depends(get_db)
):
    convite = SyncService.criar_convite(db, usuario, payload.permissions)
    
    base_url = SyncService._obter_base_frontend_url()
    return InviteSummaryResponse(
        id=convite.id,
        invite_code=convite.invite_code,
        invite_url=f"{base_url}/sync/convite/{convite.invite_code}",
        permissions=payload.permissions,
        status=convite.status,
        expires_at=convite.expires_at,
        created_at=convite.created_at
    )


# ======> 2. Listar Convites Ativos do Usuário
# --------------------------------------------------------------------------- #
@router.get("/convites/meus-ativos", response_model=List[InviteSummaryResponse])
def listar_meus_convites_ativos(
    usuario: User = Depends(obter_usuario_atual),
    db: Session = Depends(get_db)
):
    return SyncService.listar_convites_ativos(db, usuario)


# ======> 3. Inspecionar Detalhes Públicos de um Convite (Tela de Boas-Vindas)
# --------------------------------------------------------------------------- #
@router.get("/convites/{codigo}", response_model=InviteDetailsResponse)
def obter_detalhes_convite(
    codigo: str,
    usuario: Optional[User] = Depends(obter_usuario_opcional),
    db: Session = Depends(get_db)
):
    try:
        return SyncService.obter_detalhes_convite(db, codigo, usuario)
    except ValueError as e:
        if str(e) == "CONVITE_NAO_ENCONTRADO":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Convite não encontrado ou código inválido."
            )
        raise HTTPException(status_code=400, detail=str(e))


# ======> 4. Aceitar Convite e Conectar Vibes
# --------------------------------------------------------------------------- #
@router.post("/convites/{codigo}/aceitar", response_model=ConnectionResponse)
def aceitar_convite(
    codigo: str,
    payload: AcceptInviteRequest,
    usuario: User = Depends(obter_usuario_atual),
    db: Session = Depends(get_db)
):
    
    try:
        conexao = SyncService.aceitar_convite(db, codigo, usuario, payload.permissions)
        return SyncService.formatar_conexao(conexao, usuario)

    except ValueError as e:
        err = str(e)
        if err == "CONVITE_NAO_ENCONTRADO":
            raise HTTPException(status_code=404, detail="Convite não encontrado.")
        if err == "CONVITE_EXPIRADO":
            raise HTTPException(status_code=410, detail="Este convite já expirou. Peça ao seu amigo para gerar um novo link.")
        if err == "AUTO_CONEXAO_PROIBIDA":
            raise HTTPException(status_code=400, detail="Você não pode aceitar seu próprio convite de sincronização.")
        if err == "JA_CONECTADOS":
            raise HTTPException(status_code=409, detail="Vocês já estão conectados no Tunify Sync!")
        if err.startswith("CONVITE_INVALIDO"):
            raise HTTPException(status_code=400, detail="Este convite não está mais disponível.")
        raise HTTPException(status_code=500, detail=f"Erro ao aceitar convite: {err}")


# ======> 5. Revogar um Convite Pendente
# --------------------------------------------------------------------------- #
@router.delete("/convites/{codigo}")
def revogar_convite(
    codigo: str,
    usuario: User = Depends(obter_usuario_atual),
    db: Session = Depends(get_db)
):
    try:
        SyncService.revogar_convite(db, codigo, usuario)
        return {"status": "sucesso", "mensagem": "Convite cancelado com sucesso."}
    except ValueError as e:
        if str(e) == "CONVITE_NAO_ENCONTRADO":
            raise HTTPException(status_code=404, detail="Convite não encontrado.")
        if str(e) == "CONVITE_JA_ACEITO":
            raise HTTPException(status_code=400, detail="Não é possível revogar um convite que já foi aceito.")
        raise HTTPException(status_code=400, detail=str(e))


# ======> 6. Listar Todas as Conexões / Amigos Ativos
# --------------------------------------------------------------------------- #
@router.get("/conexoes", response_model=List[ConnectionResponse])
def listar_conexoes(
    usuario: User = Depends(obter_usuario_atual),
    db: Session = Depends(get_db)
):
    return SyncService.listar_conexoes(db, usuario)


@router.patch("/conexoes/{connection_id}/permissoes", response_model=ConnectionResponse)
def atualizar_permissoes(connection_id: int, payload: SyncPermissionsSchema,
                         usuario: User = Depends(obter_usuario_atual), db: Session = Depends(get_db)):
    try:
        conexao = SyncService.atualizar_permissoes(db, connection_id, usuario, payload)
        return SyncService.formatar_conexao(conexao, usuario)
    except ValueError:
        raise HTTPException(status_code=404, detail="Conexão ativa não encontrada.")


@router.delete("/conexoes/{connection_id}", status_code=204)
def desconectar(connection_id: int, usuario: User = Depends(obter_usuario_atual),
                db: Session = Depends(get_db)):
    try:
        SyncService.desconectar(db, connection_id, usuario)
    except ValueError:
        raise HTTPException(status_code=404, detail="Conexão ativa não encontrada.")
