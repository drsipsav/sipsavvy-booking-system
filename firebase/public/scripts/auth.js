// Firebase Authentication for SipSavvy Admin Dashboard
// -----------------------------------------------------

import { auth } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

/**
 * Log in admin user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
 */
export async function adminLogin(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Admin logged in");
    window.location.href = "/admin/index.html"; // redirect to admin dashboard
  } catch (error) {
    console.error("Login failed:", error);
    alert("Invalid login credentials");
  }
}

/**
 * Log out admin user
 * @returns {Promise<void>}
 */
export async function adminLogout() {
  try {
    await signOut(auth);
    console.log("Admin logged out");
    window.location.href = "/index.html"; // redirect to home page
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

/**
 * Protect admin pages
 * Redirects user if not logged in
 */
export function protectAdminPage() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("Unauthorized access — redirecting");
      window.location.href = "/index.html";
    }
  });
}

/**
 * Optional: Run code when admin is logged in
 * @param {Function} callback
 */
export function onAdminLoggedIn(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    }
  });
}

