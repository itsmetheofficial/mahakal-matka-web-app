import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Repository from '../repository/Repository';
import { getUserBalance } from '../repository/BalanceRepository';
import { setWalletBalances } from '../store/features/appData/appDataSlice';

export async function refreshExternalGameBalance(dispatch) {
    try {
        const { data } = await getUserBalance();
        if (data.error === false) {
            dispatch(setWalletBalances(data.response));
        }
    } catch {
        // A later normal wallet refresh can recover a temporary connection failure.
    }
}

const ExternalGame = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const frame = useRef(null);
    const launch = useRef(null);
    const [attempt, setAttempt] = useState(0);
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        document.title = 'Aviator | Mahakal Matka';
        let disposed = false;
        setError('');
        setUrl('');
        setLoaded(false);
        // Reuse this request during React's development effect replay.
        if (!launch.current || launch.current.attempt !== attempt) {
            launch.current = {
                attempt,
                request: Repository.post('/external-games/aviator/launch', {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
                    timeout: 15000,
                }),
            };
        }
        launch.current.request.then(({ data }) => {
            if (disposed) return;
            const target = new URL(data.redirect_url);
            if (target.origin !== 'https://aviator.desiapi.com') throw new Error('Invalid game address.');
            setUrl(data.redirect_url);
        }).catch(failure => {
            if (!disposed) setError(failure.response?.data?.message || 'Unable to open Aviator. Please try again.');
        });
        return () => { disposed = true; };
    }, [attempt]);

    useEffect(() => {
        const refresh = () => {
            if (!document.hidden) refreshExternalGameBalance(dispatch);
        };
        refresh();
        const interval = window.setInterval(refresh, 15000);
        window.addEventListener('focus', refresh);
        const handleReturn = event => {
            if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === 'mahakal-aviator-return') {
                refresh();
                navigate('/', { replace: true });
            }
        };
        window.addEventListener('message', handleReturn);
        return () => {
            window.clearInterval(interval);
            window.removeEventListener('focus', refresh);
            window.removeEventListener('message', handleReturn);
        };
    }, [dispatch, navigate]);

    return (
        <main className="flex flex-col w-full bg-slate-950 text-white" style={{ height: '100dvh' }}>
            <header className="flex flex-none items-center justify-between gap-3 px-3 py-3 bg-primary" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
                <Link to="/" replace onClick={() => refreshExternalGameBalance(dispatch)} className="font-semibold text-sm">← Back to Mahakal</Link>
                <span className="font-semibold">Aviator</span>
            </header>
            {error ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
                    <p role="alert">{error}</p>
                    <button onClick={() => setAttempt(value => value + 1)} className="rounded bg-primary px-6 py-2">Try again</button>
                </div>
            ) : !url ? (
                <div className="flex flex-1 items-center justify-center" role="status">Opening Aviator…</div>
            ) : (
                <>
                    {!loaded && <p className="p-2 text-center text-sm" role="status">Loading game…</p>}
                    <iframe ref={frame} src={url} title="Aviator game" className="w-full flex-1 min-h-0 border-0" allow="autoplay; fullscreen" allowFullScreen referrerPolicy="no-referrer" onLoad={() => setLoaded(true)} />
                    <div className="flex flex-none justify-between items-center gap-3 text-xs px-3 py-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
                        <Link to="/history?tab=aviator" onClick={() => refreshExternalGameBalance(dispatch)} className="font-semibold underline">My game history</Link>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="underline">Open in a new tab</a>
                    </div>
                </>
            )}
        </main>
    );
};

export const ExternalGameReturn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'mahakal-aviator-return' }, window.location.origin);
        } else {
            refreshExternalGameBalance(dispatch);
            navigate('/', { replace: true });
        }
    }, [dispatch, navigate]);
    return <p className="p-6 text-center">Returning to Mahakal…</p>;
};

export default ExternalGame;
