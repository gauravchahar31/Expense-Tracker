const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const userRoutes = require('./routes/user');
const sequelize = require('./database/connection');

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('views'));

app.use('/user', userRoutes);

sequelize.sync();

app.listen(3000);
