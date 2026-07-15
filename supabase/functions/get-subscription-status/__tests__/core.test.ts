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
  it("active subscription + past expiry ⇒ is_premium=false", () => {
    const snap = buildEntitlementSnapshot(
      [
        {
          status: "active",
          current_period_end: past(ONE_DAY),
          provider: "stripe",
        },
      ],
      NOW_MS
    );
    expect(snap.is_premium).toBe(false);
    expect(snap.expires_at).toBe(past(ONE_DAY));
  });

  it("lapsed projection but active subscription + future expiry ⇒ is_premium=true", () => {
    const snap = buildEntitlementSnapshot(
      [
        {
          status: "active",
          current_period_end: future(ONE_DAY),
          provider: "stripe",
        },
      ],
      NOW_MS
    );
    expect(snap.is_premium).toBe(true);
    expect(snap.status).toBe("active");
    expect(snap.source).toBe("stripe");
    expect(snap.expires_at).toBe(future(ONE_DAY));
  });

  it("active subscription + null expiry ⇒ is_premium=true (lifetime preserved)", () => {
    const snap = buildEntitlementSnapshot(
      [{ status: "active", current_period_end: null, provider: "stripe" }],
      NOW_MS
    );
    expect(snap.is_premium).toBe(true);
    expect(snap.expires_at).toBeNull();
  });

  it("active subscription + expiry === now ⇒ is_premium=false (strict)", () => {
    const snap = buildEntitlementSnapshot(
      [
        {
          status: "active",
          current_period_end: new Date(NOW_MS).toISOString(),
          provider: "stripe",
        },
      ],
      NOW_MS
    );
    expect(snap.is_premium).toBe(false);
  });

  it("null subscriptions ⇒ inactive/false", () => {
    expect(buildEntitlementSnapshot(null, NOW_MS)).toEqual({
      is_premium: false,
      status: "inactive",
      source: null,
      expires_at: null,
    });
  });

  it("empty subscriptions ⇒ inactive/false", () => {
    expect(buildEntitlementSnapshot([], NOW_MS)).toEqual({
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
          [
            {
              status: s,
              current_period_end: past(ONE_DAY),
              provider: "apple",
            },
          ],
          NOW_MS
        ).is_premium
      ).toBe(false);
      expect(
        buildEntitlementSnapshot(
          [
            {
              status: s,
              current_period_end: future(ONE_DAY),
              provider: "apple",
            },
          ],
          NOW_MS
        ).is_premium
      ).toBe(true);
    }
  });
});

describe("R2 — parity: non-entitling rows never grant premium (unchanged)", () => {
  for (const s of ["paused", "expired", "revoked", "inactive"] as const) {
    it(`subscription status='${s}' ⇒ is_premium=false regardless of expiry`, () => {
      for (const expiresAt of [null, past(ONE_DAY), future(ONE_DAY)]) {
        expect(
          buildEntitlementSnapshot(
            [
              {
                status: s,
                current_period_end: expiresAt,
                provider: "stripe",
              },
            ],
            NOW_MS
          ).is_premium
        ).toBe(false);
      }
    });
  }

  // Canceled is terminal: even a future current_period_end does not grant
  // premium after cancellation.
  it("'canceled' + past expiry ⇒ status='expired', is_premium=false", () => {
    const snap = buildEntitlementSnapshot(
      [
        {
          status: "canceled",
          current_period_end: past(ONE_DAY),
          provider: "stripe",
        },
      ],
      NOW_MS
    );
    expect(snap.status).toBe("expired");
    expect(snap.is_premium).toBe(false);
  });

  it("'canceled' + null expiry ⇒ status='expired', is_premium=false", () => {
    const snap = buildEntitlementSnapshot(
      [
        {
          status: "canceled",
          current_period_end: null,
          provider: "stripe",
        },
      ],
      NOW_MS
    );
    expect(snap.status).toBe("expired");
    expect(snap.is_premium).toBe(false);
  });

  it("'canceled' + future expiry ⇒ status='expired', is_premium=false", () => {
    const snap = buildEntitlementSnapshot(
      [
        {
          status: "canceled",
          current_period_end: future(ONE_DAY),
          provider: "stripe",
        },
      ],
      NOW_MS
    );
    expect(snap.status).toBe("expired");
    expect(snap.is_premium).toBe(false);
  });
});
