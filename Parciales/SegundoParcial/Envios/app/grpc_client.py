import grpc
import os
import vehiculos_pb2
import vehiculos_pb2_grpc

VEHICULOS_GRPC_HOST = os.getenv("VEHICULOS_GRPC_HOST", "disponibilidad-service")
VEHICULOS_GRPC_PORT = os.getenv("VEHICULOS_GRPC_PORT", "50051")

def verificar_disponibilidad(vehiculo_id):
    try:
        channel = grpc.insecure_channel(f"{VEHICULOS_GRPC_HOST}:{VEHICULOS_GRPC_PORT}")
        stub = vehiculos_pb2_grpc.VehiculoServiceStub(channel)
        request = vehiculos_pb2.VerificarDisponibilidadRequest(id=vehiculo_id)
        response = stub.VerificarDisponibilidad(request)
        return response.disponible
    except Exception as e:
        print("Error gRPC:", e)
        return False
