const express = require('express')
const router = express.Router();

const purchaseController = require('../controllers/purchase');

router.get('/premiumSubscription', purchaseController.premiumSubscription);

module.exports = router;