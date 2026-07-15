// js/features/filters.js
// --------------------------------------------------
// Unified Timeline Filter Engine
// Works for BOTH Booking Modal + Customer Profile Modal
// --------------------------------------------------

import { $all } from "../core/utils.js";

// --------------------------------------------------
// APPLY FILTERS TO A TIMELINE
// --------------------------------------------------
export function applyTimelineFilters(filterButtonsContainer, timelineContainer) {
  if (!filterButtonsContainer || !timelineContainer) return;

  const buttons = filterButtonsContainer.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Reset active state
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Reset filter
      if (filter === "reset" || filter === "all") {
        showAllTimelineItems(timelineContainer);
        return;
      }

      // Today filter
      if (filter === "today") {
        filterToday(timelineContainer);
        return;
      }

      // Normal type filter
      filterByType(timelineContainer, filter);
    });
  });
}

// --------------------------------------------------
// SHOW ALL ITEMS
// --------------------------------------------------
export function showAllTimelineItems(container) {
  const items = container.querySelectorAll("li.timeline-item");
  items.forEach(li => (li.style.display = ""));
}

// --------------------------------------------------
// FILTER BY TYPE (created, status, payment, notes, etc.)
// --------------------------------------------------
export function filterByType(container, type) {
  const items = container.querySelectorAll("li.timeline-item");

  items.forEach(li => {
    li.style.display = li.dataset.type === type ? "" : "none";
  });
}

// --------------------------------------------------
// FILTER ONLY TODAY'S EVENTS
// --------------------------------------------------
export function filterToday(container) {
  const today = new Date().toLocaleDateString();

  const headers = container.querySelectorAll(".timeline-date-header");
  const items = container.querySelectorAll("li.timeline-item");

  items.forEach(li => {
    const header = li.parentElement.previousElementSibling;
    const headerDate = header?.querySelector("span")?.textContent || "";

    li.style.display = headerDate === today ? "" : "none";
  });
}
