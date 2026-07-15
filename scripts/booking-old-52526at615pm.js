/* ============================================================
   BOOKING PAGE — FINAL SUMMARY LOGIC
   Uses shared-booking.js helpers:
   - getPackage()
   - getSelectedAddons()
   - getTravelFee()
   - getBookingTotals()
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("page-booking")) {
    console.log("booking.js loaded on non-booking page — skipping");
    return;
  }

  /* ============================================================
     TRAVEL FEE ENGINE
     ============================================================ */

  const ORIGIN_ADDRESS = "12336 Sandstone Street, Waldorf, MD 20601";

  let autocomplete;
  let geocoder = new google.maps.Geocoder();
  let distanceService = new google.maps.DistanceMatrixService();

  const elLocation = document.getElementById("eventLocation");
  const elDistance = document.querySelector('[data-ss-travel="distance"]');
  const elSummary = document.querySelector('[data-ss-travel="summary"]');
  const elFee = document.querySelector('[data-ss-travel="fee"]');
  const elFeeLine = document.getElementById("bsTravelFeeLine");

  function resetTravelUI() {
    if (elDistance) elDistance.textContent = "—";
    if (elSummary) elSummary.textContent = "—";
    if (elFee) elFee.textContent = "—";
    if (elFeeLine) elFeeLine.textContent = "—";
    window.saveTravelFee(0);
  }

  function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(elLocation, {
      fields: ["formatted_address", "geometry", "address_components"],
      types: ["geocode"]
    });

    autocomplete.addListener("place_changed", handlePlaceSelect);
  }

  function handlePlaceSelect() {
    const place = autocomplete.getPlace();
    if (!place || !place.formatted_address) {
      resetTravelUI();
      return;
    }

    const destination = place.formatted_address;

    if (elSummary) elSummary.textContent = destination;

    calculateDistanceAndFee(destination);
  }

  function calculateDistanceAndFee(destination) {
    distanceService.getDistanceMatrix(
      {
        origins: [ORIGIN_ADDRESS],
        destinations: [destination],
        travelMode: "DRIVING",
        unitSystem: google.maps.UnitSystem.IMPERIAL
      },
      (response, status) => {
        if (status !== "OK") {
          resetTravelUI();
          return;
        }

        const result = response.rows[0].elements[0];
        if (!result || result.status !== "OK") {
          resetTravelUI();
          return;
        }

        const miles = result.distance.value / 1609.34;
        const roundedMiles = Math.round(miles * 10) / 10;

        if (elDistance) elDistance.textContent = `${roundedMiles} miles`;

        if (roundedMiles > 75) {
          window.saveTravelFee(0);
          if (elFee) elFee.textContent = "Too far";
          if (elFeeLine) elFeeLine.textContent = "Too far";
          return;
        }

        detectCountyAndApplyFee(destination, roundedMiles);
      }
    );
  }

  function detectCountyAndApplyFee(destination, miles) {
    geocoder.geocode({ address: destination }, (results, status) => {
      if (status !== "OK" || !results[0]) {
        resetTravelUI();
        return;
      }

      const components = results[0].address_components;
      const countyComp = components.find(c => c.types.includes("administrative_area_level_2"));
      const county = countyComp ? countyComp.long_name : "";

      const fee = calculateFeeByCounty(county, miles);

      window.saveTravelFee(fee);

      if (elFee) elFee.textContent = `$${fee}`;
      if (elFeeLine) elFeeLine.textContent = `$${fee}`;

      populateSummary();
    });
  }

  function calculateFeeByCounty(county, miles) {
    county = county.toLowerCase();

    if (county.includes("charles")) return 15;
    if (county.includes("prince george")) {
      if (miles <= 20) return 25;
      if (miles <= 35) return 40;
      return 55;
    }
    if (county.includes("montgomery")) return 25 + Math.round(miles);
    if (county.includes("howard")) return 25 + Math.round(miles);
    if (county.includes("anne arundel")) return 25 + Math.round(miles);
    if (county.includes("baltimore city")) return 65;
    if (county.includes("baltimore county")) return 70;
    if (county.includes("district of columbia")) return 75;
    if (county.includes("alexandria") || county.includes("arlington") || county.includes("fairfax")) return 60;

    return 25 + Math.round(miles);
  }

  resetTravelUI();
  initAutocomplete();

  /* ============================================================
     ELEMENTS
     ============================================================ */

  const elPackageName = document.getElementById("bk-package-name");
  const elPackagePrice = document.getElementById("bk-package-price");

  const elExtraHour = document.getElementById("bk-extra-hour");
  const elToast = document.getElementById("bk-toast");
  const elTravelFee = document.getElementById("bk-travel-fee");
  const elOtherAddons = document.getElementById("bk-other-addons");

  const elAddonsTotal = document.getElementById("bk-addons-total");
  const elGrandTotal = document.getElementById("bk-grand-total");

  /* ============================================================
     POPULATE SUMMARY
     ============================================================ */

  function populateSummary() {
    const pkg = window.getPackage();
    const totals = window.getBookingTotals();
    const addons = totals.addons;

    if (elPackageName) elPackageName.textContent = pkg.name || "None selected";
    if (elPackagePrice) elPackagePrice.textContent = `$${pkg.price}`;

    if (elExtraHour) {
      elExtraHour.textContent = addons["extra-hour"]
        ? `$${addons["extra-hour"]}`
        : "$0";
    }

    if (elToast) {
      elToast.textContent = addons["champagne-toast"]
        ? `$${addons["champagne-toast"]}`
        : "$0";
    }

    if (elTravelFee) {
      elTravelFee.textContent = `$${totals.travelFee}`;
    }

    let otherTotal = 0;
    Object.entries(addons).forEach(([key, value]) => {
      if (
        key !== "extra-hour" &&
        key !== "champagne-toast" &&
        key !== "travel-fee"
      ) {
        otherTotal += Number(value || 0);
      }
    });

    if (elOtherAddons) elOtherAddons.textContent = `$${otherTotal}`;

    if (elAddonsTotal) elAddonsTotal.textContent = `$${totals.addonsTotal}`;
    if (elGrandTotal) elGrandTotal.textContent = `$${totals.grandTotal}`;
  }

  populateSummary();
});
