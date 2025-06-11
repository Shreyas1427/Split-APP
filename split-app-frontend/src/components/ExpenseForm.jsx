import { useState } from 'react';
import { addExpense } from '../api';

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    category: 'General',
    paid_by: '',
    shared_with: '',
    split_type: 'equal',
    split_values: {}
  });

  const [sharedPeople, setSharedPeople] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!form.amount || !form.paid_by || !form.shared_with) {
        alert('Please fill in all required fields');
        return;
      }

      const sharedWithArray = form.shared_with.split(',').map(p => p.trim()).filter(p => p);
      
      let formattedSplitValues = {};
      
      // Validate based on split type
      if (form.split_type === 'exact') {
        const total = Object.values(form.split_values)
          .reduce((sum, val) => sum + parseFloat(val || 0), 0);
        
        if (Math.abs(total - parseFloat(form.amount)) > 0.01) {
          alert('Sum of split amounts must equal total amount');
          return;
        }
        formattedSplitValues = form.split_values;
      } 
      else if (form.split_type === 'percentage') {
        const total = Object.values(form.split_values)
          .reduce((sum, val) => sum + parseFloat(val || 0), 0);
        
        if (Math.abs(total - 100) > 0.01) {
          alert('Percentages must sum to 100%');
          return;
        }
        
        // Convert percentages to actual amounts
        formattedSplitValues = {};
        Object.entries(form.split_values).forEach(([person, percent]) => {
          formattedSplitValues[person] = (parseFloat(form.amount) * parseFloat(percent)) / 100;
        });
      }

      const payload = {
        amount: parseFloat(form.amount),
        description: form.description,
        category: form.category,
        paid_by: form.paid_by.trim(),
        shared_with: sharedWithArray,
        split_type: form.split_type,
        split_values: form.split_type === 'equal' ? {} : formattedSplitValues
      };

      await addExpense(payload);
      onAdd();
      setForm({
        amount: '',
        description: '',
        category: 'General',
        paid_by: '',
        shared_with: '',
        split_type: 'equal',
        split_values: {}
      });
      setSharedPeople([]);
    } catch (error) {
      console.error('Error adding expense:', error);
      alert(error.response?.data?.message || 'Error adding expense');
    }
  };

  const handleSharedWithChange = (value) => {
    setForm({ ...form, shared_with: value });
    setSharedPeople(value.split(',').map(p => p.trim()).filter(p => p));
  };

  const handleSplitValueChange = (person, value) => {
    setForm({
      ...form,
      split_values: {
        ...form.split_values,
        [person]: parseFloat(value) || 0
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input 
        className="border p-2 w-full rounded"
        placeholder="Amount"
        type="number"
        value={form.amount}
        onChange={e => setForm({ ...form, amount: e.target.value })}
        required
      />
      <input 
        className="border p-2 w-full rounded"
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        required
      />
      <input 
        className="border p-2 w-full rounded"
        placeholder="Paid By"
        value={form.paid_by}
        onChange={e => setForm({ ...form, paid_by: e.target.value })}
        required
      />
      <input 
        className="border p-2 w-full rounded"
        placeholder="Shared With (comma separated)"
        value={form.shared_with}
        onChange={e => handleSharedWithChange(e.target.value)}
        required
      />

      <select
        className="border p-2 w-full rounded"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
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

      <select
        className="border p-2 w-full rounded"
        value={form.split_type}
        onChange={e => setForm({ ...form, split_type: e.target.value })}
      >
        <option value="equal">Split Equally</option>
        <option value="percentage">Split by Percentage</option>
        <option value="exact">Split by Exact Amount</option>
      </select>

      {form.split_type === 'exact' && sharedPeople.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">Enter exact amounts:</p>
          {sharedPeople.map(person => (
            <div key={person} className="flex items-center gap-2">
              <span className="w-1/3">{person}:</span>
              <input
                type="number"
                className="border p-2 flex-1 rounded"
                placeholder="Amount"
                value={form.split_values[person] || ''}
                onChange={e => handleSplitValueChange(person, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
      )}

      {form.split_type === 'percentage' && sharedPeople.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">Enter percentages:</p>
          {sharedPeople.map(person => (
            <div key={person} className="flex items-center gap-2">
              <span className="w-1/3">{person}:</span>
              <input
                type="number"
                className="border p-2 flex-1 rounded"
                placeholder="Percentage"
                value={form.split_values[person] || ''}
                onChange={e => handleSplitValueChange(person, e.target.value)}
                required
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
          ))}
        </div>
      )}

      <button 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors w-full"
        type="submit"
      >
        Add Expense
      </button>
    </form>
  );
}