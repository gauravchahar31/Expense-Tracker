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
            if(user.password === req.body.userPassword){
                res.send('User Authenticated')
            }else{
                res.status(401).send('User Not Authorized')
            }
        }else{
            res.status(404).send('User Not Found');
        }
    }
    catch(err){
        console.error(err);
    }
}

