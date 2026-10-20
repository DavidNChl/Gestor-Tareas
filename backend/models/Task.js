const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  priority: { 
    type: DataTypes.ENUM('baja', 'media', 'alta'), 
    defaultValue: 'media' 
  },
  dueDate: { type: DataTypes.DATEONLY, allowNull: true }, 
  completed: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Task;