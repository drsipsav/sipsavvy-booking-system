const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { sendEmail } = require("./email");

// Email templates
const bookingConfirmation = require("./emailTemplates/bookingConfirmation");
const paymentConfirmation = require("./emailTemplates/paymentConfirmation");
const cancellation = require("./emailTemplates/cancellation");
const adminNotification = require("./emailTemplates/adminNotification");
const reminder = require("./emailTemplates/reminder");
const bookingApproved = require("./emailTemplates/bookingApproved");
const bookingCompleted = require("./emailTemplates/bookingCompleted");

admin.initializeApp();

/**
 * HTTP TEST ENDPOINT
 * Allows you to manually trigger ANY email template.
 *
 * Example:
 * http://localhost:5001/sipsavvy/us-central1/testEmail?type=confirmation
 */
exports.testEmail = functions.https.onRequest(async (req, res) => {
  const type = req.query.type || "confirmation";

  // Fake booking object for testing
  const b = {
    clientName: "Test User",
    clientEmail: "yourtestemail@example.com",
    eventDate: "2026-07-20",
    eventTime: "6:00 PM",
    eventType: "Wedding",
    eventCity: "New York",
    eventState: "NY",
    packageName: "Gold Mixology Package",
    packagePrice: 450,
    addonsTotal: 120,
    travelFee: 40,
    total: 610
  };

  const bookingId = "TEST12345";

  let html;
  let subject;

  switch (type) {
    case "confirmation":
      html = bookingConfirmation(b, bookingId);
      subject = "TEST — Booking Confirmation";
      break;

    case "payment":
      html = paymentConfirmation(b, bookingId);
      subject = "TEST — Payment Confirmation";
      break;

    case "cancelled":
      html = cancellation(b, bookingId);
      subject = "TEST — Booking Cancelled";
      break;

    case "admin":
      html = adminNotification(b, bookingId);
      subject = "TEST — Admin Notification";
      break;

    case "reminder":
      html = reminder(b, bookingId);
      subject = "TEST — Event Reminder";
      break;

    case "approved":
      html = bookingApproved(b, bookingId);
      subject = "TEST — Booking Approved";
      break;

    case "completed":
      html = bookingCompleted(b, bookingId);
      subject = "TEST — Booking Completed";
      break;

    default:
      return res.status(400).send("Unknown email type");
  }

  await sendEmail("yourtestemail@example.com", subject, html);

  res.send(`Email sent: ${subject}`);
});

/**
 * FIRESTORE INJECTOR
 * Creates a fake booking document to trigger real Firestore functions.
 */
exports.injectTestBooking = functions.https.onRequest(async (req, res) => {
  const bookingRef = admin.firestore().collection("bookings").doc();

  const fakeBooking = {
    clientName: "Test User",
    clientEmail: "yourtestemail@example.com",
    eventDate: "2026-07-20",
    eventTime: "6:00 PM",
    eventType: "Birthday",
    eventCity: "Brooklyn",
    eventState: "NY",
    packageName: "Silver Package",
    packagePrice: 300,
    addonsTotal: 80,
    travelFee: 30,
    total: 410,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await bookingRef.set(fakeBooking);

  res.send(`Fake booking created: ${bookingRef.id}`);
});
