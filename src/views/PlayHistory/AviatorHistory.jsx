import { useEffect, useState } from 'react';
import Repository from '../../repository/Repository';
import Pagination from '../../components/Pagination';

const money = value => Number(value || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
const indiaTime = value => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
const outcomes = {
    win: { label: 'Won', style: 'bg-green-100 text-green-800', border: 'border-green-500' },
    lose: { label: 'Lost', style: 'bg-red-100 text-red-800', border: 'border-red-500' },
    pending: { label: 'Pending', style: 'bg-amber-100 text-amber-800', border: 'border-amber-500' },
    cancel: { label: 'Refunded', style: 'bg-slate-100 text-slate-700', border: 'border-slate-400' },
};

const AviatorHistory = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');
        Repository.get('/external-games/aviator/history', {
            params: { page, status: status || undefined, date: date || undefined },
            signal: controller.signal,
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }).then(({ data }) => {
            if (!Array.isArray(data.history?.data)) throw new Error(data.message || 'Unable to load game history.');
            setResult(data);
        }).catch(failure => {
            if (!controller.signal.aborted) setError(failure.response?.data?.message || failure.message || 'Unable to load history.');
        }).finally(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
        return () => controller.abort();
    }, [page, status, date, refresh]);

    return (
        <section className="px-3 pb-5 text-slate-900">
            <div className="flex items-center justify-between gap-3 py-3">
                <div><h2 className="text-lg font-bold">Aviator history</h2><p className="text-xs text-slate-500">Your bets and results · IST (GMT+05:30)</p></div>
                <button onClick={() => setRefresh(value => value + 1)} disabled={loading} className="rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary disabled:opacity-50">Refresh</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <label className="text-xs font-semibold">Result
                    <select value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm">
                        <option value="">All results</option><option value="win">Won</option><option value="lose">Lost</option><option value="pending">Pending</option><option value="cancel">Refunded</option>
                    </select>
                </label>
                <label className="text-xs font-semibold">Date
                    <input type="date" value={date} onChange={event => { setDate(event.target.value); setPage(1); }} className="mt-1 block min-w-0 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm" />
                </label>
            </div>
            {(date || status) && <button onClick={() => { setDate(''); setStatus(''); setPage(1); }} className="mb-3 text-xs font-semibold text-primary underline">Clear filters</button>}
            {loading ? <p role="status" className="py-12 text-center text-slate-500">Loading your game history…</p> : error ? (
                <div role="alert" className="rounded-xl bg-red-50 p-5 text-center text-red-800"><p>{error}</p><button onClick={() => setRefresh(value => value + 1)} className="mt-3 font-semibold underline">Try again</button></div>
            ) : result && (
                <>
                    {!result.history.data.length ? <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center"><p className="font-semibold">No Aviator bets found</p><p className="mt-1 text-sm text-slate-500">{date || status ? 'Try another date or result filter.' : 'Your Aviator bets will appear here when you play.'}</p></div> : result.history.data.map(bet => {
                        const outcome = outcomes[bet.status];
                        return (
                            <article key={bet.id} className={`mb-3 overflow-hidden rounded-xl border border-slate-200 border-l-4 ${outcome.border} bg-white shadow-sm`}>
                                <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-3"><div><h3 className="font-bold">Aviator</h3><p className="text-xs text-slate-500">{indiaTime(bet.placed_at)} IST</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${outcome.style}`}>{outcome.label}</span></div>
                                <div className="grid grid-cols-2 gap-3 p-3"><div><p className="text-xs text-slate-500">Bet amount</p><p className="font-semibold">{money(bet.stake)}</p></div><div><p className="text-xs text-slate-500">{bet.status === 'cancel' ? 'Refund amount' : 'Payout'}</p><p className="font-semibold">{bet.status === 'pending' ? 'Awaiting result' : money(bet.status === 'cancel' ? bet.refund : bet.payout)}</p></div></div>
                                <div className="flex items-center justify-between gap-2 bg-slate-50 px-3 py-2 text-sm"><span>Net result</span><strong className={Number(bet.net_result) < 0 ? 'text-red-600' : bet.status === 'win' ? 'text-green-700' : 'text-slate-600'}>{bet.net_result === null ? 'Pending' : `${Number(bet.net_result) > 0 ? '+' : ''}${money(bet.net_result)}`}</strong></div>
                                <details className="px-3 py-2 text-xs text-slate-500"><summary className="cursor-pointer font-semibold">Bet details</summary><dl className="mt-2 space-y-2 break-all"><div><dt className="font-semibold">Bet ID</dt><dd>{bet.bet_id}</dd></div><div><dt className="font-semibold">Round ID</dt><dd>{bet.round_id}</dd></div>{bet.cash_out_multiplier != null && <div><dt>Cash-out multiplier</dt><dd>{bet.cash_out_multiplier}×</dd></div>}{bet.crash_point != null && <div><dt>Crash point</dt><dd>{bet.crash_point}×</dd></div>}{bet.settled_at && <div><dt>Settled</dt><dd>{indiaTime(bet.settled_at)} IST</dd></div>}</dl></details>
                            </article>
                        );
                    })}
                    {result.history.last_page > 1 && <Pagination currentPage={page} lastPage={result.history.last_page} onChange={setPage} />}
                    <p className="mt-3 text-center text-xs text-slate-500">Payouts include returned stake. Pending bets are excluded from the settled result; refunded bets have zero net result.</p>
                </>
            )}
        </section>
    );
};

export default AviatorHistory;
