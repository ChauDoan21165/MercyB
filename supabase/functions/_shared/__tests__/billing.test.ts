// supabase/functions/_shared/__tests__/billing.test.ts
//
// B13 Phase 3 PR-B — R4 integration + parity coverage.
//
// `_shared/billing.ts:toEntitlementResponse` is the surface
// `readEntitlementForUser` returns to callers reading the
// `user_entitlements*` / `my_entitlements*` views. Pre-PR-B it
// computed `is_premium` as a status-only predicate; the `expires_at`
// field was passed through but never gated on. PR-B routes that
// decision through the shared expiry-aware `deriveEntitlement`.
//
// Imports from `../entitlementResponse` (the esm.sh-free split) so the
// vitest ESM loader doesn't choke on the `https://esm.sh/...` import
// that lives at the top of billing.ts. billing.ts re-exports both
// symbols, so the surface seen by production callers is unchanged.

import { describe, expect, it } from "vitest";

import {
  normalizeEntitlementStatus,
  toEntitlementResponse,
} from "../entitlementResponse";

const NOW_MS = new Date("2026-05-01T00:00:00.000Z").getTime();
const ONE_DAY = 24 * 60 * 60 * 1000;
const future = (ms: number) => new Date(NOW_MS + ms).toISOString();
const past = (ms: number) => new Date(NOW_MS - ms).toISOString();

describe("R4 — toEntitlementResponse — expiry regression", () => {
  it("status='active' + past expiry ⇒ is_premium=false (the bug PR-B closes)", () => {
    const res = toEntitlementResponse(
      { status: "active", expires_at: past(ONE_DAY), source: "stripe" },
      NOW_MS,
    );
    expect(res).toEqual({
      is_premium: false,
      status: "active",
      source: "stripe",
      expires_at: past(ONE_DAY),
    });
  });

  it("status='active' + future expiry ⇒ is_premium=true (regression lock)", () => {
    const res = toEntitlementResponse(
      { status: "active", expires_at: future(ONE_DAY), source: "stripe" },
      NOW_MS,
    );
    expect(res).toEqual({
      is_premium: true,
      status: "active",
      source: "stripe",
      expires_at: future(ONE_DAY),
    });
  });

  it("status='active' + null expiry ⇒ is_premium=true (no new lockout)", () => {
    const res = toEntitlementResponse(
      { status: "active", expires_at: null, source: "stripe" },
      NOW_MS,
    );
    expect(res.is_premium).toBe(true);
    expect(res.expires_at).toBeNull();
  });

  it("status='active' + expiry === now ⇒ is_premium=false (strict)", () => {
    const res = toEntitlementResponse(
      {
        status: "active",
        expires_at: new Date(NOW_MS).toISOString(),
        source: "stripe",
      },
      NOW_MS,
    );
    expect(res.is_premium).toBe(false);
  });

  it("trialing/grace_period/past_due respect expiry too", () => {
    for (const s of ["trialing", "grace_period", "past_due"] as const) {
      expect(
        toEntitlementResponse(
          { status: s, expires_at: past(ONE_DAY), source: "apple" },
          NOW_MS,
        ).is_premium,
      ).toBe(false);
      expect(
        toEntitlementResponse(
          { status: s, expires_at: future(ONE_DAY), source: "apple" },
          NOW_MS,
        ).is_premium,
      ).toBe(true);
    }
  });

  it("non-entitling statuses ⇒ never premium", () => {
    for (const s of ["paused", "expired", "revoked", "inactive"] as const) {
      for (const expiresAt of [null, past(ONE_DAY), future(ONE_DAY)]) {
        expect(
          toEntitlementResponse(
            { status: s, expires_at: expiresAt, source: "stripe" },
            NOW_MS,
          ).is_premium,
        ).toBe(false);
      }
    }
  });

  it("null row ⇒ inactive/false (unchanged)", () => {
    expect(toEntitlementResponse(null, NOW_MS)).toEqual({
      is_premium: false,
      status: "inactive",
      source: null,
      expires_at: null,
    });
  });
});

describe("R4 — source/status normalization parity (unchanged)", () => {
  it("only stripe/apple/google survive as source; everything else null", () => {
    expect(
      toEntitlementResponse(
        { status: "active", expires_at: future(ONE_DAY), source: "paypal" },
        NOW_MS,
      ).source,
    ).toBeNull();
    expect(
      toEntitlementResponse(
        { status: "active", expires_at: future(ONE_DAY), source: "gift_code" },
        NOW_MS,
      ).source,
    ).toBeNull();
    for (const src of ["stripe", "apple", "google"] as const) {
      expect(
        toEntitlementResponse(
          { status: "active", expires_at: future(ONE_DAY), source: src },
          NOW_MS,
        ).source,
      ).toBe(src);
    }
  });

  it("normalizeEntitlementStatus is unchanged from main (loose runtime guard)", () => {
    // Sanity: this helper is the *runtime* status-string guard for view
    // rows whose `status` column could be anything. The 8-value union
    // is preserved; everything outside it collapses to 'inactive'.
    expect(normalizeEntitlementStatus("active")).toBe("active");
    expect(normalizeEntitlementStatus("ACTIVE")).toBe("active");
    expect(normalizeEntitlementStatus("trialing")).toBe("trialing");
    expect(normalizeEntitlementStatus("garbage")).toBe("inactive");
    expect(normalizeEntitlementStatus(null)).toBe("inactive");
    expect(normalizeEntitlementStatus(undefined)).toBe("inactive");
  });
});
