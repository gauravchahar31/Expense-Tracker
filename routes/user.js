const express = require('express')
const router = express.Router();

const userController = require('../controllers/user');

router.post('/checkUser', userController.checkUser);
router.post('/signup', userController.createNewUser);
router.post('/login', userController.authenicateUser);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);

module.exports = router;