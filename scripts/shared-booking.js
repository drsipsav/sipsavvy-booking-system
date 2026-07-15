
// ============================================================
// STORAGE ENGINE — REQUIRED BY ALL PAGES
// ============================================================

// PACKAGE
function setPackageName(name) {
  localStorage.setItem("ss_package_name", name);
}
function getPackageName() {
  return localStorage.getItem("ss_package_name");
}

function setPackagePrice(price) {
  localStorage.setItem("ss_package_price", price);
}

function getBookingState() {
  return JSON.parse(localStorage.getItem("ss_booking") || "{}");
}

function saveBookingState(data) {
  Object.keys(data).forEach(key => {
    localStorage.setItem(`ss_${key}`, data[key]);
  });
}


// ADD-ONS

function getAddon(key) {
  return Number(localStorage.getItem(`ss_addon_${key}`) || 0);
}

// TRAVEL FEE

// Store travel fee in localStorage
function setTravelFee(amount) {
  localStorage.setItem("ss_travel_fee", Number(amount) || 0);
}

// Retrieve travel fee
function getTravelFee() {
  return Number(localStorage.getItem("ss_travel_fee") || 0);
}
