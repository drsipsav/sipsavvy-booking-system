module.exports = (b, bookingId) => `
<div style="font-family:'Segoe UI',Roboto,sans-serif;background:#f8f6f3;padding:25px;color:#333;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:30px;
              border:1px solid #e2dcd5;box-shadow:0 4px 14px rgba(0,0,0,0.08);">

    <h2 style="color:#4a0e2e;text-align:center;margin-top:0;font-size:26px;">
      Your Payment Has Been Received
    </h2>

    <p style="font-size:16px;">Hi <strong>${b.clientName}</strong>,</p>

    <p style="font-size:15px;">
      Your payment for booking <strong>${bookingId}</strong> has been successfully processed.
    </p>

    <p style="font-size:15px;">
      Thank you for choosing SipSavvy Mobile Bartending — we’re excited to serve you!
    </p>

    <hr style="border:none;border-top:1px solid #e2dcd5;margin:25px 0;">

    <p><strong>Total Paid:</strong> $${b.total}</p>

    <p style="font-size:14px;color:#777;margin-top:30px;text-align:center;">
      © SipSavvy Mobile Bartending
    </p>

  </div>
</div>
`;
