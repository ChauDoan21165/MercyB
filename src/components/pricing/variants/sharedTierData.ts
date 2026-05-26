// src/components/pricing/variants/sharedTierData.ts
//
// Shared tier copy + price labels for the paywall A/B variants.
//
// Single source of truth — every variant reads from here so that
// when Chau adjusts the price string or the bullet copy, all five
// variants update at once. The actual Stripe price ids stay where
// they are (in `src/screens/Pricing.tsx`); this file only holds
// the display surface.
//
// VN-first per project policy: bilingual copy, VN as the primary
// emotional surface, EN as the support text.

import {
  formatPrice,
  MONTHLY_PRICE_VND,
  YEARLY_PRICE_VND,
} from "@/lib/pricing/displayPrices";

export type SharedPlanKey = "month" | "year";

/**
 * Absolute VND saved by paying yearly instead of 12× monthly.
 * Single source for the "save X" copy across every variant — derived
 * from the canonical price constants so it can never drift from them.
 */
export const SHARED_SAVINGS_VND = MONTHLY_PRICE_VND * 12 - YEARLY_PRICE_VND;

export type SharedPlan = {
  key: SharedPlanKey;
  title_en: string;
  title_vi: string;
  price_label: string;
  price_subtitle_vi: string;
  cta_en: string;
  cta_vi: string;
  bullets_vi: string[];
  bullets_en: string[];
};

export const SHARED_PLANS: readonly SharedPlan[] = Object.freeze([
  {
    key: "month",
    title_en: "Monthly",
    title_vi: "Hàng tháng",
    price_label: formatPrice(MONTHLY_PRICE_VND, "VND"),
    price_subtitle_vi: "mỗi tháng — hủy bất cứ lúc nào",
    cta_en: "Start monthly",
    cta_vi: "Bắt đầu theo tháng",
    bullets_vi: [
      "Toàn quyền truy cập mọi phòng premium",
      "Linh hoạt — hủy bất cứ lúc nào",
      "Phù hợp khi muốn thử trước cam kết dài",
    ],
    bullets_en: [
      "Full access to every premium room",
      "Flexible — cancel anytime",
      "Best to try before a longer commit",
    ],
  },
  {
    key: "year",
    title_en: "Yearly",
    title_vi: "Hàng năm",
    price_label: formatPrice(YEARLY_PRICE_VND, "VND"),
    price_subtitle_vi: "mỗi năm — tiết kiệm 17% (gần 2 tháng miễn phí)",
    cta_en: "Save with yearly",
    cta_vi: "Tiết kiệm với gói năm",
    bullets_vi: [
      `Tiết kiệm hơn ${formatPrice(SHARED_SAVINGS_VND, "VND")} so với gói tháng`,
      "Toàn quyền truy cập suốt năm — không gián đoạn",
      "Ít rắc rối thanh toán — yên tâm học",
    ],
    bullets_en: [
      `Save ${formatPrice(SHARED_SAVINGS_VND, "VND")} vs monthly billing`,
      "Full access all year — no interruptions",
      "Less billing friction — focus on learning",
    ],
  },
]);

export const SHARED_GUARANTEE_VI =
  "Thanh toán an toàn qua Stripe. Hủy bất cứ lúc nào. Không phí ẩn.";
export const SHARED_GUARANTEE_EN =
  "Secure Stripe checkout. Cancel anytime. No hidden fees.";
