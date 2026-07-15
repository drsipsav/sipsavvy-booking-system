// Firestore Admin Dashboard Logic for SipSavvy
// --------------------------------------------

import { db } from "./firebase-init.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc
} from "firebase/firestore";

/**
 * Fetch all bookings from Firestore
 * @returns {Promise<Array>} - Array of booking objects
 */
export async function getAllBookings() {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Fetched bookings:", bookings);
    return bookings;

  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

/**
 * Fetch bookings by status (pending, approved, completed)
 * @param {string} status
 * @returns {Promise<Array>}
 */
export async function getBookingsByStatus(status) {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`Fetched ${status} bookings:`, bookings);
    return bookings;

  } catch (error) {
    console.error(`Error fetching ${status} bookings:`, error);
    throw error;
  }
}

/**
 * Update booking status (pending → approved → completed)
 * @param {string} bookingId
 * @param {string} newStatus
 * @returns {Promise<void>}
 */
export async function updateBookingStatus(bookingId, newStatus) {
  try {
    const bookingRef = doc(db, "bookings", bookingId);

    await updateDoc(bookingRef, {
      status: newStatus
    });

    console.log(`Booking ${bookingId} updated to: ${newStatus}`);

  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
}

/**
 * Example: Approve a booking
 */
export async function approveBooking(bookingId) {
  return updateBookingStatus(bookingId, "approved");
}

/**
 * Example: Mark booking as completed
 */
export async function completeBooking(bookingId) {
  return updateBookingStatus(bookingId, "completed");
}

/**
 * Example: Cancel a booking
 */
export async function cancelBooking(bookingId) {
  return updateBookingStatus(bookingId, "cancelled");
}

