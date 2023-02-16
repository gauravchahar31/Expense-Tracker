require('dotenv').config()

const Sequelize = require('sequelize');
// const sequelize = new Sequelize(
//     process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//         dialect: 'mysql',
//         host: process.env.DB_HOST
//     }
// )

const sequelize = new Sequelize('mysql://doadmin:AVNS_2VuH6odA4Pbfs4yvNaG@expense-tracker-sql-do-user-11576395-0.b.db.ondigitalocean.com:25060/expenseTracker?ssl-mode=REQUIRED')

module.exports = sequelize;