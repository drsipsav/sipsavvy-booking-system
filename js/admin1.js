async function openCustomerProfile(email) {
  const modal = document.getElementById("customerProfileModal");
  const timelineEl = document.getElementById("customerTimeline");

  // Fetch all bookings for this customer
  const q = query(collection(db, "bookings"), where("email", "==", email));
  const snap = await getDocs(q);

  let bookings = [];
  snap.forEach(doc => bookings.push({ id: doc.id, ...doc.data() }));

  // Fill customer info
  document.getElementById("customerProfileName").textContent = bookings[0].name;
  document.getElementById("cpEmail").textContent = bookings[0].email;
  document.getElementById("cpPhone").textContent = bookings[0].phone;

  // Stats
  document.getElementById("cpTotalBookings").textContent = bookings.length;
  document.getElementById("cpTotalSpent").textContent = bookings
    .filter(b => b.paid)
    .reduce((sum, b) => sum + (b.amountPaid || 0), 0);

  const sorted = bookings.sort((a,b) => new Date(a.eventDateRaw) - new Date(b.eventDateRaw));
  document.getElementById("cpFirstBooking").textContent = sorted[0].eventDateFormatted;
  document.getElementById("cpLastBooking").textContent = sorted[sorted.length-1].eventDateFormatted;

  // ============================
  // CUSTOMER PROFILE TIMELINE
  // ============================
  timelineEl.innerHTML = "";
  let events = [];

  bookings.forEach(b => {
    const bookingLabel = `Booking #${b.receiptNumber}`;

    // Created
    if (b.createdAt) {
      events.push({
        timestamp: b.createdAt.toDate().toISOString(),
        text: `${bookingLabel}: Created`,
        icon: "🕒",
        dotClass: "timeline-dot-created",
        type: "created"
      });
    }

    // Status history
    b.statusHistory?.forEach(e => {
      events.push({
        timestamp: e.timestamp,
        text: `${bookingLabel}: Status → ${e.status}`,
        icon: "📌",
        dotClass: "timeline-dot-status",
        type: "status"
      });
    });

    // Payment history
    b.paymentHistory?.forEach(e => {
      events.push({
        timestamp: e.timestamp,
        text: `${bookingLabel}: Payment ${e.paid ? "PAID" : "UNPAID"}`,
        icon: e.paid ? "💳" : "💸",
        dotClass: e.paid ? "timeline-dot-paid" : "timeline-dot-unpaid",
        type: "payment"
      });
    });

    // Notes
    b.timelineNotes?.forEach(e => {
      events.push({
        timestamp: e.timestamp,
        text: `${bookingLabel}: Note — ${e.note}`,
        icon: "📝",
        dotClass: "timeline-dot-notes",
        type: "notes"
      });
    });
  });

  // Sort
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Group + render
  let lastDate = null;
  let dayContainer = null;

  events.forEach(evt => {
    const date = new Date(evt.timestamp).toLocaleDateString();

    if (date !== lastDate) {
      const header = document.createElement("li");
      header.classList.add("timeline-date-header");
      header.innerHTML = `
        <span>${date}</span>
        <button class="timeline-toggle">▼</button>
      `;
      timelineEl.appendChild(header);

      dayContainer = document.createElement("ul");
      dayContainer.classList.add("timeline-day-container");
      timelineEl.appendChild(dayContainer);

      lastDate = date;
    }

    const li = document.createElement("li");
    li.classList.add("timeline-item", evt.dotClass);
    li.dataset.type = evt.type;
    li.dataset.tooltip = evt.type.charAt(0).toUpperCase() + evt.type.slice(1);

    li.innerHTML = `
      ${evt.icon} ${evt.text}
      <br><small>${new Date(evt.timestamp).toLocaleTimeString()}</small>
    `;

    dayContainer.appendChild(li);
  });

  // Collapsible sections
  document.querySelectorAll("#customerTimeline .timeline-date-header").forEach(header => {
    header.addEventListener("click", () => {
      const container = header.nextElementSibling;
      container.classList.toggle("collapsed");
      const btn = header.querySelector(".timeline-toggle");
      btn.textContent = container.classList.contains("collapsed") ? "►" : "▼";
    });
  });



// ============================
// CUSTOMER PROFILE FILTERS
// ============================
document.querySelectorAll("#customerProfileFilters button").forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    // Reset filter
    if (filter === "reset") {
      document.querySelectorAll("#customerProfileFilters button").forEach(b => b.classList.remove("active"));
      document.querySelector('[data-filter="all"]').classList.add("active");

      document.querySelectorAll("#customerTimeline li").forEach(li => {
        li.style.display = "";
      });
      return;
    }

    // Today filter
    if (filter === "today") {
      const today = new Date().toLocaleDateString();

      document.querySelectorAll("#customerProfileFilters button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll("#customerTimeline li").forEach(li => {
        if (!li.dataset.type) return;

        const header = li.parentElement.previousElementSibling;
        const liDate = header.querySelector("span").textContent;

        li.style.display = liDate === today ? "" : "none";
      });
      return;
    }

    // Standard filters
    document.querySelectorAll("#customerProfileFilters button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll("#customerTimeline li").forEach(li => {
      if (!li.dataset.type) return;

      li.style.display = (filter === "all" || li.dataset.type === filter) ? "" : "none";
    });
  });
});





// ============================
// CUSTOMER TIMELINE SEARCH
// ============================
document.getElementById("customerTimelineSearch").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  document.querySelectorAll("#customerTimeline li").forEach(li => {
    if (!li.dataset.type) return;

    li.style.display = li.textContent.toLowerCase().includes(q) ? "" : "none";
  });
});

// ============================
// JUMP TO FIRST / LAST EVENT
// ============================
document.getElementById("jumpFirst").addEventListener("click", () => {
  const first = document.querySelector("#customerTimeline li.timeline-item");
  if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.getElementById("jumpLast").addEventListener("click", () => {
  const items = document.querySelectorAll("#customerTimeline li.timeline-item");
  const last = items[items.length - 1];
  if (last) last.scrollIntoView({ behavior: "smooth", block: "center" });
});

// ============================
// CUSTOMER TIMELINE PDF EXPORT
// ============================
document.getElementById("customerTimelinePDF").addEventListener("click", () => {
  const timeline = document.getElementById("customerTimeline").innerHTML;

  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head>
        <title>Customer Timeline PDF</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { color: #5C1228; }
          ul { list-style: none; padding: 0; }
          li { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h2>Customer Timeline</h2>
        <ul>${timeline}</ul>
      </body>
    </html>
  `);

  win.document.close();
  win.print();
});

  modal.classList.add("active");
}


// ====================================================
// beginning of whole script extracted from admin.html 
//=====================================================


  <script>
  // ============================
  // FIREBASE CONFIG
  // ============================
  const firebaseConfig = {
    // TODO: your config here
  };
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // ============================
  // AUTH GUARD
  // ============================
  auth.onAuthStateChanged(user => {
    if (!user) window.location.href = "admin-login.html";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    auth.signOut().then(() => window.location.href = "admin-login.html");
  });

  // ============================
  // DOM REFERENCES
  // ============================
  const tbody = document.getElementById("bookingsBody");
  const searchInput = document.getElementById("adminSearchInput");
  const pageInfo = document.getElementById("pageInfo");

  // Booking modal refs
  const modal = document.getElementById("bookingModal");
  const modalOverlay = document.getElementById("bookingModalOverlay");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  let activeBooking = null;

  // ============================
  // THEME TOGGLE
  // ============================
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    body.classList.remove("theme-light", "theme-dark");
    body.classList.add(theme);
    localStorage.setItem("sipSavvyAdminTheme", theme);
  }

  applyTheme(localStorage.getItem("sipSavvyAdminTheme") || "theme-light");

  themeToggle.addEventListener("click", () => {
    const newTheme = body.classList.contains("theme-light") ? "theme-dark" : "theme-light";
    applyTheme(newTheme);
  });

  // ============================
  // HELPERS
  // ============================
  function daysBeforeEvent(dateStr) {
    if (!dateStr) return 0;
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diff = eventDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function paginate(list) {
    const start = (currentPage - 1) * rowsPerPage;
    return list.slice(start, start + rowsPerPage);
  }

  function updatePaginationDisplay(total) {
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  // ============================
  // BUILD ROW
  // ============================
  function buildRow(b) {
    const days = daysBeforeEvent(b.eventDateRaw);
    const isPaid = !!b.paid;
    const refundable = isPaid && days > 7;
    const nonRefundable = isPaid && days <= 7;

    let statusClass = "badge-status-pending";
    if (b.status === "confirmed") statusClass = "badge-status-confirmed";
    if (b.status === "cancelled") statusClass = "badge-status-cancelled";

    const paidClass = isPaid ? "badge-paid-yes" : "badge-paid-no";

    let refundLabel = "N/A";
    let refundClass = "badge-refund-na";
    if (refundable) {
      refundLabel = "Refundable";
      refundClass = "badge-refund-yes";
    } else if (nonRefundable) {
      refundLabel = "Non-Refundable";
      refundClass = "badge-refund-no";
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.receiptNumber || ""}</td>
      <td>${b.name || ""}</td>
      <td>${b.eventDateFormatted || b.eventDateRaw || ""}</td>
      <td>${b.guestCount || ""}</td>
      <td>${b.packageName || ""}</td>
      <td><span class="badge ${statusClass}">${b.status || "pending"}</span></td>
      <td><span class="badge ${paidClass}">${isPaid ? "Paid" : "Unpaid"}</span></td>
      <td><span class="badge ${refundClass}">${refundLabel}</span></td>
      <td>
        <button data-id="${b.id}" data-action="togglePaid">
          ${isPaid ? "Mark Unpaid" : "Mark Paid"}
        </button>
        <button data-id="${b.id}" data-action="cancel">Cancel</button>
      </td>
    `;

    // Open booking modal on row click
    tr.addEventListener("click", () => openModal(b));

    return tr;
  }

  // ============================
  // RENDER TABLE
  // ============================
  let allBookings = [];
  let filteredBookings = null;
  let currentPage = 1;
  const rowsPerPage = 10;

  function getActiveList() {
    return filteredBookings || allBookings;
  }

  function renderTable() {
    tbody.innerHTML = "";
    const list = getActiveList();
    const paginated = paginate(list);

    paginated.forEach(b => {
      const tr = buildRow(b);
      tbody.appendChild(tr);
    });

    updatePaginationDisplay(list.length);
  }

  function renderFilteredTable(list) {
    filteredBookings = list;
    currentPage = 1;
    renderTable();
  }

  // ============================
  // FIRESTORE LISTENER
  // ============================
  db.collection("bookings")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      allBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (!filteredBookings) currentPage = 1;
      renderTable();
    });

  // ============================
  // SEARCH
  // ============================
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      filteredBookings = null;
      currentPage = 1;
      renderTable();
      return;
    }

    const filtered = allBookings.filter(b =>
      (b.name || "").toLowerCase().includes(query) ||
      (b.email || "").toLowerCase().includes(query) ||
      (b.receiptNumber || "").toLowerCase().includes(query) ||
      (b.packageName || "").toLowerCase().includes(query) ||
      (b.eventDateFormatted || "").toLowerCase().includes(query) ||
      (b.eventDateRaw || "").toLowerCase().includes(query)
    );

    renderFilteredTable(filtered);
  });

  // ============================
  // PAGINATION
  // ============================
  document.getElementById("nextPage").addEventListener("click", () => {
    const list = getActiveList();
    const totalPages = Math.ceil(list.length / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  // ============================
  // EXPORT CSV
  // ============================
  document.getElementById("exportCSV").addEventListener("click", () => {
    const list = getActiveList();
    let csv = "Receipt,Name,Event Date,Guests,Package,Status,Paid,Refundability\n";

    list.forEach(b => {
      const days = daysBeforeEvent(b.eventDateRaw);
      const isPaid = !!b.paid;
      const refundable = isPaid && days > 7;
      const nonRefundable = isPaid && days <= 7;

      let refundLabel = "N/A";
      if (refundable) refundLabel = "Refundable";
      else if (nonRefundable) refundLabel = "Non-Refundable";

      csv += `"${b.receiptNumber || ""}","${b.name || ""}","${b.eventDateFormatted || b.eventDateRaw || ""}","${b.guestCount || ""}","${b.packageName || ""}","${b.status || ""}","${isPaid ? "Paid" : "Unpaid"}","${refundLabel}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SipSavvy_Bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  });

  // ============================
  // ACTION HANDLER (TABLE BUTTONS)
  // ============================
  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");
    if (!id || !action) return;

    const docRef = db.collection("bookings").doc(id);

    if (action === "togglePaid") {
      const booking = allBookings.find(b => b.id === id);
      await docRef.update({ paid: !booking.paid });
    }

    if (action === "cancel") {
      await docRef.update({ status: "cancelled" });
    }
  });

  // ============================
  // MODAL FUNCTIONS
  // ============================
  function openModal(booking) {
    activeBooking = booking;

    // Basic fields
    document.getElementById("modalName").textContent = booking.name || "";
    document.getElementById("modalEmail").textContent = booking.email || "";
    document.getElementById("modalPhone").textContent = booking.phone || "";
    document.getElementById("modalReceipt").textContent = booking.receiptNumber || "";
    document.getElementById("modalEventDate").textContent = booking.eventDateFormatted || booking.eventDateRaw || "";
    document.getElementById("modalGuests").textContent = booking.guestCount || "";
    document.getElementById("modalPackage").textContent = booking.packageName || "";
    document.getElementById("modalNotes").value = booking.adminNotes || "";

    // Refund eligibility
    const days = daysBeforeEvent(booking.eventDateRaw);
    const refundable = booking.paid && days > 7;
    const nonRefundable = booking.paid && days <= 7;

    document.getElementById("modalRefund").textContent =
      refundable ? "Refundable" :
      nonRefundable ? "Non-Refundable" :
      "N/A";

    document.getElementById("modalStatusSelect").value = booking.status || "pending";

    const paidBtn = document.getElementById("modalPaidBtn");
    paidBtn.textContent = booking.paid ? "Mark Unpaid" : "Mark Paid";

    // ============================
    // BUILD BOOKING TIMELINE
    // ============================
    const timelineEl = document.getElementById("modalTimeline");
    timelineEl.innerHTML = "";

    const events = [];

    // Created
    if (booking.createdAt) {
      events.push({
        timestamp: booking.createdAt.toDate
          ? booking.createdAt.toDate().toISOString()
          : booking.createdAt,
        text: "Booking created",
        icon: "🕒",
        dotClass: "timeline-dot-created",
        type: "created"
      });
    }

    // Current status snapshot
    events.push({
      timestamp: new Date().toISOString(),
      text: `Status: ${booking.status}`,
      icon: "📌",
      dotClass: "timeline-dot-status",
      type: "status"
    });

    // Current payment snapshot
    events.push({
      timestamp: new Date().toISOString(),
      text: booking.paid ? "Payment: Paid" : "Payment: Unpaid",
      icon: booking.paid ? "💳" : "💸",
      dotClass: booking.paid ? "timeline-dot-paid" : "timeline-dot-unpaid",
      type: "payment"
    });

    // Status history
    if (booking.statusHistory) {
      booking.statusHistory.forEach(entry => {
        events.push({
          timestamp: entry.timestamp,
          text: `Status changed to "${entry.status}"`,
          icon: "📌",
          dotClass: "timeline-dot-status",
          type: "status"
        });
      });
    }

    // Payment history
    if (booking.paymentHistory) {
      booking.paymentHistory.forEach(entry => {
        events.push({
          timestamp: entry.timestamp,
          text: entry.paid ? "Payment marked PAID" : "Payment marked UNPAID",
          icon: entry.paid ? "💳" : "💸",
          dotClass: entry.paid ? "timeline-dot-paid" : "timeline-dot-unpaid",
          type: "payment"
        });
      });
    }

    // Notes
    if (booking.timelineNotes) {
      booking.timelineNotes.forEach(entry => {
        events.push({
          timestamp: entry.timestamp,
          text: `Note: ${entry.note}`,
          icon: "📝",
          dotClass: "timeline-dot-notes",
          type: "notes"
        });
      });
    }

    // SORT
    events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // GROUP + RENDER
    let lastDate = null;
    let dayContainer = null;

    events.forEach(evt => {
      const date = new Date(evt.timestamp).toLocaleDateString();

      if (date !== lastDate) {
        const header = document.createElement("li");
        header.classList.add("timeline-date-header");
        header.innerHTML = `
          <span>${date}</span>
          <button class="timeline-toggle">▼</button>
        `;
        timelineEl.appendChild(header);

        dayContainer = document.createElement("ul");
        dayContainer.classList.add("timeline-day-container");
        timelineEl.appendChild(dayContainer);

        lastDate = date;
      }

      const li = document.createElement("li");
      li.classList.add("timeline-item", evt.dotClass);
      li.dataset.type = evt.type;
      li.dataset.tooltip = evt.type.charAt(0).toUpperCase() + evt.type.slice(1);

      li.innerHTML = `
        ${evt.icon} ${evt.text}
        <br><small>${new Date(evt.timestamp).toLocaleTimeString()}</small>
      `;

      dayContainer.appendChild(li);
    });

    // Collapsible sections
    document.querySelectorAll(".timeline-date-header").forEach(header => {
      header.addEventListener("click", () => {
        const container = header.nextElementSibling;
        container.classList.toggle("collapsed");
        const btn = header.querySelector(".timeline-toggle");
        btn.textContent = container.classList.contains("collapsed") ? "►" : "▼";
      });
    });

    // ============================
    // TIMELINE FILTERS (icons + reset + today)
    // ============================
    document.querySelectorAll("#timelineFilters button").forEach(btn => {
      btn.onclick = () => {
        const filter = btn.dataset.filter;

        // Reset
        if (filter === "reset") {
          document.querySelectorAll("#timelineFilters button").forEach(b => b.classList.remove("active"));
          document.querySelector('#timelineFilters [data-filter="all"]').classList.add("active");

          document.querySelectorAll("#modalTimeline li").forEach(li => {
            li.style.display = "";
          });
          return;
        }

        // Today
        if (filter === "today") {
          document.querySelectorAll("#timelineFilters button").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          const today = new Date().toLocaleDateString();

          document.querySelectorAll("#modalTimeline li").forEach(li => {
            if (!li.dataset.type) return; // skip headers

            const header = li.parentElement.previousElementSibling;
            const liDate = header && header.querySelector("span") ? header.querySelector("span").textContent : "";

            li.style.display = (liDate === today) ? "" : "none";
          });
          return;
        }

        // Normal filters
        document.querySelectorAll("#timelineFilters button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll("#modalTimeline li").forEach(li => {
          if (!li.dataset.type) return; // skip headers

          li.style.display =
            (filter === "all" || li.dataset.type === filter)
              ? ""
              : "none";
        });
      };
    });

    modal.classList.add("active");
    modalOverlay.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
    modalOverlay.classList.remove("active");
    activeBooking = null;
  }

  // ============================
  // BOOKING TIMELINE PDF EXPORT
  // ============================
  document.getElementById("downloadTimelinePDF").addEventListener("click", () => {
    const timeline = document.getElementById("modalTimeline").innerHTML;

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Booking Timeline PDF</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #5C1228; }
            ul { list-style: none; padding: 0; }
            li { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h2>Booking Timeline</h2>
          <ul>${timeline}</ul>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  });

  modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // ============================
  // MODAL DRAG-DOWN CLOSE
  // ============================
  let startY = 0;
  let currentY = 0;
  let dragging = false;

  modal.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    dragging = true;
  });

  modal.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    currentY = e.touches[0].clientY;

    const diff = currentY - startY;
    if (diff > 0) modal.style.transform = `translateY(${diff}px)`;
  });

  modal.addEventListener("touchend", () => {
    dragging = false;
    const diff = currentY - startY;

    if (diff > 120) closeModal();
    else modal.style.transform = "translateY(0)";
  });

  // ============================
  // MODAL ACTIONS
  // ============================
  document.getElementById("modalStatusSelect").addEventListener("change", async (e) => {
    if (!activeBooking) return;
    await db.collection("bookings").doc(activeBooking.id).update({
      status: e.target.value
    });
  });

  document.getElementById("modalPaidBtn").addEventListener("click", async () => {
    if (!activeBooking) return;
    await db.collection("bookings").doc(activeBooking.id).update({
      paid: !activeBooking.paid
    });
  });

  document.getElementById("modalSaveNotesBtn").addEventListener("click", async () => {
    if (!activeBooking) return;
    await db.collection("bookings").doc(activeBooking.id).update({
      adminNotes: document.getElementById("modalNotes").value
    });
  });

  document.getElementById("modalDeleteBtn").addEventListener("click", async () => {
    if (!activeBooking) return;
    if (!confirm("Are you sure you want to delete this booking?")) return;

    await db.collection("bookings").doc(activeBooking.id).delete();
    closeModal();
  });
  </script>

 // ====================================================
// end of whole script extracted from admin.html 
//=====================================================