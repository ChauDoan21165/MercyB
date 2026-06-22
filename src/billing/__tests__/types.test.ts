// src/billing/__tests__/types.test.ts
//
// A12 ratchet-2b — lock the SHARED_SUBSCRIPTION_STATUSES enum value.
// This is a runtime constant exported alongside the type, used by both
// the edge-function side (stripe-webhook event mapping) and the
// client-side derivation. Drift between the array and any sibling
// status-handling switch produces silent fallthrough bugs.

import { describe, it, expect } from "vitest";
import { SHARED_SUBSCRIPTION_STATUSES } from "../types";

describe("SHARED_SUBSCRIPTION_STATUSES", () => {
  it("exports exactly the 7 documented statuses, in canonical order", () => {
    // Order matters: this array drives downstream sort/index logic in
    // some callers. If you intentionally add a new status, append at
    // the end + update this test deliberately.
    expect(SHARED_SUBSCRIPTION_STATUSES).toEqual([
      "active",
      "trialing",
      "grace_period",
      "past_due",
      "paused",
      "expired",
      "revoked",
    ]);
  });

  it("is a readonly tuple (frozen-ish; assignment is a TypeScript error not a runtime guarantee)", () => {
    // We can't assert Object.isFrozen because the source uses `as const`
    // which is a TypeScript narrowing, not a runtime freeze. We assert
    // the length + structure so a refactor that changes the export
    // shape (e.g. to a Set) trips this test.
    expect(SHARED_SUBSCRIPTION_STATUSES).toHaveLength(7);
    expect(Array.isArray(SHARED_SUBSCRIPTION_STATUSES)).toBe(true);
  });

  it("contains 'active' as the first entry (entitlement-priority anchor)", () => {
    expect(SHARED_SUBSCRIPTION_STATUSES[0]).toBe("active");
  });

  it("contains both terminal-cancel statuses ('expired', 'revoked')", () => {
    expect(SHARED_SUBSCRIPTION_STATUSES).toContain("expired");
    expect(SHARED_SUBSCRIPTION_STATUSES).toContain("revoked");
  });

  it("does NOT contain provider-specific synonyms (e.g. 'incomplete', 'canceled')", () => {
    // These are Stripe-side statuses that get normalized to our shared
    // vocabulary BEFORE landing here. If one leaks in, our derivation
    // table needs updating — this test catches the regression.
    expect(SHARED_SUBSCRIPTION_STATUSES).not.toContain("incomplete");
    expect(SHARED_SUBSCRIPTION_STATUSES).not.toContain("canceled");
    expect(SHARED_SUBSCRIPTION_STATUSES).not.toContain("incomplete_expired");
  });
});
