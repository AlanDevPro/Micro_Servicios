from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class Envio(Base):
    __tablename__ = "envios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, nullable=False)
    vehiculo_id = Column(Integer, nullable=False)
    origen = Column(String(255), nullable=False)
    destino = Column(String(255), nullable=False)
    fecha_envio = Column(Date, nullable=False)
    estado = Column(String(50), nullable=False)
