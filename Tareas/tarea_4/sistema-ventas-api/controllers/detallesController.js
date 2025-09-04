const DetalleFactura = require('../models/DetalleFactura');
const Factura = require('../models/Factura');
const Producto = require('../models/Producto');

exports.getDetallesByFactura = async (req, res, next) => {
  try {
    const detalles = await DetalleFactura.findAll({
      where: { facturaId: req.params.facturaId },
      include: Producto
    });
    res.json(detalles);
  } catch (err) {
    next(err);
  }
};

exports.createDetalle = async (req, res, next) => {
  try {
    const { facturaId, productoId, cantidad, precio } = req.body;
    const factura = await Factura.findByPk(facturaId);
    const producto = await Producto.findByPk(productoId);
    if (!factura) return res.status(404).json({ msg: 'Factura no encontrada' });
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    const detalle = await DetalleFactura.create({ facturaId, productoId, cantidad, precio });
    res.status(201).json(detalle);
  } catch (err) {
    next(err);
  }
};

exports.updateDetalle = async (req, res, next) => {
  try {
    const detalle = await DetalleFactura.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ msg: 'Detalle no encontrado' });
    await detalle.update(req.body);
    res.json(detalle);
  } catch (err) {
    next(err);
  }
};

exports.deleteDetalle = async (req, res, next) => {
  try {
    const detalle = await DetalleFactura.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ msg: 'Detalle no encontrado' });
    await detalle.destroy();
    res.json({ msg: 'Detalle eliminado' });
  } catch (err) {
    next(err);
  }
};
