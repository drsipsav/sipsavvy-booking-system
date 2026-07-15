// ─────────────────────────────────────────────────────────────────────────────
// SipSavvy — packages.js   (fully corrected)
// ─────────────────────────────────────────────────────────────────────────────

// SS_KEYS guard — safe even if ssKeys.js is also loaded on this page
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
    travelFee:       "ss_travel_fee",      // canonical — matches travelFee.js
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

// ─────────────────────────────────────────────────────────────────────────────
// updateTotalsDisplay — reads ss_travel_fee (canonical, never old camelCase)
// ─────────────────────────────────────────────────────────────────────────────
function updateTotalsDisplay() {
  const pkgPrice    = Number(localStorage.getItem("ss_pkgPrice")    || 0);
  const addonsTotal = Number(localStorage.getItem("ss_addonsTotal") || 0);
  const travelFee   = Number(localStorage.getItem("ss_travel_fee")  || 0);  // ← canonical
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

// ─────────────────────────────────────────────────────────────────────────────
// updateAddonsTotal — recalculates from ss_addons array
// ─────────────────────────────────────────────────────────────────────────────
function updateAddonsTotal() {
  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  const total  = addons.reduce((sum, a) => sum + Number(a.price || 0), 0);
  localStorage.setItem(SS_KEYS.addonsTotal, total);
  updateTotalsDisplay();
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function getLS(key) { return Number(localStorage.getItem(key) || 0); }
function setLS(key, value) { localStorage.setItem(key, String(value)); }
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ─────────────────────────────────────────────────────────────────────────────
// applyUnifiedTravelFee
// Uses computeTravelFee() from travelFee.js — NEVER hardcoded miles * 2.5
// ─────────────────────────────────────────────────────────────────────────────
function applyUnifiedTravelFee() {
  const region = localStorage.getItem("ss_travel_region") || "";
  const county = localStorage.getItem("ss_travel_county") || "";
  const miles  = getLS(SS_KEYS.travelMiles);

  let fee    = 0;
  let reason = "";

  if (miles > 0) {
    if (typeof computeTravelFee === "function") {
      // Yemi's mileage rules from travelFee.js
      const result = computeTravelFee(region, county, miles);
      fee    = result.fee;
      reason = result.reason;
    } else {
      // travelFee.js not loaded yet — read stored value
      fee    = getLS(SS_KEYS.travelFee);
      reason = localStorage.getItem(SS_KEYS.travelReason) || "";
    }
  }

  setLS(SS_KEYS.travelFee,    fee);
  setLS(SS_KEYS.travelReason, reason);

  document.querySelectorAll('[data-summary="travel-fee"]').forEach(el => {
    el.textContent = `$${fee.toFixed(2)}`;
  });
  document.querySelectorAll('[data-ss-travel="fee"]').forEach(el => {
    el.textContent = `$${fee.toFixed(2)}`;
  });
  setText("pkg_travelFeeDisplay", `$${fee.toFixed(2)}`);

  if (typeof updateTravelUI === "function") {
    try { updateTravelUI(); } catch(e) {}
  }

  updateTotalsDisplay();
  try { updateContainer4Summary(); } catch(e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// updateContainer4Summary (packages-page version)
// Uses querySelectorAll — hits ALL elements including Box 5 second occurrence.
// Writes individual add-on prices to BOTH hyphenated and camelCase selectors.
// ─────────────────────────────────────────────────────────────────────────────
function updateContainer4Summary() {
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
  document.querySelectorAll('[data-summary="package-total"]').forEach(el => el.textContent = `$${price.toFixed(2)}`);

  // ── Individual add-on prices ──
  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");

  const findAddon = (keyword) => {
    const item = addons.find(a => (a.name || "").includes(keyword));
    return item ? Number(item.price || 0) : 0;
  };
  const findChampagne = () => {
    const item = addons.find(a => (a.name || "").startsWith("Champagne Toast"));
    return item ? Number(item.price || 0) : 0;
  };

  const extraHours = findAddon("Extra Hour");
  const champagne  = findChampagne();
  const cocktail   = findAddon("Cocktail Creation");
  const mocktail   = findAddon("Mocktail");
  const garnish    = findAddon("Garnish");
  const customMenu = findAddon("Menu Design");

  // Box 5 hyphenated
  document.querySelectorAll('[data-summary="extra-hours"]').forEach(el => el.textContent = `$${extraHours.toFixed(2)}`);
  document.querySelectorAll('[data-summary="champagne-toast-price"]').forEach(el => el.textContent = `$${champagne.toFixed(2)}`);
  document.querySelectorAll('[data-summary="cocktail-creation-price"]').forEach(el => el.textContent = `$${cocktail.toFixed(2)}`);
  document.querySelectorAll('[data-summary="mocktail-bar-price"]').forEach(el => el.textContent = `$${mocktail.toFixed(2)}`);
  document.querySelectorAll('[data-summary="garnish-station-price"]').forEach(el => el.textContent = `$${garnish.toFixed(2)}`);
  document.querySelectorAll('[data-summary="custom-menu-design-price"]').forEach(el => el.textContent = `$${customMenu.toFixed(2)}`);

  // Container4 camelCase
  document.querySelectorAll('[data-summary="addon-extraHours"]').forEach(el => el.textContent = `$${extraHours.toFixed(2)}`);
  document.querySelectorAll('[data-summary="addon-champagneToast"]').forEach(el => el.textContent = `$${champagne.toFixed(2)}`);
  document.querySelectorAll('[data-summary="addon-cocktailCreation"]').forEach(el => el.textContent = `$${cocktail.toFixed(2)}`);
  document.querySelectorAll('[data-summary="addon-mocktailBar"]').forEach(el => el.textContent = `$${mocktail.toFixed(2)}`);
  document.querySelectorAll('[data-summary="addon-garnishStation"]').forEach(el => el.textContent = `$${garnish.toFixed(2)}`);
  document.querySelectorAll('[data-summary="addon-customMenu"]').forEach(el => el.textContent = `$${customMenu.toFixed(2)}`);

  // ── Totals ──
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);
  const travelFee   = Number(localStorage.getItem(SS_KEYS.travelFee)   || 0);
  const grandTotal  = price + addonsTotal + travelFee;

  document.querySelectorAll('[data-summary="addons-total"]').forEach(el => el.textContent = `$${addonsTotal.toFixed(2)}`);
  document.querySelectorAll('[data-summary="travel-fee"]').forEach(el => el.textContent = `$${travelFee.toFixed(2)}`);
  document.querySelectorAll('[data-summary="grand-total"]').forEach(el => el.textContent = `$${grandTotal.toFixed(2)}`);

  const bar = document.getElementById("checkoutTotal");
  if (bar) bar.textContent = `$${grandTotal.toFixed(2)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// REGION / COUNTY / CITY SELECTORS — every change recalculates via mileage rules
// ─────────────────────────────────────────────────────────────────────────────
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
    localStorage.setItem(SS_KEYS.travelMiles, Number(e.target.value || 0));
    applyUnifiedTravelFee();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// MUTUAL EXCLUSION HELPER
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED PACKAGE SELECTION
// ─────────────────────────────────────────────────────────────────────────────
function unifiedSelectPackage(btn) {
  const name   = btn.dataset.packageName  || "";
  const price  = Number(btn.dataset.packagePrice  || 0);
  const desc   = btn.dataset.packageDesc  || "";
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

  try { updateTotalsDisplay(); }            catch(e) {}
  try { updateContainer4Summary(); }        catch(e) {}
  try { loadBookingPackage(); }             catch(e) {}
  try { loadBookingAddons(); }              catch(e) {}
  try { loadBookingTravelFee(); }           catch(e) {}
  try { loadBookingTotal(); }               catch(e) {}
  try { loadExtraHours(); }                 catch(e) {}
  try { loadChampagneToast(); }             catch(e) {}
  try { loadSignatureCocktailCreation(); }  catch(e) {}
  try { loadMocktailBar(); }                catch(e) {}
  try { loadGarnishStation(); }             catch(e) {}
  try { loadCustomMenuDesign(); }           catch(e) {}
  try { updateAddonsTotal(); }              catch(e) {}
  try { loadTravelFee(); }                  catch(e) {}

  resetAllPackageCards(card);
  if (card) {
    const selectBtn   = card.querySelector(".select-package-btn");
    const selectedBtn = card.querySelector(".btn-selected");
    const deselectBtn = card.querySelector(".btn-deselect");
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

// ─────────────────────────────────────────────────────────────────────────────
// CORPORATE QUOTE MODAL
// ─────────────────────────────────────────────────────────────────────────────
const quoteModal  = document.getElementById("quoteModal");
const qmCloseBtn  = document.getElementById("qmCloseBtn");
const qmCancelBtn = document.getElementById("qmCancelBtn");
const qmDoneBtn   = document.getElementById("qmDoneBtn");
const quoteForm   = document.getElementById("quoteForm");
const qmSuccess   = document.getElementById("qmSuccess");

function openCorporateQuoteModal()  { if (quoteModal) quoteModal.style.display = "flex"; }
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

// ─────────────────────────────────────────────────────────────────────────────
// EXTRA HOURS
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// ADD-ONS — UNIFIED SELECT / DESELECT
// ─────────────────────────────────────────────────────────────────────────────
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

  try { updateTotalsDisplay(); }            catch(e) {}
  try { updateContainer4Summary(); }        catch(e) {}
  try { loadBookingPackage(); }             catch(e) {}
  try { loadBookingAddons(); }              catch(e) {}
  try { loadBookingTravelFee(); }           catch(e) {}
  try { loadBookingTotal(); }               catch(e) {}
  try { loadExtraHours(); }                 catch(e) {}
  try { loadChampagneToast(); }             catch(e) {}
  try { loadSignatureCocktailCreation(); }  catch(e) {}
  try { loadMocktailBar(); }                catch(e) {}
  try { loadGarnishStation(); }             catch(e) {}
  try { loadCustomMenuDesign(); }           catch(e) {}
  try { updateAddonsTotal(); }              catch(e) {}
  try { loadTravelFee(); }                  catch(e) {}
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

  try { updateTotalsDisplay(); }            catch(e) {}
  try { updateContainer4Summary(); }        catch(e) {}
  try { loadBookingPackage(); }             catch(e) {}
  try { loadBookingAddons(); }              catch(e) {}
  try { loadBookingTravelFee(); }           catch(e) {}
  try { loadBookingTotal(); }               catch(e) {}
  try { loadExtraHours(); }                 catch(e) {}
  try { loadChampagneToast(); }             catch(e) {}
  try { loadSignatureCocktailCreation(); }  catch(e) {}
  try { loadMocktailBar(); }                catch(e) {}
  try { loadGarnishStation(); }             catch(e) {}
  try { loadCustomMenuDesign(); }           catch(e) {}
  try { updateAddonsTotal(); }              catch(e) {}
  try { loadTravelFee(); }                  catch(e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE ADDON HELPERS (called via onclick in HTML)
// ─────────────────────────────────────────────────────────────────────────────
function addAddonToState(name, price) {
  const addons   = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  const filtered = addons.filter(a => a.name !== name);
  filtered.push({ name, price });
  localStorage.setItem(SS_KEYS.addons, JSON.stringify(filtered));
  try { updateAddonsTotal(); }       catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
}

function removeAddonFromState(name) {
  const addons   = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  const filtered = addons.filter(a => a.name !== name);
  localStorage.setItem(SS_KEYS.addons, JSON.stringify(filtered));
  try { updateAddonsTotal(); }       catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAVEL FEE BUTTONS
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".travel-fee-btn");
  if (!btn) return;
  localStorage.setItem(SS_KEYS.travelFee,    Number(btn.dataset.fee    || 0));
  localStorage.setItem(SS_KEYS.travelReason, btn.dataset.reason || "");
  updateTotalsDisplay();
  try { updateContainer4Summary(); } catch(e) {}
});

// ─────────────────────────────────────────────────────────────────────────────
// EXTRA HOURS — legacy click binding (hour-btn elements)
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button.hour-btn");
  if (!btn) return;

  const hours = Number(btn.dataset.hours);
  const price = Number(btn.dataset.price || 0);
  localStorage.setItem("ss_extraHours",      hours);
  localStorage.setItem("ss_extraHoursPrice", hours * 125);
  localStorage.setItem(SS_KEYS.eventDuration, `${3 + hours} hrs`);

  const row = btn.closest(".addon-check-row");
  if (row) {
    const totalBox = row.querySelector(".extra-hour-total");
    if (totalBox) totalBox.textContent = `$${price.toFixed(2)}`;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// RESET TRAVEL FEE (price only)
// ─────────────────────────────────────────────────────────────────────────────
const resetTravelFeeBtn = document.getElementById("resetTravelFeePriceOnlyBtn");
if (resetTravelFeeBtn) resetTravelFeeBtn.addEventListener("click", resetTravelFeePriceOnly);

function resetTravelFeePriceOnly() {
  ["ss_travel_region","ss_travel_county","ss_travel_city",
   SS_KEYS.travelMiles, SS_KEYS.travelFee, SS_KEYS.travelReason]
    .forEach(k => localStorage.removeItem(k));

  document.querySelectorAll('[data-summary="travel-fee"]').forEach(el => el.textContent = "$0.00");
  document.querySelectorAll('[data-ss-travel="fee"]').forEach(el => el.textContent = "$0.00");
  ["travelFeeHeader","bottomTravelFee","checkoutTravelFee",
   "bk_travel_price","pkg_travelFeeDisplay"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "$0.00";
  });

  ["travelRegionSelect","travelCountySelect","travelCitySelect"].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.selectedIndex = 0;
  });

  document.querySelectorAll(".bk-travel-pill").forEach(p => p.classList.remove("active"));

  const cb = document.getElementById("bk_travel");
  if (cb) cb.checked = false;
  const dd = document.getElementById("bk_travel_dropdown");
  if (dd) dd.style.display = "none";

  try { updateTotalsDisplay(); }     catch(e) {}
  try { updateContainer4Summary(); } catch(e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER REGISTRATION
// ─────────────────────────────────────────────────────────────────────────────
setTimeout(() => {
  console.log("✔ SipSavvy packages.js ready — attaching handlers");

  document.getElementById("bkResetAllBtn")
    ?.addEventListener("click", resetPackagesPage);

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

  document.querySelectorAll(".btn-deselect").forEach(btn => {
    btn.addEventListener("click", () => unifiedDeselectPackage(btn));
  });

  document.querySelectorAll(".addon-btn:not(.none-btn)").forEach(btn => {
    btn.addEventListener("click", () => unifiedSelectAddon(btn));
  });

  document.querySelectorAll(".addon-btn.none-btn").forEach(btn => {
    btn.addEventListener("click", () => unifiedDeselectAddon(btn));
  });

  const confirmLocationBtn = document.getElementById("confirmLocationBtn");
  if (confirmLocationBtn) {
    confirmLocationBtn.addEventListener("click", () => {
      if (typeof calculateTravelFee === "function") {
        try { calculateTravelFee(); } catch(e) {}
      } else {
        applyUnifiedTravelFee();
      }
    });
  }

  const checkoutBtn = document.getElementById("checkoutContinue");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "booking.html";
    });
  }

  // Initial travel fee calculation on page load
  applyUnifiedTravelFee();

}, 300);

// ─────────────────────────────────────────────────────────────────────────────
// RESET PACKAGES PAGE
// ─────────────────────────────────────────────────────────────────────────────
function resetPackagesPage() {
  Object.values(SS_KEYS).forEach(k => localStorage.removeItem(k));
  ["ss_travel_region","ss_travel_county","ss_travel_city",
   "ss_travelFee","ss_travelMiles","ss_travelReason","ss_travelSummary","ss_travelZone"]
    .forEach(k => localStorage.removeItem(k));
  location.reload();
}
