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

let stdNo = document.getElementById('stdNo');
let stdName = document.getElementById('stdName');
let roomLocation = document.getElementById('roomLoc');
let clientPurpose = document.getElementById('clientPurpose');
let clientProf = document.getElementById('clientProf');
let quantityCount = document.getElementById('quantityCount');
let phoneNum = document.getElementById('phoneNum');

//-------------------------logged user------------------------------//
let userID = localStorage.getItem("LoggedUser")
let userEmail = localStorage.getItem("userEmail")
let rtnBtn = document.getElementById('rtnBtn');
let srchBtn = document.getElementById('srchBtn');

//-----------------------alert message-----------------------------//

function sendEmail(argument){
    var today = new Date();
    var date = today.getFullYear() +'-'+(today.getMonth()+1).toString().padStart(2, "0") +'-'+today.getDate().toString().padStart(2, "0");
    Email.send({
    Host : "smtp.gmail.com",
    Username : "blackheart0253@gmail.com",
    Password : "yinimhcxcqzcfffa",
    To : userEmail,
    From : "Admin@gmail.com",
    Subject : "Returned",
    Body : "Hello there, equipment " + " " + equipmentName.value + " has been returned by "  + stdName.value + " at "  + date + "  today."
    }).then(

    );
    }


//----------------------adding document-----------------------------//

async function returnEquipment(){
    var today = new Date();
    var date = today.getFullYear() +'-'+(today.getMonth()+1).toString().padStart(2, "0") +'-'+today.getDate().toString().padStart(2, "0");
    var time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2, "0");
    var dateTime = date+' '+time;

    

    
    if(stdName.value != "" && roomLocation.value != "" && clientPurpose.value != "" && stdNo.value != "" && equipmentId.value!= ""){
        
        var history = collection(db,userID+"ClientHistory")
        var ref = doc(db,userID+"Client", stdNo.value)
        var archive = collection(db,userID+"ArchiveClient")

        var update = doc(db,userID+"Items", equipmentId.value)
        var stats = "Standby";
        var action = "Returned";

        const docSnap = await getDoc(ref);
        const docSnap2 = await getDoc(update);


        if (stdNo.value != ""){
            
            var total = parseInt(quantityCount.value) + parseInt(docSnap2.data().Quantity)
            var inUse = parseInt(docSnap2.data().InUse) - parseInt(quantityCount.value)  
            await deleteDoc(ref)
            .then(()=>{
                alert("Equipment returned")
            })
            .catch((error)=>{
                alert("Error operation, error:" + error)
            })
            
            await updateDoc(
                update, {
                    Status: stats,
                    Quantity: total,
                    InUse: inUse
                })
                await addDoc(
                history,{
                    Name: stdName.value,
                    Course: stdCourse.value,
                    Purpose: clientPurpose.value,
                    Supervisor: clientProf.value,
                    Item: equipmentName.value,
                    Action: action,
                    Quantity: quantityCount.value,
                    Number: phoneNum.value,
                    Date: dateTime
                })
                await addDoc(
                archive,{
                    STDNo: stdNo.value,
                    Name: stdName.value,
                    Course: stdCourse.value,
                    Location: roomLocation.value,
                    Purpose: clientPurpose.value,
                    Supervisor: clientProf.value,
                    Item: equipmentName.value,
                    PhoneNum: phoneNum.value,
                    Action: action,
                    Date: dateTime
                })
                location.reload();
        }
        else{
            alert("Something happened");
        }
    }
    else{
        alert("Search for the client first");
    }

} 

//---------------------get document---------------//            
async function getADocument(){
                    
    var ref = doc(db,userID+"Client", stdNo.value)
    const docSnap = await getDoc(ref);
    

    if(docSnap.exists()){
        var holder = docSnap.data().ID;
        var rtn = doc(db,userID+"Items", holder)

        const rtns = await getDoc(rtn);

        stdNo.value = docSnap.data().STDNo;
        stdName.value = docSnap.data().Name;
        stdCourse.value = docSnap.data().Course;
        roomLocation.value = docSnap.data().Location;
        clientPurpose.value = docSnap.data().Purpose;
        clientProf.value = docSnap.data().Supervisor;
        quantityCount.value = docSnap.data().Quantity;
        phoneNum.value = docSnap.data().PhoneNum;

        equipmentId.value = docSnap.data().ID;
        equipmentName.value = docSnap.data().Item;
        equipmentLocation.value = rtns.data().Location;  
    }
    else{
        alert("Student number doesn't exist, please check if the ID is correct");
    }
}

//-----------------------------Button events-------------------//
srchBtn.addEventListener("click", getADocument);
rtnBtn.addEventListener("click", function(){
returnEquipment();
sendEmail();
});