// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx_ttb1Iwuk3FuGWLz2K4n6MjjSHt_Mn8",
  authDomain: "bds-website-11dc4.firebaseapp.com",
  projectId: "bds-website-11dc4",
  storageBucket: "bds-website-11dc4.firebasestorage.app",
  messagingSenderId: "346152437288",
  appId: "1:346152437288:web:e6b67947dfedf927f1171d",
  measurementId: "G-59TE4948JL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, db };
