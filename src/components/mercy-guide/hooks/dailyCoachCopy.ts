// src/components/mercy-guide/hooks/dailyCoachCopy.ts
//
// Bilingual copy for the daily-challenge sub-card on DailyCoachCard.
// Vietnamese is the primary surface; English is fallback for non-VN users.

export type BilingualText = { vi: string; en: string };

export const DAILY_COACH_COPY = {
  challengeHeading: {
    vi: "Thử thách hôm nay",
    en: "Today's challenge",
  },
  pendingHint: {
    vi: "Hoàn thành để nhận điểm.",
    en: "Complete to earn XP.",
  },
  inProgressLabel: {
    vi: "Đang làm…",
    en: "In progress…",
  },
  doneLabel: {
    vi: "Đã hoàn thành ✓",
    en: "Done ✓",
  },
  earnedXp: (xp: number): BilingualText => ({
    vi: `Đạt được ${xp} điểm`,
    en: `You earned ${xp} XP`,
  }),
  markDoneCta: {
    vi: "Đánh dấu đã làm",
    en: "Mark as done",
  },
  loading: {
    vi: "Đang tải thử thách…",
    en: "Loading challenge…",
  },
} as const;
