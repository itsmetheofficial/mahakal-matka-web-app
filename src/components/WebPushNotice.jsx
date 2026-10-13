import React from 'react';
import { useWebPush } from '../context/WebPushContext';

export default function WebPushNotice({ compact = false }) {
  const { status, enable } = useWebPush();
  if (status === 'loading' || status === 'unavailable') return null;

  const copy = {
    enabled: ['Notifications enabled', 'This browser is registered to receive your alerts.'],
    incomplete: ['Finish enabling alerts', 'Permission is allowed, but this browser has not finished registering for notifications.'],
    install: ['Get alerts on your iPhone', 'Tap Share in Safari or Chrome, then Add to Home Screen. Open Mahakal from the new icon to enable notifications.'],
    blocked: ['Notifications are blocked', 'Allow notifications for Mahakal in your browser or phone settings, then reopen the app.'],
    unsupported: ['Notifications unavailable here', 'Open Mahakal in a supported browser or install it on your Home Screen.'],
    error: ['Notifications could not start', 'Please reload the app and try again.'],
    off: ['Stay updated', 'Enable alerts for results, account activity, and important messages.'],
  }[status];
  if (!copy) return null;

  return (
    <div className={`rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white text-slate-800 shadow-sm ${compact ? 'mx-3 mb-3 p-3' : 'm-3 p-4'}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg" aria-hidden="true">🔔</span>
        <div className="min-w-0 flex-1">
          <strong className="block text-sm font-semibold">{copy[0]}</strong>
          <p className="mt-1 text-xs leading-5 text-slate-600">{copy[1]}</p>
          {(status === 'off' || status === 'incomplete') && <button type="button" onClick={enable} className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm">Enable notifications</button>}
        </div>
      </div>
    </div>
  );
}
