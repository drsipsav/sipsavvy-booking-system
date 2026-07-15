// js/features/timelineEngine.js
// --------------------------------------------------
// Unified Timeline Engine for Booking + Customer Profile
// Builds grouped, collapsible, icon‑based timelines
// --------------------------------------------------

import { formatDate, formatTime, createEl, sortByTimestamp } from "../core/utils.js";

// --------------------------------------------------
// GROUP EVENTS BY DATE
// --------------------------------------------------
export function groupEventsByDate(events) {
  const groups = {};

  events.forEach(evt => {
    const dateKey = formatDate(evt.timestamp);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(evt);
  });

  return groups;
}

// --------------------------------------------------
// RENDER TIMELINE INTO A CONTAINER
// --------------------------------------------------
export function buildTimeline(events, container) {
  if (!container) return;

  container.innerHTML = "";

  // Sort events by timestamp
  const sorted = sortByTimestamp(events);

  // Group by date
  const grouped = groupEventsByDate(sorted);

  // Render each date section
  Object.keys(grouped).forEach(dateKey => {
    // Date header
    const header = createEl("li", ["timeline-date-header"]);
    header.innerHTML = `
      <span>${dateKey}</span>
      <button class="timeline-toggle">▼</button>
    `;
    container.appendChild(header);

    // Day container
    const dayContainer = createEl("ul", ["timeline-day-container"]);
    container.appendChild(dayContainer);

    // Render events for this date
    grouped[dateKey].forEach(evt => {
      const li = createEl("li", ["timeline-item", evt.dotClass]);
      li.dataset.type = evt.type;
      li.dataset.tooltip = evt.type.charAt(0).toUpperCase() + evt.type.slice(1);

      li.innerHTML = `
        ${evt.icon} ${evt.text}
        <br><small>${formatTime(evt.timestamp)}</small>
      `;

      dayContainer.appendChild(li);
    });
  });

  enableCollapsibleSections(container);
}

// --------------------------------------------------
// COLLAPSIBLE DATE SECTIONS
// --------------------------------------------------
export function enableCollapsibleSections(container) {
  const headers = container.querySelectorAll(".timeline-date-header");

  headers.forEach(header => {
    header.addEventListener("click", () => {
      const dayContainer = header.nextElementSibling;
      dayContainer.classList.toggle("collapsed");

      const btn = header.querySelector(".timeline-toggle");
      btn.textContent = dayContainer.classList.contains("collapsed") ? "►" : "▼";
    });
  });
}

// --------------------------------------------------
// BUILD EVENT OBJECTS (HELPER)
// --------------------------------------------------
export function createEvent({ timestamp, text, icon, dotClass, type }) {
  return {
    timestamp,
    text,
    icon,
    dotClass,
    type
  };
}
