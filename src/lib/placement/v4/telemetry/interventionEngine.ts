// Placement v4 telemetry — adaptive intervention engine.
//
// Given:
//   - a progression snapshot (current learner state from upstream),
//   - an aggregation summary (history),
//   - an optional learner-memory summary,
// produce a deterministic InterventionPlan with bilingual learner-facing
// strings and machine-readable reason codes.
//
// Determinism contract: same inputs → byte-identical recommendation list,
// same id, same priority ordering. No Date.now. No randomness.

import { fnv1a64Hex } from "./privacy";
import { canonicalJSON } from "./replay";
import { utcDayOrdinal } from "./time";
import type { AggregationSummary, LessonAggregate } from "./types";
import type {
  AdaptiveSignalBundle,
  BilingualString,
  BurnoutRisk,
  ChurnRisk,
  IneffectiveClusterFlag,
  InterventionEvidence,
  InterventionKind,
  InterventionPlan,
  InterventionPriority,
  InterventionRecommendation,
  L1PersistencePattern,
  LearnerMemorySummaryLike,
  ProgressionSnapshotLike,
  ReviewOverload,
  RiskLevel,
  Skill,
  SpeakingAvoidance,
  StagnationAssessment,
} from "./adaptiveTelemetryTypes";

// ---------------------------------------------------------------------------
// Tunable thresholds — kept centralized so they are easy to audit.
// ---------------------------------------------------------------------------

export interface InterventionThresholds {
  burnout: {
    minutesPerDayHigh: number;
    retryBurdenHigh: number;
    consecutiveIntensiveDaysHigh: number;
    dropoffRateHigh: number;
    hesitationRateHigh: number;
  };
  churn: {
    daysSinceActiveHigh: number;
    daysSinceActiveCritical: number;
    densityLow: number;
  };
  stagnation: {
    daysWithoutGainHigh: number;
    masteryStagnantDelta: number;
  };
  speaking: {
    skippedRatioHigh: number;
    consecutiveSkipsHigh: number;
  };
  review: {
    debtHigh: number;
  };
  l1: {
    persistOccurrencesHigh: number;
    practicedThreshold: number;
  };
}

export const DEFAULT_THRESHOLDS: InterventionThresholds = {
  burnout: {
    minutesPerDayHigh: 75,
    retryBurdenHigh: 2.0,
    consecutiveIntensiveDaysHigh: 5,
    dropoffRateHigh: 0.4,
    hesitationRateHigh: 0.25,
  },
  churn: {
    daysSinceActiveHigh: 7,
    daysSinceActiveCritical: 21,
    densityLow: 0.3,
  },
  stagnation: {
    daysWithoutGainHigh: 14,
    masteryStagnantDelta: 0.02,
  },
  speaking: {
    skippedRatioHigh: 0.4,
    consecutiveSkipsHigh: 3,
  },
  review: {
    debtHigh: 5,
  },
  l1: {
    persistOccurrencesHigh: 3,
    practicedThreshold: 2,
  },
};

// ---------------------------------------------------------------------------
// Signal computation
// ---------------------------------------------------------------------------

export interface ComputeSignalsInput {
  snapshot: ProgressionSnapshotLike;
  aggregation: AggregationSummary;
  memory?: LearnerMemorySummaryLike;
  /** Optional ineffective-cluster flags supplied by the clustering module. */
  ineffectiveClusters?: readonly IneffectiveClusterFlag[];
  thresholds?: InterventionThresholds;
}

export function computeAdaptiveSignals(
  input: ComputeSignalsInput,
): AdaptiveSignalBundle {
  const thresholds = input.thresholds ?? DEFAULT_THRESHOLDS;
  return {
    burnout: assessBurnout(input.snapshot, input.aggregation, thresholds),
    churn: assessChurn(input.snapshot, input.aggregation, thresholds),
    stagnation: assessStagnation(input.snapshot, input.memory, thresholds),
    speakingAvoidance: assessSpeakingAvoidance(
      input.aggregation,
      input.memory,
      thresholds,
    ),
    reviewOverload: assessReviewOverload(input.snapshot, thresholds),
    l1Persistence: assessL1Persistence(input.snapshot, input.memory, thresholds),
    ineffectiveClusters: input.ineffectiveClusters ?? [],
  };
}

function assessBurnout(
  snapshot: ProgressionSnapshotLike,
  agg: AggregationSummary,
  thresholds: InterventionThresholds,
): BurnoutRisk {
  const factors: Array<BurnoutRisk["factors"][number]> = [];
  const plan = snapshot.plan;
  const currentDay = plan.days.find((d) => d.day === snapshot.currentDay);
  const minutesToday =
    currentDay?.lessons.reduce((acc, l) => acc + l.estimatedMinutes, 0) ?? 0;
  if (minutesToday >= thresholds.burnout.minutesPerDayHigh) {
    factors.push({
      code: "daily_load_excess",
      weight: 0.3,
      metricValue: minutesToday,
    });
  }
  const userAgg = agg.users.find((u) => u.userIdHash === snapshot.userIdHash);
  if (userAgg && userAgg.lessonsCompleted > 0) {
    const retryBurden = userAgg.totalRetries / userAgg.lessonsCompleted;
    if (retryBurden >= thresholds.burnout.retryBurdenHigh) {
      factors.push({
        code: "retry_burden_high",
        weight: 0.25,
        metricValue: retryBurden,
      });
    }
  }
  const consecutiveIntensive = countConsecutiveIntensiveDays(plan, snapshot.currentDay);
  if (consecutiveIntensive >= thresholds.burnout.consecutiveIntensiveDaysHigh) {
    factors.push({
      code: "consecutive_intensive_days",
      weight: 0.2,
      metricValue: consecutiveIntensive,
    });
  }
  const lessonsForUser = lessonsThatContainUser(agg, snapshot.userIdHash);
  if (lessonsForUser.length > 0) {
    const dropoffRate =
      lessonsForUser.reduce((s, l) => s + (l.starts > 0 ? l.dropoffs / l.starts : 0), 0) /
      lessonsForUser.length;
    if (dropoffRate >= thresholds.burnout.dropoffRateHigh) {
      factors.push({
        code: "dropoff_spike",
        weight: 0.15,
        metricValue: dropoffRate,
      });
    }
    const hesitationRate =
      lessonsForUser.reduce((s, l) => s + (l.starts > 0 ? l.hesitationLoops / l.starts : 0), 0) /
      lessonsForUser.length;
    if (hesitationRate >= thresholds.burnout.hesitationRateHigh) {
      factors.push({
        code: "hesitation_loop_spike",
        weight: 0.1,
        metricValue: hesitationRate,
      });
    }
  }
  const score = clamp01(factors.reduce((acc, f) => acc + f.weight, 0));
  return { level: scoreToLevel(score), score, factors };
}

function assessChurn(
  snapshot: ProgressionSnapshotLike,
  agg: AggregationSummary,
  thresholds: InterventionThresholds,
): ChurnRisk {
  const factors: Array<ChurnRisk["factors"][number]> = [];
  const userAgg = agg.users.find((u) => u.userIdHash === snapshot.userIdHash);
  const lastSeenMs = userAgg?.lastSeenMs ?? snapshot.snapshotMs;
  const daysSinceActive = Math.max(
    0,
    utcDayOrdinal(snapshot.snapshotMs) - utcDayOrdinal(lastSeenMs),
  );
  if (daysSinceActive >= thresholds.churn.daysSinceActiveCritical) {
    factors.push({
      code: "long_inactive_gap",
      weight: 0.45,
      metricValue: daysSinceActive,
    });
  } else if (daysSinceActive >= thresholds.churn.daysSinceActiveHigh) {
    factors.push({
      code: "long_inactive_gap",
      weight: 0.25,
      metricValue: daysSinceActive,
    });
  }
  let activityDensity = 0;
  if (userAgg && userAgg.activeDays.length > 0) {
    const span =
      utcDayOrdinal(userAgg.lastSeenMs) - utcDayOrdinal(userAgg.firstSeenMs) + 1;
    activityDensity = span > 0 ? userAgg.activeDays.length / span : 0;
    if (activityDensity < thresholds.churn.densityLow) {
      factors.push({
        code: "low_activity_density",
        weight: 0.15,
        metricValue: activityDensity,
      });
    }
  }
  if (snapshot.streakDays === 0) {
    factors.push({
      code: "streak_broken_recently",
      weight: 0.15,
      metricValue: 0,
    });
  }
  if (
    typeof snapshot.reviewDebtCount === "number" &&
    snapshot.reviewDebtCount >= thresholds.review.debtHigh
  ) {
    factors.push({
      code: "review_debt_overflow",
      weight: 0.1,
      metricValue: snapshot.reviewDebtCount,
    });
  }
  const score = clamp01(factors.reduce((acc, f) => acc + f.weight, 0));
  return {
    level: scoreToLevel(score),
    score,
    daysSinceLastActive: daysSinceActive,
    activityDensity,
    factors,
  };
}

function assessStagnation(
  snapshot: ProgressionSnapshotLike,
  memory: LearnerMemorySummaryLike | undefined,
  thresholds: InterventionThresholds,
): StagnationAssessment {
  const bySkill: Record<string, {
    isStagnant: boolean;
    daysWithoutMasteryGain: number;
    masteryAtStart: number;
    masteryAtEnd: number;
  }> = {};
  const criticallyStagnantSkills: Skill[] = [];

  for (const [skillKey, progress] of Object.entries(snapshot.skills) as [
    Skill,
    NonNullable<ProgressionSnapshotLike["skills"][Skill]>,
  ][]) {
    if (!progress) continue;
    const masteryAtEnd = progress.mastery;
    const lastDay = progress.lastPracticedDayOrdinal;
    const todayOrdinal = utcDayOrdinal(snapshot.snapshotMs);
    const daysWithout =
      typeof lastDay === "number" ? Math.max(0, todayOrdinal - lastDay) : 0;
    // We don't have a true "mastery at start"; default to end so the delta is
    // 0 and stagnation is driven by inactivity rather than fictional gain.
    const masteryAtStart = approximateMasteryAtStart(skillKey, memory, masteryAtEnd);
    const masteryDelta = masteryAtEnd - masteryAtStart;
    const isStagnant =
      daysWithout >= thresholds.stagnation.daysWithoutGainHigh ||
      Math.abs(masteryDelta) < thresholds.stagnation.masteryStagnantDelta;
    bySkill[skillKey] = {
      isStagnant,
      daysWithoutMasteryGain: daysWithout,
      masteryAtStart,
      masteryAtEnd,
    };
    if (
      isStagnant &&
      daysWithout >= thresholds.stagnation.daysWithoutGainHigh + 7
    ) {
      criticallyStagnantSkills.push(skillKey);
    }
  }

  return {
    bySkill: bySkill as StagnationAssessment["bySkill"],
    criticallyStagnantSkills: [...criticallyStagnantSkills].sort(),
  };
}

function approximateMasteryAtStart(
  _skill: Skill,
  memory: LearnerMemorySummaryLike | undefined,
  defaultEnd: number,
): number {
  // The memory summary may carry checkpoint events; the simplest conservative
  // approximation is to return defaultEnd, so the engine surfaces stagnation
  // only when inactivity-driven. Upstream can supply richer memory later.
  if (!memory) return defaultEnd;
  const checkpoints = memory.recent.filter((e) => e.kind === "checkpoint");
  if (checkpoints.length === 0) return defaultEnd;
  return defaultEnd;
}

function assessSpeakingAvoidance(
  agg: AggregationSummary,
  memory: LearnerMemorySummaryLike | undefined,
  thresholds: InterventionThresholds,
): SpeakingAvoidance {
  let skippedSpeaking = 0;
  let totalSpeaking = 0;
  for (const lesson of agg.lessons) {
    if (lesson.speakingRetries === 0 && lesson.dropoffs === 0 && lesson.completions === 0) {
      continue;
    }
    // We don't track lesson modality on the aggregate; use speakingRetries as
    // a proxy: if a lesson has speakingRetries > 0, it's a speaking lesson.
    if (lesson.speakingRetries > 0) {
      totalSpeaking += lesson.starts;
      skippedSpeaking += lesson.dropoffs;
    }
  }
  let consecutiveSkips = 0;
  if (memory) {
    const recent = memory.recent.slice().sort((a, b) => a.timestampMs - b.timestampMs);
    let run = 0;
    for (const ev of recent) {
      if (ev.kind === "lesson_skipped") {
        run += 1;
      } else if (ev.kind === "lesson_completed" && ev.reference.startsWith("speaking_")) {
        run = 0;
      }
    }
    consecutiveSkips = run;
  }
  const ratio = totalSpeaking > 0 ? skippedSpeaking / totalSpeaking : 0;
  return {
    detected:
      ratio >= thresholds.speaking.skippedRatioHigh ||
      consecutiveSkips >= thresholds.speaking.consecutiveSkipsHigh,
    speakingLessonsSkippedRatio: ratio,
    consecutiveSpeakingSkips: consecutiveSkips,
  };
}

function assessReviewOverload(
  snapshot: ProgressionSnapshotLike,
  thresholds: InterventionThresholds,
): ReviewOverload {
  const debt = snapshot.reviewDebtCount ?? 0;
  return {
    detected: debt >= thresholds.review.debtHigh,
    reviewDebtCount: debt,
    reviewDebtThreshold: thresholds.review.debtHigh,
  };
}

function assessL1Persistence(
  snapshot: ProgressionSnapshotLike,
  memory: LearnerMemorySummaryLike | undefined,
  thresholds: InterventionThresholds,
): L1PersistencePattern[] {
  const patterns: L1PersistencePattern[] = [];
  const active = new Set(snapshot.activeL1Patterns ?? []);
  for (const patternId of [...active].sort()) {
    let lessonsPracticed = 0;
    if (memory) {
      lessonsPracticed = memory.recent.filter(
        (e) =>
          e.kind === "lesson_completed" &&
          e.reference.startsWith(`l1_${patternId}`),
      ).length;
    }
    const occurrences = memory
      ? memory.recent.filter((e) => e.reference.includes(patternId)).length
      : Math.max(1, active.size);
    const isPersistent =
      lessonsPracticed >= thresholds.l1.practicedThreshold &&
      occurrences >= thresholds.l1.persistOccurrencesHigh;
    patterns.push({
      patternId,
      occurrencesObserved: occurrences,
      lessonsPracticed,
      isPersistent,
    });
  }
  return patterns;
}

// ---------------------------------------------------------------------------
// Intervention plan composition
// ---------------------------------------------------------------------------

const PRIORITY_RANK: Record<InterventionPriority, number> = {
  urgent: 3,
  high: 2,
  medium: 1,
  low: 0,
};

export interface ComposePlanInput {
  signals: AdaptiveSignalBundle;
  snapshot: ProgressionSnapshotLike;
}

export function composeInterventionPlan(
  input: ComposePlanInput,
): InterventionPlan {
  const recommendations: InterventionRecommendation[] = [];

  appendBurnoutRecommendation(recommendations, input);
  appendChurnRecommendation(recommendations, input);
  appendStagnationRecommendation(recommendations, input);
  appendSpeakingRecommendation(recommendations, input);
  appendReviewOverloadRecommendation(recommendations, input);
  appendL1PersistenceRecommendations(recommendations, input);
  appendIneffectiveClusterRecommendations(recommendations, input);
  appendAccelerationRecommendation(recommendations, input);

  // Deterministic sort: priority desc, then id asc.
  const sorted = [...recommendations].sort((a, b) => {
    const pr = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
    if (pr !== 0) return pr;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });

  return {
    recommendations: sorted,
    userIdHash: input.snapshot.userIdHash,
    snapshotMs: input.snapshot.snapshotMs,
    inputFingerprint: fingerprintInputs(input),
  };
}

function fingerprintInputs(input: ComposePlanInput): string {
  const payload = canonicalJSON({
    snapshot: input.snapshot,
    signals: input.signals,
  });
  return fnv1a64Hex(payload, "intervention_plan_v1");
}

// ---------------------------------------------------------------------------
// Recommendation builders
// ---------------------------------------------------------------------------

function appendBurnoutRecommendation(
  out: InterventionRecommendation[],
  { signals, snapshot }: ComposePlanInput,
): void {
  const burnout = signals.burnout;
  if (burnout.level === "low") return;
  const priority: InterventionPriority =
    burnout.level === "critical"
      ? "urgent"
      : burnout.level === "high"
        ? "high"
        : "medium";
  const evidence: InterventionEvidence[] = burnout.factors.map((f) => ({
    reasonCode: f.code,
    signal: `burnout_risk:${burnout.level}`,
    metricValue: f.metricValue,
  }));
  out.push({
    id: mkId("reduce_daily_load", `burnout_${burnout.level}`),
    kind: "reduce_daily_load",
    priority,
    headline: pickHeadline("reduce_daily_load"),
    body: bodyForBurnout(snapshot, burnout),
    evidence,
    target: { kind: "day", reference: String(snapshot.currentDay) },
  });
}

function appendChurnRecommendation(
  out: InterventionRecommendation[],
  { signals }: ComposePlanInput,
): void {
  const churn = signals.churn;
  if (churn.level === "low") return;
  const priority: InterventionPriority =
    churn.level === "critical" ? "urgent" : churn.level === "high" ? "high" : "medium";
  out.push({
    id: mkId("recommend_streak_recovery", `churn_${churn.level}`),
    kind: "recommend_streak_recovery",
    priority,
    headline: pickHeadline("recommend_streak_recovery"),
    body: bodyForChurn(churn),
    evidence: churn.factors.map((f) => ({
      reasonCode: f.code,
      signal: `churn_risk:${churn.level}`,
      metricValue: f.metricValue,
    })),
  });
}

function appendStagnationRecommendation(
  out: InterventionRecommendation[],
  { signals }: ComposePlanInput,
): void {
  const critical = signals.stagnation.criticallyStagnantSkills;
  if (critical.length === 0) return;
  for (const skill of critical) {
    const skillSignal = signals.stagnation.bySkill[skill];
    if (!skillSignal) continue;
    out.push({
      id: mkId("schedule_recovery_review_day", `stagnation_${skill}`),
      kind: "schedule_recovery_review_day",
      priority: "high",
      headline: pickHeadline("schedule_recovery_review_day"),
      body: bodyForStagnation(skill, skillSignal.daysWithoutMasteryGain),
      evidence: [
        {
          reasonCode: "stagnation_detected",
          signal: `stagnation:${skill}`,
          metricValue: skillSignal.daysWithoutMasteryGain,
        },
      ],
      target: { kind: "skill", reference: skill },
    });
  }
}

function appendSpeakingRecommendation(
  out: InterventionRecommendation[],
  { signals }: ComposePlanInput,
): void {
  if (!signals.speakingAvoidance.detected) return;
  out.push({
    id: mkId(
      "inject_speaking_confidence_lesson",
      `avoid_${signals.speakingAvoidance.consecutiveSpeakingSkips}_${Math.round(
        signals.speakingAvoidance.speakingLessonsSkippedRatio * 1000,
      )}`,
    ),
    kind: "inject_speaking_confidence_lesson",
    priority: "high",
    headline: pickHeadline("inject_speaking_confidence_lesson"),
    body: bodyForSpeakingAvoidance(signals.speakingAvoidance),
    evidence: [
      {
        reasonCode: "speaking_avoidance",
        signal: "speaking_skip_pattern",
        metricValue: signals.speakingAvoidance.speakingLessonsSkippedRatio,
      },
      {
        reasonCode: "consecutive_speaking_skips",
        signal: "speaking_run",
        metricValue: signals.speakingAvoidance.consecutiveSpeakingSkips,
      },
    ],
  });
}

function appendReviewOverloadRecommendation(
  out: InterventionRecommendation[],
  { signals }: ComposePlanInput,
): void {
  if (!signals.reviewOverload.detected) return;
  out.push({
    id: mkId(
      "schedule_recovery_review_day",
      `review_overload_${signals.reviewOverload.reviewDebtCount}`,
    ),
    kind: "schedule_recovery_review_day",
    priority: "high",
    headline: pickHeadline("schedule_recovery_review_day"),
    body: bodyForReviewOverload(signals.reviewOverload),
    evidence: [
      {
        reasonCode: "review_debt_overflow",
        signal: "review_overload",
        metricValue: signals.reviewOverload.reviewDebtCount,
        metricThreshold: signals.reviewOverload.reviewDebtThreshold,
      },
    ],
  });
}

function appendL1PersistenceRecommendations(
  out: InterventionRecommendation[],
  { signals }: ComposePlanInput,
): void {
  for (const pattern of signals.l1Persistence) {
    if (!pattern.isPersistent) continue;
    out.push({
      id: mkId("inject_l1_drill", `l1_${pattern.patternId}`),
      kind: "inject_l1_drill",
      priority: "medium",
      headline: pickHeadline("inject_l1_drill"),
      body: bodyForL1(pattern.patternId, pattern.occurrencesObserved),
      evidence: [
        {
          reasonCode: "l1_pattern_persistent",
          signal: `l1:${pattern.patternId}`,
          metricValue: pattern.occurrencesObserved,
        },
      ],
      target: { kind: "skill", reference: pattern.patternId },
    });
  }
}

function appendIneffectiveClusterRecommendations(
  out: InterventionRecommendation[],
  { signals }: ComposePlanInput,
): void {
  for (const cluster of signals.ineffectiveClusters) {
    out.push({
      id: mkId("swap_ineffective_cluster", cluster.clusterId),
      kind: "swap_ineffective_cluster",
      priority: "medium",
      headline: pickHeadline("swap_ineffective_cluster"),
      body: bodyForIneffectiveCluster(cluster),
      evidence: [
        {
          reasonCode: "lesson_cluster_low_composite",
          signal: cluster.clusterId,
          metricValue: cluster.meanComposite,
        },
      ],
      target: { kind: "plan", reference: cluster.clusterId },
    });
  }
}

function appendAccelerationRecommendation(
  out: InterventionRecommendation[],
  { signals, snapshot }: ComposePlanInput,
): void {
  // Only safe-to-accelerate when there is NO active risk signal, and the
  // learner has demonstrated consistent high mastery in their target CEFR.
  if (signals.burnout.level !== "low") return;
  if (signals.churn.level !== "low") return;
  if (signals.stagnation.criticallyStagnantSkills.length > 0) return;
  if (signals.speakingAvoidance.detected) return;
  if (signals.reviewOverload.detected) return;
  const highMasterySkills = Object.entries(snapshot.skills).filter(
    ([, p]) => (p?.mastery ?? 0) >= 0.85,
  );
  if (highMasterySkills.length < 2) return;
  out.push({
    id: mkId("accelerate_challenge", "ready"),
    kind: "accelerate_challenge",
    priority: "low",
    headline: pickHeadline("accelerate_challenge"),
    body: bodyForAcceleration(highMasterySkills.length),
    evidence: highMasterySkills.map(([skill, p]) => ({
      reasonCode: "high_mastery",
      signal: `mastery:${skill}`,
      metricValue: p?.mastery ?? 0,
    })),
  });
}

// ---------------------------------------------------------------------------
// Bilingual copy (compact, non-judgmental)
// ---------------------------------------------------------------------------

function pickHeadline(kind: InterventionKind): BilingualString {
  switch (kind) {
    case "reduce_daily_load":
      return {
        vi: "Hôm nay nhẹ nhàng hơn nhé",
        en: "A gentler day today",
      };
    case "inject_speaking_confidence_lesson":
      return {
        vi: "Một bài nói tự tin",
        en: "A confidence-first speaking lesson",
      };
    case "inject_l1_drill":
      return {
        vi: "Luyện điểm khó tiếng Việt",
        en: "Practice a Vietnamese-tricky pattern",
      };
    case "schedule_recovery_review_day":
      return {
        vi: "Một ngày ôn lại",
        en: "A review day",
      };
    case "accelerate_challenge":
      return {
        vi: "Sẵn sàng thử thách hơn",
        en: "Ready for a stretch",
      };
    case "recommend_streak_recovery":
      return {
        vi: "Quay lại một bài ngắn",
        en: "Pick up where you left off",
      };
    case "swap_ineffective_cluster":
      return {
        vi: "Đổi nhóm bài cho phù hợp",
        en: "Swap to a better-fitting lesson set",
      };
  }
}

function bodyForBurnout(
  snapshot: ProgressionSnapshotLike,
  burnout: BurnoutRisk,
): BilingualString {
  const day = snapshot.currentDay;
  const minutesToday =
    snapshot.plan.days
      .find((d) => d.day === day)
      ?.lessons.reduce((s, l) => s + l.estimatedMinutes, 0) ?? 0;
  return {
    vi: `Hôm nay (ngày ${day}) đang hơi nặng — khoảng ${minutesToday} phút. Mình rút gọn cho nhẹ hơn nhé.`,
    en: `Today (day ${day}) is loaded — about ${minutesToday} minutes. Let's shorten it.`,
  };
}

function bodyForChurn(churn: ChurnRisk): BilingualString {
  return {
    vi: `Bạn đã không học ${churn.daysSinceLastActive} ngày — mình mở một bài thật ngắn để bạn quay lại nhẹ nhàng.`,
    en: `You've been away ${churn.daysSinceLastActive} day(s) — let's open a short lesson to ease back in.`,
  };
}

function bodyForStagnation(skill: Skill, daysWithout: number): BilingualString {
  return {
    vi: `Kỹ năng ${skill} chưa tiến trong ${daysWithout} ngày. Mình sẽ chèn một ngày ôn tập có chủ đích.`,
    en: `${skill} hasn't moved in ${daysWithout} day(s). Slotting in a focused review day.`,
  };
}

function bodyForSpeakingAvoidance(s: SpeakingAvoidance): BilingualString {
  return {
    vi: `Mình thấy bạn đang bỏ qua bài nói (${Math.round(s.speakingLessonsSkippedRatio * 100)}%). Thêm một bài nói nhẹ, chỉ một câu thôi.`,
    en: `You've been skipping speaking lessons (${Math.round(s.speakingLessonsSkippedRatio * 100)}%). Adding a one-line confidence prompt.`,
  };
}

function bodyForReviewOverload(r: ReviewOverload): BilingualString {
  return {
    vi: `Có ${r.reviewDebtCount} bài ôn đang chờ. Một ngày nghỉ học mới để ôn lại sẽ nhẹ hơn.`,
    en: `${r.reviewDebtCount} reviews are waiting. A dedicated review day will help.`,
  };
}

function bodyForL1(patternId: string, occurrences: number): BilingualString {
  return {
    vi: `Mẫu lỗi tiếng Việt "${patternId}" vẫn lặp ${occurrences} lần. Mình tập trung vào nó hôm nay.`,
    en: `The Vietnamese-pattern "${patternId}" still recurs (${occurrences}x). Targeted drill today.`,
  };
}

function bodyForIneffectiveCluster(c: IneffectiveClusterFlag): BilingualString {
  return {
    vi: `Một nhóm bài (${c.lessonIds.length} bài) đang ít hiệu quả với mọi người. Đổi sang bài khác phù hợp hơn.`,
    en: `A cluster of ${c.lessonIds.length} lessons is underperforming. Swapping in a better-fitting set.`,
  };
}

function bodyForAcceleration(highSkillCount: number): BilingualString {
  return {
    vi: `Bạn đang ổn ở ${highSkillCount} kỹ năng. Thử một bài khó hơn một chút nhé.`,
    en: `You're solid in ${highSkillCount} skills. Try a slightly harder lesson.`,
  };
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function mkId(kind: InterventionKind, suffix: string): string {
  return `${kind}::${suffix}`;
}

function scoreToLevel(score: number): RiskLevel {
  if (score >= 0.75) return "critical";
  if (score >= 0.5) return "high";
  if (score >= 0.25) return "medium";
  return "low";
}

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function countConsecutiveIntensiveDays(
  plan: ProgressionSnapshotLike["plan"],
  currentDay: number,
): number {
  let count = 0;
  for (let d = currentDay; d >= 1; d--) {
    const day = plan.days.find((x) => x.day === d);
    if (!day || day.isRecoveryDay) break;
    const minutes = day.lessons.reduce((s, l) => s + l.estimatedMinutes, 0);
    if (minutes < 30) break;
    count += 1;
  }
  return count;
}

function lessonsThatContainUser(
  agg: AggregationSummary,
  userIdHash: string,
): LessonAggregate[] {
  return agg.lessons.filter((l) => l.userIdHashes.includes(userIdHash));
}

// ---------------------------------------------------------------------------
// Public convenience: one-call signal + plan composition
// ---------------------------------------------------------------------------

export function recommendInterventions(
  input: ComputeSignalsInput,
): { signals: AdaptiveSignalBundle; plan: InterventionPlan } {
  const signals = computeAdaptiveSignals(input);
  const plan = composeInterventionPlan({ signals, snapshot: input.snapshot });
  return { signals, plan };
}
