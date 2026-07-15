/* ============================================================
   PACKAGES.JS — Cleaned + Event‑Listener Version
   Handles:
   - Package selection
   - Saving selection to localStorage
   - Updating Add‑Ons button
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const packageCards = document.querySelectorAll(".package-card");
  const addonBookBtn = document.getElementById("addonBookBtn");
  const addonBookItems = document.getElementById("addonBookItems");

  /* Load saved package */
  const saved = JSON.parse(localStorage.getItem("ss-package"));
  if (saved) highlightPackage(saved.name);

  /* Package selection */
  packageCards.forEach(card => {
    card.addEventListener("click", () => {
      const name = card.dataset.packageName;
      const price = Number(card.dataset.packagePrice);

      savePackage(name, price);
      highlightPackage(name);
      updateAddonButton();
    });
  });

  function savePackage(name, price) {
    localStorage.setItem("ss-package", JSON.stringify({ name, price }));
  }

  function highlightPackage(name) {
    packageCards.forEach(c => c.classList.remove("is-selected"));
    const active = [...packageCards].find(c => c.dataset.packageName === name);
    if (active) active.classList.add("is-selected");
  }

  function updateAddonButton() {
    const pkg = JSON.parse(localStorage.getItem("ss-package"));
    if (!pkg) return;

    addonBookBtn.style.display = "flex";
    addonBookItems.textContent = pkg.name;
  }

  updateAddonButton();
});
