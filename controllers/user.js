const User = require('../models/User');
const passwordEncryption = require('../util/encryptPassword');

exports.createNewUser = async (req, res) => {
    try{
        const user = await User.findOne({email : req.body.email});
        if(!user){
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                isActive: false
            });
            await newUser.save();
            res.status(200).send('Account Created! Please Login')
        }else{
            res.status(200).send('Email Already Exists!')
        }
    }
    catch(err){
        console.error(err);
        res.status(400).json(null);
    }
}

exports.authenicateUser = async (req, res) => {
    try{
        const user = await User.findOne({email : req.body.email});
        if(user){
            if(await passwordEncryption.decryptPassword(req.body.password, user.password)){
                res.cookie('user', user.jwt);
                res.status(200).send('Account Verified!, Moving to Home Page')
            }else{
                res.status(401).send('Incorrect Email or Password')
            }
        }else{
            res.status(404).send(`Account Doesn't Exist`);
        }
    }
    catch(err){
        console.error(err);
        res.status(400).json(null);
    }
}

exports.checkPremium = async (req, res) => {
    try{
        const isPremium = req.user.isPremium;
        res.status(200).send(isPremium);
    }
    catch(err){
        console.log(err);
        res.status(400).json(null);
    }
}

