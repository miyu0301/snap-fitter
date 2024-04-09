import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// Config
///firebaseTest
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6zwyez7682t-ZleOaPlrd0OrNZhuXxmo",
    authDomain: "fitnessapp-d746d.firebaseapp.com",
    projectId: "fitnessapp-d746d",
    storageBucket: "fitnessapp-d746d.appspot.com",
    messagingSenderId: "15805578688",
    appId: "1:15805578688:web:988302b3a7f27bfb7d5c25"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
