// js/core/auth.js
// --------------------------------------------------
// Authentication guard + logout handling
// Uses global Firebase compat (auth exported from firebase-init.js)
// --------------------------------------------------

import { auth } from "./firebase-init.js";

// Redirect to login page if user is not authenticated
export function initAuthGuard() {
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "admin-login.html";
    }
  });
}

// Attach logout button listener
export function initLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    auth.signOut().then(() => {
      window.location.href = "admin-login.html";
    });
  });
}
