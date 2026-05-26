import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { SavingsBadge } from "../SavingsBadge";
import {
  computeYearlyPerMonth,
  computeYearlySavingsPct,
  formatPrice,
  MONTHLY_PRICE_USD,
  MONTHLY_PRICE_VND,
  YEARLY_PRICE_USD,
  YEARLY_PRICE_VND,
} from "@/lib/pricing/displayPrices";

/**
 * These tests verify the math + the rendered output of the badge.
 * Wherever possible they reference the live constants and re-derive the
 * expected output from `computeYearlySavingsPct` etc. — that way the
 * suite still passes when Chau adjusts list prices, instead of locking
 * in a literal "17%" the next price tweak would invalidate.
 */

describe("computeYearlySavingsPct", () => {
  it("matches the canonical formula for the live pricing (≈17% with current 200k/2M)", () => {
    const expected = Math.round(
      ((MONTHLY_PRICE_VND * 12 - YEARLY_PRICE_VND) / (MONTHLY_PRICE_VND * 12)) *
        100,
    );
    expect(computeYearlySavingsPct(MONTHLY_PRICE_VND, YEARLY_PRICE_VND)).toBe(
      expected,
    );
    // Sanity check: live pricing should be a non-zero, < 50% discount.
    expect(expected).toBeGreaterThan(0);
    expect(expected).toBeLessThan(50);
  });

  it("returns 17 for 200k monthly vs 2M yearly (canonical MercyBlade pricing)", () => {
    expect(computeYearlySavingsPct(200_000, 2_000_000)).toBe(17);
  });

  it("returns 25 for a 25%-off scenario (200k vs 1.8M)", () => {
    expect(computeYearlySavingsPct(200_000, 1_800_000)).toBe(25);
  });

  it("returns 0 when yearly equals 12× monthly (no savings)", () => {
    expect(computeYearlySavingsPct(100, 1200)).toBe(0);
  });

  it("returns 0 when yearly costs more than 12× monthly (anti-lie guard)", () => {
    expect(computeYearlySavingsPct(100, 1500)).toBe(0);
  });

  it("returns 0 for zero or negative monthly", () => {
    expect(computeYearlySavingsPct(0, 1000)).toBe(0);
    expect(computeYearlySavingsPct(-10, 1000)).toBe(0);
  });

  it("rounds to the nearest integer for human-friendly copy", () => {
    // 12 * 100 = 1200; yearly 901 → 24.916...% → rounds up to 25.
    // The ≤0.5% overstatement is acceptable per displayPrices.ts comment.
    expect(computeYearlySavingsPct(100, 901)).toBe(25);
    // 12 * 100 = 1200; yearly 940 → 21.66% → rounds up to 22.
    expect(computeYearlySavingsPct(100, 940)).toBe(22);
    // 12 * 100 = 1200; yearly 950 → 20.83% → rounds down to 21.
    expect(computeYearlySavingsPct(100, 950)).toBe(21);
  });
});

describe("computeYearlyPerMonth", () => {
  it("divides yearly by 12 and rounds to nearest whole unit", () => {
    // 2,000,000 / 12 = 166,666.67 → 166,667
    expect(computeYearlyPerMonth(YEARLY_PRICE_VND)).toBe(166_667);
  });

  it("rounds USD per-month to nearest whole dollar (no half cents)", () => {
    // 79.99 / 12 = 6.665... → rounds to 7
    expect(computeYearlyPerMonth(YEARLY_PRICE_USD)).toBe(7);
  });

  it("returns 0 for non-finite or zero input", () => {
    expect(computeYearlyPerMonth(0)).toBe(0);
    expect(computeYearlyPerMonth(NaN)).toBe(0);
  });
});

describe("formatPrice", () => {
  it("formats VND with space separators + suffix (matches prior copy style)", () => {
    expect(formatPrice(200_000, "VND")).toBe("200 000 VND");
    expect(formatPrice(2_000_000, "VND")).toBe("2 000 000 VND");
    expect(formatPrice(166_667, "VND")).toBe("166 667 VND");
  });

  it("formats USD as $X.XX", () => {
    expect(formatPrice(7.99, "USD")).toBe("$7.99");
    expect(formatPrice(79.99, "USD")).toBe("$79.99");
  });

  it("returns '' for non-finite amount", () => {
    expect(formatPrice(NaN, "VND")).toBe("");
    expect(formatPrice(Infinity, "USD")).toBe("");
  });
});

describe("<SavingsBadge />", () => {
  it("renders nothing when there's no actual savings", () => {
    const { container } = render(
      <SavingsBadge monthlyAmount={100} yearlyAmount={1200} currency="VND" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when yearly is more expensive than 12 monthly", () => {
    const { container } = render(
      <SavingsBadge monthlyAmount={100} yearlyAmount={1500} currency="VND" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the full variant with computed savings + per-month equiv (VND)", () => {
    const expectedPct = computeYearlySavingsPct(MONTHLY_PRICE_VND, YEARLY_PRICE_VND);
    const expectedPerMonth = formatPrice(
      computeYearlyPerMonth(YEARLY_PRICE_VND),
      "VND",
    );

    render(
      <SavingsBadge
        monthlyAmount={MONTHLY_PRICE_VND}
        yearlyAmount={YEARLY_PRICE_VND}
        currency="VND"
      />,
    );
    const node = screen.getByTestId("savings-badge-full");
    expect(node.textContent).toContain(`Save ${expectedPct}%`);
    expect(node.textContent).toContain(`Tiết kiệm ${expectedPct}%`);
    expect(node.textContent).toContain(expectedPerMonth);
    expect(node.textContent).toContain("/month");
    expect(node.textContent).toContain("/tháng");
  });

  it("renders the compact variant as a single inline pill", () => {
    const expectedPct = computeYearlySavingsPct(MONTHLY_PRICE_VND, YEARLY_PRICE_VND);
    render(
      <SavingsBadge
        monthlyAmount={MONTHLY_PRICE_VND}
        yearlyAmount={YEARLY_PRICE_VND}
        currency="VND"
        variant="compact"
      />,
    );
    expect(screen.getByTestId("savings-badge-compact").textContent).toMatch(
      new RegExp(`Save ${expectedPct}%.*Tiết kiệm ${expectedPct}%`),
    );
    expect(screen.queryByTestId("savings-badge-full")).toBeNull();
  });

  it("renders USD per-month equivalent with $ formatting", () => {
    const expectedPct = computeYearlySavingsPct(MONTHLY_PRICE_USD, YEARLY_PRICE_USD);
    const expectedPerMonth = formatPrice(
      computeYearlyPerMonth(YEARLY_PRICE_USD),
      "USD",
    );

    render(
      <SavingsBadge
        monthlyAmount={MONTHLY_PRICE_USD}
        yearlyAmount={YEARLY_PRICE_USD}
        currency="USD"
      />,
    );
    const node = screen.getByTestId("savings-badge-full");
    expect(node.textContent).toContain(`Save ${expectedPct}%`);
    expect(node.textContent).toContain(expectedPerMonth);
  });
});
