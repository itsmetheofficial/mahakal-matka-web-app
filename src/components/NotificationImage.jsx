import React from 'react';

export default function NotificationImage({ notification, compact = false }) {
  if (!notification?.image_url) return null;

  return (
    <div className={compact ? "mt-2 overflow-hidden rounded-lg" : "mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"}>
      <img src={notification.image_url} alt={`Image for ${notification.title || 'notification'}`}
        className="mx-auto block h-auto w-full object-contain" />
      <a href={notification.image_url} target="_blank" rel="noopener noreferrer"
        className="block p-2 text-center text-xs font-medium text-blue-700"
        aria-label="View full notification image">View full image ↗</a>
    </div>
  );
}
