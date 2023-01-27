const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const Order = sequelize.define('Order', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNul : false
    },
    ordder_id : {
        type : Sequelize.STRING,
    },
    payment_id : {
        type : Sequelize.STRING,
    },
    status : {
        type : Sequelize.STRING,
    },
});

module.exports = Order;