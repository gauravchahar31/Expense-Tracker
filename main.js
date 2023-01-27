const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

const sequelize = require('./database/connection');
const User = require('./models/User');
const Expense = require('./models/Expense');

const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home');
const expenseRoutes = require('./routes/expense');

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('views'));

app.use(async (req, res, next) => {
    if(req.cookies.user){
        req.user = await User.findOne({
            where : {
                jwt : req.cookies.user
            }
        });
    }
    next();
})

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use(homeRoutes);

Expense.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Expense);

sequelize.sync();

app.listen(3000);
