const Expense = require('../models/Expense');

// ➤ Add a new expense
const addExpense = async (req, res) => {
  try {
    const { amount, description, category, paid_by, shared_with, split_type, split_values } = req.body;

    if (!amount || amount <= 0 || !description || !paid_by) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    const expense = new Expense({ 
      amount, 
      description, 
      category: category || 'General', 
      paid_by, 
      shared_with, 
      split_type, 
      split_values 
    });
    await expense.save();

    res.status(201).json({ success: true, data: expense, message: 'Expense added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ➤ Get all expenses
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ➤ Update an expense by ID
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category, paid_by, shared_with, split_type, split_values } = req.body;

    // Validate required fields
    if (!amount || amount <= 0 || !description || !paid_by) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing or invalid required fields' 
      });
    }

    // Validate split type and values
    if (!['equal', 'percentage', 'exact'].includes(split_type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid split type' 
      });
    }

    // Additional validation for percentage and exact splits
    if (split_type !== 'equal' && (!split_values || typeof split_values !== 'object')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Split values required for non-equal splits' 
      });
    }

    if (split_type === 'percentage') {
      const totalPercent = Object.values(split_values)
        .reduce((sum, val) => sum + parseFloat(val), 0);
      if (Math.abs(totalPercent - 100) > 0.01) {
        return res.status(400).json({ 
          success: false, 
          message: 'Percentage splits must total 100%' 
        });
      }
    }

    if (split_type === 'exact') {
      const totalAmount = Object.values(split_values)
        .reduce((sum, val) => sum + parseFloat(val), 0);
      if (Math.abs(totalAmount - amount) > 0.01) {
        return res.status(400).json({ 
          success: false, 
          message: 'Split amounts must equal total expense' 
        });
      }
    }

    // Update the expense with validation
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        amount: parseFloat(amount),
        description,
        category: category || 'General',
        paid_by,
        shared_with,
        split_type,
        split_values: split_type === 'equal' ? {} : split_values
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedExpense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found' 
      });
    }

    res.json({ 
      success: true, 
      data: updatedExpense, 
      message: 'Expense updated successfully' 
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update expense',
      error: err.message 
    });
  }
};

// ➤ Delete an expense by ID
const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense
};
