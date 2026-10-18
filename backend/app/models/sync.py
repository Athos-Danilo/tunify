import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


# ======> Molde da Tabela de Convites do Tunify Sync.
# 1) Armazena links de convite P2P temporários gerados pelos usuários;
# 2) Guarda o hash/código seguro e as permissões de privacidade escolhidas na criação;
# 3) Controla o status de expiração (7 dias) e se já foi aceito.
# -------------------------------------------------------------------------------------- #
class SyncInvite(Base):
    __tablename__ = "sync_invites"

    # 1. Chave Primária
    id = Column(Integer, primary_key=True, index=True)

    # 2. Usuário que gerou o convite (Remetente)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # 3. Código seguro único da URL (ex: 'vibe-7xK9pL2mQ...')
    invite_code = Column(String(32), unique=True, index=True, nullable=False)

    # 4. Permissões concedidas pelo remetente (JSON com as flags)
    # Exemplo: {"share_minutes": true, "share_top_tracks": true, "share_top_artists": true, "share_peak_time": true}
    permissions = Column(JSON, nullable=False)

    # 5. Status do Convite: 'PENDENTE', 'ACEITO', 'EXPIRADO', 'REVOGADO'
    status = Column(String(20), nullable=False, default="PENDENTE", index=True)

    # 6. Usuário que aceitou o convite (se já tiver sido aceito)
    accepted_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # 7. Data e hora de expiração (7 dias após a criação)
    expires_at = Column(DateTime(timezone=True), nullable=False)

    # 8. Data de criação
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    # Relacionamentos virtuais (ORM)
    sender = relationship("User", foreign_keys=[sender_id], backref="invites_sent")
    accepted_by = relationship("User", foreign_keys=[accepted_by_id])


# ======> Molde da Tabela de Conexões de Amizade (Tunify Sync).
# 1) Armazena o vínculo ativo entre dois usuários conectados;
# 2) Guarda as permissões bidirecionais (o que A vê de B, e o que B vê de A);
# 3) Garante unicidade para impedir pares duplicados.
# -------------------------------------------------------------------------------------- #
class SyncConnection(Base):
    __tablename__ = "sync_connections"

    # 1. Chave Primária
    id = Column(Integer, primary_key=True, index=True)

    # 2. Usuário A (Padronizado como o de menor ID para evitar duplicidades espelhadas)
    user_a_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # 3. Usuário B (Padronizado como o de maior ID)
    user_b_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # 4. Permissões que o Usuário A concedeu para o Usuário B
    permissions_a_to_b = Column(JSON, nullable=False)

    # 5. Permissões que o Usuário B concedeu para o Usuário A
    permissions_b_to_a = Column(JSON, nullable=False)

    # 6. Status da Conexão: 'ACTIVE', 'PAUSED', 'BLOCKED'
    status = Column(String(20), nullable=False, default="ACTIVE", index=True)

    # 7. Data de criação da conexão
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    # Restrição de unicidade para o par de amigos
    __table_args__ = (
        UniqueConstraint("user_a_id", "user_b_id", name="unique_sync_pair"),
    )

    # Relacionamentos virtuais
    user_a = relationship("User", foreign_keys=[user_a_id])
    user_b = relationship("User", foreign_keys=[user_b_id])
