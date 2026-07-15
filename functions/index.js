const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get all bookings
app.get("/bookings", async (req, res) => {
  try {
    const snapshot = await db.collection("bookings").orderBy("createdAt", "desc").get();
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a booking
app.post("/bookings", async (req, res) => {
  try {
    const { name, email, date, time, service, notes } = req.body;
    if (!name || !email || !date || !time || !service) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const booking = {
      name, email, date, time, service,
      notes: notes || "",
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const ref = await db.collection("bookings").add(booking);
    res.status(201).json({ id: ref.id, ...booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single booking
app.get("/bookings/:id", async (req, res) => {
  try {
    const doc = await db.collection("bookings").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Booking not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking status
app.patch("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Status must be: pending, confirmed, or cancelled" });
    }
    await db.collection("bookings").doc(req.params.id).update({ status });
    res.json({ id: req.params.id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a booking
app.delete("/bookings/:id", async (req, res) => {
  try {
    await db.collection("bookings").doc(req.params.id).delete();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.api = functions.https.onRequest(app);
