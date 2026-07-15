const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { sendEmail } = require("./email");

// Import environment parameters (replaces functions.config())
const { defineSecret, defineString } = require("firebase-functions/params");

const EMAIL_USER = defineSecret("skbabs");
const EMAIL_PASS = defineSecret("AcesWild12~!");

// Optional SMTP params if you used them before
const SMTP_HOST = defineString("SMTP_HOST");
const SMTP_PORT = defineString("SMTP_PORT");

admin.initializeApp();

// Trigger: Booking Created
exports.bookingCreated = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate(async (snap, context) => {
    const booking = snap.data();

    const customerEmail = booking.email;
    const subject = "SipSavvy Booking Confirmation";

    const html = `
      <h2>Your Booking is Confirmed!</h2>
      <p>Hi ${booking.name},</p>
      <p>Thank you for booking SipSavvy Mobile Bartending.</p>
      <p>Event Date: ${booking.eventDate}</p>
      <p>Package: ${booking.package}</p>
      <p>We’ll reach out soon with more details.</p>
    `;

    await sendEmail(customerEmail, subject, html);

    return true;
  });

// Trigger: Booking Updated
exports.bookingUpdated = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Only send email if status changed
    if (before.status !== after.status) {
      const subject = `Your Booking Status Changed: ${after.status}`;
      const html = `
        <h2>Booking Status Update</h2>
        <p>Your booking status is now: <strong>${after.status}</strong></p>
      `;

      await sendEmail(after.email, subject, html);
    }

    return true;
  });
