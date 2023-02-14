require('dotenv').config()

const mongoose = require('mongoose')
require('dotenv').config()

try{
    mongoose.connect(process.env.DB_HOST)
    .then( () => {
        console.log("DataBase Connection Successful")
    })
    .catch( err => {
        console.log("DataBase Connection Failed : " + err)
    })
}
catch(err){
    console.log("DataBase Connection Error : " + err)
}