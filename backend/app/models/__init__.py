# Este arquivo transforma a pasta 'models' em um pacote Python.
# Aqui nós importamos todos os modelos para que eles fiquem centralizados.

# Importa o modelo de Usuário
from .user import User

# Importa os modelos de Histórico que criamos no arquivo history.py
from .history import MonthlyHistory, TopTwoHundred, MinutesListened


# Importa o modelo de Cache de Músicas
from .track import TrackCache
