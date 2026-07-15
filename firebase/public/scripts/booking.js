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
    grandTotal:      "ss_grandTotal",
    bookedDates:     "ss_booked_dates"   // JSON array of confirmed date strings
  };
}
var SS_KEYS = window.SS_KEYS;

/* ============================================================
   HELPERS
============================================================ */
// Write to EVERY element matching selector (not just the first)
function setAll(selector, value) {
  document.querySelectorAll(selector).forEach(el => el.textContent = value);
}

function safeQuery(selector) {
  return document.querySelector(selector) || { textContent: "" };
}

// Convert "HH:MM" (24-hr from <input type="time">) → "h:MM AM/PM"
function convertTo12Hr(timeStr) {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  const modifier = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${modifier}`;
}

/* ============================================================
   CALENDAR PICKER STATE
   _ssCalYear / _ssCalMonth track the currently displayed month.
   _ssSelectedDate tracks which date was clicked.
============================================================ */
var _ssCalYear      = new Date().getFullYear();
var _ssCalMonth     = new Date().getMonth();   // 0-indexed (Jan=0)
var _ssSelectedDate = localStorage.getItem(SS_KEYS.eventDate) || null;

/* ============================================================
   SERVICE AVAILABILITY RULES  (v14)
   Blocked completely : Mon(1), Tue(2), Wed(3) + specific annual dates
   Limited (6PM+)    : Thu(4), Fri(5)
   Fully open        : Sat(6), Sun(0)
============================================================ */
// Specific dates blocked every year — month is 0-indexed (Jan=0)
var _ssBlockedDates = [
  { month: 4,  day: 27 },   // May 27
  { month: 7,  day: 21 },   // August 21
  { month: 7,  day: 28 },   // August 28
  { month: 9,  day: 30 }    // October 30
];

/** Returns true if the date is completely blocked (no service). */
function _ssIsBlockedDay(dateObj) {
  var dow = dateObj.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  if (dow === 1 || dow === 2 || dow === 3) return true;
  var m = dateObj.getMonth();
  var d = dateObj.getDate();
  return _ssBlockedDates.some(function(b) { return b.month === m && b.day === d; });
}

/** Returns true if the date is Thu or Fri (service from 6 PM only). */
function _ssIsLimitedDay(dateObj) {
  var dow = dateObj.getDay();
  return (dow === 4 || dow === 5);
}

/* ============================================================
   BOOKED DATES — CLIENT-SIDE TRACKING  (v16)
   Dates confirmed via "Confirm Booking" are stored in localStorage
   as a JSON array of dateStrings (the same long format used by
   _ssSelectedDate, e.g. "Saturday, July 12, 2025").
   These dates render on the calendar as "Booked" — greyed with a
   dark badge, not clickable.
============================================================ */

/** Load confirmed booked dates from localStorage. */
function _ssGetBookedDates() {
  try {
    return JSON.parse(localStorage.getItem(SS_KEYS.bookedDates) || "[]");
  } catch (e) {
    return [];
  }
}

/** Save a new confirmed date into the booked-dates array (no duplicates). */
function _ssAddBookedDate(dateString) {
  if (!dateString || dateString === "—") return;
  var booked = _ssGetBookedDates();
  if (!booked.includes(dateString)) {
    booked.push(dateString);
    localStorage.setItem(SS_KEYS.bookedDates, JSON.stringify(booked));
  }
}

/**
 * Returns true if the given Date object matches any confirmed booked date.
 * Compares using the same long locale string format used by ssSelectDate().
 */
function _ssIsBookedDate(dateObj) {
  var booked  = _ssGetBookedDates();
  var dateStr = dateObj.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  return booked.includes(dateStr);
}

/* ============================================================
   UNIFIED INITIALIZER — RUNS ONCE
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✔ Booking page ready — unified initializer running");

  // ── Migrate legacy camelCase keys → underscore format, then purge ──
  // (handles the case where travelFee.js wrote camelCase before the key rename)
  const legacyMigrations = [
    ["ss_travelFee",     "ss_travel_fee"],
    ["ss_travelMiles",   "ss_travel_miles"],
    ["ss_travelReason",  "ss_travel_reason"],
    ["ss_travelSummary", "ss_travel_summary"],
    ["ss_travelZone",    "ss_travel_zone"]
  ];
  legacyMigrations.forEach(([oldKey, newKey]) => {
    const oldVal = localStorage.getItem(oldKey);
    if (oldVal !== null && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, oldVal);  // copy to canonical key first
    }
    localStorage.removeItem(oldKey);         // then purge the old key
  });

  // Recalculate addonsTotal from array (excluding any old Travel Fee injection)
  const _addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]");
  const _cleanAddons = _addons.filter(a => a.name !== "Travel Fee");
  if (_cleanAddons.length !== _addons.length) {
    localStorage.setItem(SS_KEYS.addons, JSON.stringify(_cleanAddons));
  }
  localStorage.setItem(SS_KEYS.addonsTotal,
    _cleanAddons.reduce((s, a) => s + Number(a.price || 0), 0));

  // saveGrandTotal FIRST — so loadGrandTotalIntoBox5 reads the fresh value
  saveGrandTotal();

  loadBookingPackage();
  loadBookingAddons();
  loadGrandTotalIntoBox5();

  // Populate all travel fields across all containers
  const fee     = localStorage.getItem(SS_KEYS.travelFee)    || "0";
  const miles   = localStorage.getItem(SS_KEYS.travelMiles)  || "0";
  const reason  = localStorage.getItem(SS_KEYS.travelReason) || "";
  const summary = localStorage.getItem(SS_KEYS.travelSummary)
               || localStorage.getItem("ss_travel_city") || "";

  setAll('[data-ss-travel="fee"]',     `$${Number(fee).toFixed(2)}`);
  setAll('[data-ss-travel="miles"]',   miles);
  setAll('[data-ss-travel="reason"]',  reason);
  setAll('[data-ss-travel="summary"]', summary);
  setAll('[data-summary="travel-miles"]',  miles);
  setAll('[data-summary="travel-zone"]',   summary);
  setAll('[data-summary="travel-reason"]', reason);

  updateStep3Summary();
  updateContainer4Summary();

  // Restore contact info rows from localStorage (page refresh / back-nav)
  _restoreContactRows();

  // Step navigation buttons
  document.getElementById("bkStep1Next")?.addEventListener("click", bkGoToStep2);
  document.getElementById("bkStep2Next")?.addEventListener("click", bkGoToStep3);
  document.getElementById("bkStep3Next")?.addEventListener("click", bkGoToStep4);

  // Reset buttons
  document.getElementById("resetBox5Btn")?.addEventListener("click", resetBox5);
  document.getElementById("resetBookingPageBtn")?.addEventListener("click", resetBookingPage);

  // Use-location button
  document.getElementById("useLocationBtn")?.addEventListener("click", useThisLocation);

  // Legacy time picker (if present alongside FL picker)
  document.getElementById("timePicker")
    ?.addEventListener("change", (e) => onEventTimeSelected(e.target.value));

  // Event address listeners — both #eventAddress and #eventLocation
  ["eventAddress", "eventLocation"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", () => syncEventDetails());
  });

  // Event zip listener
  document.getElementById("eventZip")
    ?.addEventListener("input", function() {
      formatZip(this);
      syncEventDetails();
    });

  // Confirm Booking button → EmailJS auto-send
  document.getElementById("finalConfirmBtn")
    ?.addEventListener("click", bkConfirmBooking);

  // ── Initialize EmailJS v4 (must run after SDK script loads) ──
  // Add this to booking.html BEFORE booking.js:
  //   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("✔ EmailJS initialized");
  } else {
    console.warn("⚠️ EmailJS SDK not found. Add the CDN script tag to booking.html before booking.js.");
  }

  // Restore selected date display if one was already saved
  if (_ssSelectedDate) {
    const ph = document.getElementById("bsFlDatePlaceholder");
    if (ph) {
      ph.style.color      = "#2C2020";
      ph.style.fontWeight = "600";
      ph.textContent      = _ssSelectedDate;
    }
  }

  // Restore selected time display if one was already saved
  const savedTime = localStorage.getItem(SS_KEYS.eventTime);
  if (savedTime) {
    const timePh = document.getElementById("bsFlTimePlaceholder");
    if (timePh) {
      timePh.style.color      = "#2C2020";
      timePh.style.fontWeight = "600";
      timePh.textContent      = savedTime;
    }
    _updateDurationDisplay();
  }
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
// Aliases called from HTML buttons
function bkActivateStep2() { bkGoToStep2(); }
function bkActivateStep3() { bkGoToStep3(); }
function bkActivateStep4() { bkGoToStep4(); }

/* ============================================================
   CONTAINER1 — BOX 5 — PACKAGE + ADD-ONS SUMMARY
============================================================ */
function loadBookingPackage() {
  const name   = localStorage.getItem(SS_KEYS.pkgName)      || "—";
  const price  = Number(localStorage.getItem(SS_KEYS.pkgPrice) || 0);
  const desc   = localStorage.getItem(SS_KEYS.pkgDesc)      || "—";
  const guests = localStorage.getItem(SS_KEYS.pkgMaxGuests) || "—";
  const event  = localStorage.getItem(SS_KEYS.pkgEvent)     || "—";

  setAll('[data-summary="packageName"]',   name);
  setAll('[data-summary="packagePrice"]',  `$${price.toFixed(2)}`);
  setAll('[data-summary="packageDesc"]',   desc);
  setAll('[data-summary="packageGuests"]', guests);
  setAll('[data-summary="packageEvent"]',  event);
  setAll('[data-summary="package-total"]', `$${price.toFixed(2)}`);
}

function loadBookingAddons() {
  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]")
    .filter(a => a.name !== "Travel Fee");

  const findPrice = (matchFn) => {
    const item = addons.find(matchFn);
    return item ? Number(item.price || 0) : 0;
  };

  const extraHours = findPrice(a => a.name.toLowerCase().includes("extra hour"));
  const champagne  = findPrice(a => a.name.toLowerCase().includes("champagne"));
  const cocktail   = findPrice(a => a.name.toLowerCase().includes("cocktail creation"));
  const mocktail   = findPrice(a => a.name.toLowerCase().includes("mocktail"));
  const garnish    = findPrice(a => a.name.toLowerCase().includes("garnish"));
  const customMenu = findPrice(a => a.name.toLowerCase().includes("drink menu"));

  const addonsTotal = addons.reduce((sum, a) => sum + Number(a.price || 0), 0);
  const travelFee   = Number(localStorage.getItem(SS_KEYS.travelFee) || 0);

  // Hyphen selectors — Box 5 / Container 3
  setAll('[data-summary="extra-hours"]',              `$${extraHours.toFixed(2)}`);
  setAll('[data-summary="champagne-toast-price"]',    `$${champagne.toFixed(2)}`);
  setAll('[data-summary="cocktail-creation-price"]',  `$${cocktail.toFixed(2)}`);
  setAll('[data-summary="mocktail-bar-price"]',       `$${mocktail.toFixed(2)}`);
  setAll('[data-summary="garnish-station-price"]',    `$${garnish.toFixed(2)}`);
  setAll('[data-summary="custom-menu-design-price"]', `$${customMenu.toFixed(2)}`);
  setAll('[data-summary="addons-total"]',             `$${addonsTotal.toFixed(2)}`);
  setAll('[data-summary="travel-fee"]',               `$${travelFee.toFixed(2)}`);

  // camelCase selectors — Container 4
  setAll('[data-summary="addon-extraHours"]',       `$${extraHours.toFixed(2)}`);
  setAll('[data-summary="addon-champagneToast"]',   `$${champagne.toFixed(2)}`);
  setAll('[data-summary="addon-cocktailCreation"]', `$${cocktail.toFixed(2)}`);
  setAll('[data-summary="addon-mocktailBar"]',      `$${mocktail.toFixed(2)}`);
  setAll('[data-summary="addon-garnishStation"]',   `$${garnish.toFixed(2)}`);
  setAll('[data-summary="addon-customMenu"]',       `$${customMenu.toFixed(2)}`);
}

function loadGrandTotalIntoBox5() {
  const grand = Number(localStorage.getItem(SS_KEYS.grandTotal) || 0);
  setAll('[data-summary="grand-total"]', `$${grand.toFixed(2)}`);
}

/* ============================================================
   CONTAINER2 — STEP 2 — YOUR DETAILS (legacy field support)
============================================================ */
function updateStep2Summary() {
  const name  = document.getElementById("userName")?.value  || "";
  const email = document.getElementById("userEmail")?.value || "";
  const phone = document.getElementById("userPhone")?.value || "";
  const notes = document.getElementById("userNotes")?.value || "";

  setAll('[data-summary="userName"]',  name);
  setAll('[data-summary="userEmail"]', email);
  setAll('[data-summary="userPhone"]', phone);
  setAll('[data-summary="userNotes"]', notes);
}

/* ============================================================
   CONTACT DETAILS FORM — Step 2 (cd_ fields)
   Called by oninput on #cd_firstName, #cd_lastName,
   #cd_email, #cd_phone, #cd_note
============================================================ */
function cdSync() {
  const firstName = document.getElementById("cd_firstName")?.value.trim() || "";
  const lastName  = document.getElementById("cd_lastName")?.value.trim()  || "";
  const email     = document.getElementById("cd_email")?.value.trim()     || "";
  const phone     = document.getElementById("cd_phone")?.value.trim()     || "";
  const note      = document.getElementById("cd_note")?.value.trim()      || "";

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  // Save to localStorage
  localStorage.setItem(SS_KEYS.contactName,  fullName);
  localStorage.setItem(SS_KEYS.contactEmail, email);
  localStorage.setItem(SS_KEYS.contactPhone, phone);
  localStorage.setItem(SS_KEYS.contactNotes, note);

  // ── Update container3 ID-based contact rows ──
  _setContactRow("bsContactRow", "bsContactLine", fullName);
  _setContactRow("bsEmailRow",   "bsEmailLine",   email);
  _setContactRow("bsPhoneRow",   "bsPhoneLine",   phone);
  _setContactRow("bsNoteRow",    "bsNoteLine",    note);

  // ── Also update container4 data-summary selectors ──
  setAll('[data-summary="contact-name"]',  fullName || "—");
  setAll('[data-summary="contact-email"]', email    || "—");
  setAll('[data-summary="contact-phone"]', phone    || "—");
  setAll('[data-summary="contact-notes"]', note     || "—");
}

// Internal: show a contact row and populate its value span
function _setContactRow(rowId, lineId, value) {
  const row  = document.getElementById(rowId);
  const line = document.getElementById(lineId);
  if (row)  row.style.display  = value ? "flex" : "none";
  if (line) line.textContent   = value;
}

// Restore contact rows from localStorage (called on DOMContentLoaded)
function _restoreContactRows() {
  const name  = localStorage.getItem(SS_KEYS.contactName)  || "";
  const email = localStorage.getItem(SS_KEYS.contactEmail) || "";
  const phone = localStorage.getItem(SS_KEYS.contactPhone) || "";
  const note  = localStorage.getItem(SS_KEYS.contactNotes) || "";

  _setContactRow("bsContactRow", "bsContactLine", name);
  _setContactRow("bsEmailRow",   "bsEmailLine",   email);
  _setContactRow("bsPhoneRow",   "bsPhoneLine",   phone);
  _setContactRow("bsNoteRow",    "bsNoteLine",    note);

  // Repopulate form fields if user navigated back
  const fn = name.split(" ")[0] || "";
  const ln = name.split(" ").slice(1).join(" ") || "";
  const fnEl = document.getElementById("cd_firstName");
  const lnEl = document.getElementById("cd_lastName");
  if (fnEl && !fnEl.value) fnEl.value = fn;
  if (lnEl && !lnEl.value) lnEl.value = ln;

  const emailEl = document.getElementById("cd_email");
  const phoneEl = document.getElementById("cd_phone");
  const noteEl  = document.getElementById("cd_note");
  if (emailEl && !emailEl.value) emailEl.value = email;
  if (phoneEl && !phoneEl.value) phoneEl.value = phone;
  if (noteEl  && !noteEl.value)  noteEl.value  = note;
}

// Phone formatter — formats as (555) 000-0000 while typing
function cdFormatPhone(input) {
  let v = input.value.replace(/\D/g, "").slice(0, 10);
  if (v.length > 6) {
    v = `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`;
  } else if (v.length > 3) {
    v = `(${v.slice(0,3)}) ${v.slice(3)}`;
  } else if (v.length > 0) {
    v = `(${v}`;
  }
  input.value = v;
  cdSync();
}

/* ============================================================
   FIELD FOCUS / BLUR HELPERS
   Called by onfocus="bsFocusField(this)" and
              onblur="bsBlurField(this)" in the HTML
============================================================ */
function bsFocusField(el) {
  if (el && el.parentElement) {
    el.parentElement.style.borderColor = "#722F37";
  }
}

function bsBlurField(el) {
  if (el && el.parentElement) {
    el.parentElement.style.borderColor = "#DDCCCC";
  }
  syncEventDetails();
}

/* ============================================================
   CONTAINER3 — STEP 3 — BOOKING SUMMARY (data-summary selectors
   AND the ID-based elements unique to container3)
============================================================ */
function updateStep3Summary() {
  const pkgName     = localStorage.getItem(SS_KEYS.pkgName)      || "—";
  const pkgGuests   = localStorage.getItem(SS_KEYS.pkgMaxGuests) || "";
  const pkgPrice    = Number(localStorage.getItem(SS_KEYS.pkgPrice)    || 0);
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);
  const travelFee   = Number(localStorage.getItem(SS_KEYS.travelFee)   || 0);
  const grandTotal  = pkgPrice + addonsTotal + travelFee;

  // ── data-summary selectors (Box5 + container4 share these) ──
  setAll('[data-summary="packageName"]',   pkgName);
  setAll('[data-summary="packagePrice"]',  `$${pkgPrice.toFixed(2)}`);
  setAll('[data-summary="addons-total"]',  `$${addonsTotal.toFixed(2)}`);
  setAll('[data-summary="travel-fee"]',    `$${travelFee.toFixed(2)}`);
  setAll('[data-summary="grand-total"]',   `$${grandTotal.toFixed(2)}`);

  setAll('[data-ss-travel="summary"]',
    localStorage.getItem(SS_KEYS.travelSummary)
    || localStorage.getItem("ss_travel_city") || "—");
  setAll('[data-ss-travel="reason"]',
    localStorage.getItem(SS_KEYS.travelReason) || "—");
  setAll('[data-ss-travel="miles"]',
    localStorage.getItem(SS_KEYS.travelMiles) || "—");
  setAll('[data-ss-travel="fee"]', `$${travelFee.toFixed(2)}`);

  const eventDate = localStorage.getItem(SS_KEYS.eventDate) || "—";
  const eventTime = localStorage.getItem(SS_KEYS.eventTime) || "—";
  setAll('[data-summary="event-date"]',     eventDate);
  setAll('[data-summary="event-time"]',     eventTime);
  setAll('[data-summary="event-duration"]',
    localStorage.getItem(SS_KEYS.eventDuration) || "3 hrs");
  setAll('[data-summary="event-endTime"]',
    localStorage.getItem(SS_KEYS.eventEndTime) || "—");

  // ── Container3 ID-based elements ──

  // Package name + guests + price
  const bsSummaryName = document.getElementById("bsSummaryName");
  if (bsSummaryName) bsSummaryName.textContent = pkgName;

  const bsSummaryGuests = document.getElementById("bsSummaryGuests");
  if (bsSummaryGuests) bsSummaryGuests.textContent = pkgGuests;

  const bsSummaryPkgPrice = document.getElementById("bsSummaryPkgPrice");
  if (bsSummaryPkgPrice) bsSummaryPkgPrice.textContent = `$${pkgPrice.toFixed(2)}`;

  // Add-ons subtotal
  const bsAddonsSubtotal = document.getElementById("bsAddonsSubtotal");
  if (bsAddonsSubtotal) bsAddonsSubtotal.textContent = `$${addonsTotal.toFixed(2)}`;

  // Date row — show only when a date is selected
  const bsDateRow  = document.getElementById("bsDateRow");
  const bsDateLine = document.getElementById("bsDateLine");
  if (bsDateRow)  bsDateRow.style.display  = (eventDate !== "—" && eventDate) ? "flex" : "none";
  if (bsDateLine) bsDateLine.textContent   = eventDate;

  // Time row — show only when a time is selected
  const bsTimeRow  = document.getElementById("bsTimeRow");
  const bsTimeLine = document.getElementById("bsTimeLine");
  if (bsTimeRow)  bsTimeRow.style.display  = (eventTime !== "—" && eventTime) ? "flex" : "none";
  if (bsTimeLine) bsTimeLine.textContent   = eventTime;

  // Add-ons list — show the row and build the list
  const addonsArr   = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]")
    .filter(a => a.name !== "Travel Fee");
  const bsAddonsRow  = document.getElementById("bsAddonsRow");
  const bsAddonsList = document.getElementById("bsAddonsList");
  if (bsAddonsRow) bsAddonsRow.style.display = addonsArr.length ? "block" : "none";
  if (bsAddonsList) {
    bsAddonsList.innerHTML = addonsArr.map(a =>
      `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <span style="font-family:'Inter',sans-serif;font-size:0.78rem;color:#4A3A3A;">${a.name}</span>
        <span style="font-family:'Inter',sans-serif;font-size:0.78rem;font-weight:600;color:#541E25;">$${Number(a.price||0).toFixed(2)}</span>
      </div>`
    ).join("");
  }

  // Contact rows — reflect current localStorage values
  _setContactRow("bsContactRow", "bsContactLine",
    localStorage.getItem(SS_KEYS.contactName)  || "");
  _setContactRow("bsEmailRow",   "bsEmailLine",
    localStorage.getItem(SS_KEYS.contactEmail) || "");
  _setContactRow("bsPhoneRow",   "bsPhoneLine",
    localStorage.getItem(SS_KEYS.contactPhone) || "");
  _setContactRow("bsNoteRow",    "bsNoteLine",
    localStorage.getItem(SS_KEYS.contactNotes) || "");
}

/* ============================================================
   TRAVEL SUMMARY + GRAND TOTAL
============================================================ */
function saveGrandTotal() {
  const pkgTotal    = Number(localStorage.getItem(SS_KEYS.pkgPrice)    || 0);
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);
  const travelFee   = Number(localStorage.getItem(SS_KEYS.travelFee)   || 0);
  const grand = pkgTotal + addonsTotal + travelFee;
  localStorage.setItem(SS_KEYS.grandTotal, grand);
}

/* ============================================================
   CONTAINER4 — FULL ORDER SUMMARY
============================================================ */
function updateContainer4Summary() {
  const pkgName   = localStorage.getItem(SS_KEYS.pkgName)      || "—";
  const pkgDesc   = localStorage.getItem(SS_KEYS.pkgDesc)      || "—";
  const pkgGuests = localStorage.getItem(SS_KEYS.pkgMaxGuests) || "—";
  const pkgPrice  = Number(localStorage.getItem(SS_KEYS.pkgPrice) || 0);

  setAll('[data-summary="packageName"]',   pkgName);
  setAll('[data-summary="packageDesc"]',   pkgDesc);
  setAll('[data-summary="packageGuests"]', pkgGuests);
  setAll('[data-summary="packagePrice"]',  `$${pkgPrice.toFixed(2)}`);

  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]")
    .filter(a => a.name !== "Travel Fee");

  const findAddon = (matchFn) => {
    const item = addons.find(matchFn);
    return item ? Number(item.price || 0) : 0;
  };

  const extraHours = findAddon(a => a.name.toLowerCase().includes("extra hour"));
  const champagne  = findAddon(a => a.name.toLowerCase().includes("champagne"));
  const cocktail   = findAddon(a => a.name.toLowerCase().includes("cocktail creation"));
  const mocktail   = findAddon(a => a.name.toLowerCase().includes("mocktail"));
  const garnish    = findAddon(a => a.name.toLowerCase().includes("garnish"));
  const customMenu = findAddon(a => a.name.toLowerCase().includes("drink menu"));

  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);

  // Hyphen selectors (Box 5 / container3 style)
  setAll('[data-summary="extra-hours"]',              `$${extraHours.toFixed(2)}`);
  setAll('[data-summary="champagne-toast-price"]',    `$${champagne.toFixed(2)}`);
  setAll('[data-summary="cocktail-creation-price"]',  `$${cocktail.toFixed(2)}`);
  setAll('[data-summary="mocktail-bar-price"]',       `$${mocktail.toFixed(2)}`);
  setAll('[data-summary="garnish-station-price"]',    `$${garnish.toFixed(2)}`);
  setAll('[data-summary="custom-menu-design-price"]', `$${customMenu.toFixed(2)}`);

  // camelCase selectors (container4 style)
  setAll('[data-summary="addon-extraHours"]',       `$${extraHours.toFixed(2)}`);
  setAll('[data-summary="addon-champagneToast"]',   `$${champagne.toFixed(2)}`);
  setAll('[data-summary="addon-cocktailCreation"]', `$${cocktail.toFixed(2)}`);
  setAll('[data-summary="addon-mocktailBar"]',      `$${mocktail.toFixed(2)}`);
  setAll('[data-summary="addon-garnishStation"]',   `$${garnish.toFixed(2)}`);
  setAll('[data-summary="addon-customMenu"]',       `$${customMenu.toFixed(2)}`);

  setAll('[data-summary="addons-total"]', `$${addonsTotal.toFixed(2)}`);

  // Travel — travelZone falls back to travelSummary, then ss_travel_city
  const travelMiles  = localStorage.getItem(SS_KEYS.travelMiles)  || "—";
  const travelReason = localStorage.getItem(SS_KEYS.travelReason) || "—";
  const travelFee    = Number(localStorage.getItem(SS_KEYS.travelFee) || 0);
  const travelZone   = localStorage.getItem(SS_KEYS.travelZone)
                    || localStorage.getItem(SS_KEYS.travelSummary)
                    || localStorage.getItem("ss_travel_city")
                    || "—";

  setAll('[data-summary="travel-miles"]',  travelMiles);
  setAll('[data-summary="travel-zone"]',   travelZone);
  setAll('[data-summary="travel-reason"]', travelReason);
  setAll('[data-summary="travel-fee"]',    `$${travelFee.toFixed(2)}`);

  // Also write to data-ss-travel selectors used in container3
  setAll('[data-ss-travel="fee"]',     `$${travelFee.toFixed(2)}`);
  setAll('[data-ss-travel="miles"]',   travelMiles);
  setAll('[data-ss-travel="reason"]',  travelReason);
  setAll('[data-ss-travel="summary"]', travelZone);

  // Event Details
  const eventDate     = localStorage.getItem(SS_KEYS.eventDate)     || "—";
  const eventTime     = localStorage.getItem(SS_KEYS.eventTime)     || "—";
  const eventDuration = localStorage.getItem(SS_KEYS.eventDuration) || "—";
  const eventEndTime  = localStorage.getItem(SS_KEYS.eventEndTime)  || "—";
  const eventAddress  = localStorage.getItem(SS_KEYS.eventAddress)  || "—";
  const eventZip      = localStorage.getItem(SS_KEYS.eventZip)      || "—";

  setAll('[data-summary="event-date"]',     eventDate);
  setAll('[data-summary="event-time"]',     eventTime);
  setAll('[data-summary="event-duration"]', eventDuration);
  setAll('[data-summary="event-endTime"]',  eventEndTime);
  setAll('[data-summary="event-address"]',  eventAddress);
  setAll('[data-summary="event-zip"]',      eventZip);

  // Contact Info
  setAll('[data-summary="contact-name"]',  localStorage.getItem(SS_KEYS.contactName)  || "—");
  setAll('[data-summary="contact-email"]', localStorage.getItem(SS_KEYS.contactEmail) || "—");
  setAll('[data-summary="contact-phone"]', localStorage.getItem(SS_KEYS.contactPhone) || "—");
  setAll('[data-summary="contact-notes"]', localStorage.getItem(SS_KEYS.contactNotes) || "—");

  const grandTotal = pkgPrice + addonsTotal + travelFee;
  setAll('[data-summary="grand-total"]', `$${grandTotal.toFixed(2)}`);
}

/* ============================================================
   EVENT TIME CALCULATION
============================================================ */
function calculateEventEndTime() {
  const startTime = localStorage.getItem(SS_KEYS.eventTime);
  let extraHours  = Number(localStorage.getItem(SS_KEYS.extraHours) || 0);
  if (extraHours > 4) extraHours = 4;

  const baseHours  = 3;
  const totalHours = baseHours + extraHours;

  if (!startTime || startTime === "—") return "—";

  const parts    = startTime.trim().split(" ");
  const timePart = parts[0];
  const modifier = parts[1] || "AM";
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const startDate = new Date();
  startDate.setHours(hours, minutes || 0, 0, 0);
  startDate.setHours(startDate.getHours() + totalHours);

  let endHours     = startDate.getHours();
  const endMinutes = startDate.getMinutes().toString().padStart(2, "0");
  const endMod     = endHours >= 12 ? "PM" : "AM";
  endHours = endHours % 12 || 12;

  return `${endHours}:${endMinutes} ${endMod}`;
}

/* ============================================================
   EXTRA HOURS + EVENT TIME/DATE HANDLERS
============================================================ */
function onExtraHoursSelected(hours) {
  if (hours > 4) hours = 4;
  localStorage.setItem(SS_KEYS.extraHours, hours);
  const endTime  = calculateEventEndTime();
  localStorage.setItem(SS_KEYS.eventEndTime, endTime);
  const duration = 3 + Number(hours);
  localStorage.setItem(SS_KEYS.eventDuration, `${duration} hrs`);
  _updateDurationDisplay();
  updateStep3Summary();
  updateContainer4Summary();
}

function onEventTimeSelected(time) {
  localStorage.setItem(SS_KEYS.eventTime, time);
  const endTime = calculateEventEndTime();
  localStorage.setItem(SS_KEYS.eventEndTime, endTime);
  updateStep3Summary();
  updateContainer4Summary();
}

function onEventDateSelected(date) {
  localStorage.setItem(SS_KEYS.eventDate, date);
  updateStep3Summary();
  updateContainer4Summary();
}

/* ============================================================
   FL DATE PICKER
   HTML elements: #bsFlDateField (trigger), #bsCalDropdown,
   #ssCalMonth, #ssCalGrid, #bsFlDatePlaceholder
============================================================ */
function bsToggleCal() {
  const dropdown = document.getElementById("bsCalDropdown");
  if (!dropdown) return;
  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    dropdown.style.display = "block";
    ssRenderCal();
  } else {
    dropdown.style.display = "none";
  }
}

function ssCalPrev() {
  _ssCalMonth--;
  if (_ssCalMonth < 0) { _ssCalMonth = 11; _ssCalYear--; }
  ssRenderCal();
}

function ssCalNext() {
  _ssCalMonth++;
  if (_ssCalMonth > 11) { _ssCalMonth = 0; _ssCalYear++; }
  ssRenderCal();
}

function ssRenderCal() {
  const monthEl = document.getElementById("ssCalMonth");
  const gridEl  = document.getElementById("ssCalGrid");
  if (!monthEl || !gridEl) return;

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  monthEl.textContent = `${monthNames[_ssCalMonth]} ${_ssCalYear}`;
  gridEl.innerHTML = "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(_ssCalYear, _ssCalMonth, 1).getDay();
  const daysInMo = new Date(_ssCalYear, _ssCalMonth + 1, 0).getDate();

  // Blank cells before the 1st
  for (let i = 0; i < firstDay; i++) {
    gridEl.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMo; d++) {
    const cellDate = new Date(_ssCalYear, _ssCalMonth, d);
    cellDate.setHours(0, 0, 0, 0);

    const isPast     = cellDate < today;
    const isToday    = cellDate.getTime() === today.getTime();
    const isBlocked  = _ssIsBlockedDay(cellDate);
    const isBooked   = !isBlocked && !isPast && _ssIsBookedDate(cellDate);  // v16
    const isLimited  = !isBlocked && !isBooked && _ssIsLimitedDay(cellDate);
    const dateStr    = cellDate.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    const isSelected = (_ssSelectedDate === dateStr);

    const cell = document.createElement("div");
    cell.style.cssText = [
      "font-family:'Inter',sans-serif",
      "font-size:0.78rem",
      "font-weight:500",
      "padding:3px 2px 2px",
      "border-radius:6px",
      "text-align:center",
      "cursor:pointer",
      "transition:background .15s",
      "line-height:1.2"
    ].join(";");

    // Build inner content — booked dates get a 'Booked' sub-label; Thu/Fri get '6PM+'
    if (isBooked) {
      cell.innerHTML =
        `<span style="display:block;">${d}</span>` +
        `<span style="display:block;font-size:0.55rem;font-weight:700;` +
        `letter-spacing:0.04em;margin-top:1px;text-transform:uppercase;">Booked</span>`;
    } else if (isLimited && !isPast && !isBlocked) {
      cell.innerHTML =
        `<span style="display:block;">${d}</span>` +
        `<span style="display:block;font-size:0.58rem;font-weight:700;` +
        `letter-spacing:0.02em;margin-top:1px;">6PM+</span>`;
    } else {
      cell.textContent = d;
    }

    // ── Style priority: booked > blocked/past > selected > today > limited > normal ──
    if (isBooked) {
      // Confirmed booked — deep charcoal, "Booked" badge, not clickable
      cell.style.background = "#2C2020";
      cell.style.color      = "#E5D5D5";
      cell.style.cursor     = "not-allowed";
      cell.style.border     = "1px solid #1A1212";
      cell.title            = "This date is already booked";

    } else if (isPast || isBlocked) {
      // Greyed out — same style as past dates, not clickable
      cell.style.background = "#F3F4F6";
      cell.style.color      = "#D1D5DB";
      cell.style.cursor     = "default";
      cell.style.border     = "1px solid #D1D5DB";

    } else if (isSelected) {
      cell.style.background = "#722F37";
      cell.style.color      = "#fff";
      cell.style.border     = "1px solid #722F37";
      cell.addEventListener("click", () => ssSelectDate(dateStr));

    } else if (isToday) {
      cell.style.background = "#F5E9EA";
      cell.style.color      = isLimited ? "#92400E" : "#722F37";
      cell.style.border     = "1px solid #722F37";
      cell.addEventListener("click", () => ssSelectDate(dateStr));

    } else if (isLimited) {
      // Thursday / Friday — warm amber tint + 6PM+ badge, clickable
      cell.style.background = "#FFF7ED";
      cell.style.color      = "#92400E";
      cell.style.border     = "1px solid #FCD34D";
      cell.addEventListener("mouseenter", () => {
        cell.style.background  = "#FEF3C7";
        cell.style.borderColor = "#F59E0B";
      });
      cell.addEventListener("mouseleave", () => {
        cell.style.background  = "#FFF7ED";
        cell.style.borderColor = "#FCD34D";
      });
      cell.addEventListener("click", () => ssSelectDate(dateStr));

    } else {
      // Saturday / Sunday — fully available
      cell.style.background = "#fff";
      cell.style.color      = "#2C2020";
      cell.style.border     = "1px solid #EDE4E4";
      cell.addEventListener("mouseenter", () => {
        cell.style.background  = "#F5E9EA";
        cell.style.borderColor = "#722F37";
      });
      cell.addEventListener("mouseleave", () => {
        cell.style.background  = "#fff";
        cell.style.borderColor = "#EDE4E4";
      });
      cell.addEventListener("click", () => ssSelectDate(dateStr));
    }

    gridEl.appendChild(cell);
  }
}

function ssSelectDate(dateString) {
  _ssSelectedDate = dateString;
  localStorage.setItem(SS_KEYS.eventDate, dateString);

  const ph = document.getElementById("bsFlDatePlaceholder");
  if (ph) {
    ph.textContent      = dateString;
    ph.style.color      = "#2C2020";
    ph.style.fontWeight = "600";
  }

  // Set / clear the 6PM minimum on the native time input
  const isThuOrFri = dateString.startsWith("Thursday") || dateString.startsWith("Friday");
  const timeInput  = document.getElementById("ssTimeInput");
  if (timeInput) {
    timeInput.min = isThuOrFri ? "18:00" : "";
    // If a saved time is earlier than 6PM on a Thu/Fri, clear it
    if (isThuOrFri && timeInput.value) {
      const [hh, mm] = timeInput.value.split(":").map(Number);
      if (hh * 60 + (mm || 0) < 18 * 60) {
        timeInput.value = "";
        localStorage.removeItem(SS_KEYS.eventTime);
        localStorage.removeItem(SS_KEYS.eventEndTime);
        const timePh = document.getElementById("bsFlTimePlaceholder");
        if (timePh) {
          timePh.textContent      = "Select a time";
          timePh.style.color      = "";
          timePh.style.fontWeight = "";
        }
      }
    }
  }

  ssRenderCal();

  const dropdown = document.getElementById("bsCalDropdown");
  if (dropdown) dropdown.style.display = "none";

  updateStep3Summary();
  updateContainer4Summary();
}

/* ============================================================
   FL TIME PICKER
   HTML elements: #bsFlTimeField (trigger), #bsTimeDropdown,
   #ssTimeInput, #bsFlTimePlaceholder,
   #ssDurName, #ssDurText, #ssDurEnd
============================================================ */
function bsToggleTime() {
  const dropdown = document.getElementById("bsTimeDropdown");
  if (!dropdown) return;

  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    dropdown.style.display = "block";
    _updateDurationDisplay();

    // Pre-fill the native time input if a time is already saved
    const savedTime = localStorage.getItem(SS_KEYS.eventTime);
    if (savedTime && savedTime !== "—") {
      const input = document.getElementById("ssTimeInput");
      if (input && !input.value) {
        const [tPart, mod] = savedTime.trim().split(" ");
        let [h, m] = tPart.split(":").map(Number);
        if (mod === "PM" && h !== 12) h += 12;
        if (mod === "AM" && h === 12) h = 0;
        input.value = `${String(h).padStart(2,"0")}:${String(m || 0).padStart(2,"0")}`;
      }
    }
  } else {
    dropdown.style.display = "none";
  }
}

// Called by <input type="time" oninput="ssOnTime(this.value)">
// value is "HH:MM" (24-hr) — converts to "h:MM AM/PM" before storing
function ssOnTime(timeStr24) {
  if (!timeStr24) return;

  // Enforce 6:00 PM minimum on Thursday and Friday bookings
  const savedDate  = localStorage.getItem(SS_KEYS.eventDate) || "";
  const isThuOrFri = savedDate.startsWith("Thursday") || savedDate.startsWith("Friday");
  if (isThuOrFri) {
    const [hh, mm] = timeStr24.split(":").map(Number);
    if (hh * 60 + (mm || 0) < 18 * 60) {
      // Reset input to 18:00 and warn the user
      const input = document.getElementById("ssTimeInput");
      if (input) input.value = "18:00";
      alert("\u23F0 Service on Thursday and Friday begins at 6:00 PM. Please select 6:00 PM or later.");
      return;
    }
  }

  const time12 = convertTo12Hr(timeStr24);

  const ph = document.getElementById("bsFlTimePlaceholder");
  if (ph) {
    ph.textContent      = time12;
    ph.style.color      = "#2C2020";
    ph.style.fontWeight = "600";
  }

  localStorage.setItem(SS_KEYS.eventTime, time12);

  const endTime = calculateEventEndTime();
  localStorage.setItem(SS_KEYS.eventEndTime, endTime);

  _updateDurationDisplay();
  updateStep3Summary();
  updateContainer4Summary();
}

// Internal helper — refreshes #ssDurName, #ssDurText, #ssDurEnd
function _updateDurationDisplay() {
  const pkgName  = localStorage.getItem(SS_KEYS.pkgName)     || "Your Package";
  const extraHrs = Number(localStorage.getItem(SS_KEYS.extraHours) || 0);
  const totalHrs = 3 + extraHrs;
  const endTime  = calculateEventEndTime();

  const durName = document.getElementById("ssDurName");
  const durText = document.getElementById("ssDurText");
  const durEnd  = document.getElementById("ssDurEnd");

  if (durName) durName.textContent = pkgName;
  if (durText) durText.innerHTML   = `Service runs approximately <strong>${totalHrs} hour${totalHrs !== 1 ? "s" : ""}</strong> from your start time.`;
  if (durEnd) {
    durEnd.textContent = (endTime && endTime !== "—")
      ? `Estimated end time: ${endTime}`
      : "";
  }
}

/* ============================================================
   SYNC EVENT DETAILS  (address + zip)
   Called by:
     - #eventAddress / #eventLocation  addEventListener "input"
     - #eventZip  oninput="formatZip(this); syncEventDetails()"
     - bsBlurField() onblur

   IMPORTANT: writes ONLY to address/zip selectors.
   Does NOT call updateStep3Summary() or updateContainer4Summary()
   because those full-refresh functions read every localStorage key
   and write "—" to any field not yet populated — wiping contact
   info, date, time, travel fields already displayed on screen.
============================================================ */
function syncEventDetails() {
  const address = (
    document.getElementById("eventAddress")?.value ||
    document.getElementById("eventLocation")?.value ||
    ""
  );
  const zip = document.getElementById("eventZip")?.value || "";

  localStorage.setItem(SS_KEYS.eventAddress, address);
  localStorage.setItem(SS_KEYS.eventZip,     zip);

  // Targeted writes — only address and zip selectors touched
  setAll('[data-summary="event-address"]', address || "—");
  setAll('[data-summary="event-zip"]',     zip     || "—");
}

/* ============================================================
   FORMAT ZIP
   Called by <input oninput="formatZip(this)">
   Strips non-digits, limits to 5 characters.
============================================================ */
function formatZip(input) {
  input.value = input.value.replace(/\D/g, "").slice(0, 5);
}

/* ============================================================
   USE LOCATION  (travel + event address override)
============================================================ */
function useThisLocation() {
  const loc = (
    document.getElementById("eventAddress")?.value ||
    document.getElementById("eventLocation")?.value ||
    ""
  );
  localStorage.setItem(SS_KEYS.travelSummary, loc);
  localStorage.setItem(SS_KEYS.eventAddress,  loc);
  setAll('[data-ss-travel="summary"]', loc);
  updateStep3Summary();
  updateContainer4Summary();
}

/* ============================================================
   USE MY LOCATION  (geolocation — called from HTML button)
============================================================ */
function useMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser. Please enter your address manually.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(4);
      const lng = pos.coords.longitude.toFixed(4);
      const locationField = (
        document.getElementById("eventAddress") ||
        document.getElementById("eventLocation")
      );
      if (locationField) {
        locationField.value = `${lat}, ${lng}`;
        syncEventDetails();
      }
    },
    () => {
      alert("Unable to retrieve your location. Please enter your address manually.");
    }
  );
}

/* ============================================================
   EMAIL SUMMARY
   Called from the Email Summary button in container4
============================================================ */
function bkEmailSummary() {
  const pkg      = localStorage.getItem(SS_KEYS.pkgName)    || "—";
  const date     = localStorage.getItem(SS_KEYS.eventDate)  || "—";
  const time     = localStorage.getItem(SS_KEYS.eventTime)  || "—";
  const address  = localStorage.getItem(SS_KEYS.eventAddress)|| "—";
  const grand    = Number(localStorage.getItem(SS_KEYS.grandTotal) || 0);
  const contact  = localStorage.getItem(SS_KEYS.contactName) || "—";

  const subject = encodeURIComponent("SipSavvy Booking Summary");
  const body    = encodeURIComponent(
    "SipSavvy Booking Summary\n" +
    "================================\n\n" +
    `Package:     ${pkg}\n` +
    `Event Date:  ${date}\n` +
    `Start Time:  ${time}\n` +
    `Address:     ${address}\n\n` +
    `Contact:     ${contact}\n\n` +
    `Grand Total: $${grand.toFixed(2)}\n\n` +
    "Thank you for booking with SipSavvy!"
  );

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

/* ============================================================
   RESET FUNCTIONS
============================================================ */
function resetBox5() {
  Object.values(SS_KEYS).forEach(k => localStorage.removeItem(k));
  ["ss_travel_fee","ss_travel_miles","ss_travel_reason","ss_travel_region",
   "ss_travel_county","ss_travel_city","ss_travel_summary","ss_travel_zone"]
    .forEach(k => localStorage.removeItem(k));
  location.reload();
}

function resetBookingPage() {
  Object.values(SS_KEYS).forEach(k => localStorage.removeItem(k));
  ["ss_travel_fee","ss_travel_miles","ss_travel_reason","ss_travel_region",
   "ss_travel_county","ss_travel_city","ss_travel_summary","ss_travel_zone"]
    .forEach(k => localStorage.removeItem(k));
  location.reload();
}

/* ============================================================
   PRINT SUMMARY
   Called by onclick="bkPrint()" on the Print Summary button.
   Opens a styled print window with the full booking summary
   pulled from localStorage. Does NOT modify any existing fields.
============================================================ */
function bkPrint() {
  // ── Read all data from localStorage ──
  const pkgName     = localStorage.getItem(SS_KEYS.pkgName)      || "—";
  const pkgDesc     = localStorage.getItem(SS_KEYS.pkgDesc)      || "—";
  const pkgGuests   = localStorage.getItem(SS_KEYS.pkgMaxGuests) || "—";
  const pkgPrice    = Number(localStorage.getItem(SS_KEYS.pkgPrice)    || 0);
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);
  const grandTotal  = Number(localStorage.getItem(SS_KEYS.grandTotal)  || 0);

  const eventDate     = localStorage.getItem(SS_KEYS.eventDate)     || "—";
  const eventTime     = localStorage.getItem(SS_KEYS.eventTime)     || "—";
  const eventDuration = localStorage.getItem(SS_KEYS.eventDuration) || "3 hrs";
  const eventEndTime  = localStorage.getItem(SS_KEYS.eventEndTime)  || "—";
  const eventAddress  = localStorage.getItem(SS_KEYS.eventAddress)  || "—";
  const eventZip      = localStorage.getItem(SS_KEYS.eventZip)      || "—";

  const contactName  = localStorage.getItem(SS_KEYS.contactName)  || "—";
  const contactEmail = localStorage.getItem(SS_KEYS.contactEmail) || "—";
  const contactPhone = localStorage.getItem(SS_KEYS.contactPhone) || "—";
  const contactNotes = localStorage.getItem(SS_KEYS.contactNotes) || "—";

  const travelFee    = Number(localStorage.getItem(SS_KEYS.travelFee) || 0);
  const travelMiles  = localStorage.getItem(SS_KEYS.travelMiles)  || "—";
  const travelReason = localStorage.getItem(SS_KEYS.travelReason) || "—";
  const travelZone   = localStorage.getItem(SS_KEYS.travelZone)
                    || localStorage.getItem(SS_KEYS.travelSummary)
                    || "—";

  // ── Build add-ons rows ──
  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]")
    .filter(a => a.name !== "Travel Fee");

  const addonsHTML = addons.length
    ? addons.map(a =>
        `<tr>
          <td style="padding:6px 0;color:#4A3A3A;">${a.name}</td>
          <td style="padding:6px 0;text-align:right;color:#541E25;font-weight:600;">$${Number(a.price||0).toFixed(2)}</td>
        </tr>`
      ).join("")
    : `<tr><td colspan="2" style="padding:6px 0;color:#9CA3AF;font-style:italic;">No add-ons selected</td></tr>`;

  // ── Build the print window HTML ──
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SipSavvy Booking Summary</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Georgia', serif;
      background: #fff;
      color: #2C2020;
      padding: 40px 48px;
      max-width: 720px;
      margin: 0 auto;
    }
    .ss-logo {
      font-family: 'Georgia', serif;
      font-size: 2rem;
      font-weight: 700;
      color: #722F37;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
    }
    .ss-tagline {
      font-family: Arial, sans-serif;
      font-size: 0.72rem;
      color: #7A6A6A;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 28px;
    }
    h2 {
      font-family: Arial, sans-serif;
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #722F37;
      margin: 24px 0 10px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #EDE4E4;
    }
    table { width: 100%; border-collapse: collapse; }
    td {
      font-family: Arial, sans-serif;
      font-size: 0.84rem;
      vertical-align: top;
    }
    td.label {
      color: #7A6A6A;
      width: 38%;
      padding: 5px 0;
    }
    td.value {
      color: #2C2020;
      font-weight: 600;
      padding: 5px 0;
    }
    .divider {
      border: none;
      border-top: 1px solid #EDE4E4;
      margin: 20px 0;
    }
    .grand-total-row {
      margin-top: 20px;
      padding: 14px 18px;
      background: #722F37;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .grand-total-row .gt-label {
      font-family: Arial, sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #F5E9EA;
    }
    .grand-total-row .gt-amount {
      font-family: 'Georgia', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: #fff;
    }
    .footer {
      margin-top: 36px;
      font-family: Arial, sans-serif;
      font-size: 0.7rem;
      color: #9CA3AF;
      text-align: center;
      border-top: 1px solid #EDE4E4;
      padding-top: 16px;
    }
    @media print {
      body { padding: 20px 28px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <div class="ss-logo">SipSavvy</div>
  <div class="ss-tagline">Premium Bartending &amp; Mixology Services</div>

  <!-- ── PACKAGE ── -->
  <h2>Package</h2>
  <table>
    <tr>
      <td class="label">Package</td>
      <td class="value">${pkgName}</td>
    </tr>
    <tr>
      <td class="label">Description</td>
      <td class="value" style="font-weight:400;">${pkgDesc}</td>
    </tr>
    <tr>
      <td class="label">Max Guests</td>
      <td class="value">${pkgGuests}</td>
    </tr>
    <tr>
      <td class="label">Package Price</td>
      <td class="value">$${pkgPrice.toFixed(2)}</td>
    </tr>
  </table>

  <!-- ── ADD-ONS ── -->
  <h2>Add-Ons</h2>
  <table>
    ${addonsHTML}
    <tr style="border-top:1px solid #EDE4E4;">
      <td style="padding:8px 0;color:#7A6A6A;font-family:Arial,sans-serif;font-size:0.84rem;">Add-Ons Subtotal</td>
      <td style="padding:8px 0;text-align:right;font-family:Arial,sans-serif;font-size:0.84rem;font-weight:700;color:#2C2020;">$${addonsTotal.toFixed(2)}</td>
    </tr>
  </table>

  <!-- ── TRAVEL ── -->
  <h2>Travel</h2>
  <table>
    <tr>
      <td class="label">Location / Zone</td>
      <td class="value">${travelZone}</td>
    </tr>
    <tr>
      <td class="label">Travel Reason</td>
      <td class="value" style="font-weight:400;">${travelReason}</td>
    </tr>
    <tr>
      <td class="label">Miles</td>
      <td class="value">${travelMiles}</td>
    </tr>
    <tr>
      <td class="label">Travel Fee</td>
      <td class="value">$${travelFee.toFixed(2)}</td>
    </tr>
  </table>

  <!-- ── EVENT DETAILS ── -->
  <h2>Event Details</h2>
  <table>
    <tr>
      <td class="label">Event Date</td>
      <td class="value">${eventDate}</td>
    </tr>
    <tr>
      <td class="label">Start Time</td>
      <td class="value">${eventTime}</td>
    </tr>
    <tr>
      <td class="label">Duration</td>
      <td class="value">${eventDuration}</td>
    </tr>
    <tr>
      <td class="label">End Time</td>
      <td class="value">${eventEndTime}</td>
    </tr>
    <tr>
      <td class="label">Address</td>
      <td class="value">${eventAddress}</td>
    </tr>
    <tr>
      <td class="label">Zip Code</td>
      <td class="value">${eventZip}</td>
    </tr>
  </table>

  <!-- ── CONTACT INFO ── -->
  <h2>Contact Information</h2>
  <table>
    <tr>
      <td class="label">Name</td>
      <td class="value">${contactName}</td>
    </tr>
    <tr>
      <td class="label">Email</td>
      <td class="value">${contactEmail}</td>
    </tr>
    <tr>
      <td class="label">Phone</td>
      <td class="value">${contactPhone}</td>
    </tr>
    <tr>
      <td class="label">Note</td>
      <td class="value" style="font-weight:400;">${contactNotes}</td>
    </tr>
  </table>

  <hr class="divider">

  <!-- ── GRAND TOTAL ── -->
  <div class="grand-total-row">
    <span class="gt-label">Grand Total</span>
    <span class="gt-amount">$${grandTotal.toFixed(2)}</span>
  </div>

  <div class="footer">
    SipSavvy &bull; Premium Bartending &amp; Mixology &bull; Booking Summary
    <br>Printed ${new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
  </div>

  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

  // ── Open the print window ──
  const win = window.open("", "_blank", "width=780,height=900,scrollbars=yes");
  if (!win) {
    alert("Pop-up blocked. Please allow pop-ups for this site and try again.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

/* ============================================================
   CONFIRM BOOKING — EmailJS AUTO-SEND  (v15)
   Triggered by: <button id="finalConfirmBtn" class="btn-confirm">Confirm Booking</button>
   Sends a styled HTML confirmation email to the guest's address
   using EmailJS (client-side, no backend required).

   SETUP REQUIRED (one-time):
     1. Create a free account at https://www.emailjs.com
     2. Add an Email Service (Gmail, Outlook, etc.) → note your SERVICE_ID
     3. Create an Email Template → note your TEMPLATE_ID
        Template variables used:  {{to_email}}, {{to_name}}, {{booking_summary_html}}
     4. Copy your Public Key from Account → API Keys
     5. Replace the three placeholder strings below with your real IDs
============================================================ */

// ── Replace these three strings with your real EmailJS credentials ──
var EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
var EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz789"
var EMAILJS_PUBLIC_KEY  = "znD5xVfOCbKoPtN_3";   // e.g. "aBcDeFgH1234567"
// Get these from emailjs.com → Account → API Keys. 

//3. EmailJS template must use {{{booking_summary_html}}} (triple braces)
//In your EmailJS template editor, the HTML body variable needs triple curly braces so it renders as HTML — not escaped text:
// {{{booking_summary_html}}}


/* ------------------------------------------------------------------
   bkConfirmBooking()
   Reads all booking data from localStorage, validates the guest
   email, builds an HTML summary, and sends via EmailJS.
------------------------------------------------------------------ */
function bkConfirmBooking() {
  // ── 1. Read all data from localStorage ──
  const pkgName     = localStorage.getItem(SS_KEYS.pkgName)      || "—";
  const pkgDesc     = localStorage.getItem(SS_KEYS.pkgDesc)      || "—";
  const pkgGuests   = localStorage.getItem(SS_KEYS.pkgMaxGuests) || "—";
  const pkgPrice    = Number(localStorage.getItem(SS_KEYS.pkgPrice)    || 0);
  const addonsTotal = Number(localStorage.getItem(SS_KEYS.addonsTotal) || 0);
  const grandTotal  = Number(localStorage.getItem(SS_KEYS.grandTotal)  || 0);

  const eventDate     = localStorage.getItem(SS_KEYS.eventDate)     || "—";
  const eventTime     = localStorage.getItem(SS_KEYS.eventTime)     || "—";
  const eventDuration = localStorage.getItem(SS_KEYS.eventDuration) || "3 hrs";
  const eventEndTime  = localStorage.getItem(SS_KEYS.eventEndTime)  || "—";
  const eventAddress  = localStorage.getItem(SS_KEYS.eventAddress)  || "—";
  const eventZip      = localStorage.getItem(SS_KEYS.eventZip)      || "—";

  const contactName  = localStorage.getItem(SS_KEYS.contactName)  || "—";
  const contactEmail = localStorage.getItem(SS_KEYS.contactEmail) || "";
  const contactPhone = localStorage.getItem(SS_KEYS.contactPhone) || "—";
  const contactNotes = localStorage.getItem(SS_KEYS.contactNotes) || "—";

  const travelFee    = Number(localStorage.getItem(SS_KEYS.travelFee) || 0);
  const travelMiles  = localStorage.getItem(SS_KEYS.travelMiles)  || "—";
  const travelReason = localStorage.getItem(SS_KEYS.travelReason) || "—";
  const travelZone   = localStorage.getItem(SS_KEYS.travelZone)
                    || localStorage.getItem(SS_KEYS.travelSummary)
                    || "—";

  // ── 2. Validate guest email ──
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!contactEmail || !emailRegex.test(contactEmail)) {
    alert("⚠️ No valid guest email found.\nPlease go back to Step 2 and enter a valid email address before confirming.");
    return;
  }

  // ── 3. Build the add-ons rows (HTML table rows) ──
  const addons = JSON.parse(localStorage.getItem(SS_KEYS.addons) || "[]")
    .filter(a => a.name !== "Travel Fee");

  const addonsRowsHTML = addons.length
    ? addons.map(a =>
        `<tr>
          <td style="padding:6px 16px;color:#4A3A3A;font-size:14px;">${a.name}</td>
          <td style="padding:6px 16px;text-align:right;color:#541E25;font-weight:600;font-size:14px;">$${Number(a.price||0).toFixed(2)}</td>
        </tr>`
      ).join("")
    : `<tr><td colspan="2" style="padding:6px 16px;color:#9CA3AF;font-style:italic;font-size:14px;">No add-ons selected</td></tr>`;

  // ── 4. Build the full HTML email body ──
  const bookingYear = new Date().getFullYear();
  const summaryHTML = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0F0;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0F0;padding:32px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(44,32,32,0.10);">

    <!-- HEADER -->
    <tr>
      <td style="background:#722F37;padding:32px 40px 24px;text-align:center;">
        <div style="font-family:Georgia,serif;font-size:32px;font-weight:700;color:#fff;letter-spacing:0.04em;">SipSavvy</div>
        <div style="font-family:Arial,sans-serif;font-size:11px;color:#F5E9EA;letter-spacing:0.18em;text-transform:uppercase;margin-top:6px;">Premium Bartending &amp; Mixology</div>
      </td>
    </tr>

    <!-- INTRO -->
    <tr>
      <td style="padding:32px 40px 8px;">
        <h1 style="font-family:Georgia,serif;font-size:22px;color:#2C2020;margin:0 0 8px;">Booking Request Received 🥂</h1>
        <p style="font-size:15px;color:#4A3A3A;margin:0 0 8px;">Hi ${contactName},</p>
        <p style="font-size:15px;color:#4A3A3A;line-height:1.6;margin:0;">Thank you for booking with SipSavvy! Here is a full summary of your booking request. We will be in touch shortly to confirm your event.</p>
      </td>
    </tr>

    <!-- DIVIDER -->
    <tr><td style="padding:20px 40px 0;"><hr style="border:none;border-top:1px solid #EDE4E4;margin:0;"></td></tr>

    <!-- PACKAGE -->
    <tr>
      <td style="padding:20px 40px 4px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#722F37;margin-bottom:12px;">Package</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;width:38%;">Package</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${pkgName}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Description</td>
            <td style="font-size:14px;color:#2C2020;padding:4px 0;">${pkgDesc}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Max Guests</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${pkgGuests}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Package Price</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">$${pkgPrice.toFixed(2)}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- DIVIDER -->
    <tr><td style="padding:16px 40px 0;"><hr style="border:none;border-top:1px solid #EDE4E4;margin:0;"></td></tr>

    <!-- ADD-ONS -->
    <tr>
      <td style="padding:20px 40px 4px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#722F37;margin-bottom:12px;">Add-Ons</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${addonsRowsHTML}
          <tr style="border-top:1px solid #EDE4E4;">
            <td style="padding:10px 16px 4px;color:#7A6A6A;font-size:14px;">Add-Ons Subtotal</td>
            <td style="padding:10px 16px 4px;text-align:right;font-size:14px;font-weight:700;color:#2C2020;">$${addonsTotal.toFixed(2)}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- DIVIDER -->
    <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #EDE4E4;margin:0;"></td></tr>

    <!-- TRAVEL -->
    <tr>
      <td style="padding:20px 40px 4px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#722F37;margin-bottom:12px;">Travel</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;width:38%;">Location / Zone</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${travelZone}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Travel Detail</td>
            <td style="font-size:14px;color:#2C2020;padding:4px 0;">${travelReason}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Miles</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${travelMiles}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Travel Fee</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">$${travelFee.toFixed(2)}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- DIVIDER -->
    <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #EDE4E4;margin:0;"></td></tr>

    <!-- EVENT DETAILS -->
    <tr>
      <td style="padding:20px 40px 4px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#722F37;margin-bottom:12px;">Event Details</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;width:38%;">Event Date</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${eventDate}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Start Time</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${eventTime}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Duration</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${eventDuration}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">End Time</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${eventEndTime}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Address</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${eventAddress}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Zip Code</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${eventZip}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- DIVIDER -->
    <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #EDE4E4;margin:0;"></td></tr>

    <!-- CONTACT INFO -->
    <tr>
      <td style="padding:20px 40px 4px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#722F37;margin-bottom:12px;">Contact Information</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;width:38%;">Name</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${contactName}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Email</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${contactEmail}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Phone</td>
            <td style="font-size:14px;color:#2C2020;font-weight:600;padding:4px 0;">${contactPhone}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:#7A6A6A;padding:4px 0;">Notes</td>
            <td style="font-size:14px;color:#2C2020;padding:4px 0;">${contactNotes}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- GRAND TOTAL BANNER -->
    <tr>
      <td style="padding:24px 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#722F37;border-radius:12px;">
          <tr>
            <td style="padding:16px 24px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#F5E9EA;">Grand Total</td>
            <td style="padding:16px 24px;text-align:right;font-family:Georgia,serif;font-size:26px;font-weight:700;color:#fff;">$${grandTotal.toFixed(2)}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER NOTE -->
    <tr>
      <td style="background:#FDF8F8;padding:20px 40px;border-top:1px solid #EDE4E4;">
        <p style="font-size:13px;color:#7A6A6A;margin:0;line-height:1.6;text-align:center;">
          This is a booking <strong>request</strong> — not a confirmed reservation.<br>
          A SipSavvy representative will contact you within 24–48 hours to finalize your event.
        </p>
      </td>
    </tr>

    <!-- LEGAL FOOTER -->
    <tr>
      <td style="background:#F5F0F0;padding:16px 40px;border-radius:0 0 16px 16px;text-align:center;">
        <p style="font-size:11px;color:#9CA3AF;margin:0;">
          © ${bookingYear} SipSavvy · Premium Bartending &amp; Mixology Services<br>
          Waldorf, MD · info@sipsavvy.com
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  // ── 5. Disable the button and show a sending state ──
  const btn = document.getElementById("finalConfirmBtn");
  const originalText = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled     = true;
    btn.textContent  = "Sending…";
    btn.style.opacity = "0.7";
    btn.style.cursor  = "not-allowed";
  }

  // ── 6. Guard: make sure the EmailJS SDK was actually loaded ──
  if (typeof emailjs === "undefined") {
    if (btn) {
      btn.disabled      = false;
      btn.textContent   = originalText;
      btn.style.opacity = "1";
      btn.style.cursor  = "pointer";
    }
    alert(
      "⚠️ EmailJS SDK not loaded.\n\n" +
      "Add this script tag to booking.html BEFORE booking.js:\n\n" +
      "<script src=\"https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js\"><\/script>"
    );
    return;
  }

  // ── 7. Send via EmailJS v4 (init() already called in DOMContentLoaded) ──
  emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email:              contactEmail,
      to_name:               contactName,
      pkg_name:              pkgName,
      event_date:            eventDate,
      event_time:            eventTime,
      event_address:         eventAddress,
      grand_total:           `$${grandTotal.toFixed(2)}`,
      booking_summary_html:  summaryHTML   // ← full HTML goes into {{booking_summary_html}}
    }
    // NOTE: In EmailJS v4, the public key is passed to emailjs.init() — NOT here.
    // Passing it as a 4th arg to .send() is a v3 pattern and will cause a TypeError in v4.
  )
  .then(() => {
    // ── SUCCESS ──
    if (btn) {
      btn.textContent   = "✓ Confirmed!";
      btn.style.background  = "#2D6A4F";
      btn.style.opacity     = "1";
    }

    // ── v16: Save the confirmed date to the booked-dates list ──
    //    This blocks it out on the calendar for future visitors
    //    (same browser/device — localStorage is client-side).
    const confirmedDate = localStorage.getItem(SS_KEYS.eventDate);
    if (confirmedDate) {
      _ssAddBookedDate(confirmedDate);
      // Re-render the calendar immediately if it's open, so the
      // newly booked date turns dark without requiring a page reload.
      const calDropdown = document.getElementById("bsCalDropdown");
      if (calDropdown && calDropdown.style.display !== "none") {
        ssRenderCal();
      }
    }
    // Show a friendly success banner (appended once; guard against duplicates)
    if (!document.getElementById("ss-confirm-success")) {
      const banner = document.createElement("div");
      banner.id = "ss-confirm-success";
      banner.style.cssText = [
        "margin-top:16px",
        "padding:14px 20px",
        "background:#D1FAE5",
        "border:1.5px solid #6EE7B7",
        "border-radius:10px",
        "font-family:'Inter',sans-serif",
        "font-size:0.84rem",
        "color:#065F46",
        "line-height:1.5",
        "text-align:center"
      ].join(";");
      banner.innerHTML =
        `<strong>🥂 Booking request sent!</strong><br>` +
        `A confirmation email has been delivered to <strong>${contactEmail}</strong>.<br>` +
        `We'll be in touch within 24–48 hours to finalize your event.`;
      btn?.parentElement?.insertAdjacentElement("afterend", banner);
    }
  })
  .catch((err) => {
    // ── ERROR ──
    console.error("EmailJS send failed:", err);
    if (btn) {
      btn.disabled     = false;
      btn.textContent  = originalText;
      btn.style.opacity = "1";
      btn.style.cursor  = "pointer";
    }
    alert(
      "⚠️ The confirmation email could not be sent.\n\n" +
      "Please check your EmailJS credentials (Service ID, Template ID, Public Key) " +
      "and make sure the template variable {{booking_summary_html}} is included.\n\n" +
      "Error: " + (err.text || err.message || JSON.stringify(err))
    );
  });
}

import { buildBookingObject, saveBookingToFirestore } from "./firestore-booking.js";

async function submitBooking() {
  const state = getBookingState(); // your existing booking.js state
  const bookingObject = buildBookingObject(state);

  const bookingId = await saveBookingToFirestore(bookingObject);

  alert("Booking submitted! Confirmation ID: " + bookingId);
}

