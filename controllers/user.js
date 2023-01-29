const path = require('path');
const sequelize = require('../database/connection');
const User = require('../models/User');
const ForgetPasswordRequest = require('../models/ForgetPasswordRequest');
const passwordEncryption = require('../util/encryptPassword');
const jwtToken = require('../util/jwtToken');
const mailSystem = require('../util/mails');
const {v4 : uuidv4} = require('uuid');
const rootDir = path.dirname(require.main.filename);

exports.createNewUser = async (req, res) => {
    try{
        const user = await User.findOne({
            where : {
                email : req.body.userEmail
            }
        });
        if(!user){
            const jwt = await jwtToken.createToken(req.body.userEmail);
            req.body.userPassword = await passwordEncryption.encryptPassword(req.body.userPassword);
            User.create({
                name: req.body.userName,
                email: req.body.userEmail,
                password: req.body.userPassword,
                jwt : jwt
            }).then(result => {
                res.send('User Created, Please Login')
            }).catch(err => {
                res.send('Something went wrong!')
            }); 
        }else{
            res.send('Email Already Exists!')
        }
    }
    catch(err){
        console.error(err);
    }
}

exports.checkUser = async (req, res) => {
    try{
        const user = await(User.findOne({
            where : {
                email : req.body.userEmail
            }
        }));
        if(user){
            res.send(true);
        }else{
            res.send(false);
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.authenicateUser = async (req, res) => {
    try{
        const user = await User.findOne({
            where : {
                email : req.body.userEmail
            }
        });
        if(user){
            if(await passwordEncryption.decryptPassword(req.body.userPassword, user.password)){
                res.cookie('user', user.jwt);
                res.send('Account Verified!, Moving to Home Page')
            }else{
                res.status(401).send('Incorrect Email or Password')
            }
        }else{
            res.status(404).send(`Account Doesn't Exist`);
        }
    }
    catch(err){
        console.error(err);
    }
}

exports.forgotPassword = async (req, res) => {
    try{
        const uuid = uuidv4();
        const user = await User.findOne({
            where : {
                email : req.body.userEmail
            }
        });
    
        await user.createForgetPasswordRequest({
            uuid : uuid,
            isActive : true
        });

        const mailResponse = await mailSystem.sendResetMail(req.body.userEmail, uuid);
        res.send(mailResponse);

    }
    catch(err){
        console.log(err);
    }
}

exports.resetPassword = async (req, res) => {
    if(!req.cookies.uuid){
        res.send(false);
    }
    else{
        const uuidTable = await ForgetPasswordRequest.findOne({
            where : {
                uuid : req.cookies.uuid
            }
        })
        await uuidTable.update({
            isActive : false
        })
        req.body.newPassword = await passwordEncryption.encryptPassword(req.body.newPassword);
        const changePassword = await User.update({
            password : req.body.newPassword
        }, {
            where : {
                id : uuidTable.dataValues.UserId
            }
        }).then(result => {
            return true;
        }).catch(err => {
            return false;
        })
        res.cookies('uuid', null);
        res.send(changePassword);
    }
}

