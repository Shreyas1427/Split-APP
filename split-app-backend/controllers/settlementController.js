const Expense = require('../models/Expense');
const calculateSettlement = require('../utils/calculateSettlement');

exports.getBalances = async (req, res) => {
  const expenses = await Expense.find();
  const { balances } = calculateSettlement(expenses);
  res.json({ success: true, data: balances });
};

exports.getSettlement = async (req, res) => {
  const expenses = await Expense.find();
  const { settlements } = calculateSettlement(expenses);
  res.json({ success: true, data: settlements });
};

exports.getPeople = async (req, res) => {
  const expenses = await Expense.find();
  const people = new Set();
  expenses.forEach(exp => {
    people.add(exp.paid_by);
    exp.shared_with.forEach(p => people.add(p));
  });
  res.json({ success: true, data: Array.from(people) });
};
