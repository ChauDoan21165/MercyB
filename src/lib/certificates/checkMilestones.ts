// src/lib/certificates/checkMilestones.ts
//
// Pure milestone evaluator. Given a progress snapshot and the set of
// already-earned certificate types, returns the list of newly-qualified
// certificate types. No I/O, no side effects — every test can pin
// behaviour without mocks.
//
// A1 replaces the persistence layer (rpc.ts) but this file stays as the
// single source of truth for "what counts as an earned cert".

import type { CertificateType, MilestoneSnapshot } from "./types";

interface MilestoneRule {
  type: CertificateType;
  /** Snapshot field → threshold the field must meet/exceed. */
  field: keyof MilestoneSnapshot;
  threshold: number;
}

/** Single declarative table — mirrors `types.CertificateType`. New
 *  milestones are added here only; the runner is generic. */
export const MILESTONES: ReadonlyArray<MilestoneRule> = [
  // XP
  { type: "xp_100",   field: "total_xp", threshold: 100 },
  { type: "xp_500",   field: "total_xp", threshold: 500 },
  { type: "xp_1000",  field: "total_xp", threshold: 1000 },
  { type: "xp_5000",  field: "total_xp", threshold: 5000 },
  // Streak
  { type: "streak_7",   field: "streak_days", threshold: 7 },
  { type: "streak_30",  field: "streak_days", threshold: 30 },
  { type: "streak_100", field: "streak_days", threshold: 100 },
  // Rooms
  { type: "rooms_10",  field: "rooms_completed", threshold: 10 },
  { type: "rooms_50",  field: "rooms_completed", threshold: 50 },
  { type: "rooms_100", field: "rooms_completed", threshold: 100 },
  // Vocab
  { type: "vocab_50",  field: "vocab_mastered", threshold: 50 },
  { type: "vocab_200", field: "vocab_mastered", threshold: 200 },
  { type: "vocab_500", field: "vocab_mastered", threshold: 500 },
  // Pronunciation
  { type: "pronunciation_25",  field: "pronunciation_drills", threshold: 25 },
  { type: "pronunciation_100", field: "pronunciation_drills", threshold: 100 },
  // Writing
  { type: "writing_10", field: "writing_submissions", threshold: 10 },
  { type: "writing_50", field: "writing_submissions", threshold: 50 },
];

/**
 * Returns certificate types the user has *just* qualified for —
 * excludes anything already in `alreadyEarned`. Order matches MILESTONES
 * so tiered grants (e.g. xp_100 then xp_500 in one call) come back in
 * threshold order.
 */
export function checkMilestones(
  snapshot: MilestoneSnapshot,
  alreadyEarned: ReadonlySet<CertificateType> | ReadonlyArray<CertificateType>,
): CertificateType[] {
  const earnedSet =
    alreadyEarned instanceof Set
      ? alreadyEarned
      : new Set<CertificateType>(alreadyEarned);

  const newlyQualified: CertificateType[] = [];

  for (const rule of MILESTONES) {
    if (earnedSet.has(rule.type)) continue;
    const value = snapshot[rule.field];
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    if (value >= rule.threshold) {
      newlyQualified.push(rule.type);
    }
  }

  return newlyQualified;
}
