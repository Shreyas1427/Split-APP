import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchBalances } from '../api';

export default function Balances() {
  const [balances, setBalances] = useState({});

  useEffect(() => {
    fetchBalances().then(res => setBalances(res.data.data));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Balances</h2>
      <motion.ul className="space-y-3">
        {Object.entries(balances).map(([name, amt], index) => (
          <motion.li
            key={name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-lg ${
              amt < 0 
                ? 'bg-red-50 text-red-600' 
                : 'bg-green-50 text-green-600'
            }`}
          >
            <span className="font-medium">{name}</span>
            <span className="text-lg">
              {amt < 0 
                ? `owes ₹${Math.abs(amt)}` 
                : `gets back ₹${amt}`
              }
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}