const express = require('express')
const router = express.Router();

const userController = require('../controllers/user');

router.post('/signup', userController.createNewUser);
router.post('/login', userController.authenicateUser);
router.get('/checkPremium', userController.checkPremium);

module.exports = router;