import grpc
from concurrent import futures
import time
import os
import vehiculos_pb2
import vehiculos_pb2_grpc
from dotenv import load_dotenv

load_dotenv()

class VehiculoService(vehiculos_pb2_grpc.VehiculoServiceServicer):
    def VerificarDisponibilidad(self, request, context):
        vehiculo_id = request.id
        print(f"Verificando disponibilidad del vehículo: {vehiculo_id}")

        # 🔹 Aquí podrías conectar con MongoDB del servicio de Vehículos
        # o aplicar lógica simple
        disponible = vehiculo_id != "" and not vehiculo_id.startswith("X")

        return vehiculos_pb2.VerificarDisponibilidadResponse(disponible=disponible)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    vehiculos_pb2_grpc.add_VehiculoServiceServicer_to_server(VehiculoService(), server)

    port = os.getenv("PORT", "50051")
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"🚀 Servidor gRPC de Disponibilidad escuchando en puerto {port}")

    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == "__main__":
    serve()
