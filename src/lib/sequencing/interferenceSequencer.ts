/**
 * interferenceSequencer — pure lib stub (no engine edits).
 *
 * Given a learner's interference mastery profile and the full catalogue of
 * VNL1 patterns, returns a recommended study sequence ordered so that the
 * patterns most in need of attention come first.
 *
 * ## Ordering algorithm (priority, high → low)
 * 1. Mastery level ascending: struggling → emerging → consolidating → mastered → untested
 *    (untested last — we can only prioritize what we know is broken)
 * 2. Within the same level, severity descending: high → medium → low
 * 3. Within the same level + severity, alphabetical by patternId for determinism
 */

import type { VNL1Pattern, Severity } from "../../data/placement/vnL1Interference";
import type {
  LearnerInterferenceProfile,
  InterferenceSequence,
  InterferenceSequenceEntry,
  InterferenceMasteryLevel,
} from "./types";
import { scoringToLevel } from "./types";

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

function effectiveLevel(
  patternId: string,
  profile: LearnerInterferenceProfile,
): InterferenceMasteryLevel {
  const entry = profile.masteryByPattern[patternId];
  if (!entry) return "untested";
  return scoringToLevel(entry.score, entry.attemptsCount);
}

function rationaleFor(
  pattern: VNL1Pattern,
  level: InterferenceMasteryLevel,
): string {
  if (level === "untested") return `${pattern.name}: not yet assessed — schedule a diagnostic probe.`;
  if (level === "struggling") return `${pattern.name}: struggling (score < 0.35) — high-priority remediation needed.`;
  if (level === "emerging") return `${pattern.name}: emerging — consolidation drills recommended.`;
  if (level === "consolidating") return `${pattern.name}: consolidating — spaced review at longer interval.`;
  return `${pattern.name}: mastered — maintenance only.`;
}

/**
 * Sequence `patterns` for the given `profile`.
 *
 * Pure function: no I/O, no side-effects, no engine imports.
 */
export function sequenceInterferencePatterns(
  profile: LearnerInterferenceProfile,
  patterns: VNL1Pattern[],
): InterferenceSequence {
  const sorted = [...patterns].sort((a, b) => {
    const levelA = LEVEL_PRIORITY[effectiveLevel(a.id, profile)];
    const levelB = LEVEL_PRIORITY[effectiveLevel(b.id, profile)];
    if (levelA !== levelB) return levelA - levelB;

    const sevA = SEVERITY_PRIORITY[a.severity];
    const sevB = SEVERITY_PRIORITY[b.severity];
    if (sevA !== sevB) return sevA - sevB;

    return a.id.localeCompare(b.id);
  });

  const entries: InterferenceSequenceEntry[] = sorted.map((pattern) => {
    const level = effectiveLevel(pattern.id, profile);
    return { patternId: pattern.id, rationale: rationaleFor(pattern, level) };
  });

  return { learnerId: profile.learnerId, entries };
}
