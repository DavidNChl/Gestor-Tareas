const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false, 
    validate: { isEmail: { msg: 'Debe ingresar un email válido' } } 
  },
  password: { type: DataTypes.STRING, allowNull: false }
});

module.exports = User;