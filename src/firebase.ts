// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "workbench-af1e8.firebaseapp.com",
  projectId: "workbench-af1e8",
  storageBucket: "workbench-af1e8.firebasestorage.app",
  messagingSenderId: "105867433260",
  appId: "1:105867433260:web:c12596fc0cf6a303a98889",
  measurementId: "G-M2M88J189K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);


//const analytics = getAnalytics(app);