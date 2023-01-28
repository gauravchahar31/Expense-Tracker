const path = require('path');
const rootDir = path.dirname(require.main.filename);

const User = require('../models/User');

exports.homePage = async (req, res) => {
   try{ 
        if(req.user){
            res.sendFile(path.join(rootDir, 'views', 'home.html'));
        }
        else{
            res.redirect('/login');
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.loginPage = async (req, res) => {
    try{ 
        if(req.user){
            res.redirect('/');
        }
        res.sendFile(path.join(rootDir, 'views', 'login.html'));
    }
    catch(err){
        console.log(err);
    }
}

exports.signupPage = async (req, res) => {
    try{ 
        if(req.user){
            res.redirect('/');
        }
        res.sendFile(path.join(rootDir, 'views', 'signup.html'));
    }
    catch(err){
        console.log(err);
    }
}

exports.forgotPassword = async (req, res) => {
    try{
        if(req.user){
            res.redirect('/');
        }
        else{
            res.sendFile(path.join(rootDir, 'views', 'forgotPassword.html'));
        }
    }
    catch(err){
        console.log(err);
    }
 }