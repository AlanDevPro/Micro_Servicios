const Factura = require('../models/Factura');
const Cliente = require('../models/Cliente');
const DetalleFactura = require('../models/DetalleFactura');

exports.getFacturas = async (req, res, next) => {
  try {
    const facturas = await Factura.findAll({ include: Cliente });
    res.json(facturas);
  } catch (err) {
    next(err);
  }
};

exports.getFacturaById = async (req, res, next) => {
  try {
    const factura = await Factura.findByPk(req.params.id, { include: Cliente });
    if (!factura) return res.status(404).json({ msg: 'Factura no encontrada' });
    res.json(factura);
  } catch (err) {
    next(err);
  }
};

exports.createFactura = async (req, res, next) => {
  try {
    const { clienteId, fecha } = req.body;
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' });
    const factura = await Factura.create({ clienteId, fecha });
    res.status(201).json(factura);
  } catch (err) {
    next(err);
  }
};

exports.updateFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    if (!factura) return res.status(404).json({ msg: 'Factura no encontrada' });
    await factura.update(req.body);
    res.json(factura);
  } catch (err) {
    next(err);
  }
};

exports.deleteFactura = async (req, res, next) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    if (!factura) return res.status(404).json({ msg: 'Factura no encontrada' });
    await factura.destroy();
    res.json({ msg: 'Factura eliminada' });
  } catch (err) {
    next(err);
  }
};

exports.getFacturasByCliente = async (req, res, next) => {
  try {
    const facturas = await Factura.findAll({ where: { clienteId: req.params.clienteId } });
    res.json(facturas);
  } catch (err) {
    next(err);
  }
};
