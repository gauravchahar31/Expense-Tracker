const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const Expense = sequelize.define('Expense', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNul : false
    },
    amount : {
        type : Sequelize.INTEGER,
        allowNul : false
    },
    description : {
        type : Sequelize.STRING,
        allowNul : false
    },
    category : {
        type : Sequelize.STRING,
        allowNul : false
    }
});

module.exports = Expense;