const mongoose = require('mongoose')
const encryption = require('../util/encryptPassword')
const jwt = require('../util/jwtToken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    jwt: {
        type: String,
        required: true
    },
    isPremium:{
        type: Boolean,
        required: true
    }
})

userSchema.pre("validate", async function (next){
    this.isPremium = false;
    this.jwt = await jwt.createToken(this.email)
    next()
})

userSchema.pre("save", async function (next){
    if(this.isModified('password')){
        const encryptedPassword = await encryption.encryptPassword(this.password);
        this.password = encryptedPassword
    }
    next()
})

const Users = new mongoose.model("User", userSchema)

module.exports = Users