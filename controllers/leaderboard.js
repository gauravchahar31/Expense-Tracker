const sequelize = require('../database/connection');
const User = require('../models/User');
const Expense = require('../models/Expense');

exports.getLeaderboard = async (req, res) => {
    try{
        const leaderboard = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('Expenses.amount')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['User.id'],
            limit: 5,
            order:[['total_cost', 'DESC']]
        })
        res.status(200).json(leaderboard);
    }
    catch(err){
        console.log(err);
        res.status(400).json(null);
    }
}