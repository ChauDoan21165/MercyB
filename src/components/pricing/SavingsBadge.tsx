/**
 * SavingsBadge — visual call-out for the yearly tier.
 *
 * Two stacked lines (current pricing 200k/2M):
 *   1. "Save 17% · Tiết kiệm 17%"       (% saved vs 12× monthly)
 *   2. "≈ 166 667 VND/month"             (per-month equivalent paid yearly)
 *
 * Caller passes the raw numeric amounts and currency; this component
 * does the math + formatting. Returns null when there's no actual
 * savings (yearly ≥ 12× monthly) so the badge never lies.
 */

import React from "react";

import {
  computeYearlyPerMonth,
  computeYearlySavingsPct,
  formatPrice,
  type Currency,
} from "@/lib/pricing/displayPrices";

export type SavingsBadgeProps = {
  /** Monthly list price in `currency` units. */
  monthlyAmount: number;
  /** Yearly list price in `currency` units. */
  yearlyAmount: number;
  /** Currency tag — drives formatting (VND uses spaces, USD uses $). */
  currency: Currency;
  /**
   * Visual variant.
   *   "compact" — single-line pill, used inside PricingToggle next to "Yearly"
   *   "full"    — two-line block with per-month equivalent, used in cards
   * Default: "full".
   */
  variant?: "compact" | "full";
};

const compactStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "2px 10px",
  borderRadius: 9999,
  background: "rgba(16,185,129,0.16)",
  color: "#065f46",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
};

const fullWrapStyle: React.CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  gap: 2,
  padding: "8px 12px",
  borderRadius: 12,
  background: "rgba(16,185,129,0.10)",
  color: "#065f46",
  border: "1px solid rgba(16,185,129,0.22)",
};

const fullPctLineStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 900,
  lineHeight: 1.3,
};

const fullPctViStyle: React.CSSProperties = {
  marginLeft: 6,
  fontSize: 11,
  fontWeight: 600,
  color: "#0f766e",
  letterSpacing: "0.01em",
};

const fullPerMonthStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#0f766e",
  lineHeight: 1.3,
};

const fullPerMonthViStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontWeight: 500,
  color: "rgba(15,118,110,0.78)",
  marginTop: 1,
};

export function SavingsBadge({
  monthlyAmount,
  yearlyAmount,
  currency,
  variant = "full",
}: SavingsBadgeProps): React.ReactElement | null {
  const pct = computeYearlySavingsPct(monthlyAmount, yearlyAmount);
  if (pct <= 0) return null;

  const perMonth = computeYearlyPerMonth(yearlyAmount);
  const perMonthFormatted = formatPrice(perMonth, currency);

  if (variant === "compact") {
    return (
      <span style={compactStyle} data-testid="savings-badge-compact">
        Save {pct}%
        <span aria-hidden="true">·</span>
        <span style={{ fontWeight: 600 }}>Tiết kiệm {pct}%</span>
      </span>
    );
  }

  return (
    <div style={fullWrapStyle} data-testid="savings-badge-full">
      <div style={fullPctLineStyle}>
        Save {pct}%
        <span style={fullPctViStyle}>· Tiết kiệm {pct}%</span>
      </div>
      <div style={fullPerMonthStyle}>
        ≈ {perMonthFormatted}/month
        <span style={fullPerMonthViStyle}>
          tương đương {perMonthFormatted}/tháng nếu trả theo năm
        </span>
      </div>
    </div>
  );
}

export default SavingsBadge;
