import React from 'react';
import { Link } from 'react-router-dom';
import { walletAmounts, money } from '../utils/wallet';

export default function WalletBalances({ user }) {
  const { cash, bonus, total } = walletAmounts(user);
  return (
    <section aria-label="Your wallet balances" className="mx-3 my-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
        <span className="text-xs font-semibold text-slate-600">Total balance</span>
        <strong className="text-lg text-primary">₹{money(total)}</strong>
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-100">
        <div className="px-3 py-2">
          <p className="text-xs text-slate-600">Cash <span className="text-[10px] text-slate-500">· Can withdraw</span></p>
          <p className="break-words text-sm font-bold text-slate-900">₹{money(cash)}</p>
        </div>
        <Link to="/bonus-report" className="block px-3 py-2">
          <p className="text-xs text-slate-600">Bonus <span className="text-[10px] text-slate-500">· Play only ↗</span></p>
          <p className="break-words text-sm font-bold text-slate-900">₹{money(bonus)}</p>
        </Link>
      </div>
    </section>
  );
}
