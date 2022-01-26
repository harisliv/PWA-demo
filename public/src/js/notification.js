form.addEventListener("submit", (event) => {
  event.preventDefault();
  newSub();
});

async function newSub() {
  const jwt = localStorage.getItem("jwt");
  const response = await fetch(
    "https://web-push-notifications-backend.herokuapp.com/notifications/",
    {
      method: "POST",
      body: JSON.stringify({
        title: form.elements["title"].value,
        message: form.elements["message"].value,
        image: "https://miro.medium.com/max/1200/1*m5RYM_Wkj4LsZewpigV5tg.jpeg",
        icon: "https://raw.githubusercontent.com/gurayyarar/NodeJsPackageManager/master/images/app.png",
        badge:
          "https://raw.githubusercontent.com/gurayyarar/NodeJsPackageManager/master/images/app.png",
        dir: "ltr",
        lang: "el-GR",
        vibrate: [100, 20, 100],
        silent: false,
        tag: "alert",
        renotify: true,
        scheduledAt: "",
        data: {
          url: "https://nodejs.org/en/",
        },
        actions: [
          {
            action: "confirm",
            title: "Read More",
          },
          {
            action: "cancel",
            title: "Close",
          },
        ],
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  if (response.ok) {
    const data = await response.json();
    console.log(data);
  } else {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
}
