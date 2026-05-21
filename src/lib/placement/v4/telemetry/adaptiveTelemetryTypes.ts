// Placement v4 telemetry — structural adapter contracts.
//
// These types describe the SHAPE of upstream surfaces (study plan,
// progression snapshot, learner memory, forecast, curriculum signal) WITHOUT
// importing the upstream modules. Upstream surfaces are owned by separate
// concurrent agents (A1/A4/A6); their files are not yet stable on main.
//
// The contract:
//   - Upstream authors hand a structurally-conformant object to the adapters
//     in studyPlanTelemetry / interventionEngine / forecastAnalysis.
//   - The adapters consume only documented fields; extra fields are ignored
//     so upstream can evolve without forcing this layer to ship.
//   - All time is integer Unix milliseconds; no Date.now is read here.
//   - All decisions emit reason codes so downstream UIs can render
//     learner-readable explanations without re-deriving the rationale.

import type { CEFRLevel, PlacementV3Modality } from "../../../../types/placement-v3";

// ---------------------------------------------------------------------------
// CEFR ladder (re-used)
// ---------------------------------------------------------------------------

export type Skill = PlacementV3Modality | "vocabulary" | "grammar" | "pronunciation";

export const CEFR_RANK: Readonly<Record<CEFRLevel, number>> = {
  A1: 0,
  A2: 1,
  B1: 2,
  B2: 3,
  C1: 4,
  C2: 5,
};

// ---------------------------------------------------------------------------
// Structural shapes — what upstream supplies
// ---------------------------------------------------------------------------

export interface StudyPlanLessonLike {
  /** Stable lesson identifier the recommender/sequencer agreed on. */
  lessonId: string;
  /** Primary skill the lesson targets. */
  skill: Skill;
  /** Estimated minutes for the lesson (>= 0). */
  estimatedMinutes: number;
  /** Optional CEFR target this lesson aims at. */
  cefrTarget?: CEFRLevel;
  /** Optional L1-interference pattern tags the lesson is intended to drill. */
  l1Patterns?: readonly string[];
}

export interface StudyPlanDayLike {
  /** 1-based day index within the plan. */
  day: number;
  /** Lessons scheduled for this day, in intended order. */
  lessons: readonly StudyPlanLessonLike[];
  /** Whether this day is a recovery/review day rather than new learning. */
  isRecoveryDay?: boolean;
}

export type StudyPlanIntensity = "gentle" | "balanced" | "intense";

export interface StudyPlanLike {
  /** Stable plan version, e.g. "v4.2025-05-21". Used for cohort comparison. */
  planVersion: string;
  /** Total plan length in days. */
  totalDays: number;
  /** Daily-load classification supplied by the sequencer. */
  intensity: StudyPlanIntensity;
  /** Plan days in day-order. */
  days: readonly StudyPlanDayLike[];
  /** Optional generation timestamp from the sequencer — never read as "now". */
  generatedAtMs?: number;
}

export interface SkillProgressLike {
  /** 0..1 mastery the upstream engine reports. */
  mastery: number;
  /** 0..1 confidence the upstream engine reports. */
  confidence?: number;
  /** Total attempts logged for this skill. */
  attempts?: number;
  /** Last UTC day ordinal this skill was practiced. */
  lastPracticedDayOrdinal?: number;
}

export interface ProgressionSnapshotLike {
  /** Pseudonymized learner id (already hashed by caller). */
  userIdHash: string;
  /** Stable session id supplied by the host flow. */
  sessionId: string;
  /** Snapshot timestamp in ms. Caller-supplied "now". */
  snapshotMs: number;
  /** Active study plan when the snapshot was taken. */
  plan: StudyPlanLike;
  /** Index of the current plan day (1-based) the learner is on. */
  currentDay: number;
  /** Last day they actually completed a lesson on. */
  lastActiveDay: number;
  /** Per-skill progress reports from the engine. */
  skills: Partial<Record<Skill, SkillProgressLike>>;
  /** CEFR snapshot per modality + overall. */
  cefr: {
    overall: CEFRLevel;
    perSkill?: Partial<Record<Skill, CEFRLevel>>;
  };
  /** Currently-active L1 interference patterns the grader still flags. */
  activeL1Patterns?: readonly string[];
  /** Number of lessons currently in "review debt" (overdue review). */
  reviewDebtCount?: number;
  /** Current streak in days. */
  streakDays?: number;
}

export interface LearnerMemoryEventLike {
  /** When this event happened (caller-supplied integer ms). */
  timestampMs: number;
  /** Coarse event kind from learner memory. */
  kind:
    | "lesson_completed"
    | "lesson_skipped"
    | "speaking_struggle"
    | "review_overdue"
    | "checkpoint";
  /** Free-form tag (e.g. lessonId, promptId) — never user text. */
  reference: string;
}

export interface LearnerMemorySummaryLike {
  userIdHash: string;
  /** Recent learner-memory events the upstream layer thinks are relevant. */
  recent: readonly LearnerMemoryEventLike[];
  /** Pseudonymized session id list this summary spans. */
  sessionIds: readonly string[];
}

export interface ForecastSkillTargetLike {
  skill: Skill;
  /** Predicted CEFR level at the forecast horizon. */
  predictedCefr: CEFRLevel;
  /** Predicted mastery (0..1). */
  predictedMastery: number;
  /** 0..1 confidence the forecaster reports. */
  confidence: number;
}

export interface ForecastLike {
  /** Stable forecast id from the simulator. */
  forecastId: string;
  /** Plan version this forecast was conditioned on. */
  planVersion: string;
  /** Forecast horizon in days from plan start. */
  horizonDays: number;
  /** Per-skill predictions at the horizon. */
  targets: readonly ForecastSkillTargetLike[];
  /** Forecasted streak length at horizon. */
  predictedStreakDays?: number;
  /** Forecasted review-debt count at horizon. */
  predictedReviewDebt?: number;
}

export type CurriculumSignalKind =
  | "recommend_lesson"
  | "avoid_lesson"
  | "review_due"
  | "challenge_unlocked"
  | "intervention_required";

export interface CurriculumSignalLike {
  kind: CurriculumSignalKind;
  /** Reference id (lesson id, plan id, etc.) the signal points at. */
  reference: string;
  /** Plain reason code from the sequencer. */
  reasonCode: string;
  /** Optional payload for the signal (no PII). */
  metadata?: Readonly<Record<string, string | number | boolean>>;
}

// ---------------------------------------------------------------------------
// Intervention vocabulary
// ---------------------------------------------------------------------------

export type InterventionKind =
  | "reduce_daily_load"
  | "inject_speaking_confidence_lesson"
  | "inject_l1_drill"
  | "schedule_recovery_review_day"
  | "accelerate_challenge"
  | "recommend_streak_recovery"
  | "swap_ineffective_cluster";

export type InterventionPriority = "low" | "medium" | "high" | "urgent";

export interface BilingualString {
  vi: string;
  en: string;
}

export interface InterventionEvidence {
  /** Stable reason code (machine-readable, snake_case). */
  reasonCode: string;
  /** What signal triggered this (e.g. "burnout_risk:high"). */
  signal: string;
  /** Numeric backing value if applicable (e.g. retryBurden=2.4). */
  metricValue?: number;
  /** Threshold the metricValue compared against. */
  metricThreshold?: number;
}

export interface InterventionRecommendation {
  /** Deterministic id derived from contents — same inputs always yield same id. */
  id: string;
  kind: InterventionKind;
  priority: InterventionPriority;
  /** Bilingual learner-facing one-liner. */
  headline: BilingualString;
  /** Bilingual learner-facing body (non-judgmental, plain). */
  body: BilingualString;
  /** Machine-readable evidence trail. */
  evidence: readonly InterventionEvidence[];
  /** Optional reference to a lesson/plan/day the intervention targets. */
  target?: {
    kind: "lesson" | "day" | "skill" | "plan";
    reference: string;
  };
}

export interface InterventionPlan {
  /** Recommendations in priority-then-id order. */
  recommendations: readonly InterventionRecommendation[];
  /** Pseudonymized learner id this plan was computed for. */
  userIdHash: string;
  /** Snapshot timestamp the plan reflects. */
  snapshotMs: number;
  /** Stable input fingerprint so callers can verify replay equivalence. */
  inputFingerprint: string;
}

// ---------------------------------------------------------------------------
// Risk assessment types
// ---------------------------------------------------------------------------

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface BurnoutRisk {
  level: RiskLevel;
  /** 0..1 composite score (deterministic from the inputs). */
  score: number;
  factors: readonly {
    code:
      | "daily_load_excess"
      | "retry_burden_high"
      | "consecutive_intensive_days"
      | "dropoff_spike"
      | "hesitation_loop_spike";
    weight: number;
    metricValue: number;
  }[];
}

export interface ChurnRisk {
  level: RiskLevel;
  score: number;
  daysSinceLastActive: number;
  activityDensity: number;
  factors: readonly {
    code:
      | "long_inactive_gap"
      | "low_activity_density"
      | "streak_broken_recently"
      | "review_debt_overflow";
    weight: number;
    metricValue: number;
  }[];
}

export interface StagnationAssessment {
  /** Per-skill stagnation flags + the days-without-progress observed. */
  bySkill: Readonly<Partial<Record<Skill, {
    isStagnant: boolean;
    daysWithoutMasteryGain: number;
    masteryAtStart: number;
    masteryAtEnd: number;
  }>>>;
  /** Skills called out as critically stagnant. */
  criticallyStagnantSkills: readonly Skill[];
}

export interface SpeakingAvoidance {
  detected: boolean;
  speakingLessonsSkippedRatio: number;
  consecutiveSpeakingSkips: number;
}

export interface ReviewOverload {
  detected: boolean;
  reviewDebtCount: number;
  reviewDebtThreshold: number;
}

export interface L1PersistencePattern {
  patternId: string;
  occurrencesObserved: number;
  lessonsPracticed: number;
  /** True if the pattern still triggers grader flags after deliberate practice. */
  isPersistent: boolean;
}

export interface IneffectiveClusterFlag {
  clusterId: string;
  lessonIds: readonly string[];
  meanComposite: number;
  userN: number;
}

export interface AdaptiveSignalBundle {
  burnout: BurnoutRisk;
  churn: ChurnRisk;
  stagnation: StagnationAssessment;
  speakingAvoidance: SpeakingAvoidance;
  reviewOverload: ReviewOverload;
  l1Persistence: readonly L1PersistencePattern[];
  ineffectiveClusters: readonly IneffectiveClusterFlag[];
}

// ---------------------------------------------------------------------------
// Forecast deviation types
// ---------------------------------------------------------------------------

export type ForecastDeviationCode =
  | "forecast_error_above_tolerance"
  | "optimistic_bias"
  | "stagnation_against_forecast"
  | "false_acceleration"
  | "weak_skill_prediction_miss";

export interface ForecastDeviation {
  skill: Skill;
  code: ForecastDeviationCode;
  predictedMastery: number;
  observedMastery: number;
  deltaCefrSteps: number;
  predictedCefr: CEFRLevel;
  observedCefr: CEFRLevel;
}

export interface ForecastDeviationReport {
  forecastId: string;
  planVersion: string;
  /** 0..1 — confidence ranging downward as more deviations stack up. */
  degradedConfidence: number;
  deviations: readonly ForecastDeviation[];
  /** Recalibration suggestions — explainable, no opaque scoring. */
  recalibrationRecommendations: readonly RecalibrationSuggestion[];
}

export type RecalibrationSuggestionKind =
  | "shorten_horizon"
  | "lower_mastery_targets"
  | "raise_review_frequency"
  | "drop_speaking_acceleration"
  | "rerun_placement";

export interface RecalibrationSuggestion {
  kind: RecalibrationSuggestionKind;
  reasonCode: string;
  evidence: readonly ForecastDeviation[];
}

// ---------------------------------------------------------------------------
// Bilingual diagnostic surface (learner-readable)
// ---------------------------------------------------------------------------

export type DiagnosticKind =
  | "focus_area_this_week"
  | "you_may_be_overloaded"
  | "speaking_confidence_improving"
  | "review_debt_building"
  | "pronunciation_lagging_expected"
  | "streak_recoverable";

export interface LearnerDiagnostic {
  kind: DiagnosticKind;
  /** Headline rendered above the body. */
  headline: BilingualString;
  /** Plain, non-judgmental body. */
  body: BilingualString;
  /** Reason code linking back to evidence in the intervention or forecast. */
  reasonCode: string;
  /** Optional severity hint for UI styling (informational/cautionary/celebratory). */
  tone: "informational" | "celebratory" | "cautionary";
}
