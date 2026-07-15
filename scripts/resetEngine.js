/* ============================================================
   Unified Reset Engine — One Reset to Rule Them All
   File: ../scripts/resetEngine.js
============================================================ */

function unifiedReset(options = {}) {
  const {
    resetTravel = true,
    resetAddons = true,
    resetPackage = false,
    resetLocation = false
  } = options;

  /* -----------------------------
     TRAVEL FEE RESET
  ----------------------------- */
  if (resetTravel) {
    localStorage.setItem("ss_travel_fee", "0");
    localStorage.setItem("ss_travel_miles", "0");
    localStorage.setItem("ss_travel_region", "");
    localStorage.setItem("ss_travel_county", "");
    localStorage.setItem("ss_travel_city", "");
  }

  /* -----------------------------
     ADD‑ONS RESET
  ----------------------------- */
  if (resetAddons) {
    localStorage.setItem("selectedAddons", "[]");
    localStorage.setItem("addonsTotal", "0");
  }

  /* -----------------------------
     PACKAGE RESET
  ----------------------------- */
  if (resetPackage) {
    localStorage.setItem("ss_pkgPrice", "0");
    localStorage.setItem("ss_pkgName", "");
    localStorage.setItem("ss_pkgDesc", "");
    localStorage.setItem("ss_pkgMaxGuests", "");
  }

  /* -----------------------------
     LOCATION UI RESET (optional)
  ----------------------------- */
  if (resetLocation) {
    const miles = document.getElementById("travelMilesInput");
    const region = document.getElementById("travelRegionSelect");
    const county = document.getElementById("travelCountySelect");
    const city = document.getElementById("travelCitySelect");

    if (miles) miles.value = "";
    if (region) region.value = "";
    if (county) county.value = "";
    if (city) city.value = "";
  }

  /* -----------------------------
     RECOMPUTE EVERYTHING
  ----------------------------- */
  if (typeof applyUnifiedTravelFee === "function") applyUnifiedTravelFee();
  if (typeof updateTotalsDisplay === "function") updateTotalsDisplay();
  if (typeof updateContainer1 === "function") updateContainer1();
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
}
