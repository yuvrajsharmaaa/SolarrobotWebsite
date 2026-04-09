importScripts('/export/js/lottie-config/index.js')
const CACHE_NAME = 'lottie-cache-v1';
const LOTTIE_URLS = self.__LOTTIE_URLS__ || [];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(LOTTIE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (LOTTIE_URLS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});