// js/core/utils.js
// --------------------------------------------------
// Shared utility functions used across the admin system
// Named exports (M1) for clean modular usage
// --------------------------------------------------

// --------------------------------------------
// DATE HELPERS
// --------------------------------------------

// Returns number of days between today and an event date
export function daysBeforeEvent(dateStr) {
  if (!dateStr) return 0;
  const eventDate = new Date(dateStr);
  const today = new Date();

  const diff = eventDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Formats a timestamp into a readable date string
export function formatDate(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString();
}

// Formats a timestamp into a readable time string
export function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString();
}

// --------------------------------------------
// PAGINATION HELPERS
// --------------------------------------------

// Returns a slice of the list for the current page
export function paginate(list, currentPage, rowsPerPage) {
  const start = (currentPage - 1) * rowsPerPage;
  return list.slice(start, start + rowsPerPage);
}

// Calculates total pages
export function getTotalPages(listLength, rowsPerPage) {
  return Math.max(1, Math.ceil(listLength / rowsPerPage));
}

// --------------------------------------------
// DOM HELPERS
// --------------------------------------------

// Safe query selector
export function $(selector) {
  return document.querySelector(selector);
}

// Safe query selector all
export function $all(selector) {
  return document.querySelectorAll(selector);
}

// Creates an element with optional classes
export function createEl(tag, classList = []) {
  const el = document.createElement(tag);
  classList.forEach(c => el.classList.add(c));
  return el;
}

// --------------------------------------------
// MISC HELPERS
// --------------------------------------------

// Deep clone JSON-safe objects
export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Sort events by timestamp ascending
export function sortByTimestamp(events) {
  return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}
