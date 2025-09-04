const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Factura = require('./Factura');
const Producto = require('./Producto');

const DetalleFactura = sequelize.define('DetalleFactura', {
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.FLOAT, allowNull: false }
});

DetalleFactura.belongsTo(Factura, { foreignKey: 'facturaId', onDelete: 'CASCADE' });
Factura.hasMany(DetalleFactura, { foreignKey: 'facturaId' });

DetalleFactura.belongsTo(Producto, { foreignKey: 'productoId' });
Producto.hasMany(DetalleFactura, { foreignKey: 'productoId' });

module.exports = DetalleFactura;
