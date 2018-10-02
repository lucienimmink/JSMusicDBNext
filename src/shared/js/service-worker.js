// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

// Install stage sets up the offline page in the cahche and opens a new cache
const CACHE = 'bnp-pwa-offline';

const preLoad = function preLoad() {
  return caches.open(CACHE).then((cache) => {
    const cachedResourced = ['/offline.html', '/index.html', '/404.html'];
    // get this list from a offline manifest with all preloadable assets

    /* eslint no-underscore-dangle: "off" */
    if (this.__precacheManifest) {
      this.__precacheManifest.forEach((entry) => {
        cachedResourced.push(entry.url);
      });
    }
    cache.addAll(cachedResourced);
  });
};

const checkResponse = function checkResponse(request) {
  return new Promise((fulfill, reject) => {
    fetch(request).then((response) => {
      if (response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject.bind(null, new Error('Offline')));
  });
};

const addToCache = function addToCache(request) {
  return caches.open(CACHE).then(cache =>
    fetch(request).then(response =>
      // console.log('[PWA Builder] add page to offline'+response.url)
      cache.put(request, response)));
};

const returnFromCache = function returnFromCache(request) {
  return caches.open(CACHE).then(cache =>
    cache.match(request).then((matching) => {
      if (!matching || matching.status === 404) {
        return cache.match('404.html');
      }
      return matching;
    }));
};

const isInCache = function isInCache(request) {
  return new Promise((resolve, reject) => {
    caches.open(CACHE).then(cache =>
      cache
        .match(request)
        .then((m) => {
          if (!m || m.status === 404) {
            return reject();
          }
          return resolve();
        })
        .catch(reject));
  });
};

const returnFromOffline = function returnFromOffline() {
  return caches.open(CACHE).then(cache => cache.match('offline.html'));
};

this.addEventListener('install', (event) => {
  event.waitUntil(preLoad());
});

this.addEventListener('fetch', (event) => {
  if (event.request.url.indexOf('/api/') !== -1) {
    // always return fetch
  } else {
    // cache and stuff
    event.respondWith(checkResponse(event.request).catch((err) => {
      if (err && err.message === 'Offline') {
        // console.log('offline', event.request);
        return isInCache(event.request)
          .then(() =>
          // console.log('yup in cache', event.request);
            returnFromCache(event.request))
          .catch(() =>
          // console.log('error occured offline,,,');
            returnFromOffline());
      }
      return returnFromCache(event.request);
    }));
    event.waitUntil(addToCache(event.request));
  }
});
