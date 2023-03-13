            import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
            import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
            import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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
          
            
            
            import{
                getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField
            }
            from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";


            import {getStorage, ref as sReF, uploadBytesResumable, getDownloadURL}
            from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js"

            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);
            const auth = getAuth();
            const db = getFirestore();
            
      

//----------------------references----------------------------//

            let equipmentId = document.getElementById('equipmentId');
            let registerId = document.getElementById('registerID');
            let equipmentName = document.getElementById('equipmentName');
            let equipmentModel = document.getElementById('equipmentModel');
            let equipmentLocation = document.getElementById('equipmentLoc');
            let equipmentCost = document.getElementById('equipmentCost');
            let equipmentCount = document.getElementById('equipmentCount');
            let equipmentSupplier = document.getElementById('equipmentSupplier');
            let yrReceived = document.getElementById('yearReceived');


            let myImg = document.getElementById('myImg');
            let selBtn = document.getElementById('selBtn');

            var imgDefault = "https://firebasestorage.googleapis.com/v0/b/capstone-project-657c9.appspot.com/o/Images%2Fdefault-placeholder.png?alt=media&token=8d36c2f2-0503-403e-bf3b-5fa3d3f0f517"
            var totalCost;

            //-----------------logged user----------------------//
            let userID = localStorage.getItem("LoggedUser")
;
            var counting = localStorage.getItem("LoggedUser")+"Counter";

            var count = doc(db, "counters", counting)
            const docSnap = await getDoc(count);
            equipmentId.value = docSnap.data().count;

//----------------------------Get image---------------------------------//

            var files = [];
            var reader = new FileReader();
            var name;
            var input = document.createElement('input');
            input.type = 'file';

            input.onchange = e => {
                files = e.target.files;

                var extension = GetFileExt(files[0]);
                name = GetFileName(files[0]);
                name = name+extension;

                reader.readAsDataURL(files[0]);

            }

            reader.onload = function(){
                myImg.src = reader.result;
            }

            //----------------------Selection-------------------//

            selBtn.onclick = function(){
                input.click();
            }

            function GetFileExt(file){
                var temp = file.name.split('.');
                var ext = temp.slice(temp.length-1,temp.length)
                return '.'+ext[0];
            }
        
            function GetFileName(file){
                var temp = file.name.split('.');
                var fname = temp.slice(0, -1).join('.');
                return fname;
            }


//---------------------------Upload image to storage---------------------//

            async function uploadProcess(){
                var imgToUpload = files[0];
                const metaData={
                    contentType: imgToUpload.type
                }

                const storage = getStorage();

                const storageRef = sReF(storage, "Images/"+name);

                const UploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);

                UploadTask.on('state-changed',(snapshot)=>{
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    alert("Error");
                },
                ()=>{
                    getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=>{
                        AddDocument_CustomID(downloadURL);
                    });
                });
            }

            

            

//-----------------------------Counter-----------------------------------//
            

            equipmentCount.addEventListener("input", function(){
                var min = parseInt(equipmentCount.value);
                if(min < 0){
                    equipmentCount.value = "0";
                }
            });
            
//----------------------adding document-----------------------------//

            async function AddDocument_CustomID(url){
                

                if(equipmentLocation.value != "" && equipmentCost.value != "" && equipmentCount.value != "" && yrReceived.value != ""){
                    var today = new Date();
                    var date = today.getFullYear() +'-'+(today.getMonth()+1).toString().padStart(2, "0") +'-'+today.getDate().toString().padStart(2, "0");
                    var time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2, "0");
                    var dateTime = date+' '+time;
                    var year = today.getFullYear()+'';
                    


                    var ref = doc(db, userID+"Items", equipmentId.value)
                    var history = collection(db, userID+"ItemsHistory")
                    
                    var action = "Added";
                    var stats = "Standby";
                    var removed = "N/A";
                    var countings = doc(db,"counters", counting)
                    var num1 = equipmentId.value;
                    var num2 = parseInt(num1) + 1;
                    
                    const docSnap = await getDoc(ref);

                    //--------------cost counter---------------//
                    totalCost = parseInt(equipmentCost.value) * parseInt(equipmentCount.value)

                    var costGraph = doc(db, userID+"Costs", year)
                    const graph = await getDoc(costGraph)

                    if(graph.exists()){
                        await updateDoc(
                            costGraph,{
                                Bought: parseInt(graph.data().Bought) + totalCost
                            })
                    }
                    else{
                        await setDoc(
                            costGraph,{
                                Bought: totalCost,
                                Maintenance: 0
                            }
                        )
                    }
   
                    
                    if(docSnap.exists()){
                        alert("Document already exist");
                    }
                    else if(files.length != 0){
                        uploadProcess();
                        await setDoc(
                            ref,{
                                ID: equipmentId.value,
                                ImgURL: url,
                                RegistrationID: registerId.value,
                                Name: equipmentName.value,
                                Model: equipmentModel.value,
                                Location: equipmentLocation.value,
                                InMaintenance: "0",
                                InUse: "0",
                                Quantity: equipmentCount.value,
                                Cost: equipmentCost.value,
                                Supplier: equipmentSupplier.value,
                                YearReceived: yrReceived.value,
                                Status: stats,
                                Date: dateTime,
                                Total: equipmentCount.value
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
                                ID: equipmentId.value,
                                RegistrationID: registerId.value,
                                Name: equipmentName.value,
                                Model: equipmentModel.value,
                                Location: equipmentLocation.value,
                                Quantity: equipmentCount.value,
                                Cost: equipmentCost.value,
                                StockAdded: equipmentCount.value,
                                StockRemoved: removed,
                                Supplier: equipmentSupplier.value,
                                YearReceived: yrReceived.value,
                                Action: action,
                                Date: dateTime
                            }
                        )
                        await updateDoc(
                            countings,{
                            count: num2
                        })
                    }
                    else{
                        await setDoc(
                            ref,{
                                ID: equipmentId.value,
                                ImgURL: imgDefault,
                                RegistrationID: registerId.value,
                                Name: equipmentName.value,
                                Model: equipmentModel.value,
                                Location: equipmentLocation.value,
                                InMaintenance: "0",
                                InUse: "0",
                                Quantity: equipmentCount.value,
                                Cost: equipmentCost.value,
                                Supplier: equipmentSupplier.value,
                                YearReceived: yrReceived.value,
                                Status: stats,
                                Date: dateTime,
                                Total: equipmentCount.value
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
                                ID: equipmentId.value,
                                RegistrationID: registerId.value,
                                Name: equipmentName.value,
                                Model: equipmentModel.value,
                                Location: equipmentLocation.value,
                                Quantity: equipmentCount.value,
                                Cost: equipmentCost.value,
                                StockAdded: equipmentCount.value,
                                StockRemoved: removed,
                                Supplier: equipmentSupplier.value,
                                YearReceived: yrReceived.value,
                                Action: action,
                                Date: dateTime
                            }
                        )
                        await updateDoc(
                            countings,{
                            count: num2
                        })
                    }
                    location.reload();
                }
                else{
                    alert("Fill up all the required details to proceed")
                }    
            }
//-----------------------------Button events-------------------//

            addBtn.addEventListener("click", function(){
                AddDocument_CustomID();  
            });          