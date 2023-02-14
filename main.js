const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();


require('./database/connection');
const User = require('./models/User');

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
        req.user = await User.findOne({jwt : req.cookies.user});
    }
    next();
})

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/', homeRoutes);

app.listen(process.env.PORT_NUMBER, () => {
    console.log(`Server started running at : ${process.env.PORT_NUMBER}`);
});
