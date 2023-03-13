function login(){
    username = document.getElementById('usrName').value
    password = document.getElementById('password').value
    
    if(validate_email(username) == false || validate_password(password) == false){
        alert("Invalid email or password")
        return
    }
    else{
        auth.signInWithEmailAndPassword(username, password)
        .then(function(){
            const user = auth.currentUser
            setCookie(user.uid);
            const userId = db.collection('users').doc(localStorage.getItem("LoggedUserID"));
            userId.get().then((docs) => {
                if(docs.exists){
                console.log(docs.data().id);
                localStorage.setItem("userEmail", username)
                localStorage.setItem("LoggedUser", docs.data().id);
                localStorage.setItem("LoggedUserType", docs.data().type)
                if(localStorage.getItem("LoggedUserType") == "1"){
                    window.location.href="Item.html"
                }
                else if(localStorage.getItem("LoggedUserType") == "2"){
                    window.location.href="clientSideItem.html";
                }
                }
            });
            })
            .catch(function(error){
                //firebase will use this to alert this error
                var error_code = error.code
                var error_message = error.message

                alert(error_message)
            })
        }
    }
    function validate_email(username){
        expression = /^[^@]+@\w+(\.\w+)+\w$/
        if(expression.test(username) == true){
            return true
        }
        else{
            return false
        }
    }
    function validate_password(password){
        if(password < 6){
            return false
        }
        else{
            return true
        }
    }

    function setCookie(value){
        localStorage.setItem("LoggedUserID", value);
      }
    
    function logout() {
        localStorage.setItem("LoggedUserID", null);
        localStorage.setItem("LoggedUser", null)
    }

    function resetPass(){
        window.location.href="reset_password_form.html";
    }   