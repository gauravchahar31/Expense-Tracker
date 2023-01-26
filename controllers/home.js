const path = require('path');
const rootDir = path.dirname(require.main.filename);

exports.homePage = (req, res) => {
   try{ 
        if(req.cookies.user){
            res.sendFile(rootDir, 'views', 'home.html');
        }
        else{
            res.redirect('/user/login');
        }
    }
    catch(err){
        console.log(err);
    }
}