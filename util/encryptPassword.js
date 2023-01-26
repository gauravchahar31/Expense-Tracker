const bcrypt = require('bcryptjs')

exports.encryptPassword = async (password) => {
    try{
        return await bcrypt.hash(password, 10);
    }
    catch(err){
        console.error(err);
    }
}

exports.decryptPassword = async (userPassword, accountPassword) => {
    try{
        return await bcrypt.compare(userPassword, accountPassword)
    }
    catch(err){
        console.error(err);
    }
    
}