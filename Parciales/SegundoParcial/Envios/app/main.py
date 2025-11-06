from fastapi import FastAPI
import strawberry
from strawberry.asgi import GraphQL
from app.database import init_db
from app.models import Envio
from app.database import SessionLocal


init_db()

@strawberry.type
class EnvioType:
    id: int
    usuario_id: int
    vehiculo_id: int
    origen: str
    destino: str
    fecha_envio: str
    estado: str


@strawberry.type
class Query:
    @strawberry.field
    def envios(self) -> list[EnvioType]:
        db = SessionLocal()
        envs = db.query(Envio).all()
        return [
            EnvioType(
                id=e.id,
                usuario_id=e.usuario_id,
                vehiculo_id=e.vehiculo_id,
                origen=e.origen,
                destino=e.destino,
                fecha_envio=str(e.fecha_envio),
                estado=e.estado,
            )
            for e in envs
        ]


@strawberry.type
class Mutation:
    @strawberry.mutation
    def crear_envio(
        self,
        usuario_id: int,
        vehiculo_id: int,
        origen: str,
        destino: str,
        fecha_envio: str,
        estado: str,
    ) -> EnvioType:
        db = SessionLocal()
        nuevo = Envio(
            usuario_id=usuario_id,
            vehiculo_id=vehiculo_id,
            origen=origen,
            destino=destino,
            fecha_envio=fecha_envio,
            estado=estado,
        )
        db.add(nuevo)
        db.commit()
        db.refresh(nuevo)
        return EnvioType(
            id=nuevo.id,
            usuario_id=nuevo.usuario_id,
            vehiculo_id=nuevo.vehiculo_id,
            origen=nuevo.origen,
            destino=nuevo.destino,
            fecha_envio=str(nuevo.fecha_envio),
            estado=nuevo.estado,
        )


schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQL(schema)

# 🔹 Crear app FastAPI
app = FastAPI(title="Microservicio de Envíos (Strawberry GraphQL)")
app.add_route("/graphql", graphql_app)
app.add_websocket_route("/graphql", graphql_app)

@app.get("/")
def home():
    return {"mensaje": "Microservicio de Envíos activo - Strawberry GraphQL"}
