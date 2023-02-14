const express = require('express')
const router = express.Router();

const homeController = require('../controllers/home');

router.get('/', homeController.homePage);
router.get('/login', homeController.loginPage);
router.get('/signup', homeController.signupPage);
router.get('/logout', homeController.logout);

module.exports = router;