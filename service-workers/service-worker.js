'use strict';

var
version = 1, 
currentCache = {
  offline: 'offline-cache' + version
},
offlinePagina = 'offline.html';

self.addEventListener('install', function (event) {
  event.waitUntil(
    // Open de cache en voeg aan de cache de array
    // van resources die nodig zijn voor de offline pagina
    caches.open(currentCache.offline)
    .then(function (cache) {
      return cache.addAll([
          offlinePagina
        ]);
    }));
});

self.addEventListener('fetch', function (event) {
  var
  request = event.request,
  isRequestMethodGet = request.method === 'GET';

  if (request.mode === 'navigate' || isRequestMethodGet) {
    event.respondWith(
      fetch(createRequestWithCacheBusting(request.url))
      .catch (function (error) {
        console.log('Offline: returning offline page ', error);
        return caches.match(offlinePagina);
      })
        );
    } else {
      event.respondWith(caches.match(request)
        .then(function (response) {
          return response || fetch(request);
        }));
    }
  });

  self.addEventListener('push', function (event) {
    var
    notificationTitle = 'Broadcast',
    notificationOptions = {};

    if (event.data) {
      notificationOptions.body = event.data.text();
    }

    event.waitUntil(Promise.all([self.registration.showNotification(notificationTitle, notificationOptions)]));
  });

  self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    var clickResponsePromise = Promise.resolve();
    if (event.notification.data && event.notification.data.url) {
      clickResponsePromise = clients.openWindow(event.notification.data.url);
    }

    event.waitUntil(Promise.all([clickResponsePromise]));
  });

  /*
  Helper functions
   */
  function createRequestWithCacheBusting(url) {
    var
    request,
    cacheBustingUrl;

    request = new Request(url, {
        cache: 'reload'
      });

    if ('cache' in request) {
      return request;
    }

    cacheBustingUrl = new URL(url, self.location.href);
    cacheBustingUrl.search += (cacheBustingUrl.search ? '&' : '') + 'cachebust=' + Date.now();

    return new Request(cacheBustingUrl);
  }
