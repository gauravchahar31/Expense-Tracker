const express = require('express')
const router = express.Router();

const userController = require('../controllers/user');

router.get('/signup', userController.signupForm);
router.post('/signup', userController.createNewUser);
router.post('/checkUser', userController.checkUser);

module.exports = router;