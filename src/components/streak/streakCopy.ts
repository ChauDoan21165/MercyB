/**
 * Canonical bilingual copy for the streak UI.
 *
 * Single source of truth — Chau reviewed these strings on PR #32 and
 * the review-approved wording lives here. Components should import from
 * this module rather than inlining any English or Vietnamese text, so
 * future copy tweaks are one diff.
 */

export const streakTooltip = {
  en: "You're on a {{count}}-day streak! Keep it going 🔥",
  vi: "Bạn đang có chuỗi {{count}} ngày! Cố lên nhé 🔥",
};

export const labels = {
  myProgress:    "My Progress · Tiến độ của tôi",
  currentStreak: "Current streak · Chuỗi hiện tại",
  longestStreak: "Longest streak · Chuỗi dài nhất",
  lastStudied:   "Last studied · Học lần cuối",
};

export const statusPills = {
  active:  "Active · Đang duy trì",
  grace:   "Grace period · Còn ân hạn",
  warning: "Almost lost · Sắp mất chuỗi",
  reset:   "Reset · Đã reset",
};

export const graceMessage = {
  en: "You have 1 day of grace left. Study anything today to protect your streak!",
  vi: "Bạn còn 1 ngày ân hạn. Học bất kỳ gì hôm nay là giữ được chuỗi ngay!",
};

export const emptyState = {
  en: "Start learning today to build your streak!",
  vi: "Học hôm nay để bắt đầu xây dựng chuỗi của bạn nhé!",
};

/**
 * Streaks v2 — copy for the three forgiveness mechanisms surfaced on the
 * StreakBadge and StreakHistoryPanel. Voice rules:
 *   - Warm, never punitive. We do not reference "losing" or "broken".
 *   - VN first-person: dùng "bạn" (familiar), tránh từ kỹ thuật.
 *   - Each key is exactly 3 features × {en, vi} = 6 strings.
 */
export const freezeMessage = {
  en: "Freeze day on. Your streak is safe today — no need to study.",
  vi: "Đã đóng băng ngày hôm nay. Chuỗi của bạn vẫn an toàn — không cần học hôm nay.",
};

export const vacationMessage = {
  en: "Vacation mode on. Your streak is paused until you're back.",
  vi: "Chế độ nghỉ phép đang bật. Chuỗi của bạn được giữ nguyên đến khi bạn quay lại.",
};

export const insuranceMessage = {
  en: "Streak insurance available. Tap to bring your streak back this once.",
  vi: "Bạn có 1 lượt bảo hiểm chuỗi. Nhấn để khôi phục chuỗi — chỉ dùng được một lần trong tháng.",
};

/**
 * Interpolate `{{count}}` placeholders in either side of the tooltip.
 * Kept simple — no general-purpose templating lib.
 */
export function formatStreakTooltip(count: number): { en: string; vi: string } {
  return {
    en: streakTooltip.en.replace("{{count}}", String(count)),
    vi: streakTooltip.vi.replace("{{count}}", String(count)),
  };
}

/**
 * Split a "Bilingual · VietnameseLabel" string on the " · " separator.
 * Components that render EN + VI on separate lines use this; components
 * that want the combined form can use the raw string directly.
 */
export function splitBilingual(combined: string): { en: string; vi: string } {
  const idx = combined.indexOf(" · ");
  if (idx === -1) return { en: combined, vi: "" };
  return {
    en: combined.slice(0, idx),
    vi: combined.slice(idx + 3),
  };
}
