// supabase/functions/placement-session/engine/__tests__/itemSelector.test.ts
//
// Golden + property tests for the adaptive item selector (design §2.6).
// The selector is pure given an injected rng, so every "random" path is
// exercised with a SCRIPTED rng (deterministic, hand-reasoned) — same
// discipline as the estimator's hand-derived goldens. vitest owns this
// file (excluded from tsconfig.functions.json — same split as the rest).

import { describe, expect, it } from "vitest";

import {
  L1_NUDGE_WEIGHT,
  MIN_ITEMS,
  RANDOMESQUE_K,
  RANDOMESQUE_K_LATE,
} from "../../config";
import { buildItemBank } from "../itemBank";
import {
  administeredCount,
  chooseTargetType,
  eligibleItems,
  randomesqueDraw,
  randomesqueK,
  rankByInformation,
  selectNextItem,
  SCORED_TYPES,
} from "../itemSelector";
import type { Item, ItemType, L1TransferTag } from "../../types";

const META: Item["meta"] = {
  author: "test",
  cefrDescriptor: "Can do X.",
  paramSource: "expert",
  displayPreference: "en_first",
};

/** Minimal valid MC item; only the fields the selector reads vary. */
function mkItem(
  id: string,
  type: Exclude<ItemType, "writing_sample">,
  over: Partial<Item> = {},
): Item {
  const skill = (
    type === "vocabulary" ? "vocabulary" : type
  ) as Item["skill"];
  const base: Item = {
    id,
    type,
    cefr: "B1",
    difficulty: 0,
    discrimination: 1,
    skill,
    prompt: { en: "Q?", vi: "Câu?" },
    options: [
      { id: "a", en: "x", vi: "x" },
      { id: "b", en: "y", vi: "y" },
    ],
    correctOptionId: "a",
    meta: META,
    ...over,
  };
  if (type === "reading") base.passage = { en: "p", vi: "p" };
  if (type === "listening") {
    base.audio = { key: "k.mp3", replayLimit: 1 };
    base.transcript = { en: "t", vi: "t" };
  }
  return base;
}

const writing = (id: string): Item => ({
  id,
  type: "writing_sample",
  cefr: "B1",
  difficulty: 0,
  discrimination: 1,
  skill: "writing",
  prompt: { en: "Write.", vi: "Viết." },
  meta: META,
});

function bankOf(items: Item[]) {
  const { bank, rejected } = buildItemBank(items, "sel.test.1");
  expect(rejected).toEqual([]); // fixtures must be valid
  return bank;
}

/** rng that replays a fixed script then throws if over-drawn (catches
 *  any accidental extra draw — the selector must draw exactly once). */
function scriptedRng(values: number[]): () => number {
  let i = 0;
  return () => {
    if (i >= values.length) throw new Error("rng over-drawn");
    return values[i++];
  };
}

// ---------------------------------------------------------------------------
// administeredCount / eligibleItems — pool plumbing
// ---------------------------------------------------------------------------
describe("administeredCount", () => {
  it("sums only the 4 scored types; ignores writing_sample + missing keys", () => {
    expect(
      administeredCount({ reading: 3, grammar: 2, writing_sample: 9 }),
    ).toBe(5);
    expect(administeredCount({})).toBe(0);
  });
});

describe("eligibleItems", () => {
  it("drops served ids and every writing_sample", () => {
    const bank = bankOf([
      mkItem("r1", "reading"),
      mkItem("r2", "reading"),
      writing("w1"),
    ]);
    const got = eligibleItems(bank, ["r1"]).map((i) => i.id);
    expect(got).toEqual(["r2"]); // r1 served, w1 unscored
  });
});

// ---------------------------------------------------------------------------
// chooseTargetType — content balancing (design §2.6)
// ---------------------------------------------------------------------------
describe("chooseTargetType — hard-quota phase", () => {
  it("fills the largest unmet hard quota first (TYPE_QUOTAS: rd3/li3/gr2)", () => {
    const bank = bankOf([
      mkItem("r1", "reading"),
      mkItem("l1", "listening"),
      mkItem("g1", "grammar"),
      mkItem("v1", "vocabulary"),
    ]);
    // nothing administered → reading & listening both deficit 3, grammar
    // 2. Tie at 3 → SCORED_TYPES order ⇒ reading.
    expect(chooseTargetType(bank, {
      theta: 0,
      servedItemIds: [],
      typeCounts: {},
    })).toBe("reading");
    // reading quota met, listening still short → listening.
    expect(chooseTargetType(bank, {
      theta: 0,
      servedItemIds: [],
      typeCounts: { reading: 3 },
    })).toBe("listening");
  });

  it("skips an unmet-quota type that has no eligible items left", () => {
    // Only reading items exist; reading quota already met → must fall
    // through to soft mix over the only reachable type (reading).
    const bank = bankOf([mkItem("r1", "reading"), mkItem("r2", "reading")]);
    expect(
      chooseTargetType(bank, {
        theta: 0,
        servedItemIds: ["r1"],
        typeCounts: { reading: 3 },
      }),
    ).toBe("reading");
  });

  it("returns null when no scored type has an eligible item", () => {
    const bank = bankOf([mkItem("r1", "reading"), writing("w1")]);
    expect(
      chooseTargetType(bank, {
        theta: 0,
        servedItemIds: ["r1"],
        typeCounts: {},
      }),
    ).toBeNull();
  });
});

describe("chooseTargetType — soft-mix phase (quotas met)", () => {
  it("picks the type furthest below its SOFT_TARGET_MIX target", () => {
    const bank = bankOf([
      mkItem("r1", "reading"),
      mkItem("l1", "listening"),
      mkItem("g1", "grammar"),
      mkItem("v1", "vocabulary"),
    ]);
    // All hard quotas met; counts rd6 li6 gr4 vo0 (total 16). Targets
    // .30/.30/.20/.15. Proportions .375/.375/.25/0 → gaps
    // -.075/-.075/-.05/+.15. Vocabulary has the only positive gap.
    const t = chooseTargetType(bank, {
      theta: 0,
      servedItemIds: [],
      typeCounts: { reading: 6, listening: 6, grammar: 4, vocabulary: 0 },
    });
    expect(t).toBe("vocabulary");
  });
});

// ---------------------------------------------------------------------------
// rankByInformation — MFI core (design §2.6 / §2.4)
// ---------------------------------------------------------------------------
describe("rankByInformation", () => {
  it("orders by Fisher information at θ̂ (item nearest b, highest a, wins)", () => {
    // θ̂ = 0. Info ∝ a²·P·Q, maximal at b = θ. b0a1 > b0a-far? compare:
    //  - i_mid: b=0,a=1.5  (peak at θ, high a)  → highest
    //  - i_near: b=0.3,a=1                       → middle
    //  - i_far: b=2.5,a=1                        → lowest (far from θ)
    const ranked = rankByInformation(
      [
        mkItem("i_far", "grammar", { difficulty: 2.5, discrimination: 1 }),
        mkItem("i_mid", "grammar", { difficulty: 0, discrimination: 1.5 }),
        mkItem("i_near", "grammar", { difficulty: 0.3, discrimination: 1 }),
      ],
      0,
    );
    expect(ranked.map((r) => r.item.id)).toEqual(["i_mid", "i_near", "i_far"]);
    expect(ranked[0].information).toBeGreaterThan(ranked[1].information);
  });

  it("breaks exact information ties by item id (deterministic)", () => {
    const ranked = rankByInformation(
      [
        mkItem("z", "grammar", { difficulty: 0, discrimination: 1 }),
        mkItem("a", "grammar", { difficulty: 0, discrimination: 1 }),
        mkItem("m", "grammar", { difficulty: 0, discrimination: 1 }),
      ],
      0,
    );
    expect(ranked.map((r) => r.item.id)).toEqual(["a", "m", "z"]);
  });
});

// ---------------------------------------------------------------------------
// randomesqueK — early/late switch (design §2.6; reconstruction note)
// ---------------------------------------------------------------------------
describe("randomesqueK", () => {
  it("wide K before MIN_ITEMS, narrow K at/after the anti lucky-streak floor", () => {
    expect(randomesqueK(0)).toBe(RANDOMESQUE_K);
    expect(randomesqueK(MIN_ITEMS - 1)).toBe(RANDOMESQUE_K);
    expect(randomesqueK(MIN_ITEMS)).toBe(RANDOMESQUE_K_LATE);
    expect(randomesqueK(MIN_ITEMS + 10)).toBe(RANDOMESQUE_K_LATE);
  });
});

// ---------------------------------------------------------------------------
// randomesqueDraw — exposure control + L1 nudge (design §2.6)
// ---------------------------------------------------------------------------
describe("randomesqueDraw", () => {
  // 6 items, descending information by construction (id == rank).
  const ranked = Array.from({ length: 6 }, (_, i) => ({
    item: mkItem(`it${i}`, "grammar"),
    information: 6 - i,
  }));

  it("draws ONLY within the top-K window (early K), exactly one rng call", () => {
    // administered 0 → K = RANDOMESQUE_K (5). rng→0 ⇒ first bucket.
    const got = randomesqueDraw(ranked, 0, scriptedRng([0]));
    expect(got?.id).toBe("it0");
    // rng just below 1 ⇒ last item of the K=5 window (it4), never it5.
    expect(randomesqueDraw(ranked, 0, scriptedRng([0.999999]))?.id).toBe("it4");
  });

  it("narrows to RANDOMESQUE_K_LATE once administered ≥ MIN_ITEMS", () => {
    // late K = 3. rng→~1 ⇒ last of the 3-window = it2 (not it4).
    expect(
      randomesqueDraw(ranked, MIN_ITEMS, scriptedRng([0.999999]))?.id,
    ).toBe("it2");
    expect(RANDOMESQUE_K_LATE).toBeLessThan(RANDOMESQUE_K); // sanity
  });

  it("single candidate short-circuits (no rng draw at all)", () => {
    const one = [{ item: mkItem("solo", "grammar"), information: 1 }];
    // scriptedRng([]) throws if called — proves the short-circuit.
    expect(randomesqueDraw(one, 0, scriptedRng([]))?.id).toBe("solo");
  });

  it("empty ranking → null", () => {
    expect(randomesqueDraw([], 0, scriptedRng([]))).toBeNull();
  });

  it("L1 nudge: a priority-tag item gets L1_NUDGE_WEIGHT in the draw", () => {
    // Two-item window, equal info. Item B carries a priority L1 tag, so
    // weights = [1, 1.5], total 2.5. Boundary: r < 1/2.5 = 0.4 ⇒ A,
    // r ≥ 0.4 ⇒ B. Pick the boundary points exactly.
    const tag: L1TransferTag = "article_use";
    const pair = [
      { item: mkItem("A", "grammar"), information: 2 },
      { item: mkItem("B", "grammar", { l1Tags: [tag] }), information: 2 },
    ];
    // rng=0.39 → 0.39*2.5 = 0.975 < weightA(1) ⇒ A.
    expect(
      randomesqueDraw(pair, 0, scriptedRng([0.39]), [tag])?.id,
    ).toBe("A");
    // rng=0.41 → 1.025 ≥ 1 ⇒ B (the nudged item wins the larger slice).
    expect(
      randomesqueDraw(pair, 0, scriptedRng([0.41]), [tag])?.id,
    ).toBe("B");
    // Same rng but NO priority tags ⇒ uniform [1,1], total 2: 0.41*2 =
    // 0.82 < 1 ⇒ A. Proves the nudge actually shifted the boundary.
    expect(randomesqueDraw(pair, 0, scriptedRng([0.41]))?.id).toBe("A");
    expect(L1_NUDGE_WEIGHT).toBeGreaterThan(1); // sanity on the constant
  });
});

// ---------------------------------------------------------------------------
// selectNextItem — full §2.6 pipeline
// ---------------------------------------------------------------------------
describe("selectNextItem", () => {
  it("empty eligible pool → null (selector's bank_exhausted signal)", () => {
    const bank = bankOf([mkItem("r1", "reading"), writing("w1")]);
    expect(
      selectNextItem(
        bank,
        { theta: 0, servedItemIds: ["r1"], typeCounts: {} },
        scriptedRng([]),
      ),
    ).toBeNull();
  });

  it("honors content balancing THEN MFI: picks the most informative item of the quota-driven type", () => {
    // Fresh session (counts {}). chooseTargetType → reading (largest
    // unmet quota, SCORED_TYPES tie order). Among reading items the
    // selector must take the MOST informative at θ̂=0 → rd_peak (b=0).
    const bank = bankOf([
      mkItem("rd_far", "reading", { difficulty: 2.5, discrimination: 1 }),
      mkItem("rd_peak", "reading", { difficulty: 0, discrimination: 1.6 }),
      mkItem("li_peak", "listening", { difficulty: 0, discrimination: 2 }),
      mkItem("gr_1", "grammar"),
    ]);
    const picked = selectNextItem(
      bank,
      { theta: 0, servedItemIds: [], typeCounts: {} },
      scriptedRng([0]), // top of the randomesque window
    );
    expect(picked?.type).toBe("reading"); // content balancing won
    expect(picked?.id).toBe("rd_peak"); // MFI within the type
  });

  it("never re-serves an item across a simulated full adaptive run", () => {
    // 24 items spread over the 4 scored types + difficulties.
    const items: Item[] = [];
    for (const t of SCORED_TYPES) {
      for (let i = 0; i < 6; i++) {
        items.push(
          mkItem(`${t}_${i}`, t, { difficulty: -2 + i * 0.8, discrimination: 1 + (i % 3) * 0.4 }),
        );
      }
    }
    const bank = bankOf(items);

    const served: string[] = [];
    const typeCounts: Partial<Record<ItemType, number>> = {};
    // Deterministic rng cycling through a few values — exercises the
    // weighted draw across phases without any real randomness.
    const seq = [0.1, 0.55, 0.9, 0.3, 0.7];
    let s = 0;
    const rng = () => seq[s++ % seq.length];

    for (let step = 0; step < items.length; step++) {
      const next = selectNextItem(
        bank,
        { theta: 0.4, servedItemIds: served, typeCounts },
        rng,
      );
      if (next === null) break; // pool exhausted
      expect(served).not.toContain(next.id); // ← the invariant
      expect(next.type).not.toBe("writing_sample");
      served.push(next.id);
      typeCounts[next.type] = (typeCounts[next.type] ?? 0) + 1;
    }

    // Drains the whole scored bank with zero repeats, then signals null.
    expect(served.length).toBe(items.length);
    expect(new Set(served).size).toBe(items.length);
    expect(
      selectNextItem(
        bank,
        { theta: 0.4, servedItemIds: served, typeCounts },
        rng,
      ),
    ).toBeNull();
  });

  it("hard quotas (rd≥3, li≥3, gr≥2) are all satisfied within a run", () => {
    const items: Item[] = [];
    for (const t of SCORED_TYPES) {
      for (let i = 0; i < 8; i++) items.push(mkItem(`${t}_${i}`, t));
    }
    const bank = bankOf(items);
    const served: string[] = [];
    const tc: Partial<Record<ItemType, number>> = {};
    const rng = () => 0; // always top-of-window — pure MFI + balancing
    for (let step = 0; step < 16; step++) {
      const n = selectNextItem(
        bank,
        { theta: 0, servedItemIds: served, typeCounts: tc },
        rng,
      );
      if (!n) break;
      served.push(n.id);
      tc[n.type] = (tc[n.type] ?? 0) + 1;
    }
    expect(tc.reading ?? 0).toBeGreaterThanOrEqual(3);
    expect(tc.listening ?? 0).toBeGreaterThanOrEqual(3);
    expect(tc.grammar ?? 0).toBeGreaterThanOrEqual(2);
  });
});
