import os
import secrets
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.user import User
from app.models.sync import SyncInvite, SyncConnection
from app.schemas.sync import (
    SyncPermissionsSchema,
    InviteDetailsResponse,
    UserPublicInfo,
    InviteSummaryResponse,
    ConnectionResponse
)


class SyncService:

    @staticmethod
    def _expirou(convite: SyncInvite) -> bool:
        # SQLite não preserva timezone; PostgreSQL preserva.
        expires_at = convite.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        return expires_at <= datetime.now(timezone.utc)

    @staticmethod
    def _gerar_codigo_convite() -> str:
        """Gera um token criptograficamente seguro e amigável (ex: 'vibe-7xK9pL2mQy8A')"""
        slug = secrets.token_urlsafe(9).replace("-", "").replace("_", "")[:12]
        return f"vibe-{slug}"

    @staticmethod
    def _obter_base_frontend_url() -> str:
        """Obtém a URL base do frontend para montar o link completo"""
        return os.getenv("FRONTEND_URL", "http://localhost:4200").rstrip("/")

    @classmethod
    def criar_convite(
        cls, 
        db: Session, 
        sender: User, 
        permissoes: SyncPermissionsSchema
    ) -> SyncInvite:
        """
        Cria um novo convite de sincronização com permissões personalizadas
        e validade de 7 dias.
        """
        codigo = cls._gerar_codigo_convite()
        # Garante que o código não colida
        while db.query(SyncInvite).filter(SyncInvite.invite_code == codigo).first():
            codigo = cls._gerar_codigo_convite()

        agora = datetime.now(timezone.utc)
        expira_em = agora + timedelta(days=7)

        novo_convite = SyncInvite(
            sender_id=sender.id,
            invite_code=codigo,
            permissions=permissoes.model_dump(),
            status="PENDENTE",
            expires_at=expira_em,
            created_at=agora
        )

        db.add(novo_convite)
        db.commit()
        db.refresh(novo_convite)
        return novo_convite

    @classmethod
    def obter_detalhes_convite(
        cls, 
        db: Session, 
        codigo: str, 
        current_user: Optional[User] = None
    ) -> InviteDetailsResponse:
        """
        Busca os dados públicos de um convite para o convidado inspecionar.
        """
        convite = db.query(SyncInvite).filter(SyncInvite.invite_code == codigo).with_for_update().first()
        if not convite:
            raise ValueError("CONVITE_NAO_ENCONTRADO")

        # Checa expiração dinâmica
        if convite.status == "PENDENTE" and cls._expirou(convite):
            convite.status = "EXPIRADO"
            db.commit()

        sender = convite.sender
        sender_nome = sender.display_name or sender.email.split("@")[0] if sender.email else "Usuário do Tunify"

        is_owner = current_user is not None and sender.id == current_user.id
        is_already_connected = False
        if current_user is not None and not is_owner:
            user_a_id, user_b_id = sorted((sender.id, current_user.id))
            is_already_connected = db.query(SyncConnection.id).filter(
                SyncConnection.user_a_id == user_a_id,
                SyncConnection.user_b_id == user_b_id,
                SyncConnection.status == "ACTIVE",
            ).first() is not None

        is_valid = (convite.status == "PENDENTE")

        mensagem = None
        if convite.status == "ACEITO":
            mensagem = "Este convite já foi utilizado e conectado!"
        elif convite.status == "EXPIRADO":
            mensagem = "Este convite expirou. Peça ao seu amigo para gerar um novo link!"
        elif convite.status == "REVOGADO":
            mensagem = "Este convite foi cancelado pelo remetente."

        return InviteDetailsResponse(
            invite_code=convite.invite_code,
            sender=UserPublicInfo(
                id=sender.id,
                nome=sender_nome,
                foto_perfil=None # O frontend hidrata caso tenha em cache ou busca do Spotify
            ),
            permissions=SyncPermissionsSchema.model_validate(convite.permissions or {}),
            expires_at=convite.expires_at,
            status=convite.status,
            is_valid=is_valid,
            is_owner=is_owner,
            is_already_connected=is_already_connected,
            message=mensagem
        )

    @classmethod
    def aceitar_convite(
        cls,
        db: Session,
        codigo: str,
        receiver: User,
        receiver_permissions: SyncPermissionsSchema
    ) -> SyncConnection:
        """
        Efetiva a conexão bidirecional entre dois usuários a partir de um convite válido.
        """
        convite = db.query(SyncInvite).filter(SyncInvite.invite_code == codigo).with_for_update().first()
        if not convite:
            raise ValueError("CONVITE_NAO_ENCONTRADO")

        agora = datetime.now(timezone.utc)
        if convite.status == "PENDENTE" and cls._expirou(convite):
            convite.status = "EXPIRADO"
            db.commit()
        if convite.status == "EXPIRADO":
            raise ValueError("CONVITE_EXPIRADO")

        if convite.status != "PENDENTE":
            raise ValueError(f"CONVITE_INVALIDO_{convite.status}")

        if convite.sender_id == receiver.id:
            raise ValueError("AUTO_CONEXAO_PROIBIDA")

        # Ordena os IDs para respeitar a restrição UNIQUE(user_a_id, user_b_id)
        user_a_id = min(convite.sender_id, receiver.id)
        user_b_id = max(convite.sender_id, receiver.id)

        # Serializa conexões do mesmo par, inclusive convites diferentes.
        db.query(User).filter(User.id.in_([user_a_id, user_b_id])).order_by(User.id).with_for_update().all()

        # Verifica se já são amigos conectados
        conexao_existente = db.query(SyncConnection).filter(
            SyncConnection.user_a_id == user_a_id,
            SyncConnection.user_b_id == user_b_id
        ).first()

        if conexao_existente and conexao_existente.status == "BLOCKED":
            raise ValueError("CONVITE_INVALIDO_BLOCKED")

        if conexao_existente and conexao_existente.status == "ACTIVE":
            raise ValueError("JA_CONECTADOS")

        # Mapeia as permissões mútuas no par ordenado
        if convite.sender_id == user_a_id:
            perm_a_to_b = convite.permissions
            perm_b_to_a = receiver_permissions.model_dump()
        else:
            perm_a_to_b = receiver_permissions.model_dump()
            perm_b_to_a = convite.permissions

        if conexao_existente:
            # Reativa se estava inativa
            conexao_existente.status = "ACTIVE"
            conexao_existente.permissions_a_to_b = perm_a_to_b
            conexao_existente.permissions_b_to_a = perm_b_to_a
            nova_conexao = conexao_existente
        else:
            nova_conexao = SyncConnection(
                user_a_id=user_a_id,
                user_b_id=user_b_id,
                permissions_a_to_b=perm_a_to_b,
                permissions_b_to_a=perm_b_to_a,
                status="ACTIVE",
                created_at=agora
            )
            db.add(nova_conexao)

        # Marca convite como aceito
        convite.status = "ACEITO"
        convite.accepted_by_id = receiver.id

        db.commit()
        db.refresh(nova_conexao)
        return nova_conexao

    @classmethod
    def revogar_convite(cls, db: Session, codigo: str, user: User) -> bool:
        """Cancela um convite pendente criado pelo usuário"""
        convite = db.query(SyncInvite).filter(
            SyncInvite.invite_code == codigo,
            SyncInvite.sender_id == user.id
        ).with_for_update().first()

        if not convite:
            raise ValueError("CONVITE_NAO_ENCONTRADO")

        if convite.status == "ACEITO":
            raise ValueError("CONVITE_JA_ACEITO")

        convite.status = "REVOGADO"
        db.commit()
        return True

    @classmethod
    def listar_convites_ativos(cls, db: Session, user: User) -> List[InviteSummaryResponse]:
        """Lista os convites pendentes do usuário"""
        agora = datetime.now(timezone.utc)
        convites = db.query(SyncInvite).filter(
            SyncInvite.sender_id == user.id,
            SyncInvite.status == "PENDENTE",
            SyncInvite.expires_at > agora
        ).order_by(SyncInvite.created_at.desc()).all()

        base_url = cls._obter_base_frontend_url()

        resultado = []
        for c in convites:
            resultado.append(InviteSummaryResponse(
                id=c.id,
                invite_code=c.invite_code,
                invite_url=f"{base_url}/sync/convite/{c.invite_code}",
                permissions=SyncPermissionsSchema.model_validate(c.permissions or {}),
                status=c.status,
                expires_at=c.expires_at,
                created_at=c.created_at
            ))
        return resultado

    @classmethod
    def listar_conexoes(cls, db: Session, user: User) -> List[ConnectionResponse]:
        """Lista todos os amigos ativos sincronizados com o usuário"""
        conexoes = db.query(SyncConnection).filter(
            or_(SyncConnection.user_a_id == user.id, SyncConnection.user_b_id == user.id),
            SyncConnection.status == "ACTIVE"
        ).order_by(SyncConnection.created_at.desc()).all()

        return [cls.formatar_conexao(c, user) for c in conexoes]

    @staticmethod
    def formatar_conexao(c: SyncConnection, user: User) -> ConnectionResponse:
        if c.user_a_id == user.id:
            amigo = c.user_b
            minhas_permissoes = c.permissions_a_to_b
            permissoes_amigo = c.permissions_b_to_a
        else:
            amigo = c.user_a
            minhas_permissoes = c.permissions_b_to_a
            permissoes_amigo = c.permissions_a_to_b
        return ConnectionResponse(
            connection_id=c.id,
            amigo=UserPublicInfo(
                id=amigo.id,
                nome=amigo.display_name or (amigo.email.split("@")[0] if amigo.email else "Amigo Tunify"),
                foto_perfil=None,
            ),
            minhas_permissoes_para_ele=SyncPermissionsSchema.model_validate(minhas_permissoes),
            permissoes_dele_para_mim=SyncPermissionsSchema.model_validate(permissoes_amigo),
            status=c.status,
            created_at=c.created_at,
        )


    @classmethod
    def _conexao_do_usuario(cls, db: Session, connection_id: int, user: User) -> SyncConnection:
        conexao = db.query(SyncConnection).filter(
            SyncConnection.id == connection_id,
            or_(SyncConnection.user_a_id == user.id, SyncConnection.user_b_id == user.id),
            SyncConnection.status == "ACTIVE",
        ).with_for_update().first()
        if not conexao:
            raise ValueError("CONEXAO_NAO_ENCONTRADA")
        return conexao

    @classmethod
    def atualizar_permissoes(cls, db: Session, connection_id: int, user: User,
                             permissoes: SyncPermissionsSchema) -> SyncConnection:
        conexao = cls._conexao_do_usuario(db, connection_id, user)
        if conexao.user_a_id == user.id:
            conexao.permissions_a_to_b = permissoes.model_dump()
        else:
            conexao.permissions_b_to_a = permissoes.model_dump()
        db.commit()
        return conexao

    @classmethod
    def desconectar(cls, db: Session, connection_id: int, user: User) -> None:
        conexao = cls._conexao_do_usuario(db, connection_id, user)
        conexao.status = "PAUSED"
        db.commit()
