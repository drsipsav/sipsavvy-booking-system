/* ============================================================
   timeslots.js — Timeslot Generation + Selection
============================================================ */

function generateTimeslots(date) {
  const grid = document.getElementById("timeslotGrid");
  grid.innerHTML = "";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const startHour = 8;
  const endHour = 22;

  for (let hour = startHour; hour <= endHour; hour++) {
    const slot = new Date(date);
    slot.setHours(hour, 0, 0, 0);

    if (isToday && slot < now) continue;

    const label = slot.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });

    grid.innerHTML += `
      <div class="timeslot" onclick="selectTimeslot('${slot.toISOString()}')">
        ${label}
      </div>`;
  }
}

function selectTimeslot(iso) {
  localStorage.setItem("selectedTime", iso);
}

window.generateTimeslots = generateTimeslots;
window.selectTimeslot = selectTimeslot;
