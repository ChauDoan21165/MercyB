/**
 * Canonical bilingual copy for the streak UI.
 *
 * Single source of truth — Chau reviewed these strings on PR #32 and
 * the review-approved wording lives here. Components should import from
 * this module rather than inlining any English or Vietnamese text, so
 * future copy tweaks are one diff.
 */

export const streakTooltip = {
  en: "{{count}} days in a row. Nice steady practice.",
  vi: "Bạn đã học {{count}} ngày liên tiếp. Nhịp học đang đều.",
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
  // Shame-audit fix (PR #...): renamed from "Almost lost / Sắp mất chuỗi"
  // to a non-loss frame. The grace day is a kindness; the pill should
  // name the kindness, not the absence of it. See
  // reports/streak-shame-audit-2026-04-26.md § F-1.
  warning: "Grace day open · Còn ngày ân hạn",
  reset:   "Restarted · Bắt đầu lại",
};

export const graceMessage = {
  // Shame-audit fix: the prior "Study anything today to protect your
  // streak" framing volunteered loss as the motivator. Replaced with
  // permission-to-rest framing that names tiredness explicitly. See
  // reports/streak-shame-audit-2026-04-26.md § F-2.
  en: "You still have a grace day — a few minutes today is enough. If you're tired, that's okay too.",
  vi: "Bạn còn ngày ân hạn — học vài phút hôm nay là đủ. Mệt thì cũng không sao.",
};

export const emptyState = {
  en: "Start learning today to build your streak!",
  vi: "Học một chút hôm nay để bắt đầu nhịp học của bạn nhé.",
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
 * Shame-audit fix (PR #...): surfaced on warning + reset states inside
 * StreakHistoryPanel so users in the warning/reset window see the
 * forgiveness mechanisms (vacation, freeze) instead of only a grace
 * countdown. Reason: the previous panel only nudged users toward
 * studying NOW; the rest-permission line names that resting is a
 * supported, first-class option. See
 * reports/streak-shame-audit-2026-04-26.md § F-8.
 */
export const restPermissionMessage = {
  en: "Tired? Turn on vacation mode — your streak pauses until you're back.",
  vi: "Mệt thì có thể bật chế độ nghỉ phép — chuỗi sẽ tạm dừng đến khi bạn quay lại.",
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
