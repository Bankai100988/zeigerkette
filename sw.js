// Service Worker: sorgt dafür, dass die App auch ohne Internet läuft.

// Versionsnummer erhöhen, wenn sich die Dateiliste unten ändert.
const CACHE_NAME = "zeigerkette-v2";

// Alle Dateien, die das Programm braucht. Neue Dateien hier ergänzen.
// Alle Pfade relativ, weil die App unter /zeigerkette/ veröffentlicht wird.
const DATEIEN = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

// Installieren: alle Dateien in den Cache legen.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(DATEIEN))
      .then(() => self.skipWaiting())
  );
});

// Aktivieren: alte Caches mit anderem Namen löschen.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(
        namen.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// Abrufen: zuerst aus dem Netz (neueste Version), sonst aus dem Cache.
self.addEventListener("fetch", (event) => {
  const anfrage = event.request;
  if (anfrage.method !== "GET") {
    return;
  }
  if (new URL(anfrage.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(anfrage)
      .then((antwort) => {
        if (antwort && antwort.ok) {
          const kopie = antwort.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(anfrage, kopie));
        }
        return antwort;
      })
      .catch(() =>
        caches.match(anfrage).then((gespeichert) => {
          if (gespeichert) {
            return gespeichert;
          }
          if (anfrage.mode === "navigate") {
            return caches.match("./index.html");
          }
          return Response.error();
        })
      )
  );
});
