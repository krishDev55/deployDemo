// sw.js

// Install
self.addEventListener("install", event => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  console.log("Service Worker activated");

  event.waitUntil(
    (async () => {
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })()
  );
});

// Fetch (network interception)
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        // Use preload response if available
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        // Otherwise fetch normally
        return fetch(event.request);
      })()
    );
  }
});
