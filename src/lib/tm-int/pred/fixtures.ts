// WP-001 — committed fixtures with planted defects.
//
// A deterministic corpus of tutor turns. Ten of them are PLANTED DEFECTS: turns where
// the learner outcome contradicts a confident lookup prediction, so their surprise is
// high. A handful of non-defect turns are genuine (unplanted) prediction errors with
// moderate surprise, so the top-surprise set is not trivially pure. The rest are clean.
//
// The thesis (thesis.ts) is that ranking by surprise concentrates the planted defects
// far better than a seeded random draw. Nothing here is random at runtime — a seeded
// LCG drives the interleave so the corpus (and its digest) is byte-stable.

import { capturePrediction, resolveSurprise } from "./capture";
import { predictOutcome } from "./predictor";
import { turnAnchor } from "./observe";
import type { PredictionRow, SurpriseResolution, TurnAddress, TurnFeatures } from "./types";

export const THESIS_FIXTURE_SEED = 0x5eed_1001;
const FIXTURE_SESSION = "wp001-thesis";
const BASE_MS = 1_000_000_000_000;
const PREDICT_STEP_MS = 10_000;
const OUTCOME_DELTA_MS = 5_000;

// Feature templates with known lookup probabilities (isCurrentLessonTarget=false):
//   HIGH_RES  corrected|none|C  -> p=0.95
//   LOW_RES   unchanged|many|A  -> p=0.20
//   MID_HI    corrected|few|A   -> p=0.68
//   MID_LO    unchanged|few|B   -> p=0.40
const HIGH_RES: TurnFeatures = { correctionStatus: "corrected", issueCount: 0, ruleId: "l1:clean", cefrBucket: "C", isCurrentLessonTarget: false };
const LOW_RES: TurnFeatures = { correctionStatus: "unchanged", issueCount: 4, ruleId: "l2:persist", cefrBucket: "A", isCurrentLessonTarget: false };
const MID_HI: TurnFeatures = { correctionStatus: "corrected", issueCount: 2, ruleId: "l1:few", cefrBucket: "A", isCurrentLessonTarget: false };
const MID_LO: TurnFeatures = { correctionStatus: "unchanged", issueCount: 2, ruleId: "l2:few", cefrBucket: "B", isCurrentLessonTarget: false };

type Role = "defect_hi" | "defect_midhi" | "defect_mid" | "genuine" | "clean_a" | "clean_b" | "clean_c" | "clean_d";

type Template = { features: TurnFeatures; resolved: boolean; planted: boolean };

// resolved is set to hit each role's target surprise = |p - (resolved?1:0)|:
//   defect_hi   HIGH_RES flipped  -> 0.95 (planted)
//   defect_midhi LOW_RES flipped  -> 0.80 (planted)
//   defect_mid  MID_LO  flipped   -> 0.60 (planted)
//   genuine     MID_HI  flipped   -> 0.68 (NOT planted — a real error)
//   clean_a/b/c/d consistent      -> 0.05 / 0.20 / 0.32 / 0.40
const TEMPLATES: Record<Role, Template> = {
  defect_hi: { features: HIGH_RES, resolved: false, planted: true },
  defect_midhi: { features: LOW_RES, resolved: true, planted: true },
  defect_mid: { features: MID_LO, resolved: true, planted: true },
  genuine: { features: MID_HI, resolved: false, planted: false },
  clean_a: { features: HIGH_RES, resolved: true, planted: false },
  clean_b: { features: LOW_RES, resolved: false, planted: false },
  clean_c: { features: MID_HI, resolved: true, planted: false },
  clean_d: { features: MID_LO, resolved: false, planted: false },
};

// Exactly 60 turns: 10 planted defects (4+4+2), 6 genuine errors, 44 clean.
function roleBag(): Role[] {
  const bag: Role[] = [];
  const push = (role: Role, n: number) => { for (let i = 0; i < n; i += 1) bag.push(role); };
  push("defect_hi", 4);
  push("defect_midhi", 4);
  push("defect_mid", 2);
  push("genuine", 6);
  push("clean_a", 14);
  push("clean_b", 12);
  push("clean_c", 10);
  push("clean_d", 8);
  return bag;
}

/** Seeded LCG (Numerical Recipes constants). Deterministic — no Math.random. */
export function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

/** Deterministic Fisher-Yates shuffle driven by a seeded RNG. */
export function seededShuffle<T>(items: readonly T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export type ThesisFixture = {
  rows: PredictionRow[];
  resolutions: SurpriseResolution[];
  /** turnAnchor() strings of the planted-defect turns. */
  plantedAnchors: string[];
  /** turnAnchor() strings of every turn, in fixture order. */
  allAnchors: string[];
};

/** Build the committed thesis fixture. Byte-stable for a given seed. */
export function buildThesisFixture(seed: number = THESIS_FIXTURE_SEED): ThesisFixture {
  const rng = makeRng(seed);
  const roles = seededShuffle(roleBag(), rng);

  const rows: PredictionRow[] = [];
  const resolutions: SurpriseResolution[] = [];
  const plantedAnchors: string[] = [];
  const allAnchors: string[] = [];

  roles.forEach((role, index) => {
    const template = TEMPLATES[role];
    const address: TurnAddress = { sessionId: FIXTURE_SESSION, turnIndex: index, msgId: `m${index}` };
    const prediction = predictOutcome(template.features);
    const predictedAtMs = BASE_MS + index * PREDICT_STEP_MS;
    const outcomeAtMs = predictedAtMs + OUTCOME_DELTA_MS; // strictly after -> valid

    const row = capturePrediction(address, template.features, prediction, predictedAtMs);
    const resolution = resolveSurprise(row, { resolved: template.resolved, outcomeAtMs });

    rows.push(row);
    resolutions.push(resolution);
    const anchor = turnAnchor(address);
    allAnchors.push(anchor);
    if (template.planted) plantedAnchors.push(anchor);
  });

  return { rows, resolutions, plantedAnchors, allAnchors };
}

export type HindsightFixture = {
  rows: PredictionRow[];
  /** Outcomes aligned to rows; some violate the no-hindsight invariant on purpose. */
  outcomes: { resolved: boolean; outcomeAtMs: number }[];
  /** Indices whose outcome is NOT strictly after the prediction (must be rejected). */
  leakingIndices: number[];
};

/**
 * A small fixture mixing valid and leaking pairs, for the zero-leakage acceptance test.
 * Leaks: outcome equal to prediction time, and outcome before prediction time.
 */
export function buildHindsightFixture(): HindsightFixture {
  const rows: PredictionRow[] = [];
  const outcomes: { resolved: boolean; outcomeAtMs: number }[] = [];
  const leakingIndices: number[] = [];

  const specs: { features: TurnFeatures; predictedAtMs: number; outcomeAtMs: number; resolved: boolean }[] = [
    { features: HIGH_RES, predictedAtMs: BASE_MS + 0, outcomeAtMs: BASE_MS + 5_000, resolved: false }, // valid
    { features: LOW_RES, predictedAtMs: BASE_MS + 10_000, outcomeAtMs: BASE_MS + 10_000, resolved: true }, // LEAK: equal
    { features: MID_HI, predictedAtMs: BASE_MS + 20_000, outcomeAtMs: BASE_MS + 19_999, resolved: false }, // LEAK: before
    { features: MID_LO, predictedAtMs: BASE_MS + 30_000, outcomeAtMs: BASE_MS + 30_001, resolved: true }, // valid (1ms after)
    { features: HIGH_RES, predictedAtMs: BASE_MS + 40_000, outcomeAtMs: BASE_MS + 1_000, resolved: true }, // LEAK: far before
  ];

  specs.forEach((spec, index) => {
    const address: TurnAddress = { sessionId: "wp001-hindsight", turnIndex: index, msgId: `h${index}` };
    const prediction = predictOutcome(spec.features);
    rows.push(capturePrediction(address, spec.features, prediction, spec.predictedAtMs));
    outcomes.push({ resolved: spec.resolved, outcomeAtMs: spec.outcomeAtMs });
    if (!(spec.predictedAtMs < spec.outcomeAtMs)) leakingIndices.push(index);
  });

  return { rows, outcomes, leakingIndices };
}
