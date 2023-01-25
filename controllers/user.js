const path = require('path');
const User = require('../models/User');

const rootDir = path.dirname(require.main.filename);

exports.signupForm = (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'signup.html'));
}

exports.loginForm = (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
}

exports.createNewUser = async (req, res) => {
    try{
        User.create({
            name: req.body.userName,
            email: req.body.userEmail,
            password: req.body.userPassword
        }).then(result => {
            res.send('User Created');
        })
    }
    catch(err){
        console.error(err);
    }
}

exports.checkUser = async (req, res) =>{
    try{
        if(await User.findOne({
            where : {
                email : req.body.userEmail
            }
        })){
            return true;
        }
        return false;
    }
    catch(err){
        console.error(err);
    }
}

exports.verifyUser = async (req, res) =>{
    try{
        const user = await User.findOne({
            where : {
                email : req.body.userEmail
            }
        });
        if(user){
            if(user.password === req.userPassword){
                res.send('User Authenticated')
            }else{
                res.send('Id or Password Not Valid')
            }
        }else{
            res.send('Email Not Registered');
        }
    }
    catch(err){
        console.error(err);
    }
}

