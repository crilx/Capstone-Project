// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRO60gzVLD_Wip00DrssuFtDLHd42pa-Y",
  authDomain: "capstone-project-657c9.firebaseapp.com",
  databaseURL: "https://capstone-project-657c9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capstone-project-657c9",
  storageBucket: "capstone-project-657c9.appspot.com",
  messagingSenderId: "612114696277",
  appId: "1:612114696277:web:96ff5b4951d11089daacdc",
  measurementId: "G-30B8FL4P9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import{
    getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField
}
from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";

const db = getFirestore();

//----------------------references----------------------------//

let equipmentId = document.getElementById('equipmentId');
let equipmentName = document.getElementById('equipmentName');
let equipmentLocation = document.getElementById('equipmentLoc');
let equipmentCount = document.getElementById('equipmentCount');
let equipmentStatus = document.getElementById('equipmentStatus');

let stdNo = document.getElementById('stdNo');
let stdName = document.getElementById('stdName');
let stdCourse = document.getElementById('stdCourse');
let roomLocation = document.getElementById('roomLoc');
let clientPurpose = document.getElementById('clientPurpose');
let clientProf = document.getElementById('clientProf');
let quantityCount = document.getElementById('quantityCount');
let phoneNum = document.getElementById('phoneNum');

//------------------------logged user-----------------------------------//
let userID = localStorage.getItem("LoggedUser")
let userEmail = localStorage.getItem("userEmail")
let addBtn = document.getElementById('addBtn');
let srchBtn = document.getElementById('srchBtn');

//-------------------------Quantity Limiter---------------------------//

        var maxNum = 0;

            quantityCount.addEventListener("input", function(){
                var min = parseInt(quantityCount.value);
                if(min < 0){
                    quantityCount.value = "0";
                }
                else if(maxNum < parseInt(quantityCount.value)){
                    quantityCount.value = maxNum;
                }
            });

//------------------------Alert message-----------------------------//


function sendEmail(argument){
    var today = new Date();
    var date = today.getFullYear() +'-'+(today.getMonth()+1).toString().padStart(2, "0") +'-'+today.getDate().toString().padStart(2, "0");
    Email.send({
    Host : "smtp.gmail.com",
    Username : "blackheart0253@gmail.com",
    Password : "yinimhcxcqzcfffa",
    To : userEmail,
    From : "Admin@gmail.com",
    Subject : "Borrowed",
    Body : "Hello there, " + quantityCount.value + " " + equipmentName.value + " was borrowed by "  + stdName.value + " at "  + date + "  today."
}).then(
message => alert(message)
);
}

//----------------------adding document-----------------------------//

async function AddDocument_CustomID(){
    var today = new Date();
    var date = today.getFullYear() +'-'+(today.getMonth()+1).toString().padStart(2, "0") +'-'+today.getDate().toString().padStart(2, "0");
    var time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2, "0");
    var dateTime = date+' '+time;                           

    var stats = "Active";

    if(stdName.value != "" && roomLocation.value != "" && clientPurpose.value != "" && stdNo.value != "" && quantityCount.value != "0" && equipmentId.value != "" && stdCourse.value != "" && clientProf.value != ""){
        
        var ref = doc(db,userID+"Client", stdNo.value)
        var history = collection(db,userID+"ClientHistory")
        var update = doc(db,userID+"Items", equipmentId.value)
        const docSnap = await getDoc(ref);
        
        var quant = doc(db,userID+"Items", equipmentId.value)
        const quanti = await getDoc(quant);
        var quantity = quanti.data().Quantity;

        if(docSnap.exists()){
            alert("Document already exist");
        }
        else if(parseInt(equipmentCount.value) > parseInt(quantity)){
            alert("The amount you want to borrow exceeds the available stocks")
        }
        else{
            await setDoc(
                ref,{
                    ID: equipmentId.value,
                    STDNo: stdNo.value,
                    Name: stdName.value,
                    Course: stdCourse.value,
                    Location: roomLocation.value,
                    Purpose: clientPurpose.value,
                    Supervisor: clientProf.value,
                    PhoneNum: phoneNum.value,
                    Item: equipmentName.value,
                    Quantity: quantityCount.value,
                    Date: dateTime
                }
                )
                .then(()=>{
                    alert("Data added successfully")
                })
                .catch((error)=>{
                    alert("Error operation, error:" + error)
                }) 
                await addDoc(
                history,{
                    Name: stdName.value,
                    Course: stdCourse.value,
                    Purpose: clientPurpose.value,
                    Supervisor: clientProf.value,
                    Item: equipmentName.value,
                    Action: stats,
                    Quantity: quantityCount.value,
                    Number: phoneNum.value,
                    Date: dateTime
                }
            )
            var total = parseInt(equipmentCount.value) - parseInt(quantityCount.value)
            await updateDoc(
                update, {
                    InUse: quantityCount.value,
                    Quantity: total
                }
            )
            
            location.reload();
        }
        
    }
    else{
        alert("All equipments are taken or form is not complete")
    }
    
}
//---------------------get document---------------//            
async function getADocument(){
    if(equipmentId.value != ""){
        var ref = doc(db,userID+"Items", equipmentId.value)
    
        const docSnap = await getDoc(ref);

        if(docSnap.exists()){
        
            equipmentId.value = docSnap.data().ID;
            equipmentName.value = docSnap.data().Name;
            equipmentLocation.value = docSnap.data().Location;
            equipmentCount.value = docSnap.data().Quantity;
            maxNum = parseInt(docSnap.data().Quantity);
            quantityCount.value = "0";
        }
        else{
            alert("Data doesn't exist");
        }


    }       
    else{
        alert("Please input the equipment ID first")
    }
}
   

//-----------------------------Button events-------------------//
srchBtn.addEventListener("click", getADocument);
addBtn.addEventListener("click", function(){
    AddDocument_CustomID();  
    sendEmail();
}); 
