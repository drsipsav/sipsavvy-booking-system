import { db } from "./core/firebase-init.js";

// Fetch bookings
async function getBookings() {
  const snap = await db.collection("bookings").get();
  return snap.docs.map(doc => doc.data());
}

function groupByMonth(bookings, field) {
  const months = Array(12).fill(0);
  bookings.forEach(b => {
    const date = new Date(b.eventDate);
    const m = date.getMonth();
    months[m] += field ? Number(b[field] || 0) : 1;
  });
  return months;
}

function groupByPackage(bookings) {
  const map = {};
  bookings.forEach(b => {
    map[b.packageName] = (map[b.packageName] || 0) + 1;
  });
  return map;
}

function renderCharts(bookings) {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // Bookings per month
  new Chart(document.getElementById("bookingsChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Bookings",
        data: groupByMonth(bookings),
        borderColor: "#FFD700",
        backgroundColor: "rgba(255,215,0,0.2)",
        tension: 0.3
      }]
    }
  });

  // Revenue per month
  new Chart(document.getElementById("revenueChart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [{
        label: "Revenue ($)",
        data: groupByMonth(bookings, "totalPrice"),
        backgroundColor: "#5C1228"
      }]
    }
  });

  // Package popularity
  const pkg = groupByPackage(bookings);
  new Chart(document.getElementById("packageChart"), {
    type: "pie",
    data: {
      labels: Object.keys(pkg),
      datasets: [{
        data: Object.values(pkg),
        backgroundColor: ["#FFD700", "#E8C4B8", "#5C1228", "#3C0F1E"]
      }]
    }
  });
}

(async () => {
  const bookings = await getBookings();
  renderCharts(bookings);
})();
