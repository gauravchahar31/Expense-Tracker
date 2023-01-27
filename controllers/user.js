const path = require('path');
const User = require('../models/User');
const passwordEncryption = require('../util/encryptPassword');
const jwtToken = require('../util/jwtToken');
const rootDir = path.dirname(require.main.filename);

exports.signupForm = (req, res) => {
    try{
        if(req.user){
            res.redirect('/');
        }else{
            res.sendFile(path.join(rootDir, 'views', 'signup.html'));
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.loginForm = (req, res) => {
    try{
        if(req.user){
            res.redirect('/');
        }else{
            res.sendFile(path.join(rootDir, 'views', 'login.html'));
        }
    }
    catch(err){
        console.log(err);
    }
}

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

exports.authenicateUser = async (req, res) =>{
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

