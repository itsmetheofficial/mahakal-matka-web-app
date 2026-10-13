import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWebPush } from '../context/WebPushContext';
import Modal from './Modal';
import { isIOSChrome } from '../utils/installation';

const indiaDay = () => String(Math.floor((Date.now() + 330 * 60 * 1000) / 86400000));
const reminderCookie = userId => `mahakal_push_reminder_${userId}`;
const shownToday = userId => document.cookie.split('; ').some(value => value === `${reminderCookie(userId)}=${indiaDay()}`);

export default function NotificationReminder() {
  const userId = useSelector(state => state.appData.appData.user?.id);
  const { status, enable } = useWebPush();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const reminderRef = useRef(null);
  const actionRef = useRef(null);
  const dismissedRef = useRef(false);
  const presentedRef = useRef(false);
  const skipLoginRef = useRef(false);

  useEffect(() => {
    if (!userId) return;
    // Login uses a full navigation or updates the existing layout. Skip both flows.
    skipLoginRef.current = sessionStorage.getItem('skipPushReminderOnLogin') === 'true';
    sessionStorage.removeItem('skipPushReminderOnLogin');
    dismissedRef.current = false;
    presentedRef.current = false;
  }, [userId]);

  useEffect(() => {
    setOpen(false);
    if (!userId || skipLoginRef.current || dismissedRef.current || window.AndroidApp
      || ['enabled', 'loading', 'unavailable'].includes(status)
      || (!presentedRef.current && shownToday(userId))) return;

    let timer;
    let ready = false;
    let disposed = false;
    const canShow = () => !dismissedRef.current
      && (presentedRef.current || !shownToday(userId))
      && document.visibilityState === 'visible'
      && Boolean(localStorage.getItem('authToken'))
      && !document.body.classList.contains('sidebar-open')
      && !Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"]'))
        .some(dialog => !dialog.contains(reminderRef.current));
    const check = (delay = 3000) => {
      window.clearTimeout(timer);
      if (!ready || disposed) return;
      if (!canShow()) {
        setOpen(false); // Give announcements, name prompts and other dialogs priority.
        return;
      }
      timer = window.setTimeout(() => {
        if (disposed || !canShow()) return;
        setOpen(true);
        presentedRef.current = true;
        // A cookie preserves the daily limit when logout clears local storage.
        document.cookie = `${reminderCookie(userId)}=${indiaDay()};path=/;max-age=172800;SameSite=Lax;Secure`;
      }, delay);
    };
    const initialTimer = window.setTimeout(() => { ready = true; check(0); }, 3000);
    const onChange = () => check();
    const observer = new MutationObserver(onChange);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'role'] });
    document.addEventListener('visibilitychange', onChange);
    window.addEventListener('focus', onChange);
    return () => {
      disposed = true;
      window.clearTimeout(initialTimer);
      window.clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onChange);
      window.removeEventListener('focus', onChange);
    };
  }, [userId, status]);

  const close = () => { dismissedRef.current = true; setOpen(false); };
  const allow = async () => {
    setBusy(true);
    try { await enable(); } finally { setBusy(false); }
  };
  const install = status === 'install';
  const blocked = status === 'blocked';
  const canEnable = status === 'off' || status === 'incomplete';

  return (
    <Modal isOpen={open} toggle={close} zIndex={55} closeOnBackdrop={!busy} initialFocusRef={actionRef}>
      <div ref={reminderRef} className="w-[340px] max-w-[90vw] overflow-hidden rounded-2xl bg-white text-slate-800">
        <div className="bg-gradient-to-br from-primary to-cyan-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl" aria-hidden="true">🔔</span>
            <button type="button" onClick={close} disabled={busy} aria-label="Close notification reminder" className="rounded-full px-3 py-1 text-2xl">×</button>
          </div>
          <h2 className="mt-3 text-xl font-semibold">Keep your alerts on</h2>
          <p className="mt-2 text-sm leading-6 text-white/90">Get timely result updates, account activity and important Mahakal messages.</p>
        </div>
        <div className="p-5">
          <p className="text-sm leading-6 text-slate-600">
            {install ? 'On iPhone and iPad, add Mahakal to your Home Screen first. Then open it from that icon and enable notifications.'
              : blocked ? 'Notifications are blocked. Allow them in your browser’s site settings or your phone’s notification settings, then return here.'
              : status === 'unsupported' ? 'This browser cannot receive push alerts. Open Mahakal in a supported browser to enable notifications.'
              : status === 'error' ? 'We could not finish setting up alerts. Reload the website and try again from the notification bell.'
              : 'Tap Enable notifications, then choose Allow if your browser asks. You can change this later in your settings.'}
          </p>
          {instructions && install && <ol className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-sm leading-6">
            <li>1. Tap Share {isIOSChrome() ? 'beside the address bar' : '(or Page Menu → Share)'}.</li>
            <li>2. Choose Add to Home Screen, then Add.</li>
            <li>3. Open the Home Screen app and enable notifications.</li>
          </ol>}
          {(canEnable || install) && <button ref={actionRef} type="button" onClick={install ? () => setInstructions(true) : allow} disabled={busy} className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? 'Setting up alerts…' : install ? 'Show me how' : 'Enable notifications'}
          </button>}
          <button ref={!canEnable && !install ? actionRef : undefined} type="button" onClick={close} disabled={busy} className="mt-3 w-full rounded-xl px-4 py-2 text-sm font-medium text-slate-500">{blocked || status === 'unsupported' || status === 'error' ? 'Got it' : 'Maybe later'}</button>
          <p className="mt-2 text-center text-xs text-slate-400">We’ll remind you at most once a day.</p>
        </div>
      </div>
    </Modal>
  );
}
