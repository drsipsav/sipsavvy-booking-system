// ─────────────────────────────────────────────────────────────────────────────
// SipSavvy — booking.js   (fully corrected)
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
    travelFee:       "ss_travel_fee",      // travelFee.js writes ss_travel_fee
    travelMiles:     "ss_travel_miles",    // travelFee.js writes ss_travel_miles
    travelReason:    "ss_travel_reason",   // travelFee.js writes ss_travel_reason
    travelSummary:   "ss_travel_summary",  // written by useThisLocation()
    travelZone:      "ss_travel_zone",     // NOT written by travelFee.js — use ss_travel_summary/city as fallback
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

// ─── Write a value to EVERY element matching selector (not just the first) ───
function setAll(selector, value) {
  document.querySelectorAll(selector).forEach(el => el.textContent = value);
}

function safeQuery(selector) {
  return document.querySelector(selector) || { textContent: "" };
}

/* ============================================================
   UNIFIED INITIALIZER — runs once when booking.html loads
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✔ Booking page ready — unified initializer running");

  // ── Migrate any legacy camelCase keys written by an older travelFee.js ──
  // (copy them to the new underscore format BEFORE purging)
  const legacyMigrations = [
    ["ss_travelFee",     "ss_travel_fee"],
    ["ss_travelMiles",   "ss_travel_miles"],
    ["ss_travelReason",  "ss_travel_reason"],
    ["ss_travelSummary", "ss_travel_summary"],
    ["ss_travelZone",    "ss_travel_zone"]
  ];
  legacyMigrations.forEach(([oldKey, newKey]) => {
    const oldVal = localStorage.getItem(oldKey);
    if (oldVal !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, oldVal);
    }
    localStorage.removeItem(oldKey);     // purge old key
  });

  // ── Recalculate addonsTotal (strip any stale Travel Fee injection) ──
  const _addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  const _clean  = _addons.filter(a => a.name !== "Travel Fee");
  if (_clean.length !== _addons.length) {
    localStorage.setItem(SS_KEYS.addons, JSON.stringify(_clean));
  }
  localStorage.setItem(SS_KEYS.addonsTotal,
    _clean.reduce((s, a) => s + Number(a.price || 0), 0));

  // ── Save grand total first so Box 5 reads the fresh number ──
  saveGrandTotal();

  loadBookingPackage();
  loadBookingAddons();   // populates Box 5 individual addon lines
  loadGrandTotalIntoBox5();

  // ── Populate data-ss-travel fields (container3 / step 3) ──
  const fee     = localStorage.getItem(SS_KEYS.travelFee)    || "0";
  const miles   = localStorage.getItem(SS_KEYS.travelMiles)  || "0";
  const reason  = localStorage.getItem(SS_KEYS.travelReason) || "";
  const summary = localStorage.getItem(SS_KEYS.travelSummary)
               || localStorage.getItem("ss_travel_city") || "";

  document.querySelectorAll('[data-ss-travel="fee"]').forEach(el =>
    el.textContent = `$${Number(fee).toFixed(2)}`);
  document.querySelectorAll('[data-ss-travel="miles"]').forEach(el =>
    el.textContent = miles);
  document.querySelectorAll('[data-ss-travel="reason"]').forEach(el =>
    el.textContent = reason);
  document.querySelectorAll('[data-ss-travel="summary"]').forEach(el =>
    el.textContent = summary);

  updateStep3Summary();
  updateContainer4Summary();

  // ── Step navigation buttons ──
  document.getElementById("bkStep1Next")?.addEventListener("click", bkGoToStep2);
  document.getElementById("bkStep2Next")?.addEventListener("click", bkGoToStep3);
  document.getElementById("bkStep3Next")?.addEventListener("click", bkGoToStep4);

  // ── Reset buttons ──
  document.getElementById("resetBox5Btn")?.addEventListener("click", resetBox5);
  document.getElementById("resetBookingPageBtn")?.addEventListener("click", resetBookingPage);

  // ── Location / travel ──
  document.getElementById("useLocationBtn")?.addEventListener("click", useThisLocation);

  // ── Time picker ──
  document.getElementById("timePicker")?.addEventListener("change", (e) => {
    onEventTimeSelected(e.target.value);
  });

  // ── Event address & zip — save to localStorage on every keystroke ──
  document.getElementById("eventLocation")?.addEventListener("input", syncEventDetails);
  document.getElementById("eventZip")?.addEventListener("input", syncEventDetails);
});

/* ============================================================
   STEP NAVIGATION
============================================================ */
function bkGoToStep2() {
  document.getElementById("booking-step-2")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function bkGoToStep3() {
  document.getElementById("booking-step-3")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function bkGoToStep4() {
  document.getElementById("booking-step-4")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================================================
   CONTAINER 1 — BOX 5 — PACKAGE SUMMARY
============================================================ */
function loadBookingPackage() {
  const name   = localStorage.getItem(SS_KEYS.pkgName)      || "—";
  const price  = Number(localStorage.getItem(SS_KEYS.pkgPrice) || 0);
  const desc   = localStorage.getItem(SS_KEYS.pkgDesc)      || "—";
  const guests = localStorage.getItem(SS_KEYS.pkgMaxGuests) || "—";
  const event  = localStorage.getItem(SS_KEYS.pkgEvent)     || "—";

  setAll('[data-summary="packageName"]',   name);
  setAll('[data-summary="packageDesc"]',   desc);
  setAll('[data-summary="packageEvent"]',  event);
  setAll('[data-summary="packageGuests"]', guests);
  setAll('[data-summary="packagePrice"]',  `$${price.toFixed(2)}`);
  setAll('[data-summary="package-total"]', `$${price.toFixed(2)}`);
}

/* ── loadBookingAddons ──────────────────────────────────────────────────────
   Reads ss_addons and writes each add-on price to EVERY matching element.
   Box 5 uses hyphenated selectors; container4 uses camelCase selectors.
   Uses Number() wrap so a JSON-parsed string price never breaks toFixed().
────────────────────────────────────────────────────────────────────────────── */
function loadBookingAddons() {
  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");

  let extraHours = 0;
  let champagne  = 0;
  let cocktail   = 0;
  let mocktail   = 0;
  let garnish    = 0;
  let customMenu = 0;

  addons.forEach(a => {
    const p = Number(a.price || 0);
    const n = (a.name || "").trim();
    if (n === "Extra Hours"                 || n.includes("Extra Hour"))     extraHours = p;
    if (n.startsWith("Champagne Toast"))                                     champagne  = p;
    if (n === "Signature Cocktail Creation" || n.includes("Cocktail"))       cocktail   = p;
    if (n === "Mocktail Bar"               || n.includes("Mocktail"))        mocktail   = p;
    if (n === "Specialty Garnish Station"  || n.includes("Garnish"))         garnish    = p;
    if (n === "Custom Drink Menu Design"   || n.includes("Menu Design"))     customMenu = p;
  });

  const addonsTotal = addons.reduce((sum, a) => sum + Number(a.price || 0), 0);
  const travelFee   = Number(localStorage.getItem(SS_KEYS.travelFee) || 0);

  // ── Box 5 hyphenated selectors ──
  setAll('[data-summary="extra-hours"]',            `$${extraHours.toFixed(2)}`);
  setAll('[data-summary="champagne-toast-price"]',  `$${champagne.toFixed(2)}`);
  setAll('[data-summary="cocktail-creation-price"]',`$${cocktail.toFixed(2)}`);
  setAll('[data-summary="mocktail-bar-price"]',     `$${mocktail.toFixed(2)}`);
  setAll('[data-summary="garnish-station-price"]',  `$${garnish.toFixed(2)}`);
  setAll('[data-summary="custom-menu-design-price"]',`$${customMenu.toFixed(2)}`);

  // ── Container4 camelCase selectors ──
  setAll('[data-summary="addon-extraHours"]',       `$${extraHours.toFixed(2)}`);
  setAll('[data-summary="addon-champagneToast"]',   `$${champagne.toFixed(2)}`);
  setAll('[data-summary="addon-cocktailCreation"]', `$${cocktail.toFixed(2)}`);
  setAll('[data-summary="addon-mocktailBar"]',      `$${mocktail.toFixed(2)}`);
  setAll('[data-summary="addon-garnishStation"]',   `$${garnish.toFixed(2)}`);
  setAll('[data-summary="addon-customMenu"]',       `$${customMenu.toFixed(2)}`);

  // ── Totals ──
  setAll('[data-summary="addons-total"]', `$${addonsTotal.toFixed(2)}`);
  setAll('[data-summary="travel-fee"]',   `$${travelFee.toFixed(2)}`);
}

/* ── loadGrandTotalIntoBox5 ─────────────────────────────────────────────────── */
function loadGrandTotalIntoBox5() {
  const pkgPrice    = Number(localStorage.getItem(SS_KEYS.pkgPrice)    || 0);
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);
  const travelFee   = Number(localStorage.getItem(SS_KEYS.travelFee)   || 0);
  const grand       = pkgPrice + addonsTotal + travelFee;

  setAll('[data-summary="grand-total"]',  `$${grand.toFixed(2)}`);
  setAll('[data-summary="travel-fee"]',   `$${travelFee.toFixed(2)}`);
  setAll('[data-summary="packagePrice"]', `$${pkgPrice.toFixed(2)}`);
  setAll('[data-summary="addons-total"]', `$${addonsTotal.toFixed(2)}`);
}

/* ============================================================
   CONTAINER 2 — STEP 2 — YOUR DETAILS
============================================================ */
function updateStep2Summary() {
  const name  = document.getElementById("userName")?.value  || "";
  const email = document.getElementById("userEmail")?.value || "";
  const phone = document.getElementById("userPhone")?.value || "";
  const notes = document.getElementById("userNotes")?.value || "";

  localStorage.setItem(SS_KEYS.contactName,  name);
  localStorage.setItem(SS_KEYS.contactEmail, email);
  localStorage.setItem(SS_KEYS.contactPhone, phone);
  localStorage.setItem(SS_KEYS.contactNotes, notes);

  setAll('[data-summary="userName"]',      name);
  setAll('[data-summary="userEmail"]',     email);
  setAll('[data-summary="userPhone"]',     phone);
  setAll('[data-summary="userNotes"]',     notes);
  setAll('[data-summary="contact-name"]',  name);
  setAll('[data-summary="contact-email"]', email);
  setAll('[data-summary="contact-phone"]', phone);
  setAll('[data-summary="contact-notes"]', notes);
}

/* ============================================================
   CONTAINER 3 — STEP 3 — BOOKING SUMMARY
============================================================ */
function updateStep3Summary() {
  const pkgPrice    = Number(localStorage.getItem(SS_KEYS.pkgPrice)    || 0);
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);
  const travelFee   = Number(localStorage.getItem(SS_KEYS.travelFee)   || 0);
  const grandTotal  = pkgPrice + addonsTotal + travelFee;

  setAll('[data-summary="packagePrice"]', `$${pkgPrice.toFixed(2)}`);
  setAll('[data-summary="addons-total"]', `$${addonsTotal.toFixed(2)}`);
  setAll('[data-summary="travel-fee"]',   `$${travelFee.toFixed(2)}`);
  setAll('[data-summary="grand-total"]',  `$${grandTotal.toFixed(2)}`);

  // ── data-ss-travel fields — use querySelectorAll, NOT safeQuery ──
  const fee     = localStorage.getItem(SS_KEYS.travelFee)    || "0";
  const miles   = localStorage.getItem(SS_KEYS.travelMiles)  || "—";
  const reason  = localStorage.getItem(SS_KEYS.travelReason) || "—";
  const summary = localStorage.getItem(SS_KEYS.travelSummary)
               || localStorage.getItem("ss_travel_city") || "—";

  document.querySelectorAll('[data-ss-travel="fee"]').forEach(el =>
    el.textContent = `$${Number(fee).toFixed(2)}`);
  document.querySelectorAll('[data-ss-travel="miles"]').forEach(el =>
    el.textContent = miles);
  document.querySelectorAll('[data-ss-travel="reason"]').forEach(el =>
    el.textContent = reason);
  document.querySelectorAll('[data-ss-travel="summary"]').forEach(el =>
    el.textContent = summary);

  setAll('[data-summary="event-date"]',     localStorage.getItem(SS_KEYS.eventDate)     || "—");
  setAll('[data-summary="event-time"]',     localStorage.getItem(SS_KEYS.eventTime)     || "—");
  setAll('[data-summary="event-duration"]', localStorage.getItem(SS_KEYS.eventDuration) || "3 hrs");
  setAll('[data-summary="event-endTime"]',  localStorage.getItem(SS_KEYS.eventEndTime)  || "—");
}

/* ============================================================
   CONTAINER 4 — FULL ORDER SUMMARY
============================================================ */
function updateContainer4Summary() {
  // ── Package ──
  const pkgName   = localStorage.getItem(SS_KEYS.pkgName)      || "—";
  const pkgDesc   = localStorage.getItem(SS_KEYS.pkgDesc)      || "—";
  const pkgGuests = localStorage.getItem(SS_KEYS.pkgMaxGuests) || "—";
  const pkgPrice  = Number(localStorage.getItem(SS_KEYS.pkgPrice) || 0);

  setAll('[data-summary="packageName"]',   pkgName);
  setAll('[data-summary="packageDesc"]',   pkgDesc);
  setAll('[data-summary="packageGuests"]', pkgGuests);
  setAll('[data-summary="packagePrice"]',  `$${pkgPrice.toFixed(2)}`);
  setAll('[data-summary="package-total"]', `$${pkgPrice.toFixed(2)}`);

  // ── Add-ons (individual lines) ──
  const addons     = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);

  const findAddon = (keyword) => {
    const item = addons.find(a => (a.name || "").includes(keyword));
    return item ? Number(item.price || 0) : 0;
  };
  const extraHours = findAddon("Extra Hour");
  const champagne  = (() => {
    const item = addons.find(a => (a.name || "").startsWith("Champagne Toast"));
    return item ? Number(item.price || 0) : 0;
  })();
  const cocktail   = findAddon("Cocktail Creation");
  const mocktail   = findAddon("Mocktail");
  const garnish    = findAddon("Garnish");
  const customMenu = findAddon("Menu Design");

  // Box 5 hyphenated
  setAll('[data-summary="extra-hours"]',            `$${extraHours.toFixed(2)}`);
  setAll('[data-summary="champagne-toast-price"]',  `$${champagne.toFixed(2)}`);
  setAll('[data-summary="cocktail-creation-price"]',`$${cocktail.toFixed(2)}`);
  setAll('[data-summary="mocktail-bar-price"]',     `$${mocktail.toFixed(2)}`);
  setAll('[data-summary="garnish-station-price"]',  `$${garnish.toFixed(2)}`);
  setAll('[data-summary="custom-menu-design-price"]',`$${customMenu.toFixed(2)}`);

  // Container4 camelCase
  setAll('[data-summary="addon-extraHours"]',       `$${extraHours.toFixed(2)}`);
  setAll('[data-summary="addon-champagneToast"]',   `$${champagne.toFixed(2)}`);
  setAll('[data-summary="addon-cocktailCreation"]', `$${cocktail.toFixed(2)}`);
  setAll('[data-summary="addon-mocktailBar"]',      `$${mocktail.toFixed(2)}`);
  setAll('[data-summary="addon-garnishStation"]',   `$${garnish.toFixed(2)}`);
  setAll('[data-summary="addon-customMenu"]',       `$${customMenu.toFixed(2)}`);

  setAll('[data-summary="addons-total"]', `$${addonsTotal.toFixed(2)}`);

  // ── Travel ──
  // travelFee.js NEVER writes ss_travel_zone.
  // "Zone" reads ss_travel_summary (set by useThisLocation) or ss_travel_city.
  const travelMiles  = localStorage.getItem(SS_KEYS.travelMiles)   || "—";
  const travelZone   = localStorage.getItem(SS_KEYS.travelSummary)
                    || localStorage.getItem("ss_travel_city")       || "—";
  const travelReason = localStorage.getItem(SS_KEYS.travelReason)   || "—";
  const travelFee    = Number(localStorage.getItem(SS_KEYS.travelFee) || 0);

  setAll('[data-summary="travel-miles"]',  travelMiles);
  setAll('[data-summary="travel-zone"]',   travelZone);
  setAll('[data-summary="travel-reason"]', travelReason);
  setAll('[data-summary="travel-fee"]',    `$${travelFee.toFixed(2)}`);

  // Also update data-ss-travel selectors
  document.querySelectorAll('[data-ss-travel="fee"]').forEach(el =>
    el.textContent = `$${travelFee.toFixed(2)}`);
  document.querySelectorAll('[data-ss-travel="miles"]').forEach(el =>
    el.textContent = travelMiles);
  document.querySelectorAll('[data-ss-travel="reason"]').forEach(el =>
    el.textContent = travelReason);
  document.querySelectorAll('[data-ss-travel="summary"]').forEach(el =>
    el.textContent = travelZone);

  // ── Event details ──
  setAll('[data-summary="event-date"]',     localStorage.getItem(SS_KEYS.eventDate)     || "—");
  setAll('[data-summary="event-time"]',     localStorage.getItem(SS_KEYS.eventTime)     || "—");
  setAll('[data-summary="event-duration"]', localStorage.getItem(SS_KEYS.eventDuration) || "—");
  setAll('[data-summary="event-endTime"]',  localStorage.getItem(SS_KEYS.eventEndTime)  || "—");
  setAll('[data-summary="event-address"]',  localStorage.getItem(SS_KEYS.eventAddress)  || "—");
  setAll('[data-summary="event-zip"]',      localStorage.getItem(SS_KEYS.eventZip)      || "—");

  // ── Contact info ──
  setAll('[data-summary="contact-name"]',  localStorage.getItem(SS_KEYS.contactName)  || "—");
  setAll('[data-summary="contact-email"]', localStorage.getItem(SS_KEYS.contactEmail) || "—");
  setAll('[data-summary="contact-phone"]', localStorage.getItem(SS_KEYS.contactPhone) || "—");
  setAll('[data-summary="contact-notes"]', localStorage.getItem(SS_KEYS.contactNotes) || "—");

  // ── Grand total ──
  const grandTotal = pkgPrice + addonsTotal + travelFee;
  setAll('[data-summary="grand-total"]', `$${grandTotal.toFixed(2)}`);
}

/* ============================================================
   EVENT TIME / DATE / ADDRESS
============================================================ */
function calculateEventEndTime() {
  const startTime  = localStorage.getItem(SS_KEYS.eventTime);
  let   extraHours = Number(localStorage.getItem(SS_KEYS.extraHours) || 0);
  if (extraHours > 4) extraHours = 4;

  const totalHours = 3 + extraHours;
  if (!startTime) return "—";

  const [time, modifier] = startTime.split(" ");
  let [hours, minutes]   = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours   = 0;

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  d.setHours(d.getHours() + totalHours);

  let endH     = d.getHours();
  const endM   = d.getMinutes().toString().padStart(2, "0");
  const endMod = endH >= 12 ? "PM" : "AM";
  endH = endH % 12 || 12;
  return `${endH}:${endM} ${endMod}`;
}

function onExtraHoursSelected(hours) {
  if (hours > 4) hours = 4;
  localStorage.setItem(SS_KEYS.extraHours, hours);

  const endTime = calculateEventEndTime();
  localStorage.setItem(SS_KEYS.eventEndTime,  endTime);
  localStorage.setItem(SS_KEYS.eventDuration, `${3 + hours} hrs`);

  updateStep3Summary();
  updateContainer4Summary();
}

function onEventTimeSelected(time) {
  localStorage.setItem(SS_KEYS.eventTime, time);
  localStorage.setItem(SS_KEYS.eventEndTime, calculateEventEndTime());
  updateStep3Summary();
  updateContainer4Summary();
}

function ssOnTime(timeString) {
  const ph = document.getElementById("bsFlTimePlaceholder");
  if (ph) ph.textContent = timeString;
  localStorage.setItem(SS_KEYS.eventTime, timeString);
  localStorage.setItem(SS_KEYS.eventEndTime, calculateEventEndTime());
  updateStep3Summary();
  updateContainer4Summary();
}

function onEventDateSelected(date) {
  localStorage.setItem(SS_KEYS.eventDate, date);
  updateStep3Summary();
  updateContainer4Summary();
}

function ssSelectDate(dateString) {
  const ph = document.getElementById("bsFlDatePlaceholder");
  if (ph) ph.textContent = dateString;
  localStorage.setItem(SS_KEYS.eventDate, dateString);
  updateStep3Summary();
  updateContainer4Summary();
}

// Called by oninput on eventLocation and eventZip inputs
function syncEventDetails() {
  const address = document.getElementById("eventLocation")?.value || "";
  const zip     = document.getElementById("eventZip")?.value      || "";
  localStorage.setItem(SS_KEYS.eventAddress, address);
  localStorage.setItem(SS_KEYS.eventZip,     zip);
  updateStep3Summary();
  updateContainer4Summary();
}

// Called by the format-zip helper in HTML
function formatZip(input) {
  input.value = input.value.replace(/\D/g, "").slice(0, 5);
  syncEventDetails();
}

/* ============================================================
   TRAVEL SUMMARY / GRAND TOTAL
============================================================ */
function saveGrandTotal() {
  const pkgTotal    = Number(localStorage.getItem(SS_KEYS.pkgPrice)    || 0);
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);
  const travelFee   = Number(localStorage.getItem(SS_KEYS.travelFee)   || 0);
  localStorage.setItem(SS_KEYS.grandTotal, pkgTotal + addonsTotal + travelFee);
}

function useThisLocation() {
  const loc = document.getElementById("eventLocation")?.value || "";
  localStorage.setItem(SS_KEYS.travelSummary, loc);
  localStorage.setItem(SS_KEYS.eventAddress,  loc);

  document.querySelectorAll('[data-ss-travel="summary"]').forEach(el =>
    el.textContent = loc);
  setAll('[data-summary="travel-zone"]',   loc);
  setAll('[data-summary="event-address"]', loc);

  updateStep3Summary();
  updateContainer4Summary();
}

/* ============================================================
   RESET FUNCTIONS
============================================================ */
function resetBox5() {
  Object.values(SS_KEYS).forEach(k => localStorage.removeItem(k));
  ["ss_travelFee","ss_travelMiles","ss_travelReason","ss_travelSummary","ss_travelZone",
   "ss_travel_fee","ss_travel_miles","ss_travel_reason","ss_travel_summary","ss_travel_zone",
   "ss_travel_region","ss_travel_county","ss_travel_city"].forEach(k => localStorage.removeItem(k));
  location.reload();
}

function resetBookingPage() {
  Object.values(SS_KEYS).forEach(k => localStorage.removeItem(k));
  ["ss_travelFee","ss_travelMiles","ss_travelReason","ss_travelSummary","ss_travelZone",
   "ss_travel_fee","ss_travel_miles","ss_travel_reason","ss_travel_summary","ss_travel_zone",
   "ss_travel_region","ss_travel_county","ss_travel_city"].forEach(k => localStorage.removeItem(k));
  location.reload();
}

function bkActivateStep2() { bkGoToStep2(); }
