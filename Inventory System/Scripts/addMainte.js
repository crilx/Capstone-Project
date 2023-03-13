import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
            import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-analytics.js";
            import { getAuth } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js";
            
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
            const auth = getAuth();
//----------------------references----------------------------//

            let equipmentId = document.getElementById('equipmentId');
            let equipmentName = document.getElementById('equipmentName');
            let equipmentModel = document.getElementById('equipmentModel');
            let equipmentLocation = document.getElementById('equipmentLoc');
            let equipmentCount = document.getElementById('equipmentCount');
            let equipmentSupplier = document.getElementById('equipmentSupplier');


            let handyMan = document.getElementById('handyMan');
            let superVisor = document.getElementById('superVisor');
//------------------------user reference-----------------------//

            let userID = localStorage.getItem("LoggedUser");
            
//-------------------------button references---------------//
           
            let searchBtn = document.getElementById('searchBtn');
            let updBtn = document.getElementById('updBtn');

            

//------------------------Number Limiter--------------------//

            var maxNum = 0;

            equipmentCount.addEventListener("input", function(){
                var min = parseInt(equipmentCount.value);
                if(min < 0){
                    equipmentCount.value = "0";
                }
                else if(maxNum < parseInt(equipmentCount.value)){
                    equipmentCount.value = maxNum;
                }
            });

//-----------------------------Get document------------------------//

            async function getADocument(){
                
                if(equipmentId.value != ""){
                    var ref = doc(db,userID+"Items", equipmentId.value)
                    const docSnap = await getDoc(ref);
                    if(docSnap.exists()){
                        equipmentId.value = docSnap.data().ID;
                        equipmentName.value = docSnap.data().Name;
                        equipmentModel.value = docSnap.data().Model;
                        equipmentCount.value = docSnap.data().Quantity;
                        equipmentSupplier.value = docSnap.data().Supplier;
                        maxNum = parseInt(docSnap.data().Quantity);
                    }
                    else{
                        alert("Data doesn't exist");
                    }
                }
                else{
                    alert("Please search for the equipment ID");
                }
            }

//-----------------------------Update date--------------------//

            async function updateData(){
                var today = new Date();
                var date = today.getFullYear() +'-'+(today.getMonth()+1).toString().padStart(2, "0") +'-'+today.getDate().toString().padStart(2, "0");
                var time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2, "0");
                var dateTime = date+' '+time;
                

                if(equipmentId.value != "" && equipmentName.value != "" && equipmentLocation.value != "" && equipmentCount.value != "" && equipmentSupplier.value != "" && handyMan.value != "" && superVisor.value != ""){
                    var ref = doc(db,userID+"Items", equipmentId.value)
                    
                    var maint = doc(db,userID+"Maintenance", equipmentId.value)
                    
                    var maintLog = doc(db,userID+"MaintenanceLog", equipmentId.value)

                    var action = "Maintenance";
                    var costs = "N/A";
                    var completed = "0";

                    const docSnap = await getDoc(ref);
                    const mainte = await getDoc(maint);
  
                    var num1 = docSnap.data().Quantity;
                    var num2 = equipmentCount.value;
                    
                    var updateTotalStock = parseInt(num1) - parseInt(num2)
                    
                    
                    await updateDoc(
                        ref,{
                            Quantity: updateTotalStock,
                            InMaintenance: equipmentCount.value
                        }
                    )
                    

                    if(mainte.exists()){
                        var inMaint = mainte.data().Quantity;
                        var totalInMaint = equipmentCount.value;
                        var finalTotal = parseInt(totalInMaint) + parseInt(inMaint);

                        if(parseInt(docSnap.data().Quantity) == 0){
                            await updateDoc(
                                ref,{
                                    Status: action
                                }

                            )
                        }
                        await updateDoc(
                            maint,{
                                Quantity: finalTotal,
                                Date: dateTime
                            }
                        ).then(()=>{
                            alert("Data added successfully")
                        })
                        await updateDoc(
                            maintLog,{
                                Quantity: finalTotal
                                }
                            )
                        .catch((error)=>{
                            alert("Error operation, error:" + error)
                        })

                    }
                    else{
                        if(parseInt(docSnap.data().Quantity) == 0){
                            await updateDoc(
                                ref,{
                                    Status: action
                                }
                            )
                        }
                        await setDoc(
                            maint,{
                                ID: equipmentId.value,
                                Name: equipmentName.value,
                                Model: equipmentModel.value,
                                HandyMan: handyMan.value,
                                Supervisor: superVisor.value,
                                Location: equipmentLocation.value,
                                Quantity: equipmentCount.value,
                                Date: dateTime
                            }
                        ).then(()=>{
                            alert("Data added successfully")
                        })
                        await setDoc(
                            maintLog,{
                                ID: equipmentId.value,
                                Name: equipmentName.value,
                                Model: equipmentModel.value,
                                Cost: costs,
                                HandyMan: handyMan.value,
                                Supervisor: superVisor.value,
                                Quantity: equipmentCount.value,
                                Completed: completed,
                                Failed: completed,
                                Supplier: equipmentSupplier.value,
                                Action: action,
                                Date: dateTime,
                                DateEnd: costs
                                }
                            )
                        .catch((error)=>{
                            alert("Error operation, error:" + error)
                        })
                    }
                    
                    location.reload();

                }
                else{
                    alert("Please fill up the form before adding to maintenance")
                }
                
            }

//-----------------------------Button events-------------------//

            
            searchBtn.addEventListener("click", getADocument);
            updBtn.addEventListener("click", updateData);