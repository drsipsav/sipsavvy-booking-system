// ---------------------------------------------------------
// DOM WAITERS — CLEAN & UNIFIED
// ---------------------------------------------------------

function waitForFinalDOM() {
  const ids = [
    "sumPackageName",
    "sumPackageDescription",
    "sumPackageMaxGuests",
    "sumPackagePrice",
    "bk_selectedPackage",
    "bk_selectedPackagePrice"
  ];

  const ready = ids.every(id => document.getElementById(id));
  if (!ready) return setTimeout(waitForFinalDOM, 50);

  // Unified summary updates
  if (typeof updateContainer1 === "function") updateContainer1();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

waitForFinalDOM();

function waitForStableDOM() {
  const el = document.getElementById("sumPackageName");
  if (!el) return setTimeout(waitForStableDOM, 50);

  // Unified summary updates
  if (typeof updateContainer1 === "function") updateContainer1();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}
