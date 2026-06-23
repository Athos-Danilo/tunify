# Este arquivo transforma a pasta 'models' em um pacote Python.
# Aqui nós importamos todos os modelos para que eles fiquem centralizados.

# Importa o modelo de Usuário
from .user import User

# Importa os modelos de Histórico que criamos no arquivo history.py
from .history import MonthlyHistory, TopTwoHundred, MinutesListened, MonthlyTopArtist, MonthlyTopTrack


# Importa o modelo de Cache de Músicas e Artistas
from .track import TrackCache
from .artist import ArtistCache

# Importa o modelo de Metadados do Sistema
from .system import SystemMetadata

# Importa os modelos de Selos e Conquistas
from .selo import SeloCatalog, UserSelo

