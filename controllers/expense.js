const { response } = require('express');
const sequelize = require('../database/connection');
const Expense = require('../models/Expense');
const awsS3 = require('../util/aws');

exports.getExpenses = async (req, res) => {
    if(!req.query.page){
        req.query = {
            page : 1,
            size : 10
        }
    }
    console.log(req.query);
    const expenses = await req.user.getExpenses({
        offset : ((parseInt(req.query.page)-1) * parseInt(req.query.size)),
        limit: parseInt(req.query.size)
    });
    const totalExpenses = await req.user.getExpenses({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'TOTAL_EXPENSES'],
        ]
    });
    const isPremium = req.user.dataValues.isPremium
    const data = {
        isPremium : isPremium,
        expenses : expenses,
        totalExpenses : totalExpenses[0].dataValues.TOTAL_EXPENSES
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
        if(req.user.isPremium == null){
            res.send(null);
        }else{
            const expenses = await req.user.getExpenses({
                attributes: ['amount', 'description', 'category',
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'Date']
                ]
            });
            const data = JSON.stringify(expenses);
            const fileName = `expense${req.user.id}${new Date()}`;
            const fileURL = await saveFileToS3(data, fileName);
            res.send(fileURL);
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.monthlyExpense = async (req, res) => {
    try{
        // if(req.user.isPremium == null){
        //     res.send(null);
        // }else{
        //     const expenses = await req.user.getExpenses({
        //         attributes: [[sequelize.fn('sum', sequelize.col('expenses.amount')), 'Expense Amount'],
        //         [sequelize.fn('MONTH', sequelize.col('createdAt')), 'MONTH']
        //         ]
        //     });
        //     const data = JSON.stringify(expenses);
        //     const fileName = `expense${req.user.id}${new Date()}`;
        //     const fileURL = await saveFileToS3(data, fileName);
        //     res.send(fileURL);
        // }
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
        return new Promise ((resolve, reject) => {
            awsS3.createBucket(() => {
                const params = {
                    Bucket : 'expensetracker-reports',
                    Key : fileName,
                    Body : data,
                    ACL: 'public-read'
                }
                awsS3.upload(params, (err, response) => {
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        console.log(response);
                        resolve(response.Location);
                    }
                })
            });
        })
    }
    catch(err){
        console.log(err);
    }
}