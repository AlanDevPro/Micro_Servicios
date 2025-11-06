import { Vehiculo } from "../models/vehiculo.model.js";


export const listarVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const crearVehiculo = async (req, res) => {
  try {
    const { placa, tipo, capacidad, estado } = req.body;
    const nuevo = new Vehiculo({
      placa,
      tipo,
      capacidad,
      estado,
      idUsuario: req.user.id
    });
    await nuevo.save();
    res.status(201).json({ mensaje: "Vehículo creado correctamente", vehiculo: nuevo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Vehiculo.findByIdAndUpdate(id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    res.json({ mensaje: "Vehículo actualizado", vehiculo: actualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const eliminarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Vehiculo.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    res.json({ mensaje: "Vehículo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
