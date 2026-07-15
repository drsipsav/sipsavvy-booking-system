const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { sendEmail } = require("./email");

exports.refundWarning = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const now = new Date();
    const eightDaysFromNow = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);

    const targetDate = eightDaysFromNow.toISOString().split("T")[0];

    const snap = await admin.firestore()
      .collection("bookings")
      .where("eventDate", "==", targetDate)
      .where("paymentStatus", "==", "paid")
      .get();

    snap.forEach(async (doc) => {
      const b = doc.data();

      await sendEmail(b.email, "Last Day to Cancel with Full Refund", `
        <div style="font-family:Inter;padding:20px;">
          <h2 style="color:#5C1228;">Last Day for Full Refund</h2>
          <p>Hi ${b.customerName},</p>
          <p>Your SipSavvy event is on <strong>${b.eventDate}</strong>.</p>
          <p>Today is the <strong>last day</strong> you can cancel and receive a full refund.</p>
          <p>After today, your booking becomes <strong>non‑refundable</strong>.</p>
          <br>
          <p style="color:#5C1228;">If you need to cancel, please contact us immediately.</p>
        </div>
      `);
    });
  });
