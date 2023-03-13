var form = document.getElementById("my-form");

    username = document.getElementById("email");

    async function handleSubmit(event) {
      
      event.preventDefault();
      var data = new FormData(event.target);
      fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        alert("Request has submitted successfully");
        window.location.href="index.html"
        form.reset()
      }).catch(error => {
        alert("Oops! There was a problem submitting your form")
      });
    }
    
    form.addEventListener("submit", handleSubmit)

    