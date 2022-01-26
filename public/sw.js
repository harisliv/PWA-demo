var CACHE_STATIC_NAME = "static-v1";
var CACHE_DYNAMIC_NAME = "dynamic-v1";

self.addEventListener("install", function (event) {
  console.log("[Service Worker] Installing Service Worker ...", event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function (cache) {
      console.log("[Service Worker] Pre Caching App shell");
      cache.addAll([
        "/",
        "/index.html",
        "/src/js/app.js",
        "/src/images/me-192x192.png",
      ]);
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("[Service Worker] Activating Service Worker ....", event);
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then(function (res) {
          return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
            cache.put(event.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});


self.addEventListener("notificationclick", function (event) {
    var notification = event.notification;
    var action = event.action;
  
    console.log(notification);
  
    if (action === "confirm") {
      console.log("Confirm was chosen");
      notification.close();
    } else {
      console.log(action);
      notification.close();
    }
  });
  
  self.addEventListener("notificationclose", function (event) {
    console.log("Notification was closed", event);
  });
  
  self.addEventListener("push", function (event) {
    console.log("Push Notification Revieved", event);
    var data = { title: "Fallback", content: "Something happened" };
  
    if (event.data) {
      data = JSON.parse(event.data.text());
    }
  
    var options = {
      body: data.content,
      icon: "/src/images/me-192x192.png",
      badge: "/src/images/me-192x192.png",
    };
  
    event.waitUntil(self.registration.showNotification(data.title, options));
  });
