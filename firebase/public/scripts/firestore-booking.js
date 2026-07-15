// Firestore Booking Save Logic for SipSavvy
// -----------------------------------------

import { db } from "./firebase-init.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

/**
 * Save a full booking to Firestore
 * @param {Object} bookingData - The complete booking object from booking.js
 * @returns {Promise<string>} - The Firestore document ID
 */
export async function saveBookingToFirestore(bookingData) {
  try {
    // Add server timestamp
    bookingData.createdAt = serverTimestamp();

    // Save to Firestore "bookings" collection
    const docRef = await addDoc(collection(db, "bookings"), bookingData);

    console.log("Booking saved with ID:", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("Error saving booking:", error);
    throw error;
  }
}

/**
 * Build the booking object from your booking.js state
 * @param {Object} state - The booking state object from booking.js
 * @returns {Object} - Clean Firestore-ready booking object
 */
export function buildBookingObject(state) {
  return {
    // Client Info
    clientName: state.clientName || "",
    clientEmail: state.clientEmail || "",
    clientPhone: state.clientPhone || "",

    // Event Info
    eventDate: state.eventDate || "",
    eventTime: state.eventTime || "",
    eventType: state.eventType || "",
    eventLocation: state.eventLocation || "",
    eventAddress: state.eventAddress || "",
    eventCity: state.eventCity || "",
    eventState: state.eventState || "",
    eventZip: state.eventZip || "",

    // Package Info
    packageId: state.packageId || "",
    packageName: state.packageName || "",
    packagePrice: state.packagePrice || 0,

    // Add-ons
    addons: state.addons || [],
    addonsTotal: state.addonsTotal || 0,

    // Travel Info
    travelMiles: state.travelMiles || 0,
    travelFee: state.travelFee || 0,
    travelZone: state.travelZone || "",
    travelReason: state.travelReason || "",

    // Totals
    subtotal: state.subtotal || 0,
    tax: state.tax || 0,
    total: state.total || 0,

    // Status
    status: "pending"
  };
}
