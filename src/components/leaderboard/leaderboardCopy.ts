// Bilingual copy for the LeaderboardCard.
//
// VN voice: warm, motivating, never shaming. ("Bảng xếp hạng tuần này"
// — neutral, factual, no winner/loser framing.)
// EN voice: short, clear, label-style.

export const leaderboardCopy = {
  title: {
    en: "This week's leaders",
    vi: "Bảng xếp hạng tuần này",
  },
  // Shame-audit fix (reports/streak-shame-audit-2026-04-26.md § F-7):
  // "Top learners" implicitly creates a "bottom learners" cohort and
  // missed the original VN-first review (the VN line was already
  // correct: "cứ luyện đều, vị trí sẽ tới"). EN now matches that
  // neutral tone — factual board description, no winner/loser frame.
  subtitle: {
    en: "This week's leaderboard, refreshed every Monday.",
    vi: "Cập nhật mỗi sáng thứ Hai. Cứ luyện đều, vị trí sẽ tới.",
  },
  topListHeader: {
    en: "Top 10",
    vi: "Top 10",
  },
  yourRankHeader: {
    en: "Your spot",
    vi: "Vị trí của bạn",
  },
  pointsLabel: {
    en: "pts",
    vi: "điểm",
  },
  lessonsLabel: {
    en: "lessons",
    vi: "bài",
  },
  streakLabel: {
    en: "day streak",
    vi: "ngày liên tiếp",
  },
  youAreHere: {
    en: "You",
    vi: "Bạn",
  },
  rankPrefix: {
    en: "#",
    vi: "#",
  },

  // States
  emptyTitle: {
    en: "Be the first this week",
    vi: "Hãy là người đầu tiên tuần này",
  },
  emptyBody: {
    en: "No one has scored yet. Finish a lesson to claim rank #1.",
    vi: "Chưa có ai ghi điểm. Hoàn thành một bài để đứng đầu bảng.",
  },
  notOnBoardTitle: {
    en: "Not on the board yet",
    vi: "Bạn chưa có trên bảng",
  },
  notOnBoardBody: {
    en: "Finish a lesson this week and you'll show up here.",
    vi: "Hoàn thành một bài tuần này để xuất hiện trên bảng nhé.",
  },
  loadingLabel: {
    en: "Loading leaderboard…",
    vi: "Đang tải bảng xếp hạng…",
  },

  // Anonymous fallback when a user has no display name.
  anonymousLabel: {
    en: "Learner",
    vi: "Học viên",
  },
} as const;

export type LeaderboardCopy = typeof leaderboardCopy;
