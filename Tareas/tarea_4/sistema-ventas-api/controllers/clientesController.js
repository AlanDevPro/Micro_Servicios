const Cliente = require('../models/Cliente');

exports.getClientes = async (req, res, next) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (err) {
    next(err);
  }
};

exports.getClienteById = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    next(err);
  }
};

exports.createCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    next(err);
  }
};

exports.updateCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' });
    await cliente.update(req.body);
    res.json(cliente);
  } catch (err) {
    next(err);
  }
};

exports.deleteCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' });
    await cliente.destroy();
    res.json({ msg: 'Cliente eliminado' });
  } catch (err) {
    next(err);
  }
};




// Actualizar y eliminar siguen un patrón similar
