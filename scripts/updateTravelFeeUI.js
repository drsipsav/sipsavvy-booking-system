function updateTravelFeeUI(fee, reason) {
  // Update the UI
  const feeEl = document.getElementById("travelFee");
  const reasonEl = document.getElementById("travelFeeReason");

  if (feeEl) feeEl.textContent = `$${fee.toFixed(2)}`;
  if (reasonEl) reasonEl.textContent = reason;

  // Save to localStorage
  localStorage.setItem("ss_travel_fee", fee);
  localStorage.setItem("ss_travel_reason", reason);

  console.log("✔ Travel Fee saved:", fee, "Reason:", reason);
}


