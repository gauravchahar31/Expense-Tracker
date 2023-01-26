const express = require('express')
const router = express.Router();

const userController = require('../controllers/user');

router.get('/signup', userController.signupForm);
router.get('/login', userController.loginForm);

router.post('/signup', userController.createNewUser);
router.post('/login', userController.authenicateUser);

module.exports = router;