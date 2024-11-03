// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpr9TpQOSyPJ0uwUP6cMMpungIEWQbyZg",
  authDomain: "minichess-6bc2f.firebaseapp.com",
  projectId: "minichess-6bc2f",
  storageBucket: "minichess-6bc2f.firebasestorage.app",
  messagingSenderId: "750155562659",
  appId: "1:750155562659:web:29ac5ac93a49982abc0916",
  measurementId: "G-TGJXQ0BXX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);