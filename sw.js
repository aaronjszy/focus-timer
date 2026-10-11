// Focus Timer service worker: cache-first for the app shell, plus
// filename-based routing for the large voice assets. The exported app may
// request its model/voice/wasm files at paths that do not match where they
// are hosted; match by filename and serve from the known-good locations.
const CACHE = "focus-timer-v2";

const ASSET_TARGETS = {
  "model_quantized.onnx": "assets/kitten/model_quantized.onnx",
  "ort-wasm-simd-threaded.jsep.wasm": "assets/ort/ort-wasm-simd-threaded.jsep.wasm",
};

function voiceTarget(filename) {
  const m = filename.match(/^(expr-voice-[\w-]+\.bin)$/);
  return m ? "assets/kitten/voices/" + m[1] : null;
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(["./", "./index.html", "./manifest.webmanifest"]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  const filename = url.pathname.split("/").pop() || "";

  // Route known asset filenames to their real locations, whatever path
  // the app requested them at.
  let target = ASSET_TARGETS[filename] || voiceTarget(filename);
  if (target) {
    e.respondWith(
      caches.match(target).then(
        (hit) =>
          hit ||
          fetch(target).then((res) => {
            if (!res.ok) throw new Error("asset missing: " + target);
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(target, copy));
            return res;
          })
      )
    );
    return;
  }

  // Cache-first for everything else same-origin.
  e.respondWith(
    caches.match(e.request).then(
      (hit) =>
        hit ||
        fetch(e.request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
    )
  );
});
