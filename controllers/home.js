const path = require('path');
const rootDir = path.dirname(require.main.filename);

const User = require('../models/User');

exports.homePage = async (req, res) => {
   try{ 
        if(req.user){
            res.sendFile(path.join(rootDir, 'views', 'home.html'));
        }
        else{
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log(err);
    }
}