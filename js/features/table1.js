// js/features/table.js
// --------------------------------------------------
// Firestore Listener + Table Renderer + Pagination
// --------------------------------------------------

import { db } from "../core/firebase-init.js";
import { paginate, getTotalPages, $, $all } from "../core/utils.js";
import { openBookingModal } from "./bookingModal.js";

let bookings = [];
let currentPage = 1;
const rowsPerPage = 10;

// DOM references
const tableBody = $("#bookingTableBody");
const paginationInfo = $("#paginationInfo");
const prevBtn = $("#prevPage");
const nextBtn = $("#nextPage");

// --------------------------------------------------
// INITIALIZE REAL-TIME LISTENER
// --------------------------------------------------
export function initBookingsTable() {
  db.collection("bookings")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      renderTable();
    });

  initPaginationControls();
}

// --------------------------------------------------
// RENDER TABLE
// --------------------------------------------------
export function renderTable() {
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const pageItems = paginate(bookings, currentPage, rowsPerPage);

  pageItems.forEach(booking => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${booking.name || ""}</td>
      <td>${booking.email || ""}</td>
      <td>${booking.phone || ""}</td>
      <td>${booking.eventDate || ""}</td>
      <td>
        <span class="status-badge status-${booking.status}">
          ${booking.status}
        </span>
      </td>
      <td>${booking.paid ? "💰 Paid" : "❌ Unpaid"}</td>
      <td>
        <button class="viewBtn" data-id="${booking.id}">View</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  attachRowClickHandlers();
  updatePaginationDisplay();
}

// --------------------------------------------------
// CLICK HANDLERS FOR ROW BUTTONS
// --------------------------------------------------
function attachRowClickHandlers() {
  const buttons = $all(".viewBtn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const booking = bookings.find(b => b.id === id);
      if (booking) openBookingModal(booking);
    });
  });
}

// --------------------------------------------------
// PAGINATION CONTROLS
// --------------------------------------------------
function initPaginationControls() {
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = getTotalPages(bookings.length, rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });
}

// --------------------------------------------------
// UPDATE PAGINATION DISPLAY
// --------------------------------------------------
function updatePaginationDisplay() {
  const totalPages = getTotalPages(bookings.length, rowsPerPage);
  paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}
