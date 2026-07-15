// js/features/bookingModal.js
// --------------------------------------------------
// Booking Modal Controller
// Opens booking details, builds timeline, attaches filters,
// handles status, payment, notes, delete, and drag-close.
// --------------------------------------------------

import { db } from "../core/firebase-init.js";
import { buildTimeline, createEvent } from "./timelineEngine.js";
import { applyTimelineFilters } from "./filters.js";
import { exportTimelinePDF } from "./pdfExport.js";
import { $, $all } from "../core/utils.js";

// Modal references
const modal = $("#bookingModal");
const modalOverlay = $("#modalOverlay");
const timelineContainer = $("#modalTimeline");
const filterButtons = $("#timelineFilters");

let activeBooking = null;

// --------------------------------------------------
// OPEN BOOKING MODAL
// --------------------------------------------------
export function openBookingModal(booking) {
  activeBooking = booking;

  // Populate modal fields
  $("#modalName").textContent = booking.name || "";
  $("#modalEmail").textContent = booking.email || "";
  $("#modalPhone").textContent = booking.phone || "";
  $("#modalDate").textContent = booking.eventDate || "";
  $("#modalStatusSelect").value = booking.status || "pending";
  $("#modalPaidBtn").textContent = booking.paid ? "Mark Unpaid" : "Mark Paid";
  $("#modalNotes").value = booking.adminNotes || "";

  // Build timeline events
  const events = [];

  // Created event
  if (booking.createdAt) {
    events.push(
      createEvent({
        timestamp: booking.createdAt,
        text: "Booking created",
        icon: "📅",
        dotClass: "timeline-dot-created",
        type: "created"
      })
    );
  }

  // Status history
  if (booking.statusHistory) {
    booking.statusHistory.forEach(entry => {
      events.push(
        createEvent({
          timestamp: entry.timestamp,
          text: `Status changed to: ${entry.status}`,
          icon: "🔄",
          dotClass: "timeline-dot-status",
          type: "status"
        })
      );
    });
  }

  // Payment history
  if (booking.paymentHistory) {
    booking.paymentHistory.forEach(entry => {
      events.push(
        createEvent({
          timestamp: entry.timestamp,
          text: entry.text,
          icon: "💰",
          dotClass: "timeline-dot-payment",
          type: "payment"
        })
      );
    });
  }

  // Admin notes timeline
  if (booking.timelineNotes) {
    booking.timelineNotes.forEach(entry => {
      events.push(
        createEvent({
          timestamp: entry.timestamp,
          text: `Note: ${entry.note}`,
          icon: "📝",
          dotClass: "timeline-dot-notes",
          type: "notes"
        })
      );
    });
  }

  // Render timeline
  buildTimeline(events, timelineContainer);

  // Attach filters
  applyTimelineFilters(filterButtons, timelineContainer);

  // Show modal
  modal.classList.add("active");
  modalOverlay.classList.add("active");
}

// --------------------------------------------------
// CLOSE BOOKING MODAL
// --------------------------------------------------
export function closeBookingModal() {
  modal.classList.remove("active");
  modalOverlay.classList.remove("active");
  activeBooking = null;
}

// --------------------------------------------------
// STATUS CHANGE
// --------------------------------------------------
export function initBookingStatusHandler() {
  $("#modalStatusSelect").addEventListener("change", async e => {
    if (!activeBooking) return;

    await db.collection("bookings").doc(activeBooking.id).update({
      status: e.target.value
    });
  });
}

// --------------------------------------------------
// PAID TOGGLE
// --------------------------------------------------
export function initPaidToggleHandler() {
  $("#modalPaidBtn").addEventListener("click", async () => {
    if (!activeBooking) return;

    await db.collection("bookings").doc(activeBooking.id).update({
      paid: !activeBooking.paid
    });
  });
}

// --------------------------------------------------
// SAVE NOTES
// --------------------------------------------------
export function initSaveNotesHandler() {
  $("#modalSaveNotesBtn").addEventListener("click", async () => {
    if (!activeBooking) return;

    await db.collection("bookings").doc(activeBooking.id).update({
      adminNotes: $("#modalNotes").value
    });
  });
}

// --------------------------------------------------
// DELETE BOOKING
// --------------------------------------------------
export function initDeleteBookingHandler() {
  $("#modalDeleteBtn").addEventListener("click", async () => {
    if (!activeBooking) return;
    if (!confirm("Are you sure you want to delete this booking?")) return;

    await db.collection("bookings").doc(activeBooking.id).delete();
    closeBookingModal();
  });
}

// --------------------------------------------------
// PDF EXPORT
// --------------------------------------------------
export function initBookingPDFExport() {
  $("#downloadTimelinePDF").addEventListener("click", () => {
    exportTimelinePDF(timelineContainer, "Booking Timeline");
  });
}

// --------------------------------------------------
// DRAG-DOWN CLOSE (Mobile)
// --------------------------------------------------
export function initBookingModalDragClose() {
  let startY = 0;
  let currentY = 0;
  let dragging = false;

  modal.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
    dragging = true;
  });

  modal.addEventListener("touchmove", e => {
    if (!dragging) return;
    currentY = e.touches[0].clientY;

    const diff = currentY - startY;
    if (diff > 0) modal.style.transform = `translateY(${diff}px)`;
  });

  modal.addEventListener("touchend", () => {
    dragging = false;
    const diff = currentY - startY;

    if (diff > 120) closeBookingModal();
    else modal.style.transform = "translateY(0)";
  });
}
