const path = require('path');
const rootDir = path.dirname(require.main.filename);

exports.homePage = async (req, res) => {
   try{ 
        if(req.user){
            res.status(200).sendFile(path.join(rootDir, 'views', 'home.html'));
        }
        else{
            res.redirect('/login');
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(null);
    }
}

exports.loginPage = async (req, res) => {
    try{ 
        if(req.user){
            res.redirect('/');
        }
        res.status(200).sendFile(path.join(rootDir, 'views', 'login.html'));
    }
    catch(err){
        console.log(err);
        res.status(400).json(null);
    }
}

exports.signupPage = async (req, res) => {
    try{ 
        if(req.user){
            res.redirect('/');
        }
        res.status(200).sendFile(path.join(rootDir, 'views', 'signup.html'));
    }
    catch(err){
        console.log(err);
        res.status(400).json(null);
    }
}

exports.logout = (req, res) => {
    try{
        res.clearCookie('user');
        res.redirect('/');
    }
    catch(err){
        console.log(err);
        res.status(400).json(null);
    }
}