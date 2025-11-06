import mongoose from "mongoose";

const vehiculoSchema = new mongoose.Schema({
  placa: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ["camión", "furgón", "moto"], required: true },
  capacidad: { type: Number, required: true },
  estado: { type: String, enum: ["disponible", "en ruta", "mantenimiento"], default: "disponible" },
  idUsuario: { type: Number, required: true } 
}, { timestamps: true });

export const Vehiculo = mongoose.model("Vehiculo", vehiculoSchema);
