// src/lib/__tests__/parentViewEntitlement.golden.test.ts
//
// Golden-flow regression lock for the ParentView paywall decision — the exact
// quality-gate class that caught demo@ (active pro through 2027) being shown
// <ParentPaywallGate/>.
//
// ParentView gates on: !useUserAccess().hasPremium, where
//   hasPremium = isPremiumTier(entitlementTier)         // useUserAccess
//              = (resolveEntitlementTier(entitlement) !== "level0")  // MR 455
//   entitlement = the canonical /me-entitlement (status + expiry, NEVER price_id)
//
// This pins the CANONICAL resolution (the function whose output drives the
// gate): a pro user with an active subscription and a FUTURE period_end must
// resolve to a paid tier (→ not paywalled); a non-pro user must resolve to
// level0 (→ paywalled). The bug class was a divergent check keyed off raw
// provider/price_id strings instead of is_premium + active status.

import { describe, it, expect } from "vitest";

import {
  resolveEntitlementTier,
  entitlementIsPremium,
  type BackendEntitlement,
} from "@/lib/authService";

// The exact predicate ParentView uses (see useUserAccess.isPremiumTier).
const wouldPaywallParentView = (ent: BackendEntitlement | null): boolean =>
  resolveEntitlementTier(ent) === "level0";

const ent = (over: Partial<BackendEntitlement>): BackendEntitlement => ({
  is_premium: false,
  source: "stripe",
  status: "inactive",
  expires_at: null,
  current_period_end: null,
  plan_name: null,
  tier_id: null,
  price_id: null,
  cancel_at_period_end: null,
  ...over,
});

// demo@-shaped: active pro subscription with a future period_end (through 2027).
const PRO_YEAR_ACTIVE_2027 = ent({
  is_premium: true,
  status: "active",
  tier_id: "premium_year",
  current_period_end: "2027-01-01T00:00:00Z",
  expires_at: "2027-01-01T00:00:00Z",
  price_id: "price_some_unknown_id", // present but MUST NOT affect the decision
});

describe("ParentView paywall — golden flow (canonical resolution)", () => {
  it("pro + active + future period_end → NOT paywalled (the demo@ case)", () => {
    expect(entitlementIsPremium(PRO_YEAR_ACTIVE_2027)).toBe(true);
    expect(resolveEntitlementTier(PRO_YEAR_ACTIVE_2027)).not.toBe("level0");
    expect(wouldPaywallParentView(PRO_YEAR_ACTIVE_2027)).toBe(false);
  });

  it("active monthly pro → NOT paywalled", () => {
    const monthly = ent({
      is_premium: true,
      status: "active",
      tier_id: "premium_month",
      current_period_end: "2027-01-01T00:00:00Z",
    });
    expect(wouldPaywallParentView(monthly)).toBe(false);
  });

  it("trialing pro → NOT paywalled", () => {
    const trialing = ent({ is_premium: true, status: "trialing", tier_id: "premium_year" });
    expect(wouldPaywallParentView(trialing)).toBe(false);
  });

  it("the decision ignores price_id — same active-pro shape with NO price_id still passes", () => {
    const noPrice = ent({
      is_premium: true,
      status: "active",
      tier_id: "premium_year",
      price_id: null,
    });
    expect(wouldPaywallParentView(noPrice)).toBe(false);
  });

  it("non-pro (inactive, not premium) → paywalled", () => {
    expect(wouldPaywallParentView(ent({ is_premium: false, status: "inactive" }))).toBe(true);
  });

  it("is_premium flag set but status NOT entitling → paywalled (status governs)", () => {
    const canceledPast = ent({ is_premium: true, status: "canceled" });
    expect(wouldPaywallParentView(canceledPast)).toBe(true);
  });

  it("null entitlement (fail-closed) → paywalled", () => {
    expect(wouldPaywallParentView(null)).toBe(true);
  });
});
