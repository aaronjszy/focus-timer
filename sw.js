// Focus Timer service worker v3: passthrough (no caching, no routing).
// Used to diagnose whether the worker was causing asset 404s.
const CACHE = "focus-timer-v3";

self.addEventListener("install", (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Passthrough: let every request go to the network.
  e.respondWith(fetch(e.request));
});
