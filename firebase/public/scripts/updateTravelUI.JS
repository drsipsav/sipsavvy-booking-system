// ============================================================
// GLOBAL DOM REFERENCES
// ============================================================
window.travelRegion = document.getElementById("travelRegion");
window.travelCounty = document.getElementById("travelCounty");
window.travelCity   = document.getElementById("travelCity");


// ============================================================
// 1. LOAD REGIONS
// ============================================================
function loadRegions() {
  if (!window.ss_regions || !travelRegion) return;

  travelRegion.innerHTML = `<option value="">— Select Region —</option>`;

  window.ss_regions.forEach(region => {
    const opt = document.createElement("option");
    opt.value = region.id;
    opt.textContent = region.id;
    travelRegion.appendChild(opt);
  });
}


// ============================================================
// 2. LOAD COUNTIES
// ============================================================
function loadCounties(regionId) {
  travelCounty.innerHTML = `<option value="">— Select County —</option>`;
  travelCity.innerHTML   = `<option value="">— Select City —</option>`;

  const region = window.ss_regions.find(r => r.id === regionId);
  if (!region) return;

  region.counties.forEach(county => {
    const opt = document.createElement("option");
    opt.value = county.id;
    opt.textContent = county.id;
    travelCounty.appendChild(opt);
  });
}


// ============================================================
// 3. LOAD CITIES
// ============================================================
function loadCities(regionId, countyId) {
  travelCity.innerHTML = `<option value="">— Select City —</option>`;

  const region = window.ss_regions.find(r => r.id === regionId);
  if (!region) return;

  const county = region.counties.find(c => c.id === countyId);
  if (!county) return;

  county.cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city.name;
    opt.textContent = `${city.name} (${city.miles} mi)`;
    travelCity.appendChild(opt);
  });
}


// ============================================================
// 4. EVENT LISTENERS
// ============================================================
if (travelRegion) {
  travelRegion.addEventListener("change", () => {
    loadCounties(travelRegion.value);
  });
}

if (travelCounty) {
  travelCounty.addEventListener("change", () => {
    loadCities(travelRegion.value, travelCounty.value);
  });
}



// ============================================================
// 6. INITIALIZE UI
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  loadRegions();      // ⭐ THIS POPULATES THE REGION DROPDOWN
  
});
