// table.js — Bookings Table Renderer 
// Clean, modular, production‑ready 
// Renders table rows + attaches modal actions

import { formatDate } from "../core/utils.js";

// RENDER TABLE 
export function renderTable(bookings, openBookingModal, openCustomerModal) {
   const tbody = document.getElementById("bookingTableBody"); 
   tbody.innerHTML = "";

    bookings.forEach(b => { 
   const tr = document.createElement("tr"); 


tr.innerHTML = `
  <td>${b.receipt}</td>
  <td class="customer-link" data-email="${b.email}">${b.name}</td>
  <td>${formatDate(b.eventDate)}</td>
  <td>${b.guests}</td>
  <td>${b.package}</td>
  <td>${b.status}</td>
  <td>${b.paid ? "Paid" : "Unpaid"}</td>
  <td>${b.refundable ? "Yes" : "No"}</td>
  <td><button class="view-btn" data-id="${b.id}">View</button></td>
`;

// OPEN BOOKING MODAL
tr.querySelector(".view-btn").addEventListener("click", () => openBookingModal(b));


// OPEN CUSTOMER MODAL
tr.querySelector(".customer-link").addEventListener("click", () => openCustomerModal(b.email));
tbody.appendChild(tr);

}); 
}


// UPDATE PAGINATION DISPLAY 
export function updatePagination(currentPage, totalItems, pageSize, element) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1; 
  element.textContent = Page ${currentPage} of ${totalPages}; 
  }
  import { getRefundStatus } from "../utils/refund.js";
  const refund = getRefundStatus(b.eventDate, b.lastRefundDate);

row.innerHTML = `
  <tr>
    <td>${b.receiptNumber}</td>
    <td>${b.customerName}</td>
    <td>${b.eventDateFormatted}</td>
    <td>${b.guestCount}</td>
    <td>${b.packageName}</td>
    <td>${b.status}</td>
    <td>${b.paymentStatus}</td>
    <td>
      <span class="refund-badge refund-${refund.color}">
        ${refund.label}
      </span>
    </td>
    <td><button class="view-btn" data-id="${b.id}">View</button></td>
  </tr>
`;
