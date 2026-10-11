// Focus Timer service worker v4: self-unregister.
// The worker was interfering with asset fetches. This version removes itself.
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.registration.unregister())
     .then(() => self.skipWaiting())
  );
});
