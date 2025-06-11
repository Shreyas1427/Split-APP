import axios from 'axios';

const api = axios.create({
  baseURL: 'https://split-app-i4rr.onrender.com/api/v1',  // Add /api prefix here
  headers: {
    'Content-Type': 'application/json'
  }
});

// Update endpoints to match backend routes
export const fetchExpenses = () => api.get('/expenses/list');
export const addExpense = (expense) => api.post('/expenses/create', expense);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const fetchBalances = () => api.get('/settlement/balances');
export const fetchSettlements = () => api.get('/settlement/settlements');
export const fetchPeople = () => api.get('/settlement/people');
export const updateExpense = (id, expense) => api.put(`/expenses/${id}`, expense);

// Analytics endpoints
export const fetchMonthlySummary = () => api.get('/analytics/monthly-summary');
export const fetchIndividualVsGroup = () => api.get('/analytics/individual-vs-group');
export const fetchTopExpenses = () => api.get('/analytics/top-expenses');