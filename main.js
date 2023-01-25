const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const userRoutes = require('./routes/user')

app.use('/user', userRoutes);

app.listen(3000);
