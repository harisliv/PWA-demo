var USER_ID = "61e94a405ff83b001654f8c5";
var vapidPub =
  "BHHDlmHUgblYgAyIKDUhs-QpOa7Y8cNq6arjfY8MZCCSASCX_x-nBKAhPIblehVxV6qy2nkEAK0nx0LvWz6SWhA";
var enableNotificationButtons = document.querySelectorAll(
  ".enable-notifications"
);
var deferredPrompt;

function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if (!window.Promise) {
  window.Promise = Promise;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function () {
      console.log("Service worker registered!");
    })
    .catch(function (err) {
      console.log(err);
    });
}

window.addEventListener("beforeinstallprompt", function (event) {
  console.log("beforeinstallprompt fired");
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification() {
  if ("serviceWorker" in navigator) {
    var options = {
      body: "Welcome to our Notification Service",
      icon: "/src/images/favicon-32x32.png",
      image: "/src/images/favicon-32x32.png",
      dir: "ltr",
      lang: "el-GR",
      vibrate: [100, 20, 100],
      badge: "/src/images/favicon-32x32.png",
      tag: "welcome-notification",
      renotify: !0,
      data: { url: "https://github.com/harisliv" },
      actions: [
        {
          action: "confirm",
          title: "ok",
          icon: "/src/images/favicon-32x32.png",
        },
        {
          action: "cancel",
          title: "cancel",
          icon: "/src/images/favicon-32x32.png",
        },
      ],
    };
    navigator.serviceWorker.ready.then(function (swreg) {
      swreg.showNotification("Successfully subscribed! (from SW)", options);
    });
  }
}

function configurePushSub() {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  var reg;
  navigator.serviceWorker.ready
    .then(function (swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function (sub) {
      if (sub === null) {
        var convertedVap = urlBase64ToUint8Array(vapidPub);
        return reg.pushManager.subscribe({
          userVisibleOnly: !0,
          applicationServerKey: convertedVap,
        });
      } else {
      }
    })
    .then(function (newSub) {
      console.log(newSub);
      return fetch(
        "https://web-push-notifications-backend.herokuapp.com/subscriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ subscription: newSub, userId: USER_ID }),
        }
      );
    })
    .then(function (res) {
      if (res.ok) {
        displayConfirmNotification();
        return res.json();
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function askForNotificationPermission() {
  Notification.requestPermission(function (result) {
    console.log("User Choice", result);
    if (result !== "granted") {
      console.log("No notification permission granted");
    } else {
      configurePushSub();
    }
  });
}

if ("Notification" in window) {
  for (var i = 0; i < enableNotificationButtons.length; i++) {
    enableNotificationButtons[i].style.display = "inline-block";
    enableNotificationButtons[i].addEventListener(
      "click",
      askForNotificationPermission
    );
  }
}
