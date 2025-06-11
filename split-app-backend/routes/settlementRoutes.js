const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settlementController');

// Define explicit paths for all routes
router.get('/balances', ctrl.getBalances);
router.get('/settlements', ctrl.getSettlement);
router.get('/people', ctrl.getPeople);

module.exports = router;