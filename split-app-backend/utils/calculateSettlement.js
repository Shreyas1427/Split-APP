module.exports = function calculateSettlement(expenses) {
  // Track {person: {paid: amount, owes: amount}}
  const ledger = {};

  // Initialize ledger
  expenses.forEach(exp => {
    if (!ledger[exp.paid_by]) ledger[exp.paid_by] = { paid: 0, owes: 0 };
    exp.shared_with.forEach(person => {
      if (!ledger[person]) ledger[person] = { paid: 0, owes: 0 };
    });
  });

  expenses.forEach(exp => {
    const payer = exp.paid_by;

    switch (exp.split_type) {
      case 'equal': {
        const shareCount = exp.shared_with?.length || 0;
        if (shareCount === 0) throw new Error('No users to share with');

        const sharePerPerson = exp.amount / shareCount;
        ledger[payer].paid += exp.amount;
        exp.shared_with.forEach(person => {
          ledger[person].owes += sharePerPerson;
        });
        break;
      }

      case 'percentage': {
        if (!exp.split_values || typeof exp.split_values !== 'object')
          throw new Error('Missing or invalid split_values for percentage split');

        const totalPercent = Object.values(exp.split_values).reduce((a, b) => a + b, 0);
        if (Math.abs(totalPercent - 100) > 0.01)
          throw new Error('Percentages must sum to 100');

        ledger[payer].paid += exp.amount;
        Object.entries(exp.split_values).forEach(([person, percent]) => {
          ledger[person].owes += (exp.amount * percent) / 100;
        });
        break;
      }

      case 'exact': {
        if (!exp.split_values || typeof exp.split_values !== 'object')
          throw new Error('Missing or invalid split_values for exact split');

        const totalAmount = Object.values(exp.split_values).reduce((a, b) => a + b, 0);
        if (Math.abs(totalAmount - exp.amount) > 0.01)
          throw new Error('Split amounts must equal total expense');

        ledger[payer].paid += exp.amount;
        Object.entries(exp.split_values).forEach(([person, amount]) => {
          ledger[person].owes += amount;
        });
        break;
      }

      default:
        throw new Error(`Invalid split type: ${exp.split_type}`);
    }
  });

  // Calculate final balances
  const balances = {};
  Object.entries(ledger).forEach(([person, amounts]) => {
    const balance = amounts.paid - amounts.owes;
    balances[person] = Math.abs(balance) < 0.01 ? 0 : parseFloat(balance.toFixed(2));
  });

  // Settlement logic
  const settlements = [];
  const owed = Object.entries(balances).filter(([_, v]) => v < 0).sort((a, b) => a[1] - b[1]);
  const owes = Object.entries(balances).filter(([_, v]) => v > 0).sort((a, b) => b[1] - a[1]);

  while (owed.length && owes.length) {
    let [debtor, debtAmt] = owed[0];
    let [creditor, credAmt] = owes[0];
    const settledAmt = Math.min(-debtAmt, credAmt);

    settlements.push({
      from: debtor,
      to: creditor,
      amount: parseFloat(settledAmt.toFixed(2)),
    });

    if (Math.abs(-debtAmt - settledAmt) < 0.01) owed.shift();
    else owed[0][1] = debtAmt + settledAmt;

    if (Math.abs(credAmt - settledAmt) < 0.01) owes.shift();
    else owes[0][1] = credAmt - settledAmt;
  }

  return {
    ledger,  // Return detailed paid/owes information
    balances,
    settlements
  };
};
