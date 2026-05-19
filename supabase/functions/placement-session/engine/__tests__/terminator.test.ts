// supabase/functions/placement-session/engine/__tests__/terminator.test.ts
//
// Golden + property tests for the §2.7 stop rule. Every constant is read
// from config so the goldens track the locked anchors (MIN_ITEMS 15,
// MAX_ITEMS 35, SE_STOP 0.30, TYPE_QUOTAS rd3/li3/gr2). Boundary cases
// (== threshold) are pinned explicitly — the precedence + the strict
// `< SE_STOP` are the whole correctness surface. vitest owns this file
// (excluded from tsconfig.functions.json — same split as the engine's
// other suites).

import { describe, expect, it } from "vitest";

import { MAX_ITEMS, MIN_ITEMS, SE_STOP, TYPE_QUOTAS } from "../../config";
import {
  evaluateTermination,
  hardQuotasMet,
  type TerminationState,
} from "../terminator";
import type { ItemType } from "../../types";

/** typeCounts that meet every hard quota with `extra` filler reading
 *  items, total == quotas-sum + extra. */
function metQuotas(extra = 0): Partial<Record<ItemType, number>> {
  return {
    reading: (TYPE_QUOTAS.reading ?? 0) + extra,
    listening: TYPE_QUOTAS.listening ?? 0,
    grammar: TYPE_QUOTAS.grammar ?? 0,
  };
}
const sum = (tc: Partial<Record<ItemType, number>>) =>
  (tc.reading ?? 0) + (tc.listening ?? 0) + (tc.grammar ?? 0) +
  (tc.vocabulary ?? 0);

const base = (over: Partial<TerminationState> = {}): TerminationState => ({
  se: 1.0,
  typeCounts: {},
  hasEligibleItem: true,
  ...over,
});

// ---------------------------------------------------------------------------
// hardQuotasMet — the quota gate (design §2.7)
// ---------------------------------------------------------------------------
describe("hardQuotasMet", () => {
  it("count exactly == quota counts as MET (>=)", () => {
    expect(hardQuotasMet({ reading: 3, listening: 3, grammar: 2 })).toBe(true);
  });
  it("one type one short → NOT met", () => {
    expect(hardQuotasMet({ reading: 3, listening: 2, grammar: 2 })).toBe(false);
    expect(hardQuotasMet({ reading: 3, listening: 3, grammar: 1 })).toBe(false);
  });
  it("empty counts → not met (nothing administered)", () => {
    expect(hardQuotasMet({})).toBe(false);
  });
  it("vocabulary has no quota (vacuously fine); writing_sample ignored", () => {
    expect(
      hardQuotasMet({ reading: 3, listening: 3, grammar: 2, vocabulary: 0 }),
    ).toBe(true);
    expect(
      hardQuotasMet({
        reading: 3,
        listening: 3,
        grammar: 2,
        writing_sample: 99,
      }),
    ).toBe(true);
  });
  it("over-filling a quota is still met", () => {
    expect(hardQuotasMet({ reading: 10, listening: 5, grammar: 4 })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// evaluateTermination — precedence: max_items > bank_exhausted > precision
// ---------------------------------------------------------------------------
describe("evaluateTermination — max_items (hard cap, dominant)", () => {
  it("administered == MAX_ITEMS → stop max_items (>= boundary)", () => {
    const tc = { reading: MAX_ITEMS };
    expect(sum(tc)).toBe(MAX_ITEMS);
    expect(evaluateTermination(base({ typeCounts: tc }))).toEqual({
      stop: true,
      reason: "max_items",
    });
  });

  it("MAX_ITEMS - 1 is NOT yet a max_items stop", () => {
    // Below the cap, huge SE, quotas unmet, items remain → continue.
    expect(
      evaluateTermination(base({ typeCounts: { reading: MAX_ITEMS - 1 } })),
    ).toEqual({ stop: false, reason: null });
  });

  it("max_items overrides unmet quotas AND a still-available bank", () => {
    expect(
      evaluateTermination({
        se: 5,
        typeCounts: { vocabulary: MAX_ITEMS }, // every hard quota unmet
        hasEligibleItem: true,
      }).reason,
    ).toBe("max_items");
  });

  it("max_items outranks bank_exhausted when BOTH hold at the cap", () => {
    expect(
      evaluateTermination({
        se: 5,
        typeCounts: { reading: MAX_ITEMS },
        hasEligibleItem: false, // also exhausted — but cap is the reason
      }).reason,
    ).toBe("max_items");
  });
});

describe("evaluateTermination — bank_exhausted (forced)", () => {
  it("no eligible item → stop bank_exhausted even below MIN_ITEMS", () => {
    expect(
      evaluateTermination(
        base({ typeCounts: { reading: 2 }, hasEligibleItem: false }),
      ),
    ).toEqual({ stop: true, reason: "bank_exhausted" });
  });

  it("bank_exhausted fires with huge SE + unmet quotas (forced, not elective)", () => {
    expect(
      evaluateTermination({
        se: Number.POSITIVE_INFINITY,
        typeCounts: {},
        hasEligibleItem: false,
      }).reason,
    ).toBe("bank_exhausted");
  });
});

describe("evaluateTermination — precision (elective, gated)", () => {
  it("≥ MIN_ITEMS + quotas met + se < SE_STOP → stop precision", () => {
    // metQuotas(extra) keeps total ≥ MIN_ITEMS and < MAX_ITEMS.
    const tc = metQuotas(MIN_ITEMS); // 3+3+2+15 = 23 ∈ [15, 35)
    expect(sum(tc)).toBeGreaterThanOrEqual(MIN_ITEMS);
    expect(sum(tc)).toBeLessThan(MAX_ITEMS);
    expect(
      evaluateTermination(base({ se: SE_STOP - 0.01, typeCounts: tc })),
    ).toEqual({ stop: true, reason: "precision" });
  });

  it("administered == MIN_ITEMS exactly is enough for the floor (>=)", () => {
    // Build a quota-meeting count summing to exactly MIN_ITEMS:
    // reading 10, listening 3, grammar 2 = 15.
    const tc = { reading: 10, listening: 3, grammar: 2 };
    expect(sum(tc)).toBe(MIN_ITEMS);
    expect(hardQuotasMet(tc)).toBe(true);
    expect(
      evaluateTermination(base({ se: SE_STOP - 0.05, typeCounts: tc })).reason,
    ).toBe("precision");
  });

  it("NO precision stop before MIN_ITEMS even with tiny SE + quotas met (anti lucky-streak)", () => {
    // quotas met but only 8 items < MIN_ITEMS → must continue.
    const tc = { reading: 3, listening: 3, grammar: 2 };
    expect(sum(tc)).toBeLessThan(MIN_ITEMS);
    expect(hardQuotasMet(tc)).toBe(true);
    expect(
      evaluateTermination(base({ se: 0.01, typeCounts: tc })),
    ).toEqual({ stop: false, reason: null });
  });

  it("NO precision stop if a hard quota is unmet, even ≥MIN_ITEMS + se<stop", () => {
    // 16 vocabulary items: past the floor, precise — but rd/li/gr all 0.
    const tc = { vocabulary: 16 };
    expect(sum(tc)).toBeGreaterThanOrEqual(MIN_ITEMS);
    expect(hardQuotasMet(tc)).toBe(false);
    expect(
      evaluateTermination(base({ se: 0.05, typeCounts: tc })),
    ).toEqual({ stop: false, reason: null });
  });

  it("se EXACTLY == SE_STOP does NOT stop (strict <); just under does", () => {
    const tc = metQuotas(MIN_ITEMS);
    expect(evaluateTermination(base({ se: SE_STOP, typeCounts: tc }))).toEqual({
      stop: false,
      reason: null,
    });
    expect(
      evaluateTermination(base({ se: SE_STOP - 1e-9, typeCounts: tc })).reason,
    ).toBe("precision");
  });

  it("a freshly seeded session (se = +Infinity) never precision-stops", () => {
    expect(
      evaluateTermination(
        base({ se: Number.POSITIVE_INFINITY, typeCounts: metQuotas(MIN_ITEMS) }),
      ),
    ).toEqual({ stop: false, reason: null });
  });
});

describe("evaluateTermination — continue (the common mid-test path)", () => {
  it("past the floor, quotas met, but SE still too high → keep going", () => {
    const tc = metQuotas(5); // 13 items
    expect(
      evaluateTermination(base({ se: 0.5, typeCounts: tc })),
    ).toEqual({ stop: false, reason: null });
  });

  it("reason is null exactly when stop is false (invariant sweep)", () => {
    const states: TerminationState[] = [
      base(),
      base({ typeCounts: { reading: 5 }, se: 0.4 }),
      base({ se: 0.01, typeCounts: { reading: 3, listening: 3, grammar: 2 } }),
      base({ se: 0.1, typeCounts: { reading: MAX_ITEMS } }),
      base({ hasEligibleItem: false }),
    ];
    for (const s of states) {
      const d = evaluateTermination(s);
      expect(d.reason === null).toBe(d.stop === false);
    }
  });
});
