import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Balances from './components/Balances';
import SettlementSummary from './components/SettlementSummary';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  const [refresh, setRefresh] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <motion.div 
          className="flex justify-between items-center bg-white rounded-lg shadow-lg p-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Split App
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg 
                       hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
          >
            {showAnalytics ? '← Back' : '📊 Analytics'}
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {showAnalytics ? (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <AnalyticsDashboard />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <ExpenseForm onAdd={() => setRefresh(r => r + 1)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <ExpenseList key={refresh} />
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <Balances key={`b-${refresh}`} />
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <SettlementSummary key={`s-${refresh}`} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}