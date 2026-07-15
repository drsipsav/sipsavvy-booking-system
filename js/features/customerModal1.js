// js/features/customerModal.js
// --------------------------------------------------
// Customer Profile Modal Controller
// Opens customer details, builds timeline, attaches filters,
// supports PDF export + drag-close.
// --------------------------------------------------

import { db } from "../core/firebase-init.js";
import { buildTimeline, createEvent } from "./timelineEngine.js";
import { applyTimelineFilters } from "./filters.js";
import { exportTimelinePDF } from "./pdfExport.js";
import { $, $all } from "../core/utils.js";

// Modal references
const modal = $("#customerModal");
const modalOverlay = $("#modalOverlay");
const timelineContainer = $("#customerTimeline");
const filterButtons = $("#customerTimelineFilters");

let activeCustomer = null;

// --------------------------------------------------
// OPEN CUSTOMER PROFILE MODAL
// --------------------------------------------------
export function openCustomerProfile(customer) {
  activeCustomer = customer;

  // Populate modal fields
  $("#customerName").textContent = customer.name || "";
  $("#customerEmail").textContent = customer.email || "";
  $("#customerPhone").textContent = customer.phone || "";
  $("#customerTotalBookings").textContent = customer.totalBookings || 0;
  $("#customerLifetimeValue").textContent = customer.lifetimeValue || "$0";

  // Build timeline events
  const events = [];

  // Account created
  if (customer.createdAt) {
    events.push(
      createEvent({
        timestamp: customer.createdAt,
        text: "Customer profile created",
        icon: "👤",
        dotClass: "timeline-dot-created",
        type: "created"
      })
    );
  }

  // Booking history
  if (customer.bookingHistory) {
    customer.bookingHistory.forEach(entry => {
      events.push(
        createEvent({
          timestamp: entry.timestamp,
          text: `Booking: ${entry.status} — ${entry.eventDate}`,
          icon: "📅",
          dotClass: "timeline-dot-status",
          type: "booking"
        })
      );
    });
  }

  // Payments
  if (customer.paymentHistory) {
    customer.paymentHistory.forEach(entry => {
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

  // Notes
  if (customer.notes) {
    customer.notes.forEach(entry => {
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
// CLOSE CUSTOMER PROFILE MODAL
// --------------------------------------------------
export function closeCustomerProfile() {
  modal.classList.remove("active");
  modalOverlay.classList.remove("active");
  activeCustomer = null;
}

// --------------------------------------------------
// PDF EXPORT
// --------------------------------------------------
export function initCustomerPDFExport() {
  $("#downloadCustomerPDF").addEventListener("click", () => {
    exportTimelinePDF(timelineContainer, "Customer Timeline");
  });
}

// --------------------------------------------------
// DRAG-DOWN CLOSE (Mobile)
// --------------------------------------------------
export function initCustomerModalDragClose() {
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

    if (diff > 120) closeCustomerProfile();
    else modal.style.transform = "translateY(0)";
  });
}
