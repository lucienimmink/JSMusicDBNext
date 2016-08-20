self.addEventListener('install', e => {
    // init
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

const CACHE_NAME = "v1";

/*
* ignore sw for now; streaming doesn't seem to work when using fetch; need to figure out how to bypass this error.
* the RANGE header is not set in the SW while mandatory resulting in an HTTP Error.
*/

/*
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();


                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        if (fetchRequest.url.indexOf('/global/') !== -1 || fetchRequest.url.indexOf('/data/') !== -1) {
                            // IMPORTANT: Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            var responseToCache = response.clone();

                            caches.open(CACHE_NAME)
                                .then(function (cache) {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return response;
                    }
                );
            })
    );
});
*/