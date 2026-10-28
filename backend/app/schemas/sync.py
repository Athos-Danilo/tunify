import datetime
from typing import Optional
from pydantic import BaseModel, Field, StrictBool, ConfigDict


# ======> Schema das Permissões Granulares (Fase 1)
# Controla exatamente quais módulos do usuário o amigo poderá ver.
# --------------------------------------------------------------------------- #
class SyncPermissionsSchema(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)
    share_minutes: StrictBool = Field(description="Compartilhar minutos totais ouvidos (Pódio da Casa)")
    share_top_tracks: StrictBool = Field(description="Compartilhar Top 10 músicas mensais")
    share_top_artists: StrictBool = Field(description="Compartilhar Top 15 artistas mensais")
    share_peak_time: StrictBool = Field(description="Compartilhar horário de pico (madrugada/tarde...)")



# ======> Payload para Criar Convite
# --------------------------------------------------------------------------- #
class CreateInviteRequest(BaseModel):
    permissions: SyncPermissionsSchema


# ======> Informações Básicas do Usuário (Para exibição no Convite e Conexão)
# --------------------------------------------------------------------------- #
class UserPublicInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nome: str
    foto_perfil: Optional[str] = None

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
    is_already_connected: bool = False
    message: Optional[str] = None


# ======> Payload para Aceitar o Convite
# O convidado escolhe as permissões que ELE concede de volta.
# --------------------------------------------------------------------------- #
class AcceptInviteRequest(BaseModel):
    permissions: SyncPermissionsSchema


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
