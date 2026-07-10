// WP-001 — lookup-table predictor (NO ML).
//
// Pure, deterministic, versioned. Given the features available at decision time it
// returns a predicted next-turn outcome plus a confidence. The "model" is a static
// table keyed by coarse feature buckets — auditable and replayable, no training.

import {
  PREDICTOR_VERSION,
  type CefrBucket,
  type CorrectionStatus,
  type Prediction,
  type PredictedLabel,
  type TurnAddress,
  type TurnFeatures,
} from "./types";

type IssueBucket = "none" | "few" | "many";

function issueBucket(issueCount: number): IssueBucket {
  if (issueCount <= 0) return "none";
  if (issueCount <= 2) return "few";
  return "many";
}

type LookupEntry = { pResolve: number; confidence: number };

// The lookup table. Rows are keyed `${correctionStatus}|${issueBucket}|${cefrBucket}`.
// Values are the predictor's belief that the learner resolves the flagged issue next
// turn, and how confident it is. Hand-authored priors — deliberately simple so the
// prediction error we capture is meaningful signal, not model noise.
const LOOKUP: Record<string, LookupEntry> = {
  // Clean corrections at higher levels — usually resolved next turn.
  "corrected|none|C": { pResolve: 0.95, confidence: 0.9 },
  "corrected|none|B": { pResolve: 0.9, confidence: 0.85 },
  "corrected|none|A": { pResolve: 0.82, confidence: 0.75 },
  "corrected|few|C": { pResolve: 0.85, confidence: 0.8 },
  "corrected|few|B": { pResolve: 0.78, confidence: 0.7 },
  "corrected|few|A": { pResolve: 0.68, confidence: 0.6 },
  "corrected|many|C": { pResolve: 0.7, confidence: 0.6 },
  "corrected|many|B": { pResolve: 0.6, confidence: 0.55 },
  "corrected|many|A": { pResolve: 0.5, confidence: 0.5 },
  // Nothing changed — flagged issue tends to recur.
  "unchanged|none|C": { pResolve: 0.6, confidence: 0.5 },
  "unchanged|few|B": { pResolve: 0.4, confidence: 0.55 },
  "unchanged|few|A": { pResolve: 0.32, confidence: 0.6 },
  "unchanged|many|A": { pResolve: 0.2, confidence: 0.7 },
  "unchanged|many|B": { pResolve: 0.28, confidence: 0.6 },
  // Escalated to AI — uncertain by construction.
  "needs_ai|few|B": { pResolve: 0.5, confidence: 0.4 },
  "needs_ai|many|A": { pResolve: 0.35, confidence: 0.45 },
  // Abstained — no correction offered, low resolution expectation.
  "abstained|few|A": { pResolve: 0.3, confidence: 0.5 },
  "abstained|many|A": { pResolve: 0.22, confidence: 0.55 },
};

// Fallbacks by correction status when a specific bucket is not in the table. Keeps the
// predictor total without pretending to more confidence than a coarse prior deserves.
const STATUS_FALLBACK: Record<CorrectionStatus, LookupEntry> = {
  corrected: { pResolve: 0.75, confidence: 0.5 },
  unchanged: { pResolve: 0.35, confidence: 0.45 },
  needs_ai: { pResolve: 0.5, confidence: 0.35 },
  abstained: { pResolve: 0.3, confidence: 0.4 },
};

function lookupKey(status: CorrectionStatus, issues: IssueBucket, cefr: CefrBucket): string {
  return `${status}|${issues}|${cefr}`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Look up a prediction for the given turn features. Pure and deterministic. */
export function predictOutcome(features: TurnFeatures): Prediction {
  const bucket = issueBucket(features.issueCount);
  const key = lookupKey(features.correctionStatus, bucket, features.cefrBucket);
  const entry = LOOKUP[key] ?? STATUS_FALLBACK[features.correctionStatus];

  // Being on the current lesson target nudges resolution slightly upward (the learner
  // is focused on exactly this point) — a small, bounded adjustment, not a new model.
  const targetBonus = features.isCurrentLessonTarget ? 0.05 : 0;
  const pResolve = Math.min(1, Math.max(0, round2(entry.pResolve + targetBonus)));
  const label: PredictedLabel = pResolve >= 0.5 ? "resolve" : "repeat";

  return {
    predictorVersion: PREDICTOR_VERSION,
    outcome: { label, pResolve },
    confidence: round2(entry.confidence),
  };
}

/** Deterministic 32-bit string hash (djb2/31-multiplier, matches obs evidencePacket). */
export function stableHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable, PII-free id for a prediction row derived from its turn address + predictor. */
export function predictionRowId(address: TurnAddress, predictorVersion: string): string {
  const basis = `${predictorVersion}:${address.sessionId}:${address.turnIndex}:${address.msgId}`;
  return `pred-${stableHash(basis).toString(16).padStart(8, "0")}`;
}
