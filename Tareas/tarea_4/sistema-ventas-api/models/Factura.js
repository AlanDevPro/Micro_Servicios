const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cliente = require('./Cliente');

const Factura = sequelize.define('Factura', {
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

Factura.belongsTo(Cliente, { foreignKey: 'clienteId', onDelete: 'CASCADE' });
Cliente.hasMany(Factura, { foreignKey: 'clienteId' });

module.exports = Factura;
