// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analyticsController');

router.get('/monthly-summary', ctrl.monthlySummary);
router.get('/individual-vs-group', ctrl.individualVsGroup);
router.get('/top-expenses', ctrl.expensiveItems);

module.exports = router;
