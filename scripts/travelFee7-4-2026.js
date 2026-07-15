// ============================================================
// TRAVEL FEE ENGINE — USING YOUR EXACT RULES
// ============================================================

// ------------------------------------------------------------
// YOUR EXACT TRAVEL FEE RULES
// ------------------------------------------------------------
function computeTravelFee(region, county, miles) {
  miles = Number(miles);

  if (!miles || isNaN(miles)) return { fee: 0, reason: "" };
  if (miles > 75) return { fee: 0, reason: "Outside service area" };

  // 1. WALDORF — always $15
  if (county === "Charles County" && region === "Southern Maryland") {
    return { fee: 15, reason: `${miles} miles` };
  }

  // 2. St. Mary's / Calvert
  if (
    county === "Saint Mary's County" ||
    county === "St. Mary's County" ||
    county === "Calvert County"
  ) {
    return { fee: 15 + miles, reason: `${miles} miles` };
  }

  // 3. PRINCE GEORGE’S COUNTY
  if (county === "Prince George's County") {
    if (miles <= 20) return { fee: 20, reason: `${miles} miles` };
    if (miles <= 25) return { fee: 30, reason: `${miles} miles` };
    return { fee: 50, reason: `${miles} miles` };
  }

  // 4. NORTHERN VIRGINIA
  if (region === "Northern Virginia") {
    if (miles <= 30) return { fee: 40, reason: `${miles} miles` };
    return { fee: 40 + (miles - 30), reason: `${miles} miles` };
  }

  // 5. WASHINGTON DC
  if (region === "Washington DC") {
    if (miles <= 30) return { fee: 45, reason: `${miles} miles` };
    return { fee: 45 + (miles - 30), reason: `${miles} miles` };
  }

  // 6. MONTGOMERY / HOWARD / ANNE ARUNDEL / FREDERICK
  if (
    county === "Montgomery County" ||
    county === "Howard County" ||
    county === "Anne Arundel County" ||
    county === "Frederick County"
  ) {
    return { fee: 25 + miles, reason: `${miles} miles` };
  }

  // 7. BALTIMORE CITY
  if (county === "Baltimore City") {
    return { fee: 65, reason: `${miles} miles` };
  }

  // 8. BALTIMORE COUNTY
  if (county === "Baltimore County") {
    return { fee: 70, reason: `${miles} miles` };
  }

  // 9. NORTHERN COUNTIES
  const northern = ["Carroll County", "Harford County", "Cecil County", "Caroline County"];
  if (northern.includes(county)) {
    if (miles <= 60) return { fee: 65, reason: `${miles} miles` };
    return { fee: 65 + (miles - 60), reason: `${miles} miles` };
  }

  // 10. DEFAULT
  return { fee: 0, reason: `${miles} miles` };
}


// ------------------------------------------------------------
// ZONE = REGION
// ------------------------------------------------------------
function computeZone(region) {
  if (!region) return "—";
  return region;
}


// ------------------------------------------------------------
// SAVE TRAVEL SELECTION (Region, County, City, Miles, Fee, Zone)
// ------------------------------------------------------------
function saveTravelSelection(region, county, city, miles) {
  if (region) localStorage.setItem("travelRegion", region);
  if (county) localStorage.setItem("travelCounty", county);
  if (city) localStorage.setItem("travelCity", city);

  if (miles !== undefined && miles !== null) {
    localStorage.setItem("travelMiles", miles);
  }

  // Compute fee using your rules
  const feeObj = computeTravelFee(
    localStorage.getItem("travelRegion"),
    localStorage.getItem("travelCounty"),
    Number(localStorage.getItem("travelMiles"))
  );
  localStorage.setItem("ss_travel_fee", feeObj.fee);

  // Zone = Region
  const zone = computeZone(localStorage.getItem("travelRegion"));
  localStorage.setItem("travelZone", zone);

  // ⭐ Update OLD summary block
const feeAmt = document.getElementById("travelFeeAmt");
if (feeAmt) feeAmt.textContent = `$${feeObj.fee.toFixed(2)}`;

const feeCharge = document.querySelector(".feeCharge");
if (feeCharge) feeCharge.textContent = `$${feeObj.fee.toFixed(2)}`;

const milesCharge = document.querySelector(".milesCharge");
if (milesCharge) milesCharge.textContent = `${localStorage.getItem("travelMiles")} miles`;


// ⭐ Update NEW summary block
const feeEl = document.querySelector('[data-ss-travel="fee"]');
if (feeEl) feeEl.textContent = `$${feeObj.fee.toFixed(2)}`;

const reasonEl = document.querySelector('[data-ss-travel="reason"]');
if (reasonEl) reasonEl.textContent = feeObj.reason;

  // Update UI + totals
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();

}


// ------------------------------------------------------------
// REGION SELECTION
// ------------------------------------------------------------
function onRegionSelect(regionName) {
  saveTravelSelection(regionName, null, null, null);
}


// ------------------------------------------------------------
// COUNTY SELECTION
// ------------------------------------------------------------
function onCountySelect(countyName) {
  saveTravelSelection(null, countyName, null, null);
}


// ------------------------------------------------------------
// CITY SELECTION (City → Miles → Fee → Zone)
// ------------------------------------------------------------
function onCitySelect(cityName, miles) {
  saveTravelSelection(null, null, cityName, miles);
}


// ------------------------------------------------------------
// INITIAL LOAD
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (typeof updateContainer4Summary === "function") updateContainer4Summary();
});

function ss_requestDistance() {
  // Safe no‑crash stub; extend later if needed
  console.log("ss_requestDistance called");
}

