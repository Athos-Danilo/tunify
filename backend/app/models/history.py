import datetime

# Ferramentas do SQLAlchemy para definir o tipo de cada coluna no banco de dados.
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

# Ferramenta para criar os relacionamentos virtuais (JOINs) entre as tabelas no Python.
from sqlalchemy.orm import relationship

# Importa a classe Base no database.py.
from app.core.database import Base


# ======> O Molde da Tabela de Histórico Mensal.
# 1) Herda a classe 'Base' para o SQLAlchemy saber que isso vai virar uma tabela real;
# 2) Define o nome exato da tabela lá no PostgreSQL;
# 3) Cria cada coluna especificando o tipo de dado e as regras.
# -------------------------------------------------------------------------------------- #
class MonthlyHistory(Base):
    __tablename__ = "monthly_history"

    # 1. Chave Primária (ID)
    id = Column(Integer, primary_key=True, index=True)

    # 2. ID do Usuário (Chave Estrangeira)
    # Liga esse histórico ao dono da conta. O ondelete="CASCADE" garante que, 
    # se o usuário excluir a conta no Tunify, todo o histórico dele é apagado junto!
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    # 3. ID da Música no Spotify
    # Salvamos só o ID! O nome e a capa ficam no cache geral para economizar espaço do banco.
    spotify_track_id = Column(String, index=True, nullable=False)

    # 4. Data e Hora do Play
    # Exatamente o momento em que a música foi ouvida. Indexado para buscas rápidas do robô.
    played_at = Column(DateTime(timezone=True), index=True, nullable=False)

    # 5. Relacionamento Virtual
    # Não cria coluna no banco, mas permite fazer `historico.user.display_name` direto no Python.
    user = relationship("User", backref="stream_history")


# ======> O Molde da Tabela do Top 200.
# 1) Herda a classe 'Base' para o SQLAlchemy;
# 2) Define o nome exato da tabela lá no PostgreSQL;
# 3) Cria cada coluna para guardar o resumão que o robô faz no dia 1º de cada mês.
# -------------------------------------------------------------------------------------- #
class TopTwoHundred(Base):
    __tablename__ = "top_two_hundred"

    # 1. Chave Primária (ID)
    id = Column(Integer, primary_key=True, index=True)

    # 2. ID do Usuário (Chave Estrangeira)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    # 3. Mês de Referência
    # Vital para sabermos de qual mês é o ranking (Exemplo: "2026-04").
    mes_referencia = Column(String, index=True, nullable=False)

    # 4. ID da Música no Spotify
    spotify_track_id = Column(String, nullable=False)

    # 5. Contagem de Plays
    # A soma total de vezes que o usuário ouviu essa música no mês inteiro.
    play_count = Column(Integer, nullable=False)

    # 6. Posição no Ranking
    # Qual foi a posição dessa música naquele mês (vai de 1 a 200).
    rank_position = Column(Integer, nullable=False)

    # 7. Data de Criação
    # Carimba o momento exato em que o nosso robô fez o fechamento e salvou esse dado.
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    # 8. Relacionamento Virtual
    user = relationship("User", backref="top_tracks_history")