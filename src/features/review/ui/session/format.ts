// src/features/review/ui/session/format.ts — Lane D / D5
//
// Tiny Vietnamese-facing formatting helpers for the session UI. Pure, no React.

/**
 * Format an interval in days into a short Vietnamese label for a grade button.
 * Keep it simple per the brief: "N ngày". A 0-day interval (the "Lại" case in
 * the fake/relearning path) reads as "Hôm nay" so the learner sees it stays in
 * today's session rather than a confusing "0 ngày".
 */
export function formatDays(days: number): string {
  const d = Math.max(0, Math.round(days));
  if (d === 0) return "Hôm nay";
  if (d < 30) return `${d} ngày`;
  if (d < 365) {
    const months = Math.round(d / 30);
    return `${months} tháng`;
  }
  const years = Math.round(d / 365);
  return `${years} năm`;
}

/**
 * Format an ms-epoch instant as a friendly Vietnamese date-time for the
 * completion panel's "next review" line. Falls back to a plain locale string;
 * never throws.
 */
export function formatNextDue(ms: number): string {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString();
  }
}
