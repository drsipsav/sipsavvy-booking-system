function updateTotals() {
  // Core values
  const packageName  = getPackageName()  || "";
  const packagePrice = Number(getPackagePrice() || 0);

  // Dynamic add-ons (recommended architecture)
  let addonsTotal = 0;
  document.querySelectorAll("[data-addon-key]").forEach(el => {
    const key = el.dataset.addonKey;
    addonsTotal += Number(getAddon(key) || 0);
  });

  // Individual add-ons (for Box 3B display only)
  const extraHours   = Number(getAddon("extraHours") || 0);
  const champagne    = Number(getAddon("champagneToast") || 0);

  const travelFee    = Number(getTravelFee() || 0);

  const grandTotal   = packagePrice + addonsTotal + travelFee;

  /* ============================================================
     1. HEADER TOTALS
  ============================================================= */
  const headerName  = document.querySelector(".header-package-name");
  const headerPrice = document.querySelector(".header-package-price");
  const headerTotal = document.querySelector(".header-grand-total");

  if (headerName)  headerName.textContent  = packageName;
  if (headerPrice) headerPrice.textContent = `$${packagePrice}`;
  if (headerTotal) headerTotal.textContent = `$${grandTotal}`;

  /* ============================================================
     2. BOTTOM TOTALS
  ============================================================= */
  const bottomName   = document.querySelector(".bottom-package-name");
  const bottomPrice  = document.querySelector(".bottom-package-price");
  const bottomAddons = document.querySelector(".bottom-addons-total");
  const bottomTravel = document.querySelector(".bottom-travel-fee");
  const bottomGrand  = document.querySelector(".bottom-grand-total");

  if (bottomName)   bottomName.textContent   = packageName;
  if (bottomPrice)  bottomPrice.textContent  = `$${packagePrice}`;
  if (bottomAddons) bottomAddons.textContent = `$${addonsTotal}`;
  if (bottomTravel) bottomTravel.textContent = `$${travelFee}`;
  if (bottomGrand)  bottomGrand.textContent  = `$${grandTotal}`;

  /* ============================================================
     3. FOOTER TOTALS
  ============================================================= */
  const footerName   = document.querySelector(".footer-package-name");
  const footerPrice  = document.querySelector(".footer-package-price");
  const footerAddons = document.getElementById("checkoutAddons");
  const footerTravel = document.getElementById("checkoutTravel");
  const footerGrand  = document.getElementById("checkoutTotal");

  if (footerName)   footerName.textContent   = packageName;
  if (footerPrice)  footerPrice.textContent  = `$${packagePrice}`;
  if (footerAddons) footerAddons.textContent = `$${addonsTotal}`;
  if (footerTravel) footerTravel.textContent = `$${travelFee}`;
  if (footerGrand)  footerGrand.textContent  = `$${grandTotal}`;

  /* ============================================================
     4. BOOKING PAGE — SUMMARY COLUMN
  ============================================================= */
  const bookName   = document.querySelector(".book-package-name");
  const bookPrice  = document.querySelector(".book-package-price");
  const bookAddons = document.querySelector(".book-addons-total");
  const bookTravel = document.querySelector(".book-travel-fee");
  const bookGrand  = document.querySelector(".book-grand-total");

  if (bookName)   bookName.textContent   = packageName;
  if (bookPrice)  bookPrice.textContent  = `$${packagePrice}`;
  if (bookAddons) bookAddons.textContent = `$${addonsTotal}`;
  if (bookTravel) bookTravel.textContent = `$${travelFee}`;
  if (bookGrand)  bookGrand.textContent  = `$${grandTotal}`;

  /* ============================================================
     5. BOOKING PAGE — BOX 3B (CONTAINER 1)
  ============================================================= */
  const b3Name      = document.querySelector(".box3b-package-name");
  const b3Price     = document.querySelector(".box3b-package-price");
  const b3Extra     = document.querySelector(".box3b-extra-hours");
  const b3Travel    = document.querySelector(".box3b-travel-fee");
  const b3Champagne = document.querySelector(".box3b-champagne");
  const b3Grand     = document.querySelector(".box3b-grand-total");

  if (b3Name)      b3Name.textContent      = packageName;
  if (b3Price)     b3Price.textContent     = `$${packagePrice}`;
  if (b3Extra)     b3Extra.textContent     = `$${extraHours}`;
  if (b3Travel)    b3Travel.textContent    = `$${travelFee}`;
  if (b3Champagne) b3Champagne.textContent = `$${champagne}`;
  if (b3Grand)     b3Grand.textContent     = `$${grandTotal}`;

  /* ============================================================
     6. BOOKING PAGE — BOTTOM OF CONTAINER 1
  ============================================================= */
  const c1Name   = document.querySelector(".c1bottom-package-name");
  const c1Price  = document.querySelector(".c1bottom-package-price");
  const c1Addons = document.querySelector(".c1bottom-addons-total");
  const c1Travel = document.querySelector(".c1bottom-travel-fee");
  const c1Grand  = document.querySelector(".c1bottom-grand-total");

  if (c1Name)   c1Name.textContent   = packageName;
  if (c1Price)  c1Price.textContent  = `$${packagePrice}`;
  if (c1Addons) c1Addons.textContent = `$${addonsTotal}`;
  if (c1Travel) c1Travel.textContent = `$${travelFee}`;
  if (c1Grand)  c1Grand.textContent  = `$${grandTotal}`;

  /* ============================================================
     7. BOOKING PAGE — BOOKING SUMMARY FORM
  ============================================================= */
  const formName   = document.querySelector(".form-package-name");
  const formPrice  = document.querySelector(".form-package-price");
  const formAddons = document.querySelector(".form-addons-total");
  const formTravel = document.querySelector(".form-travel-fee");
  const formGrand  = document.querySelector(".form-grand-total");

  if (formName)   formName.textContent   = packageName;
  if (formPrice)  formPrice.textContent  = `$${packagePrice}`;
  if (formAddons) formAddons.textContent = `$${addonsTotal}`;
  if (formTravel) formTravel.textContent = `$${travelFee}`;
  if (formGrand)  formGrand.textContent  = `$${grandTotal}`;

  // Update UI (ID-based)
  updateElement("selected-package-price", packagePrice);
  updateElement("addons-total", addonsTotal);
  updateElement("travelTotal", travelFee);
  updateElement("grand-total", grandTotal);
  updateElement("bsSummaryTotal", grandTotal);
}

function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = `$${value}`;
}
