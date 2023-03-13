    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-analytics.js";
            
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
            
    import{
        getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField
    }
    from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";

    const db = getFirestore();

//------------------------References----------------------------------//
        let chart = document.getElementById('chart').getContext('2d');
        let userID = localStorage.getItem("LoggedUser")

        var today = new Date();
        var year = today.getFullYear()+'';


            var ref = doc(db,userID+"Costs", year)
            const docSnap = await getDoc(ref)

            var bought = docSnap.data().Bought;
            var mainte = docSnap.data().Maintenance;


            let costChart = new Chart(chart,{
                type:'bar',
                data:{
                    labels:['Bought', 'Maintenance'],
                    datasets:[{
                        label:'Total Cost',
                        data:[
                            bought,
                            mainte
                        ],
                        backgroundColor:[
                            'green' ,'red'
                        ],
                        borderWidth:1,
                        borderColor:'black',
                        hoverBorderWidth:3,
                        hoverBorderColor:'#000'
                    }]
                },
                options:{
                    plugins:{
                        title:{
                            display:true,
                            text:'Total Year Cost'
                        },
                        legend:{
                            display:false
                        }
                    }
                }
            });