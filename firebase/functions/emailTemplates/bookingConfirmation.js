module.exports = (b, bookingId) => `
  <div style="font-family:'Segoe UI',Roboto,sans-serif;background:#f8f6f3;padding:25px;color:#333;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:30px;
              border:1px solid #e2dcd5;box-shadow:0 4px 14px rgba(0,0,0,0.08);">

    <h2 style="color:#4a0e2e;text-align:center;margin-top:0;font-size:26px;">
      Your SipSavvy Booking is Confirmed!
    </h2>

    <p style="font-size:16px;">Hi <strong>${clientName}</strong>,</p>

    <p style="font-size:15px;">
      Thank you for booking with <strong>SipSavvy Mobile Bartending</strong>.
      We’re excited to serve you and make your event unforgettable.
    </p>

    <hr style="border:none;border-top:1px solid #e2dcd5;margin:25px 0;">

    <h3 style="color:#4a0e2e;font-size:20px;margin-bottom:10px;">Booking Details</h3>

    <p><strong>Booking ID:</strong> ${bookingId}</p>
    <p><strong>Event Date:</strong> ${eventDate}</p>
    <p><strong>Event Time:</strong> ${eventTime}</p>
    <p><strong>Event Type:</strong> ${eventType}</p>
    <p><strong>Location:</strong> ${eventCity}, ${eventState}</p>

    <br>

    <h3 style="color:#4a0e2e;font-size:20px;margin-bottom:10px;">Package</h3>
    <p><strong>${packageName}</strong></p>
    <p><strong>Package Price:</strong> $${packagePrice}</p>

    <br>

    <h3 style="color:#4a0e2e;font-size:20px;margin-bottom:10px;">Add-ons</h3>
    <p><strong>Total Add-ons:</strong> $${addonsTotal}</p>

    <br>

    <h3 style="color:#4a0e2e;font-size:20px;margin-bottom:10px;">Travel</h3>
    <p><strong>Travel Fee:</strong> $${travelFee}</p>

    <br>

    <h3 style="color:#4a0e2e;font-size:20px;margin-bottom:10px;">Total</h3>
    <p style="font-size:18px;"><strong>$${total}</strong></p>

    <hr style="border:none;border-top:1px solid #e2dcd5;margin:25px 0;">

    <p style="font-size:15px;">
      If you have any questions or need to update your booking, simply reply to this email.
    </p>

    <p style="font-size:15px;color:#4a0e2e;font-weight:bold;">
      We look forward to serving you!
    </p>

    <p style="font-size:14px;color:#777;margin-top:30px;text-align:center;">
      © SipSavvy Mobile Bartending — Premium Event Services
    </p>

  </div>
</div>

`;
