# Ferramenta para validação rigorosa de dados.
from pydantic import BaseModel
# Tipos para ajudar o Python a saber exatamente o que esperar.
from typing import Optional, Literal
from datetime import datetime

# ======> Molde (Schema) da Letra.
# 1) Espelha perfeitamente a coleção 'Letras' do MongoDB;
# 2) Garante que nenhum dado entre no banco de dados faltando ou com o tipo errado;
# 3) Trabalha em sincronia com o microserviço em Go.
# ---------------------------------------------------------------------------------- #
class LetraSchema(BaseModel):
    id_musica_spotify: str
    id_usuario: str
    nome_musica: str
    nome_artista: str
    status: Literal["PENDENTE", "PROCESSANDO", "CONCLUIDO", "NAO_ENCONTRADA"]
    texto_letra: Optional[str] = None
    sincronizada: bool = False
    fonte_letra: Optional[str] = None
    tentativas_processamento: int = 0
    criado_em: datetime
    atualizado_em: datetime
