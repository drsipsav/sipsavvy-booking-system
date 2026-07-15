/* ============================================================
   orchestrator.js — Central Initialization Controller
   Unified for ss-package + addons + travel + totals
============================================================ */

/* ============================================================
   MASTER INITIALIZER
============================================================ */
window.addEventListener("load", () => {
  console.log("%c[ORCHESTRATOR] Page fully loaded — initializing modules…",
              "color:#C71585; font-weight:bold;");

  /* ------------------------------------------------------------
     1. PACKAGES ENGINE
  ------------------------------------------------------------ */
  if (typeof initPackages === "function") {
    console.log("[ORCHESTRATOR] initPackages()");
    initPackages();
  } else {
    console.warn("[ORCHESTRATOR] initPackages() missing");
  }


  /* ------------------------------------------------------------
     4. TOTALS ENGINE
        (shared-booking.js exposes updateTotals)
  ------------------------------------------------------------ */
  if (typeof updateTotals === "function") {
    console.log("[ORCHESTRATOR] updateTotals()");
    updateTotals();
  } else {
    console.warn("[ORCHESTRATOR] updateTotals() missing");
  }

  /* ------------------------------------------------------------
     5. BOOKING PAGE INITIALIZER
        (booking.js exposes loadSelectedPackage, etc.)
  ------------------------------------------------------------ */
  if (document.body.classList.contains("booking-page")) {
    console.log("[ORCHESTRATOR] Booking page detected");

    if (typeof loadSelectedPackage === "function") {
      loadSelectedPackage();
    }
    if (typeof loadSelectedAddons === "function") {
      loadSelectedAddons();
    }
    if (typeof loadTravelFee === "function") {
      loadTravelFee();
    }

    if (typeof updateTotals === "function") {
      updateTotals();
    }
  }

  console.log("%c[ORCHESTRATOR] Initialization complete.",
              "color:#32CD32; font-weight:bold;");
});

initPackages();
updateTotals();
