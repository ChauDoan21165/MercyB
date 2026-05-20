// supabase/functions/stripe-webhook/__tests__/deriveEntitlement.test.ts
//
// B13 Phase 3 PR-B — R3 integration + parity coverage.
//
// `stripe-webhook/core.ts:deriveEntitlementFromSubscriptions` is the
// WRITE-path derive — it produces the snapshot `billing.ts:542
// recomputeAndPersistEntitlement` persists to `profiles.premium_*`.
// Pre-PR-B, it ranked entitling rows by latest `current_period_end`
// and emitted `status: "active"` without ever checking `> now`. An
// active row with a past expiry would write a premium projection.
// PR-B delegates the entire decision to the shared
// `deriveEntitlement(rows, now)`. The output shape is preserved.
//
// `now` is injected throughout — no fake timers — because the
// production API now takes `now` as a parameter (parity with R1 and
// R2 testing styles).

import { describe, expect, it } from "vitest";

import {
  deriveEntitlementFromSubscriptions,
  isEntitlingSubscription,
} from "../core";

const NOW_MS = new Date("2026-05-01T00:00:00.000Z").getTime();
const ONE_DAY = 24 * 60 * 60 * 1000;
const future = (ms: number) => new Date(NOW_MS + ms).toISOString();
const past = (ms: number) => new Date(NOW_MS - ms).toISOString();

describe("R3 — deriveEntitlementFromSubscriptions — expiry regression", () => {
  it("active + past expiry ⇒ status='inactive', source=null (the bug PR-B closes)", () => {
    const snap = deriveEntitlementFromSubscriptions(
      [{ status: "active", current_period_end: past(ONE_DAY), provider: "stripe" }],
      NOW_MS,
    );
    expect(snap).toEqual({
      status: "inactive",
      expires_at: null,
      source: null,
    });
  });

  it("active + future expiry ⇒ status='active' with expiry/source preserved", () => {
    const snap = deriveEntitlementFromSubscriptions(
      [{ status: "active", current_period_end: future(ONE_DAY), provider: "stripe" }],
      NOW_MS,
    );
    expect(snap).toEqual({
      status: "active",
      expires_at: future(ONE_DAY),
      source: "stripe",
    });
  });

  it("active + null expiry ⇒ status='active', expiry=null (lifetime/no-period)", () => {
    const snap = deriveEntitlementFromSubscriptions(
      [{ status: "active", current_period_end: null, provider: "stripe" }],
      NOW_MS,
    );
    expect(snap.status).toBe("active");
    expect(snap.expires_at).toBeNull();
    expect(snap.source).toBe("stripe");
  });

  it("trialing/grace_period/past_due respect expiry too", () => {
    for (const s of ["trialing", "grace_period", "past_due"] as const) {
      expect(
        deriveEntitlementFromSubscriptions(
          [{ status: s, current_period_end: past(ONE_DAY), provider: "apple" }],
          NOW_MS,
        ),
      ).toEqual({ status: "inactive", expires_at: null, source: null });

      expect(
        deriveEntitlementFromSubscriptions(
          [{ status: s, current_period_end: future(ONE_DAY), provider: "apple" }],
          NOW_MS,
        ).status,
      ).toBe("active");
    }
  });

  it("empty rows ⇒ inactive snapshot", () => {
    expect(deriveEntitlementFromSubscriptions([], NOW_MS)).toEqual({
      status: "inactive",
      expires_at: null,
      source: null,
    });
  });

  it("non-entitling row(s) only ⇒ inactive snapshot", () => {
    const snap = deriveEntitlementFromSubscriptions(
      [
        { status: "expired", current_period_end: past(ONE_DAY), provider: "stripe" },
        { status: "revoked", current_period_end: past(ONE_DAY), provider: "apple" },
      ],
      NOW_MS,
    );
    expect(snap).toEqual({ status: "inactive", expires_at: null, source: null });
  });
});

describe("R3 — multi-row winner (status-rank-first; was latest-CPE-only pre-PR-B)", () => {
  // Documented intentional consolidation: the new winner-selection uses
  // statusRank (active > trialing > grace_period > past_due), tie-break
  // by latest expiry. Pre-PR-B this function ranked entitling rows by
  // latest expiry only. Multi-row contention with mixed entitling
  // statuses is rare in production; the consolidation matches the read
  // path (R1) and is explicitly called out in the PR description.
  it("active row wins over trialing with later expiry", () => {
    const snap = deriveEntitlementFromSubscriptions(
      [
        { status: "trialing", current_period_end: future(30 * ONE_DAY), provider: "apple" },
        { status: "active", current_period_end: future(ONE_DAY), provider: "stripe" },
      ],
      NOW_MS,
    );
    expect(snap.status).toBe("active");
    expect(snap.source).toBe("stripe");
    expect(snap.expires_at).toBe(future(ONE_DAY));
  });

  it("between two active rows, latest expiry wins (tie-break unchanged)", () => {
    const snap = deriveEntitlementFromSubscriptions(
      [
        { status: "active", current_period_end: future(ONE_DAY), provider: "apple" },
        { status: "active", current_period_end: future(30 * ONE_DAY), provider: "stripe" },
      ],
      NOW_MS,
    );
    expect(snap.expires_at).toBe(future(30 * ONE_DAY));
    expect(snap.source).toBe("stripe");
  });

  it("expired row contributes nothing (does NOT leak its CPE into the snapshot)", () => {
    const snap = deriveEntitlementFromSubscriptions(
      [
        { status: "active", current_period_end: past(ONE_DAY), provider: "stripe" },
        { status: "active", current_period_end: future(ONE_DAY), provider: "apple" },
      ],
      NOW_MS,
    );
    expect(snap.status).toBe("active");
    expect(snap.expires_at).toBe(future(ONE_DAY));
    expect(snap.source).toBe("apple");
  });
});

describe("R3 — isEntitlingSubscription (shim)", () => {
  it("active + future expiry ⇒ true", () => {
    expect(
      isEntitlingSubscription(
        { status: "active", current_period_end: future(ONE_DAY) },
        NOW_MS,
      ),
    ).toBe(true);
  });

  it("active + past expiry ⇒ false (this is the bug)", () => {
    expect(
      isEntitlingSubscription(
        { status: "active", current_period_end: past(ONE_DAY) },
        NOW_MS,
      ),
    ).toBe(false);
  });

  it("active + null expiry ⇒ true (lifetime)", () => {
    expect(
      isEntitlingSubscription(
        { status: "active", current_period_end: null },
        NOW_MS,
      ),
    ).toBe(true);
  });

  it("non-entitling status ⇒ false regardless of expiry", () => {
    for (const s of ["paused", "expired", "revoked", "inactive"] as const) {
      expect(
        isEntitlingSubscription(
          { status: s, current_period_end: future(ONE_DAY) },
          NOW_MS,
        ),
      ).toBe(false);
    }
  });
});

describe("R3 — `source` provider-only narrowing", () => {
  it("never emits gift_code as source (write-path only carries stripe/apple/google)", () => {
    // R3 reads from `subscriptions` rows whose provider is always one
    // of stripe/apple/google. Even if a row somehow carried a
    // gift_code-shaped provider value, this function narrows to null.
    const snap = deriveEntitlementFromSubscriptions(
      [
        {
          status: "active",
          current_period_end: future(ONE_DAY),
          // simulate a bad row that should not influence the snapshot's source
          provider: "gift_code" as unknown as "stripe",
        },
      ],
      NOW_MS,
    );
    expect(snap.source).toBeNull();
  });
});
