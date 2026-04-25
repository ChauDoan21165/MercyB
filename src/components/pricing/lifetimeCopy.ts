// src/components/pricing/lifetimeCopy.ts
//
// Bilingual copy for the Lifetime tier shell + intent-capture dialog.
// Vietnamese-first surface; English is fallback. The fine print is
// deliberately explicit that this is intent capture, not a live offer.

export type BilingualText = { vi: string; en: string };

export const LIFETIME_COPY = {
  cardEyebrow: {
    vi: "Sản phẩm sắp ra mắt",
    en: "Coming soon",
  },
  cardTitle: {
    vi: "Học cả đời chỉ trả 1 lần",
    en: "Lifetime — pay once, learn forever",
  },
  cardPrice: {
    vi: "$199 trọn đời",
    en: "$199 one-time",
  },
  cardLead: {
    vi:
      "Một lần thanh toán duy nhất, dùng MercyBlade trọn đời. Phù hợp với người muốn cam kết lâu dài, hoặc tặng cho người thân.",
    en:
      "One single payment, MercyBlade for life. Best fit for learners committing long-term — or for gifting to family.",
  },
  bullets: {
    vi: [
      "Không phí hàng tháng, không gia hạn",
      "Mọi tính năng hiện có và tương lai — cả đời",
      "Hỗ trợ MercyBlade phát triển bền vững",
      "Có thể dùng làm quà tặng cho người thân",
    ],
    en: [
      "No monthly fees, no renewals",
      "All current and future features — for life",
      "Supports MercyBlade's long-term development",
      "Can be gifted to a family member",
    ],
  },
  cta: {
    vi: "Đăng ký ưu tiên",
    en: "Reserve a spot",
  },
  ctaAlreadySigned: {
    vi: "Bạn đã đăng ký — cảm ơn!",
    en: "You're on the list — thanks!",
  },
  waitlistCount: (n: number): BilingualText => ({
    vi: `${n} người đã đăng ký`,
    en: `${n} people have reserved`,
  }),
  finePrint: {
    vi:
      "Đây là đăng ký quan tâm — chưa phải đặt mua. Sản phẩm chưa mở bán. Khi MercyBlade quyết định ra mắt gói trọn đời, chúng tôi sẽ liên hệ qua email bạn đã cung cấp.",
    en:
      "This is interest-capture, not a purchase. Lifetime is not currently for sale. If we decide to launch it, we'll reach out via the email you provided.",
  },
  // ── Dialog ──────────────────────────────────────────────────────────────
  dialogTitle: {
    vi: "Đăng ký ưu tiên gói trọn đời",
    en: "Reserve early access — Lifetime",
  },
  dialogIntro: {
    vi:
      "Mercy chưa mở bán gói trọn đời. Nếu bạn quan tâm, để lại email để chúng tôi liên hệ khi mở. Không gửi spam.",
    en:
      "Lifetime isn't on sale yet. Leave your email and we'll reach out when we launch. No spam.",
  },
  emailLabel: { vi: "Email", en: "Email" },
  emailPlaceholder: {
    vi: "name@example.com",
    en: "name@example.com",
  },
  countryLabel: { vi: "Quốc gia (tuỳ chọn)", en: "Country (optional)" },
  countryPlaceholder: {
    vi: "Việt Nam",
    en: "Vietnam",
  },
  reasonLabel: {
    vi: "Lý do bạn quan tâm",
    en: "Why does this interest you?",
  },
  reasonOptions: {
    gift: {
      vi: "Tôi muốn tặng cho người thân",
      en: "I want to gift it to family",
    },
    commitment: {
      vi: "Tôi muốn cam kết học lâu dài",
      en: "I want to commit long-term",
    },
    savings: {
      vi: "Tôi muốn tiết kiệm so với gói năm",
      en: "I want savings vs. yearly",
    },
    other: { vi: "Khác", en: "Other" },
  },
  reasonNoteLabel: {
    vi: "Ghi chú thêm (tuỳ chọn)",
    en: "Additional notes (optional)",
  },
  submitCta: { vi: "Gửi đăng ký", en: "Submit" },
  cancelCta: { vi: "Đóng", en: "Close" },
  successTitle: { vi: "Đã ghi nhận!", en: "Thank you!" },
  successBody: {
    vi:
      "Chúng tôi đã nhận đăng ký của bạn. Khi gói trọn đời mở bán, MercyBlade sẽ gửi email cho bạn trước.",
    en:
      "We have your interest. When Lifetime launches, MercyBlade will email you first.",
  },
  errorEmail: {
    vi: "Email chưa hợp lệ. Hãy kiểm tra lại.",
    en: "Email doesn't look valid. Please check.",
  },
  errorAuth: {
    vi: "Bạn cần đăng nhập để đăng ký.",
    en: "Please sign in first to reserve.",
  },
  errorGeneric: {
    vi: "Có lỗi xảy ra. Vui lòng thử lại.",
    en: "Something went wrong. Please try again.",
  },
} as const;
