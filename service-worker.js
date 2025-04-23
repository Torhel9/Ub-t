self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("ubåt-cache-v1").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./styles.css",
        "./script.js",
        "./manifest.json",
        "./bakgrunn.jpg",
        "./icons/icon-192.png",
        "./icons/icon-512.png"
      ])
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
