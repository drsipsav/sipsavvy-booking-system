// ---------------------------------------------------------
// SS_KEYS guard — safe even if ssKeys.js is also loaded on this page
// Uses var + guard pattern to prevent "already declared" crash
// ---------------------------------------------------------
if (typeof window.SS_KEYS === "undefined") {
  window.SS_KEYS = {
    pkgName:         "ss_pkgName",
    pkgPrice:        "ss_pkgPrice",
    pkgDesc:         "ss_pkgDesc",
    pkgMaxGuests:    "ss_pkgMaxGuests",
    pkgEvent:        "ss_pkgEvent",
    addons:          "ss_addons",
    addonsTotal:     "ss_addonsTotal",
    extraHours:      "ss_extraHours",
    extraHoursPrice: "ss_extraHoursPrice",
    // ── UNDERSCORE FORMAT — must match travelFee.js ──
    travelFee:       "ss_travel_fee",
    travelMiles:     "ss_travel_miles",
    travelReason:    "ss_travel_reason",
    travelSummary:   "ss_travel_summary",
    travelZone:      "ss_travel_zone",
    eventDate:       "ss_eventDate",
    eventTime:       "ss_eventTime",
    eventDuration:   "ss_eventDuration",
    eventEndTime:    "ss_eventEndTime",
    eventAddress:    "ss_eventAddress",
    eventZip:        "ss_eventZip",
    contactName:     "ss_contactName",
    contactEmail:    "ss_contactEmail",
    contactPhone:    "ss_contactPhone",
    contactNotes:    "ss_contactNotes",
    grandTotal:      "ss_grandTotal"
  };
}
var SS_KEYS = window.SS_KEYS;

// ---------------------------------------------------------
// updateTotalsDisplay — keeps all price displays in sync.
// Called by unifiedSelectPackage, add-on handlers, travel.
// Reads travel fee from ss_travel_fee (canonical key).
// ---------------------------------------------------------
function updateTotalsDisplay() {
  const pkgPrice    = Number(localStorage.getItem("ss_pkgPrice")    || 0);
  const addonsTotal = Number(localStorage.getItem("ss_addonsTotal") || 0);
  const travelFee   = Number(localStorage.getItem("ss_travel_fee")  || 0);  // ← underscore key
  const grand       = pkgPrice + addonsTotal + travelFee;

  document.querySelectorAll('[data-summary="packagePrice"]').forEach(el => {
    el.textContent = `$${pkgPrice.toFixed(2)}`;
  });
  document.querySelectorAll('[data-summary="addons-total"]').forEach(el => {
    el.textContent = `$${addonsTotal.toFixed(2)}`;
  });
  document.querySelectorAll('[data-summary="travel-fee"]').forEach(el => {
    el.textContent = `$${travelFee.toFixed(2)}`;
  });
  document.querySelectorAll('[data-summary="grand-total"]').forEach(el => {
    el.textContent = `$${grand.toFixed(2)}`;
  });
  const bar = document.getElementById("checkoutTotal");
  if (bar) bar.textContent = `$${grand.toFixed(2)}`;
}

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------
function getLS(key) {
  return Number(localStorage.getItem(key) || 0);
}

function setLS(key, value) {
  localStorage.setItem(key, String(value));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.getElementById("bkResetAllBtn")
  ?.addEventListener("click", resetPackagesPage);

// ---------------------------------------------------------
// MUTUAL EXCLUSION HELPER
// ---------------------------------------------------------
function resetAllPackageCards(exceptCard) {
  document.querySelectorAll(".package-card").forEach(function (card) {
    if (card === exceptCard) return;
    const sel = card.querySelector(".select-package-btn");
    const chk = card.querySelector(".btn-selected");
    const des = card.querySelector(".btn-deselect");
    if (sel) sel.style.display = "";
    if (chk) chk.style.display = "none";
    if (des) des.style.display = "none";
  });
}

// ---------------------------------------------------------
// updateContainer4Summary
// FIX: all querySelector → querySelectorAll so every matching
//      element (including Box 5 second occurrence) gets updated.
// FIX: travelFee reads from ss_travel_fee (underscore key).
// ---------------------------------------------------------
function updateContainer4Summary() {
  // PACKAGE
  const name   = localStorage.getItem(SS_KEYS.pkgName)      || "—";
  const price  = Number(localStorage.getItem(SS_KEYS.pkgPrice) || 0);
  const desc   = localStorage.getItem(SS_KEYS.pkgDesc)      || "—";
  const guests = localStorage.getItem(SS_KEYS.pkgMaxGuests) || "—";
  const event  = localStorage.getItem(SS_KEYS.pkgEvent)     || "—";

  document.querySelectorAll('[data-summary="packageName"]').forEach(el => el.textContent = name);
  document.querySelectorAll('[data-summary="packagePrice"]').forEach(el => el.textContent = `$${price.toFixed(2)}`);
  document.querySelectorAll('[data-summary="packageDesc"]').forEach(el => el.textContent = desc);
  document.querySelectorAll('[data-summary="packageGuests"]').forEach(el => el.textContent = guests);
  document.querySelectorAll('[data-summary="packageEvent"]').forEach(el => el.textContent = event);

  // ADD-ONS (exclude Travel Fee from list)
  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]")
    .filter(a => a.name !== "Travel Fee");
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);

  const findAddon = (label) => {
    const item = addons.find(a => a.name.includes(label));
    return item ? Number(item.price || 0) : 0;
  };

  const setAddon = (val, ...selectors) => {
    selectors.forEach(sel =>
      document.querySelectorAll(sel).forEach(el => el.textContent = `$${val.toFixed(2)}`)
    );
  };
  setAddon(findAddon("Extra Hours"),
    '[data-summary="addon-extraHours"]',    '[data-summary="extra-hours"]');
  setAddon(findAddon("Champagne Toast"),
    '[data-summary="addon-champagneToast"]','[data-summary="champagne-toast-price"]');
  setAddon(findAddon("Signature Cocktail Creation"),
    '[data-summary="addon-cocktailCreation"]','[data-summary="cocktail-creation-price"]');
  setAddon(findAddon("Mocktail Bar"),
    '[data-summary="addon-mocktailBar"]',   '[data-summary="mocktail-bar-price"]');
  setAddon(findAddon("Specialty Garnish Station"),
    '[data-summary="addon-garnishStation"]','[data-summary="garnish-station-price"]');
  setAddon(findAddon("Custom Drink Menu Design"),
    '[data-summary="addon-customMenu"]',    '[data-summary="custom-menu-design-price"]');

  document.querySelectorAll('[data-summary="addons-total"]').forEach(el =>
    el.textContent = `$${addonsTotal.toFixed(2)}`
  );

  // TRAVEL FEE — read from ss_travel_fee (underscore key)
  const travelFee = Number(localStorage.getItem("ss_travel_fee") || 0);
  document.querySelectorAll('[data-summary="travel-fee"]').forEach(el =>
    el.textContent = `$${travelFee.toFixed(2)}`
  );

  // GRAND TOTAL
  const grandTotal = price + addonsTotal + travelFee;
  document.querySelectorAll('[data-summary="grand-total"]').forEach(el =>
    el.textContent = `$${grandTotal.toFixed(2)}`
  );
}

// ---------------------------------------------------------
// applyUnifiedTravelFee
// FIX: uses computeTravelFee() from travelFee.js (mileage rules)
//      instead of the hardcoded fee = miles * 2.5
// FIX: writes to ss_travel_fee (underscore key)
// ---------------------------------------------------------
function applyUnifiedTravelFee() {
  const miles  = Number(localStorage.getItem("ss_travel_miles")  || 0);
  const region = localStorage.getItem("ss_travel_region") || "";
  const county = localStorage.getItem("ss_travel_county") || "";

  let fee    = 0;
  let reason = "";

  if (miles > 0) {
    if (typeof computeTravelFee === "function") {
      // Use mileage rules defined in travelFee.js
      const result = computeTravelFee(region, county, miles);
      fee    = result.fee;
      reason = result.reason;
    } else {
      // travelFee.js already ran and stored the result — read it back
      fee    = Number(localStorage.getItem("ss_travel_fee")    || 0);
      reason = localStorage.getItem("ss_travel_reason") || "";
    }
  }

  // Write canonical keys (underscore format)
  localStorage.setItem("ss_travel_fee",    fee);
  localStorage.setItem("ss_travel_reason", reason);
  localStorage.setItem("ss_travel_miles",  miles);

  setText("pkg_travelFeeDisplay", `$${fee.toFixed(2)}`);
  document.querySelectorAll('[data-summary="travel-fee"]').forEach(el =>
    el.textContent = `$${fee.toFixed(2)}`
  );

  try { if (typeof updateContainer1 === "function") updateContainer1(); } catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
  try { updateTotalsDisplay(); }     catch(e) {}
}

// ---------------------------------------------------------
// REGION / COUNTY / CITY SELECTORS
// ---------------------------------------------------------
document.addEventListener("change", function (e) {
  const id = e.target.id;
  if (id === "travelRegionSelect") {
    localStorage.setItem("ss_travel_region", e.target.value);
    applyUnifiedTravelFee();
  }
  if (id === "travelCountySelect") {
    localStorage.setItem("ss_travel_county", e.target.value);
    applyUnifiedTravelFee();
  }
  if (id === "travelCitySelect") {
    localStorage.setItem("ss_travel_city", e.target.value);
    applyUnifiedTravelFee();
  }
  if (id === "travelMilesInput") {
    const miles = Number(e.target.value || 0);
    localStorage.setItem(SS_KEYS.travelMiles, miles);
    applyUnifiedTravelFee();
  }
});

/* ============================================================
   PACKAGES — UNIFIED EXTERNAL SCRIPT (NO INLINE JS)
============================================================ */
function unifiedSelectPackage(btn) {
  const name   = btn.dataset.packageName || "";
  const price  = Number(btn.dataset.packagePrice || 0);
  const desc   = btn.dataset.packageDesc || "";
  const guests = Number(btn.dataset.packageGuests || 0);
  const event  = btn.dataset.packageEvent || "";

  const card = btn.closest(".package-card");
  resetAllPackageCards(card);

  localStorage.setItem(SS_KEYS.pkgName,      name);
  localStorage.setItem(SS_KEYS.pkgPrice,     price);
  localStorage.setItem(SS_KEYS.pkgDesc,      desc);
  localStorage.setItem(SS_KEYS.pkgMaxGuests, guests);
  localStorage.setItem(SS_KEYS.pkgEvent,     event);

  if (card) {
    const selectBtn   = card.querySelector(".select-package-btn");
    const selectedBtn = card.querySelector(".btn-selected");
    const deselectBtn = card.querySelector(".btn-deselect");
    if (selectBtn)   selectBtn.style.display   = "none";
    if (selectedBtn) selectedBtn.style.display = "inline-block";
    if (deselectBtn) deselectBtn.style.display = "inline-block";
  }

  try { updateTotalsDisplay(); }           catch(e) {}
  try { updateContainer4Summary(); }       catch(e) {}
  try { loadBookingPackage(); }            catch(e) {}
  try { loadBookingAddons(); }             catch(e) {}
  try { loadBookingTravelFee(); }          catch(e) {}
  try { loadBookingTotal(); }              catch(e) {}
  try { loadExtraHours(); }               catch(e) {}
  try { loadChampagneToast(); }           catch(e) {}
  try { loadSignatureCocktailCreation(); } catch(e) {}
  try { loadMocktailBar(); }              catch(e) {}
  try { loadGarnishStation(); }           catch(e) {}
  try { loadCustomMenuDesign(); }         catch(e) {}
  try { updateAddonsTotal(); }            catch(e) {}
  try { loadTravelFee(); }               catch(e) {}

  resetAllPackageCards(card);
  if (card) {
    const selectedBtn = card.querySelector(".btn-selected");
    const deselectBtn = card.querySelector(".btn-deselect");
    const selectBtn   = card.querySelector(".select-package-btn");
    if (selectBtn)   selectBtn.style.display   = "none";
    if (selectedBtn) selectedBtn.style.display = "inline-block";
    if (deselectBtn) deselectBtn.style.display = "inline-block";
  }
}

function unifiedDeselectPackage(btn) {
  const card = btn.closest(".package-card");
  if (card) {
    const selectBtn   = card.querySelector(".select-package-btn");
    const selectedBtn = card.querySelector(".btn-selected");
    const deselectBtn = card.querySelector(".btn-deselect");
    if (selectBtn)   selectBtn.style.display   = "inline-block";
    if (selectedBtn) selectedBtn.style.display = "none";
    if (deselectBtn) deselectBtn.style.display = "none";
  }
  localStorage.removeItem(SS_KEYS.pkgName);
  localStorage.removeItem(SS_KEYS.pkgPrice);
  localStorage.removeItem(SS_KEYS.pkgDesc);
  localStorage.removeItem(SS_KEYS.pkgMaxGuests);
  localStorage.removeItem(SS_KEYS.pkgEvent);
  try { updateTotalsDisplay(); }     catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
}

/* ============================
   CORPORATE QUOTE MODAL
============================ */
const quoteModal  = document.getElementById("quoteModal");
const qmCloseBtn  = document.getElementById("qmCloseBtn");
const qmCancelBtn = document.getElementById("qmCancelBtn");
const qmDoneBtn   = document.getElementById("qmDoneBtn");
const quoteForm   = document.getElementById("quoteForm");
const qmSuccess   = document.getElementById("qmSuccess");

function openCorporateQuoteModal() {
  if (quoteModal) quoteModal.style.display = "flex";
}

function closeCorporateQuoteModal() {
  if (quoteModal) quoteModal.style.display = "none";
  if (qmSuccess)  qmSuccess.style.display  = "none";
  if (quoteForm)  quoteForm.style.display  = "block";
}

if (qmCloseBtn)  qmCloseBtn.addEventListener("click",  closeCorporateQuoteModal);
if (qmCancelBtn) qmCancelBtn.addEventListener("click", closeCorporateQuoteModal);
if (qmDoneBtn)   qmDoneBtn.addEventListener("click",   closeCorporateQuoteModal);

if (quoteForm) {
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    quoteForm.style.display = "none";
    if (qmSuccess) qmSuccess.style.display = "block";
    const corpSel = document.querySelector(".package-card[data-id='corporate'] .btn-selected");
    if (corpSel) corpSel.style.display = "inline-block";
  });
}

/* ============================
   EXTRA HOURS (Unified)
============================ */
function unifiedSelectExtraHours(btn) {
  const name  = "Extra Hours";
  const hours = Number(btn.dataset.hours);
  const price = Number(btn.dataset.price);

  let addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  addons = addons.filter(a => a.name !== name);
  addons.push({ name, price, hours });
  localStorage.setItem(SS_KEYS.addons, JSON.stringify(addons));

  const row = btn.closest(".addon-check-row");
  if (row) {
    const totalEl = row.querySelector(".extra-hour-total");
    if (totalEl) totalEl.textContent = `$${price.toFixed(2)}`;
  }

  try { loadAllAddons(); }           catch(e) {}
  try { updateAddonsTotal(); }       catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
}

function unifiedDeselectExtraHours(btn) {
  const name = "Extra Hours";
  let addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  addons = addons.filter(a => a.name !== name);
  localStorage.setItem(SS_KEYS.addons, JSON.stringify(addons));

  const row = btn.closest(".addon-check-row");
  if (row) {
    const totalEl = row.querySelector(".extra-hour-total");
    if (totalEl) totalEl.textContent = "$0.00";
  }

  try { updateTotalsDisplay(); }     catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
}

/* ============================
   ADD-ONS — UNIFIED SELECT / DESELECT
============================ */
function unifiedSelectAddon(btn) {
  const name  = btn.dataset.addonName;
  const price = Number(btn.dataset.addonPrice || 0);

  let addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  if (name.startsWith("Champagne Toast")) {
    addons = addons.filter(a => !a.name.startsWith("Champagne Toast"));
  } else {
    addons = addons.filter(a => a.name !== name);
  }
  addons.push({ name, price });
  localStorage.setItem(SS_KEYS.addons, JSON.stringify(addons));

  const row = btn.closest(".addon-check-row");
  if (row) {
    const priceEl = row.querySelector(".addon-check-price");
    if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;
  }

  try { updateTotalsDisplay(); }           catch(e) {}
  try { updateContainer4Summary(); }       catch(e) {}
  try { loadBookingPackage(); }            catch(e) {}
  try { loadBookingAddons(); }             catch(e) {}
  try { loadBookingTravelFee(); }          catch(e) {}
  try { loadBookingTotal(); }              catch(e) {}
  try { loadExtraHours(); }               catch(e) {}
  try { loadChampagneToast(); }           catch(e) {}
  try { loadSignatureCocktailCreation(); } catch(e) {}
  try { loadMocktailBar(); }              catch(e) {}
  try { loadGarnishStation(); }           catch(e) {}
  try { loadCustomMenuDesign(); }         catch(e) {}
  try { updateAddonsTotal(); }            catch(e) {}
  try { loadTravelFee(); }               catch(e) {}
}

function unifiedDeselectAddon(btn) {
  const name = btn.dataset.addonName;

  let addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  if (name.startsWith("Champagne Toast")) {
    addons = addons.filter(a => !a.name.startsWith("Champagne Toast"));
  } else {
    addons = addons.filter(a => a.name !== name);
  }
  localStorage.setItem(SS_KEYS.addons, JSON.stringify(addons));

  const row = btn.closest(".addon-check-row");
  if (row) {
    const priceEl = row.querySelector(".addon-check-price");
    if (priceEl) priceEl.textContent = "$0.00";
  }

  try { updateTotalsDisplay(); }           catch(e) {}
  try { updateContainer4Summary(); }       catch(e) {}
  try { loadBookingPackage(); }            catch(e) {}
  try { loadBookingAddons(); }             catch(e) {}
  try { loadBookingTravelFee(); }          catch(e) {}
  try { loadBookingTotal(); }              catch(e) {}
  try { loadExtraHours(); }               catch(e) {}
  try { loadChampagneToast(); }           catch(e) {}
  try { loadSignatureCocktailCreation(); } catch(e) {}
  try { loadMocktailBar(); }              catch(e) {}
  try { loadGarnishStation(); }           catch(e) {}
  try { loadCustomMenuDesign(); }         catch(e) {}
  try { updateAddonsTotal(); }            catch(e) {}
  try { loadTravelFee(); }               catch(e) {}
}

/* ============================
   INLINE ADDON HELPERS
============================ */
function addAddonToState(name, price) {
  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  const filtered = addons.filter(a => a.name !== name);
  filtered.push({ name, price });
  localStorage.setItem(SS_KEYS.addons, JSON.stringify(filtered));
  try { updateAddonsTotal(); }       catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
}

function removeAddonFromState(name) {
  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  const filtered = addons.filter(a => a.name !== name);
  localStorage.setItem(SS_KEYS.addons, JSON.stringify(filtered));
  try { updateAddonsTotal(); }       catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
}

/* ============================
   TRAVEL FEE
============================ */
if (typeof calculateTravelFee === "function") {
  calculateTravelFee();
}

/* ============================
   RESET TRAVEL FEE PRICE ONLY
============================ */
const resetTravelFeeBtn = document.getElementById("resetTravelFeePriceOnlyBtn");
if (resetTravelFeeBtn) resetTravelFeeBtn.addEventListener("click", resetTravelFeePriceOnly);

function resetTravelFeePriceOnly() {
  const travelKeys = [
    "ss_travel_region",
    "ss_travel_county",
    "ss_travel_city",
    SS_KEYS.travelMiles,
    SS_KEYS.travelFee,
    SS_KEYS.travelReason
  ];
  travelKeys.forEach(k => localStorage.removeItem(k));

  const feeFields = [
    document.getElementById("travelFeeHeader"),
    document.querySelector('[data-ss-travel="fee"]'),
    document.getElementById("bottomTravelFee"),
    document.getElementById("checkoutTravelFee"),
    document.getElementById("bk_travel_price")
  ];
  feeFields.forEach(el => { if (el) el.textContent = "$0.00"; });

  const regionSel = document.getElementById("travelRegionSelect");
  const countySel = document.getElementById("travelCountySelect");
  const citySel   = document.getElementById("travelCitySelect");
  if (regionSel) regionSel.selectedIndex = 0;
  if (countySel) countySel.selectedIndex = 0;
  if (citySel)   citySel.selectedIndex   = 0;

  document.querySelectorAll(".bk-travel-pill").forEach(p => p.classList.remove("active"));

  const travelCheckbox = document.getElementById("bk_travel");
  if (travelCheckbox) travelCheckbox.checked = false;

  const dropdown = document.getElementById("bk_travel_dropdown");
  if (dropdown) dropdown.style.display = "none";

  try { updateTotalsDisplay(); }     catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
}

/* ============================
   EXTRA HOURS legacy click binding
============================ */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button.hour-btn");
  if (!btn) return;

  const hours = Number(btn.dataset.hours);
  const price = Number(btn.dataset.price || 0);
  const total = hours * 125;

  localStorage.setItem("ss_extraHours",      hours);
  localStorage.setItem("ss_extraHoursPrice", total);

  const duration = 3 + hours;
  localStorage.setItem(SS_KEYS.eventDuration, `${duration} hrs`);

  const row = btn.closest(".addon-check-row");
  if (row) {
    const totalBox = row.querySelector(".extra-hour-total");
    if (totalBox) totalBox.textContent = `$${price.toFixed(2)}`;
  }
});

/* ============================
   TRAVEL FEE BUTTONS
============================ */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".travel-fee-btn");
  if (!btn) return;
  const fee    = Number(btn.dataset.fee || 0);
  const reason = btn.dataset.reason || "";
  localStorage.setItem(SS_KEYS.travelFee,    fee);
  localStorage.setItem(SS_KEYS.travelReason, reason);
});

/* ============================
   MAIN HANDLER REGISTRATION
============================ */
setTimeout(() => {
  console.log("✔ SipSavvy packages.js ready — attaching handlers");

  // PACKAGE SELECT BUTTONS
  document.querySelectorAll(".select-package-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".package-card");
      if (card && card.dataset.packageType === "quote") {
        openCorporateQuoteModal();
        return;
      }
      unifiedSelectPackage(btn);
    });
  });

  // PACKAGE DESELECT BUTTONS
  document.querySelectorAll(".btn-deselect").forEach(btn => {
    btn.addEventListener("click", () => unifiedDeselectPackage(btn));
  });

  // ADDON SELECT BUTTONS
  document.querySelectorAll(".addon-btn:not(.none-btn)").forEach(btn => {
    btn.addEventListener("click", () => unifiedSelectAddon(btn));
  });

  // ADDON DESELECT BUTTONS
  document.querySelectorAll(".addon-btn.none-btn").forEach(btn => {
    btn.addEventListener("click", () => unifiedDeselectAddon(btn));
  });

  // TRAVEL FEE CONFIRM BUTTON
  const confirmLocationBtn = document.getElementById("confirmLocationBtn");
  if (confirmLocationBtn) {
    confirmLocationBtn.addEventListener("click", () => {
      try { calculateTravelFee?.(); } catch(e) {}
    });
  }

  // CHECKOUT BUTTON
  const checkoutBtn = document.getElementById("checkoutContinue");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "booking.html";
    });
  }

  // INITIAL TRAVEL FEE CALCULATION
  applyUnifiedTravelFee();

}, 300);

/* ============================
   RESET PACKAGES PAGE (GLOBAL)
============================ */
function resetPackagesPage() {
  Object.values(SS_KEYS).forEach(k => localStorage.removeItem(k));
  location.reload();
}
