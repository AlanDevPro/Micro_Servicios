import graphene
from datetime import date
from .database import SessionLocal, engine
from .models import Envio, Base
from .grpc_client import verificar_disponibilidad

Base.metadata.create_all(bind=engine)

class EnvioType(graphene.ObjectType):
    id = graphene.ID()
    usuario_id = graphene.Int()
    vehiculo_id = graphene.String()
    origen = graphene.String()
    destino = graphene.String()
    fecha_envio = graphene.String()
    estado = graphene.String()

class EnvioInput(graphene.InputObjectType):
    usuario_id = graphene.Int(required=True)
    vehiculo_id = graphene.String()
    origen = graphene.String(required=True)
    destino = graphene.String(required=True)
    fecha_envio = graphene.String()

class CrearEnvio(graphene.Mutation):
    class Arguments:
        data = EnvioInput(required=True)
    Output = EnvioType

    def mutate(root, info, data=None):
        db = SessionLocal()
        if data.vehiculo_id and not verificar_disponibilidad(data.vehiculo_id):
            raise Exception("Vehículo no disponible")

        nuevo = Envio(
            usuario_id=data.usuario_id,
            vehiculo_id=data.vehiculo_id,
            origen=data.origen,
            destino=data.destino,
            fecha_envio=date.fromisoformat(data.fecha_envio) if data.fecha_envio else None,
            estado="pendiente"
        )
        db.add(nuevo)
        db.commit()
        db.refresh(nuevo)
        return nuevo

class Query(graphene.ObjectType):
    envios = graphene.List(EnvioType)
    def resolve_envios(self, info):
        db = SessionLocal()
        return db.query(Envio).all()

class Mutation(graphene.ObjectType):
    crear_envio = CrearEnvio.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
