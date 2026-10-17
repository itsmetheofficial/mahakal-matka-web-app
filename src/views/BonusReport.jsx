import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Repository from '../repository/Repository';
import { money, walletAmounts } from '../utils/wallet';

export default function BonusReport() {
  const user = useSelector(state => state.appData.appData?.user);
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState({ data: [], last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    document.title = 'Bonus Wallet | Mahakal Matka';
    let active = true;
    setLoading(true);
    setError('');
    Repository.get('/wallet/bonus-history', { params: { page } }).then(({ data }) => {
      if (!active) return;
      if (data.error) throw new Error(data.message);
      setHistory(data.response.history);
    }).catch(err => { if (active) setError(err.message || 'Unable to load bonus activity.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page]);
  const debits = ['play', 'commission_recovery', 'commission_reversal', 'bonus_adjustment'];
  return (
    <main className="pb-10">
      <section aria-label="Bonus balance" className="mx-3 mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between gap-3"><h1 className="text-sm font-semibold text-slate-700">Bonus balance</h1><strong className="text-xl text-primary">₹{money(walletAmounts(user).bonus)}</strong></div>
        <p className="mt-1 text-[11px] text-slate-500">Use to play · Cannot withdraw</p>
      </section>
      <section className="mx-3 mt-5"><h2 className="mb-3 font-semibold text-slate-900">Bonus activity</h2>
        {loading ? <p role="status" className="py-8 text-center text-sm text-slate-500">Loading activity…</p> : error ? <p role="alert" className="py-4 text-sm text-red-700">{error}</p> : history.data.length === 0 ? <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">No bonus activity yet.</div> :
          <div className="space-y-3">{history.data.map(item => {
            const debit = debits.includes(item.type);
            return <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">{item.details}</p><p className="mt-1 text-[11px] text-slate-500">{item.created_at} IST</p></div><strong className={`whitespace-nowrap text-sm ${debit ? 'text-slate-700' : 'text-emerald-700'}`}>{debit ? '−' : '+'}₹{money(item.bonus_amount ?? item.amount)}</strong></div>{item.wallet_type === 'mixed' && <p className="mt-2 text-[11px] text-slate-500">Also {debit ? 'used' : 'restored'} ₹{money(item.cash_amount)} cash.</p>}</article>;
          })}</div>}
        {history.last_page > 1 && <div className="mt-4 flex justify-between text-sm"><button className="rounded border px-3 py-2 disabled:opacity-40" disabled={page <= 1 || loading} onClick={() => setPage(p => p - 1)}>Previous</button><span className="py-2">{page} / {history.last_page || 1}</span><button className="rounded border px-3 py-2 disabled:opacity-40" disabled={page >= history.last_page || loading} onClick={() => setPage(p => p + 1)}>Next</button></div>}
      </section><Link to="/wallet" className="mx-3 mt-5 block text-center text-sm font-semibold text-primary">Back to wallet</Link>
    </main>
  );
}
