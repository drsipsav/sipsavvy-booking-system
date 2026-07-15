console.log("PACKAGE SELECTION LOADED", Date.now());
/* ============================================================
   packageSelection.js — Package Selection Engine
   (Handles: restore, click selection, saving, totals update)
============================================================ */

/* -----------------------------------------
   GET SAVED PACKAGE
----------------------------------------- */


function getSavedPackage() {
  return localStorage.getItem("selectedPackage") || null;
}

/* -----------------------------------------
   SAVE PACKAGE
----------------------------------------- */
function savePackage(pkgName, pkgPrice) {
  localStorage.setItem("selectedPackage", pkgName);
  localStorage.setItem("ss_package_price", Number(pkgPrice));
}

/* -----------------------------------------
   INIT PACKAGE ENGINE
----------------------------------------- */
function initPackages() {
  const packageCards = document.querySelectorAll(".package-card");
  const totalDisplay = document.querySelector(".package-total");

  if (!packageCards.length || !totalDisplay) return;

  /* -----------------------------------------
     RESTORE SAVED PACKAGE
  ----------------------------------------- */
  const saved = getSavedPackage();

  if (saved) {
    packageCards.forEach(card => {
      const isMatch = card.dataset.package === saved;
      card.classList.toggle("active", isMatch);

      if (isMatch) {
        const price = Number(card.dataset.price) || 0;
        totalDisplay.textContent = `$${price}`;
      }
    });
  }

  /* -----------------------------------------
     CLICK HANDLERS
  ----------------------------------------- */
  packageCards.forEach(card => {
    card.addEventListener("click", () => {
      const pkg = card.dataset.package;
      const price = Number(card.dataset.price) || 0;

      // Clear active state
      packageCards.forEach(c => c.classList.remove("active"));

      // Activate selected
      card.classList.add("active");

      // Save
      savePackage(pkg, price);

      // Update UI
      totalDisplay.textContent = `$${price}`;

      // Update global totals
      if (window.updateTotals) updateTotals();
    });
  });

  /* -----------------------------------------
     INITIAL TOTAL UPDATE
  ----------------------------------------- */
  if (window.updateTotals) updateTotals();
}

/* -----------------------------------------
   EXPOSE GLOBALLY
----------------------------------------- */
window.initPackages = initPackages;
