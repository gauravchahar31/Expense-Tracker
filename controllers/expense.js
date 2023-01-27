const sequelize = require('../database/connection');
const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
    const expenses = await req.user.getExpenses()
    res.json(expenses);
} 

exports.postExpense = async (req, res) => {
    await req.user.createExpense({
        amount : req.body.amount,
        description : req.body.description,
        category : req.body.category
    })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.json(err.response);
    })
}

exports.deleteExpense = async (req, res) => {
    await Expense.destroy({ where : {
        id : req.params.id
    }})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.json(err.response);
    })
}

exports.editExpense = async (req, res) =>{
    await Expense.update({
        amount : req.body.amount,
        description : req.body.description,
        category : req.body.category
    }, { where : {
        id : req.params.id
    }})
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err);
        res.json(err.response);
    })
}