/**
 * Display-only pricing constants for the Pricing screen + savings badge.
 *
 * NOT a billing source of truth — Stripe holds the canonical prices via
 * the price_id values in `Pricing.tsx` (DIRECT_ONE_MONTH_PRICE_ID,
 * DIRECT_ONE_YEAR_PRICE_ID). This module only affects what the user
 * SEES; the actual charge is determined server-side by Stripe / Apple
 * IAP / Google Play. Changes to these numbers must be paired with a
 * matching update to the corresponding Stripe product (separate
 * daytime task — see commit message).
 *
 * Why a constants module: prior to this, the displayed prices were
 * hardcoded as strings inside Pricing.tsx ("200 000 VND / month"). The
 * SavingsBadge needs the numeric amount to compute % saved + per-month
 * equivalent — duplicating the parse logic would invite drift.
 *
 * VN: số ở đây chỉ dùng để hiển thị. Khi Chau đổi giá thật trên Stripe
 * thì cập nhật chỗ này cùng một lúc, đừng để chênh.
 */

export type Currency = "VND" | "USD";

/** Standard list price for the monthly subscription (per month). */
export const MONTHLY_PRICE_VND = 200_000;
/**
 * Yearly subscription list price.
 *
 * Mirrors the live Stripe product so the displayed amount and the
 * checkout amount agree. As of 2026-04-25:
 *   12 × 200,000 = 2,400,000 VND
 *   yearly        = 2,000,000 VND
 *   savings       ≈ 17% (computed by computeYearlySavingsPct)
 *   per-month equiv ≈ 166,667 VND
 *
 * A larger discount (e.g. 25% → 1,800,000 VND) is on the roadmap but
 * deferred — clean round numbers + matching Stripe price > hitting an
 * exact target percent. Display and Stripe must stay in lock-step;
 * never set a display price the live Stripe product doesn't honor.
 */
export const YEARLY_PRICE_VND = 2_000_000;

/** USD equivalents for any en-locale callers (e.g. App Store IAP test copy). */
export const MONTHLY_PRICE_USD = 7.99;
export const YEARLY_PRICE_USD = 79.99; // 7.99 * 12 = 95.88 → ≈17% off → $79.99 (clean App-Store-style rounding)

/**
 * Compute the percent saved when paying yearly vs 12× monthly. Rounded
 * to the nearest integer for human-friendly copy — at the canonical
 * pricing (200k vs 2M), the true ratio is 16.667% which is "essentially
 * 17%". The ≤ 0.5% overstatement is acceptable; sub-decimal precision
 * in marketing copy reads worse than it reads accurate.
 */
export function computeYearlySavingsPct(
  monthlyAmount: number,
  yearlyAmount: number,
): number {
  if (!isFinite(monthlyAmount) || !isFinite(yearlyAmount) || monthlyAmount <= 0) {
    return 0;
  }
  const twelveMonths = monthlyAmount * 12;
  if (yearlyAmount >= twelveMonths) return 0;
  const ratio = (twelveMonths - yearlyAmount) / twelveMonths;
  return Math.round(ratio * 100);
}

/**
 * Per-month equivalent when paying yearly. Useful for "≈ 150,000 VND/mo"
 * copy. We round to the nearest whole currency unit — partial VND or
 * sub-cent USD would look glitchy.
 */
export function computeYearlyPerMonth(yearlyAmount: number): number {
  if (!isFinite(yearlyAmount) || yearlyAmount <= 0) return 0;
  return Math.round(yearlyAmount / 12);
}

/**
 * Format an amount in the user-facing currency.
 *
 *   formatPrice(200000, "VND") → "200,000 VND"   (en-US grouping; matches
 *                                                  existing "200 000 VND"
 *                                                  callers via the
 *                                                  formatPriceCompact helper)
 *   formatPrice(7.99, "USD")    → "$7.99"
 */
export function formatPrice(amount: number, currency: Currency): string {
  if (!isFinite(amount)) return "";
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  // VND: spaces as thousand separators (matches existing "200 000 VND"
  // copy in Pricing.tsx) for visual consistency, plus a trailing " VND".
  const formatted = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  })
    .format(Math.round(amount))
    // vi-VN locale uses "." — swap for spaces to match prior copy.
    .replace(/\./g, " ");
  return `${formatted} VND`;
}
