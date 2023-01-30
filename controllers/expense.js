const { response } = require('express');
const sequelize = require('../database/connection');
const Expense = require('../models/Expense');
const awsS3 = require('../util/aws');

exports.getExpenses = async (req, res) => {
    const expenses = await req.user.getExpenses();
    const isPremium = req.user.dataValues.isPremium
    const data = {
        isPremium : isPremium,
        expenses : expenses
    }
    res.json(data);
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

exports.dailyExpense = async (req, res) => {
    try{
        console.log(req.user);
        if(req.user.isPremium == null){
            res.send(null);
        }else{
            const expenses = await req.user.getExpenses();
            const data = JSON.stringify(expenses);
            const fileName = `expense${req.user.id}${new Date()}`;
            const fileURL = await saveFileToS3(data, fileName);
            console.log(fileURL);
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.monthlyExpense = async (req, res) => {
    try{
        
    }
    catch(err){
        console.log(err);
    }
}

exports.yearlyExpense = async (req, res) => {
    try{
        
    }
    catch(err){
        console.log(err);
    }
}

const saveFileToS3 = async (data, fileName) => {
    try{
        awsS3.createBucket( async () => {
            const params = {
                Bucket : 'expensetracker-reports',
                Key : fileName,
                Body : data,
                ACL: 'public-read'
            }
            return new Promise((resolve, reject) => {
                awsS3.upload(params, (err, response) => {
                    if(err){
                        console.log(err);
                        reject(err);
                    }
                    else{
                        console.log(response);
                        resolve(response.Location);
                    }
                })
            })
        })
    }
    catch(err){
        console.log(err);
    }
}