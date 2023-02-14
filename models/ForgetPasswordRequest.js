const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const ForgetPasswordRequest = sequelize.define('ForgetPasswordRequest', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNul : false
    },
    uuid : {
        type : Sequelize.STRING
    },
    isActive : {
        type: Sequelize.BOOLEAN
    }
});

module.exports = ForgetPasswordRequest;