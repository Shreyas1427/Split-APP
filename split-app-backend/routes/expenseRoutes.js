const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/expenseController');

// Define explicit paths for all routes
router.get('/list', ctrl.getAllExpenses);
router.post('/create', ctrl.addExpense);
router.put('/:id', ctrl.updateExpense);
router.delete('/:id', ctrl.deleteExpense);

module.exports = router;