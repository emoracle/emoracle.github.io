'use strict';

var
version = 1,
currentCache = {
  offline: 'offline-cache' + version
},
offlineUrl = 'offline.html';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(currentCache.offline).then(function (cache) {
      return cache.addAll([
          offlineUrl
        ]);
    }));
});

self.addEventListener('fetch', function (event) {
  var
  request = event.request,
  isRequestMethodGet = request.method === 'GET';

  if (request.mode === 'navigate' || isRequestMethodGet) {
    event.respondWith(
      fetch(createRequestWithCacheBusting(request.url)).catch (function (error) {
        console.log('Offline: returning offline page ', error);
        return caches.match(offlineUrl);
      })
        );
    } else {
      event.respondWith(caches.match(request)
        .then(function (response) {
          return response || fetch(request);
        }));
    }
  });

  function createRequestWithCacheBusting(url) {
	  var 
	  request,
	  cacheBustingUrl;
  }
