var version = 1;
var cacheName = "stale-" + version;

self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  if (self.clients && clients.claim) {
    clients.claim();
  }
});

self.addEventListener('fetch', function (event) {
  // fetch te respons from the network
  event.respondWith(
    fetch(event.request).then(function (response) {
      caches.open(cacheName).then(function (cache) {
        if (response.status >= 500) {
          // when we receive an error we fetch a stale version from the cache
          cache.match(event.request).
          then(function (response) {
            // We can not find the version in the cache
            // So we return the respons from the network
            return response;
          }).catch (function () {
            return response;
          });
        } else {
          // Respons was < 500, so 200. We clone the respons in the cache
          // and return the respons
          cache.put(event.request.response.clone());
          return response;
        }
      });
    }));
});
