// js/core/firebase-init.js
// --------------------------------------------
// Firebase initialization (global compat mode)
// --------------------------------------------

// IMPORTANT:
// Replace these placeholder values with your real Firebase config.
// You can find them in your Firebase Console → Project Settings.

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase (global compat)
firebase.initializeApp(firebaseConfig);

// Global references (shared across modules)
export const auth = firebase.auth();
export const db = firebase.firestore();
