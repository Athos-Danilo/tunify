import datetime

# Ferramentas do SQLAlchemy para definir o tipo de cada coluna no banco de dados.
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, UniqueConstraint

# Ferramenta para criar os relacionamentos virtuais (JOINs) entre as tabelas no Python.
from sqlalchemy.orm import relationship

# Importa a classe Base no database.py.
from app.core.database import Base


# ======> O Molde da Tabela do Catálogo de Selos.
# 1) Herda a classe 'Base' para o SQLAlchemy saber que isso vai virar uma tabela real;
# 2) Define o nome exato da tabela no PostgreSQL ('selos_catalog');
# 3) Contém todos os selos permanentes, mensais e anuais disponíveis no sistema.
# -------------------------------------------------------------------------------------- #
class SeloCatalog(Base):
    __tablename__ = "selos_catalog"

    # 1. ID do Selo (Chave Primária)
    id = Column(Integer, primary_key=True, index=True)

    # 2. Nome do Selo (Exemplo: "Ouvido de Ouro")
    name = Column(String(150), nullable=False)

    # 3. Descrição da Conquista
    description = Column(Text, nullable=False)

    # 4. Tipo do Selo (Pode ser: 'permanent', 'monthly', 'yearly')
    badge_type = Column(String(50), nullable=False)

    # 5. Caminho do Ícone / Asset (URL ou caminho local)
    icon_path = Column(String(255), nullable=False)

    # 6. Tipo do Critério (Exemplo: 'minutes_played', 'songs_favorited')
    criteria_type = Column(String(100), nullable=False)

    # 7. Valor Limiar do Critério para Desbloqueio (Exemplo: 10000 para 10.000 minutos)
    criteria_value = Column(Integer, nullable=False)

    # 8. Data de Criação do Selo no Catálogo
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)


# ======> O Molde da Tabela de Selos Conquistados pelos Usuários.
# 1) Registra qual usuário conquistou qual selo e em qual período de referência;
# 2) Contém chaves estrangeiras rígidas para 'users' e 'selos_catalog';
# 3) Garante a restrição de unicidade composta para evitar conquistas duplicadas no mesmo período.
# -------------------------------------------------------------------------------------- #
class UserSelo(Base):
    __tablename__ = "user_selos"

    # 1. ID do Registro (Chave Primária)
    id = Column(Integer, primary_key=True, index=True)

    # 2. ID do Usuário (Chave Estrangeira com CASCADE)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    # 3. ID do Selo (Chave Estrangeira com CASCADE)
    selo_id = Column(Integer, ForeignKey("selos_catalog.id", ondelete="CASCADE"), index=True, nullable=False)

    # 4. Data e Hora do Desbloqueio
    unlocked_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    # 5. Período de Referência da Conquista
    # Pode ser NULL (para permanentes), 'YYYY-MM' (mensais) ou 'YYYY' (anuais)
    reference_period = Column(String(7), nullable=True)

    # 6. Flag de Fixação (Se o usuário destacou esse selo no perfil - máximo de 3)
    is_pinned = Column(Boolean, default=False, nullable=False)

    # 7. Flag de Notificação (Se o usuário já foi notificado visualmente da conquista)
    notified = Column(Boolean, default=False, nullable=False)

    # Restrição Única Composta: Garante que um usuário não ganhe o mesmo selo mais de uma vez
    # no mesmo período de referência (Exemplo: duas vezes o Top 1% de Billie Eilish em '2026-05')
    __table_args__ = (
        UniqueConstraint("user_id", "selo_id", "reference_period", name="unique_user_selo_period"),
    )

    # Relacionamentos virtuais (ORM) para hidratação rápida de dados no Python
    user = relationship("User", backref="badges")
    selo = relationship("SeloCatalog", backref="unlocked_by")
