/* ============================================================
   PACKAGES PAGE — FINAL CORRECTED VERSION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     GLOBAL STATE
     ============================================================ */
  let selectedPackage = null;
  let selectedPackagePrice = 0;

  /* ============================================================
     PACKAGE SELECTION
     ============================================================ */
  const packageCards = document.querySelectorAll(".pricing-card");

  packageCards.forEach(card => {
    const selectBtn = card.querySelector(".package-select-btn");
    const selectedBtn = card.querySelector(".package-selected-btn");

    /* ----------------------------
       SELECT PACKAGE
       ---------------------------- */
    selectBtn.addEventListener("click", e => {
      e.stopPropagation();

      // Remove active state from all cards
      packageCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      // Read package info
      selectedPackage = card.dataset.packageName;
      selectedPackagePrice = Number(card.dataset.packagePrice);

      // Save to storage
      localStorage.setItem("selectedPackage", selectedPackage);
      localStorage.setItem("selectedPackagePrice", selectedPackagePrice);

      // Reset add‑ons when switching packages
      localStorage.removeItem("selectedAddons");
      localStorage.removeItem("currentTravelFee");

      updateTotals();
    });

    /* ----------------------------
       DESELECT PACKAGE
       ---------------------------- */
    selectedBtn.addEventListener("click", e => {
      e.stopPropagation();

      card.classList.remove("active");

      selectedPackage = null;
      selectedPackagePrice = 0;

      // Clear storage
      localStorage.removeItem("selectedPackage");
      localStorage.removeItem("selectedPackagePrice");
      localStorage.removeItem("selectedAddons");
      localStorage.removeItem("currentTravelFee");

      updateTotals();
    });
  });



  /* ============================================================
     TOTALS UPDATE
     ============================================================ */
  function updateTotals() {
    // Package total only (add‑ons handled on add‑ons page)
    document.querySelectorAll(".package-total").forEach(el => {
      el.textContent = `$${selectedPackagePrice}`;
    });

    // Reset add‑ons + grand total on packages page
    document.querySelectorAll(".addons-total").forEach(el => {
      el.textContent = "$0";
    });

    document.querySelectorAll(".grand-total").forEach(el => {
      el.textContent = `$${selectedPackagePrice}`;
    });
  }

  updateTotals(); // Initialize on load
});
