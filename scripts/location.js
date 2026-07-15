document.addEventListener("DOMContentLoaded", () => {
  console.log("LOCATION.JS START");

  const travelRegion = document.getElementById("travelRegion");
  const travelCounty = document.getElementById("travelCounty");
  const travelCity   = document.getElementById("travelCity");

  const eventAddress = document.getElementById("eventAddress");
  const eventZip = document.getElementById("eventZip");
  const travelAddressBox = document.getElementById("travelAddressBox");
  const confirmLocationBtn = document.getElementById("confirmLocationBtn");

  // ===============================
  // LOAD REGIONS
  // ===============================
  const regions = Object.keys(window.TRAVELLOCATIONS_WITH_MILES || {});
  travelRegion.innerHTML = `<option value="">— Select Region —</option>`;

  regions.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    travelRegion.appendChild(opt);
  });

  // Disable county + city initially
  if (travelCounty) travelCounty.disabled = true;
  if (travelCity) travelCity.disabled = true;

  // ===============================
  // REGION → COUNTY
  // ===============================
  travelRegion.onchange = () => {
    const region = travelRegion.value;

    travelCounty.innerHTML = `<option value="">— Select County —</option>`;
    travelCity.innerHTML   = `<option value="">— Select City —</option>`;
    travelCounty.disabled = true;
    travelCity.disabled = true;

    if (!region) return;

    const regionData = window.TRAVELLOCATIONS_WITH_MILES[region];
    if (!regionData) return;

    const counties = {};
    Object.values(regionData).forEach(cityData => {
      if (cityData.county) counties[cityData.county] = true;
    });

    Object.keys(counties).forEach(county => {
      const opt = document.createElement("option");
      opt.value = county;
      opt.textContent = county;
      travelCounty.appendChild(opt);
    });

    travelCounty.disabled = false;

    if (travelAddressBox) travelAddressBox.style.display = "none";
    if (eventAddress) eventAddress.disabled = true;
    if (eventZip) eventZip.disabled = true;
  };

  // ===============================
  // COUNTY → CITY
  // ===============================
  travelCounty.onchange = () => {
    const region = travelRegion.value;
    const county = travelCounty.value;

    travelCity.innerHTML = `<option value="">— Select City —</option>`;
    travelCity.disabled = true;

    if (!region || !county) return;

    const regionData = window.TRAVELLOCATIONS_WITH_MILES[region];

    Object.entries(regionData).forEach(([city, data]) => {
      if (data.county === county) {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        travelCity.appendChild(opt);
      }
    });

    travelCity.disabled = false;

    if (travelAddressBox) travelAddressBox.style.display = "none";
    if (eventAddress) eventAddress.disabled = true;
    if (eventZip) eventZip.disabled = true;
  };

  // ===============================
  // CITY SELECTED → SHOW ADDRESS BOX
  // ===============================
travelCity.onchange = () => {
  console.log("CITY CHANGE FIRED:", travelCity.value);
  if (!travelCity.value) return;

  if (travelAddressBox) travelAddressBox.style.display = "block";
  if (eventAddress) eventAddress.disabled = false;
  if (eventZip) eventZip.disabled = false;

  // ⭐ USE THE WORKING FEE ENGINE
  if (typeof confirmLocationBtn.onclick === "function") {
    confirmLocationBtn.onclick();
  }
};

  // ===============================
  // CONFIRM LOCATION → SAVE + FEE
  // ===============================
  confirmLocationBtn.onclick = () => {
    const region = travelRegion.value;
    const county = travelCounty.value;
    const city   = travelCity.value;

    if (!region || !county || !city) return;

    const cityData = window.TRAVELLOCATIONS_WITH_MILES?.[region]?.[city];
    const miles = Number(cityData?.miles || 0);

    const feeObj = computeTravelFee(region, county, miles);
    const fee = Number(feeObj?.fee) || 0;
    const reason = feeObj?.reason || "";

    localStorage.setItem("ss_travel_region", region);
    localStorage.setItem("ss_travel_county", county);
    localStorage.setItem("ss_travel_city", city);
    localStorage.setItem("ss_travel_miles", miles);
    localStorage.setItem("ss_travel_fee", fee);
    localStorage.setItem("ss_travel_reason", reason);

    const feeEl   = document.querySelector("[data-ss-travel='fee']");
    const milesEl = document.querySelector('[data-ss-travel="miles"]');
    const reasonEl = document.querySelector('[data-ss-travel="reason"]');

    if (milesEl) milesEl.textContent = `${miles} mi`;
    if (feeEl) feeEl.textContent = `$${fee.toFixed(2)}`;
    if (reasonEl) reasonEl.textContent = reason;

    if (typeof updateTotals === "function") updateTotals();

    console.log("CONFIRM CLICKED — miles:", miles, "fee:", fee);
  };

  // ===============================
  // AUTO-DETECT LOCATION
  // ===============================
  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const address = data.display_name || "";
      const zip = data.address?.postcode || "";

      const locInput = document.getElementById("eventAddress");
      if (locInput) locInput.value = address;

      const zipInput = document.getElementById("eventZip");
      if (zipInput && zip) zipInput.value = zip;

      const map = document.getElementById("miniMap");
      if (map) {
        map.style.display = "block";
        map.innerHTML = `
          <iframe
            width="100%"
            height="160"
            style="border:0;"
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}">
          </iframe>
        `;
      }

    } catch (err) {
      console.error(err);
      alert("Unable to retrieve your location address.");
    }

  }, err => {
    alert("Location access denied. Please enable location permissions.");
  });

}); // END DOMContentLoaded


// ===============================
// MANUAL ADDRESS → DISTANCE
// ===============================
/* -----------------------------------------------------------
   REAL DISTANCE ENGINE — SINGLE SOURCE OF TRUTH
----------------------------------------------------------- */
function ss_requestDistance(fullAddress, onMilesReady) {
  // ⭐ Your existing Google Distance Matrix logic runs here.
  // It MUST set: window.ss_distance_miles = calculatedMiles;

  // After Google API returns:
  const miles = Number(window.ss_distance_miles || 0);

  // ⭐ 1. Store in localStorage
  localStorage.setItem("ss_travel_miles", miles);

  // ⭐ 2. Store globally
  window.ss_travel_miles = miles;

  // ⭐ 3. Store in booking state
  saveBookingState({
    travelMiles: miles
  });

  // ⭐ 4. Return miles to caller
  if (typeof onMilesReady === "function") {
    onMilesReady(miles);
  }
}

/* -----------------------------------------------------------
   UNIVERSAL MILES GETTER — SAFE ACCESS ANYWHERE
----------------------------------------------------------- */
function getMiles() {
  return (
    getBookingState().travelMiles ||
    window.ss_travel_miles ||
    Number(localStorage.getItem("ss_travel_miles")) ||
    0
  );
}

