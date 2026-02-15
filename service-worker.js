const CACHE_NAME = 'toctoc-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Sniglet:wght@400;800&display=swap'
];

// Install Event: Cache core static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Stale-While-Revalidate Strategy
// This serves from cache immediately while updating the cache in the background
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests mostly, but we want to cache ES modules from esm.sh if possible
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Check if we received a valid response
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
          }
          // Also cache opaque responses (CDNs like esm.sh often return opaque)
          if (networkResponse && networkResponse.status === 0 && networkResponse.type === 'opaque') { 
              cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
            // Network failed
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});