// Initialize Firebase App
import { initializeApp } from "firebase/app";

// Firebase Services (modular SDK)
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmrbERKORLLez-uejgcpti-MGzVwpGfow",
  authDomain: "sipsavvy-booking-system.firebaseapp.com",
  projectId: "sipsavvy-booking-system",
  storageBucket: "sipsavvy-booking-system.firebasestorage.app",
  messagingSenderId: "483097824089",
  appId: "1:483097824089:web:b82ef2a5019ebdaa60da48"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);        // Firestore Database
export const auth = getAuth(app);           // Authentication
export const functions = getFunctions(app); // Cloud Functions
export const storage = getStorage(app);     // Cloud Storage


const app = initializeApp(firebaseConfig);
