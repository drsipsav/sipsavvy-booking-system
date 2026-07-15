// global-error.js — Centralized Error Handling
// Clean, modular, production‑ready
// Used across all modules for consistent error reporting

const errorBox = document.getElementById("globalErrorBox");

// SHOW ERROR (UI + Console)
export function showError(message, details = null) {
  if (errorBox) {
    errorBox.textContent = message;
    errorBox.style.display = "block";
  }

  // Optional: log details for debugging
  if (details) {
    console.error("SipSavvy Admin Error:", details);
  }
}

// HIDE ERROR
export function clearError() {
  if (errorBox) {
    errorBox.textContent = "";
    errorBox.style.display = "none";
  }
}

// WRAP ASYNC FIRESTORE CALLS
export async function safeAsync(fn, userMessage = "Something went wrong.") {
  try {
    return await fn();
  } catch (err) {
    showError(userMessage, err);
    return null;
  }
}

// OPTIONAL: TOAST NOTIFICATIONS
export function showToast(message, duration = 3000) {
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("visible");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
