/**
 * Learning Gain Rubric — Before and After Learner Improvement Measurement
 *
 * Measures how much a learner improved during a tutoring session using a
 * 7-dimension rubric scored 0–3. Designed to answer: "Did Teacher Mercy
 * actually help this learner get better?"
 *
 * The rubric splits a session into "before" (first half of events) and
 * "after" (second half of events), then computes gain deltas across:
 *
 *   LG1 — Error Reduction: did correction rate decrease?
 *   LG2 — Pronunciation Gain: did match scores improve?
 *   LG3 — Self-Correction Growth: did the learner self-correct more?
 *   LG4 — Acknowledgment Rate: did the learner accept more corrections?
 *   LG5 — Weakness Resolution: were tracked weaknesses reduced?
 *   LG6 — Retention Evidence: were earlier corrections retained?
 *   LG7 — Autonomy Gain: did the learner need fewer interventions?
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all user-facing labels and summaries.
 *
 * Integrates with the transcript correction event system
 * (transcriptCorrectionTypes.ts, transcriptCorrectionCollector.ts).
 */

import type {
  TranscriptCorrectionEvent,
  TranscriptCorrectionSession,
  ImprovementPoint,
} from "./transcriptCorrectionTypes";

import {
  getImprovementTrail,
  getCorrectionStats,
} from "./transcriptCorrectionCollector";

// ─── Dimension Identifiers ────────────────────────────────────────────────

export type LearningGainDimensionId =
  | "lg_error_reduction"
  | "lg_pronunciation_gain"
  | "lg_self_correction"
  | "lg_acknowledgment"
  | "lg_weakness_resolution"
  | "lg_retention"
  | "lg_autonomy";

// ─── Scoring Types ─────────────────────────────────────────────────────────

export type GainDimensionScore = 0 | 1 | 2 | 3;

export type GainDimensionLabel =
  | "strong"
  | "clear"
  | "minimal"
  | "none";

export type LearningGainOverallClassification =
  | "significant_gain"
  | "moderate_gain"
  | "minimal_gain"
  | "no_measurable_gain"
  | "regression";

// ─── Baseline / Outcome Snapshots ──────────────────────────────────────────

/**
 * A snapshot of the learner's state taken from a window of session events.
 * Used as both "before" (first half) and "after" (second half).
 */
export interface LearningGainSnapshot {
  /** Number of events in this window. */
  eventCount: number;
  /** Correction rate: events with corrections / total events (0–1). */
  errorRate: number;
  /** Average match score (0–100), or null if no scores available. */
  avgMatchScore: number | null;
  /** Number of events where the learner self-corrected. */
  selfCorrectionCount: number;
  /** Number of events where the learner acknowledged a correction. */
  acknowledgmentCount: number;
  /** Total number of individual corrections in this window. */
  totalCorrections: number;
  /** Per-weakness-tag counts. */
  weaknessCounts: Record<string, number>;
  /** Average correction confidence (0–1). */
  avgConfidence: number;
  /** Number of unique weakness tags seen. */
  uniqueWeaknessCount: number;
}

// ─── Per-Dimension Result ──────────────────────────────────────────────────

export interface LearningGainDimensionResult {
  /** Dimension identifier. */
  dimensionId: LearningGainDimensionId;
  /** Vietnamese label. */
  titleVi: string;
  /** English label. */
  titleEn: string;
  /** Numeric score 0–3. */
  score: GainDimensionScore;
  /** Qualitative label. */
  label: GainDimensionLabel;
  /** Before value (the metric in the baseline). */
  baselineValue: number;
  /** After value (the metric in the outcome). */
  outcomeValue: number;
  /** Signed delta (outcome − baseline). Positive = improvement for most metrics. */
  delta: number;
  /** Vietnamese explanation of this dimension's score. */
  detailVi: string;
  /** English explanation of this dimension's score. */
  detailEn: string;
}

// ─── Full Result ───────────────────────────────────────────────────────────

export interface LearningGainResult {
  /** Overall classification. */
  classification: LearningGainOverallClassification;
  /** Number of dimensions showing improvement (score ≥ 2). */
  improvingDimensions: number;
  /** Number of dimensions showing decline (δ in wrong direction, score 0). */
  decliningDimensions: number;
  /** Per-dimension results, ordered by dimension ID. */
  dimensions: LearningGainDimensionResult[];
  /** Vietnamese summary suitable for display to learner. */
  summaryVi: string;
  /** English summary for internal / debug use. */
  summaryEn: string;
  /** The baseline snapshot used. */
  baseline: LearningGainSnapshot;
  /** The outcome snapshot used. */
  outcome: LearningGainOutcome;
  /** Total events across both windows. */
  totalEvents: number;
  /** Whether enough data was available for a meaningful assessment. */
  sufficientData: boolean;
}

/** Alias — outcome uses the same shape as baseline. */
export type LearningGainOutcome = LearningGainSnapshot;

// ─── Dimension Catalog ─────────────────────────────────────────────────────

const DIMENSION_TITLES: Record<LearningGainDimensionId, { vi: string; en: string }> = {
  lg_error_reduction: { vi: "Giảm lỗi", en: "Error reduction" },
  lg_pronunciation_gain: { vi: "Cải thiện phát âm", en: "Pronunciation gain" },
  lg_self_correction: { vi: "Tự sửa lỗi", en: "Self-correction growth" },
  lg_acknowledgment: { vi: "Tiếp thu sửa lỗi", en: "Acknowledgment rate" },
  lg_weakness_resolution: { vi: "Khắc phục điểm yếu", en: "Weakness resolution" },
  lg_retention: { vi: "Ghi nhớ bài sửa", en: "Retention evidence" },
  lg_autonomy: { vi: "Tự chủ hơn", en: "Autonomy gain" },
};

/**
 * Direction for each dimension: "higher_better" means a positive delta is improvement,
 * "lower_better" means a negative delta is improvement.
 */
const DIMENSION_DIRECTION: Record<LearningGainDimensionId, "higher_better" | "lower_better"> = {
  lg_error_reduction: "lower_better",
  lg_pronunciation_gain: "higher_better",
  lg_self_correction: "higher_better",
  lg_acknowledgment: "higher_better",
  lg_weakness_resolution: "lower_better",
  lg_retention: "higher_better",
  lg_autonomy: "lower_better",
};

export const LEARNING_GAIN_DIMENSION_CATALOG: ReadonlyArray<{
  id: LearningGainDimensionId;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  direction: "higher_better" | "lower_better";
}> = [
  {
    id: "lg_error_reduction",
    titleVi: "Giảm lỗi",
    titleEn: "Error reduction",
    descriptionVi: "Tỉ lệ câu bị sửa lỗi có giảm từ đầu đến cuối buổi học không?",
    direction: "lower_better",
  },
  {
    id: "lg_pronunciation_gain",
    titleVi: "Cải thiện phát âm",
    titleEn: "Pronunciation gain",
    descriptionVi: "Điểm phát âm có tăng từ đầu đến cuối buổi học không?",
    direction: "higher_better",
  },
  {
    id: "lg_self_correction",
    titleVi: "Tự sửa lỗi",
    titleEn: "Self-correction growth",
    descriptionVi: "Người học có bắt đầu tự sửa lỗi nhiều hơn về cuối buổi không?",
    direction: "higher_better",
  },
  {
    id: "lg_acknowledgment",
    titleVi: "Tiếp thu sửa lỗi",
    titleEn: "Acknowledgment rate",
    descriptionVi: "Người học có tiếp nhận lời sửa của Mercy nhiều hơn về cuối buổi không?",
    direction: "higher_better",
  },
  {
    id: "lg_weakness_resolution",
    titleVi: "Khắc phục điểm yếu",
    titleEn: "Weakness resolution",
    descriptionVi: "Số loại điểm yếu được phát hiện có giảm từ đầu đến cuối buổi không?",
    direction: "lower_better",
  },
  {
    id: "lg_retention",
    titleVi: "Ghi nhớ bài sửa",
    titleEn: "Retention evidence",
    descriptionVi: "Người học có tránh lặp lại lỗi đã được sửa trước đó không?",
    direction: "higher_better",
  },
  {
    id: "lg_autonomy",
    titleVi: "Tự chủ hơn",
    titleEn: "Autonomy gain",
    descriptionVi: "Người học có cần ít can thiệp sửa lỗi hơn về cuối buổi không?",
    direction: "lower_better",
  },
];

// ─── Snapshot Capture ──────────────────────────────────────────────────────

/**
 * Capture a baseline snapshot from a set of session events.
 *
 * Typically called with the first half of a session's events to establish
 * the learner's starting state.
 */
export function captureBaseline(
  events: TranscriptCorrectionEvent[],
): LearningGainSnapshot {
  return captureSnapshot(events);
}

/**
 * Capture an outcome snapshot from a set of session events.
 *
 * Typically called with the second half of a session's events to measure
 * the learner's ending state.
 */
export function captureOutcome(
  events: TranscriptCorrectionEvent[],
): LearningGainOutcome {
  return captureSnapshot(events);
}

/**
 * Internal: compute a snapshot from a list of events.
 */
function captureSnapshot(
  events: TranscriptCorrectionEvent[],
): LearningGainSnapshot {
  const eventCount = events.length;

  if (eventCount === 0) {
    return {
      eventCount: 0,
      errorRate: 0,
      avgMatchScore: null,
      selfCorrectionCount: 0,
      acknowledgmentCount: 0,
      totalCorrections: 0,
      weaknessCounts: {},
      avgConfidence: 0,
      uniqueWeaknessCount: 0,
    };
  }

  // Error rate: events with at least one correction / total events
  const eventsWithCorrections = events.filter(
    (e) => e.corrections.length > 0,
  ).length;
  const errorRate = eventsWithCorrections / eventCount;

  // Match scores
  const matchScores = events
    .map((e) => e.matchScore)
    .filter((s): s is number => s !== null);
  const avgMatchScore =
    matchScores.length > 0
      ? matchScores.reduce((a, b) => a + b, 0) / matchScores.length
      : null;

  // Self-correction: events where learner acknowledged = true AND had corrections
  // (self-correction is when the learner fixes their own error before Mercy does)
  // We count events where the learner acknowledged the correction
  const selfCorrectionCount = events.filter(
    (e) => e.learnerAcknowledged === true && e.corrections.length > 0,
  ).length;

  // Acknowledgment count: all events where learner acknowledged
  const acknowledgmentCount = events.filter(
    (e) => e.learnerAcknowledged === true,
  ).length;

  // Total corrections
  const totalCorrections = events.reduce(
    (sum, e) => sum + e.corrections.length,
    0,
  );

  // Weakness counts
  const weaknessCounts: Record<string, number> = {};
  for (const event of events) {
    for (const tag of event.weaknessTags) {
      weaknessCounts[tag] = (weaknessCounts[tag] ?? 0) + 1;
    }
  }

  // Average confidence
  const allCorrections = events.flatMap((e) => e.corrections);
  const avgConfidence =
    allCorrections.length > 0
      ? allCorrections.reduce((s, c) => s + c.confidence, 0) /
        allCorrections.length
      : 0;

  // Unique weakness count
  const uniqueWeaknessCount = Object.keys(weaknessCounts).length;

  return {
    eventCount,
    errorRate: round4(errorRate),
    avgMatchScore: avgMatchScore !== null ? round2(avgMatchScore) : null,
    selfCorrectionCount,
    acknowledgmentCount,
    totalCorrections,
    weaknessCounts,
    avgConfidence: round4(avgConfidence),
    uniqueWeaknessCount,
  };
}

// ─── Gain Assessment ───────────────────────────────────────────────────────

/**
 * Assess learning gain by comparing a baseline snapshot to an outcome snapshot.
 *
 * This is the main entry point. It computes all 7 dimensions and produces
 * an overall classification.
 *
 * Pure function — deterministic, no I/O, no side effects.
 */
export function assessLearningGain(
  baseline: LearningGainSnapshot,
  outcome: LearningGainOutcome,
): LearningGainResult {
  const totalEvents = baseline.eventCount + outcome.eventCount;
  const sufficientData = totalEvents >= 4;

  const dimensions: LearningGainDimensionResult[] = (
    Object.keys(DIMENSION_TITLES) as LearningGainDimensionId[]
  ).map((dimId) => {
    return computeGainDimension(dimId, baseline, outcome);
  });

  const improvingDimensions = dimensions.filter((d) => d.score >= 2).length;
  const decliningDimensions = dimensions.filter((d) => d.score === 0).length;

  const classification = classifyGain(dimensions, sufficientData);

  return {
    classification,
    improvingDimensions,
    decliningDimensions,
    dimensions,
    summaryVi: buildSummaryVi(classification, dimensions, sufficientData),
    summaryEn: buildSummaryEn(classification, dimensions, sufficientData),
    baseline,
    outcome,
    totalEvents,
    sufficientData,
  };
}

/**
 * Convenience: assess gain within a single session by splitting events
 * into a "before" half and an "after" half at the midpoint.
 *
 * If there are fewer than 4 events total, the result will be marked
 * as insufficient data.
 */
export function assessSessionGain(
  session: TranscriptCorrectionSession,
): LearningGainResult {
  const events = session.events;
  const mid = Math.floor(events.length / 2);

  const beforeEvents = events.slice(0, mid);
  const afterEvents = events.slice(mid);

  const baseline = captureBaseline(beforeEvents);
  const outcome = captureOutcome(afterEvents);

  return assessLearningGain(baseline, outcome);
}

/**
 * Assess gain across two separate sessions (e.g., session 1 vs session N).
 *
 * Uses the full events of each session for before/after comparison.
 */
export function assessCrossSessionGain(
  beforeSession: TranscriptCorrectionSession,
  afterSession: TranscriptCorrectionSession,
): LearningGainResult {
  const baseline = captureBaseline(beforeSession.events);
  const outcome = captureOutcome(afterSession.events);

  return assessLearningGain(baseline, outcome);
}

// ─── Per-Dimension Computation ─────────────────────────────────────────────

function computeGainDimension(
  dimId: LearningGainDimensionId,
  baseline: LearningGainSnapshot,
  outcome: LearningGainOutcome,
): LearningGainDimensionResult {
  const direction = DIMENSION_DIRECTION[dimId];

  switch (dimId) {
    case "lg_error_reduction":
      return computeErrorReduction(baseline, outcome, direction);
    case "lg_pronunciation_gain":
      return computePronunciationGain(baseline, outcome, direction);
    case "lg_self_correction":
      return computeSelfCorrection(baseline, outcome, direction);
    case "lg_acknowledgment":
      return computeAcknowledgment(baseline, outcome, direction);
    case "lg_weakness_resolution":
      return computeWeaknessResolution(baseline, outcome, direction);
    case "lg_retention":
      return computeRetention(baseline, outcome, direction);
    case "lg_autonomy":
      return computeAutonomy(baseline, outcome, direction);
  }
}

// ─── LG1: Error Reduction ──────────────────────────────────────────────────

function computeErrorReduction(
  baseline: LearningGainSnapshot,
  outcome: LearningGainOutcome,
  direction: "higher_better" | "lower_better",
): LearningGainDimensionResult {
  const baselineValue = baseline.errorRate;
  const outcomeValue = outcome.errorRate;
  const delta = outcomeValue - baselineValue;
  const improved = direction === "lower_better" ? delta < 0 : delta > 0;
  const magnitude = Math.abs(delta);

  let score: GainDimensionScore;
  let detailVi: string;
  let detailEn: string;

  if (baseline.eventCount === 0 || outcome.eventCount === 0) {
    score = 0;
    detailVi = "Không đủ dữ liệu để đo — thiếu sự kiện trước hoặc sau.";
    detailEn = "Insufficient data — missing before or after events.";
  } else if (improved && magnitude >= 0.15) {
    score = 3;
    detailVi = `Tỉ lệ lỗi giảm rõ rệt từ ${pct(baselineValue)} xuống ${pct(outcomeValue)} (giảm ${pct(magnitude)}).`;
    detailEn = `Error rate dropped clearly from ${pct(baselineValue)} to ${pct(outcomeValue)} (↓${pct(magnitude)}).`;
  } else if (improved && magnitude >= 0.05) {
    score = 2;
    detailVi = `Tỉ lệ lỗi có giảm từ ${pct(baselineValue)} xuống ${pct(outcomeValue)} (giảm ${pct(magnitude)}).`;
    detailEn = `Error rate decreased from ${pct(baselineValue)} to ${pct(outcomeValue)} (↓${pct(magnitude)}).`;
  } else if (improved && magnitude > 0) {
    score = 1;
    detailVi = `Tỉ lệ lỗi giảm nhẹ từ ${pct(baselineValue)} xuống ${pct(outcomeValue)}.`;
    detailEn = `Error rate decreased slightly from ${pct(baselineValue)} to ${pct(outcomeValue)}.`;
  } else if (magnitude < 0.05) {
    score = 1;
    detailVi = `Tỉ lệ lỗi gần như không đổi (${pct(baselineValue)} → ${pct(outcomeValue)}).`;
    detailEn = `Error rate nearly unchanged (${pct(baselineValue)} → ${pct(outcomeValue)}).`;
  } else {
    score = 0;
    detailVi = `Tỉ lệ lỗi tăng từ ${pct(baselineValue)} lên ${pct(outcomeValue)} — người học đang gặp khó khăn hơn.`;
    detailEn = `Error rate increased from ${pct(baselineValue)} to ${pct(outcomeValue)} — learner is struggling more.`;
  }

  return {
    dimensionId: "lg_error_reduction",
    titleVi: DIMENSION_TITLES.lg_error_reduction.vi,
    titleEn: DIMENSION_TITLES.lg_error_reduction.en,
    score,
    label: scoreToGainLabel(score),
    baselineValue: round4(baselineValue),
    outcomeValue: round4(outcomeValue),
    delta: round4(delta),
    detailVi,
    detailEn,
  };
}

// ─── LG2: Pronunciation Gain ───────────────────────────────────────────────

function computePronunciationGain(
  baseline: LearningGainSnapshot,
  outcome: LearningGainOutcome,
  direction: "higher_better" | "lower_better",
): LearningGainDimensionResult {
  const bScore = baseline.avgMatchScore;
  const oScore = outcome.avgMatchScore;

  if (bScore === null || oScore === null) {
    return {
      dimensionId: "lg_pronunciation_gain",
      titleVi: DIMENSION_TITLES.lg_pronunciation_gain.vi,
      titleEn: DIMENSION_TITLES.lg_pronunciation_gain.en,
      score: 0,
      label: "none",
      baselineValue: bScore ?? 0,
      outcomeValue: oScore ?? 0,
      delta: 0,
      detailVi: "Không có dữ liệu điểm phát âm để so sánh.",
      detailEn: "No pronunciation score data available for comparison.",
    };
  }

  const delta = oScore - bScore;
  const improved = direction === "higher_better" ? delta > 0 : delta < 0;

  let score: GainDimensionScore;
  let detailVi: string;
  let detailEn: string;

  if (improved && delta >= 10) {
    score = 3;
    detailVi = `Điểm phát âm tăng rõ rệt từ ${fmt(bScore)} lên ${fmt(oScore)} (+${fmt(delta)} điểm).`;
    detailEn = `Pronunciation score increased clearly from ${fmt(bScore)} to ${fmt(oScore)} (+${fmt(delta)} pts).`;
  } else if (improved && delta >= 5) {
    score = 2;
    detailVi = `Điểm phát âm có cải thiện từ ${fmt(bScore)} lên ${fmt(oScore)} (+${fmt(delta)} điểm).`;
    detailEn = `Pronunciation score improved from ${fmt(bScore)} to ${fmt(oScore)} (+${fmt(delta)} pts).`;
  } else if (improved && delta > 0) {
    score = 1;
    detailVi = `Điểm phát âm tăng nhẹ từ ${fmt(bScore)} lên ${fmt(oScore)} (+${fmt(delta)} điểm).`;
    detailEn = `Pronunciation score increased slightly from ${fmt(bScore)} to ${fmt(oScore)} (+${fmt(delta)} pts).`;
  } else if (Math.abs(delta) < 3) {
    score = 1;
    detailVi = `Điểm phát âm gần như không đổi (${fmt(bScore)} → ${fmt(oScore)}).`;
    detailEn = `Pronunciation score nearly unchanged (${fmt(bScore)} → ${fmt(oScore)}).`;
  } else {
    score = 0;
    detailVi = `Điểm phát âm giảm từ ${fmt(bScore)} xuống ${fmt(oScore)} (${fmt(delta)} điểm) — có thể do bài tập khó hơn.`;
    detailEn = `Pronunciation score dropped from ${fmt(bScore)} to ${fmt(oScore)} (${fmt(delta)} pts) — possibly harder material.`;
  }

  return {
    dimensionId: "lg_pronunciation_gain",
    titleVi: DIMENSION_TITLES.lg_pronunciation_gain.vi,
    titleEn: DIMENSION_TITLES.lg_pronunciation_gain.en,
    score,
    label: scoreToGainLabel(score),
    baselineValue: round2(bScore),
    outcomeValue: round2(oScore),
    delta: round2(delta),
    detailVi,
    detailEn,
  };
}

// ─── LG3: Self-Correction Growth ───────────────────────────────────────────

function computeSelfCorrection(
  baseline: LearningGainSnapshot,
  outcome: LearningGainOutcome,
  direction: "higher_better" | "lower_better",
): LearningGainDimensionResult {
  const bRate =
    baseline.eventCount > 0
      ? baseline.selfCorrectionCount / baseline.eventCount
      : 0;
  const oRate =
    outcome.eventCount > 0
      ? outcome.selfCorrectionCount / outcome.eventCount
      : 0;
  const delta = oRate - bRate;
  const improved = direction === "higher_better" ? delta > 0 : delta < 0;

  let score: GainDimensionScore;
  let detailVi: string;
  let detailEn: string;

  if (baseline.eventCount === 0 || outcome.eventCount === 0) {
    score = 0;
    detailVi = "Không đủ dữ liệu — thiếu sự kiện trước hoặc sau.";
    detailEn = "Insufficient data — missing before or after events.";
  } else if (improved && delta >= 0.15) {
    score = 3;
    detailVi = `Người học tự sửa lỗi nhiều hơn rõ rệt: ${baseline.selfCorrectionCount}/${baseline.eventCount} → ${outcome.selfCorrectionCount}/${outcome.eventCount} lượt.`;
    detailEn = `Self-correction rate increased clearly: ${baseline.selfCorrectionCount}/${baseline.eventCount} → ${outcome.selfCorrectionCount}/${outcome.eventCount}.`;
  } else if (improved && delta >= 0.05) {
    score = 2;
    detailVi = `Người học bắt đầu tự sửa lỗi nhiều hơn: ${baseline.selfCorrectionCount}/${baseline.eventCount} → ${outcome.selfCorrectionCount}/${outcome.eventCount} lượt.`;
    detailEn = `Self-correction rate improving: ${baseline.selfCorrectionCount}/${baseline.eventCount} → ${outcome.selfCorrectionCount}/${outcome.eventCount}.`;
  } else if (improved && delta > 0) {
    score = 1;
    detailVi = `Tự sửa lỗi tăng nhẹ (${baseline.selfCorrectionCount} → ${outcome.selfCorrectionCount} lượt).`;
    detailEn = `Self-correction slightly up (${baseline.selfCorrectionCount} → ${outcome.selfCorrectionCount}).`;
  } else if (Math.abs(delta) < 0.05) {
    score = 1;
    detailVi = `Tỉ lệ tự sửa lỗi gần như không đổi.`;
    detailEn = `Self-correction rate nearly unchanged.`;
  } else {
    score = 0;
    detailVi = `Tỉ lệ tự sửa lỗi giảm — người học ít tự điều chỉnh hơn về cuối buổi.`;
    detailEn = `Self-correction rate declined — learner self-adjusted less toward session end.`;
  }

  return {
    dimensionId: "lg_self_correction",
    titleVi: DIMENSION_TITLES.lg_self_correction.vi,
    titleEn: DIMENSION_TITLES.lg_self_correction.en,
    score,
    label: scoreToGainLabel(score),
    baselineValue: round4(bRate),
    outcomeValue: round4(oRate),
    delta: round4(delta),
    detailVi,
    detailEn,
  };
}

// ─── LG4: Acknowledgment Rate ──────────────────────────────────────────────

function computeAcknowledgment(
  baseline: LearningGainSnapshot,
  outcome: LearningGainOutcome,
  direction: "higher_better" | "lower_better",
): LearningGainDimensionResult {
  const bRate =
    baseline.eventCount > 0
      ? baseline.acknowledgmentCount / baseline.eventCount
      : 0;
  const oRate =
    outcome.eventCount > 0
      ? outcome.acknowledgmentCount / outcome.eventCount
      : 0;
  const delta = oRate - bRate;
  const improved = direction === "higher_better" ? delta > 0 : delta < 0;

  let score: GainDimensionScore;
  let detailVi: string;
  let detailEn: string;

  if (baseline.eventCount === 0 || outcome.eventCount === 0) {
    score = 0;
    detailVi = "Không đủ dữ liệu — thiếu sự kiện trước hoặc sau.";
    detailEn = "Insufficient data — missing before or after events.";
  } else if (improved && delta >= 0.15) {
    score = 3;
    detailVi = `Người học tiếp thu lời sửa tốt hơn hẳn: ${baseline.acknowledgmentCount}/${baseline.eventCount} → ${outcome.acknowledgmentCount}/${outcome.eventCount} lượt.`;
    detailEn = `Acknowledgment rate improved clearly: ${baseline.acknowledgmentCount}/${baseline.eventCount} → ${outcome.acknowledgmentCount}/${outcome.eventCount}.`;
  } else if (improved && delta >= 0.05) {
    score = 2;
    detailVi = `Người học tiếp thu lời sửa nhiều hơn: ${baseline.acknowledgmentCount}/${baseline.eventCount} → ${outcome.acknowledgmentCount}/${outcome.eventCount} lượt.`;
    detailEn = `Acknowledgment rate improving: ${baseline.acknowledgmentCount}/${baseline.eventCount} → ${outcome.acknowledgmentCount}/${outcome.eventCount}.`;
  } else if (improved && delta > 0) {
    score = 1;
    detailVi = `Tỉ lệ tiếp thu tăng nhẹ.`;
    detailEn = `Acknowledgment rate slightly up.`;
  } else if (Math.abs(delta) < 0.05) {
    score = 1;
    detailVi = `Tỉ lệ tiếp thu gần như không đổi.`;
    detailEn = `Acknowledgment rate nearly unchanged.`;
  } else {
    score = 0;
    detailVi = `Tỉ lệ tiếp thu giảm — người học ít xác nhận lời sửa hơn về cuối buổi.`;
    detailEn = `Acknowledgment rate declined.`;
  }

  return {
    dimensionId: "lg_acknowledgment",
    titleVi: DIMENSION_TITLES.lg_acknowledgment.vi,
    titleEn: DIMENSION_TITLES.lg_acknowledgment.en,
    score,
    label: scoreToGainLabel(score),
    baselineValue: round4(bRate),
    outcomeValue: round4(oRate),
    delta: round4(delta),
    detailVi,
    detailEn,
  };
}

// ─── LG5: Weakness Resolution ──────────────────────────────────────────────

function computeWeaknessResolution(
  baseline: LearningGainSnapshot,
  outcome: LearningGainOutcome,
  direction: "higher_better" | "lower_better",
): LearningGainDimensionResult {
  const bCount = baseline.uniqueWeaknessCount;
  const oCount = outcome.uniqueWeaknessCount;
  const delta = oCount - bCount;
  const improved = direction === "lower_better" ? delta < 0 : delta > 0;

  let score: GainDimensionScore;
  let detailVi: string;
  let detailEn: string;

  if (baseline.eventCount === 0 || outcome.eventCount === 0) {
    score = 0;
    detailVi = "Không đủ dữ liệu — thiếu sự kiện trước hoặc sau.";
    detailEn = "Insufficient data — missing before or after events.";
  } else if (bCount === 0 && oCount === 0) {
    score = 2;
    detailVi = "Không phát hiện điểm yếu nào trong cả hai nửa buổi — người học làm rất tốt.";
    detailEn = "No weaknesses detected in either half — learner is doing very well.";
  } else if (improved && delta <= -2) {
    score = 3;
    detailVi = `Số loại điểm yếu giảm rõ rệt từ ${bCount} xuống ${oCount} — người học đang khắc phục hiệu quả.`;
    detailEn = `Weakness categories dropped clearly from ${bCount} to ${oCount} — learner is resolving effectively.`;
  } else if (improved && delta <= -1) {
    score = 2;
    detailVi = `Số loại điểm yếu giảm từ ${bCount} xuống ${oCount}.`;
    detailEn = `Weakness categories decreased from ${bCount} to ${oCount}.`;
  } else if (bCount === oCount) {
    score = 1;
    detailVi = `Số loại điểm yếu không đổi (${bCount} loại).`;
    detailEn = `Weakness category count unchanged (${bCount} categories).`;
  } else {
    score = 0;
    detailVi = `Số loại điểm yếu tăng từ ${bCount} lên ${oCount} — có thể do bài tập khó hơn hoặc phát hiện thêm.`;
    detailEn = `Weakness categories increased from ${bCount} to ${oCount} — possibly harder material.`;
  }

  return {
    dimensionId: "lg_weakness_resolution",
    titleVi: DIMENSION_TITLES.lg_weakness_resolution.vi,
    titleEn: DIMENSION_TITLES.lg_weakness_resolution.en,
    score,
    label: scoreToGainLabel(score),
    baselineValue: bCount,
    outcomeValue: oCount,
    delta,
    detailVi,
    detailEn,
  };
}

// ─── LG6: Retention Evidence ───────────────────────────────────────────────

function computeRetention(
  baseline: LearningGainSnapshot,
  outcome: LearningGainOutcome,
  direction: "higher_better" | "lower_better",
): LearningGainDimensionResult {
  // Retention = learner avoids repeating the SAME error types that were
  // corrected earlier. We measure this by comparing the overlap of weakness
  // tags between before and after — fewer overlapping corrections = better
  // retention.
  const bWeaknessTags = new Set(Object.keys(baseline.weaknessCounts));
  const oWeaknessTags = new Set(Object.keys(outcome.weaknessCounts));

  if (baseline.eventCount === 0 || outcome.eventCount === 0) {
    return {
      dimensionId: "lg_retention",
      titleVi: DIMENSION_TITLES.lg_retention.vi,
      titleEn: DIMENSION_TITLES.lg_retention.en,
      score: 0,
      label: "none",
      baselineValue: 0,
      outcomeValue: 0,
      delta: 0,
      detailVi: "Không đủ dữ liệu — thiếu sự kiện trước hoặc sau.",
      detailEn: "Insufficient data — missing before or after events.",
    };
  }

  if (bWeaknessTags.size === 0) {
    // No weaknesses in baseline = nothing to retain against = good
    return {
      dimensionId: "lg_retention",
      titleVi: DIMENSION_TITLES.lg_retention.vi,
      titleEn: DIMENSION_TITLES.lg_retention.en,
      score: 2,
      label: "clear",
      baselineValue: 0,
      outcomeValue: oWeaknessTags.size,
      delta: oWeaknessTags.size,
      detailVi: "Không có điểm yếu nào trong nửa đầu — không cần đo mức ghi nhớ.",
      detailEn: "No weaknesses in first half — retention measurement not needed.",
    };
  }

  // Count recurring weaknesses (tags that appear in BOTH halves)
  let recurringCount = 0;
  let recurringTotalBefore = 0;
  let recurringTotalAfter = 0;
  for (const tag of bWeaknessTags) {
    if (oWeaknessTags.has(tag)) {
      recurringCount++;
      recurringTotalBefore += baseline.weaknessCounts[tag] ?? 0;
      recurringTotalAfter += outcome.weaknessCounts[tag] ?? 0;
    }
  }

  // Retention score: if recurring corrections decreased, learner is retaining
  const recurringDelta = recurringTotalAfter - recurringTotalBefore;
  // For retention: fewer recurring corrections = better retention = higher score
  const retentionImproved = recurringDelta <= 0;
  const recurrenceRate =
    bWeaknessTags.size > 0 ? recurringCount / bWeaknessTags.size : 0;

  let score: GainDimensionScore;
  let detailVi: string;
  let detailEn: string;

  if (recurringCount === 0) {
    score = 3;
    detailVi = `Tuyệt vời — không có điểm yếu nào lặp lại từ nửa đầu. Người học đã ghi nhớ tất cả bài sửa.`;
    detailEn = `Excellent — no weaknesses recurred from first half. Learner retained all corrections.`;
  } else if (retentionImproved && recurrenceRate <= 0.3) {
    score = 3;
    detailVi = `Rất ít điểm yếu lặp lại (${recurringCount}/${bWeaknessTags.size}) — người học ghi nhớ tốt.`;
    detailEn = `Very few recurring weaknesses (${recurringCount}/${bWeaknessTags.size}) — good retention.`;
  } else if (retentionImproved && recurrenceRate <= 0.5) {
    score = 2;
    detailVi = `${recurringCount}/${bWeaknessTags.size} điểm yếu lặp lại nhưng số lần xuất hiện đang giảm.`;
    detailEn = `${recurringCount}/${bWeaknessTags.size} weaknesses recur but frequency is decreasing.`;
  } else if (recurrenceRate <= 0.7) {
    score = 1;
    detailVi = `${recurringCount}/${bWeaknessTags.size} điểm yếu vẫn lặp lại — người học đang trong quá trình ghi nhớ.`;
    detailEn = `${recurringCount}/${bWeaknessTags.size} weaknesses still recurring — learner is in the process of retaining.`;
  } else {
    score = 0;
    detailVi = `Hầu hết điểm yếu (${recurringCount}/${bWeaknessTags.size}) vẫn lặp lại — cần thêm thời gian luyện tập.`;
    detailEn = `Most weaknesses (${recurringCount}/${bWeaknessTags.size}) still recurring — more practice needed.`;
  }

  return {
    dimensionId: "lg_retention",
    titleVi: DIMENSION_TITLES.lg_retention.vi,
    titleEn: DIMENSION_TITLES.lg_retention.en,
    score,
    label: scoreToGainLabel(score),
    baselineValue: bWeaknessTags.size,
    outcomeValue: recurringCount,
    delta: -recurringCount,
    detailVi,
    detailEn,
  };
}

// ─── LG7: Autonomy Gain ────────────────────────────────────────────────────

function computeAutonomy(
  baseline: LearningGainSnapshot,
  outcome: LearningGainOutcome,
  direction: "higher_better" | "lower_better",
): LearningGainDimensionResult {
  // Autonomy = learner needs fewer total corrections per event
  const bRate =
    baseline.eventCount > 0
      ? baseline.totalCorrections / baseline.eventCount
      : 0;
  const oRate =
    outcome.eventCount > 0
      ? outcome.totalCorrections / outcome.eventCount
      : 0;
  const delta = oRate - bRate;
  const improved = direction === "lower_better" ? delta < 0 : delta > 0;
  const magnitude = Math.abs(delta);

  let score: GainDimensionScore;
  let detailVi: string;
  let detailEn: string;

  if (baseline.eventCount === 0 || outcome.eventCount === 0) {
    score = 0;
    detailVi = "Không đủ dữ liệu — thiếu sự kiện trước hoặc sau.";
    detailEn = "Insufficient data — missing before or after events.";
  } else if (improved && magnitude >= 0.3) {
    score = 3;
    detailVi = `Số lỗi cần sửa trên mỗi lượt giảm rõ rệt từ ${fmt2(bRate)} xuống ${fmt2(oRate)} — người học tự chủ hơn hẳn.`;
    detailEn = `Corrections-per-turn dropped clearly from ${fmt2(bRate)} to ${fmt2(oRate)} — much more autonomous.`;
  } else if (improved && magnitude >= 0.15) {
    score = 2;
    detailVi = `Số lỗi cần sửa trên mỗi lượt giảm từ ${fmt2(bRate)} xuống ${fmt2(oRate)}.`;
    detailEn = `Corrections-per-turn decreased from ${fmt2(bRate)} to ${fmt2(oRate)}.`;
  } else if (improved && magnitude > 0) {
    score = 1;
    detailVi = `Số lỗi cần sửa trên mỗi lượt giảm nhẹ.`;
    detailEn = `Corrections-per-turn slightly decreased.`;
  } else if (magnitude < 0.05) {
    score = 1;
    detailVi = `Mức độ can thiệp gần như không đổi.`;
    detailEn = `Intervention level nearly unchanged.`;
  } else {
    score = 0;
    detailVi = `Số lỗi cần sửa trên mỗi lượt tăng — người học cần nhiều hỗ trợ hơn.`;
    detailEn = `Corrections-per-turn increased — learner needs more support.`;
  }

  return {
    dimensionId: "lg_autonomy",
    titleVi: DIMENSION_TITLES.lg_autonomy.vi,
    titleEn: DIMENSION_TITLES.lg_autonomy.en,
    score,
    label: scoreToGainLabel(score),
    baselineValue: round4(bRate),
    outcomeValue: round4(oRate),
    delta: round4(delta),
    detailVi,
    detailEn,
  };
}

// ─── Classification ────────────────────────────────────────────────────────

/**
 * Classify the overall learning gain from the dimension results.
 *
 * Rules:
 *   - "significant_gain" — ≥5 dimensions at score ≥2, ALL dimensions ≥1
 *   - "moderate_gain"    — ≥3 dimensions at score ≥2, ALL dimensions ≥1
 *   - "minimal_gain"     — ≥1 dimension  at score ≥2
 *   - "regression"       — declining dimensions > improving dimensions
 *   - "no_measurable_gain" — otherwise
 */
function classifyGain(
  dimensions: LearningGainDimensionResult[],
  sufficientData: boolean,
): LearningGainOverallClassification {
  if (!sufficientData) return "no_measurable_gain";

  const improving = dimensions.filter((d) => d.score >= 2).length;
  const declining = dimensions.filter((d) => d.score === 0).length;
  const allAtLeastOne = dimensions.every((d) => d.score >= 1);

  // Regression: substantially more declining than improving (at least 3 declining)
  // A single declining dimension out of 7 is not regression — could be noise
  if (declining >= 3 && declining > improving) {
    return "regression";
  }

  // Significant: strong across the board
  if (improving >= 5 && allAtLeastOne) {
    return "significant_gain";
  }

  // Moderate: decent improvement
  if (improving >= 3 && allAtLeastOne) {
    return "moderate_gain";
  }

  // Minimal: at least some improvement
  if (improving >= 1) {
    return "minimal_gain";
  }

  return "no_measurable_gain";
}

// ─── Summary Builders ──────────────────────────────────────────────────────

function buildSummaryVi(
  classification: LearningGainOverallClassification,
  dimensions: LearningGainDimensionResult[],
  sufficientData: boolean,
): string {
  if (!sufficientData) {
    return "Chưa đủ dữ liệu để đánh giá mức tiến bộ (cần ít nhất 4 sự kiện).";
  }

  const dimSummary = dimensions
    .map((d) => `${d.titleVi}: ${d.score}/3`)
    .join(", ");

  const improving = dimensions.filter((d) => d.score >= 2);
  const improvingNames = improving.map((d) => d.titleVi).join(", ");

  switch (classification) {
    case "significant_gain":
      return `📈 Tiến bộ rõ rệt — cải thiện ở ${improving.length}/7 chiều: ${improvingNames}. (${dimSummary})`;
    case "moderate_gain":
      return `👍 Có tiến bộ — cải thiện ở ${improving.length}/7 chiều: ${improvingNames}. (${dimSummary})`;
    case "minimal_gain":
      return `🔍 Tiến bộ nhẹ — cải thiện ở ${improving.length}/7 chiều: ${improvingNames}. Cần thêm thời gian luyện tập. (${dimSummary})`;
    case "regression":
      return `⚠️ Cần chú ý — một số chiều đang đi xuống. Có thể do bài tập khó hơn hoặc người học mệt. (${dimSummary})`;
    case "no_measurable_gain":
      return `Chưa thấy tiến bộ rõ ràng trong buổi này. (${dimSummary})`;
  }
}

function buildSummaryEn(
  classification: LearningGainOverallClassification,
  dimensions: LearningGainDimensionResult[],
  sufficientData: boolean,
): string {
  if (!sufficientData) {
    return "Insufficient data to assess learning gain (need at least 4 events).";
  }

  const dimSummary = dimensions
    .map((d) => `${d.titleEn}: ${d.score}/3`)
    .join(", ");

  const improving = dimensions.filter((d) => d.score >= 2);
  const improvingNames = improving.map((d) => d.titleEn).join(", ");

  switch (classification) {
    case "significant_gain":
      return `Significant improvement in ${improving.length}/7 dimensions: ${improvingNames}. (${dimSummary})`;
    case "moderate_gain":
      return `Moderate improvement in ${improving.length}/7 dimensions: ${improvingNames}. (${dimSummary})`;
    case "minimal_gain":
      return `Minimal improvement in ${improving.length}/7 dimensions: ${improvingNames}. More practice needed. (${dimSummary})`;
    case "regression":
      return `Regression detected — some dimensions declining. Possibly harder material or fatigue. (${dimSummary})`;
    case "no_measurable_gain":
      return `No measurable gain this session. (${dimSummary})`;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function scoreToGainLabel(score: GainDimensionScore): GainDimensionLabel {
  switch (score) {
    case 3: return "strong";
    case 2: return "clear";
    case 1: return "minimal";
    case 0: return "none";
  }
}

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function fmt(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function fmt2(value: number): string {
  return value.toFixed(2);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

// ─── Dimension Quick-Check ─────────────────────────────────────────────────

/**
 * Quick check: does this gain result show any measurable improvement?
 * Returns true if at least 2 dimensions score ≥ 2.
 * Computes from dimensions directly so it works with patched/constructed results.
 */
export function hasMeasurableGain(result: LearningGainResult): boolean {
  const improving = result.dimensions.filter((d) => d.score >= 2).length;
  return improving >= 2;
}

/**
 * Quick check: does this gain result meet the minimum bar for
 * Teacher Mercy to report "you improved" to the learner?
 * Returns true for moderate_gain or significant_gain.
 */
export function isReportableGain(result: LearningGainResult): boolean {
  return (
    result.classification === "significant_gain" ||
    result.classification === "moderate_gain"
  );
}
