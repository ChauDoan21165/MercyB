// src/components/leaderboard/referralLeaderboardCopy.ts
//
// Bilingual copy for the public monthly referral leaderboard.
// VN-primary; EN as fallback / parenthetical.

export type BilingualText = { vi: string; en: string };

export const REFERRAL_LB_COPY = {
  pageTitle: {
    vi: "Bảng xếp hạng người mời",
    en: "Referral leaderboard",
  },
  pageIntro: {
    vi:
      "Những thành viên giúp người Việt khác học tiếng Anh tốt hơn. Cập nhật mỗi ngày.",
    en:
      "Members helping other Vietnamese learners. Refreshed daily.",
  },
  thisMonth: { vi: "Tháng này", en: "This month" },
  lastMonth: { vi: "Tháng trước", en: "Last month" },
  allTime: { vi: "Mọi thời điểm", en: "All time" },
  rank: { vi: "Hạng", en: "Rank" },
  name: { vi: "Tên", en: "Name" },
  invited: { vi: "Đã mời", en: "Invited" },
  conversions: { vi: "Đã tham gia", en: "Joined" },
  empty: {
    vi:
      "Chưa có ai trên bảng tháng này. Mời một người bạn học cùng và bắt đầu từ đây nhé.",
    en: "No one is on the board yet this month — invite a friend and start here.",
  },
  notOnBoard: {
    vi:
      "Bạn chưa tham gia bảng xếp hạng người mời. Bật ở mục Tài khoản.",
    en:
      "You're not on the referral leaderboard yet. Toggle it on in Account.",
  },
  yourRank: (rank: number): BilingualText => ({
    vi: `Tháng này bạn đang ở hạng #${rank}`,
    en: `You're #${rank} this month`,
  }),
  yourRow: { vi: "Bạn", en: "You" },
  optInTitle: {
    vi: "Hiện tên trên bảng xếp hạng người mời",
    en: "Show me on the referral leaderboard",
  },
  optInBody: {
    vi:
      "Bật để xuất hiện công khai trên bảng xếp hạng người mời tháng. Tắt để ẩn nhưng vẫn giữ tiến độ mời của bạn.",
    en:
      "Turn on to appear on the public monthly referral leaderboard. Turn off to hide while keeping your referrals.",
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
  signInToOptIn: {
    vi: "Đăng nhập để tham gia bảng xếp hạng.",
    en: "Sign in to join the leaderboard.",
  },
  signupCta: {
    vi: "Đăng ký để tham gia",
    en: "Sign up to join",
  },
  inviteFriendsCta: {
    vi: "Mời bạn bè và tham gia bảng xếp hạng",
    en: "Invite friends and join the leaderboard",
  },
  loading: { vi: "Đang tải bảng xếp hạng…", en: "Loading leaderboard…" },
  errorEmpty: {
    vi: "Vui lòng nhập tên hiển thị.",
    en: "Please enter a display name.",
  },
  errorTooLong: {
    vi: "Tên hiển thị tối đa 30 ký tự.",
    en: "Display name must be 30 characters or fewer.",
  },
  errorBadChars: {
    vi: "Chỉ cho phép chữ, số, khoảng trắng, và biểu tượng ✨ 💎 🏆.",
    en: "Only letters, digits, spaces, and ✨ 💎 🏆 emoji are allowed.",
  },
  errorGeneric: {
    vi: "Có lỗi xảy ra. Vui lòng thử lại.",
    en: "Something went wrong. Please try again.",
  },
  optOutConfirm: {
    vi: "Bạn có chắc chắn muốn ẩn tên khỏi bảng xếp hạng không?",
    en: "Are you sure you want to hide your name from the leaderboard?",
  },
} as const;
