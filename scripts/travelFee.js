/* ============================================================
   UNIFIED TRAVEL-FEE ENGINE — USING YEMI'S MILEAGE RULES
============================================================ */

/* ============================
   STORAGE HELPERS
============================ */
function getTravel(key) {
  return localStorage.getItem(`ss_travel_${key}`) || "";
}

function setTravel(key, value) {
  localStorage.setItem(`ss_travel_${key}`, String(value));
}

function clearTravel() {
  ["region","county","city","miles","fee","reason"]
    .forEach(k => localStorage.removeItem(`ss_travel_${k}`));
}

/* ============================
   SIPSAVVY'S MILEAGE RULES
   DO NOT MODIFY
============================ */
function computeTravelFee(region, county, miles) {
  miles = Number(miles);
  if (!miles || isNaN(miles)) return { fee: 0, reason: "" };
  if (miles > 75)             return { fee: 0, reason: "Outside service area" };

  if (county === "Charles County" && region === "Southern Maryland")
    return { fee: 15, reason: `${miles} miles to ${county}, ${region}` };

  if (["Saint Mary's County","St. Mary's County","Calvert County"].includes(county))
    return { fee: 20 + miles, reason: `${miles} miles to ${county}, ${region}` };

  if (county === "Prince George's County") {
    if (miles <= 20) return { fee: 20, reason: `${miles} miles to ${county}, ${region}` };
    if (miles <= 25) return { fee: 30, reason: `${miles} miles to ${county}, ${region}` };
    return           { fee: 50, reason: `${miles} miles to ${county}, ${region}` };
  }

  if (region === "Northern Virginia") {
    if (miles <= 30) return { fee: 40,             reason: `${miles} miles to ${county}, ${region}` };
    return           { fee: 40 + (miles - 30),     reason: `${miles} miles to ${county}, ${region}` };
  }

  if (region === "Washington DC") {
    if (miles <= 30) return { fee: 45,             reason: `${miles} miles to ${county}, ${region}` };
    return           { fee: 45 + (miles - 30),     reason: `${miles} miles to ${county}, ${region}` };
  }

  if (["Montgomery County","Howard County","Anne Arundel County","Frederick County"].includes(county))
    return { fee: 30 + miles, reason: `${miles} miles to ${county}, ${region}` };

  if (county === "Baltimore City")   return { fee: 65, reason: `${miles} miles to ${county}, ${region}` };
  if (county === "Baltimore County") return { fee: 70, reason: `${miles} miles to ${county}, ${region}` };

  if (["Carroll County","Harford County","Cecil County","Caroline County"].includes(county)) {
    if (miles <= 60) return { fee: 70,             reason: `${miles} miles to ${county}, ${region}` };
    return           { fee: 70 + (miles - 60),     reason: `${miles} miles to ${county}, ${region}` };
  }

  return { fee: 0, reason: `${miles} miles to ${county}, ${region}` };
}

/* ============================
   UI UPDATE
   Writes to ALL selector types used across pages.
============================ */
function updateTravelUI() {
  const fee    = Number(getTravel("fee")   || 0);
  const miles  = Number(getTravel("miles") || 0);
  const reason = getTravel("reason") || "";

  // ── Packages-page class/ID targets ──
  document.querySelectorAll("#travelFeeAmt, .travel-fee-amount").forEach(el => {
    el.textContent = `$${fee.toFixed(2)}`;
  });
  document.querySelectorAll(".feeCharge").forEach(el => {
    el.textContent = `$${fee.toFixed(2)}`;
  });
  document.querySelectorAll(".milesCharge").forEach(el => {
    el.textContent = miles > 0 ? `${miles} mi` : "";
  });

  // ── data-ss-travel attribute targets (booking.html containers) ──
  document.querySelectorAll("[data-ss-travel='fee']").forEach(el => {
    el.textContent = `$${fee.toFixed(2)}`;
  });
  document.querySelectorAll("[data-ss-travel='miles']").forEach(el => {
    el.textContent = `${miles} mi`;
  });
  document.querySelectorAll("[data-ss-travel='reason']").forEach(el => {
    el.textContent = reason;
  });

  // ── data-summary attribute targets (Box 5 + container4) ──
  document.querySelectorAll('[data-summary="travel-fee"]').forEach(el => {
    el.textContent = `$${fee.toFixed(2)}`;
  });
  document.querySelectorAll('[data-summary="travel-miles"]').forEach(el => {
    el.textContent = miles > 0 ? `${miles} mi` : "—";
  });
  document.querySelectorAll('[data-summary="travel-reason"]').forEach(el => {
    el.textContent = reason || "—";
  });

  // ── ID-based legacy targets ──
  const summaryReason = document.getElementById("summaryTravelReason");
  if (summaryReason) summaryReason.textContent = reason;
}

/* ============================
   SELECTORS
============================ */
function onRegionSelect(region) {
  setTravel("region", region);
  setTravel("county", "");
  setTravel("city",   "");
  setTravel("miles",  0);
  setTravel("fee",    0);
  setTravel("reason", "");
  updateTravelUI();
  if (typeof updateTotalsDisplay     === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

function onCountySelect(county) {
  setTravel("county", county);
  setTravel("city",   "");
  setTravel("miles",  0);
  setTravel("fee",    0);
  setTravel("reason", "");
  updateTravelUI();
  if (typeof updateTotalsDisplay     === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

function onCitySelect(city, miles) {
  setTravel("city",   city);
  setTravel("miles",  Number(miles || 0));
  setTravel("fee",    0);
  setTravel("reason", "");
  calculateTravelFee();
  updateTravelUI();
  if (typeof updateTotalsDisplay     === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

/* ============================
   CALCULATE TRAVEL FEE
   FIX: removed ss_addons injection (Travel Fee was being
        double-counted in grand total via addonsTotal).
   FIX: removed ghost ss_travelFee key write.
   FIX: grand total display uses .toFixed(2).
   FIX: updateTravelUI() now writes to [data-summary="travel-fee"].
============================ */
function calculateTravelFee() {
  const region = getTravel("region");
  const county = getTravel("county");
  const miles  = Number(getTravel("miles") || 0);

  const { fee, reason } = computeTravelFee(region, county, miles);

  // Write canonical underscore keys (matching SS_KEYS in booking/packages)
  setTravel("fee",    fee);
  setTravel("reason", reason);
  // NOTE: do NOT write ss_travelFee (camelCase) — that was the ghost key
  //       causing confusion. Only ss_travel_fee is canonical.

  // NOTE: do NOT inject Travel Fee into ss_addons — it gets tracked
  //       separately via ss_travel_fee and should NOT be summed with addonsTotal.

  if (typeof saveGrandTotal         === "function") saveGrandTotal();
  if (typeof loadGrandTotalIntoBox5 === "function") loadGrandTotalIntoBox5();

  updateTravelUI();

  // Grand total display — formatted with .toFixed(2)
  const grand = Number(localStorage.getItem("ss_grandTotal") || 0);
  document.querySelectorAll('[data-summary="grand-total"]').forEach(el => {
    el.textContent = `$${grand.toFixed(2)}`;
  });

  // Destination display — null-guarded
  const locInput = document.getElementById("eventLocation");
  const loc      = locInput ? (locInput.value || "") : "";
  if (loc) {
    localStorage.setItem("ss_travel_summary", loc);
    document.querySelectorAll('[data-ss-travel="summary"]').forEach(el => {
      el.textContent = loc;
    });
  }

  // setTimeout block: uses querySelectorAll (not querySelector)
  setTimeout(() => {
    const feeStored    = Number(getTravel("fee")    || 0);
    const milesStored  = Number(getTravel("miles")  || 0);
    const reasonStored = getTravel("reason") || "";

    const feeAmt = document.getElementById("travelFeeAmt");
    if (feeAmt) feeAmt.textContent = `$${feeStored.toFixed(2)}`;

    document.querySelectorAll(".milesCharge").forEach(el => {
      el.textContent = `${milesStored} mi`;
    });
    document.querySelectorAll(".reasonCharge").forEach(el => {
      el.textContent = reasonStored;
    });

    // Keep Box 5 + container4 travel-fee elements in sync
    document.querySelectorAll('[data-summary="travel-fee"]').forEach(el => {
      el.textContent = `$${feeStored.toFixed(2)}`;
    });
  }, 0);

  if (typeof updateTotalsDisplay     === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
  if (typeof loadBookingPackage      === "function") loadBookingPackage();
  if (typeof loadBookingAddons       === "function") loadBookingAddons();
  if (typeof loadGrandTotalIntoBox5  === "function") loadGrandTotalIntoBox5();
}

/* ============================
   RESET
============================ */
function resetTravelFeePriceOnly() {
  setTravel("fee",    0);
  setTravel("reason", "");
  updateTravelUI();
  if (typeof updateTotalsDisplay     === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

function hardResetAll() {
  clearTravel();
  updateTravelUI();
  if (typeof updateTotalsDisplay     === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

/* ============================
   INIT
============================ */
function initTravelEngine() {
  updateTravelUI();
  document.getElementById("travelRegion")?.addEventListener("change", e => onRegionSelect(e.target.value));
  document.getElementById("travelCounty")?.addEventListener("change", e => onCountySelect(e.target.value));
  document.getElementById("travelCity")?.addEventListener("change", e => {
    const opt   = e.target.options[e.target.selectedIndex];
    const miles = opt.dataset.miles || 0;
    onCitySelect(e.target.value, miles);
  });
  document.getElementById("confirmLocationBtn")?.addEventListener("click", calculateTravelFee);
  document.getElementById("resetTravelFeePriceOnlyBtn")?.addEventListener("click", resetTravelFeePriceOnly);
  document.getElementById("hardResetBtn")?.addEventListener("click", hardResetAll);
}

document.addEventListener("DOMContentLoaded", initTravelEngine);
