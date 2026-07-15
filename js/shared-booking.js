/* ============================================================
   SHARED‑BOOKING.JS
   Global UI + Shared Logic for Packages & Add‑Ons Pages
   ============================================================ */

/* ------------------------------------------------------------
   MOBILE NAV DRAWER
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mobileNav.classList.toggle("is-open");
    });
  }
});

/* ------------------------------------------------------------
   LOAD PACKAGE NAME INTO ADD‑ONS PAGE HEADER
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const pkg = JSON.parse(localStorage.getItem("ss-package"));
  const selectedPackage = document.getElementById("selected-package");

  if (pkg && selectedPackage) {
    selectedPackage.textContent = `Selected Package: ${pkg.name} — $${pkg.price}`;
  }
});

/* ------------------------------------------------------------
   SYNC PACKAGE NAME INTO PACKAGES PAGE PREVIEW BOX
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const pkg = JSON.parse(localStorage.getItem("ss-package"));
  const selPackage = document.getElementById("sel-package");

  if (pkg && selPackage) {
    selPackage.textContent = `Package: ${pkg.name}`;
  }
});

/* ============================================================
   SYNC ADD‑ONS PREVIEW ON PACKAGES PAGE
   (This is the fix you needed)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("ss-addons"));
  if (!saved) return;

  const previewTotal = document.getElementById("addonsTotalAmt");
  const previewList = document.getElementById("sel-addons");

  if (!previewTotal || !previewList) return;

  const total =
    (saved.hourPrice || 0) +
    (saved.travelFee || 0) +
    (saved.toastPrice || 0);

  previewTotal.textContent = `$${total}`;

  const items = [];

  if (saved.hours > 0) items.push(`${saved.hours} Extra Hour(s)`);
  if (saved.travelName) items.push(`Travel: ${saved.travelName}`);
  if (saved.toastTier) items.push(`Champagne: ${saved.toastTier}`);

  previewList.textContent = items.length ? items.join(", ") : "None selected";
});
const previewBox = document.getElementById("current-selection-box");
if (previewBox && items.length > 0) {
  previewBox.style.display = "block";
}
