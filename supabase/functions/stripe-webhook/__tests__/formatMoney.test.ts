// supabase/functions/stripe-webhook/__tests__/formatMoney.test.ts
//
// Guards the zero-decimal currency money-path fix.
//
// BUG (pre-fix): formatMoney divided every amount by 100 unconditionally and
// rendered it with 2 fraction digits. For Stripe zero-decimal currencies
// (VND, JPY, KRW, …) Stripe's `unit_amount` is already the full amount, not
// minor units, so dividing produced a 100× UNDERSTATEMENT — a 2,000,000 VND
// charge rendered as "20000.00 VND" in customer-facing billing emails.
// Stripe reference: https://docs.stripe.com/currencies#zero-decimal

import { describe, expect, it } from "vitest";
import { formatMoney } from "../core";

describe("formatMoney — Stripe zero-decimal currencies", () => {
  it("does NOT divide VND by 100 (the 100× understatement regression)", () => {
    const out = formatMoney(2_000_000, "VND");
    expect(out).toBe("2,000,000 VND");
    // Explicit regression pins: the old bug rendered exactly "20000.00 VND".
    expect(out).not.toBe("20000.00 VND");
    expect(out).not.toContain(".00");
  });

  it("handles other zero-decimal currencies (JPY, KRW) without ÷100", () => {
    expect(formatMoney(150_000, "JPY")).toBe("150,000 JPY");
    expect(formatMoney(35_000, "KRW")).toBe("35,000 KRW");
  });

  it("uppercases lowercase currency codes before lookup", () => {
    expect(formatMoney(2_000_000, "vnd")).toBe("2,000,000 VND");
  });
});

describe("formatMoney — decimal currencies keep ÷100 behavior", () => {
  it("formats USD minor units as before (2 fraction digits)", () => {
    expect(formatMoney(2000, "USD")).toBe("20.00 USD");
    expect(formatMoney(2000, "usd")).toBe("20.00 USD");
  });

  it("groups large decimal-currency amounts", () => {
    expect(formatMoney(199_900, "USD")).toBe("1,999.00 USD");
  });

  it("formats bare amount when no currency is given (unchanged legacy path)", () => {
    expect(formatMoney(2000)).toBe("20.00");
  });
});

describe("formatMoney — defensive guards", () => {
  it("coerces non-finite amounts to 0", () => {
    expect(formatMoney(Number.NaN, "VND")).toBe("0 VND");
    expect(formatMoney(Number.POSITIVE_INFINITY, "USD")).toBe("0.00 USD");
  });

  it("treats null/undefined currency as the bare-amount path", () => {
    expect(formatMoney(5000, null)).toBe("50.00");
    expect(formatMoney(5000, undefined)).toBe("50.00");
  });
});
