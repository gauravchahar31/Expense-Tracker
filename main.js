const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home');
const sequelize = require('./database/connection');

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('views'));


app.use('/user', userRoutes);
app.use(homeRoutes);

sequelize.sync();

app.listen(3000);
