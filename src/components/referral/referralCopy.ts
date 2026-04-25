// src/components/referral/referralCopy.ts
//
// Bilingual copy for the referral surfaces. Vietnamese is primary;
// English is fallback for non-VN users. Reward is "7 ngày miễn phí
// cho cả hai" — delivery deferred (see PR description) but the copy
// is locked now so it can be reviewed.

export type BilingualText = { vi: string; en: string };

export const REFERRAL_COPY = {
  cardHeading: {
    vi: "Mời bạn bè",
    en: "Invite friends",
  },
  cardSubheading: {
    vi: "Cả hai cùng được 7 ngày miễn phí",
    en: "Both of you get 7 free days",
  },
  yourCodeLabel: {
    vi: "Mã của bạn",
    en: "Your code",
  },
  copyCta: {
    vi: "Sao chép mã",
    en: "Copy code",
  },
  copiedFeedback: {
    vi: "Đã sao chép",
    en: "Copied",
  },
  copyLinkCta: {
    vi: "Sao chép đường dẫn",
    en: "Copy link",
  },
  shareFacebookCta: {
    vi: "Chia sẻ Facebook",
    en: "Share to Facebook",
  },
  shareZaloCta: {
    vi: "Chia sẻ Zalo",
    en: "Share to Zalo",
  },
  usesCount: (n: number): BilingualText => ({
    vi: `${n} bạn đã dùng mã của bạn`,
    en: `${n} friends used your code`,
  }),
  loadingCode: {
    vi: "Đang tạo mã…",
    en: "Generating code…",
  },
  generateError: {
    vi: "Chưa tạo được mã. Thử lại sau nhé.",
    en: "Couldn't generate a code. Try again later.",
  },
  applyHeading: {
    vi: "Bạn có mã giới thiệu?",
    en: "Have a referral code?",
  },
  applyInputPlaceholder: {
    vi: "Nhập mã 6 ký tự",
    en: "Enter your 6-character code",
  },
  applyCta: {
    vi: "Áp dụng mã",
    en: "Apply code",
  },
  applySuccess: {
    vi: "Đã áp dụng. Phần thưởng sẽ kích hoạt khi gói của bạn được nâng cấp.",
    en: "Code applied. Your reward will activate when your plan is upgraded.",
  },
  applyErrorInvalid: {
    vi: "Mã không hợp lệ.",
    en: "That code is not valid.",
  },
  applyErrorSelf: {
    vi: "Không thể tự dùng mã của chính mình.",
    en: "You can't redeem your own code.",
  },
  applyErrorAlreadyUsed: {
    vi: "Bạn đã dùng mã này rồi.",
    en: "You already redeemed this code.",
  },
  applyErrorGeneric: {
    vi: "Có lỗi xảy ra. Thử lại nhé.",
    en: "Something went wrong. Try again.",
  },
  shareMessage: (code: string, url: string): BilingualText => ({
    vi: `Mình đang học tiếng Anh trên MercyBlade — bạn dùng mã ${code} để cả hai cùng được 7 ngày miễn phí: ${url}`,
    en: `I'm learning English on MercyBlade — use code ${code} so we both get 7 free days: ${url}`,
  }),
} as const;
