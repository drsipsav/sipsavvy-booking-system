// FILE: travelFee.js
console.log("TRAVELFEE.JS — TOP OF FILE");

/* ============================================================
   1. computeFee — wrapper for older scripts (packages.js)
============================================================ */
function computeFee(miles) {
  const result = computeTravelFee(null, null, miles);
  return Number(result.fee);
}


/* ============================================================
   2. COUNTY + REGION LOOKUP
============================================================ */
function lookupCountyAndRegion(address) {
  if (!address) return { county: null, region: null };

  let lower = address.toLowerCase().trim();

  lower = lower.replace(/,?\s*md\b/g, "");
  lower = lower.replace(/,?\s*maryland\b/g, "");
  lower = lower.replace(/,?\s*usa\b/g, "");
  lower = lower.replace(/,?\s*united states\b/g, "");
  lower = lower.replace(/\d{5}/g, "");

  const city = lower.split(",")[0].trim();

  for (const regionName in TRAVELLOCATIONS_WITH_MILES) {
    const cities = TRAVELLOCATIONS_WITH_MILES[regionName];

    for (const cityName in cities) {
      if (cityName.toLowerCase() === city) {
        return {
          county: cities[cityName].county,
          region: regionName
        };
      }
    }
  }

  return { county: null, region: null };
}


/* ============================================================
   3. PRICING ENGINE A — core travel fee logic
============================================================ */
function computeTravelFee(region, county, miles) {
  miles = Number(miles);

  if (!miles || isNaN(miles)) return { fee: 0, reason: "" };
  if (miles > 75) return { fee: 0, reason: "Outside service area" };

  if (county === "Charles County" && region === "Southern Maryland") {
    return { fee: 15, reason: `${miles} miles` };
  }

  if (
    county === "Saint Mary's County" ||
    county === "St. Mary's County" ||
    county === "Calvert County"
  ) {
    return { fee: 15 + miles, reason: `${miles} miles` };
  }

  if (county === "Prince George's County") {
    if (miles <= 20) return { fee: 20, reason: `${miles} miles` };
    if (miles <= 25) return { fee: 30, reason: `${miles} miles` };
    return { fee: 50, reason: `${miles} miles` };
  }

  if (region === "Northern Virginia") {
    if (miles <= 30) return { fee: 40, reason: `${miles} miles` };
    return { fee: 40 + (miles - 30), reason: `${miles} miles` };
  }

  if (region === "Washington DC") {
    if (miles <= 30) return { fee: 45, reason: `${miles} miles` };
    return { fee: 45 + (miles - 30), reason: `${miles} miles` };
  }

  if (
    county === "Montgomery County" ||
    county === "Howard County" ||
    county === "Anne Arundel County" ||
    county === "Frederick County"
  ) {
    return { fee: 25 + miles, reason: `${miles} miles` };
  }

  if (county === "Baltimore City") {
    return { fee: 65, reason: `${miles} miles` };
  }

  if (county === "Baltimore County") {
    return { fee: 70, reason: `${miles} miles` };
  }

  const northern = ["Carroll County", "Harford County", "Cecil County", "Caroline County"];
  if (northern.includes(county)) {
    if (miles <= 60) return { fee: 65, reason: `${miles} miles` };
    return { fee: 65 + (miles - 60), reason: `${miles} miles` };
  }

  return { fee: 0, reason: `${miles} miles` };
}


/* ============================================================
   4. setTravelFee — REQUIRED by recalcTravelFromLocation()
============================================================ */
function setTravelFee(fee) {
  localStorage.setItem("ss_travel_fee", Number(fee));
}


/* ============================================================
   5. runTravelFee — REQUIRED by packages.js & click handler
============================================================ */
function runTravelFee(miles, region, county) {
  const result = computeTravelFee(region, county, miles);

  localStorage.setItem("ss_travel_fee", Number(result.fee));
  localStorage.setItem("ss_travel_reason", result.reason);
  localStorage.setItem("ss_travel_miles", miles);

  return result;
}


/* ============================================================
   6. Distance Matrix Wrapper
============================================================ */
function getMilesBetween(origin, destination) {
  return new Promise((resolve) => {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      },
      (response, status) => {
        if (status !== "OK") return resolve(0);

        const result = response.rows[0].elements[0];
        if (!result || result.status !== "OK") return resolve(0);

        resolve(result.distance.value / 1609.34);
      }
    );
  });
}


/* ============================================================
   7. CLICK HANDLER — runs travel fee immediately
============================================================ */
document.getElementById("confirmLocationBtn")?.addEventListener("click", () => {
  const region = travelRegion?.value;
  const county = travelCounty?.value;
  const city   = travelCity?.value;

  if (!region || !county || !city) return;

  const cityData = window.TRAVELLOCATIONS_WITH_MILES?.[region]?.[city];
  const miles = Number(cityData?.miles || 0);

  runTravelFee(miles, region, county);

  localStorage.setItem("ss_travel_region", region);
  localStorage.setItem("ss_travel_county", county);
  localStorage.setItem("ss_travel_city", city);

  if (typeof updateTravelUI === "function") {
    updateTravelUI();
    updateDistanceZone(region);   // ⭐ FIXED: zone = region
  }
});


/* ============================================================
   8. setTravelState — FIXED (no saveBookingState dependency)
============================================================ */
function setTravelState(travelData) {
  localStorage.setItem("ss_travel_origin", travelData.origin ?? "");
  localStorage.setItem("ss_travel_destination", travelData.destination ?? "");
  localStorage.setItem("ss_travel_miles", travelData.miles ?? 0);
  localStorage.setItem("ss_travel_region", travelData.region ?? "");
  localStorage.setItem("ss_travel_reason", travelData.reason ?? "");
  localStorage.setItem("ss_travel_county", travelData.county ?? "");

  if (typeof updateTotalsDisplay === "function") {
    updateTotalsDisplay();
  }

  return travelData;
}


/* ============================================================
   9. MAIN ENTRY POINT — recalcTravelFromLocation
============================================================ */
async function recalcTravelFromLocation({ origin, destination }) {
  const miles = await getMilesBetween(origin, destination);
  const { county, region } = lookupCountyAndRegion(destination);
  const { fee, reason } = computeTravelFee(region, county, miles);

  setTravelFee(fee);

  return setTravelState({
    origin,
    destination,
    miles,
    region,
    fee,
    reason,
    county
  });
}

function saveTravelRegion(region) {
  localStorage.setItem("travelRegion", region);

  if (typeof updateContainer4Summary === "function") {
    updateContainer4Summary();
  }
}

onRegionSelect(region) {
  saveTravelRegion(region);
}

