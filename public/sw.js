const CACHE_VERSION = "sports-wear-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = [OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE, PAGE_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => !currentCaches.includes(cacheName))
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isImageRequest(request) {
  return request.destination === "image";
}

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

async function networkFirstForNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(PAGE_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch {
    const cache = await caches.open(PAGE_CACHE);
    const cachedResponse = await cache.match(request);
    return cachedResponse ?? (await caches.match(OFFLINE_URL));
  }
}

async function cacheFirstForImages(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch {
    return cachedResponse;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstForNavigation(request));
    return;
  }

  if (isImageRequest(request)) {
    event.respondWith(cacheFirstForImages(request));
  }
});
