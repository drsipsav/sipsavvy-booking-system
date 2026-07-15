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
============================ */
function computeTravelFee(region, county, miles) {
  miles = Number(miles);
  if (!miles || isNaN(miles)) return { fee: 0, reason: "" };
  if (miles > 75)             return { fee: 0, reason: "Outside service area" };

  if (county === "Charles County" && region === "Southern Maryland")
    return { fee: 15, reason: `${miles} miles` };

  if (["Saint Mary's County","St. Mary's County","Calvert County"].includes(county))
    return { fee: 20 + miles, reason: `${miles} miles` };

  if (county === "Prince George's County") {
    if (miles <= 20) return { fee: 20, reason: `${miles} miles` };
    if (miles <= 25) return { fee: 30, reason: `${miles} miles` };
    return           { fee: 50, reason: `${miles} miles` };
  }

  if (region === "Northern Virginia") {
    if (miles <= 30) return { fee: 40,             reason: `${miles} miles` };
    return           { fee: 40 + (miles - 30),     reason: `${miles} miles` };
  }

  if (region === "Washington DC") {
    if (miles <= 30) return { fee: 45,             reason: `${miles} miles` };
    return           { fee: 45 + (miles - 30),     reason: `${miles} miles` };
  }

  if (["Montgomery County","Howard County","Anne Arundel County","Frederick County"].includes(county))
    return { fee: 30 + miles, reason: `${miles} miles` };

  if (county === "Baltimore City")   return { fee: 65, reason: `${miles} miles` };
  if (county === "Baltimore County") return { fee: 70, reason: `${miles} miles` };

  if (["Carroll County","Harford County","Cecil County","Caroline County"].includes(county)) {
    if (miles <= 60) return { fee: 70,             reason: `${miles} miles` };
    return           { fee: 70 + (miles - 60),     reason: `${miles} miles` };
  }

  return { fee: 0, reason: `${miles} miles` };
}

/* ============================
   UI UPDATE
============================ */
function updateTravelUI() {
  const fee    = Number(getTravel("fee")   || 0);
  const miles  = Number(getTravel("miles") || 0);
  const reason = getTravel("reason") || "";

  document.querySelectorAll("#travelFeeAmt, .travel-fee-amount").forEach(el => {
    el.textContent = `$${fee.toFixed(2)}`;
  });
  document.querySelectorAll(".feeCharge").forEach(el => {
    el.textContent = `$${fee.toFixed(2)}`;
  });
  document.querySelectorAll(".milesCharge").forEach(el => {
    el.textContent = miles > 0 ? `${miles} mi` : "";
  });
  document.querySelectorAll("[data-ss-travel='fee']").forEach(el => {
    el.textContent = `$${fee.toFixed(2)}`;
  });
  document.querySelectorAll("[data-ss-travel='miles']").forEach(el => {
    el.textContent = `${miles} mi`;
  });
  document.querySelectorAll("[data-ss-travel='reason']").forEach(el => {
    el.textContent = reason;
  });
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
  if (typeof updateTotalsDisplay    === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

function onCountySelect(county) {
  setTravel("county", county);
  setTravel("city",   "");
  setTravel("miles",  0);
  setTravel("fee",    0);
  setTravel("reason", "");
  updateTravelUI();
  if (typeof updateTotalsDisplay    === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

function onCitySelect(city, miles) {
  setTravel("city",  city);
  setTravel("miles", Number(miles || 0));
  setTravel("fee",   0);
  setTravel("reason","");
  calculateTravelFee();
  updateTravelUI();
  if (typeof updateTotalsDisplay    === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

/* ============================
   CALCULATE TRAVEL FEE
   FIX: removed duplicate const grand / const loc declarations
        added null guard for eventLocation element
============================ */
function calculateTravelFee() {
  const region = getTravel("region");
  const county = getTravel("county");
  const miles  = Number(getTravel("miles") || 0);

  const { fee, reason } = computeTravelFee(region, county, miles);

  setTravel("fee",    fee);
  setTravel("reason", reason);
  localStorage.setItem("ss_travelFee", fee);

  if (typeof saveGrandTotal          === "function") saveGrandTotal();
  if (typeof loadGrandTotalIntoBox5  === "function") loadGrandTotalIntoBox5();

  // Save Travel Fee as Add-On
  let addons = JSON.parse(localStorage.getItem("ss_addons") || "[]");
  addons = addons.filter(a => a.name !== "Travel Fee");
  addons.push({ name: "Travel Fee", price: fee });
  localStorage.setItem("ss_addons", JSON.stringify(addons));

  updateTravelUI();

  // Update grand total display
  const grand   = localStorage.getItem("ss_grandTotal") || "0";
  document.querySelectorAll('[data-summary="grand-total"]').forEach(el => {
    el.textContent = `$${grand}`;
  });

  // Update destination display — null-guarded
  const locInput = document.getElementById("eventLocation");
  const loc      = locInput ? (locInput.value || "") : "";
  localStorage.setItem("ss_travel_summary", loc);
  document.querySelectorAll('[data-ss-travel="summary"]').forEach(el => {
    el.textContent = loc;
  });

  setTimeout(() => {
    const feeStored   = Number(getTravel("fee")   || 0);
    const milesStored = Number(getTravel("miles")  || 0);
    const reasonStored = getTravel("reason") || "";

    const feeAmt = document.getElementById("travelFeeAmt");
    if (feeAmt) feeAmt.textContent = `$${feeStored.toFixed(2)}`;

    const milesEl = document.querySelector(".milesCharge");
    if (milesEl) milesEl.textContent = `${milesStored} mi`;

    const reasonEl = document.querySelector(".reasonCharge");
    if (reasonEl) reasonEl.textContent = reasonStored;
  }, 0);

  if (typeof updateTotalsDisplay    === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
  if (typeof loadBookingPackage     === "function") loadBookingPackage();
  if (typeof loadBookingAddons      === "function") loadBookingAddons();
  if (typeof loadGrandTotalIntoBox5 === "function") loadGrandTotalIntoBox5();
}

/* ============================
   RESET
============================ */
function resetTravelFeePriceOnly() {
  setTravel("fee",    0);
  setTravel("reason", "");
  updateTravelUI();
  if (typeof updateTotalsDisplay    === "function") updateTotalsDisplay();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}

function hardResetAll() {
  clearTravel();
  updateTravelUI();
  if (typeof updateTotalsDisplay    === "function") updateTotalsDisplay();
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
