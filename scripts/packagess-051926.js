


/* -----------------------------------------------------------
   GOOGLE MAPS CALLBACK
----------------------------------------------------------- */
window.googleMapsReady = function () {
  // Only run autocomplete AFTER Google Maps loads
  if (typeof initZipAutocomplete === "function") {
    initZipAutocomplete();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------------------------------------
     UTILITIES
  ----------------------------------------------------------- */
  const $ = id => document.getElementById(id);

  function animatePrice(el) {
    el.classList.remove("price-animate");
    void el.offsetWidth;
    el.classList.add("price-animate");
  }

  /* -----------------------------------------------------------
     PACKAGE SELECTION
  
  let selectedPackage = null;
  let selectedPackagePrice = 0;

  const packageCards = document.querySelectorAll(".package-card");

  packageCards.forEach(card => {
    card.addEventListener("click", () => {
      packageCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      selectedPackage = card.dataset.packageName;
      selectedPackagePrice = Number(card.dataset.packagePrice);

      updateTotals();
    });
  });
---------------------------------------------------------- */


/* --------------------------------------------------------                                                        
    replacement 
---------------------------------------------------------*/ 
  let selectedPackage = null;
  let selectedPackagePrice = 0;

  const packageCards = document.querySelectorAll(".package-card");
packageCards.forEach(card => {
  const selectBtn = card.querySelector(".package-select-btn");
  const selectedBtn = card.querySelector(".package-selected-btn");

  // SELECT button
  selectBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Clear all other cards
    packageCards.forEach(c => c.classList.remove("active"));

    // Activate this card
    card.classList.add("active");

    // Update totals
    selectedPackage = card.dataset.packageName;
    selectedPackagePrice = Number(card.dataset.packagePrice);
    updateTotals();
  });

  // SELECTED button (de-select)
  selectedBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Remove active state
    card.classList.remove("active");

    // Reset package selection
    selectedPackage = null;
    selectedPackagePrice = 0;

    updateTotals();
  });
});




  /* -----------------------------------------------------------
     ADD‑ONS
  ----------------------------------------------------------- */
  let hourPrice = 0;
  let champPrice = 0;
  let travelPrice = 0;

  const hourBox = $("box-hour");
  const hourRow = $("row-hour");
  const hourSub = $("sub-hour");
  const hourPriceEl = $("price-hour");

  const champBox = $("box-champ");
  const champRow = $("row-champ");
  const champSub = $("sub-champ");
  const champPriceEl = $("price-champ");

  const travelBox = $("box-travel");
  const travelRow = $("row-travel");
  const travelSub = $("sub-travel");
  const travelPriceEl = $("price-travel");

  function activateAddon(boxId, rowId) {
    const box = $(boxId);
    const row = $(rowId);

    if (!box || !row) return;

    box.classList.add("checked");
    row.classList.add("active");
  }

  /* ---------------- Extra Hour ---------------- */
  hourBox.addEventListener("click", () => {
    hourSub.style.display = hourSub.style.display === "none" ? "flex" : "none";
    activateAddon("box-hour", "row-hour");
  });

  hourSub.querySelectorAll(".addon-sub-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const hours = Number(btn.dataset.hours);

      if (hours === 0) {
        hourPrice = 0;
        hourBox.classList.remove("checked");
        hourRow.classList.remove("active");
        hourSub.style.display = "none";
      } else {
        hourPrice = hours * 125;
        activateAddon("box-hour", "row-hour");
      }

      hourPriceEl.textContent = `$${hourPrice}`;
      animatePrice(hourPriceEl);
      updateTotals();
    });
  });

/*--------------        extra hour logic -------------
const EXTRA_HOUR_RATE = 125;

document.querySelectorAll(".addon-extra-hour").forEach(row => {
  const hourButtons = row.querySelectorAll(".hour-btn");
  const totalDisplay = row.querySelector(".extra-hour-total");

  hourButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();

      const hours = Number(btn.dataset.hours);

      // Clear all buttons
      hourButtons.forEach(b => b.classList.remove("active"));

      // Activate clicked button
      btn.classList.add("active");

      // Calculate total
      const total = hours * EXTRA_HOUR_RATE;

      // Update UI
      totalDisplay.textContent = `$${total}`;

      // Update global add-on state
      if (hours === 0) {
        delete selectedAddons["extra-hour"];
        row.classList.remove("active");
      } else {
        selectedAddons["extra-hour"] = total;
        row.classList.add("active");
      }

      updateTotals();
    });
  });
});  */



  /* ---------------- Champagne ---------------- */
  champBox.addEventListener("click", () => {
    champSub.style.display = champSub.style.display === "none" ? "flex" : "none";
    activateAddon("box-champ", "row-champ");
  });

  champSub.querySelectorAll(".addon-sub-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tier = Number(btn.dataset.tier);

      if (tier === 0) {
        champPrice = 0;
        champBox.classList.remove("checked");
        champRow.classList.remove("active");
        champSub.style.display = "none";
      } else {
        champPrice = tier * 40;
        activateAddon("box-champ", "row-champ");
      }

      champPriceEl.textContent = `$${champPrice}`;
      animatePrice(champPriceEl);
      updateTotals();
    });
  });

  /* -----------------------------------------------------------
     TRAVEL FEE
  ----------------------------------------------------------- */
  const travelZipInput = $("travel-zip");
  const calcTravelBtn = $("calc-travel-btn");

  const cityPricing = {
    "Waldorf": 0,
    "La Plata": 25,
    "Clinton": 40,
    "Upper Marlboro": 50,
    "Washington": 75,
    "Baltimore": 100
  };

  function extractCity(place) {
    if (!place || !place.address_components) return null;

    for (const comp of place.address_components) {
      if (comp.types.includes("locality")) return comp.long_name;
      if (comp.types.includes("postal_town")) return comp.long_name;
    }
    return null;
  }

  async function calculateTravelFee(zip) {
    const url =
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=20601&destinations=${zip}&key=${GOOGLE_API_KEY}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const meters = data.rows[0].elements[0].distance.value;
      const miles = meters * 0.000621371;

      if (miles <= 10) travelPrice = 0;
      else travelPrice = Math.round((miles - 10) * 2.5);

      travelPriceEl.textContent = `$${travelPrice}`;
      animatePrice(travelPriceEl);
    } catch (err) {
      console.error("Distance Matrix failed:", err);
    }
  }

  function initMapPreview(lat, lng) {
    const mapDiv = $("travel-map");
    if (!mapDiv) return;

    new google.maps.Map(mapDiv, {
      center: { lat, lng },
      zoom: 10
    });
  }

  /* -----------------------------------------------------------
     AUTOCOMPLETE (Runs ONLY after callback)
  ----------------------------------------------------------- */
  function initZipAutocomplete() {
    if (!travelZipInput) return;

    const autocomplete = new google.maps.places.Autocomplete(travelZipInput, {
      types: ["(regions)"],
      componentRestrictions: { country: "us" }
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place || !place.address_components) return;

      const city = extractCity(place);
      if (city && cityPricing[city] !== undefined) {
        travelPrice = cityPricing[city];
        travelPriceEl.textContent = `$${travelPrice}`;
        animatePrice(travelPriceEl);

        const loc = place.geometry?.location;
        if (loc) initMapPreview(loc.lat(), loc.lng());

        updateTotals();
      }
    });
  }

  /* ---------------- Travel Button ---------------- */
  calcTravelBtn.addEventListener("click", async e => {
    e.stopPropagation();

    const zip = travelZipInput.value.trim();
    if (!/^\d{5}$/.test(zip)) {
      alert("Enter a valid ZIP code.");
      return;
    }

    activateAddon("box-travel", "row-travel");
    calcTravelBtn.classList.add("selected");

    try {
      const geocodeUrl =
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${GOOGLE_API_KEY}`;

      const geoRes = await fetch(geocodeUrl);
      const geoData = await geoRes.json();

      const place = geoData.results[0];
      const city = extractCity(place);

      if (city && cityPricing[city] !== undefined) {
        travelPrice = cityPricing[city];
        travelPriceEl.textContent = `$${travelPrice}`;
        animatePrice(travelPriceEl);

        const loc = place.geometry?.location;
        if (loc) initMapPreview(loc.lat, loc.lng);

        updateTotals();
        return;
      }

      await calculateTravelFee(zip);

      const loc = place.geometry?.location;
      if (loc) initMapPreview(loc.lat, loc.lng);

      updateTotals();
    } catch (err) {
      await calculateTravelFee(zip);
      updateTotals();
    }
  });

  /* -----------------------------------------------------------
     TOTALS ENGINE
  ----------------------------------------------------------- */
  function updateTotals() {
    const addonsTotal = hourPrice + champPrice + travelPrice;
    const grandTotal = selectedPackagePrice + addonsTotal;

    const pkg = $("checkoutPackage");
    const addons = $("checkoutAddons");
    const total = $("checkoutTotal");

    if (pkg) {
      pkg.textContent =
        selectedPackage ? `Package: ${selectedPackage}` : "Package: None Selected";
    }

    if (addons) {
      addons.textContent = `Add‑Ons: $${addonsTotal}`;
      animatePrice(addons);
    }

    if (total) {
      total.textContent = `Total: $${grandTotal}`;
      animatePrice(total);
    }
  }

  /* -----------------------------------------------------------
     INIT (Maps callback will handle autocomplete)
  ----------------------------------------------------------- */
  updateTotals();
});
