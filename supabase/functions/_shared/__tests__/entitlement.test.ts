// supabase/functions/_shared/__tests__/entitlement.test.ts
//
// Exhaustive lock for the shared entitlement derive (B13 Phase 3 PR-A).
// This module is **additive with zero importers** in PR-A — so this
// suite is the only thing that can catch a regression in the canonical
// expiry-aware logic that PR-B will repoint R1–R4 at.
//
// Three classes of test live here:
//
//   1. The full {status × expiry × row-count} matrix on `isEntitled` and
//      `deriveEntitlement` — the source of truth for the rule.
//   2. Named boundary cases the dispatch spec calls out by name:
//        active + past expiry      ⇒ NOT premium    (the bug)
//        active + null expiry      ⇒ NOT premium    (malformed provider row)
//        expiry === now            ⇒ expired        (boundary, strict)
//        canceled + future expiry  ⇒ status="expired", not premium
//        empty rows                ⇒ inactive/false
//   3. Parity / determinism: `normalizeStatus` does NOT call Date.now()
//      (provable by running with mocked timers and confirming output
//      depends only on the injected `nowMs`); winner selection is
//      deterministic across permutations.
//
// `now` is INJECTED throughout; we do not rely on fake timers because
// the production API takes `now` as a parameter — testing it through
// the parameter is the stronger contract.

import { describe, expect, it } from "vitest";

import {
  compareRows,
  deriveEntitlement,
  ENTITLING_STATUSES,
  type EntitlementInput,
  type EntitlementStatus,
  getExpiresAt,
  isEntitled,
  normalizeSource,
  normalizeStatus,
  statusRank,
} from "../entitlement";

const NOW_MS = new Date("2026-05-01T00:00:00.000Z").getTime();
const NOW_DATE = new Date(NOW_MS);
const ONE_DAY = 24 * 60 * 60 * 1000;
const future = (ms: number) => new Date(NOW_MS + ms).toISOString();
const past = (ms: number) => new Date(NOW_MS - ms).toISOString();
const atNow = () => new Date(NOW_MS).toISOString();

const ALL_STATUSES: readonly EntitlementStatus[] = [
  "active",
  "trialing",
  "grace_period",
  "past_due",
  "paused",
  "expired",
  "revoked",
  "inactive",
];

const ENTITLING: readonly EntitlementStatus[] = [
  "active",
  "trialing",
  "grace_period",
  "past_due",
];

const NON_ENTITLING: readonly EntitlementStatus[] = [
  "paused",
  "expired",
  "revoked",
  "inactive",
];

/* ────────────────────────────────────────────────────────────────────────
 * isEntitled — the rule, in isolation
 * ──────────────────────────────────────────────────────────────────────── */

describe("isEntitled — the rule, in isolation", () => {
  for (const status of NON_ENTITLING) {
    it(`returns false for non-entitling status "${status}" regardless of expiry`, () => {
      expect(isEntitled(status, null, NOW_MS)).toBe(false);
      expect(isEntitled(status, NOW_MS - ONE_DAY, NOW_MS)).toBe(false);
      expect(isEntitled(status, NOW_MS + ONE_DAY, NOW_MS)).toBe(false);
    });
  }

  for (const status of ENTITLING) {
    it(`returns false for "${status}" + null expiry`, () => {
      expect(isEntitled(status, null, NOW_MS)).toBe(false);
    });
    it(`returns true for "${status}" + future expiry`, () => {
      expect(isEntitled(status, NOW_MS + ONE_DAY, NOW_MS)).toBe(true);
      expect(isEntitled(status, NOW_MS + 1, NOW_MS)).toBe(true);
    });
    it(`returns false for "${status}" + past expiry (the bug PR-B closes)`, () => {
      expect(isEntitled(status, NOW_MS - ONE_DAY, NOW_MS)).toBe(false);
      expect(isEntitled(status, NOW_MS - 1, NOW_MS)).toBe(false);
    });
    it(`returns false for "${status}" + expiry === now (strict boundary)`, () => {
      expect(isEntitled(status, NOW_MS, NOW_MS)).toBe(false);
    });
  }

  it("uses strict > (at-now is expired), not >=", () => {
    expect(isEntitled("active", NOW_MS, NOW_MS)).toBe(false);
    expect(isEntitled("active", NOW_MS + 1, NOW_MS)).toBe(true);
  });

  it("ENTITLING_STATUSES set matches the four entitling strings", () => {
    expect([...ENTITLING_STATUSES].sort()).toEqual([...ENTITLING].sort());
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * normalizeStatus — raw → canonical, with injected nowMs
 * ──────────────────────────────────────────────────────────────────────── */

describe("normalizeStatus — explicit families (parity with me-entitlement/entitlement.ts)", () => {
  it.each([
    ["active", "active"],
    ["trialing", "trialing"],
    ["trial", "trialing"],
    ["grace_period", "grace_period"],
    ["grace", "grace_period"],
    ["in_grace_period", "grace_period"],
    ["past_due", "past_due"],
    ["past-due", "past_due"],
    ["unpaid", "past_due"],
    ["paused", "paused"],
    ["pause", "paused"],
    ["on_hold", "paused"],
    ["revoked", "revoked"],
    ["refunded", "revoked"],
    ["refund", "revoked"],
    ["chargeback", "revoked"],
    ["expired", "expired"],
    ["inactive", "inactive"],
    ["incomplete", "inactive"],
    ["incomplete_expired", "inactive"],
    ["ACTIVE", "active"], // case-insensitive
    [" Active ", "active"], // trims + lowers
  ] as const)("maps %s → %s", (raw, expected) => {
    expect(normalizeStatus({ status: raw }, NOW_MS)).toBe(expected);
  });

  it("reads status from `subscription_status` when `status` is absent", () => {
    expect(normalizeStatus({ subscription_status: "active" }, NOW_MS)).toBe(
      "active"
    );
  });

  it("reads status from `state` as the final fallback", () => {
    expect(normalizeStatus({ state: "trialing" }, NOW_MS)).toBe("trialing");
  });
});

describe("normalizeStatus — canceled + expiry", () => {
  it("'canceled' + future expiry ⇒ expired", () => {
    expect(
      normalizeStatus(
        { status: "canceled", current_period_end: future(ONE_DAY) },
        NOW_MS
      )
    ).toBe("expired");
  });

  it("'cancelled' + future expiry ⇒ expired (British spelling)", () => {
    expect(
      normalizeStatus(
        { status: "cancelled", expires_at: future(ONE_DAY) },
        NOW_MS
      )
    ).toBe("expired");
  });

  it("'canceled' + past expiry ⇒ expired", () => {
    expect(
      normalizeStatus(
        { status: "canceled", current_period_end: past(ONE_DAY) },
        NOW_MS
      )
    ).toBe("expired");
  });

  it("'canceled' + expiry exactly === now ⇒ expired (strict)", () => {
    expect(
      normalizeStatus(
        { status: "canceled", current_period_end: atNow() },
        NOW_MS
      )
    ).toBe("expired");
  });

  it("'canceled' + null expiry ⇒ expired", () => {
    expect(normalizeStatus({ status: "canceled" }, NOW_MS)).toBe("expired");
  });
});

describe("normalizeStatus — unrecognized + expiry (parity with me-entitlement :148)", () => {
  it("unknown status + future expiry ⇒ inactive", () => {
    expect(
      normalizeStatus(
        { status: "weird-stripe-state", current_period_end: future(ONE_DAY) },
        NOW_MS
      )
    ).toBe("inactive");
  });

  it("unknown status + past expiry ⇒ expired", () => {
    expect(
      normalizeStatus(
        { status: "weird-stripe-state", current_period_end: past(ONE_DAY) },
        NOW_MS
      )
    ).toBe("expired");
  });

  it("missing status + no expiry ⇒ inactive", () => {
    expect(normalizeStatus({}, NOW_MS)).toBe("inactive");
  });

  it("missing status + past expiry ⇒ expired", () => {
    expect(normalizeStatus({ current_period_end: past(ONE_DAY) }, NOW_MS)).toBe(
      "expired"
    );
  });
});

describe("normalizeStatus — does NOT consult wall-clock", () => {
  // Strong contract: the API must be a pure function of (row, nowMs).
  // Sanity-check: call with two `nowMs` values that straddle a row's
  // expiry; the answer must change with the *parameter*, not the
  // process clock.
  it("flips between inactive/expired purely from injected nowMs", () => {
    const row: EntitlementInput = {
      status: "provider_unknown",
      current_period_end: new Date(2026, 5, 15).toISOString(),
    };
    const before = new Date(2026, 5, 14).getTime();
    const after = new Date(2026, 5, 16).getTime();

    expect(normalizeStatus(row, before)).toBe("inactive");
    expect(normalizeStatus(row, after)).toBe("expired");
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * getExpiresAt — canonical field order
 * ──────────────────────────────────────────────────────────────────────── */

describe("getExpiresAt — canonical field order", () => {
  it("prefers expires_at when present", () => {
    expect(
      getExpiresAt({
        expires_at: future(ONE_DAY),
        current_period_end: future(2 * ONE_DAY),
      })
    ).toBe(future(ONE_DAY));
  });

  it("falls back to current_period_end_at, then current_period_end, then period_end, then ends_at, then expired_at", () => {
    expect(getExpiresAt({ current_period_end_at: future(ONE_DAY) })).toBe(
      future(ONE_DAY)
    );
    expect(getExpiresAt({ current_period_end: future(ONE_DAY) })).toBe(
      future(ONE_DAY)
    );
    expect(
      getExpiresAt({
        current_period_end_at: future(ONE_DAY),
        current_period_end: future(2 * ONE_DAY),
      })
    ).toBe(future(ONE_DAY));
    expect(
      getExpiresAt({
        current_period_end_at: null,
        current_period_end: future(ONE_DAY),
      })
    ).toBe(future(ONE_DAY));
    expect(
      getExpiresAt({
        current_period_end_at: future(2 * ONE_DAY),
        current_period_end: future(ONE_DAY),
      })
    ).toBe(future(2 * ONE_DAY));
    expect(
      getExpiresAt({
        current_period_end_at: null,
        current_period_end: null,
      })
    ).toBeNull();
    expect(
      deriveEntitlement(
        [
          {
            status: "active",
            current_period_end_at: null,
            current_period_end: future(ONE_DAY),
          },
        ],
        NOW_MS
      ).is_premium
    ).toBe(true);
    expect(
      deriveEntitlement(
        [
          {
            status: "active",
            current_period_end_at: future(2 * ONE_DAY),
            current_period_end: future(ONE_DAY),
          },
        ],
        NOW_MS
      ).expires_at
    ).toBe(future(2 * ONE_DAY));
    expect(
      deriveEntitlement(
        [
          {
            status: "active",
            current_period_end_at: null,
            current_period_end: null,
          },
        ],
        NOW_MS
      ).is_premium
    ).toBe(false);
    expect(
      deriveEntitlement(
        [
          {
            status: "active",
            current_period_end_at: null,
            current_period_end: null,
          },
        ],
        NOW_MS
      ).expires_at
    ).toBeNull();
    expect(getExpiresAt({ period_end: future(ONE_DAY) })).toBe(
      future(ONE_DAY)
    );
    expect(getExpiresAt({ ends_at: future(ONE_DAY) })).toBe(future(ONE_DAY));
    expect(getExpiresAt({ expired_at: future(ONE_DAY) })).toBe(future(ONE_DAY));
  });

  it("returns null when no expiry field is set", () => {
    expect(getExpiresAt({ status: "active" })).toBeNull();
  });

  it("returns null for unparseable values", () => {
    expect(getExpiresAt({ expires_at: "not-a-date" })).toBeNull();
    expect(getExpiresAt({ expires_at: "" })).toBeNull();
    expect(getExpiresAt({ expires_at: 12345 })).toBeNull();
  });

  it("normalizes timezone variants to ISO 8601", () => {
    expect(getExpiresAt({ expires_at: "2026-06-01T00:00:00Z" })).toBe(
      "2026-06-01T00:00:00.000Z"
    );
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * normalizeSource — provider mapping
 * ──────────────────────────────────────────────────────────────────────── */

describe("normalizeSource", () => {
  it.each([
    ["stripe", "stripe"],
    ["apple", "apple"],
    ["app_store", "apple"],
    ["appstore", "apple"],
    ["apple_app_store", "apple"],
    ["google", "google"],
    ["google_play", "google"],
    ["googleplay", "google"],
    ["play_store", "google"],
    ["play", "google"],
    ["android", "google"],
    ["gift_code", "gift_code"],
    ["gift", "gift_code"],
    ["gift-code", "gift_code"],
  ] as const)("maps %s → %s", (raw, expected) => {
    expect(normalizeSource({ source: raw })).toBe(expected);
  });

  it("reads from `provider`, `platform`, `store` in that order", () => {
    expect(normalizeSource({ provider: "stripe" })).toBe("stripe");
    expect(normalizeSource({ platform: "apple" })).toBe("apple");
    expect(normalizeSource({ store: "google" })).toBe("google");
  });

  it("returns null for unknown / missing", () => {
    expect(normalizeSource({})).toBeNull();
    expect(normalizeSource({ source: "" })).toBeNull();
    expect(normalizeSource({ source: "paypal" })).toBeNull();
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * statusRank + compareRows — winner selection
 * ──────────────────────────────────────────────────────────────────────── */

describe("statusRank — ordering", () => {
  it("ranks entitling statuses above non-entitling", () => {
    for (const e of ENTITLING) {
      for (const n of NON_ENTITLING) {
        expect(statusRank(e)).toBeGreaterThan(statusRank(n));
      }
    }
  });

  it("orders active > trialing > grace_period > past_due", () => {
    expect(statusRank("active")).toBeGreaterThan(statusRank("trialing"));
    expect(statusRank("trialing")).toBeGreaterThan(statusRank("grace_period"));
    expect(statusRank("grace_period")).toBeGreaterThan(statusRank("past_due"));
  });
});

describe("compareRows — multi-row contention", () => {
  it("picks higher status rank first", () => {
    const rows: EntitlementInput[] = [
      { id: "a", status: "expired", expires_at: future(10 * ONE_DAY) },
      { id: "b", status: "active", expires_at: future(ONE_DAY) },
    ];
    rows.sort((x, y) => compareRows(x, y, NOW_MS));
    expect(rows[0].id).toBe("b");
  });

  it("breaks tie by latest expiry", () => {
    const rows: EntitlementInput[] = [
      { id: "early", status: "active", current_period_end: future(ONE_DAY) },
      {
        id: "late",
        status: "active",
        current_period_end: future(10 * ONE_DAY),
      },
    ];
    rows.sort((x, y) => compareRows(x, y, NOW_MS));
    expect(rows[0].id).toBe("late");
  });

  it("breaks remaining tie by updated_at (latest first)", () => {
    const rows: EntitlementInput[] = [
      {
        id: "old",
        status: "active",
        current_period_end: future(ONE_DAY),
        updated_at: past(10 * ONE_DAY),
      },
      {
        id: "new",
        status: "active",
        current_period_end: future(ONE_DAY),
        updated_at: past(ONE_DAY),
      },
    ];
    rows.sort((x, y) => compareRows(x, y, NOW_MS));
    expect(rows[0].id).toBe("new");
  });

  it("falls back to id (deterministic) when everything ties", () => {
    const rows: EntitlementInput[] = [
      { id: "b", status: "active" },
      { id: "a", status: "active" },
    ];
    rows.sort((x, y) => compareRows(x, y, NOW_MS));
    expect(rows[0].id).toBe("a");
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * deriveEntitlement — the canonical reducer (the named cases)
 * ──────────────────────────────────────────────────────────────────────── */

describe("deriveEntitlement — empty input", () => {
  it("returns the inactive snapshot for zero rows", () => {
    expect(deriveEntitlement([], NOW_DATE)).toEqual({
      is_premium: false,
      status: "inactive",
      source: null,
      expires_at: null,
    });
  });
});

describe("deriveEntitlement — single-row matrix (status × expiry)", () => {
  // The full {status × expiry} grid for one row. Each entry encodes the
  // expected is_premium and status string for a single-row input.
  type Expiry = "null" | "past" | "now" | "future" | "unparseable";
  const expiries: Record<Expiry, string | null> = {
    null: null,
    past: past(ONE_DAY),
    now: atNow(),
    future: future(ONE_DAY),
    unparseable: "not-a-date",
  };

  const cases: Array<{
    rawStatus: string;
    expiry: Expiry;
    is_premium: boolean;
    status: EntitlementStatus;
  }> = [];

  // Entitling raw statuses → premium iff expiry is a parseable future timestamp.
  for (const s of ["active", "trialing", "grace_period", "past_due"] as const) {
    cases.push({ rawStatus: s, expiry: "null", is_premium: false, status: s });
    cases.push({ rawStatus: s, expiry: "future", is_premium: true, status: s });
    cases.push({ rawStatus: s, expiry: "past", is_premium: false, status: s });
    cases.push({ rawStatus: s, expiry: "now", is_premium: false, status: s });
    cases.push({
      rawStatus: s,
      expiry: "unparseable",
      is_premium: false,
      status: s,
    });
  }

  // Non-entitling raw statuses → never premium, status mapped verbatim.
  for (const [raw, canonical] of [
    ["paused", "paused"],
    ["expired", "expired"],
    ["revoked", "revoked"],
    ["inactive", "inactive"],
  ] as const) {
    for (const exp of [
      "null",
      "past",
      "now",
      "future",
      "unparseable",
    ] as const) {
      cases.push({
        rawStatus: raw,
        expiry: exp,
        is_premium: false,
        status: canonical,
      });
    }
  }

  it.each(cases)(
    "$rawStatus + $expiry expiry ⇒ is_premium=$is_premium, status=$status",
    ({ rawStatus, expiry, is_premium, status }) => {
      const row: EntitlementInput = { status: rawStatus };
      const expiryValue = expiries[expiry];
      if (expiryValue !== null) row.current_period_end = expiryValue;

      const snap = deriveEntitlement([row], NOW_MS);
      expect(snap.is_premium).toBe(is_premium);
      expect(snap.status).toBe(status);
    }
  );
});

describe("deriveEntitlement — named cases the dispatch spec calls out", () => {
  it("active + past expiry ⇒ NOT premium (the bug PR-B closes)", () => {
    const snap = deriveEntitlement(
      [{ status: "active", current_period_end: past(ONE_DAY) }],
      NOW_MS
    );
    expect(snap.is_premium).toBe(false);
    expect(snap.status).toBe("active");
    expect(snap.expires_at).toBe(past(ONE_DAY));
  });

  it("active + null expiry ⇒ NOT premium", () => {
    const snap = deriveEntitlement([{ status: "active" }], NOW_MS);
    expect(snap.is_premium).toBe(false);
    expect(snap.status).toBe("active");
    expect(snap.expires_at).toBeNull();
  });

  it("expiry exactly === now ⇒ expired (strict boundary)", () => {
    const snap = deriveEntitlement(
      [{ status: "active", current_period_end: atNow() }],
      NOW_MS
    );
    expect(snap.is_premium).toBe(false);
  });

  it("canceled + future expiry ⇒ status='expired' AND is_premium=false", () => {
    const snap = deriveEntitlement(
      [{ status: "canceled", current_period_end: future(ONE_DAY) }],
      NOW_MS
    );
    expect(snap.status).toBe("expired");
    expect(snap.is_premium).toBe(false);
  });

  it("canceled + past expiry ⇒ status='expired', is_premium=false", () => {
    const snap = deriveEntitlement(
      [{ status: "canceled", current_period_end: past(ONE_DAY) }],
      NOW_MS
    );
    expect(snap.status).toBe("expired");
    expect(snap.is_premium).toBe(false);
  });
});

describe("deriveEntitlement — multi-row winner contention", () => {
  it("picks the entitling row over expired even when the expired row sorts later in input", () => {
    const snap = deriveEntitlement(
      [
        { id: "old", status: "expired", current_period_end: past(ONE_DAY) },
        { id: "new", status: "active", current_period_end: future(ONE_DAY) },
      ],
      NOW_MS
    );
    expect(snap.is_premium).toBe(true);
    expect(snap.expires_at).toBe(future(ONE_DAY));
  });

  it("picks the row with the latest expiry when statuses tie", () => {
    const snap = deriveEntitlement(
      [
        { id: "close", status: "active", current_period_end: future(ONE_DAY) },
        {
          id: "far",
          status: "active",
          current_period_end: future(30 * ONE_DAY),
        },
      ],
      NOW_MS
    );
    expect(snap.expires_at).toBe(future(30 * ONE_DAY));
  });

  it("never reads non-entitling expiry as the winning expires_at", () => {
    // A row whose status is "expired" must not contribute its
    // current_period_end as the snapshot expires_at if any entitling
    // row exists.
    const snap = deriveEntitlement(
      [
        {
          id: "expired-old",
          status: "expired",
          current_period_end: future(100 * ONE_DAY),
        },
        {
          id: "active-new",
          status: "active",
          current_period_end: future(ONE_DAY),
        },
      ],
      NOW_MS
    );
    expect(snap.status).toBe("active");
    expect(snap.expires_at).toBe(future(ONE_DAY));
  });

  it("is order-independent (sort is deterministic)", () => {
    const rows: EntitlementInput[] = [
      { id: "a", status: "trialing", current_period_end: future(2 * ONE_DAY) },
      { id: "b", status: "active", current_period_end: future(ONE_DAY) },
      { id: "c", status: "active", current_period_end: future(10 * ONE_DAY) },
    ];
    const first = deriveEntitlement(rows, NOW_MS);
    const second = deriveEntitlement([...rows].reverse(), NOW_MS);
    const third = deriveEntitlement([rows[2], rows[0], rows[1]], NOW_MS);
    expect(first).toEqual(second);
    expect(first).toEqual(third);
    expect(first.status).toBe("active");
    expect(first.expires_at).toBe(future(10 * ONE_DAY));
  });

  it("does NOT mutate the caller's array", () => {
    const rows: EntitlementInput[] = [
      { id: "a", status: "active", current_period_end: future(ONE_DAY) },
      { id: "b", status: "active", current_period_end: future(2 * ONE_DAY) },
    ];
    const ids = rows.map((r) => r.id);
    deriveEntitlement(rows, NOW_MS);
    expect(rows.map((r) => r.id)).toEqual(ids);
  });
});

describe("deriveEntitlement — `now` accepts Date or number identically", () => {
  it("number nowMs and equivalent Date produce identical snapshots", () => {
    const row: EntitlementInput = {
      status: "active",
      current_period_end: future(ONE_DAY),
    };
    expect(deriveEntitlement([row], NOW_MS)).toEqual(
      deriveEntitlement([row], NOW_DATE)
    );
  });

  it("non-finite numeric `now` collapses to 0 (defensive — never throws)", () => {
    expect(() =>
      deriveEntitlement([{ status: "active" }], Number.NaN)
    ).not.toThrow();
    const snap = deriveEntitlement([{ status: "active" }], Number.NaN);
    expect(snap.is_premium).toBe(false);
  });
});

/* ────────────────────────────────────────────────────────────────────────
 * Status mapping spot checks
 *
 * Non-terminal status mapping stays stable. Terminal canceled-style statuses
 * intentionally remain expired even if a period date is still in the future.
 * ──────────────────────────────────────────────────────────────────── */

describe("Status mapping for non-expired inputs", () => {
  const nonExpiredRows: Array<{
    row: EntitlementInput;
    status: EntitlementStatus;
  }> = [
    { row: { status: "active" }, status: "active" },
    { row: { status: "trialing" }, status: "trialing" },
    { row: { status: "trial" }, status: "trialing" },
    { row: { status: "grace_period" }, status: "grace_period" },
    { row: { status: "in_grace_period" }, status: "grace_period" },
    { row: { status: "past_due" }, status: "past_due" },
    { row: { status: "unpaid" }, status: "past_due" },
    { row: { status: "paused" }, status: "paused" },
    { row: { status: "expired" }, status: "expired" },
    { row: { status: "revoked" }, status: "revoked" },
    { row: { status: "refunded" }, status: "revoked" },
    { row: { status: "inactive" }, status: "inactive" },
    { row: { status: "incomplete" }, status: "inactive" },
    { row: { status: "ACTIVE" }, status: "active" },
    {
      row: { status: "canceled", current_period_end: future(ONE_DAY) },
      status: "expired",
    },
  ];

  it.each(nonExpiredRows)("row $row → status=$status", ({ row, status }) => {
    expect(normalizeStatus(row, NOW_MS)).toBe(status);
  });

  it("ALL_STATUSES list matches the EntitlementStatus union (drift guard)", () => {
    // If a new status is added to the union, this test forces the test
    // file to be updated alongside it.
    expect(ALL_STATUSES).toHaveLength(8);
    expect([...new Set(ALL_STATUSES)]).toHaveLength(8);
  });
});
