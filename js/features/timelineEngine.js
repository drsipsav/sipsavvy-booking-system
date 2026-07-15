// timelineEngine.js — Unified Timeline Rendering Engine
// Powers bookingModal + customerModal timelines
// Clean, modular, production‑ready

import { db } from "../core/firebase-init.js";

/* ============================================
   RENDER TIMELINE FOR A SINGLE BOOKING
   ============================================ */
export async function loadTimelineForBooking(bookingId, container) {
  container.innerHTML = "";

  const snapshot = await db
    .collection("bookings")
    .doc(bookingId)
    .collection("timeline")
    .orderBy("timestamp", "asc")
    .get();

  const events = snapshot.docs.map(doc => doc.data());

  // ICONS (define once)
  const icons = {
    created: "🟣",
    status: "🔵",
    payment: "🟢",
    refund: "🟡",
    note: "📝"
  };

  let currentDate = null;

  events.forEach(ev => {
    const evDate = new Date(ev.timestamp).toDateString();

    // ⭐ GROUPED DATE HEADER
    if (evDate !== currentDate) {
      currentDate = evDate;

      const header = document.createElement("div");
      header.classList.add("timeline-date-header");
      header.textContent = currentDate;
      container.appendChild(header);
    }

    // ⭐ EVENT ITEM
    const li = document.createElement("li");
    li.classList.add(`timeline-dot-${ev.type}`);

    li.innerHTML = `
      <div class="timeline-icon">${icons[ev.type] || "•"}</div>
      <div class="timeline-content">
        <strong>${ev.label}</strong><br>
        <span>${formatDate(ev.timestamp)}</span>
      </div>
    `;

    container.appendChild(li);
  });
}


/* ============================================
   FORMAT DATE
   ============================================ */
function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

/* ============================================
   ADD EVENT TO TIMELINE
   ============================================ */
export async function addTimelineEvent(bookingId, type, label) {
  const entry = {
    type,
    label,
    timestamp: Date.now(),
  };

  await db
    .collection("bookings")
    .doc(bookingId)
    .collection("timeline")
    .add(entry);
}
