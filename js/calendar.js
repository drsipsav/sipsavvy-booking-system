import { db } from "./core/firebase-init.js";

async function getBookings() {
  const snap = await db.collection("bookings").get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

document.addEventListener("DOMContentLoaded", async () => {
  const bookings = await getBookings();

  const events = bookings.map(b => ({
    id: b.id,
    title: `${b.customerName} — ${b.packageName}`,
    start: b.eventDate,
    backgroundColor: "#5C1228",
    borderColor: "transparent"
  }));

  const calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
    initialView: "dayGridMonth",
    height: "auto",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    events,
    eventClick(info) {
      window.location.href = `admin.html?booking=${info.event.id}`;
    }
  }
);

  calendar.render();
});

import { getRefundStatus } from "./utils/refund.js";

const refund = getRefundStatus(b.eventDate, b.lastRefundDate);

events.push({
  id: b.id,
  title: `${b.customerName} — ${refund.label}`,
  start: b.eventDate,
  backgroundColor: refund.color === "gold" ? "#FFD700" : "#5C1228",
  textColor: refund.color === "gold" ? "#5C1228" : "white"
});

