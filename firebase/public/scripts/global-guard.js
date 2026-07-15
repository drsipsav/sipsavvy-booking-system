/* ============================================================
   GLOBAL-GUARD.JS — LOAD ON ALL PAGES
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* const packageName = localStorage.getItem("ss_package_name"); */
  const packageName = localStorage.getItem("selectedPackageName");

  const path = window.location.pathname;

  // Block entering ADD-ONS without package
  if (path.includes("add-ons.html")) {
    if (!packageName) {
      alert("Please select a package item to proceed.");
      window.location.href = "packages.html";
    }
  }



});
