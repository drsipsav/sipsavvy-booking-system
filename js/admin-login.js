// admin-login.js — Secure Admin Login Handler 
// Clean, modular, production‑ready 
// Handles: login form, Firebase auth, error display

import { auth } from "./firebase-init.js"; 



// DOM ELEMENTS 
const emailInput = document.getElementById("loginEmail"); 
const passwordInput = document.getElementById("loginPassword"); 
const loginBtn = document.getElementById("loginBtn"); 
const errorBox = document.getElementById("loginError");

// DISPLAY ERROR 
function showError(message) {
     errorBox.textContent = message;
      errorBox.style.display = "block"; 
    }

// CLEAR ERROR 
function clearError() { 
    errorBox.textContent = ""; 
    errorBox.style.display = "none"; 
}



// LOGIN HANDLER 
async function handleLogin() {
     clearError(); 



const email = emailInput.value.trim(); 
const password = passwordInput.value.trim();

if (!email || !password) { 
    showError("Please enter both email and password."); 
    return; 
}
try { await auth.signInWithEmailAndPassword(email, password); 
    window.location.href = "admin.html"; 
} 
catch (err) { 
    if (err.code === "auth/user-not-found") showError("No admin found with this email."); 
    else if (err.code === "auth/wrong-password") showError("Incorrect password."); 
    else showError("Login failed. Please try again."); 
} 
 } 



// ENTER KEY SUPPORT 
passwordInput.addEventListener("keypress", e => { if (e.key === "Enter") handleLogin(); 
}); 



// BUTTON CLICK 
loginBtn.addEventListener("click", handleLogin);