const CACHE_NAME = 'jomakhoroch-cache-v3.9';
// Core files to cache immediately
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/version.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
  'https://cdn.jsdelivr.net/npm/toastify-js'
];

// Install event: Cache core files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        const cachePromises = urlsToCache.map(url => {
          return cache.add(new Request(url, { cache: 'reload' })).catch(() => {});
        });
        return Promise.all(cachePromises);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('Service Worker: Caching failed', err))
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network first for HTML/CSS/JS/JSON, Cache first for static images/fonts
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.url.includes('firestore.googleapis.com') || request.url.includes('api.github.com') || request.method !== 'GET') {
    return;
  }

  if (!request.url.startsWith('http')) {
    return;
  }

  const isSameOriginAppAsset = request.url.startsWith(self.location.origin) && (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.url.endsWith('.json') ||
    request.url.includes('style.css') ||
    request.url.includes('script.js')
  );

  if (isSameOriginAppAsset) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
          return response;
        })
        .catch(() => {
          return caches.match(request).then(response => {
            return response || caches.match('/index.html');
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(response => {
      if (response) return response;
      const fetchRequest = request.clone();
      return fetch(fetchRequest).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
        return networkResponse;
      });
    })
  );
});
