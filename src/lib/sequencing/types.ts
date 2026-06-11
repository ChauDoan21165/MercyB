/**
 * Mastery types for Vietnamese L1 interference patterns.
 *
 * ## Scoring semantics
 *
 * Each interference pattern (defined in `src/data/placement/vnL1Interference.ts`)
 * is tracked independently with a normalized 0.0–1.0 `score` that aggregates
 * evidence from assessment responses, drill outcomes, and speech-analysis signals.
 *
 * ### Level thresholds
 * | Level          | score range      | Meaning                                              |
 * |---------------|-----------------|------------------------------------------------------|
 * | `untested`    | attemptsCount=0  | No evidence collected yet for this pattern           |
 * | `struggling`  | [0.00, 0.35)     | Pattern is causing consistent errors                 |
 * | `emerging`    | [0.35, 0.60)     | Learner shows awareness but not reliable control     |
 * | `consolidating` | [0.60, 0.80)   | Mostly correct; occasional slips under pressure      |
 * | `mastered`    | [0.80, 1.00]     | Reliable, automatized; only needs spaced maintenance |
 *
 * ### Confidence
 * `confidenceWidth` is the half-width of the 68 % credible interval (0.0–0.5).
 * High width (> 0.20) means the estimate is unreliable and the pattern should be
 * re-assessed before the level drives sequencing decisions.
 *
 * ### Decay
 * Mastery scores decay toward 0.50 if the pattern is not re-tested within
 * `MASTERY_HALF_LIFE_DAYS` days. The sequencer uses `lastUpdatedAt` to apply
 * an optional decay adjustment before ordering.
 */

export const MASTERY_HALF_LIFE_DAYS = 28;

export type InterferenceMasteryLevel =
  | "untested"
  | "struggling"
  | "emerging"
  | "consolidating"
  | "mastered";

/** Mastery state for a single VNL1 interference pattern. */
export type InterferenceMasteryScore = {
  /** Matches `VNL1Pattern.id` in vnL1Interference.ts. */
  patternId: string;
  /** Qualitative level derived from `score` via the thresholds above. */
  level: InterferenceMasteryLevel;
  /**
   * Normalized score, 0.0–1.0.
   * Undefined when `level === 'untested'` (attemptsCount === 0).
   */
  score: number | undefined;
  /** Number of measurement events (items, drills, speech probes) that went into `score`. */
  attemptsCount: number;
  /**
   * Half-width of the 68 % credible interval.
   * Lower is more certain. Values > 0.20 indicate insufficient data.
   */
  confidenceWidth: number;
  /** Unix millisecond timestamp of the most recent update to this entry. */
  lastUpdatedAt: number;
};

/**
 * A learner's full interference mastery state across all patterns they have
 * been assessed or drilled on.
 *
 * Patterns absent from `masteryByPattern` are treated as `untested` during
 * sequencing.
 */
export type LearnerInterferenceProfile = {
  learnerId: string;
  /** Keyed by `VNL1Pattern.id`. Only contains patterns with ≥ 1 attempt. */
  masteryByPattern: Record<string, InterferenceMasteryScore>;
  /** Unix ms timestamp of when this profile snapshot was last persisted. */
  profileUpdatedAt: number;
};

/** A single step in the recommended interference sequence. */
export type InterferenceSequenceEntry = {
  patternId: string;
  rationale: string;
};

/**
 * The output of `sequenceInterferencePatterns`.
 *
 * `entries` is ordered from highest-priority (work on this first) to
 * lowest-priority. The sequencer guarantees every supplied pattern id appears
 * exactly once.
 */
export type InterferenceSequence = {
  learnerId: string;
  entries: InterferenceSequenceEntry[];
};

/** Derive the qualitative level from a raw score and attempt count. */
export function scoringToLevel(score: number | undefined, attemptsCount: number): InterferenceMasteryLevel {
  if (attemptsCount === 0 || score === undefined) return "untested";
  if (score < 0.35) return "struggling";
  if (score < 0.60) return "emerging";
  if (score < 0.80) return "consolidating";
  return "mastered";
}
