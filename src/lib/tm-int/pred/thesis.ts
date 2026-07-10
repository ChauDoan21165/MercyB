// WP-001 — thesis metric.
//
// Claim under test: ranking accepted pairs by surprise concentrates the planted defects
// far better than a seeded random draw of the same size. If this fails, the feature is
// cut and reported honestly (constraint 6).
//
// topConcentration   = fraction of the top-K-by-surprise that are planted defects.
// randomConcentration = mean over many seeded random K-draws of the same fraction.

import { buildTopSurprisesReport } from "./report";
import { makeRng, seededShuffle } from "./fixtures";
import { isAcceptedPair, type SurpriseResolution } from "./types";
import { turnAnchor } from "./observe";

export type ThesisMetric = {
  k: number;
  acceptedCount: number;
  plantedCount: number;
  /** Fraction of the top-K surprises that are planted defects. */
  topConcentration: number;
  /** Mean planted fraction of a random K-draw, averaged over `randomTrials` seeds. */
  randomConcentration: number;
  randomTrials: number;
  /** How much better the top-K does than random, in absolute fraction. */
  lift: number;
  /** True iff top-K strictly beats the random baseline. */
  pass: boolean;
};

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

/**
 * Compute the thesis metric. `plantedAnchors` are the turnAnchor() strings of the
 * planted-defect turns; resolutions may include hindsight-rejected pairs (ignored).
 */
export function computeThesisMetric(
  resolutions: SurpriseResolution[],
  plantedAnchors: string[],
  options: { k?: number; randomTrials?: number; seed?: number } = {},
): ThesisMetric {
  const k = options.k ?? 10;
  const randomTrials = options.randomTrials ?? 200;
  const planted = new Set(plantedAnchors);

  const accepted = resolutions.filter(isAcceptedPair);
  const acceptedAnchors = accepted.map((pair) => turnAnchor(pair.turnAddress));

  // Top-K by surprise: reuse the exact ordering the report artifact ships with.
  const report = buildTopSurprisesReport(accepted, { limit: k });
  const topPlanted = report.entries.filter((entry) => planted.has(entry.turnAnchor)).length;
  const topConcentration = report.entries.length ? round4(topPlanted / report.entries.length) : 0;

  // Random baseline: many seeded K-draws, mean planted fraction.
  let randomSum = 0;
  for (let trial = 0; trial < randomTrials; trial += 1) {
    const rng = makeRng((options.seed ?? 0x1234_0000) + trial * 2654435761);
    const draw = seededShuffle(acceptedAnchors, rng).slice(0, k);
    const hits = draw.filter((anchor) => planted.has(anchor)).length;
    randomSum += draw.length ? hits / draw.length : 0;
  }
  const randomConcentration = round4(randomSum / randomTrials);

  return {
    k,
    acceptedCount: accepted.length,
    plantedCount: plantedAnchors.length,
    topConcentration,
    randomConcentration,
    randomTrials,
    lift: round4(topConcentration - randomConcentration),
    pass: topConcentration > randomConcentration,
  };
}
