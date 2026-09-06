const CACHE_NAME = 'jomakhoroch-cache-v3.8';
// Core files to cache immediately
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  // '/favicon.ico', // আপডেটেড: এই লাইনের আর প্রয়োজন নেই
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css', // Cache FontAwesome
  'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', // Cache Toastify CSS
  'https://cdn.jsdelivr.net/npm/toastify-js' // Cache Toastify JS
];

// Install event: Cache core files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        // Use { cache: 'reload' } to ensure fresh files are fetched during install
        const cachePromises = urlsToCache.map(url => {
          return cache.add(new Request(url, { cache: 'reload' }));
        });
        return Promise.all(cachePromises);
      })
      .then(() => self.skipWaiting()) // Activate the new service worker immediately
      .catch(err => console.error('Service Worker: Caching failed', err))
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME]; // Only keep the current cache
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of currently open pages
  );
});

// Fetch event: Network first for HTML, Cache first for others
self.addEventListener('fetch', event => {
  const { request } = event;

  // Let the browser handle Firebase requests & non-GET requests
  if (request.url.includes('firestore.googleapis.com') || request.method !== 'GET') {
    return;
  }

  // Ignore non-http requests (e.g., chrome-extension://)
  if (!request.url.startsWith('http')) {
    return;
  }

  // Strategy: Network first for HTML (/)
  if (request.mode === 'navigate' || (request.destination === 'document')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response; // Return Clone to Cache
          }
          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from cache
          return caches.match(request)
            .then(response => {
              return response || caches.match('/index.html'); // Fallback to cached index.html
            });
        })
    );
    return; // Stop processing further for HTML
  }

  // Strategy: Cache first for static assets (CSS, JS, Fonts, Images)
  event.respondWith(
    caches.match(request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        const fetchRequest = request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});