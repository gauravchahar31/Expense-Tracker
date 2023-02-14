const express = require('express')
const router = express.Router();

const expenseController = require('../controllers/expense');

router.get('/getExpense', expenseController.getExpenses);
router.post('/addExpense', expenseController.postExpense);
router.post('/editExpense/:id', expenseController.editExpense);
router.delete('/deleteExpense/:id', expenseController.deleteExpense);

router.get('/dailyExpense', expenseController.dailyExpense);

module.exports = router;