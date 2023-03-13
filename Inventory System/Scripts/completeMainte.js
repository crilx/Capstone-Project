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
            let equipmentCompleted = document.getElementById('equipmentCompleted');
            let mainteFailed = document.getElementById('mainteFailed');
            let maintSupervisor = document.getElementById('maintSupervisor');
            let handyMan = document.getElementById('handyMan');
            let totalMaintCost = document.getElementById('totalMaintCost');

            var finalCost;

//------------------------user reference-----------------------//

            let userID = localStorage.getItem("LoggedUser");
            
//-------------------------button references---------------//           
            let searchBtn = document.getElementById('searchBtn');
            let updBtn = document.getElementById('updBtn');

//-------------------------Quantity limiter-----------------//
            var maxNum = 0;
            var completeMax = 0;
            var failedMax = 0;  

            function quantLimiter(){
 
                equipmentCompleted.addEventListener("input", function(){
                    var min = parseInt(equipmentCompleted.value);
                    completeMax = maxNum;
                    
                    if(mainteFailed.value != ""){
                        completeMax = completeMax - parseInt(mainteFailed.value)
                    }
                    else{
                        completeMax = maxNum
                    }

                    if(min < 0){
                        equipmentCompleted.value = "0";
                    }
                    else if(completeMax < parseInt(equipmentCompleted.value)){
                        equipmentCompleted.value = completeMax;
                    }
                });
    
                mainteFailed.addEventListener("input", function(){
                    var min = parseInt(mainteFailed.value);
                    failedMax = maxNum;
                    
                    if(equipmentCompleted.value != ""){
                        failedMax = completeMax - parseInt(equipmentCompleted.value)
                    }
                    else{
                        failedMax = maxNum
                    }

                    if(min < 0){
                        mainteFailed.value = "0";
                    }
                    else if(failedMax < parseInt(mainteFailed.value)){
                        mainteFailed.value = failedMax;
                    }
                });
            }
//-----------------------------Get document------------------------//

            async function getADocument(){
                
                if(equipmentId.value != ""){
                    var ref = doc(db,userID+"Maintenance", equipmentId.value)
                
                    const docSnap = await getDoc(ref);

                    if(docSnap.exists()){
                        equipmentId.value = docSnap.data().ID;
                        equipmentName.value = docSnap.data().Name;
                        equipmentModel.value = docSnap.data().Model;
                        maintSupervisor.value = docSnap.data().Supervisor;
                        handyMan.value = docSnap.data().HandyMan;
                        maxNum = parseInt(docSnap.data().Quantity);
                        equipmentCompleted.value = "0";
                        mainteFailed.value = "0";
                        quantLimiter();
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
                var year = today.getFullYear()+'';
                

                if(equipmentId.value != "" && equipmentName.value != "" && equipmentCompleted.value != ""  && totalMaintCost.value != "" && mainteFailed.value != ""){
                    //call item database
                    var ref = doc(db,userID+"Items", equipmentId.value)
                    const docSnap = await getDoc(ref);

                    //call maintenance and log database
                    var maint = doc(db,userID+"Maintenance", equipmentId.value)
                    var maintLog = doc(db,userID+"MaintenanceLog", equipmentId.value)
                    var newMaintLog = collection(db,userID+"MaintenanceLog")

                    const mainte = await getDoc(maint);
                    const mainteLog = await getDoc(maintLog);

                    //--------------Graph------------------//
                    var costGraph = doc(db, userID+"Costs", year)
                    const graph = await getDoc(costGraph)
                    //-------------------------------------//


                    var mainteRemains = mainte.data().Quantity;
                    var num1 = equipmentCompleted.value;
                    var num2 = mainteFailed.value;

                    var totalStock = docSnap.data().Quantity;
                    

                    var HandyMan = mainteLog.data().HandyMan;
                    var Supervisor = mainteLog.data().Supervisor;
                    var date = mainteLog.data().Date;

                    
                    if(equipmentCompleted.value != "" && equipmentCompleted.value != "0"  && mainteFailed.value == "" && mainteFailed.value == "0"){
                        var completed = parseInt(mainteRemains) - parseInt(num1);
                        totalStock = parseInt(mainteRemains) + parseInt(num1);
                        if(docSnap.data().Status == "Maintenance"){
                            var status = "Standby";
                        }
                        else if(docSnap.data().Status == "Active"){
                            var status = "Active";
                        }
                    }
                    else if(equipmentCompleted.value == "" && equipmentCompleted.value == "0" && mainteFailed.value != "" && mainteFailed.value != "0"){
                        var failed = parseInt(mainteRemains) - parseInt(num2);
                        totalStock = parseInt(mainteRemains) + parseInt(num2);
                        if(docSnap.data().Status == "Maintenance"){
                            var status = "Standby";
                        }
                        else if(docSnap.data().Status == "Active"){
                            var status = "Active";
                        }
                    }
                    else{
                        var total = parseInt(num1) + parseInt(num2);
                        mainteRemains = parseInt(mainteRemains) - total;
                        totalStock = parseInt(totalStock) + total;
                    }
                    

                    if(mainteRemains == 0){
                        if(mainteLog.data().Cost != "N/A"){
                            finalCost = parseInt(mainteLog.data().Cost) + parseInt(totalMaintCost.value);
                            
                            await addDoc(
                                newMaintLog,{
                                    ID: equipmentId.value,
                                    Name: equipmentName.value,
                                    Model: equipmentModel.value,
                                    Cost: finalCost,
                                    Quantity: mainteRemains,
                                    Completed: equipmentCompleted.value,
                                    Failed: mainteFailed.value,
                                    HandyMan: HandyMan,
                                    Supervisor: Supervisor,
                                    Date: date,
                                    DateEnd: dateTime
                                }
                            )
                            if(graph.exists()){
                                await updateDoc(
                                    costGraph,{
                                        Maintenance: finalCost
                                    }
                                )
                            }
                            else{
                                await setDoc(
                                    costGraph,{
                                        Bought: 0,
                                        Maintenance: finalCost
                                    }
                                )
                            }
                            await updateDoc(
                                ref,{           
                                    Status: status,                
                                    Quantity: totalStock,
                                    InMaintenance: mainteRemains
                                }
                            )
                            .then(()=>{
                                alert("Data updated successfully")
                            })
                            
                            .catch((error)=>{
                                alert("Error operation, error:" + error)
                            })
                            await deleteDoc(maint)
                            await deleteDoc(maintLog)

                        }
                        else{
                            await addDoc(
                                newMaintLog,{
                                    ID: equipmentId.value,
                                    Name: equipmentName.value,
                                    Model: equipmentModel.value,
                                    Cost: totalMaintCost.value,
                                    Quantity: mainteRemains,
                                    Completed: equipmentCompleted.value,
                                    Failed: mainteFailed.value,
                                    HandyMan: HandyMan,
                                    Supervisor: Supervisor,
                                    Date: date,
                                    DateEnd: dateTime
                                }
                            )
                            if(graph.exists()){
                                await updateDoc(
                                    costGraph,{
                                        Maintenance: totalMaintCost.value
                                    }
                                )
                            }
                            else{
                                await setDoc(
                                    costGraph,{
                                        Bought: 0,
                                        Maintenance: totalMaintCost.value
                                    }
                                )
                            }
                            await updateDoc(
                                ref,{                           
                                    Quantity: totalStock,
                                    InMaintenance: mainteRemains
                                }
                            )
                            .then(()=>{
                                alert("Data updated successfully")
                            })
                            .catch((error)=>{
                                alert("Error operation, error:" + error)
                            })
                            await deleteDoc(maint)
                            await deleteDoc(maintLog)
                        }


                    }
                    else if(mainteRemains != 0){
                        await updateDoc(
                            ref,{
                                Quantity: totalStock,
                            }
                        )
                        await updateDoc(
                            mainteLog,{
                                Completed: equipmentCompleted.value,
                                Failed: mainteFailed.value,
                                Cost: totalMaintCost.value
                            }
                        )
                    }

                    
                    location.reload();

                }
                else{
                    alert("Please fill up the form before proceeding")
                }
                
            }

//-----------------------------Button events-------------------//

            
            searchBtn.addEventListener("click", getADocument);
            updBtn.addEventListener("click", updateData);