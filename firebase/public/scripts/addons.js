/* ============================================================
   addons.js — Fully Unified Add‑Ons Engine (layout untouched)
============================================================ */

/* ============================
   Storage Helpers
============================ */
function loadUnifiedAddons() {
  const raw = localStorage.getItem("ss_addons");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUnifiedAddons(addons) {
  localStorage.setItem("ss_addons", JSON.stringify(addons));
}

/* ============================
   Core Unified Update
============================ */
function unifiedUpdateAddon(name, price, extra = {}) {
  let addons = loadUnifiedAddons();

  addons = addons.filter(a => a.name !== name);
  addons.push({ name, price, ...extra });

  saveUnifiedAddons(addons);

  updateTotalsDisplay();
  updateContainer4Summary();

  if (typeof loadGrandTotal === "function") loadGrandTotal();

  if (typeof saveGrandTotal === "function") saveGrandTotal();
  if (typeof loadGrandTotalIntoBox5 === "function") loadGrandTotalIntoBox5();


}

/* ============================
   EXTRA HOURS (Unified)
============================ */
function unifiedSelectExtraHours(btn) {
  const name  = "Extra Hours";
  const hours = Number(btn.dataset.addonHours);
  const price = Number(btn.dataset.addonPrice);

  unifiedUpdateAddon(name, price, { hours });

  const row = btn.closest(".addon-check-row");
  row.querySelector(".extra-hour-total").textContent = `$${price}.00`;
}

function unifiedDeselectExtraHours(btn) {
  const name = "Extra Hours";

  let addons = loadUnifiedAddons();
  addons = addons.filter(a => a.name !== name);
  saveUnifiedAddons(addons);

  const row = btn.closest(".addon-check-row");
  row.querySelector(".extra-hour-total").textContent = "$0.00";

  updateTotalsDisplay();
  updateContainer4Summary();
}

/* ============================
   GENERIC ADD‑ONS (Unified)
============================ */
function unifiedSelectAddon(btn) {
  const name  = btn.dataset.addonName;
  const price = Number(btn.dataset.addonPrice);

  unifiedUpdateAddon(name, price);

  const row = btn.closest(".addon-check-row");
  row.querySelector(".addon-check-price").textContent = `$${price}.00`;
}

function unifiedDeselectAddon(btn) {
  const name = btn.dataset.addonName;

  let addons = loadUnifiedAddons();
  addons = addons.filter(a => a.name !== name);
  saveUnifiedAddons(addons);

  const row = btn.closest(".addon-check-row");
  row.querySelector(".addon-check-price").textContent = "$0.00";

  updateTotalsDisplay();
  updateContainer4Summary();
}

/* ============================
   RESTORE UI ON PAGE LOAD
============================ */
function restoreUnifiedAddonsUI() {
  const addons = loadUnifiedAddons();

  addons.forEach(a => {
    // Extra Hours
    if (a.name === "Extra Hours") {
      const el = document.querySelector(".extra-hour-total");
      if (el) el.textContent = `$${a.price}.00`;
    }

    // Generic add‑ons
    const priceEl = document.querySelector(`[data-addon-name="${a.name}"]`)
      ?.closest(".addon-check-row")
      ?.querySelector(".addon-check-price");

    if (priceEl) priceEl.textContent = `$${a.price}.00`;
  });
}

/* ============================
   INITIALIZE UNIFIED ENGINE
============================ */
function initAddons() {
  restoreUnifiedAddonsUI();

  updateTotalsDisplay();
  updateContainer4Summary();
}

/* ============================
   Expose
============================ */
window.initAddons = initAddons;
window.unifiedSelectAddon = unifiedSelectAddon;
window.unifiedDeselectAddon = unifiedDeselectAddon;
window.unifiedSelectExtraHours = unifiedSelectExtraHours;
window.unifiedDeselectExtraHours = unifiedDeselectExtraHours;

