/* ============================================================
   shared-totals.js — Global Totals Engine
   Works on: packages.html, addons.html, booking.html
============================================================ */
function updateTotals() {
  // ⭐ PACKAGE PRICE
  const packagePrice = Number(localStorage.getItem("selectedPackagePrice")) || 0;

  // ⭐ NORMAL ADD-ONS
  const addons = JSON.parse(localStorage.getItem("selectedAddons") || "[]");
  let addonsTotal = addons.reduce((sum, item) => sum + Number(item.price || 0), 0);

  // ⭐ EXTRA HOURS
  let extraHourPrice = 0;

  // Global
  if (SS?.addons?.extraHoursPrice) {
    extraHourPrice = Number(SS.addons.extraHoursPrice) || 0;
  }

  // LocalStorage override
  extraHourPrice = Number(localStorage.getItem("extraHoursPrice")) || extraHourPrice;

  addonsTotal += extraHourPrice;

  // ⭐ TRAVEL FEE (ALWAYS NUMBER)
  const travelFee = Number(SS?.travel?.fee) || 0;

  // ⭐ TOTAL ADD-ONS INCLUDING TRAVEL
  const totalAddonsWithTravel = addonsTotal + travelFee;

  // ⭐ GRAND TOTAL (ALWAYS NUMBER)
  const grandTotal = packagePrice + totalAddonsWithTravel;

  // ⭐ UPDATE UI
  const pkgEl = document.getElementById("selected-package-price");
  const addonsEl = document.getElementById("addons-total");
  const extraHourEl = document.getElementById("extra-hour-total");
  const travelEl = document.getElementById("travelTotal");
  const grandEl = document.getElementById("grand-total");

  if (pkgEl) pkgEl.textContent = `$${packagePrice.toFixed(2)}`;
  if (addonsEl) addonsEl.textContent = `$${addonsTotal.toFixed(2)}`;
  if (extraHourEl) extraHourEl.textContent = `$${extraHourPrice.toFixed(2)}`;
  if (travelEl) travelEl.textContent = `$${travelFee.toFixed(2)}`;
  if (grandEl) grandEl.textContent = `$${grandTotal.toFixed(2)}`;

  // ⭐ FOOTER TOTALS
  const footerTravel = document.getElementById("footer-travel-fee");
  const footerGrand = document.getElementById("footer-grand-total");

  if (footerTravel) footerTravel.textContent = `$${travelFee.toFixed(2)}`;
  if (footerGrand) footerGrand.textContent = `$${grandTotal.toFixed(2)}`;

  // ⭐ HEADER TOTAL
  const headerTotal = document.getElementById("header-total");
  if (headerTotal) headerTotal.textContent = `$${grandTotal.toFixed(2)}`;
}





