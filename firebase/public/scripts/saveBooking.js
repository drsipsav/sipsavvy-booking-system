
function saveBookingData() {

  // PACKAGE
  const pkgName   = localStorage.getItem("ss_pkgName");
  const pkgDesc   = localStorage.getItem("ss_pkgDesc");
  const pkgGuests = localStorage.getItem("ss_pkgMaxGuests");
  const pkgPrice  = localStorage.getItem("ss_pkgPrice");

  // ADDONS
  const addonsTotal = localStorage.getItem("addonsTotal");

  // TRAVEL
  const fee    = localStorage.getItem("ss_travelFee");
  const miles  = localStorage.getItem("travelMiles");
  const reason = localStorage.getItem("ss_travel_breakdown");

  // WRITE TO BOOKING.HTML
  const pkgEl = document.getElementById("bookingPackage");
  if (pkgEl) pkgEl.textContent = pkgName || "—";

  const addonsEl = document.getElementById("bookingAddons");
  if (addonsEl) addonsEl.textContent = addonsTotal || "—";

  const feeEl = document.getElementById("bookingTravelFee");
  if (feeEl) feeEl.textContent = fee ? `$${Number(fee).toFixed(2)}` : "—";

  const milesEl = document.getElementById("bookingTravelMiles");
  if (milesEl) milesEl.textContent = miles ? `${miles} mi` : "—";

  const reasonEl = document.getElementById("bookingTravelReason");
  if (reasonEl) reasonEl.textContent = reason || "—";
}


