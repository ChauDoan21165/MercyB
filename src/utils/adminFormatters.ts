// Shared formatting helpers for admin pages. Keeps date/time rendering
// consistent across Feedback, Subscriptions, Billing, and Monitoring views.

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}
