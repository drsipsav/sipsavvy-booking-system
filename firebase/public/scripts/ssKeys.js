/* ============================================================
   SIPSAVVY — GLOBAL LOCALSTORAGE KEY MAP
   Single source of truth for ALL pages
============================================================ */

export const SS_KEYS = {

  /* ============================
     PACKAGE
  ============================ */
  pkgName:        "ss_pkgName",
  pkgPrice:       "ss_pkgPrice",
  pkgDesc:        "ss_pkgDesc",
  pkgMaxGuests:   "ss_pkgMaxGuests",
  pkgEvent:       "ss_pkgEvent",

  /* ============================
     ADD‑ONS
  ============================ */
  addons:         "ss_addons",
  addonsTotal:    "ss_addonsTotal",

  /* ============================
     EXTRA HOURS
  ============================ */
  extraHours:     "ss_extraHours",
  extraHoursPrice:"ss_extraHoursPrice",

  /* ============================
     TRAVEL (Unified camelCase)
  ============================ */
  travelFee:      "ss_travelFee",
  travelMiles:    "ss_travelMiles",
  travelReason:   "ss_travelReason",
  travelSummary:  "ss_travelSummary",
  travelZone:     "ss_travelZone",

  /* ============================
     EVENT DETAILS
  ============================ */
  eventDate:      "ss_eventDate",
  eventTime:      "ss_eventTime",
  eventDuration:  "ss_eventDuration",
  eventEndTime:   "ss_eventEndTime",
  eventAddress:   "ss_eventAddress",
  eventZip:       "ss_eventZip",

  /* ============================
     CONTACT
  ============================ */
  contactName:    "ss_contactName",
  contactEmail:   "ss_contactEmail",
  contactPhone:   "ss_contactPhone",
  contactNotes:   "ss_contactNotes",

  /* ============================
     TOTAL
  ============================ */
  grandTotal:     "ss_grandTotal"
};


/* ============================================================
   GLOBAL RESET FUNCTION
   (Use this on ANY page)
============================================================ */

export function ssResetAll() {
  Object.values(SS_KEYS).forEach(k => localStorage.removeItem(k));
  location.reload();
}
