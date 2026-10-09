/* eslint-disable no-restricted-globals */
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

// Apply updates as soon as the new assets finish caching. A waiting worker can
// otherwise keep serving an old, broken app until every tab is closed.
self.skipWaiting();
self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});

// Precache assets
precacheAndRoute(self.__WB_MANIFEST);

// Example of runtime caching for API requests
registerRoute(
	({ request }) =>
		request.destination === 'script' || request.destination === 'style',
	new StaleWhileRevalidate()
);
/* eslint-enable no-restricted-globals */
