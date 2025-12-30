import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyB9QS0AJw2uHCau1-RYdLAG9IskZF-gtb4",
    authDomain: "group-trip-planner-50a15.firebaseapp.com",
    projectId: "group-trip-planner-50a15",
    storageBucket: "group-trip-planner-50a15.firebasestorage.app",
    messagingSenderId: "597430209554",
    appId: "1:597430209554:web:f0a1d48e768140a398dccb",
    measurementId: "G-F4TLKPZSMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Firestore services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
