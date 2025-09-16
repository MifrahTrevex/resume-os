// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-4221294871-1bdbb",
  "appId": "1:1043846491049:web:f54a74350c74d88c48f2b8",
  "storageBucket": "studio-4221294871-1bdbb.firebasestorage.app",
  "apiKey": "AIzaSyBIGFv362IjuyvzLD1_-nIcMSQv8qqyhX0",
  "authDomain": "studio-4221294871-1bdbb.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1043846491049"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
