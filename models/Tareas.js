const Sequelize = require('sequelize');
const Proyectos = require('./Proyectos');
const db = require('../config/db');

const Tareas = db.define('tareas', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tarea: Sequelize.STRING(100),
  estado: Sequelize.INTEGER(1)
});

Tareas.belongsTo(Proyectos);

module.exports = Tareas;
