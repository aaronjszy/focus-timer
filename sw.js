// Focus Timer service worker: cache the app shell and the large TTS assets
// so the voice model survives app restarts without re-downloading.
const CACHE = "focus-timer-v10";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./version.txt",
  "./manifest.webmanifest",
  "./focus-timer-icon-192.png",
  "./focus-timer-icon-512.png",
];

const VOICES = [
  "expr-voice-2-f",
  "expr-voice-2-m",
  "expr-voice-3-f",
  "expr-voice-3-m",
  "expr-voice-4-f",
  "expr-voice-4-m",
  "expr-voice-5-f",
  "expr-voice-5-m",
];

const TTS_ASSETS = [
  "assets/kitten/model.mp3",
  "assets/ort/ort-wasm-simd-threaded.jsep.wasm",
  ...VOICES.map((v) => `assets/kitten/${v}.mp3`),
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(APP_SHELL))
      // Pre-cache local TTS assets if present; don't block install on them.
      .then(() => {
        caches.open(CACHE).then((c) =>
          Promise.allSettled(TTS_ASSETS.map((u) => c.add(u)))
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const isCdnAsset = (
    url.origin === "https://huggingface.co" ||
    url.origin === "https://cdn.jsdelivr.net"
  );
  if (url.origin !== location.origin && !isCdnAsset) return;

  // Cache-first for all same-origin and designated CDN TTS/WASM assets.
  // Large assets stay cached across restarts, so the model is not re-downloaded.
  e.respondWith(
    caches.match(e.request).then(
      (hit) =>
        hit ||
        fetch(e.request).then((res) => {
          // Only cache successful responses.
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
    )
  );
});
