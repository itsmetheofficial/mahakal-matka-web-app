export const walletAmounts = (user = {}) => {
  const cash = Number(user?.cash_balance ?? user?.balance ?? 0);
  const bonus = Number(user?.bonus_balance ?? 0);
  return { cash, bonus, total: Math.round((cash + bonus) * 100) / 100 };
};
export const money = (amount) => Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
