const express = require('express');
const sequelize = require('../database/connection');
const Expense = require('../models/Expense');
const awsS3 = require('../util/aws');

exports.getExpenses = async (req, res) => {
    try{
        if(!req.query.page){
            req.query = {
                page : 1,
                size : 10
            }
        }
        console.log(req.user);
        const expenses = await Expense.find({user: req.user}).skip((parseInt(req.query.page)-1) * parseInt(req.query.size)).limit(parseInt(req.query.size)).sort({amount: -1});
        const totalExpenses = await Expense.find({user: req.user}).count();
        const isPremium = req.user.isPremium;
        const data = {
            isPremium : isPremium,
            expenses : expenses,
            totalExpenses : totalExpenses
        }
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(400).json(null);
    }
} 

exports.postExpense = async (req, res) => {
    try{
        const newExpense = new Expense({
            amount : req.body.amount,
            description : req.body.description,
            category : req.body.category,
            user : req.user._id
        });
        const expense = await newExpense.save();
        res.status(200).send(expense);
    }
    catch(err){
        console.log(err);
        res.status(500).json(null);
    }
}

exports.deleteExpense = async (req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json(true);
    }
    catch(err){
        console.log(err);
        res.status(500).json(null);
    }
}

exports.editExpense = async (req, res) =>{
    try{
        await Expense.findByIdAndUpdate(req.params.id, {
            amount : req.body.amount,
            description : req.body.description,
            category : req.body.category
        })
        res.status(200).json(true);
    }
    catch(err){
        console.log(err);
        res.status(500).json(null);
    }
}

exports.dailyExpense = async (req, res) => {
    try{
        if(req.user.isPremium == false){
            res.send(null);
        }else{
            const expenses = await Expense.find({user: req.user._id});
            const data = JSON.stringify(expenses);
            const fileName = `expense${req.user.id}${new Date()}`;
            const fileURL = await saveFileToS3(data, fileName);
            res.status(200).send(fileURL);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(null);
    }
}

// exports.monthlyExpense = async (req, res) => {
//     try{

//     }
//     catch(err){
//         console.log(err);
//     }
// }

// exports.yearlyExpense = async (req, res) => {
//     try{
        
//     }
//     catch(err){
//         console.log(err);
//     }
// }

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
        res.status(500).json(null);
    }
}