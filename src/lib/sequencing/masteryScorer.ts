/**
 * masteryScorer — converts correction-telemetry from LearnerHistoryProfile
 * (and conversation_capture errorType tags) into LearnerInterferenceProfile
 * scores that drive sequencing.
 *
 * ## Telemetry sources
 * - `LearnerHistoryProfile.interferencePatterns` (localStorage IndexedDB, device-local)
 * - `conversation_events.error_details.errorType` (Supabase, cross-device via
 *   the server-leg recall built in Step 12 / !871)
 *
 * Both sources use `VietEnInterferenceTag`-style strings ("missing-article",
 * "tense-omission", etc.). The VNL1 catalogue uses snake_case pattern IDs
 * ("missing_articles", "past_tense_unmarked"). TAG_TO_PATTERN_IDS maps between
 * these two vocabularies.
 *
 * ## Scoring model
 * Mastery is inversely proportional to recent error frequency:
 *
 *   rawScore   = max(SCORE_FLOOR, NEUTRAL - observedCount * STEP)
 *   daysSince  = (now - lastSeenAt) / MS_PER_DAY
 *   decayK     = exp(-daysSince / MASTERY_HALF_LIFE_DAYS)
 *   score      = rawScore * decayK + NEUTRAL * (1 - decayK)
 *
 * Interpretation:
 * - Fresh errors  → score near rawScore (low if many errors = struggling)
 * - Old errors    → score drifts toward NEUTRAL (0.55, top of "emerging")
 * - Zero observed → untested (score undefined, level "untested")
 *
 * confidenceWidth = max(CONF_FLOOR, CONF_MAX / sqrt(observedCount))
 * Exceeds 0.20 when observedCount < 5 (insufficient data flag in types.ts).
 */

import type { VNL1Pattern } from "../../data/placement/vnL1Interference";
import type { LearnerHistoryProfile, VietEnInterferenceTag } from "../tutor/learnerHistoryProfile";
import {
  type LearnerInterferenceProfile,
  type InterferenceMasteryScore,
  MASTERY_HALF_LIFE_DAYS,
  scoringToLevel,
} from "./types";

// ── Score model constants ──────────────────────────────────────────────────
const NEUTRAL_SCORE = 0.55;
const SCORE_FLOOR = 0.05;
// Step of 0.075 places the threshold at 3 observations: 0.55 - 3×0.075 = 0.325 < 0.35
// (= "struggling"), while 1–2 observations stay in "emerging" (0.35–0.60).
const SCORE_STEP = 0.075;
const CONF_MAX = 0.4;
const CONF_FLOOR = 0.05;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ── Tag → VNL1 pattern ID mapping ─────────────────────────────────────────
// Each VietEnInterferenceTag can correspond to one or more VNL1 pattern IDs.
// When a tag fires, all mapped patterns receive its evidence.
export const TAG_TO_PATTERN_IDS: Record<string, readonly string[]> = {
  "missing-article":       ["missing_articles"],
  "tense-omission":        ["past_tense_unmarked"],
  "subj-verb-agreement":   ["missing_subject_verb_agreement"],
  "preposition-calque":    ["preposition_selection_transfer"],
  "word-order":            ["question_word_order_transfer", "topic_comment_fronting"],
  "zero-copula":           ["copula_be_omission"],
  "double-negation":       ["negation_no_not_placement"],
  // Broader error-type strings that arrive from conversation_capture's errorType field
  "plural-omission":       ["plural_s_omission"],
  "final-consonant":       ["final_consonant_cluster_reduction"],
  "voiced-final-stop":     ["voiced_final_stop_devoicing"],
  "phrasal-verb":          ["phrasal_verb_avoidance"],
  "modal-inflection":      ["modal_verb_inflection"],
  "literal-calque":        ["literal_vietnamese_calques"],
};

// Reverse index: patternId → all tags that map to it.
const PATTERN_TO_TAGS: Map<string, string[]> = new Map();
for (const [tag, ids] of Object.entries(TAG_TO_PATTERN_IDS)) {
  for (const id of ids) {
    if (!PATTERN_TO_TAGS.has(id)) PATTERN_TO_TAGS.set(id, []);
    PATTERN_TO_TAGS.get(id)!.push(tag);
  }
}

// ── Score computation ──────────────────────────────────────────────────────

function rawScoreFromCount(observedCount: number): number {
  return Math.max(SCORE_FLOOR, NEUTRAL_SCORE - observedCount * SCORE_STEP);
}

function decayedScore(
  raw: number,
  lastSeenAt: number,
  now: number,
): number {
  const daysSince = (now - lastSeenAt) / MS_PER_DAY;
  const k = Math.exp(-daysSince / MASTERY_HALF_LIFE_DAYS);
  return raw * k + NEUTRAL_SCORE * (1 - k);
}

function confidenceWidth(observedCount: number): number {
  if (observedCount === 0) return 0.5;
  return Math.max(CONF_FLOOR, CONF_MAX / Math.sqrt(observedCount));
}

// ── Main export ────────────────────────────────────────────────────────────

/**
 * Derives a `LearnerInterferenceProfile` from a `LearnerHistoryProfile`.
 *
 * Patterns present in the catalogue but absent from the history stay "untested".
 * Patterns mapped via TAG_TO_PATTERN_IDS receive evidence from whichever tags
 * fire; if a pattern is reachable via multiple tags, their evidence combines
 * (counts summed, most recent `lastSeenAt` wins).
 *
 * @param historyProfile - Device-local learner history (from learnerHistoryProfile.ts)
 * @param patterns       - The VNL1 pattern catalogue
 * @param now            - Epoch ms to compute decay from (caller-supplied for determinism)
 */
export function deriveMasteryProfile(
  historyProfile: LearnerHistoryProfile,
  patterns: VNL1Pattern[],
  now: number,
): LearnerInterferenceProfile {
  // Build a per-patternId accumulator from the history's interferencePatterns.
  type Accumulator = { totalCount: number; mostRecentAt: number };
  const accByPattern = new Map<string, Accumulator>();

  for (const ip of historyProfile.interferencePatterns) {
    const ids = TAG_TO_PATTERN_IDS[ip.tag as string] ?? [];
    for (const patternId of ids) {
      const existing = accByPattern.get(patternId);
      if (existing) {
        existing.totalCount += ip.observedCount;
        existing.mostRecentAt = Math.max(existing.mostRecentAt, ip.lastSeenAt);
      } else {
        accByPattern.set(patternId, {
          totalCount: ip.observedCount,
          mostRecentAt: ip.lastSeenAt,
        });
      }
    }
  }

  const masteryByPattern: Record<string, InterferenceMasteryScore> = {};

  for (const pattern of patterns) {
    const acc = accByPattern.get(pattern.id);
    if (!acc || acc.totalCount === 0) continue;

    const raw = rawScoreFromCount(acc.totalCount);
    const score = decayedScore(raw, acc.mostRecentAt, now);
    const cw = confidenceWidth(acc.totalCount);
    const level = scoringToLevel(score, acc.totalCount);

    masteryByPattern[pattern.id] = {
      patternId: pattern.id,
      level,
      score,
      attemptsCount: acc.totalCount,
      confidenceWidth: cw,
      lastUpdatedAt: acc.mostRecentAt,
    };
  }

  return {
    learnerId: `${historyProfile.product}:${historyProfile.targetLanguage}`,
    masteryByPattern,
    profileUpdatedAt: historyProfile.updatedAt,
  };
}

/**
 * Merges a server-leg interference summary (from conversation_events errorType tags)
 * into a local LearnerInterferenceProfile.
 *
 * Used by the cross-device recall path (Step 12 / !871): the server provides
 * recent `errorType` tag+count pairs; this function increments the existing
 * pattern scores, combining device-local and server evidence.
 *
 * Tags not in TAG_TO_PATTERN_IDS are silently ignored.
 *
 * @param profile  - Existing LearnerInterferenceProfile (may be derived from local history)
 * @param serverTags - Array of {tag, count, lastSeenAt} from server recall
 * @param now      - Epoch ms for decay computation
 */
export function mergeServerTagsIntoProfile(
  profile: LearnerInterferenceProfile,
  serverTags: Array<{ tag: string; count: number; lastSeenAt: number }>,
  now: number,
): LearnerInterferenceProfile {
  if (serverTags.length === 0) return profile;

  const merged: Record<string, InterferenceMasteryScore> = { ...profile.masteryByPattern };

  for (const { tag, count, lastSeenAt } of serverTags) {
    const ids = TAG_TO_PATTERN_IDS[tag] ?? [];
    for (const patternId of ids) {
      const existing = merged[patternId];
      if (existing) {
        const newCount = existing.attemptsCount + count;
        const newLastSeen = Math.max(existing.lastUpdatedAt, lastSeenAt);
        const raw = rawScoreFromCount(newCount);
        const score = decayedScore(raw, newLastSeen, now);
        merged[patternId] = {
          ...existing,
          attemptsCount: newCount,
          lastUpdatedAt: newLastSeen,
          score,
          level: scoringToLevel(score, newCount),
          confidenceWidth: confidenceWidth(newCount),
        };
      } else {
        const raw = rawScoreFromCount(count);
        const score = decayedScore(raw, lastSeenAt, now);
        merged[patternId] = {
          patternId,
          level: scoringToLevel(score, count),
          score,
          attemptsCount: count,
          confidenceWidth: confidenceWidth(count),
          lastUpdatedAt: lastSeenAt,
        };
      }
    }
  }

  return { ...profile, masteryByPattern: merged };
}
