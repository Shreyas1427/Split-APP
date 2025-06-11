// models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' }, // ← ADD THIS
  paid_by: { type: String, required: true },
  shared_with: [{ type: String }],
  split_type: { type: String, enum: ['equal', 'percentage', 'exact'] },
  split_values: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
