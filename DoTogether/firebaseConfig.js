import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeMessaging, getMessaging} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDKN9fJQ7WSR864Fy-vwta70-9VVQrIXUs",
  authDomain: "dotogether-9e024.firebaseapp.com",
  projectId: "dotogether-9e024",
  storageBucket: "dotogether-9e024.firebasestorage.app",
  messagingSenderId: "238799534169",
  appId: "1:238799534169:web:2fd405c24e324a1c89d948",
  measurementId: "G-7R8PYJDQLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Authentication and Storage
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

//Initalise Firebase Cloud Messaging
let messaging = null;

if(typeof window !== 'undefined' && 'Notification' in window){
  try{
    messaging = getMessaging(app);
  }catch(error){
    console.log('FCM is not supported on this platform', error);
  }
}

export { app, firestore, auth, storage, messaging};