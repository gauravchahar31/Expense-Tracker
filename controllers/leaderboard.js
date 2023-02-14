const User = require('../models/User');
const Expense = require('../models/Expense');

exports.getLeaderboard = async (req, res) => {
    try{
        const leaderboard = await Expense.aggregate([
            { $group : {
                _id:"$user",
                total: {$sum:"$amount"}
            }},{
                $sort: {total: -1}
            }
        ]);
        for(let i=0; i<leaderboard.length; i++){
            const user = await User.findById(leaderboard[i]._id);
            leaderboard[i]._id = user.name;
        }
        res.status(200).json(leaderboard);
    }
    catch(err){
        console.log(err);
        res.status(400).json(null);
    }
}