/* ============================================================
   BOOKING.JS — SAFE, PAGE‑GUARDED VERSION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------
     PAGE GUARD — ONLY RUN ON BOOKING PAGE
     ------------------------------------------------------------ */
  if (!document.body.classList.contains('page-solid')) {
    console.log("booking.js loaded on a non‑booking page — skipping init");
    return; // SAFE EXIT — prevents crashes on packages/add‑ons pages
  }

  console.log("booking.js initialized on booking page");

  /* ------------------------------------------------------------
     ALL BOOKING.JS FUNCTIONS MUST BE INSIDE THIS BLOCK
     ------------------------------------------------------------ */

  // Example: load selection from localStorage
  function ssLoadSelection() {
    const pkg = JSON.parse(localStorage.getItem("ss-package"));
    const addons = JSON.parse(localStorage.getItem("ss-addons"));

    const pkgEl = document.getElementById("bk-package");
    const addonsEl = document.getElementById("bk-addons");
    const totalEl = document.getElementById("bk-total");

    if (pkgEl && pkg) {
      pkgEl.textContent = `${pkg.name} — $${pkg.price}`;
    }

    if (addonsEl && addons) {
      const items = [];

      if (addons.hours > 0) items.push(`${addons.hours} Extra Hour(s)`);
      if (addons.travelName) items.push(`Travel: ${addons.travelName}`);
      if (addons.toastTier) items.push(`Champagne: ${addons.toastTier}`);

      addonsEl.textContent = items.length ? items.join(", ") : "None selected";
    }

    if (totalEl && pkg) {
      const addonsTotal =
        (addons?.hourPrice || 0) +
        (addons?.travelFee || 0) +
        (addons?.toastPrice || 0);

      const grandTotal = pkg.price + addonsTotal;
      totalEl.textContent = `$${grandTotal}`;
    }
  }

  // Booking page initializer
  function bkLoadSelection() {
    console.log("bkLoadSelection running");
    ssLoadSelection();
  }

  // Run booking initializer
  bkLoadSelection();

  /* ------------------------------------------------------------
     ANY OTHER BOOKING LOGIC GOES HERE
     ------------------------------------------------------------ */

});
