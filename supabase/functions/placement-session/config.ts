// supabase/functions/placement-session/config.ts
//
// Placement Test v2 — single constants block (Phase 2, PR 1).
//
// Implements: design §2.4–§2.7 + §7.2 numeric anchors, under locked
// decisions #2 (EAP working / MLE secondary), #5 (no pilot → CEFR
// cut-scores PROVISIONAL, labelled as such). Every magic number the
// engine uses lives HERE — design §2.7: "no magic numbers scattered in
// logic". Pure constants, zero logic, zero imports → type-checked by
// tsconfig.functions.json, importable by vitest.
//
// Sequence-doc item: PR 1 "types + config constants". No file imports
// this yet → zero behavior change.

import type { CefrBand, ItemType, SelfRating } from "./types.ts";

/** IRT scaling constant. design §2.4 decision: D = 1.0 (logistic metric).
 *  NEVER mix with the 1.702 normal-ogive metric. */
export const D = 1.0 as const;

/** Stop rule + length bounds. design §2.6 / §2.7. */
export const MIN_ITEMS = 15 as const; // anti lucky-streak floor
export const MAX_ITEMS = 35 as const; // hard cap
export const SE_STOP = 0.3 as const; // primary precision stop: SE(θ) < 0.30

/** Content balancing. design §2.6 / §2.7.
 *  Hard minimums that MUST be met before terminate. */
export const TYPE_QUOTAS: Readonly<Partial<Record<ItemType, number>>> = {
  reading: 3,
  listening: 3,
  grammar: 2,
};

/** Soft target proportions once quotas are met (design §2.6 ~30/30/20/15).
 *  writing_sample is post-test/unscored (decision #3) → never selected. */
export const SOFT_TARGET_MIX: Readonly<Record<ItemType, number>> = {
  reading: 0.3,
  listening: 0.3,
  grammar: 0.2,
  vocabulary: 0.15,
  writing_sample: 0,
};

/** Per-skill subscore is only reportable at/above this many items
 *  (design §2.3 PerSkillScore.reportable). The design fixes no value —
 *  config owns it by design intent; 4 is a provisional, tunable knob
 *  (≈ the quota floor) and is NOT a design-doc-derived constant. */
export const MIN_ITEMS_PER_SUBSCORE = 4 as const;

/** Exposure control — randomesque top-K (design §2.6, Kingsbury & Zara).
 *  K_LATE used once precision matters more than security. */
export const RANDOMESQUE_K = 5 as const;
export const RANDOMESQUE_K_LATE = 3 as const;
/** When a top-K item covers an uncovered priority VI L1 tag, weight it
 *  this much in the random draw (design §2.6 "L1 nudge"). */
export const L1_NUDGE_WEIGHT = 1.5 as const;

/** Self-rating → EAP prior mean μ₀ (design §2.5). not_sure is deliberately
 *  conservative (A2): under-placing is safer for motivation than
 *  over-placing. σ₀ is the prior SD. */
export const SELF_RATING_PRIOR_MEAN: Readonly<Record<SelfRating, number>> = {
  beginner: -2.0, // anchor A1
  intermediate: 0.0, // anchor B1
  advanced: 2.0, // anchor C1
  not_sure: -1.0, // anchor A2 (conservative)
};
export const PRIOR_SD = 1.0 as const; // σ₀

/** EAP numerical-integration grid (design §2.5: −4.0..+4.0, 81 nodes). */
export const EAP_GRID_MIN = -4.0 as const;
export const EAP_GRID_MAX = 4.0 as const;
export const EAP_GRID_STEP = 0.1 as const;

/** Newton–Raphson MLE controls (design §2.5 pseudo-code). */
export const MLE_MAX_ITER = 30 as const;
export const MLE_TOL = 1e-3 as const;
export const MLE_STEP_CLAMP = 1.0 as const; // |Δ| damp for wild early steps
export const THETA_CLAMP = 4.0 as const; // keep θ on a sane logit range
export const MLE_FLAT_EPSILON = 1e-9 as const; // -L'' below this → bail to EAP

/**
 * θ → CEFR band cut scores. **PROVISIONAL** (locked decision #5: no
 * standard-setting study; refined only post-pilot, Phase 4). Derived as
 * midpoints between the design §7.2 authoring anchors
 * (pre_a1≈−3, A1≈−2, A2≈−1, B1≈0, B2≈+1, C1≈+2, C2≈+3).
 *
 * Read as: band = first entry whose `maxTheta` (exclusive upper edge) the
 * learner's θ falls under; the last band has no upper bound.
 * MUST be surfaced in the UI as "provisional / soft routing only", never
 * as a certified CEFR result.
 */
export const CEFR_CUTS: ReadonlyArray<{ band: CefrBand; maxTheta: number }> = [
  { band: "pre_a1", maxTheta: -2.5 },
  { band: "A1", maxTheta: -1.5 },
  { band: "A2", maxTheta: -0.5 },
  { band: "B1", maxTheta: 0.5 },
  { band: "B2", maxTheta: 1.5 },
  { band: "C1", maxTheta: 2.5 },
  { band: "C2", maxTheta: Number.POSITIVE_INFINITY },
];

/** Whether the θ→CEFR mapping is empirically validated. Stays false until
 *  a Phase-4 pilot (decision #5). The UI keys its honest-label copy off
 *  this. */
export const CEFR_CUTS_ARE_PROVISIONAL = true as const;

/**
 * L1-transfer weakness severity bands for the result payload
 * (`ResultPayload.L1WeaknessEntry.severity`, types.ts §2.3). The typed
 * `"low" | "moderate" | "high"` contract REQUIRES a threshold, and the
 * design doc fixes none — so, EXACTLY like `MIN_ITEMS_PER_SUBSCORE`
 * above, config owns these by design intent: PROVISIONAL, tunable knobs,
 * NOT design-doc-derived constants (refined post-pilot, Phase 4). Kept
 * here so result.ts has zero scattered magic numbers (design §2.7).
 *
 * Read as: a tag seen `>= L1_WEAKNESS_MIN_SEEN` times with error rate
 * `>= HIGH` is "high"; `>= MODERATE` is "moderate"; else "low". The
 * min-seen floor stops a single wrong answer from screaming "high".
 *
 * RECONSTRUCTION FLAG (PR + Chau): this is the ONE new knob group PR 8
 * introduces. Justified — a typed result field with no covering constant,
 * following the in-repo `MIN_ITEMS_PER_SUBSCORE` precedent verbatim
 * (config-owned, provisional, single block). No design-decision clash.
 */
export const L1_WEAKNESS_MIN_SEEN = 2 as const;
export const L1_SEVERITY_HIGH_ERROR_RATE = 0.5 as const;
export const L1_SEVERITY_MODERATE_ERROR_RATE = 0.25 as const;

/** Retest cooldown (brief + design §2.6 "not in user's last 2 sessions /
 *  90d"). */
export const RETEST_COOLDOWN_DAYS = 90 as const;

/** A started-but-not-completed session older than this with no activity is
 *  treated as `abandoned`; a fresh `start` begins a new one (design §4). */
export const SESSION_ABANDON_TTL_MIN = 60 as const;

/**
 * θ→CEFR band → recommended starting room id — the SERVER mirror of the
 * browser `src/lib/placement/cefrToRoom.ts` `CEFR_TO_ROOM` map.
 *
 * WHY A MIRROR (reconstruction flag #1, PR 9 — same transparency as
 * PR 8's L1-severity bands / #712 randomesqueK / #718 terminator
 * precedence):
 *  • `result.ts` requires `ResultDeps.recommendedRoomFor` injected, and
 *    `ResultPayload.recommendedRoomId` is contractually "via existing
 *    cefrToRoom.ts (unchanged contract)" (types.ts:194).
 *  • The single source of truth is the BROWSER module
 *    `src/lib/placement/cefrToRoom.ts` — but it `import`s `./engine`
 *    (browser code) and is validated against `public/data/*.json`. The
 *    URL-free server engine subtree (tsconfig.functions.json, gate #6)
 *    CANNOT import it without breaking both the server/browser split and
 *    the Node-tsc-resolvable scope (result.ts's header is explicit on
 *    this deliberate boundary).
 *  • So the edge fn's `recommendedRoomFor` needs a server-reachable
 *    CEFR→room table. The only options were (a) duplicate the 7-entry
 *    map server-side, or (b) violate the engine boundary. (a), here,
 *    with a hard anti-drift guard: `__tests__/cefrToRoomServer.test.ts`
 *    asserts this constant deep-equals the browser `CEFR_TO_ROOM`, so
 *    any divergence fails CI loudly — exactly the discipline the browser
 *    `cefrToRoom.test.ts` already applies against `public/data/*.json`.
 *    "Single source of truth" is preserved in EFFECT: two copies, but a
 *    golden makes silent drift impossible.
 *  • Lives in config.ts (not core.ts) so it stays inside the
 *    tsc-gated + vitest-covered URL-free subtree and obeys design §2.7
 *    "no magic values scattered in logic". Pure constant, zero import
 *    added — config.ts's contract is intact.
 *
 * KEEP VERBATIM-EQUAL to `CEFR_TO_ROOM` in src/lib/placement/cefrToRoom.ts.
 */
export const CEFR_TO_ROOM_SERVER: Readonly<Record<CefrBand, string>> = {
  pre_a1: "english_foundation_ef01",
  A1: "english_a1_a101",
  A2: "english_a2_a201",
  B1: "english_b1_b101",
  // No B2-prefixed rooms exist — ship B2 the most advanced B1 room
  // (upper-intermediate) before the C1 jump. Mirrors cefrToRoom.ts.
  B2: "english_b1_b114",
  C1: "english_c1_c101",
  // No free C2 content — most advanced free C1 room so the primary CTA
  // never paywalls. Mirrors cefrToRoom.ts.
  C2: "english_c1_c114",
};

/** Optional ops override for the active item-bank version (reconstruction
 *  flag #2, PR 9). D4 (CONFIRMED, placement_items migration) is per-row
 *  `bank_version` + `active` with NO meta table; it fixes the read as
 *  "edge fn loads where active and bank_version = <current>" but defines
 *  no `<current>` selector and no constant. PR 9's `pickBankVersion`
 *  (core.ts, pure + unit-tested) resolves it WITHOUT inventing a knob:
 *  this env var wins if set; else the single distinct active version;
 *  else "" → empty bank → engine `bank_exhausted` (the D2 "ship EMPTY"
 *  end-to-end path, deliberately supported); else (>1 active version =
 *  an authoring error) the lexicographically-max one + a telemetried
 *  warning — never crash a live session ("core path survives optional
 *  failures"). Documented here only; the env name is read in index.ts. */
export const PLACEMENT_BANK_VERSION_ENV = "PLACEMENT_BANK_VERSION" as const;
