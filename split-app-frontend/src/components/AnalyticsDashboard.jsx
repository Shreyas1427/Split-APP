import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchMonthlySummary, fetchIndividualVsGroup, fetchTopExpenses } from '../api';

const StatCard = ({ title, children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all ${className}`}
  >
    <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
    {children}
  </motion.div>
);

const AnalyticsDashboard = () => {
  const [monthlySummary, setMonthlySummary] = useState({});
  const [individualStats, setIndividualStats] = useState([]);
  const [topTransactions, setTopTransactions] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [monthlyData, individualData, topData] = await Promise.all([
        fetchMonthlySummary(),
        fetchIndividualVsGroup(),
        fetchTopExpenses()
      ]);

      setMonthlySummary(monthlyData.data.data);
      setIndividualStats(individualData.data.data);
      setTopTransactions(topData.data.topTransactions);
      setCategoryTotals(topData.data.categoryTotals);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
      console.error('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-red-50 rounded-lg text-red-600"
      >
        <p className="font-medium">Error: {error}</p>
        <button 
          onClick={loadAnalytics}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-gray-800 flex items-center gap-2"
      >
        📊 Analytics Dashboard
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Monthly Spending Summary" className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="space-y-2">
            {Object.entries(monthlySummary).map(([month, amount], index) => (
              <motion.div
                key={month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700">{month}</span>
                <span className="text-blue-600">₹{amount.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </StatCard>

        <StatCard title="Individual vs Group Spending" className="bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Person', 'Paid', 'Shared', 'Balance'].map(header => (
                    <th key={header} className="px-4 py-2 text-left text-gray-600">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {individualStats.map((p, index) => (
                  <motion.tr
                    key={p.person}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 font-medium">{p.person}</td>
                    <td className="px-4 py-2">₹{p.paid.toFixed(2)}</td>
                    <td className="px-4 py-2">₹{p.shared.toFixed(2)}</td>
                    <td className={`px-4 py-2 font-medium ${p.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{p.balance.toFixed(2)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </StatCard>

        <StatCard title="Most Expensive Transactions" className="bg-gradient-to-br from-green-50 to-teal-50">
          <div className="space-y-2">
            {topTransactions.map((tx, index) => (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 hover:bg-white rounded-lg transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{tx.description}</p>
                    <p className="text-sm text-gray-500">by {tx.paid_by}</p>
                  </div>
                  <span className="text-green-600 font-medium">₹{tx.amount.toFixed(2)}</span>
                </div>
                <span className="inline-block px-2 py-1 mt-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {tx.category}
                </span>
              </motion.div>
            ))}
          </div>
        </StatCard>

        <StatCard title="Total per Category" className="bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="space-y-2">
            {Object.entries(categoryTotals).map(([cat, amt], index) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700">{cat}</span>
                <span className="text-orange-600">₹{amt.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </StatCard>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
