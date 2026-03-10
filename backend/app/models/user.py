# Ferramentas do SQLAlchemy para definir o tipo de cada coluna no banco de dados.
from sqlalchemy import Column, Integer, String

# Importa a classe Base no database.py.
from app.core.database import Base


# ======> O Molde da Tabela de Usuários.
# 1) Herda a classe 'Base' para o SQLAlchemy saber que isso vai virar uma tabela real;
# 2) Define o nome exato da tabela lá no PostgreSQL;
# 3) Cria cada coluna especificando o tipo de dado e as regras.
# -------------------------------------------------------------------------------------- #
class User(Base):
    __tablename__ = "users"

    # 1. Chave Primária (ID)
    id = Column(Integer, primary_key=True, index=True)

    # 2. Identificador Único do Spotify
    spotify_id = Column(String, unique=True, index=True, nullable=False)

    # 3. Nome de Exibição
    display_name = Column(String, nullable=True)

    # 4. E-mail
    email = Column(String, unique=True, index=True, nullable=True)
    
    # 5. Access Token - Responsável por abrir a porta do Spotify.
    access_token = Column(String, nullable=False)

    # 6. Refresh Token
    # É a chave que usamos para gerar um novo Access Token quando ele vence depois de 1 hora.
    refresh_token = Column(String, nullable=True)