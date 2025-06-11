import { useEffect, useState } from 'react';
import { fetchSettlements } from '../api';

export default function SettlementSummary() {
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    fetchSettlements().then(res => setSettlements(res.data.data));
  }, []);

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold">Settlement Summary</h2>
      <ul>
        {settlements.length === 0 ? <li>All Settled!</li> : settlements.map((s, idx) => (
          <li key={idx}>{s.from} ➝ {s.to}: ₹{s.amount}</li>
        ))}
      </ul>
    </div>
  );
}