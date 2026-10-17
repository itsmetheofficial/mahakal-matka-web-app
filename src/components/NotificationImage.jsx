import React from 'react';

export default function NotificationImage({ notification, compact = false }) {
  if (!notification?.image_url) return null;

  return (
    <a href={notification.image_url} target="_blank" rel="noopener noreferrer"
      className={compact ? "mt-2 block overflow-hidden rounded-lg" : "mt-3 block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"}
      aria-label="View full notification image">
      <img src={notification.image_url} alt={`Image for ${notification.title || 'notification'}`}
        className="mx-auto block h-auto w-full object-contain" />
      {!compact && <span className="block p-2 text-center text-xs font-medium text-blue-700">View full image ↗</span>}
    </a>
  );
}
