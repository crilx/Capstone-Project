function sendMail(params){

    var tempParams ={
        from_name: document.getElementById('fromName').value,
        to_name: document.getElementById('toName').value,
        msg: document.getElementById('msg').value,
        
    }

    emailjs.send('service_2epa6zi', 'template_yuel1ec', tempParams)
    .then(function(res){
        console.log("Success", res.status)
    })
}