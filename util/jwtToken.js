const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.createToken = async (userData) =>{
    try{
        return jwt.sign(userData, process.env.JWT_SK)
    }
    catch(err){
        console.log("JWT Generation Error : " + err)
    }
}

exports.verifyToken = async (userToken) =>{
    try{
        return jwt.verify(userToken, process.env.JWT_SK)
    }
    catch(err){
        console.log("JWT Generation Error : " + err)
    }
}