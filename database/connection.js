const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'expenseTracker', 'root', 'password', {
        dialect: 'mysql',
        host: 'localhost'
    }
)

module.exports = sequelize;