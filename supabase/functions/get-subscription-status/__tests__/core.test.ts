// supabase/functions/get-subscription-status/__tests__/core.test.ts
//
// B13 Phase 3 PR-B — R2 integration + parity coverage.
//
// `get-subscription-status` is `deprecated:true` per index.ts:122 but
// still serves browser callers (authService). Pre-PR-B the inline
// decision `const isPremium = premiumStatus === "active"` ignored
// `premium_expires_at`, so an expired-but-`active` projection row
// returned `is_premium:true`. PR-B routes that decision through the
// shared expiry-aware `deriveEntitlement`. This suite locks the new
// behavior at the `core.ts:buildEntitlementSnapshot` surface — the
// function index.ts calls.

import { describe, expect, it } from "vitest";

import { buildEntitlementSnapshot } from "../core";

const NOW_MS = new Date("2026-05-01T00:00:00.000Z").getTime();
const ONE_DAY = 24 * 60 * 60 * 1000;
const future = (ms: number) => new Date(NOW_MS + ms).toISOString();
const past = (ms: number) => new Date(NOW_MS - ms).toISOString();

describe("R2 — buildEntitlementSnapshot — expiry regression", () => {
  it("premium_status='active' + past expiry ⇒ is_premium=false (the bug)", () => {
    const snap = buildEntitlementSnapshot(
      {
        premium_status: "active",
        premium_expires_at: past(ONE_DAY),
        premium_source: "stripe",
      },
      NOW_MS,
    );
    expect(snap.is_premium).toBe(false);
    expect(snap.expires_at).toBe(past(ONE_DAY));
  });

  it("premium_status='active' + future expiry ⇒ is_premium=true (regression lock)", () => {
    const snap = buildEntitlementSnapshot(
      {
        premium_status: "active",
        premium_expires_at: future(ONE_DAY),
        premium_source: "stripe",
      },
      NOW_MS,
    );
    expect(snap.is_premium).toBe(true);
    expect(snap.status).toBe("active");
    expect(snap.source).toBe("stripe");
    expect(snap.expires_at).toBe(future(ONE_DAY));
  });

  it("premium_status='active' + null expiry ⇒ is_premium=true (gift / lifetime preserved)", () => {
    const snap = buildEntitlementSnapshot(
      {
        premium_status: "active",
        premium_expires_at: null,
        premium_source: "stripe",
      },
      NOW_MS,
    );
    expect(snap.is_premium).toBe(true);
    expect(snap.expires_at).toBeNull();
  });

  it("premium_status='active' + expiry === now ⇒ is_premium=false (strict)", () => {
    const snap = buildEntitlementSnapshot(
      {
        premium_status: "active",
        premium_expires_at: new Date(NOW_MS).toISOString(),
        premium_source: "stripe",
      },
      NOW_MS,
    );
    expect(snap.is_premium).toBe(false);
  });

  it("null profile ⇒ inactive/false", () => {
    expect(buildEntitlementSnapshot(null, NOW_MS)).toEqual({
      is_premium: false,
      status: "inactive",
      source: null,
      expires_at: null,
    });
  });

  it("missing premium_* fields ⇒ inactive/false", () => {
    expect(buildEntitlementSnapshot({}, NOW_MS)).toEqual({
      is_premium: false,
      status: "inactive",
      source: null,
      expires_at: null,
    });
  });

  it("trialing/grace_period/past_due statuses respect expiry too", () => {
    for (const s of ["trialing", "grace_period", "past_due"] as const) {
      expect(
        buildEntitlementSnapshot(
          {
            premium_status: s,
            premium_expires_at: past(ONE_DAY),
            premium_source: "apple",
          },
          NOW_MS,
        ).is_premium,
      ).toBe(false);
      expect(
        buildEntitlementSnapshot(
          {
            premium_status: s,
            premium_expires_at: future(ONE_DAY),
            premium_source: "apple",
          },
          NOW_MS,
        ).is_premium,
      ).toBe(true);
    }
  });
});

describe("R2 — parity: non-entitling rows never grant premium (unchanged)", () => {
  for (const s of ["paused", "expired", "revoked", "inactive"] as const) {
    it(`premium_status='${s}' ⇒ is_premium=false regardless of expiry`, () => {
      for (const expiresAt of [null, past(ONE_DAY), future(ONE_DAY)]) {
        expect(
          buildEntitlementSnapshot(
            {
              premium_status: s,
              premium_expires_at: expiresAt,
              premium_source: "stripe",
            },
            NOW_MS,
          ).is_premium,
        ).toBe(false);
      }
    });
  }

  // 'canceled' is special: per the long-standing me-entitlement rule
  // (entitlement.ts:145), canceled + future-expiry remaps to status
  // 'active' and grants premium (the user paid through the period).
  // Canceled + past/null expiry is 'expired' and non-premium.
  it("'canceled' + past expiry ⇒ status='expired', is_premium=false", () => {
    const snap = buildEntitlementSnapshot(
      {
        premium_status: "canceled",
        premium_expires_at: past(ONE_DAY),
        premium_source: "stripe",
      },
      NOW_MS,
    );
    expect(snap.status).toBe("expired");
    expect(snap.is_premium).toBe(false);
  });

  it("'canceled' + null expiry ⇒ status='expired', is_premium=false", () => {
    const snap = buildEntitlementSnapshot(
      {
        premium_status: "canceled",
        premium_expires_at: null,
        premium_source: "stripe",
      },
      NOW_MS,
    );
    expect(snap.status).toBe("expired");
    expect(snap.is_premium).toBe(false);
  });

  it("'canceled' + future expiry preserves status='active' (parity with main)", () => {
    // The string mapping for canceled+future stays 'active' to match the
    // documented rule in me-entitlement/entitlement.ts; is_premium is
    // still true because the row's expiry is in the future.
    const snap = buildEntitlementSnapshot(
      {
        premium_status: "canceled",
        premium_expires_at: future(ONE_DAY),
        premium_source: "stripe",
      },
      NOW_MS,
    );
    expect(snap.status).toBe("active");
    expect(snap.is_premium).toBe(true);
  });
});
