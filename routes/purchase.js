const express = require('express')
const router = express.Router();

const purchaseController = require('../controllers/purchase');

router.get('/premiumSubscription', purchaseController.premiumSubscription);
router.post('/updateTransactionStatus', purchaseController.updateTransactionStatus);

module.exports = router;