function resetPassword(){
    var emailAddress = document.getElementById('email').value;
    
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(emailAddress)
    .then(function() {  
        alert("Successfully sent")
    })
    .catch(function(error) {
        alert("Something went wrong")
    });
}