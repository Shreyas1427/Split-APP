// controllers/analyticsController.js
const Expense = require('../models/Expense');
const moment = require('moment');

// 📅 Monthly Spending Summary
exports.monthlySummary = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const summary = {};

    expenses.forEach(exp => {
      const month = moment(exp.createdAt).format('YYYY-MM');
      if (!summary[month]) summary[month] = 0;
      summary[month] += exp.amount;
    });

    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 👥 Individual vs Group Spending
exports.individualVsGroup = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const paid = {}, shared = {};

    expenses.forEach(exp => {
      // paid_by
      paid[exp.paid_by] = (paid[exp.paid_by] || 0) + exp.amount;

      // shared_with
      if (exp.split_type === 'equal') {
        const share = exp.amount / exp.shared_with.length;
        exp.shared_with.forEach(p => {
          shared[p] = (shared[p] || 0) + share;
        });
      } else if (exp.split_type === 'percentage' || exp.split_type === 'exact') {
        for (let p in exp.split_values) {
          shared[p] = (shared[p] || 0) + exp.split_values[p];
        }
      }
    });

    const result = [];
    const allPeople = new Set([...Object.keys(paid), ...Object.keys(shared)]);

    allPeople.forEach(person => {
      result.push({
        person,
        paid: paid[person] || 0,
        shared: shared[person] || 0,
        balance: (paid[person] || 0) - (shared[person] || 0)
      });
    });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 💰 Most Expensive Transactions or Categories
exports.expensiveItems = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ amount: -1 }).limit(5);
    const categoryTotals = {};

    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    res.json({
      success: true,
      topTransactions: expenses,
      categoryTotals
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
