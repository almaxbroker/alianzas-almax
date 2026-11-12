// Alianzas ALMAX Arequipa: permite instalar la web como app.
// Siempre busca la versión más nueva en internet; si no hay señal, muestra la última guardada.
const CACHE = "alianzas-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok && (r.mode === "navigate" || /\/fotos\/|\/icons\//.test(r.url))) {
        const copia = res.clone(); caches.open(CACHE).then(c => c.put(r, copia));
      }
      return res;
    }).catch(() => caches.match(r).then(m => m || (r.mode === "navigate" ? caches.match("/") : undefined)))
  );
});
