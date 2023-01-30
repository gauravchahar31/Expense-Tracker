const path = require('path');
const rootDir = path.dirname(require.main.filename);

const User = require('../models/User');
const ForgetPasswordRequest = require('../models/ForgetPasswordRequest');

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

exports.logout = (req, res) => {
    try{
        res.clearCookie('user');
        res.redirect('/');
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
            res.sendFile(path.join(rootDir, 'views/PasswordHandler', 'forgotPassword.html'));
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.resetPassword = async (req, res) => {
    const resetRequest = await ForgetPasswordRequest.findOne({
        where : {
            uuid : req.params.uuid
        }
    });
    if(!resetRequest){
        res.send('Link Not Valid');
    }
    else if(!resetRequest.dataValues.isActive){
        res.send('Link Expired!!');
    }
    else{
        res.cookie('uuid', req.params.uuid);
        res.sendFile(path.join(rootDir, 'views/Passwordhandler', 'resetPassword.html'));
    }
}
