const { Sequelize } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('task_management', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
