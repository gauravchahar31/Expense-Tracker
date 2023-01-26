const path = require('path');
const User = require('../models/User');
const passwordEncryption = require('../util/encryptPassword');


const rootDir = path.dirname(require.main.filename);

exports.signupForm = (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'signup.html'));
}

exports.loginForm = (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
}

exports.createNewUser = async (req, res) => {
    try{
        const user = await User.findOne({
            where : {
                email : req.body.userEmail
            }
        });
        if(!user){
            req.body.userPassword = await passwordEncryption.encryptPassword(req.body.userPassword);
            User.create({
                name: req.body.userName,
                email: req.body.userEmail,
                password: req.body.userPassword
            }).then(result => {
                res.send('User Created');
            }).catch(err => {
                res.send('Something went wrong!')
            }); 
        }else{
            res.send('Email ALready Exists!')
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
                res.send('User Authenticated')
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

