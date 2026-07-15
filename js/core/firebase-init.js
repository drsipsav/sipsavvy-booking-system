// firebase-init.js — Global Firebase Initialization // Clean, modular, production‑ready // Centralizes Firebase App, Auth, Firestore

// Firebase Compat SDK (loaded via script tags in HTML) // firebase-app-compat.js // firebase-auth-compat.js // firebase-firestore-compat.js

// Your Firebase configuration const firebaseConfig = { apiKey: "YOUR_API_KEY_HERE", authDomain: "YOUR_PROJECT_ID.firebaseapp.com", projectId: "YOUR_PROJECT_ID", storageBucket: "YOUR_PROJECT_ID.appspot.com", messagingSenderId: "YOUR_SENDER_ID", appId: "YOUR_APP_ID" };

// Initialize Firebase App firebase.initializeApp(firebaseConfig);

// Export Firebase services export const auth = firebase.auth(); export const db = firebase.firestore();

/**

Initialize Firebase (used by admin.js) */ export async function initFirebase() { return true; // Firebase is already initialized above }