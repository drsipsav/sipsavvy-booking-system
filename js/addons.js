/* ============================================================
   ADDONS.JS — Cleaned + Event‑Listener Version
   Handles:
   - Extra Hour
   - Travel Fee
   - Champagne Toast
   - Live total updates
   - Saving to localStorage
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------
     LOAD EXISTING SELECTIONS
  ------------------------------------------------------------ */
  const saved = JSON.parse(localStorage.getItem("ss-addons")) || {
    hours: 0,
    hourPrice: 0,
    travelName: "",
    travelFee: 0,
    toastTier: "",
    toastPrice: 0
  };

  /* ------------------------------------------------------------
     EXTRA HOUR
  ------------------------------------------------------------ */
  const hourButtons = document.querySelectorAll(".hour-option");
  const hourTotal = document.getElementById("hourTotal");
  const hourClearBtn = document.getElementById("hourClearBtn");

  hourButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const hours = Number(btn.dataset.hours);
      const price = Number(btn.dataset.price);

      saved.hours = hours;
      saved.hourPrice = price;

      updateHourUI();
      saveAddons();
      updateLiveTotal();
    });
  });

  hourClearBtn.addEventListener("click", () => {
    saved.hours = 0;
    saved.hourPrice = 0;
    updateHourUI();
    saveAddons();
    updateLiveTotal();
  });

  function updateHourUI() {
    hourButtons.forEach(b => b.classList.remove("is-selected"));

    if (saved.hours > 0) {
      const active = [...hourButtons].find(b => Number(b.dataset.hours) === saved.hours);
      if (active) active.classList.add("is-selected");

      hourTotal.textContent = `$${saved.hourPrice}`;
      hourClearBtn.style.display = "inline-flex";
    } else {
      hourTotal.textContent = "No hours selected";
      hourClearBtn.style.display = "none";
    }
  }

  

  /* ------------------------------------------------------------
     CHAMPAGNE TOAST
  ------------------------------------------------------------ */
  const toastButtons = document.querySelectorAll(".toast-option");
  const toastTotal = document.getElementById("toastTotal");
  const toastTier = document.getElementById("toastTier");
  const toastClearBtn = document.getElementById("toastClearBtn");

  toastButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      saved.toastTier = btn.dataset.tier;
      saved.toastPrice = Number(btn.dataset.price);

      updateToastUI();
      saveAddons();
      updateLiveTotal();
    });
  });

  toastClearBtn.addEventListener("click", () => {
    saved.toastTier = "";
    saved.toastPrice = 0;

    updateToastUI();
    saveAddons();
    updateLiveTotal();
  });

  function updateToastUI() {
    toastButtons.forEach(b => b.classList.remove("is-selected"));

    if (saved.toastTier) {
      const active = [...toastButtons].find(b => b.dataset.tier === saved.toastTier);
      if (active) active.classList.add("is-selected");

      toastTier.style.display = "block";
      toastTier.textContent = saved.toastTier;

      toastTotal.textContent = `$${saved.toastPrice}`;
      toastClearBtn.style.display = "inline-flex";
    } else {
      toastTier.style.display = "none";
      toastTotal.textContent = "No tier selected";
      toastClearBtn.style.display = "none";
    }
  }

  /* ------------------------------------------------------------
     LIVE TOTAL
  ------------------------------------------------------------ */
  const liveTotal = document.getElementById("addons-live-total");

  function updateLiveTotal() {
    const total =
      saved.hourPrice +
      saved.travelFee +
      saved.toastPrice;

    liveTotal.textContent = `$${total}`;
  }

  /* ------------------------------------------------------------
     SAVE TO LOCALSTORAGE
  ------------------------------------------------------------ */
  function saveAddons() {
    localStorage.setItem("ss-addons", JSON.stringify(saved));
  }

  /* ------------------------------------------------------------
     INITIALIZE UI
  ------------------------------------------------------------ */
  updateHourUI();
  window.updateTravelUI = function () {;
  updateToastUI();
  updateLiveTotal();
});
