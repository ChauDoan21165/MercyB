// supabase/functions/me-entitlement/__tests__/entitlement.test.ts
//
// Locks the entitlement-normalization logic the `me-entitlement` edge
// function returns to EVERY gated screen (authService, lib/billing,
// useEntitlementQuery, BillingSuccess). It was zero-test-net on the
// highest-blast-radius read on the money path (RECON-money-path-test-
// coverage.md §2a/§4 P2). If status normalization, provider ranking,
// the gift fallback decision, or the trial-window math regress, paying
// users silently see Free/Inactive — or free users keep premium past
// trial. The logic was extracted verbatim into ../entitlement.ts (zero
// behavior change); these assertions codify the behavior documented in
// that file's own comments — no guessed/undocumented expectations.
//
// Time-dependent branches (normalizeStatus canceled/default, compareRows,
// computeTrialStatus) are pinned with fake timers so the suite is
// deterministic regardless of when CI runs it.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  compareRows,
  computeTrialStatus,
  getExpiresAt,
  isPremiumStatus,
  normalizeEntitlement,
  normalizeSource,
  normalizeStatus,
  statusRank,
  type CanonicalStatus,
} from "../entitlement";

// Fixed "now" used across every time-sensitive assertion.
const NOW = new Date("2026-05-01T00:00:00.000Z");
const ONE_DAY = 24 * 60 * 60 * 1000;
const future = (ms: number) => new Date(NOW.getTime() + ms).toISOString();
const past = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("normalizeStatus — explicit status families", () => {
  it("maps 'active' to active", () => {
    expect(normalizeStatus({ status: "active" })).toBe("active");
  });

  it("maps 'trialing' and 'trial' to trialing", () => {
    expect(normalizeStatus({ status: "trialing" })).toBe("trialing");
    expect(normalizeStatus({ status: "trial" })).toBe("trialing");
  });

  it("maps grace aliases to grace_period", () => {
    for (const s of ["grace_period", "grace", "in_grace_period"]) {
      expect(normalizeStatus({ status: s })).toBe("grace_period");
    }
  });

  it("maps past-due aliases to past_due", () => {
    for (const s of ["past_due", "past-due", "unpaid"]) {
      expect(normalizeStatus({ status: s })).toBe("past_due");
    }
  });

  it("maps pause aliases to paused", () => {
    for (const s of ["paused", "pause", "on_hold"]) {
      expect(normalizeStatus({ status: s })).toBe("paused");
    }
  });

  it("maps refund/chargeback aliases to revoked", () => {
    for (const s of ["revoked", "refunded", "refund", "chargeback"]) {
      expect(normalizeStatus({ status: s })).toBe("revoked");
    }
  });

  it("maps incomplete aliases to inactive and 'expired' to expired", () => {
    expect(normalizeStatus({ status: "expired" })).toBe("expired");
    for (const s of ["inactive", "incomplete", "incomplete_expired"]) {
      expect(normalizeStatus({ status: s })).toBe("inactive");
    }
  });

  it("reads status from status > subscription_status > state, case-insensitively", () => {
    expect(normalizeStatus({ subscription_status: "ACTIVE" })).toBe("active");
    expect(normalizeStatus({ state: "Trialing" })).toBe("trialing");
    // explicit `status` wins over the fallbacks
    expect(
      normalizeStatus({ status: "active", subscription_status: "expired" })
    ).toBe("active");
  });
});

describe("normalizeStatus — expiry-dependent branches (time pinned)", () => {
  it("treats canceled/ended with a FUTURE expiry as expired", () => {
    for (const s of ["canceled", "cancelled", "ended", "terminated"]) {
      expect(
        normalizeStatus({ status: s, current_period_end: future(ONE_DAY) })
      ).toBe("expired");
    }
  });

  it("treats canceled/ended with a PAST (or no) expiry as expired", () => {
    expect(
      normalizeStatus({ status: "canceled", current_period_end: past(ONE_DAY) })
    ).toBe("expired");
    expect(normalizeStatus({ status: "ended" })).toBe("expired");
  });

  it("an unknown status expires when expiry is in the past, else inactive", () => {
    expect(
      normalizeStatus({ status: "weird", expires_at: past(ONE_DAY) })
    ).toBe("expired");
    expect(
      normalizeStatus({ status: "weird", expires_at: future(ONE_DAY) })
    ).toBe("inactive");
    expect(normalizeStatus({ status: "weird" })).toBe("inactive");
  });
});

describe("normalizeSource", () => {
  it("maps the stripe source", () => {
    expect(normalizeSource({ source: "stripe" })).toBe("stripe");
  });

  it("maps every apple alias", () => {
    for (const s of ["apple", "app_store", "appstore", "apple_app_store"]) {
      expect(normalizeSource({ source: s })).toBe("apple");
    }
  });

  it("maps every google alias", () => {
    for (const s of [
      "google",
      "google_play",
      "googleplay",
      "play_store",
      "play",
      "android",
    ]) {
      expect(normalizeSource({ source: s })).toBe("google");
    }
  });

  it("returns null for unknown or missing source", () => {
    expect(normalizeSource({ source: "paypal" })).toBeNull();
    expect(normalizeSource({})).toBeNull();
  });

  it("reads source > provider > platform > store, case-insensitively", () => {
    expect(normalizeSource({ provider: "STRIPE" })).toBe("stripe");
    expect(normalizeSource({ platform: "App_Store" })).toBe("apple");
    expect(normalizeSource({ store: "play" })).toBe("google");
    expect(normalizeSource({ source: "stripe", provider: "apple" })).toBe(
      "stripe"
    );
  });
});

describe("getExpiresAt", () => {
  it("prefers expires_at over the other date columns", () => {
    expect(
      getExpiresAt({
        expires_at: "2030-01-01T00:00:00Z",
        current_period_end: "2031-01-01T00:00:00Z",
      })
    ).toBe("2030-01-01T00:00:00.000Z");
  });

  it("falls through current_period_end → period_end → ends_at → expired_at", () => {
    expect(getExpiresAt({ current_period_end: "2030-01-01T00:00:00Z" })).toBe(
      "2030-01-01T00:00:00.000Z"
    );
    expect(getExpiresAt({ period_end: "2030-02-01T00:00:00Z" })).toBe(
      "2030-02-01T00:00:00.000Z"
    );
    expect(getExpiresAt({ ends_at: "2030-03-01T00:00:00Z" })).toBe(
      "2030-03-01T00:00:00.000Z"
    );
    expect(getExpiresAt({ expired_at: "2030-04-01T00:00:00Z" })).toBe(
      "2030-04-01T00:00:00.000Z"
    );
  });

  it("returns null when every date is absent or unparseable", () => {
    expect(getExpiresAt({})).toBeNull();
    expect(getExpiresAt({ expires_at: "not-a-date", ends_at: "" })).toBeNull();
  });
});

describe("statusRank / isPremiumStatus", () => {
  it("ranks statuses strictly active > trialing > grace > past_due > paused > expired > revoked > inactive", () => {
    const order: CanonicalStatus[] = [
      "active",
      "trialing",
      "grace_period",
      "past_due",
      "paused",
      "expired",
      "revoked",
      "inactive",
    ];
    for (let i = 1; i < order.length; i++) {
      expect(statusRank(order[i - 1])).toBeGreaterThan(statusRank(order[i]));
    }
  });

  it("counts only active/trialing/grace_period/past_due as premium", () => {
    for (const s of [
      "active",
      "trialing",
      "grace_period",
      "past_due",
    ] as const) {
      expect(isPremiumStatus(s)).toBe(true);
    }
    for (const s of ["paused", "expired", "revoked", "inactive"] as const) {
      expect(isPremiumStatus(s)).toBe(false);
    }
  });
});

// B13 Phase 3 PR-B: R1's expiry-regression integration suite. Locks the
// behavioral delta (active+past_expiry stops granting premium) at the
// `normalizeEntitlement` surface — the exact function `index.ts:146`
// calls. Parity assertions for non-expired inputs prove the refactor
// changed only the expiry rule, nothing else.
describe("B13 Phase 3 PR-B — R1 expiry regression + parity", () => {
  it("active + past expiry ⇒ is_premium=false (the bug PR-B closes)", () => {
    const e = normalizeEntitlement([
      {
        status: "active",
        current_period_end: past(ONE_DAY),
        provider: "stripe",
      },
    ]);
    expect(e.is_premium).toBe(false);
    expect(e.expires_at).toBe(past(ONE_DAY));
  });

  it("active + future expiry ⇒ is_premium=true (regression lock)", () => {
    const e = normalizeEntitlement([
      {
        status: "active",
        current_period_end: future(ONE_DAY),
        provider: "stripe",
      },
    ]);
    expect(e.is_premium).toBe(true);
    expect(e.source).toBe("stripe");
    expect(e.expires_at).toBe(future(ONE_DAY));
  });

  it("active + null expiry ⇒ is_premium=false", () => {
    const e = normalizeEntitlement([{ status: "active", provider: "stripe" }]);
    expect(e.is_premium).toBe(false);
    expect(e.expires_at).toBeNull();
  });

  it("trialing/grace_period/past_due + past expiry ⇒ is_premium=false", () => {
    for (const s of ["trialing", "grace_period", "past_due"] as const) {
      expect(
        normalizeEntitlement([{ status: s, current_period_end: past(ONE_DAY) }])
          .is_premium
      ).toBe(false);
    }
  });

  it("non-entitling status (paused/expired/revoked/inactive) ⇒ never premium, regardless of expiry", () => {
    for (const s of ["paused", "expired", "revoked", "inactive"] as const) {
      for (const expiry of [null, past(ONE_DAY), future(ONE_DAY)]) {
        const row: Record<string, unknown> = { status: s };
        if (expiry) row.current_period_end = expiry;
        expect(normalizeEntitlement([row]).is_premium).toBe(false);
      }
    }
  });

  it("normalizes non-expired inputs, with canceled terminal statuses remaining expired", () => {
    const cases: Array<[Record<string, unknown>, CanonicalStatus]> = [
      [{ status: "active", provider: "stripe" }, "active"],
      [{ status: "trialing", provider: "apple" }, "trialing"],
      [{ status: "grace_period", provider: "google" }, "grace_period"],
      [{ status: "past_due", provider: "stripe" }, "past_due"],
      [{ status: "paused", provider: "stripe" }, "paused"],
      [
        {
          status: "canceled",
          current_period_end: future(ONE_DAY),
          provider: "stripe",
        },
        "expired",
      ],
    ];
    for (const [row, expected] of cases) {
      expect(normalizeEntitlement([row]).status).toBe(expected);
    }
  });

  it("multi-row winner: prefers higher status rank over later expiry (consolidation)", () => {
    // Pre-PR-B me-entitlement's compareRows already used statusRank-first,
    // so this is unchanged for R1. The same multi-row rule now applies to
    // stripe-webhook's writer (R3) as well — see the PR description's
    // §parity-with-main note about that consolidation.
    const e = normalizeEntitlement([
      {
        status: "trialing",
        current_period_end: future(30 * ONE_DAY),
        provider: "apple",
      },
      {
        status: "active",
        current_period_end: future(ONE_DAY),
        provider: "stripe",
      },
    ]);
    expect(e.status).toBe("active");
    expect(e.source).toBe("stripe");
  });
});

describe("compareRows / normalizeEntitlement", () => {
  it("returns the non-premium default for an empty subscription set", () => {
    expect(normalizeEntitlement([])).toEqual({
      is_premium: false,
      source: null,
      status: "inactive",
      expires_at: null,
    });
  });

  it("picks the highest-ranked status regardless of expiry distance", () => {
    const active = {
      status: "active",
      provider: "stripe",
      expires_at: future(ONE_DAY),
    };
    const pausedLater = {
      status: "paused",
      provider: "apple",
      expires_at: future(100 * ONE_DAY),
    };
    expect([active, pausedLater].sort(compareRows)[0]).toBe(active);

    const e = normalizeEntitlement([pausedLater, active]);
    expect(e.is_premium).toBe(true);
    expect(e.status).toBe("active");
    expect(e.source).toBe("stripe");
    expect(e.expires_at).toBe(future(ONE_DAY));
  });

  it("breaks a status tie by the later expiry", () => {
    const soon = {
      status: "active",
      provider: "apple",
      expires_at: future(ONE_DAY),
    };
    const later = {
      status: "active",
      provider: "stripe",
      expires_at: future(30 * ONE_DAY),
    };
    expect([soon, later].sort(compareRows)[0]).toBe(later);
    expect(normalizeEntitlement([soon, later]).source).toBe("stripe");
  });

  it("reports a lone inactive subscription as non-premium", () => {
    expect(
      normalizeEntitlement([{ status: "inactive", provider: "stripe" }])
    ).toEqual({
      is_premium: false,
      source: "stripe",
      status: "inactive",
      expires_at: null,
    });
  });
});

describe("computeTrialStatus (time pinned to 2026-05-01)", () => {
  const CUTOFF_OK = "2026-04-30T00:00:00.000Z"; // after GRANDFATHER_CUTOFF
  const PRE_CUTOFF = "2026-04-01T00:00:00.000Z"; // before the cutoff

  it("premium users bypass the trial gate entirely", () => {
    expect(computeTrialStatus(PRE_CUTOFF, true)).toEqual({
      trial_expires_at: null,
      is_trial_expired: false,
    });
  });

  it("grandfathers users with missing/unparseable created_at (fail open)", () => {
    expect(computeTrialStatus(null, false)).toEqual({
      trial_expires_at: null,
      is_trial_expired: false,
    });
    expect(computeTrialStatus("not-a-date", false)).toEqual({
      trial_expires_at: null,
      is_trial_expired: false,
    });
  });

  it("grandfathers users created before the cutoff", () => {
    expect(computeTrialStatus(PRE_CUTOFF, false)).toEqual({
      trial_expires_at: null,
      is_trial_expired: false,
    });
  });

  it("gives a 3-day window from created_at and is not expired inside it", () => {
    // created 2026-04-30, +3d → 2026-05-03; now is 2026-05-01 → inside.
    expect(computeTrialStatus(CUTOFF_OK, false)).toEqual({
      trial_expires_at: "2026-05-03T00:00:00.000Z",
      is_trial_expired: false,
    });
  });

  it("marks the trial expired once now passes the window end", () => {
    // created 2026-04-25, +3d → 2026-04-28; now is 2026-05-01 → past.
    const r = computeTrialStatus("2026-04-25T00:00:00.000Z", false);
    expect(r.trial_expires_at).toBe("2026-04-28T00:00:00.000Z");
    expect(r.is_trial_expired).toBe(true);
  });

  it("extends the window by trial_extension_days", () => {
    // created 2026-04-25, base 3d → expired; +4 extension → 7d window
    // ends 2026-05-02 (> now 2026-05-01) → NOT expired.
    const r = computeTrialStatus("2026-04-25T00:00:00.000Z", false, 4);
    expect(r.trial_expires_at).toBe("2026-05-02T00:00:00.000Z");
    expect(r.is_trial_expired).toBe(false);
  });

  it("clamps negative / NaN extension to 0 (behaves as the 3-day base)", () => {
    const base = computeTrialStatus("2026-04-25T00:00:00.000Z", false, 0);
    for (const bad of [-10, Number.NaN, "garbage", undefined]) {
      expect(
        computeTrialStatus("2026-04-25T00:00:00.000Z", false, bad)
      ).toEqual(base);
    }
  });
});
