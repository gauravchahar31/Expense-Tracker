const path = require('path');
const User = require('../models/User');

const rootDir = path.dirname(require.main.filename);

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

exports.signupForm = (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'signup.html'));
}