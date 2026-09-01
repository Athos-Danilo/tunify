import os
import sys
import datetime

# Adiciona o diretório atual ao PYTHONPATH para importar os módulos da app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.history import MonthlyHistory

def clean_old_history():
    db = SessionLocal()
    try:
        # A meia-noite do dia 1º de Agosto no Brasil equivale a 03:00 UTC
        limite = datetime.datetime(2026, 8, 1, 3, 0, 0, tzinfo=datetime.timezone.utc)
        
        registros_antigos = db.query(MonthlyHistory).filter(MonthlyHistory.played_at < limite).count()
        print(f"Encontrados {registros_antigos} registros antigos (antes de Agosto no Brasil).")
        
        if registros_antigos > 0:
            db.query(MonthlyHistory).filter(MonthlyHistory.played_at < limite).delete()
            db.commit()
            print("Registros antigos apagados com sucesso!")
        else:
            print("Nada para apagar.")
    except Exception as e:
        print(f"Erro ao limpar: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clean_old_history()
