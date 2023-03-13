            import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
            import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
            import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
            
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
            from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

            import {getStorage, ref as sReF, uploadBytesResumable, getDownloadURL}
            from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js"

            const db = getFirestore();
            const auth = getAuth();
//----------------------references----------------------------//

                        

            let equipmentId = document.getElementById('equipmentId');
            let registerId = document.getElementById('registerID');
            let equipmentName = document.getElementById('equipmentName');
            let equipmentModel = document.getElementById('equipmentModel');
            let equipmentLocation = document.getElementById('equipmentLoc');
            let equipmentCount = document.getElementById('equipmentCount');
            let equipmentSupplier = document.getElementById('equipmentSupplier');

            let myImg = document.getElementById('myImg');
            let selBtn = document.getElementById('selBtn');
            var imgHolder;
//------------------------user reference-----------------------//

            let userID = localStorage.getItem("LoggedUser");
            
//-------------------------button references---------------//           
            let searchBtn = document.getElementById('searchBtn');
            let updBtn = document.getElementById('updBtn');
            let delBtn = document.getElementById('delBtn');


//-----------------------------Select Image--------------------------//

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
                console.log(name)
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
                        updateData(downloadURL);
                    });
                });
            }

//-----------------------------Get document------------------------//

            async function getADocument(){
                
                if(equipmentId.value != ""){
                    var ref = doc(db,userID+"Items", equipmentId.value)
                
                    const docSnap = await getDoc(ref);

                    if(docSnap.exists()){
                        myImg.src = docSnap.data().ImgURL; 
                        equipmentId.value = docSnap.data().ID;
                        registerId.value = docSnap.data().RegistrationID;
                        equipmentName.value = docSnap.data().Name;
                        equipmentModel.value = docSnap.data().Model;
                        equipmentLocation.value = docSnap.data().Location;
                        equipmentCount.value = docSnap.data().Quantity;
                        equipmentSupplier.value = docSnap.data().Supplier;
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

            async function updateData(url){
                var today = new Date();
                var date = today.getFullYear() +'-'+(today.getMonth()+1).toString().padStart(2, "0") +'-'+today.getDate().toString().padStart(2, "0");
                var time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2, "0");
                var dateTime = date+' '+time;
                var year = today.getFullYear()+'';
                var urlHolder = toString(url);
                
                
                if(equipmentId.value != "" && equipmentName.value != "" && equipmentLocation.value != "" && equipmentCount.value != "" && equipmentSupplier.value != ""){
                    var ref = doc(db,userID+"Items", equipmentId.value)
                    var history = collection(db,userID+"ItemsHistory")
                    var action = "Update";
                    const docSnap = await getDoc(ref);

                    var costGraph = doc(db, userID+"Costs", year)
                    const graph = await getDoc(costGraph)


                    var num1 = docSnap.data().Quantity;
                    var num2 = equipmentCount.value;
                    var num3 = docSnap.data().Total;
                    var costs = "N/A";
                    
                    if(docSnap.exists()){
                       if(parseInt(num1) > parseInt(num2)){
                            var stocks = parseInt(num1) - parseInt(num2);
                            var totalStock = parseInt(num3) -  stocks;
                            var stocks2 = "0";
                        }
                        else if(parseInt(num1) < parseInt(num2)){
                            var stocks2 = parseInt(num2) - parseInt(num1);
                            var totalStock = parseInt(num3) + stocks2;
                            var stocks = "0";
                        }
                        else{   
                            var totalStock = parseInt(num3) + 0;
                            var stocks = "0";
                            var stocks2 = "0";
                        }
                        var costBought = parseInt(docSnap.data().Cost) * stocks2;
                        var totalCost = parseInt(graph.data().Bought) + costBought;
                        if(graph.exists()){
                            await updateDoc(
                                costGraph,{
                                    Bought: totalCost
                                }
                            )
                        }
                        else{
                            await setDoc(
                                costGraph,{
                                    Bought: costBought,
                                    Maintenance: 0
                                }
                            )
                        }
                        
                        if(files.length != 0){
                            uploadProcess();
                            await updateDoc(
                                ref,{
                                    ID: equipmentId.value,
                                    ImgURL: url,
                                    RegistrationID: registerId.value,
                                    Name: equipmentName.value,
                                    Model: equipmentModel.value,
                                    Location: equipmentLocation.value,
                                    Quantity: equipmentCount.value,
                                    Date: dateTime,
                                    Supplier: equipmentSupplier.value,
                                    Total: totalStock
                                }
                            )
                            .then(()=>{
                                alert("Data updated successfully")
                            })
                            await addDoc(
                                history,{
                                    ID: equipmentId.value,
                                    RegistrationID: registerId.value,
                                    Name: equipmentName.value,
                                    Model: equipmentModel.value,
                                    Location: equipmentLocation.value,
                                    Quantity: equipmentCount.value,
                                    YearReceived: "N/A",
                                    Cost: costs,
                                    StockAdded: stocks2,
                                    StockRemoved: stocks,
                                    Supplier: equipmentSupplier.value,
                                    Action: action,
                                    Date: dateTime
                                    }
                                )
                            .catch((error)=>{
                                alert("Error operation, error:" + error)
                            })
                            location.reload(); 
                        }


                        else{
                            await updateDoc(
                                ref,{
                                    ID: equipmentId.value,
                                    RegistrationID: registerId.value,
                                    Name: equipmentName.value,
                                    Model: equipmentModel.value,
                                    Location: equipmentLocation.value,
                                    Quantity: equipmentCount.value,
                                    Date: dateTime,
                                    Supplier: equipmentSupplier.value,
                                    Total: totalStock
                                }
                            )
                            .then(()=>{
                                alert("Data updated successfully")
                            })
                            await addDoc(
                                history,{
                                    ID: equipmentId.value,
                                    RegistrationID: registerId.value,
                                    Name: equipmentName.value,
                                    Model: equipmentModel.value,
                                    Location: equipmentLocation.value,
                                    Quantity: equipmentCount.value,
                                    YearReceived: "N/A",
                                    Cost: costs,
                                    StockAdded: stocks2,
                                    StockRemoved: stocks,
                                    Supplier: equipmentSupplier.value,
                                    Action: action,
                                    Date: dateTime
                                    }
                                )
                            .catch((error)=>{
                                alert("Error operation, error:" + error)
                            })
                            location.reload(); 
                        }     
                        }
                        else{
                            alert("Invalid ID")
                        }
                    }
                else{
                    alert("Please fill up the form before updating")
                }
                
            }
//---------------------------Delete--------------------------//

            async function deleteData(){
                if(equipmentId.value != "" && equipmentName.value != "" && equipmentLocation.value != "" && equipmentCount.value  != "" && equipmentSupplier.value != "" && equipmentStatus.value != ""){
                    var ref = doc(db,userID+"Items", equipmentId.value)
                    var archive = collection(db,userID+"ArchiveItems")
                    var history = collection(db,userID+"ItemsHistory")
                    
                    var action = "Removed";
                    var costs = "N/A";
    
                    var today = new Date();
                    var date = today.getFullYear() +'-'+(today.getMonth()+1).toString().padStart(2, "0") +'-'+today.getDate().toString().padStart(2, "0");
                    var time = today.getHours().toString().padStart(2,"0") + ":" + today.getMinutes().toString().padStart(2, "0");
                    var dateTime = date+' '+time;
    
                    const docSnap = await getDoc(ref);
                    
                    if(!docSnap.exists()){
                        alert("Data doesn't exist");
                        return;
                    }
                    else{
                        await addDoc(
                            archive,{
                                ID: equipmentId.value,
                                RegistrationID: registerId.value, 
                                Name: equipmentName.value,
                                Model: equipmentModel.value,
                                Date: dateTime,
                                Cost: docSnap.data().Cost,
                                Supplier: docSnap.data().Supplier
                            }
                        )
                        await addDoc(
                            history,{
                                ID: equipmentId.value,
                                RegistrationID: registerId.value,
                                Name: equipmentName.value,
                                Model: equipmentModel.value,
                                Location: equipmentLocation.value,
                                Cost: costs,
                                StockAdded: costs,
                                StockRemoved: costs,
                                Quantity: equipmentCount.value,
                                Supplier: equipmentSupplier.value,
                                Action: action,
                                Date: dateTime
                            }
                        )
                        await deleteDoc(ref)
                        .then(()=>{
                            alert("Data deleted successfully")
                            location.reload();
                        })
                        .catch((error)=>{
                            alert("Error operation, error:" + error)
                        })
                    }
                }
                else{
                    alert("Please search for the equipment first");
                }

               
            }
//-----------------------------Button events-------------------//

            
            searchBtn.addEventListener("click", getADocument);
            updBtn.addEventListener("click", updateData);
            delBtn.addEventListener("click", deleteData);