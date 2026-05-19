// supabase/functions/_shared/__tests__/premiumEntitlement.test.ts
//
// Locks the entitlement decision that azure-phoneme + mock-interview
// now share. The whole point of the helper is the B17 bug class: a
// paying user must never be denied because `profiles.tier` (TEXT) was
// read as a number. These tests assert the THREE money-path cases the
// dispatch called out plus the dunning-window caveat (B13 #3).

import { describe, it, expect } from "vitest";

import {
  isPremiumEntitled,
  type PremiumEntitlementRow,
} from "../premiumEntitlement";

const NOW = Date.parse("2026-05-19T00:00:00Z");
const FUTURE = "2026-12-31T00:00:00Z";
const PAST = "2020-01-01T00:00:00Z";

function row(p: Partial<PremiumEntitlementRow>): PremiumEntitlementRow {
  return {
    premium_status: null,
    premium_expires_at: null,
    tier: null,
    ...p,
  };
}

describe("isPremiumEntitled — money-path bypass (B17)", () => {
  it("active + future expiry → entitled", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "active", premium_expires_at: FUTURE }),
        NOW,
      ),
    ).toBe(true);
  });

  it("trialing + future expiry → entitled", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "trialing", premium_expires_at: FUTURE }),
        NOW,
      ),
    ).toBe(true);
  });

  it("paid (premium_status='active') with an EXPIRED trial timestamp → entitled (Mylinh case)", () => {
    // The discovered case: paid AFTER the trial lapsed. tier is the
    // useless TEXT '0' it always is in prod; the active subscription
    // is what must grant access.
    expect(
      isPremiumEntitled(
        row({
          premium_status: "active",
          premium_expires_at: FUTURE,
          tier: "0",
        }),
        NOW,
      ),
    ).toBe(true);
  });

  it("active but premium_expires_at in the PAST → NOT entitled (genuinely lapsed)", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "active", premium_expires_at: PAST }),
        NOW,
      ),
    ).toBe(false);
  });

  it("active with null premium_expires_at → entitled (billing not yet stamped — fail toward access)", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "active", premium_expires_at: null }),
        NOW,
      ),
    ).toBe(true);
  });

  it("active with an unparseable premium_expires_at → entitled (fail-open, same as trial gate)", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "active", premium_expires_at: "not-a-date" }),
        NOW,
      ),
    ).toBe(true);
  });
});

describe("isPremiumEntitled — dunning window (B13 caveat #3)", () => {
  it("past_due → entitled even with an expired premium_expires_at", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "past_due", premium_expires_at: PAST }),
        NOW,
      ),
    ).toBe(true);
  });

  it("grace_period → entitled even with a null premium_expires_at", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "grace_period", premium_expires_at: null }),
        NOW,
      ),
    ).toBe(true);
  });

  it("past_due is case-insensitive ('Past_Due')", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "Past_Due", premium_expires_at: PAST }),
        NOW,
      ),
    ).toBe(true);
  });
});

describe("isPremiumEntitled — truly free / not entitled", () => {
  it("inactive + tier '0' → blocked", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "inactive", tier: "0" }),
        NOW,
      ),
    ).toBe(false);
  });

  it("empty status + null tier → blocked", () => {
    expect(isPremiumEntitled(row({}), NOW)).toBe(false);
  });

  it("status 'canceled' past its expiry → blocked", () => {
    expect(
      isPremiumEntitled(
        row({ premium_status: "canceled", premium_expires_at: PAST }),
        NOW,
      ),
    ).toBe(false);
  });

  it("null / undefined row → blocked", () => {
    expect(isPremiumEntitled(null, NOW)).toBe(false);
    expect(isPremiumEntitled(undefined, NOW)).toBe(false);
  });
});

describe("isPremiumEntitled — defensive tier-string fallback (email-reengagement pattern)", () => {
  it("no premium_status but tier '2' (TEXT) → entitled — never denied on premium_status drift", () => {
    expect(isPremiumEntitled(row({ tier: "2" }), NOW)).toBe(true);
  });

  it("tier '0' string → blocked (free)", () => {
    expect(isPremiumEntitled(row({ tier: "0" }), NOW)).toBe(false);
  });

  it("tier 'free' string → blocked", () => {
    expect(isPremiumEntitled(row({ tier: "free" }), NOW)).toBe(false);
  });

  it("legacy numeric tier 2 is still honored (never coerced AWAY — only the dead numeric BYPASS was the bug)", () => {
    expect(isPremiumEntitled(row({ tier: 2 }), NOW)).toBe(true);
  });
});
