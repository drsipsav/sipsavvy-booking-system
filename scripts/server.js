const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect("mongodb://localhost:27017/sipsavvy", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Booking schema
const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    eventDate: String,
    eventTime: String,
    guestCount: Number,
    packageName: String,
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);

// Create booking
app.post("/api/bookings", async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json({ success: true, booking });
    } catch (err) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// List bookings
app.get("/api/bookings", async (req, res) => {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Sipsavvy backend running on port ${PORT}`));
