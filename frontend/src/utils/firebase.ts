import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "dashd-dfd87.firebaseapp.com",
    projectId: "dashd-dfd87",
    storageBucket: "dashd-dfd87.firebasestorage.app",
    messagingSenderId: "816224891282",
    appId: "1:816224891282:web:018808ba845636d026914b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };