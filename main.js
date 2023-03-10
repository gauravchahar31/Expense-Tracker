const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();


const sequelize = require('./database/connection');
const User = require('./models/User');
const Expense = require('./models/Expense');
const Order = require('./models/Order');
const ForgetPasswordRequest = require('./models/ForgetPasswordRequest');

const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const leaderboardRoutes = require('./routes/leaderboard');

const cors = require('cors');
app.use(cors());
app.use(express.static('views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

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
app.use('/purchase', purchaseRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/', homeRoutes);

Expense.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Expense);

Order.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Order);

ForgetPasswordRequest.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(ForgetPasswordRequest);

sequelize.sync();

app.listen(process.env.PORT_NUMBER, () => {
    console.log(`Server started running at : ${process.env.PORT_NUMBER}`);
});
