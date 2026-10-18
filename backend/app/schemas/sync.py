import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ======> Schema das Permissões Granulares (Fase 1)
# Controla exatamente quais módulos do usuário o amigo poderá ver.
# --------------------------------------------------------------------------- #
class SyncPermissionsSchema(BaseModel):
    share_minutes: bool = Field(default=True, description="Compartilhar minutos totais ouvidos (Pódio da Casa)")
    share_top_tracks: bool = Field(default=True, description="Compartilhar Top 10 músicas mensais")
    share_top_artists: bool = Field(default=True, description="Compartilhar Top 15 artistas mensais")
    share_peak_time: bool = Field(default=True, description="Compartilhar horário de pico (madrugada/tarde...)")

    class Config:
        from_attributes = True


# ======> Payload para Criar Convite
# --------------------------------------------------------------------------- #
class CreateInviteRequest(BaseModel):
    permissions: SyncPermissionsSchema = Field(default_factory=SyncPermissionsSchema)


# ======> Informações Básicas do Usuário (Para exibição no Convite e Conexão)
# --------------------------------------------------------------------------- #
class UserPublicInfo(BaseModel):
    id: int
    nome: str
    email: str
    foto_perfil: Optional[str] = None

    class Config:
        from_attributes = True


# ======> Detalhes Públicos do Convite (Exibidos ao Convidado)
# --------------------------------------------------------------------------- #
class InviteDetailsResponse(BaseModel):
    invite_code: str
    sender: UserPublicInfo
    permissions: SyncPermissionsSchema
    expires_at: datetime.datetime
    status: str
    is_valid: bool
    is_owner: bool = False
    message: Optional[str] = None


# ======> Payload para Aceitar o Convite
# O convidado escolhe as permissões que ELE concede de volta.
# --------------------------------------------------------------------------- #
class AcceptInviteRequest(BaseModel):
    permissions: SyncPermissionsSchema = Field(default_factory=SyncPermissionsSchema)


# ======> Resumo de Convite do Próprio Usuário
# --------------------------------------------------------------------------- #
class InviteSummaryResponse(BaseModel):
    id: int
    invite_code: str
    invite_url: str
    permissions: SyncPermissionsSchema
    status: str
    expires_at: datetime.datetime
    created_at: datetime.datetime


# ======> Detalhes da Conexão (Amizade Ativa)
# --------------------------------------------------------------------------- #
class ConnectionResponse(BaseModel):
    connection_id: int
    amigo: UserPublicInfo
    minhas_permissoes_para_ele: SyncPermissionsSchema
    permissoes_dele_para_mim: SyncPermissionsSchema
    status: str
    created_at: datetime.datetime
