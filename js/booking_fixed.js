function setAddon(key, value) {
  saveBookingState({ [key]: Number(value) || 0 });
  syncAllPrices();
}

/* ============================================================
   BOOKING STATE HELPERS
============================================================ */

function getBookingState() {
  try {
    const raw = localStorage.getItem("ss-booking");
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    console.warn("⚠️ Corrupted booking state, resetting.", e);
    return {};
  }
}


function saveBookingState(updates) {
  try {
    // Always start with the current state
    const current = getBookingState();

    // Merge new updates into the existing state
    const next = { ...current, ...updates };

    // Persist to localStorage
    localStorage.setItem("ss-booking", JSON.stringify(next));

    return next;
  } catch (e) {
    console.error("❌ saveBookingState failed:", e);
    return getBookingState();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  syncAllPrices();
});



/* ============================================================
   STEP 1 — PACKAGE SELECTION
============================================================ */

function selectPackagex(name, guests, price, description) {
  const state = saveBookingState({
    package: { name, guests, price, description }
  });

  updatePackageSelectionUI(name);
  syncAllPrices();
  updateDurationPackageName(name);

  const bsName = document.getElementById("bsSummaryName");
  const bsGuests = document.getElementById("bsSummaryGuests");
  const bsPkgPrice = document.getElementById("bsSummaryPkgPrice");
  if (bsName) bsName.textContent = name || "—";
  if (bsGuests) bsGuests.textContent = guests || "";
  if (bsPkgPrice) bsPkgPrice.textContent = `$${price || 0}`;

  syncAllPrices();
}

function updatePackageSelectionUI(selectedName) {
  document.querySelectorAll(".experience-option").forEach(box => {
    const name = box.getAttribute("data-name");
    if (name === selectedName) {
      box.classList.add("is-selected");
    } else {
      box.classList.remove("is-selected");
    }
    syncAllPrices();
  });
}

function updateBookingSummaryPackage(name, guests, price, description) {
  const nameEl = document.getElementById("sumPackageName");
  const priceEl = document.getElementById("sumPackagePrice");
  const guestsEl = document.getElementById("bsSummaryGuests");
  const pkgNameEl = document.getElementById("bsSummaryName");
  const pkgPriceEl = document.getElementById("bsSummaryPkgPrice");

  if (nameEl) nameEl.textContent = name || "—";
  if (priceEl) priceEl.textContent = price ? `$${price}` : "$0.00";

  if (pkgNameEl) pkgNameEl.textContent = name || "—";
  if (guestsEl) guestsEl.textContent = guests || "";
  if (pkgPriceEl) pkgPriceEl.textContent = `$${price || 0}`;
  syncAllPrices();
}

function updateDurationPackageName(name) {
  const durName = document.getElementById("ssDurName");
  if (durName) durName.textContent = name || "";
  syncAllPrices();
}

/* ============================================================
   ADD‑ONS — EXTRA HOURS, CHAMPAGNE, TRAVEL
============================================================ */

function pickExtraHours(price) {
  saveBookingState({ extraHours: price });
  updateEventEndTime();
  syncAllPrices();
}

function pickChampagne(price) {
  saveBookingState({ champagnePrice: price });
  syncAllPrices();
}



/* BOX 4 SUBTOTAL (Add-ons total line under checkboxes) */
function updateBox4Addons() {
  const state = getBookingState();

  const extra = Number(state.extraHours || 0);
  const champ = Number(state.champagnePrice || 0);
  const travel = Number(state.travelFee || 0);

  const total = extra + champ + travel;

  const el = document.getElementById("bk_addon_amt");
  if (el) el.textContent = `$${total}`;
  syncAllPrices();
}


/* BOX 5 SUMMARY (Step 1 “Your Package” box) */
function updateBox5Summary() {
  const state = getBookingState();

  const pkg = state.package || { name: "—", price: 0 };
  const extra = Number(state.extraHours || 0);
  const champ = Number(state.champagnePrice || 0);
  const travel = Number(state.travelFee || 0);

  document.getElementById("sumExtraHours").textContent = `$${extra}`;
  document.getElementById("sumChampagne").textContent = `$${champ}`;
  document.getElementById("sumTravelFee").textContent = `$${travel}`;
  document.getElementById("sumPackageName").textContent = pkg.name;
  document.getElementById("sumPackagePrice").textContent = `$${pkg.price}`;
  syncAllPrices();
}



/* GRAND TOTAL (Step 1 box 5 + mirror to Step 2 if present) */
function updateGrandTotal() {
  const state = getBookingState();

  const pkg = state.package?.price || 0;
  const extra = state.extraHours || 0;
  const champ = state.champagnePrice || 0;
  const travel = state.travelFee || 0;

  const total = pkg + extra + champ + travel;

  const totalEl = document.getElementById("sumGrandTotal");
  if (totalEl) totalEl.textContent = `$${total}`;

  const bsTotal = document.getElementById("bsSummaryTotal");
  if (bsTotal) bsTotal.textContent = `$${total}`;
  syncAllPrices();
}

function activatePill(btn, groupSelector) {
  document.querySelectorAll(groupSelector).forEach(p => p.classList.remove("is-active"));
  btn.classList.add("is-active");
}

function updateAll() {
  syncAllPrices();
}


/* ============================================================
   STEP 2 SUMMARY — ESTIMATED TOTAL BLOCK
============================================================ */

function updateStep2Summary() {
  const state = getBookingState();
  if (!state) return;

  // ⭐ PACKAGE
  const pkgPriceEl = document.getElementById("selected-package-price");
  if (pkgPriceEl)
    pkgPriceEl.textContent = state.package?.price
      ? `$${state.package.price}`
      : "—";

  // ⭐ ADD‑ONS TOTAL
  const addonsTotal =
    (state.extraHours || 0) +
    (state.champagnePrice || 0) +
    (state.travelFee || 0);

  const addonsEl = document.getElementById("addons-total");
  if (addonsEl) addonsEl.textContent = `$${syncAddonsTotal}`;

// ⭐ GRAND TOTAL
const addonsSum =
  (state.champagnePrice   || 0) +
  (state.cocktailCreation || 0) +
  (state.moctailBar       || 0) +
  (state.garnishStation   || 0) +
  (state.customMenuDesign || 0) +
  (state.extraHours       || 0);

const grandTotal =
  (state.package?.price || 0) +
  addonsSum;

const grandEl = document.getElementById("grand-total");
if (grandEl) grandEl.textContent = `$${grandTotal.toFixed(2)}`;

  // ⭐ DATE
  const dateEl = document.getElementById("bsSummaryDate");
  if (dateEl)
    dateEl.textContent = state.eventDate || "—";

  // ⭐ TIME
  const timeEl = document.getElementById("bsSummaryTime");
  if (timeEl)
    timeEl.textContent = state.eventTime
      ? calFmt12(state.eventTime)
      : "—";

  // ⭐ ADDRESS
  const addrEl = document.getElementById("bsSummaryAddress");
  if (addrEl)
    addrEl.textContent = state.eventAddress || "—";

  // ⭐ ZIP
  const zipEl = document.getElementById("bsSummaryZip");
  if (zipEl)
    zipEl.textContent = state.eventZip || "—";

  // ⭐ DURATION
  const durEl = document.getElementById("bsSummaryDuration");
  if (durEl)
    durEl.textContent = state.totalEventHours
      ? `${state.totalEventHours} hour${state.totalEventHours > 1 ? "s" : ""}`
      : "—";

  // ⭐ END TIME
  const endEl = document.getElementById("bsSummaryEndTime");
  if (endEl)
    endEl.textContent = state.eventEndTime || "—";

  // ⭐ PACKAGE NAME
  const pkgNameEl = document.getElementById("bsSummaryPkgName");
  if (pkgNameEl)
    pkgNameEl.textContent = state.package?.name || "—";

  // ⭐ PACKAGE PRICE (Step 2 version)
  const pkgPrice2El = document.getElementById("bsSummaryPkgPrice2");
  if (pkgPrice2El)
    pkgPrice2El.textContent = state.package?.price
      ? `$${state.package.price}`
      : "—";

  // ⭐ PACKAGE DESCRIPTION
  const pkgDescEl = document.getElementById("bsSummaryPkgDesc");
  if (pkgDescEl)
    pkgDescEl.textContent = state.package?.description || "—";

  // ⭐ EXTRA HOURS
  const extraEl = document.getElementById("bsSummaryExtraHours");
  if (extraEl)
    extraEl.textContent = state.extraHours
      ? `${state.extraHours} hour${state.extraHours > 1 ? "s" : ""}`
      : "—";

  // ⭐ CHAMPAGNE
  const champEl = document.getElementById("bsSummaryChampagne");
  if (champEl)
    champEl.textContent = state.champagnePrice
      ? `$${state.champagnePrice}`
      : "—";

  // ⭐ CONTACT DETAILS
  const nameEl = document.getElementById("bsSummaryContactName");
  if (nameEl)
    nameEl.textContent = state.contactName || "—";

  const emailEl = document.getElementById("bsSummaryContactEmail");
  if (emailEl)
    emailEl.textContent = state.contactEmail || "—";

  const phoneEl = document.getElementById("bsSummaryContactPhone");
  if (phoneEl)
    phoneEl.textContent = state.contactPhone || "—";

  const noteEl = document.getElementById("bsSummaryContactNote");
  if (noteEl)
    noteEl.textContent = state.contactNote || "—";

  // ⭐ TRAVEL
  const zoneEl = document.getElementById("bsSummaryZone");
  if (zoneEl)
    zoneEl.textContent = state.travelZone || "—";

  const feeEl = document.getElementById("bsSummaryTravelFee");
  if (feeEl)
    feeEl.textContent = state.travelFee
      ? `$${state.travelFee}`
      : "—";

  const distEl = document.getElementById("bsSummaryDistance");
  if (distEl)
    distEl.textContent = state.travelDistance || "—";
  syncAllPrices();
}

/* ============================================================
   BOX 4 — PILL ENGINE (EXTRA HOURS + CHAMPAGNE + TRAVEL)
============================================================ */

function bkPickHours(btn, hours) {
  const pillsWrap = document.getElementById("bk_hour_pills");
  if (pillsWrap) pillsWrap.style.display = "flex";

  document.querySelectorAll(".bk-pill").forEach(p => p.classList.remove("is-active"));
  btn.classList.add("is-active");

  const checkbox = document.getElementById("bk_hour");
  if (checkbox) checkbox.checked = true;

  const amount = hours * 125;
  const priceEl = document.getElementById("bk_hour_price");
  if (priceEl) priceEl.textContent = `+$${amount}`;

  setExtraHours(amount);
}

function bkPickChamp(btn, tier, price) {
  // Reset all pills
  document.querySelectorAll(".bk-champ-pill").forEach(p => p.classList.remove("is-active"));

  // Activate clicked pill
  btn.classList.add("is-active");

  // Ensure checkbox is checked
  const checkbox = document.getElementById("bk_champ");
  if (checkbox) checkbox.checked = true;

  // Update visible price under the checkbox
  const priceEl = document.getElementById("bk_champ_price");
  if (priceEl) priceEl.textContent = `+$${price}`;

  // Save to state
  setChampagne(price, btn.textContent.trim());
}

function updateContainer3Travel() {
  const state = getBookingState();
  if (!state) return;

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const miles = Number(state.travelMiles || 0);
  const fee   = Number(state.travelFee   || 0);

  // travel-summary-box
  set("c2TravelMiles", miles ? `${miles.toFixed(1)} mi` : "—");

  // ssContainer2Travel row
  set("c2TravelMilesStatic", miles ? `${miles.toFixed(1)} mi` : "—");
  set("c2TravelFee",         fee   ? `$${fee.toFixed(2)}`     : "—");
  set("c2TravelZone",        state.travelRegion || state.travelZone || "—");
  set("c2TravelReason",      state.travelReason || state.travelRegion || "—");

  // data-ss-travel spans
  const summarySpan = document.querySelector('[data-ss-travel="summary"]');
  if (summarySpan) summarySpan.textContent = state.travelSummary || state.travelDestination || "—";

  const feeSpan = document.querySelector('[data-ss-travel="fee"]');
  if (feeSpan) feeSpan.textContent = fee ? `$${fee.toFixed(2)}` : "—";
}

function setTravelState(travelData) {
  const next = saveBookingState({
    travelOrigin:      travelData.origin      ?? undefined,
    travelDestination: travelData.destination ?? undefined,
    travelMiles:       travelData.miles       ?? 0,
    travelRegion:      travelData.region      ?? "",
    travelZone:        travelData.region      ?? "",
    travelReason:      travelData.reason      ?? "",
    travelFee:         travelData.fee         ?? 0,
    travelCounty:      travelData.county      ?? ""
  });

  updateTotalsDisplay();
  updateContainer3Travel();
  return next;
}



/* Container 4 — Event Details Summary */
function updateContainer4Summary() {
  const state = getBookingState();
  if (!state) return;

  // Safe setter
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  // -----------------------------
  // ⭐ EVENT
  // -----------------------------
  set("bsSummaryDate", state.eventDate || "—");
  set("bsSummaryTime", state.eventTime ? calFmt12(state.eventTime) : "—");
  set("bsSummaryAddress", state.eventAddress || "—");
  set("bsSummaryZip", state.eventZip || "—");

  const hours = Number(state.totalEventHours || 0);
  set(
    "bsSummaryDuration",
    hours ? `${hours} hour${hours > 1 ? "s" : ""}` : "—"
  );
  set("bsSummaryEndTime", state.eventEndTime || "—");

  // -----------------------------
  // ⭐ PACKAGE
  // -----------------------------
  if (state.package) {
    set("bsSummaryPkgName", state.package.name || "—");
    set("bsSummaryPkgPrice2", state.package.price ? `$${state.package.price}` : "—");
    set("bsSummaryPkgDesc", state.package.description || "—");
  } else {
    set("bsSummaryPkgName", "—");
    set("bsSummaryPkgPrice2", "—");
    set("bsSummaryPkgDesc", "—");
  }

  // -----------------------------
  // ⭐ ADD‑ONS
  // -----------------------------
  const extra = Number(state.extraHours || 0);
  set(
    "bsSummaryExtraHours",
    extra ? `${extra} hour${extra > 1 ? "s" : ""}` : "—"
  );

  set(
    "bsSummaryChampagne",
    state.champagnePrice ? `$${state.champagnePrice}` : "—"
  );

  // -----------------------------
  // ⭐ CONTACT
  // -----------------------------
  set("bsSummaryContactName", state.contactName || "—");
  set("bsSummaryContactEmail", state.contactEmail || "—");
  set("bsSummaryContactPhone", state.contactPhone || "—");
  set("bsSummaryContactNote", state.contactNote || "—");

  // -----------------------------
  // ⭐ TRAVEL (NEW ENGINE)
  // -----------------------------
  const miles = Number(state.travelMiles || 0);
  const fee = Number(state.travelFee || 0);

  set("bsSummaryTravelMiles", miles ? `${miles} mi` : "—");
  set("bsSummaryDistance", miles ? `${miles} mi` : "—");

  set("bsSummaryZone", state.travelRegion || state.travelZone || "—");

  set("bsSummaryTravelFee", fee ? `$${fee.toFixed(2)}` : "—");

  set(
    "bsSummaryReason",
    state.travelReason ||
      state.travelRegion ||
      state.travelZone ||
      "—"
  );
  syncAllPrices();
}



/* Checkbox handler for Extra Hours + Champagne */
function bkCalc() {
  const hour = document.getElementById("bk_hour");
  const champ = document.getElementById("bk_champ");

  if (hour) {
    if (hour.checked) {
      const pillsWrap = document.getElementById("bk_hour_pills");
      if (pillsWrap) pillsWrap.style.display = "flex";
    } else {
      const pillsWrap = document.getElementById("bk_hour_pills");
      if (pillsWrap) pillsWrap.style.display = "none";
      setExtraHours(0);
      const priceEl = document.getElementById("bk_hour_price");
      if (priceEl) priceEl.textContent = "+$125";
      document.querySelectorAll(".bk-pill").forEach(p => p.classList.remove("is-active"));
    }
  }

  if (champ) {
    if (champ.checked) {
      const pillsWrap = document.getElementById("bk_champ_pills");
      if (pillsWrap) pillsWrap.style.display = "flex";
    } else {
      const pillsWrap = document.getElementById("bk_champ_pills");
      if (pillsWrap) pillsWrap.style.display = "none";
      setChampagne(0, "");
      const priceEl = document.getElementById("bk_champ_price");
      if (priceEl) priceEl.textContent = "+$25";
      document.querySelectorAll(".bk-champ-pill").forEach(p => p.classList.remove("is-active"));
    }
  }
}


/* Travel zone pills */
function selectTravelZone(button) {
  const zone = button.getAttribute("data-zone");
  const price = Number(button.getAttribute("data-price") || "0");
  const summaryText = button.textContent.trim();

  document.querySelectorAll(".bk-travel-pill").forEach(pill => {
    pill.classList.remove("is-active");
  });
  button.classList.add("is-active");

  const travelCheckbox = document.getElementById("bk_travel");
  if (travelCheckbox) travelCheckbox.checked = true;

  const priceEl = document.getElementById("bk_travel_price");
  if (priceEl) priceEl.textContent = `+$${price}`;

  const state = saveBookingState({
    travelFee: price,
    travelZone: zone,
    travelSummary: summaryText
  });

  const travelLine = document.getElementById("bsTravelFeeLine");
  if (travelLine) travelLine.innerHTML = `<span data-ss-travel="fee">$${price}</span>`;

  const travelSummarySpan = document.querySelector('[data-ss-travel="summary"]');
  if (travelSummarySpan) travelSummarySpan.textContent = state.travelSummary || "Travel area selected";

    updateContainer3Travel();
    syncAllPrices();
}

/* Travel dropdown (if used) */
function toggleTravelDropdown() {
  const dd = document.getElementById("bk_travel_dropdown");
  if (!dd) return;
  dd.style.display = dd.style.display === "flex" ? "none" : "flex";
}

/* ============================================================
   EVENT DURATION + END TIME
============================================================ */

function updateEventEndTime() {
  const state = getBookingState();

  // 1. Try hidden input
  const timeInput = document.getElementById("ssTimeInput") || document.getElementById("eventTime");
  let timeValue = (timeInput && timeInput.value) ? timeInput.value : state.eventTime;

  // 2. If still empty, parse from the visible display text (e.g. "7:00 PM")
  if (!timeValue) {
    const displayEl = document.getElementById("bsFlTimeValue");
    const displayText = displayEl?.innerText?.trim();
    if (displayText && !/select a time/i.test(displayText)) {
      const match = displayText.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let hh = parseInt(match[1]);
        const mm = parseInt(match[2]);
        const ampm = match[3].toUpperCase();
        if (ampm === "PM" && hh !== 12) hh += 12;
        if (ampm === "AM" && hh === 12) hh = 0;
        timeValue = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
      }
    }
  }

  if (!timeValue) return;

  const [h, m] = timeValue.split(":").map(Number);

  // extraHours stored as dollar price — $125 = 1 hour
  const extraHours = state.extraHours ? state.extraHours / 125 : 0;
  const totalHours = 3 + extraHours;

  // Use minutes math — setHours() truncates decimals incorrectly
  const startMinutes = (h * 60) + m;
  const endMinutes = startMinutes + (totalHours * 60);
  const endH = Math.floor(endMinutes / 60) % 24;
  const endM = endMinutes % 60;
  const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

  saveBookingState({ eventEndTime: endTime, totalEventHours: totalHours });

  const durText = document.getElementById("ssDurText");
  if (durText) {
    durText.innerHTML = `Service runs approximately <strong>${totalHours} hour${totalHours !== 1 ? "s" : ""}</strong> from your start time.`;
  }

  const durEnd = document.getElementById("ssDurEnd");
  if (durEnd) durEnd.textContent = `Ends at ${typeof calFmt12 === "function" ? calFmt12(endTime) : endTime}`;

  updateContainer4Summary();
  syncAllPrices();
}


/* ============================================================
   STEP 2 → STEP 3 PROGRESSION
============================================================ */

function bkActivateStep3() {
  updateContainer3Travel();
  // Hide step 2, show step 3
const step3Section = document.getElementById("booking-step-3");


  // Progress dots
  const dot1 = document.getElementById("dot1");
  if (dot1) dot1.classList.remove("is-active");
  const dot2 = document.getElementById("dot2");
  if (dot2) dot2.classList.add("is-active");

  // Progress bar → 100%
  const fill = document.getElementById("progressFill");
  if (fill) {
    fill.style.setProperty("--progress-value", "100%");
    fill.style.transition = "width 0.35s ease";
  }

  // Smooth scroll to step 3
  setTimeout(() => {
    if (step3Section) step3Section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}


/* ============================================================
   STEP 3 — CONTACT DETAILS SYNC (ON SUBMIT)
============================================================ */

function cdFormatPhone(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 10) value = value.slice(0, 10);
  const parts = [];
  if (value.length > 0) parts.push("(" + value.slice(0, 3));
  if (value.length >= 4) parts.push(") " + value.slice(3, 6));
  if (value.length >= 7) parts.push("-" + value.slice(6, 10));
  input.value = parts.join("");
}

function cdSync() {
  const emailInput = document.getElementById("cd_email");
  const errorEl = document.getElementById("cd_emailError");
  if (!emailInput || !errorEl) return;

  const value = emailInput.value.trim();
  if (!value) {
    errorEl.style.display = "none";
    return;
  }

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  errorEl.style.display = isValid ? "none" : "block";
}

function cdSubmit() {
  const firstInput = document.getElementById("cd_firstName");
  const lastInput = document.getElementById("cd_lastName");
  const emailInput = document.getElementById("cd_email");
  const phoneInput = document.getElementById("cd_phone");
  const noteInput = document.getElementById("cd_note");
  const confirmEl = document.getElementById("cd_confirm");

  const firstName = (firstInput?.value || "").trim();
  const lastName = (lastInput?.value || "").trim();
  const email = (emailInput?.value || "").trim();
  const phone = (phoneInput?.value || "").trim();
  const note = (noteInput?.value || "").trim();

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const errorEl = document.getElementById("cd_emailError");
  if (errorEl) {
    const isValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    errorEl.style.display = isValid ? "none" : "block";
    if (!isValid) return;
  }

  saveBookingState({
    contactFirst: firstName,
    contactLast: lastName,
    contactName: fullName,
    contactEmail: email,
    contactPhone: phone,
    contactNote: note
  });

  const bsFirst = document.getElementById("bsSummaryFirst");
  const bsLast = document.getElementById("bsSummaryLast");
  const bsEmail = document.getElementById("bsSummaryEmail");
  const bsPhone = document.getElementById("bsSummaryPhone");
  const bsNote = document.getElementById("bsSummaryNote");

  if (bsFirst) bsFirst.textContent = firstName;
  if (bsLast) bsLast.textContent = lastName;
  if (bsEmail) bsEmail.textContent = email;
  if (bsPhone) bsPhone.textContent = phone;
  if (bsNote) bsNote.textContent = note;

  const contactNameEl = document.getElementById("bsSummaryContactName");
  const contactEmailEl = document.getElementById("bsSummaryContactEmail");
  const contactPhoneEl = document.getElementById("bsSummaryContactPhone");
  const contactNoteEl = document.getElementById("bsSummaryContactNote");

  if (contactNameEl) contactNameEl.textContent = fullName || "—";
  if (contactEmailEl) contactEmailEl.textContent = email || "—";
  if (contactPhoneEl) contactPhoneEl.textContent = phone || "—";
  if (contactNoteEl) contactNoteEl.textContent = note || "—";

  updateContainer4Summary();

  if (confirmEl) confirmEl.style.display = "block";
}

/* ============================================================
   EVENT DETAILS SYNC (STEP 2 → STATE → STEP 3 → CONTAINER 4)
============================================================ */

function syncEventDetails() {
  const dateEl = document.getElementById("eventDate");
  const timeEl = document.getElementById("ssTimeInput") || document.getElementById("eventTime");
  const addrEl = document.getElementById("eventLocation");
  const zipEl = document.getElementById("eventZip");

  const newDate = dateEl?.value || "";
  const newTime = timeEl?.value || "";
  const newAddr = addrEl?.value || "";
  const newZip = zipEl?.value || "";

  saveBookingState({
    eventDate: newDate,
    eventTime: newTime,
    eventAddress: newAddr,
    eventZip: newZip
  });

  updateContainer4Summary();
  syncAllPrices();
}


/* ============================================================
   PRINT + EMAIL SUMMARY
============================================================ */

function bkPrint() {
  const pkgName = document.getElementById("bsSummaryPkgName")?.innerText || document.getElementById("bsSummaryName")?.innerText || "";
  const pkgGuests = document.getElementById("bsSummaryGuests")?.innerText || "";
  const pkgPrice = document.getElementById("bsSummaryPkgPrice2")?.innerText || document.getElementById("bsSummaryPkgPrice")?.innerText || "";
  const pkgDesc = document.getElementById("bsSummaryPkgDesc")?.innerText || "";

  const eventDate = document.getElementById("bsSummaryDate")?.innerText || "";
  const eventTime = document.getElementById("bsSummaryTime")?.innerText || "";
  const eventAddress = document.getElementById("bsSummaryAddress")?.innerText || "";
  const eventZip = document.getElementById("bsSummaryZip")?.innerText || "";
  const eventDuration = document.getElementById("bsSummaryDuration")?.innerText || "";
  const eventEndTime = document.getElementById("bsSummaryEndTime")?.innerText || "";

  const contactName = document.getElementById("bsSummaryContactName")?.innerText || "";
  const email = document.getElementById("bsSummaryContactEmail")?.innerText || "";
  const phone = document.getElementById("bsSummaryContactPhone")?.innerText || "";
  const note = document.getElementById("bsSummaryContactNote")?.innerText || "";

  const travelZone = document.getElementById("bsSummaryZone")?.innerText || "";
  const travelFee = document.getElementById("bsSummaryTravelFee")?.innerText || "";
  const travelDistance = document.getElementById("bsSummaryDistance")?.innerText || "";

  const extraLine = document.getElementById("bsSummaryExtraHours")?.innerText || "";
  const champagneLine = document.getElementById("bsSummaryChampagne")?.innerText || "";
  const total = document.getElementById("bsSummaryTotal")?.innerText || "";

  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(window.location.href)}`;

  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
    <head>
      <title>SipSavvy Booking Summary</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          padding: 32px;
          color: #3D1219;
          line-height: 1.55;
        }
        .logo {
          width: 180px;
          margin-bottom: 20px;
        }
        .header {
          background: #5C1228;
          color: white;
          padding: 18px 24px;
          border-radius: 12px;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: 28px;
        }
        h2 {
          color: #722F37;
          font-size: 1.15rem;
          margin-top: 28px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .row {
          margin-bottom: 6px;
          font-size: 0.95rem;
        }
        .label {
          font-weight: 600;
          color: #5C1228;
        }
        hr {
          margin: 26px 0;
          border: none;
          border-top: 1px solid #E8C4B8;
        }
        .qr-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 20px;
        }
        .qr-row img {
          width: 140px;
          height: 140px;
          border-radius: 8px;
        }
        .footer {
          margin-top: 40px;
          font-size: 0.8rem;
          color: #7A5A5A;
          text-align: center;
        }
        .terms {
          margin-top: 32px;
          font-size: 0.85rem;
          color: #5C1228;
          line-height: 1.45;
        }
        .timeline-item {
          margin-bottom: 8px;
          padding-left: 12px;
          border-left: 3px solid #E8C4B8;
        }
        .addon-item {
          margin-bottom: 6px;
          padding: 6px 0;
          border-bottom: 1px solid #F0E4E4;
        }
      </style>
    </head>
    <body>
      <img class="logo" src="https://i.imgur.com/6YV0Q0U.png" alt="SipSavvy Logo">
      <div class="header">SipSavvy Booking Summary</div>
      <div class="qr-row">
        <div>
          <h2>Package</h2>
          <div class="row"><span class="label">Name:</span> ${pkgName}</div>
          <div class="row"><span class="label">Guests:</span> ${pkgGuests}</div>
          <div class="row"><span class="label">Price:</span> ${pkgPrice}</div>
          <div class="row"><span class="label">Description:</span> ${pkgDesc}</div>
        </div>
        <img src="${qrURL}" alt="Booking QR Code">
      </div>
      <h2>Event Details</h2>
      <div class="row"><span class="label">Date:</span> ${eventDate}</div>
      <div class="row"><span class="label">Start Time:</span> ${eventTime}</div>
      <div class="row"><span class="label">Service Duration:</span> ${eventDuration}</div>
      <div class="row"><span class="label">Ends At:</span> ${eventEndTime}</div>
      <div class="row"><span class="label">Address:</span> ${eventAddress}</div>
      <div class="row"><span class="label">ZIP:</span> ${eventZip}</div>
      <h2>Event Timeline</h2>
      <div class="timeline-item"><span class="label">Arrival:</span> 45 minutes before service</div>
      <div class="timeline-item"><span class="label">Setup:</span> 30 minutes</div>
      <div class="timeline-item"><span class="label">Service Start:</span> ${eventTime}</div>
      <div class="timeline-item"><span class="label">Service Duration:</span> ${eventDuration}</div>
      <div class="timeline-item"><span class="label">Breakdown:</span> 20–30 minutes</div>
      <h2>Add‑Ons</h2>
      <div class="addon-item"><span class="label">Extra Hours:</span> ${extraLine}</div>
      <div class="addon-item"><span class="label">Champagne Toast:</span> ${champagneLine}</div>
      <div class="addon-item"><span class="label">Travel Fee:</span> ${travelFee}</div>
      <h2>Contact</h2>
      <div class="row"><span class="label">Name:</span> ${contactName}</div>
      <div class="row"><span class="label">Email:</span> ${email}</div>
      <div class="row"><span class="label">Phone:</span> ${phone}</div>
      <div class="row"><span class="label">Note:</span> ${note}</div>
      <h2>Travel</h2>
      <div class="row"><span class="label">Zone:</span> ${travelZone}</div>
      <div class="row"><span class="label">Fee:</span> ${travelFee}</div>
      <div class="row"><span class="label">Distance:</span> ${travelDistance}</div>
      <h2>Total</h2>
      <div class="row"><span class="label">Total:</span> ${total}</div>
      <hr>
      <div class="terms">
        <strong>Terms & Cancellation Policy</strong><br><br>
        • Deposits are refundable up to 7 days after payment.<br>
        • Cancellations made within 7 days of the event are non‑refundable.<br>
        • Travel fees apply based on distance and zone.<br>
        • Final guest count and special requests must be confirmed 7 days before the event.<br>
        • SipSavvy reserves the right to refuse service in unsafe or non‑compliant environments.<br>
      </div>
      <div class="footer">
        Thank you for choosing SipSavvy Mobile Bartending.<br>
        We look forward to serving your event with excellence.
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function bkEmailSummary() {
  const pkgName = document.getElementById("bsSummaryPkgName")?.innerText || document.getElementById("bsSummaryName")?.innerText || "";
  const pkgGuests = document.getElementById("bsSummaryGuests")?.innerText || "";
  const pkgPrice = document.getElementById("bsSummaryPkgPrice2")?.innerText || document.getElementById("bsSummaryPkgPrice")?.innerText || "";
  const pkgDesc = document.getElementById("bsSummaryPkgDesc")?.innerText || "";

  const eventDate = document.getElementById("bsSummaryDate")?.innerText || "";
  const eventTime = document.getElementById("bsSummaryTime")?.innerText || "";
  const eventAddress = document.getElementById("bsSummaryAddress")?.innerText || "";
  const eventZip = document.getElementById("bsSummaryZip")?.innerText || "";
  const eventDuration = document.getElementById("bsSummaryDuration")?.innerText || "";
  const eventEndTime = document.getElementById("bsSummaryEndTime")?.innerText || "";

  const contactName = document.getElementById("bsSummaryContactName")?.innerText || "";
  const contactEmail = document.getElementById("bsSummaryContactEmail")?.innerText || "";
  const contactPhone = document.getElementById("bsSummaryContactPhone")?.innerText || "";
  const contactNote = document.getElementById("bsSummaryContactNote")?.innerText || "";

  const travelZone = document.getElementById("bsSummaryZone")?.innerText || "";
  const travelFee = document.getElementById("bsSummaryTravelFee")?.innerText || "";
  const travelDistance = document.getElementById("bsSummaryDistance")?.innerText || "";

  const extraLine = document.getElementById("bsSummaryExtraHours")?.innerText || "";
  const champagneLine = document.getElementById("bsSummaryChampagne")?.innerText || "";
  const total = document.getElementById("bsSummaryTotal")?.innerText || "";

  const body =
`SipSavvy Booking Summary

PACKAGE
Name: ${pkgName}
Guests: ${pkgGuests}
Price: ${pkgPrice}
Description: ${pkgDesc}

EVENT DETAILS
Date: ${eventDate}
Start Time: ${eventTime}
Service Duration: ${eventDuration}
Ends At: ${eventEndTime}
Address: ${eventAddress}
ZIP: ${eventZip}

ADD-ONS
Extra Hours: ${extraLine}
Champagne Toast: ${champagneLine}
Travel Fee: ${travelFee}

CONTACT
Name: ${contactName}
Email: ${contactEmail}
Phone: ${contactPhone}
Note: ${contactNote}

TRAVEL
Zone: ${travelZone}
Fee: ${travelFee}
Distance: ${travelDistance}

TOTAL
${total}

Sent from SipSavvy Booking`;

  const subject = encodeURIComponent("SipSavvy Booking Summary");
  const encodedBody = encodeURIComponent(body);

  const to = contactEmail || "";
  window.location.href = `mailto:${to}?subject=${subject}&body=${encodedBody}`;
}

/* ============================================================
   RESET ALL 
============================================================ */

function bkResetAll() {
  localStorage.removeItem("ss-booking");
  localStorage.removeItem("selectedAddons");
  location.reload();
}




function updateBookingSummaryTravelZone() {
  const state = getBookingState();
  if (!state) return;

  // TRAVEL ZONE
  const zoneEl = document.getElementById("bsSummaryZone");
  if (zoneEl) {
    zoneEl.textContent = state.travelZone || "—";
  }

  // TRAVEL FEE
  const feeEl = document.getElementById("bsSummaryTravelFee");
  if (feeEl) {
    const fee = Number(state.travelFee || 0);
    feeEl.textContent = fee ? `$${fee.toFixed(2)}` : "—";
  }

  // DISTANCE
  const distEl = document.getElementById("bsSummaryDistance");
  if (distEl) {
    const miles = Number(state.travelMiles || 0);
    distEl.textContent = miles ? `${miles.toFixed(1)} mi` : "—";
  }
  syncAllPrices();
}

function updateBookingSummaryTravel() {
  const state = getBookingState();
  if (!state) return;

  // TRAVEL ZONE
  const zoneEl = document.getElementById("bsSummaryZone");
  if (zoneEl) {
    zoneEl.textContent = state.travelZone || "—";
  }

  // TRAVEL FEE
  const feeEl = document.getElementById("bsSummaryTravelFee");
  if (feeEl) {
    const fee = Number(state.travelFee || 0);
    feeEl.textContent = fee ? `$${fee.toFixed(2)}` : "—";
  }

  // DISTANCE
  const distEl = document.getElementById("bsSummaryDistance");
  if (distEl) {
    const miles = Number(state.travelMiles || 0);
    distEl.textContent = miles ? `${miles.toFixed(1)} mi` : "—";
  }
  syncAllPrices();
}

function updateBookingSummaryEvent() {
  const state = getBookingState();
  if (!state) return;

  // PACKAGE NAME
  const nameEl = document.getElementById("bsSummaryName");
  if (nameEl) {
    nameEl.textContent = state.package?.name || "CHOOSE ONE";
  }

  // GUEST COUNT
  const guestsEl = document.getElementById("bsSummaryGuests");
  if (guestsEl) {
    guestsEl.textContent = state.guestCount ? `${state.guestCount} guests` : "";
  }

  // PACKAGE PRICE
  const priceEl = document.getElementById("bsSummaryPkgPrice");
  if (priceEl) {
    const price = Number(state.package?.price || 0);
    priceEl.textContent = price ? `$${price.toFixed(2)}` : "$0";
  }

  // EVENT DATE
  const dateValue      = document.getElementById("bsFlDateValue");
  const datePlaceholder = document.getElementById("bsFlDatePlaceholder");
  if (dateValue && state.eventDate) {
    datePlaceholder && (datePlaceholder.style.display = "none");
    dateValue.childNodes.forEach(n => { if (n.nodeType === 3) n.remove(); });
    dateValue.insertAdjacentText("beforeend", state.eventDate);
  }

  // EVENT START TIME
  const timeValue      = document.getElementById("bsFlTimeValue");
  const timePlaceholder = document.getElementById("bsFlTimePlaceholder");
  if (timeValue && state.eventTime) {
    timePlaceholder && (timePlaceholder.style.display = "none");
    timeValue.childNodes.forEach(n => { if (n.nodeType === 3) n.remove(); });
    timeValue.insertAdjacentText("beforeend", state.eventTime);
    // Also restore the hidden time input
    const timeInput = document.getElementById("ssTimeInput");
    if (timeInput) timeInput.value = state.eventTime;
  }
  syncAllPrices();
}

function updateBookingSummaryContactAndAddons() {
  const state = getBookingState();
  if (!state) return;

  // ── CONTACT: NAME ──────────────────────────────────────
  const contactRow  = document.getElementById("bsContactRow");
  const contactLine = document.getElementById("bsContactLine");
  if (contactLine && state.contactName) {
    contactLine.textContent       = state.contactName;
    if (contactRow) contactRow.style.display = "flex";
  } else if (contactRow) {
    contactRow.style.display = "none";
  }

  // ── CONTACT: EMAIL ─────────────────────────────────────
  const emailRow  = document.getElementById("bsEmailRow");
  const emailLine = document.getElementById("bsEmailLine");
  if (emailLine && state.contactEmail) {
    emailLine.textContent       = state.contactEmail;
    if (emailRow) emailRow.style.display = "flex";
  } else if (emailRow) {
    emailRow.style.display = "none";
  }

  // ── CONTACT: PHONE ─────────────────────────────────────
  const phoneRow  = document.getElementById("bsPhoneRow");
  const phoneLine = document.getElementById("bsPhoneLine");
  if (phoneLine && state.contactPhone) {
    phoneLine.textContent       = state.contactPhone;
    if (phoneRow) phoneRow.style.display = "flex";
  } else if (phoneRow) {
    phoneRow.style.display = "none";
  }

  // ── CONTACT: NOTE ──────────────────────────────────────
  const noteRow  = document.getElementById("bsNoteRow");
  const noteLine = document.getElementById("bsNoteLine");
  if (noteLine && state.contactNote) {
    noteLine.textContent      = state.contactNote;
    if (noteRow) noteRow.style.display = "flex";
  } else if (noteRow) {
    noteRow.style.display = "none";
  }

  // ── ADD-ONS ────────────────────────────────────────────
  const addonsRow      = document.getElementById("bsAddonsRow");
  const addonsList     = document.getElementById("bsAddonsList");
  const addonsSubtotal = document.getElementById("bsAddonsSubtotal");
  const addons         = state.addons || [];

  if (addons.length > 0 && addonsList) {
    addonsList.innerHTML = addons.map(a => `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-family:'Inter',sans-serif;font-size:0.78rem;color:#4A3A3A;">${a.name}</span>
        <span style="font-family:'Inter',sans-serif;font-size:0.78rem;font-weight:600;color:#541E25;">
          $${Number(a.price || 0).toFixed(2)}
        </span>
      </div>`).join("");

    const total = addons.reduce((sum, a) => sum + Number(a.price || 0), 0);
    if (addonsSubtotal) addonsSubtotal.textContent = `$${total.toFixed(2)}`;
    if (addonsRow) addonsRow.style.display = "block";
  } else {
    if (addonsList)     addonsList.innerHTML       = "";
    if (addonsSubtotal) addonsSubtotal.textContent = "$0";
    if (addonsRow)      addonsRow.style.display    = "none";
  }
  syncAllPrices();
}

function updateBookingPageTravelFee() {
  const state = getBookingState();
  if (!state) return;

  const fee = Number(state.travelFee || 0);

  const travelCheckbox = document.getElementById("bk_travel");
  if (travelCheckbox) {
    travelCheckbox.dataset.price = fee;
    travelCheckbox.checked = fee > 0;
  }

  const priceEl = document.getElementById("bk_travel_price");
  if (priceEl) {
    priceEl.textContent = `+$${fee}`;
  }
  syncAllPrices();
}

// ══════════════════════════════════════════════════════════════
// syncAllPrices() — Single source of truth for ALL price/summary
// elements across Container 1 (Box 4 & 5), Container 2, Container 3
// Call this any time state changes: package, addons, travel, contact
// ══════════════════════════════════════════════════════════════
function syncAllPrices() {
  const state = getBookingState();
  if (!state) return;

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const fmt   = (n) => `$${Number(n || 0).toFixed(2)}`;
  const fmtRaw = (n) => `$${Number(n || 0)}`;

  // ── RAW VALUES ──────────────────────────────────────────────
  const pkgPrice  = Number(state.package?.price   || 0);
  const extra     = Number(state.extraHours        || 0);
  const champ     = Number(state.champagnePrice    || 0);
  const travel    = Number(state.travelFee         || 0);
  const miles     = Number(state.travelMiles       || 0);

  const cocktail   = Number(state.cocktailCreation  || 0);
  const moctail    = Number(state.moctailBar        || 0);
  const garnish    = Number(state.garnishStation    || 0);
  const customMenu = Number(state.customMenuDesign  || 0);

  const syncAddonsTotal = extra + champ + cocktail + moctail + garnish + customMenu;
  const syncGrandTotal  = pkgPrice + syncAddonsTotal + travel;

  // ── DURATION DISPLAY ──────────────────────────────────────────
  const totalDisplayHours = 3 + (extra / 125);
  const durTextEl = document.getElementById("ssDurText");
  if (durTextEl) {
    durTextEl.innerHTML = `Service runs approximately <strong>${totalDisplayHours} hour${totalDisplayHours !== 1 ? "s" : ""}</strong> from your start time.`;
  }


  // ── CONTAINER 1 — BOX 4 (Extra Hours, Champagne, Travel) ───
  set("sumExtraHours",  fmt(extra));
  set("sumChampagne",   fmt(champ));
  set("sumTravelFee",   fmt(travel));

  // ── CONTAINER 1 — BOX 5 (Package + Grand Total) ────────────
  set("sumPackageName",  state.package?.name  || "—");
  set("sumPackagePrice", fmt(pkgPrice));
  set("sumGrandTotal",   fmtRaw(syncGrandTotal));

  // ── CONTAINER 2 — BOOKING SUMMARY HEADER ───────────────────
  set("bsSummaryName",     state.package?.name || "CHOOSE ONE");
  set("bsSummaryGuests",   state.guestCount    ? `${state.guestCount} guests` : "");
  set("bsSummaryPkgPrice", fmt(pkgPrice));

  // ── CONTAINER 2 — GRAND TOTAL BREAKDOWN ────────────────────
  set("selected-package-price", fmt(pkgPrice));
  set("addons-total",           fmt(syncAddonsTotal));
  set("grand-total",            fmt(syncGrandTotal));
  set("bsSummaryTotal",         fmt(syncGrandTotal));


const syncShowRow = (rowId, sumId, val) => {
  const row = document.getElementById(rowId);
  const el  = document.getElementById(sumId);
  if (!row || !el) return;
  el.textContent    = '$' + Number(val).toFixed(2);
  row.style.display = val > 0 ? 'flex' : 'none';
};

syncShowRow('bk_row_extraHours', 'sumExtraHours', extra);
syncShowRow('bk_row_champagne',  'sumChampagne',  champ);
syncShowRow('bk_row_travelFee',  'sumTravelFee',  travel);



  // ── CONTAINER 2 — TRAVEL (static travel summary block) ─────
  set("c2TravelMilesStatic", miles ? `${miles.toFixed(1)} mi` : "—");
  set("c2TravelFee",         travel ? fmt(travel) : "—");
  set("c2TravelZone",        state.travelRegion || state.travelZone || "—");
  set("c2TravelReason",      state.travelReason || "—");

  // ── CONTAINER 3 — TRAVEL (inline paragraph) ─────────────────
  set("bsSummaryTravelFee",  travel ? fmt(travel) : "—");
  set("bsSummaryZone",       state.travelZone     || "—");
  set("bsSummaryDistance",   miles ? `${miles.toFixed(1)} mi` : "—");

  // ── CONTACT ROWS (show/hide + fill) ─────────────────────────
  const showRow = (rowId, lineId, value) => {
    const row  = document.getElementById(rowId);
    const line = document.getElementById(lineId);
    if (!row || !line) return;
    if (value) { line.textContent = value; row.style.display = "flex"; }
    else        { row.style.display = "none"; }
  };
  showRow("bsContactRow", "bsContactLine", state.contactName  || "");
  showRow("bsEmailRow",   "bsEmailLine",   state.contactEmail || "");
  showRow("bsPhoneRow",   "bsPhoneLine",   state.contactPhone || "");
  showRow("bsNoteRow",    "bsNoteLine",    state.contactNote  || "");

  // ── ADD-ONS LIST ─────────────────────────────────────────────
  const addonsRow      = document.getElementById("bsAddonsRow");
  const addonsList     = document.getElementById("bsAddonsList");
  const addonsSubtotal = document.getElementById("bsAddonsSubtotal");
  const addons         = state.addons || [];

  if (addonsList) {
    if (addons.length > 0) {
      addonsList.innerHTML = addons.map(a => `
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-family:'Inter',sans-serif;font-size:0.78rem;color:#4A3A3A;">${a.name}</span>
          <span style="font-family:'Inter',sans-serif;font-size:0.78rem;font-weight:600;color:#541E25;">${fmt(a.price)}</span>
        </div>`).join("");
      if (addonsSubtotal) addonsSubtotal.textContent = fmt(addons.reduce((s, a) => s + Number(a.price || 0), 0));
      if (addonsRow) addonsRow.style.display = "block";
    } else {
      addonsList.innerHTML = "";
      if (addonsSubtotal) addonsSubtotal.textContent = "$0.00";
      if (addonsRow)      addonsRow.style.display    = "none";
    }
  }

  // ── DATE / TIME DISPLAY ROWS ─────────────────────────────────
  const dateRow = document.getElementById("bsDateRow");
  const dateLine = document.getElementById("bsDateLine");
  if (dateLine && state.eventDate) {
    dateLine.textContent = state.eventDate;
    if (dateRow) dateRow.style.display = "flex";
  } else if (dateRow) { dateRow.style.display = "none"; }

  const timeRow = document.getElementById("bsTimeRow");
  const timeLine = document.getElementById("bsTimeLine");
  if (timeLine && state.eventTime) {
    timeLine.textContent = typeof calFmt12 === "function" ? calFmt12(state.eventTime) : state.eventTime;
    if (timeRow) timeRow.style.display = "flex";
  } else if (timeRow) { timeRow.style.display = "none"; }

  // ── NEW ADD-ONS ──────────────────────────────────────────────


// const grandTotal  = pkgPrice + syncAddonsTotal + travel;

// ── BOX5 — show/hide new addon rows ─────────────────────────
const showAddonRow = (rowId, sumId, val) => {
  const row = document.getElementById(rowId);
  const el  = document.getElementById(sumId);
  if (!row || !el) return;
  el.textContent    = fmt(val);
  row.style.display = val > 0 ? 'flex' : 'none';
};

showAddonRow('bk_row_cocktailCreation', 'sumCocktailCreation', cocktail);
showAddonRow('bk_row_moctailBar',       'sumMoctailBar',       moctail);
showAddonRow('bk_row_garnishStation',   'sumGarnishStation',   garnish);
showAddonRow('bk_row_customMenuDesign', 'sumCustomMenuDesign', customMenu);

// ── BOX4 — Add-Ons subtotal chip ────────────────────────────
const addonChip = document.getElementById('bk_addon_total');
const addonAmt  = document.getElementById('bk_addon_amt');
if (addonAmt)  addonAmt.textContent    = fmt(syncAddonsTotal);
if (addonChip) addonChip.style.display = syncAddonsTotal > 0 ? 'flex' : 'none';

}

// ── packages.html addon buttons ──────────────────────────────
document.querySelectorAll('.addon-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const key   = this.dataset.addon;
    const price = Number(this.dataset.price || 0);

    // Save to shared state
    saveBookingState({ [key]: price });

    // Update the price chip inside packages.html
    const chip = document.querySelector(`.addon-check-price[data-addon="${key}"]`);
    if (chip) chip.textContent = price ? `$${price}` : '$0';

    // Sync everything to booking.html
    syncAllPrices();
  });
});

// ── booking.html Box4 addon toggle ───────────────────────────
function pickAddon(key, price, btn) {
  saveBookingState({ [key]: price });

  // Highlight active button in the row
  const row = btn.closest('.bk-addon-row');
  if (row) row.querySelectorAll('.bk-extra-pill')
               .forEach(b => b.style.background = '');
  btn.style.background = 'var(--color-wine)';
  btn.style.color = '#fff';

  syncAllPrices();
}

function clearAddon(key, btn) {
  saveBookingState({ [key]: 0 });

  // Reset all pill highlights in the row
  const row = btn.closest('.bk-addon-row');
  if (row) row.querySelectorAll('.bk-extra-pill')
               .forEach(b => { b.style.background = ''; b.style.color = ''; });

  syncAllPrices();
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof syncAllPrices === 'function') syncAllPrices();
});


/* ============================================================
   BOOKING PAGE INIT — CLEAN, FINAL VERSION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Load travel + booking state FIRST
  window.ss_loadTravelState?.();
  window.ss_initBookingPage?.();

  // 2. Update summaries AFTER state is loaded
  updateBookingSummaryPackage?.();
  updateBookingSummaryTravel?.();
  updateBookingSummaryEvent?.();
  updateBookingSummaryContactAndAddons?.();

  // 3. Update totals LAST (this also updates Container 4)
  updateTotalsDisplay?.();
});

/* ============================================================
   EXPORTS (if needed)
============================================================ */

window.updateTotalsDisplay = updateTotalsDisplay;
window.updateContainer4Summary = updateContainer4Summary;
window.updateBookingSummaryTravel = updateBookingSummaryTravel;
window.updateBookingSummaryEvent = updateBookingSummaryEvent;
window.updateBookingSummaryContactAndAddons = updateBookingSummaryContactAndAddons;
window.syncAllPrices = syncAllPrices;

