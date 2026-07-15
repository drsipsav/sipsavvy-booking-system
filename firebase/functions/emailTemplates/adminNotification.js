module.exports = (b, bookingId) => `
<div style="font-family:'Segoe UI',Roboto,sans-serif;background:#fff;padding:25px;color:#333;">
  <h2 style="color:#4a0e2e;margin-top:0;">New Booking Received</h2>

  <p><strong>Booking ID:</strong> ${bookingId}</p>
  <p><strong>Name:</strong> ${b.clientName}</p>
  <p><strong>Email:</strong> ${b.clientEmail}</p>
  <p><strong>Event Date:</strong> ${b.eventDate}</p>
  <p><strong>Package:</strong> ${b.packageName}</p>
  <p><strong>Total:</strong> $${b.total}</p>

  <p style="margin-top:20px;">
    View full booking in the admin dashboard.
  </p>
</div>
`;
