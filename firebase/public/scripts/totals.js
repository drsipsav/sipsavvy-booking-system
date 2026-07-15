/* ============================================================
   UNIFIED TOTALS ENGINE — PACKAGES + ADDONS + TRAVEL
============================================================ */

/* ============================
   GETTERS
============================ */
function getPackagePrice() {
  return Number(localStorage.getItem("ss_pkgPrice") || 0);
}

function getAddonsTotal() {
  const addons = JSON.parse(localStorage.getItem("ss_addons") || "[]");
  return addons.reduce((sum, a) => sum + Number(a.price || 0), 0);
}

function getTravelFeeTotal() {
  return Number(localStorage.getItem("ss_travel_fee") || 0);
}

/* ============================
   COMPUTE TOTAL
============================ */
function computeGrandTotal() {
  const pkg    = getPackagePrice();
  const addons = getAddonsTotal();
  const travel = getTravelFeeTotal();

  return pkg + addons + travel;
}

/* ============================
   UPDATE FOOTER CHECKOUT BAR
============================ */
function updateCheckoutBar() {
  const pkgName  = localStorage.getItem("ss_pkgName") || "No Package Selected";
  const pkgPrice = getPackagePrice();
  const addons   = getAddonsTotal();
  const travel   = getTravelFeeTotal();
  const total    = computeGrandTotal();

  const bar = document.getElementById("checkoutBar");
  if (!bar) return;

  bar.querySelector(".checkout-header").textContent = "The Sipsavvy Experiences";

  const content = bar.querySelector(".checkout-content");
  if (content) {
    content.innerHTML = `
      <div class="checkout-line">Package: <strong>${pkgName}</strong> — $${pkgPrice}</div>
      <div class="checkout-line">Add‑Ons: $${addons}</div>
      <div class="checkout-line">Travel Fee: $${travel.toFixed(2)}</div>
      <div class="checkout-line checkout-total">Total: <strong>$${total.toFixed(2)}</strong></div>
      <h3 style="text-align:center;">
        <button id="checkoutContinue" class="checkout-btn" type="button">
          COMPLETE YOUR ORDER →
        </button>
      </h3>
    `;
  }

  const btn = document.getElementById("checkoutContinue");
  if (btn) {
    btn.addEventListener("click", () => {
      window.location.href = "booking.html";
    });
  }
}

/* ============================
   UPDATE BOOKING SUMMARY (Container 4)
============================ */
function updateContainer4Summary() {
  const pkgName  = localStorage.getItem("ss_pkgName") || "";
  const pkgPrice = getPackagePrice();
  const addons   = getAddonsTotal();
  const travel   = getTravelFeeTotal();
  const total    = computeGrandTotal();

  const pkgEl = document.querySelector("[data-summary='packageName']");
  const pkgPriceEl = document.querySelector("[data-summary='packagePrice']");
  const addonsEl = document.querySelector("[data-summary='addonsTotal']");
  const travelEl = document.querySelector("[data-summary='travelFee']");
  const totalEl = document.querySelector("[data-summary='grandTotal']");

  if (pkgEl) pkgEl.textContent = pkgName || "No Package Selected";
  if (pkgPriceEl) pkgPriceEl.textContent = `$${pkgPrice}`;
  if (addonsEl) addonsEl.textContent = `$${addons}`;
  if (travelEl) travelEl.textContent = `$${travel.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

/* ============================
   UPDATE PACKAGES PAGE TOTALS
============================ */
function updateTotalsDisplay() {
  const pkgPrice = getPackagePrice();
  const addons   = getAddonsTotal();
  const travel   = getTravelFeeTotal();
  const total    = computeGrandTotal();

  const pkgEl = document.getElementById("footerPackagePrice");
  const addonsEl = document.getElementById("checkoutAddons");
  const travelEl = document.getElementById("checkoutTravelFee");
  const totalEl = document.getElementById("checkoutTotal");

  if (pkgEl) pkgEl.textContent = `$${pkgPrice}`;
  if (addonsEl) addonsEl.textContent = `Add‑Ons: $${addons}`;
  if (travelEl) travelEl.textContent = `Travel Fee: $${travel.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `Total: $${total.toFixed(2)}`;

  // ⭐ FIXED: Save the correct add-ons total
  localStorage.setItem("ss_addonsTotal", addons);

  updateCheckoutBar();
}


/* ============================
   INIT
============================ */
function initTotalsEngine() {
  updateTotalsDisplay();
  updateContainer4Summary();
}

document.addEventListener("DOMContentLoaded", initTotalsEngine);

