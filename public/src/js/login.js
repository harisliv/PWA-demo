form.addEventListener("submit", (event) => {
    event.preventDefault();
    loginUser();
  })


  async function loginUser() {
    const response = await fetch("https://web-push-notifications-backend.herokuapp.com/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.elements["email"].value,
        password: form.elements["password"].value,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    if (response.ok) {
        const userInfo = await response.json();
        // console.log(userInfo.data.token)
        localStorage.setItem('jwt', userInfo.data.token);
        redirect: window.location.replace("./notification.html") 
    } else {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    
  }