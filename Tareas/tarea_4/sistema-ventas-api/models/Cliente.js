const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cliente = sequelize.define('Cliente', {
  ci: { type: DataTypes.STRING, allowNull: false, unique: true },
  nombres: { type: DataTypes.STRING, allowNull: false },
  apellidos: { type: DataTypes.STRING, allowNull: false },
  sexo: { type: DataTypes.ENUM('M', 'F'), allowNull: false }
});

module.exports = Cliente;
