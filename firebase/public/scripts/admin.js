// SipSavvy Admin Dashboard UI Logic
// ---------------------------------

import {
  getAllBookings,
  getBookingsByStatus,
  approveBooking,
  completeBooking,
  cancelBooking
} from "./firestore-admin.js";

import { protectAdminPage, adminLogout } from "./auth.js";

// Protect this page from unauthorized access
protectAdminPage();

/**
 * Render a single booking card into the admin dashboard
 */
function renderBookingCard(booking) {
  return `
    <div class="booking-card">
      <h3>${booking.clientName}</h3>
      <p><strong>Email:</strong> ${booking.clientEmail}</p>
      <p><strong>Phone:</strong> ${booking.clientPhone}</p>

      <p><strong>Event Date:</strong> ${booking.eventDate}</p>
      <p><strong>Event Time:</strong> ${booking.eventTime}</p>
      <p><strong>Location:</strong> ${booking.eventCity}, ${booking.eventState}</p>

      <p><strong>Package:</strong> ${booking.packageName} ($${booking.packagePrice})</p>
      <p><strong>Add-ons Total:</strong> $${booking.addonsTotal}</p>
      <p><strong>Travel Fee:</strong> $${booking.travelFee}</p>

      <p><strong>Total:</strong> $${booking.total}</p>
      <p><strong>Status:</strong> ${booking.status}</p>

      <div class="admin-actions">
        <button class="approve-btn" data-id="${booking.id}">Approve</button>
        <button class="complete-btn" data-id="${booking.id}">Complete</button>
        <button class="cancel-btn" data-id="${booking.id}">Cancel</button>
      </div>
    </div>
  `;
}

/**
 * Load bookings into the admin dashboard
 */
async function loadBookings(filter = "all") {
  const container = document.getElementById("bookingContainer");
  container.innerHTML = "<p>Loading bookings...</p>";

  let bookings = [];

  if (filter === "all") {
    bookings = await getAllBookings();
  } else {
    bookings = await getBookingsByStatus(filter);
  }

  if (bookings.length === 0) {
    container.innerHTML = "<p>No bookings found.</p>";
    return;
  }

  container.innerHTML = bookings.map(renderBookingCard).join("");

  attachActionButtons();
}

/**
 * Attach event listeners to approve/complete/cancel buttons
 */
function attachActionButtons() {
  document.querySelectorAll(".approve-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      await approveBooking(btn.dataset.id);
      loadBookings("pending");
    });
  });

  document.querySelectorAll(".complete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      await completeBooking(btn.dataset.id);
      loadBookings("approved");
    });
  });

  document.querySelectorAll(".cancel-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      await cancelBooking(btn.dataset.id);
      loadBookings("all");
    });
  });
}

/**
 * Filter buttons
 */
document.getElementById("filterAll").addEventListener("click", () => loadBookings("all"));
document.getElementById("filterPending").addEventListener("click", () => loadBookings("pending"));
document.getElementById("filterApproved").addEventListener("click", () => loadBookings("approved"));
document.getElementById("filterCompleted").addEventListener("click", () => loadBookings("completed"));

/**
 * Logout button
 */
document.getElementById("logoutBtn").addEventListener("click", adminLogout);

// Load all bookings on page load
loadBookings("all");

