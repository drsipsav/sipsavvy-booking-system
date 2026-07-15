// bookingModal.js — Full CRUD Booking Modal Module
// Handles: open, close, status update, payment update, refundability, notes, delete, timeline load
// Clean, modular, production‑ready

import { db } from "../core/firebase-init.js";
import { loadTimelineForBooking, addTimelineEvent } from "./timelineEngine.js";
import { exportTimelinePDF } from "./pdfExport.js";
import { getRefundStatus } from "../utils/refund.js";

// DOM ELEMENTS
const modal = document.getElementById("bookingModal");
const overlay = document.getElementById("bookingModalOverlay");
const closeBtn = document.getElementById("modalCloseBtn");

// FIELDS
const nameEl = document.getElementById("modalName");
const emailEl = document.getElementById("modalEmail");
const phoneEl = document.getElementById("modalPhone");
const receiptEl = document.getElementById("modalReceipt");
const eventDateEl = document.getElementById("modalEventDate");
const guestsEl = document.getElementById("modalGuests");
const packageEl = document.getElementById("modalPackage");
const refundEl = document.getElementById("modalRefund");

// ACTION ELEMENTS
const statusSelect = document.getElementById("modalStatusSelect");
const paidBtn = document.getElementById("modalPaidBtn");
const notesInput = document.getElementById("modalNotes");
const saveNotesBtn = document.getElementById("modalSaveNotesBtn");
const deleteBtn = document.getElementById("modalDeleteBtn");
const timelineList = document.getElementById("modalTimeline");
const downloadPDFBtn = document.getElementById("downloadTimelinePDF");

let activeBooking = null;

/* ============================================
   OPEN MODAL
   ============================================ */
export function openBookingModal(booking) {
  activeBooking = booking;

  // Populate fields
  nameEl.textContent = booking.name;
  emailEl.textContent = booking.email;
  phoneEl.textContent = booking.phone;
  receiptEl.textContent = booking.receiptNumber || booking.receipt;
  eventDateEl.textContent = booking.eventDateFormatted || booking.eventDate;
  guestsEl.textContent = booking.guestCount || booking.guests;
  packageEl.textContent = booking.packageName || booking.package;

  // Refund badge
  const refund = getRefundStatus(booking.eventDate, booking.lastRefundDate);
  refundEl.textContent = refund.label;

  // Status + payment
  statusSelect.value = booking.status;
  paidBtn.textContent = booking.paid ? "Mark Unpaid" : "Mark Paid";

  // Notes
  notesInput.value = booking.notes || "";

  // Load timeline
  loadTimelineForBooking(booking.id, timelineList);

  // Show modal
  modal.classList.add("open");
  overlay.style.display = "block";
}

/* ============================================
   CLOSE MODAL
   ============================================ */
export function closeBookingModal() {
  modal.classList.remove("open");
  overlay.style.display = "none";
  activeBooking = null;
}

/* ============================================
   UPDATE STATUS
   ============================================ */
async function updateStatus() {
  if (!activeBooking) return;

  const newStatus = statusSelect.value;

  await db.collection("bookings").doc(activeBooking.id).update({
    status: newStatus
  });

  // ⭐ REFUND TIMELINE EVENT
  if (newStatus === "cancelled") {
    await addTimelineEvent(
      activeBooking.id,
      "refund",
      "Booking Cancelled — Refund Eligibility Checked"
    );
  }

  loadTimelineForBooking(activeBooking.id, timelineList);
}

/* ============================================
   UPDATE PAYMENT
   ============================================ */
async function togglePayment() {
  if (!activeBooking) return;

  const newPaid = !activeBooking.paid;

  await db.collection("bookings").doc(activeBooking.id).update({
    paid: newPaid
  });

  activeBooking.paid = newPaid;
  paidBtn.textContent = newPaid ? "Mark Unpaid" : "Mark Paid";

  // ⭐ REFUND TIMELINE EVENT
  if (newPaid === true) {
    await addTimelineEvent(
      activeBooking.id,
      "refund",
      "Payment Received — Refund Window Active"
    );
  }

  loadTimelineForBooking(activeBooking.id, timelineList);
}

/* ============================================
   SAVE NOTES
   ============================================ */
async function saveNotes() {
  if (!activeBooking) return;

  const notes = notesInput.value.trim();

  await db.collection("bookings").doc(activeBooking.id).update({
    notes
  });

  await addTimelineEvent(
    activeBooking.id,
    "note",
    "Admin Updated Notes"
  );

  loadTimelineForBooking(activeBooking.id, timelineList);
}

/* ============================================
   DELETE BOOKING
   ============================================ */
async function deleteBooking() {
  if (!activeBooking) return;

  const confirmDelete = confirm("Are you sure you want to delete this booking?");
  if (!confirmDelete) return;

  await db.collection("bookings").doc(activeBooking.id).delete();

  closeBookingModal();
  location.reload();
}

/* ============================================
   EVENT LISTENERS
   ============================================ */
closeBtn.addEventListener("click", closeBookingModal);
overlay.addEventListener("click", closeBookingModal);

statusSelect.addEventListener("change", updateStatus);
paidBtn.addEventListener("click", togglePayment);
saveNotesBtn.addEventListener("click", saveNotes);
deleteBtn.addEventListener("click", deleteBooking);

downloadPDFBtn.addEventListener("click", () => {
  if (activeBooking) exportTimelinePDF(activeBooking.id);
});
