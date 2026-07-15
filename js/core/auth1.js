// auth.js — Admin Authentication Guard // Clean, modular, production‑ready // Ensures only authenticated admins can access the dashboard

import { auth } from "./firebase-init.js";

/**

Redirects to login page if user is not authenticated. */ export function requireAdminAuth() { auth.onAuthStateChanged(user => { if (!user) { window.location.href = "admin-login.html"; } }); }

/**

Logs out the current admin and redirects to login. */ export function logoutAdmin() { auth.signOut().then(() => { window.location.href = "admin-login.html"; }); }