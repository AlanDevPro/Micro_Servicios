const Producto = require('../models/Producto');

exports.getProductos = async (req, res, next) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (err) {
    next(err);
  }
};

exports.getProductoById = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    next(err);
  }
};

exports.createProducto = async (req, res, next) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
};

exports.updateProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    await producto.update(req.body);
    res.json(producto);
  } catch (err) {
    next(err);
  }
};

exports.deleteProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    await producto.destroy();
    res.json({ msg: 'Producto eliminado' });
  } catch (err) {
    next(err);
  }
};
