function loadAllAddons() {
  const addons = JSON.parse(localStorage.getItem("ss_addons") || "[]");

  const map = {
    "Extra Hours": '[data-summary="extra-hours-price"]',
    "Champagne Toast": '[data-summary="champagne-toast-price"]',
    "Signature Cocktail Creation": '[data-summary="cocktail-creation-price"]',
    "Mocktail Bar": '[data-summary="mocktail-bar-price"]',
    "Specialty Garnish Station": '[data-summary="garnish-station-price"]',
    "Custom Drink Menu Design": '[data-summary="custom-menu-design-price"]',
    "Travel Fee": '[data-summary="travel-fee-price"]'
  };

  addons.forEach(addon => {
    const selector = map[addon.name];
    if (!selector) return;

    const el = document.querySelector(selector);
    if (el) el.textContent = `$${addon.price.toFixed(2)}`;
  });
}
