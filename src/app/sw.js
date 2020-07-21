self.addEventListener("install", e => {
  // init
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

const CACHE_NAME = "v1";

self.addEventListener("fetch", function(event) {
  // SKIP cachecheck if it's the streaming path
  // Same for authentication util calls
  if (
    event.request.url.indexOf("/listen") !== -1 ||
    event.request.url.indexOf("file://") !== -1 ||
    event.request.url.indexOf("/version") !== -1 ||
    event.request.url.indexOf("/public-key") !== -1
  ) {
    // nothing to see here, carry on
  } else if (event.request.url.indexOf("music.json") !== -1 || event.request.url.indexOf("progress.txt") !== -1) {
    // send back from the cache but always update the cache with the networks version.
    event.respondWith(fromCache(event.request));
    event.waitUntil(update(event.request).then(refresh));
  } else {
    event.respondWith(
      fromCache(event.request).then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(function(response) {
          // Check if we received a valid response
          if (!response) {
            return response;
          }
          addToCache(event.request, response),then((function () {
            return response;
          }));
        });
      })
    );
  }
});

function fromCache(request) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.match(request);
  });
}

function addToCache(request, response) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.put(request, response.clone());
  });
}

function update(request) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return fetch(request).then(function(response) {
      return cache.put(request, response.clone()).then(function() {
        return response;
      });
    });
  });
}

function refresh(response) {
  return self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      var message = {
        type: "refresh",
        url: response.url
      };
      client.postMessage(JSON.stringify(message));
    });
  });
}
