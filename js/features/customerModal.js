// customerModal.js — Customer Profile Modal Module // Handles: open, close, load customer bookings, stats, timeline, filters, PDF export // Clean, modular, production‑ready

import { db } from "../core/firebase-init.js"; import { loadTimelineForBooking } from "./timelineEngine.js"; import { exportTimelinePDF } from "./pdfExport.js";

// DOM ELEMENTS const modal = document.getElementById("customerProfileModal"); const overlay = document.getElementById("customerProfileOverlay"); const closeBtn = document.getElementById("customerProfileCloseBtn");

// CUSTOMER INFO const customerNameEl = document.getElementById("customerProfileName"); const customerEmailEl = document.getElementById("customerProfileEmail"); const customerPhoneEl = document.getElementById("customerProfilePhone");

// STATS const totalBookingsEl = document.getElementById("customerTotalBookings"); const totalPaidEl = document.getElementById("customerTotalPaid"); const totalUnpaidEl = document.getElementById("customerTotalUnpaid"); const totalGuestsEl = document.getElementById("customerTotalGuests");

// TIMELINE const timelineList = document.getElementById("customerTimeline"); const downloadPDFBtn = document.getElementById("downloadCustomerPDF");

let activeCustomer = null;

// OPEN CUSTOMER PROFILE export async function openCustomerModal(email) { activeCustomer = email;

// Load customer info + bookings const bookings = await loadCustomerBookings(email); if (!bookings.length) return;

const first = bookings[0];

// Populate customer info customerNameEl.textContent = first.name; customerEmailEl.textContent = first.email; customerPhoneEl.textContent = first.phone || "—";

// Stats totalBookingsEl.textContent = bookings.length; totalPaidEl.textContent = bookings.filter(b => b.paid).length; totalUnpaidEl.textContent = bookings.filter(b => !b.paid).length; totalGuestsEl.textContent = bookings.reduce((sum, b) => sum + (b.guests || 0), 0);

// Load timeline (all bookings combined) loadCustomerTimeline(bookings);

// Show modal modal.classList.add("open"); overlay.style.display = "block"; }

// CLOSE MODAL export function closeCustomerModal() { modal.classList.remove("open"); overlay.style.display = "none"; activeCustomer = null; }

// LOAD CUSTOMER BOOKINGS async function loadCustomerBookings(email) { const snapshot = await db.collection("bookings").where("email", "==", email).get(); return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); }

// BUILD CUSTOMER TIMELINE function loadCustomerTimeline(bookings) { timelineList.innerHTML = "";

const events = [];

bookings.forEach(b => { events.push({ type: "created", label: Booking Created — ${b.receipt}, date: b.createdAt || b.eventDate, });

events.push({
  type: "status",
  label: `Status Updated to ${b.status}`,
  date: b.updatedAt || b.eventDate,
});

if (b.paid) {
  events.push({
    type: "payment",
    label: `Payment Received for ${b.receipt}`,
    date: b.paymentDate || b.eventDate,
  });
}

if (b.notes) {
  events.push({
    type: "notes",
    label: `Notes Added for ${b.receipt}`,
    date: b.updatedAt || b.eventDate,
  });
}

});

// Sort by date events.sort((a, b) => new Date(a.date) - new Date(b.date));

// Render events.forEach(ev => { const li = document.createElement("li"); li.classList.add(timeline-dot-${ev.type}); li.innerHTML = <strong>${ev.label}</strong><br><span>${ev.date}</span>; timelineList.appendChild(li); }); }

// EVENT LISTENERS closeBtn.addEventListener("click", closeCustomerModal); overlay.addEventListener("click", closeCustomerModal);

downloadPDFBtn.addEventListener("click", () => { if (activeCustomer) exportTimelinePDF(true); });