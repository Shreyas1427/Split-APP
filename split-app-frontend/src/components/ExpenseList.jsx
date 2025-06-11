import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchExpenses, deleteExpense, updateExpense } from '../api';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchExpenses();
      setExpenses(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      // Refresh the expenses list after successful deletion
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
      console.error('Error deleting expense:', err);
    }
  };

  const handleUpdate = async (expenseId, updatedData) => {
    try {
      await updateExpense(expenseId, updatedData);
      setEditingExpense(null);
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update expense');
      console.error('Error updating expense:', err);
    }
  };

  const formatSplitDetails = (expense) => {
    if (expense.split_type === 'equal') {
      const sharePerPerson = expense.amount / expense.shared_with.length;
      return expense.shared_with.map(person => (
        <span key={person} className="text-gray-600 text-sm">
          {person}: ₹{sharePerPerson.toFixed(2)}
        </span>
      ));
    }

    if (expense.split_type === 'percentage') {
      return Object.entries(expense.split_values).map(([person, percent]) => (
        <span key={person} className="text-gray-600 text-sm">
          {person}: {percent}% (₹{((expense.amount * percent) / 100).toFixed(2)})
        </span>
      ));
    }

    if (expense.split_type === 'exact') {
      return Object.entries(expense.split_values).map(([person, amount]) => (
        <span key={person} className="text-gray-600 text-sm">
          {person}: ₹{amount}
        </span>
      ));
    }
  };

  const renderEditForm = (expense) => (
    <div className="mt-2 border-t pt-2">
      <div className="space-y-2">
        <div>
          <label className="block text-sm text-gray-600">Split Type:</label>
          <select 
            className="border p-1 rounded w-full"
            value={expense.split_type}
            onChange={(e) => {
              const updatedExpense = {
                ...expense,
                split_type: e.target.value,
                split_values: e.target.value === 'equal' ? {} : expense.split_values
              };
              setEditingExpense(updatedExpense);
            }}
          >
            <option value="equal">Equal Split</option>
            <option value="percentage">Percentage Split</option>
            <option value="exact">Exact Amount</option>
          </select>
        </div>

        {editingExpense.split_type !== 'equal' && (
          <div>
            {expense.shared_with.map(person => (
              <div key={person} className="flex items-center gap-2 my-1">
                <span className="w-24">{person}:</span>
                <input
                  type="number"
                  className="border p-1 rounded w-24"
                  value={expense.split_values[person] || ''}
                  onChange={(e) => {
                    const updatedExpense = {
                      ...expense,
                      split_values: {
                        ...expense.split_values,
                        [person]: parseFloat(e.target.value) || 0
                      }
                    };
                    setEditingExpense(updatedExpense);
                  }}
                  placeholder={editingExpense.split_type === 'percentage' ? 'Percentage' : 'Amount'}
                />
                {editingExpense.split_type === 'percentage' && <span>%</span>}
                {editingExpense.split_type === 'exact' && <span>₹</span>}
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-600">Category:</label>
          <select 
            className="border p-1 rounded w-full"
            value={editingExpense.category}
            onChange={(e) => {
              setEditingExpense({
                ...editingExpense,
                category: e.target.value
              });
            }}
          >
            <option value="General">General</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Rent">Rent</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setEditingExpense(null)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleUpdate(expense._id, editingExpense)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    loadExpenses();
  }, []);

  if (loading) {
    return <div className="mt-4">Loading expenses...</div>;
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
        Error: {error}
        <button 
          onClick={loadExpenses}
          className="ml-4 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Expenses</h2>
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-32"
          >
            <div className="loader"></div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-100 text-red-700 rounded-lg shadow"
          >
            Error: {error}
            <button onClick={loadExpenses} className="ml-4 underline">
              Retry
            </button>
          </motion.div>
        ) : (
          <motion.ul className="space-y-4">
            {expenses.map((exp, index) => (
              <motion.li
                key={exp._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong>{exp.description}</strong>
                      <span className="text-green-600">₹{exp.amount}</span>
                      <span className="text-gray-500">paid by</span>
                      <span className="text-blue-600 font-medium">{exp.paid_by}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 rounded">
                        {exp.category}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3">
                      {formatSplitDetails(exp)}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      {exp.split_type} split
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded"
                      onClick={() => setEditingExpense(exp)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                      onClick={() => handleDelete(exp._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {editingExpense?._id === exp._id && renderEditForm(editingExpense)}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}