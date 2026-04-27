// src/components/leaderboard/weeklyLeaderboardCopy.ts
//
// Bilingual copy for the public weekly pronunciation leaderboard.
// VN-primary; EN as fallback / parenthetical.

export type BilingualText = { vi: string; en: string };

export const WEEKLY_LB_COPY = {
  pageTitle: { vi: "Bảng xếp hạng tuần", en: "Weekly leaderboard" },
  pageIntro: {
    vi:
      "Tổng điểm phát âm của tất cả thành viên trong tuần này. Cập nhật theo thời gian thực mỗi khi có ai đó luyện Speak.",
    en:
      "Total pronunciation score across MercyBlade learners for this week. Real-time as everyone practises Speak.",
  },
  thisWeek: { vi: "Tuần này", en: "This week" },
  rank: { vi: "Hạng", en: "Rank" },
  name: { vi: "Tên", en: "Name" },
  score: { vi: "Điểm", en: "Score" },
  attempts: { vi: "Lượt nói", en: "Attempts" },
  empty: {
    vi: "Chưa có ai vào bảng tuần này. Bạn vào Speak luyện vài câu để khởi động nhé!",
    en: "No one on the board yet this week. Hit Speak to be the first.",
  },
  notOnBoard: {
    vi: "Bạn chưa tham gia bảng xếp hạng. Bật ở mục Tài khoản để hiện tên của bạn.",
    en:
      "You're not on the leaderboard yet. Toggle it on in Account to show your name.",
  },
  yourRow: { vi: "Bạn", en: "You" },
  yourRank: (rank: number): BilingualText => ({
    vi: `Bạn đang hạng #${rank} tuần này`,
    en: `You're #${rank} this week`,
  }),
  optInTitle: { vi: "Hiện tên trên bảng xếp hạng", en: "Show me on the leaderboard" },
  optInBody: {
    vi:
      "Bật để xuất hiện công khai trên Bảng xếp hạng tuần. Tắt để ẩn nhưng vẫn giữ điểm.",
    en:
      "Turn on to appear on the public weekly leaderboard. Turn off to hide but keep your score.",
  },
  displayNameLabel: {
    vi: "Tên hiển thị (tối đa 30 ký tự)",
    en: "Display name (up to 30 characters)",
  },
  displayNamePlaceholder: {
    vi: "Tên bạn muốn cho mọi người thấy",
    en: "Name you'd like everyone to see",
  },
  emojiHint: {
    vi: "Có thể thêm ✨ 💎 🏆 (chỉ ba biểu tượng này thôi).",
    en: "You can add ✨ 💎 🏆 — only those three emoji.",
  },
  saveCta: { vi: "Lưu", en: "Save" },
  optOutCta: { vi: "Tắt bảng xếp hạng", en: "Hide me from the leaderboard" },
  savedFeedback: { vi: "Đã lưu", en: "Saved" },
  errorEmpty: { vi: "Vui lòng nhập tên hiển thị.", en: "Please enter a display name." },
  errorTooLong: {
    vi: "Tên hiển thị tối đa 30 ký tự.",
    en: "Display name must be 30 characters or fewer.",
  },
  errorBadChars: {
    vi:
      "Chỉ cho phép chữ, số, khoảng trắng, và biểu tượng ✨ 💎 🏆.",
    en:
      "Only letters, digits, spaces, and ✨ 💎 🏆 emoji are allowed.",
  },
  errorGeneric: {
    vi: "Có lỗi xảy ra. Vui lòng thử lại.",
    en: "Something went wrong. Please try again.",
  },
  signInToOptIn: {
    vi: "Đăng nhập để tham gia bảng xếp hạng.",
    en: "Sign in to join the leaderboard.",
  },
  loading: { vi: "Đang tải bảng xếp hạng…", en: "Loading leaderboard…" },
} as const;
