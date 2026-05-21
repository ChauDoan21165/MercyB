// Placement v4 telemetry — adaptive cohort analytics.
//
// Extends the core cohort drift analysis with views the adaptive layer
// needs: study-plan version comparison, intervention effectiveness,
// burnout-by-CEFR-band, churn-by-weak-skill profile, VN-L1 cluster
// effectiveness, and speaking-confidence retention.
//
// All views are:
//   - deterministic (same inputs → same outputs)
//   - k-anonymized (groups below the threshold are suppressed)
//   - PII-free (consume only the analytical surface; never raw profiles)
//   - replay-safe (no Date.now, no Math.random)

import type { AggregationSummary } from "./types";
import type {
  AdaptiveSignalBundle,
  InterventionPlan,
  InterventionRecommendation,
  Skill,
  StudyPlanLike,
} from "./adaptiveTelemetryTypes";
import type { CEFRLevel } from "../../../../types/placement-v3";

export interface AdaptiveCohortOptions {
  /** Minimum users for a row to be reported. */
  kAnonThreshold: number;
}

// ---------------------------------------------------------------------------
// Study-plan version comparison
// ---------------------------------------------------------------------------

export interface PlanVersionAssignment {
  userIdHash: string;
  planVersion: string;
}

export interface PlanVersionRow {
  planVersion: string;
  userN: number;
  meanCompletionRate: number;
  meanDropoffRate: number;
  meanRetryBurden: number;
}

export interface PlanVersionComparisonReport {
  rows: readonly PlanVersionRow[];
}

export function comparePlanVersions(
  summary: AggregationSummary,
  assignments: readonly PlanVersionAssignment[],
  opts: AdaptiveCohortOptions,
): PlanVersionComparisonReport {
  validateK(opts.kAnonThreshold);
  const byVersion = new Map<string, PlanVersionRow & { _samples: number }>();
  const userToVersion = new Map(
    assignments.map((a) => [a.userIdHash, a.planVersion] as const),
  );
  for (const user of summary.users) {
    const v = userToVersion.get(user.userIdHash);
    if (!v) continue;
    const userLessons = summary.lessons.filter((l) =>
      l.userIdHashes.includes(user.userIdHash),
    );
    const completion =
      userLessons.length > 0
        ? userLessons.reduce(
            (s, l) => s + (l.starts > 0 ? l.completions / l.starts : 0),
            0,
          ) / userLessons.length
        : 0;
    const dropoff =
      userLessons.length > 0
        ? userLessons.reduce(
            (s, l) => s + (l.starts > 0 ? l.dropoffs / l.starts : 0),
            0,
          ) / userLessons.length
        : 0;
    const retryBurden =
      user.lessonsCompleted > 0
        ? user.totalRetries / user.lessonsCompleted
        : 0;
    let row = byVersion.get(v);
    if (!row) {
      row = {
        planVersion: v,
        userN: 0,
        meanCompletionRate: 0,
        meanDropoffRate: 0,
        meanRetryBurden: 0,
        _samples: 0,
      };
      byVersion.set(v, row);
    }
    row.userN += 1;
    row.meanCompletionRate += completion;
    row.meanDropoffRate += dropoff;
    row.meanRetryBurden += retryBurden;
    row._samples += 1;
  }
  const rows: PlanVersionRow[] = [];
  for (const key of [...byVersion.keys()].sort()) {
    const row = byVersion.get(key)!;
    if (row.userN < opts.kAnonThreshold) continue;
    const n = row._samples;
    rows.push({
      planVersion: row.planVersion,
      userN: row.userN,
      meanCompletionRate: row.meanCompletionRate / n,
      meanDropoffRate: row.meanDropoffRate / n,
      meanRetryBurden: row.meanRetryBurden / n,
    });
  }
  return { rows };
}

// ---------------------------------------------------------------------------
// Intervention effectiveness
// ---------------------------------------------------------------------------

export interface InterventionOutcome {
  userIdHash: string;
  intervention: InterventionRecommendation;
  /** True if the learner returned within 7 days of the intervention. */
  returnedWithin7Days: boolean;
  /** True if the targeted weak skill improved by mastery >= 0.05 within 14 days. */
  weakSkillImprovedWithin14Days: boolean;
}

export interface InterventionEffectivenessRow {
  kind: InterventionRecommendation["kind"];
  userN: number;
  returnedRate: number;
  weakSkillImprovedRate: number;
}

export function analyzeInterventionEffectiveness(
  outcomes: readonly InterventionOutcome[],
  opts: AdaptiveCohortOptions,
): readonly InterventionEffectivenessRow[] {
  validateK(opts.kAnonThreshold);
  const byKind = new Map<
    InterventionRecommendation["kind"],
    {
      userN: number;
      returnedSum: number;
      improvedSum: number;
    }
  >();
  for (const outcome of outcomes) {
    const key = outcome.intervention.kind;
    let bucket = byKind.get(key);
    if (!bucket) {
      bucket = { userN: 0, returnedSum: 0, improvedSum: 0 };
      byKind.set(key, bucket);
    }
    bucket.userN += 1;
    if (outcome.returnedWithin7Days) bucket.returnedSum += 1;
    if (outcome.weakSkillImprovedWithin14Days) bucket.improvedSum += 1;
  }
  const out: InterventionEffectivenessRow[] = [];
  for (const key of [...byKind.keys()].sort()) {
    const bucket = byKind.get(key)!;
    if (bucket.userN < opts.kAnonThreshold) continue;
    out.push({
      kind: key,
      userN: bucket.userN,
      returnedRate: bucket.returnedSum / bucket.userN,
      weakSkillImprovedRate: bucket.improvedSum / bucket.userN,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Burnout-by-CEFR-band
// ---------------------------------------------------------------------------

export interface CefrBandAssignment {
  userIdHash: string;
  cefrBand: CEFRLevel;
  /** The signal bundle this user was last evaluated with. */
  signals: AdaptiveSignalBundle;
}

export interface BurnoutByCefrRow {
  cefrBand: CEFRLevel;
  userN: number;
  meanBurnoutScore: number;
  criticalCount: number;
  highCount: number;
}

export function burnoutByCefrBand(
  assignments: readonly CefrBandAssignment[],
  opts: AdaptiveCohortOptions,
): readonly BurnoutByCefrRow[] {
  validateK(opts.kAnonThreshold);
  const byBand = new Map<
    CEFRLevel,
    { userN: number; sum: number; critical: number; high: number }
  >();
  for (const a of assignments) {
    let bucket = byBand.get(a.cefrBand);
    if (!bucket) {
      bucket = { userN: 0, sum: 0, critical: 0, high: 0 };
      byBand.set(a.cefrBand, bucket);
    }
    bucket.userN += 1;
    bucket.sum += a.signals.burnout.score;
    if (a.signals.burnout.level === "critical") bucket.critical += 1;
    if (a.signals.burnout.level === "high") bucket.high += 1;
  }
  const out: BurnoutByCefrRow[] = [];
  const order: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  for (const band of order) {
    const bucket = byBand.get(band);
    if (!bucket) continue;
    if (bucket.userN < opts.kAnonThreshold) continue;
    out.push({
      cefrBand: band,
      userN: bucket.userN,
      meanBurnoutScore: bucket.sum / bucket.userN,
      criticalCount: bucket.critical,
      highCount: bucket.high,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Churn-by-weak-skill
// ---------------------------------------------------------------------------

export interface WeakSkillProfile {
  userIdHash: string;
  weakSkills: readonly Skill[];
  signals: AdaptiveSignalBundle;
}

export interface ChurnByWeakSkillRow {
  weakSkill: Skill;
  userN: number;
  meanChurnScore: number;
  lostCount: number;
  highCount: number;
}

export function churnByWeakSkill(
  profiles: readonly WeakSkillProfile[],
  opts: AdaptiveCohortOptions,
): readonly ChurnByWeakSkillRow[] {
  validateK(opts.kAnonThreshold);
  const bySkill = new Map<
    Skill,
    { userN: number; sum: number; lost: number; high: number }
  >();
  for (const profile of profiles) {
    for (const skill of profile.weakSkills) {
      let bucket = bySkill.get(skill);
      if (!bucket) {
        bucket = { userN: 0, sum: 0, lost: 0, high: 0 };
        bySkill.set(skill, bucket);
      }
      bucket.userN += 1;
      bucket.sum += profile.signals.churn.score;
      if (profile.signals.churn.level === "critical") bucket.lost += 1;
      if (profile.signals.churn.level === "high") bucket.high += 1;
    }
  }
  const out: ChurnByWeakSkillRow[] = [];
  for (const skill of [...bySkill.keys()].sort()) {
    const bucket = bySkill.get(skill)!;
    if (bucket.userN < opts.kAnonThreshold) continue;
    out.push({
      weakSkill: skill,
      userN: bucket.userN,
      meanChurnScore: bucket.sum / bucket.userN,
      lostCount: bucket.lost,
      highCount: bucket.high,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// VN-L1 cluster effectiveness
// ---------------------------------------------------------------------------

export interface L1ClusterAssignment {
  userIdHash: string;
  /** The L1 patternIds the user has been drilling. */
  patternIds: readonly string[];
  /** Whether the learner's underlying CEFR moved at least one step recently. */
  cefrMovedRecently: boolean;
  /** Whether the patterns are still flagged by the grader (persistent). */
  patternsPersist: boolean;
}

export interface L1ClusterEffectivenessRow {
  patternId: string;
  userN: number;
  cefrMovedRate: number;
  patternResolvedRate: number;
}

export function l1ClusterEffectiveness(
  assignments: readonly L1ClusterAssignment[],
  opts: AdaptiveCohortOptions,
): readonly L1ClusterEffectivenessRow[] {
  validateK(opts.kAnonThreshold);
  const byPattern = new Map<
    string,
    { userN: number; moved: number; resolved: number }
  >();
  for (const a of assignments) {
    for (const patternId of a.patternIds) {
      let bucket = byPattern.get(patternId);
      if (!bucket) {
        bucket = { userN: 0, moved: 0, resolved: 0 };
        byPattern.set(patternId, bucket);
      }
      bucket.userN += 1;
      if (a.cefrMovedRecently) bucket.moved += 1;
      if (!a.patternsPersist) bucket.resolved += 1;
    }
  }
  const out: L1ClusterEffectivenessRow[] = [];
  for (const key of [...byPattern.keys()].sort()) {
    const bucket = byPattern.get(key)!;
    if (bucket.userN < opts.kAnonThreshold) continue;
    out.push({
      patternId: key,
      userN: bucket.userN,
      cefrMovedRate: bucket.moved / bucket.userN,
      patternResolvedRate: bucket.resolved / bucket.userN,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Speaking-confidence retention
// ---------------------------------------------------------------------------

export interface SpeakingRetentionAssignment {
  userIdHash: string;
  /** True if the learner accepted an "inject_speaking_confidence_lesson" intervention. */
  acceptedConfidenceIntervention: boolean;
  /** True if the learner returned to speaking lessons within 7 days. */
  returnedToSpeakingWithin7Days: boolean;
  /** True if speaking mastery improved by >= 0.05 within 14 days. */
  speakingMasteryGained: boolean;
}

export interface SpeakingRetentionRow {
  cohort: "accepted" | "not_accepted";
  userN: number;
  returnedRate: number;
  masteryGainedRate: number;
}

export function speakingConfidenceRetention(
  assignments: readonly SpeakingRetentionAssignment[],
  opts: AdaptiveCohortOptions,
): readonly SpeakingRetentionRow[] {
  validateK(opts.kAnonThreshold);
  const buckets = {
    accepted: { userN: 0, returned: 0, gained: 0 },
    not_accepted: { userN: 0, returned: 0, gained: 0 },
  };
  for (const a of assignments) {
    const key = a.acceptedConfidenceIntervention ? "accepted" : "not_accepted";
    buckets[key].userN += 1;
    if (a.returnedToSpeakingWithin7Days) buckets[key].returned += 1;
    if (a.speakingMasteryGained) buckets[key].gained += 1;
  }
  const out: SpeakingRetentionRow[] = [];
  for (const key of ["accepted", "not_accepted"] as const) {
    const b = buckets[key];
    if (b.userN < opts.kAnonThreshold) continue;
    out.push({
      cohort: key,
      userN: b.userN,
      returnedRate: b.returned / b.userN,
      masteryGainedRate: b.gained / b.userN,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function validateK(k: number): void {
  if (!Number.isInteger(k) || k < 1) {
    throw new Error("kAnonThreshold must be a positive integer");
  }
}

// Re-export type aliases other adapters reference.
export type { InterventionPlan, StudyPlanLike };
