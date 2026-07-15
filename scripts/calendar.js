/* ============================================================
   calendar.js — Calendar Rendering + Date Selection
============================================================ */

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function loadCalendar(month, year) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  document.getElementById("calMonth").textContent =
    `${monthNames[month]} ${year}`;

  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += `<div class="empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === currentDate.getDate() &&
      month === currentDate.getMonth() &&
      year === currentDate.getFullYear();

    grid.innerHTML += `
      <div class="calendar-day ${isToday ? "today" : ""}"
           onclick="selectDate(${year}, ${month}, ${day})">
        ${day}
      </div>`;
  }
}

function changeMonth(direction) {
  currentMonth += direction;

  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  loadCalendar(currentMonth, currentYear);
}

function selectDate(year, month, day) {
  const selected = new Date(year, month, day);
  localStorage.setItem("selectedDate", selected.toISOString());
  generateTimeslots(selected);
}

window.loadCalendar = loadCalendar;
window.changeMonth = changeMonth;
window.selectDate = selectDate;
