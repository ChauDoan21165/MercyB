/**
 * interferenceSequencer — orders interference patterns for a learner's drill
 * queue: weakest-first with spaced repetition.
 *
 * ## Ordering algorithm (priority tiers, high → low)
 *
 * ### Tier 1 — Due patterns (daysSince >= reviewInterval for this level)
 * Ordered by: mastery level ascending (struggling → emerging → consolidating →
 * mastered → untested), then severity descending (high → medium → low), then
 * patternId alphabetically for determinism.
 *
 * ### Tier 2 — Not-yet-due patterns (reviewed too recently)
 * Same sub-sort as Tier 1. Pushed behind all due patterns so a struggling
 * pattern drilled 1 hour ago doesn't monopolize the queue.
 *
 * Spacing uses SM-2-inspired review intervals per mastery level:
 * - untested    → 0 days  (always due)
 * - struggling  → 1 day
 * - emerging    → 3 days
 * - consolidating → 7 days
 * - mastered    → 21 days
 *
 * ### Empty-telemetry (all patterns untested)
 * All patterns land in Tier 1 (due = 0 days). Ordering collapses to
 * severity-descending (high → medium → low) — the default curriculum order.
 * No invented priority is applied.
 */

import type { VNL1Pattern, Severity } from "../../data/placement/vnL1Interference";
import type {
  LearnerInterferenceProfile,
  InterferenceSequence,
  InterferenceSequenceEntry,
  InterferenceMasteryLevel,
} from "./types";
import { scoringToLevel } from "./types";

// ── Priority tables ────────────────────────────────────────────────────────

const LEVEL_PRIORITY: Record<InterferenceMasteryLevel, number> = {
  struggling:    0,
  emerging:      1,
  consolidating: 2,
  mastered:      3,
  untested:      4,
};

const SEVERITY_PRIORITY: Record<Severity, number> = {
  high:   0,
  medium: 1,
  low:    2,
};

// ── Spaced-repetition review intervals ────────────────────────────────────

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Minimum interval (days) before a pattern at this mastery level should be
 * drilled again. Simplified SM-2 shape: longer intervals at higher mastery.
 */
export function computeNextReviewDayForLevel(
  level: InterferenceMasteryLevel,
): number {
  switch (level) {
    case "untested":      return 0;
    case "struggling":    return 1;
    case "emerging":      return 3;
    case "consolidating": return 7;
    case "mastered":      return 21;
  }
}

// ── Internal helpers ───────────────────────────────────────────────────────

function effectiveLevel(
  patternId: string,
  profile: LearnerInterferenceProfile,
): InterferenceMasteryLevel {
  const entry = profile.masteryByPattern[patternId];
  if (!entry) return "untested";
  return scoringToLevel(entry.score, entry.attemptsCount);
}

function isDue(
  patternId: string,
  profile: LearnerInterferenceProfile,
  level: InterferenceMasteryLevel,
  now: number,
): boolean {
  const entry = profile.masteryByPattern[patternId];
  if (!entry) return true; // untested patterns are always due
  const daysSince = (now - entry.lastUpdatedAt) / MS_PER_DAY;
  // Negative daysSince means now < lastUpdatedAt (e.g. now=0 default in tests,
  // or a clock that hasn't been supplied). Treat as overdue so the default
  // now=0 collapses to pure level-based ordering (Tier 1 for everything).
  if (daysSince < 0) return true;
  return daysSince >= computeNextReviewDayForLevel(level);
}

function rationaleFor(
  pattern: VNL1Pattern,
  level: InterferenceMasteryLevel,
  due: boolean,
): string {
  const dueNote = due ? "" : " (not yet due — reviewed recently)";
  if (level === "untested")
    return `${pattern.name}: not yet assessed — schedule a diagnostic probe.`;
  if (level === "struggling")
    return `${pattern.name}: struggling (score < 0.35) — high-priority remediation needed.${dueNote}`;
  if (level === "emerging")
    return `${pattern.name}: emerging — consolidation drills recommended.${dueNote}`;
  if (level === "consolidating")
    return `${pattern.name}: consolidating — spaced review at longer interval.${dueNote}`;
  return `${pattern.name}: mastered — maintenance only.${dueNote}`;
}

// ── Main export ────────────────────────────────────────────────────────────

/**
 * Sequence `patterns` for the given `profile`, weakest-first with spacing.
 *
 * Pure function: no I/O, no side-effects, no engine imports.
 *
 * @param profile  - Learner's current interference mastery state
 * @param patterns - VNL1 pattern catalogue
 * @param now      - Epoch ms used to determine which patterns are due for review.
 *                   Defaults to 0 so that tests without a real timestamp mark
 *                   all patterns as due (safe: collapses to pure level ordering).
 */
export function sequenceInterferencePatterns(
  profile: LearnerInterferenceProfile,
  patterns: VNL1Pattern[],
  now = 0,
): InterferenceSequence {
  type Annotated = {
    pattern: VNL1Pattern;
    level: InterferenceMasteryLevel;
    due: boolean;
  };

  const annotated: Annotated[] = patterns.map((pattern) => {
    const level = effectiveLevel(pattern.id, profile);
    const due = isDue(pattern.id, profile, level, now);
    return { pattern, level, due };
  });

  annotated.sort((a, b) => {
    // Tier 1 (due=true → 0) before Tier 2 (due=false → 1)
    const tierA = a.due ? 0 : 1;
    const tierB = b.due ? 0 : 1;
    if (tierA !== tierB) return tierA - tierB;

    // Within tier: level ascending (struggling = 0 = highest priority)
    const levelDiff = LEVEL_PRIORITY[a.level] - LEVEL_PRIORITY[b.level];
    if (levelDiff !== 0) return levelDiff;

    // Within level: severity descending (high = 0 = highest priority)
    const sevDiff = SEVERITY_PRIORITY[a.pattern.severity] - SEVERITY_PRIORITY[b.pattern.severity];
    if (sevDiff !== 0) return sevDiff;

    // Determinism tiebreaker
    return a.pattern.id.localeCompare(b.pattern.id);
  });

  const entries: InterferenceSequenceEntry[] = annotated.map(
    ({ pattern, level, due }) => ({
      patternId: pattern.id,
      rationale: rationaleFor(pattern, level, due),
    }),
  );

  return { learnerId: profile.learnerId, entries };
}
