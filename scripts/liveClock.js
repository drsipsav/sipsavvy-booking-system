/* ============================================================
   liveClock.js — Live Clock
============================================================ */

function startLiveClock() {
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    document.getElementById("liveTime").textContent =
      `${hours}:${minutes} ${ampm}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

window.startLiveClock = startLiveClock;
