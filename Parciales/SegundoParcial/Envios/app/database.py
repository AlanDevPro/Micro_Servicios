import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv


load_dotenv()


MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_DB = os.getenv("MYSQL_DB", "envios_db")


DATABASE_URL = f"mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"


engine = create_engine(DATABASE_URL, echo=True)


SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


def init_db():
    """
    Crea todas las tablas declaradas en los modelos SQLAlchemy.
    """
    from app.models import Envio  
    Base.metadata.create_all(bind=engine)
    print("✅ Base de datos inicializada correctamente")
