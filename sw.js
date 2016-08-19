self.addEventListener('install', e => {
    // init
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(function (response) {
                return caches.open('v1').then(function (cache) {
                    console.log('sw; put in cache', event.request);
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});