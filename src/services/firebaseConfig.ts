// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4_iI-VzrUNMrM-M8Fe-953Db7CTCrevM",
  authDomain: "investvision-385ac.firebaseapp.com",
  projectId: "investvision-385ac",
  storageBucket: "investvision-385ac.firebasestorage.app",
  messagingSenderId: "482607449585",
  appId: "1:482607449585:web:0552dce3a64c2db1cdf050",
  measurementId: "G-VY37ELKX7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);