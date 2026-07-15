email template

const refund = getRefundStatus(b.eventDate, b.lastRefundDate);

const refundHTML = `
  <p><strong>Refund Status:</strong> ${refund.label}</p>
  <p>Last day for full refund: <strong>${b.lastRefundDate}</strong></p>
`;
