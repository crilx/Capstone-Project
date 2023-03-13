 
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
  
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

    
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);


    import {getStorage, ref as sReF, uploadBytesResumable, getDownloadURL}
    from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js"


    import{getFirestore, doc, getDoc, setDoc, collection, addDoc}
    from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
    const clouddb = getFirestore();

    //-----------------------Variables and References------------------//
    var files = [];
    var reader = new FileReader();


    var namebox = document.getElementById('namebox');
    var extLab = document.getElementById('extlab');
    var myImg = document.getElementById('myImg');
    var progLab = document.getElementById('upprogress');
    var selBtn = document.getElementById('selBtn');
    var updtBtn = document.getElementById('upBtn');
    var downBtn = document.getElementById('downBtn');

    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        files = e.target.files;

        var extension = GetFileExt(files[0]);
        var name = GetFileName(files[0]);

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

    //-------Upload Image---------------------//

    async function uploadProcess(){
        var imgToUpload = files[0];

        var imgName = namebox.value;

        const metaData={
            contentType: imgToUpload.type
        }

        const storage = getStorage();

        const storageRef = sReF(storage, "Images/"+imgName);

        const UploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);

        UploadTask.on('state-changed',(snapshot)=>{
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
            alert("Error");
        },
        ()=>{
            getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=>{
                SaveURLtoFirestore(downloadURL);
            });
        });
    }

    //--------------------------upload to Firestore-------------------------//

    export async function SaveURLtoFirestore(url){
        return url;
    }


    async function GetImagefromFirestore(){
        var name = namebox.value;

        var ref = doc(clouddb, "ImageLinks/"+name);

        const docSnap = await getDoc(ref);

        if(docSnap.exists()){
            myImg.src = docSnap.data().ImageURL;
        }
    }


    updtBtn.onclick = uploadProcess;
    downBtn.onclick = GetImagefromFirestore;

