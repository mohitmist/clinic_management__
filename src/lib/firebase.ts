// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "clinicflow-c434p",
  "appId": "1:1036498041382:web:7a491c99fd8ca1061c84e7",
  "storageBucket": "clinicflow-c434p.firebasestorage.app",
  "apiKey": "AIzaSyARrqHVhVOs5wwyEjnXRl26mCr1u_1dApA",
  "authDomain": "clinicflow-c434p.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1036498041382"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
