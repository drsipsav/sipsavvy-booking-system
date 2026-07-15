// filters.js — Timeline + Table Filter Engine // Clean, modular, production‑ready // Supports: All, Created, Status, Payment, Notes, Today, Reset

import { formatDate } from "../core/utils.js";

// APPLY FILTERS TO TIMELINE OR TABLE DATA export function applyFilters(items, filterType) { if (!filterType || filterType === "all") return items;

const today = new Date().toDateString();

return items.filter(item => { switch (filterType) { case "created": return item.type === "created" || item.status === "Created"; 

yyyyy

  case "status":
    return item.type === "status" || item.status;

  case "payment":
    return item.type === "payment" || item.paid === true;

  case "notes":
    return item.type === "notes" || (item.notes && item.notes.trim() !== "");

  case "today":
    return formatDate(item.eventDate).toLowerCase().includes(today.toLowerCase());

  default:
    return true;
}

yyyyy

}); }

// WIRE FILTER BUTTONS export function wireFilterButtons(buttons, callback) { buttons.forEach(btn => { btn.addEventListener("click", () => { const filter = btn.dataset.filter; 

yyy

  // Remove active state
  buttons.forEach(b => b.classList.remove("active"));

  // Add active state
  btn.classList.add("active");

  // Trigger callback
  callback(filter);
});

yyyyy

}); }

// SEARCH FILTER export function applySearch(items, query) { if (!query) return items; const q = query.toLowerCase();

return items.filter(item => (item.label && item.label.toLowerCase().includes(q)) || (item.notes && item.notes.toLowerCase().includes(q)) || (item.status && item.status.toLowerCase().includes(q)) || (item.receipt && item.receipt.toLowerCase().includes(q)) ); }