export function daysUntil(dateString) {
  const today = new Date();
  const target = new Date(dateString);
  const diff = target - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getRefundStatus(eventDate, lastRefundDate) {
  const daysLeft = daysUntil(lastRefundDate);

  if (daysLeft > 8) return { label: "Refundable", color: "green" };
  if (daysLeft === 8) return { label: "Last Day for Refund", color: "gold" };
  if (daysLeft < 8 && daysLeft >= 0) return { label: `${daysLeft} Days Left`, color: "orange" };
  return { label: "Non‑Refundable", color: "red" };
}
