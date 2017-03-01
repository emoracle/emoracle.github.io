self.addEventListener('install', function (e) {
  console.log('Install event in service-worker.js: ', e);
});

self.addEventListener('activate', function (e) {
  console.log('Activate event in service-worker.js: ', e);
});
