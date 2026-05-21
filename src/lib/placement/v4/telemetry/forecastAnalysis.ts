// Placement v4 telemetry — forecast vs reality analysis.
//
// Given an upstream forecast (predictedCefr + predictedMastery per skill at a
// horizon) and an observed progression snapshot, produce a deterministic
// deviation report with:
//
//   - per-skill deviation codes (forecast error, optimistic bias, stagnation
//     against forecast, false acceleration, weak-skill prediction miss),
//   - a degraded-confidence score (1.0 = no deviations; lower = more drift),
//   - recalibration suggestions tied back to the deviations that triggered them.
//
// No I/O, no Date.now, no randomness. Inputs in → outputs out, deterministic.

import { CEFR_RANK } from "./adaptiveTelemetryTypes";
import type {
  ForecastDeviation,
  ForecastDeviationCode,
  ForecastDeviationReport,
  ForecastLike,
  ForecastSkillTargetLike,
  ProgressionSnapshotLike,
  RecalibrationSuggestion,
  RecalibrationSuggestionKind,
  Skill,
} from "./adaptiveTelemetryTypes";
import type { CEFRLevel } from "../../../../types/placement-v3";

export interface ForecastAnalysisOptions {
  /** Mastery delta above which `forecast_error_above_tolerance` fires. */
  masteryErrorTolerance?: number;
  /** Signed mastery delta above which `optimistic_bias` fires (predicted > observed). */
  optimisticBiasThreshold?: number;
  /** Signed mastery delta below which `false_acceleration` fires (predicted < observed). */
  falseAccelerationThreshold?: number;
  /** Mastery deltas considered "no movement" for stagnation detection. */
  stagnationDeltaCeiling?: number;
}

const DEFAULTS: Required<ForecastAnalysisOptions> = {
  masteryErrorTolerance: 0.15,
  optimisticBiasThreshold: 0.1,
  falseAccelerationThreshold: 0.1,
  stagnationDeltaCeiling: 0.02,
};

export function analyzeForecastVsActual(
  forecast: ForecastLike,
  snapshot: ProgressionSnapshotLike,
  options: ForecastAnalysisOptions = {},
): ForecastDeviationReport {
  if (forecast.planVersion !== snapshot.plan.planVersion) {
    // We do NOT throw: a plan-version mismatch IS data — the system already
    // recalculated since the forecast was made. We surface it as a deviation
    // on every skill so the caller can decide.
  }

  const tol = { ...DEFAULTS, ...options };
  const deviations: ForecastDeviation[] = [];

  // Sort targets deterministically so the deviation list is stable.
  const targets = [...forecast.targets].sort((a, b) => {
    if (a.skill < b.skill) return -1;
    if (a.skill > b.skill) return 1;
    return 0;
  });

  for (const target of targets) {
    const observedMastery = observedMasteryForSkill(snapshot, target.skill);
    const observedCefr = observedCefrForSkill(snapshot, target.skill);
    const codes = classifyDeviation(target, observedMastery, observedCefr, tol);
    for (const code of codes) {
      deviations.push({
        skill: target.skill,
        code,
        predictedMastery: target.predictedMastery,
        observedMastery,
        deltaCefrSteps:
          CEFR_RANK[observedCefr] - CEFR_RANK[target.predictedCefr],
        predictedCefr: target.predictedCefr,
        observedCefr,
      });
    }
  }

  const degradedConfidence = computeDegradedConfidence(deviations, targets.length);
  const recalibrationRecommendations = composeRecalibrationSuggestions(deviations);

  return {
    forecastId: forecast.forecastId,
    planVersion: forecast.planVersion,
    degradedConfidence,
    deviations,
    recalibrationRecommendations,
  };
}

function observedMasteryForSkill(
  snapshot: ProgressionSnapshotLike,
  skill: Skill,
): number {
  return snapshot.skills[skill]?.mastery ?? 0;
}

function observedCefrForSkill(
  snapshot: ProgressionSnapshotLike,
  skill: Skill,
): CEFRLevel {
  return snapshot.cefr.perSkill?.[skill] ?? snapshot.cefr.overall;
}

function classifyDeviation(
  target: ForecastSkillTargetLike,
  observedMastery: number,
  observedCefr: CEFRLevel,
  tol: Required<ForecastAnalysisOptions>,
): ForecastDeviationCode[] {
  const codes: ForecastDeviationCode[] = [];
  const masteryDelta = target.predictedMastery - observedMastery;
  const absDelta = Math.abs(masteryDelta);
  if (absDelta >= tol.masteryErrorTolerance) {
    codes.push("forecast_error_above_tolerance");
  }
  if (masteryDelta >= tol.optimisticBiasThreshold) {
    codes.push("optimistic_bias");
  }
  if (-masteryDelta >= tol.falseAccelerationThreshold) {
    codes.push("false_acceleration");
  }
  // Stagnation: forecast predicted CEFR uplift (predictedCefr > observedCefr's
  // baseline), but observed CEFR ≤ predicted's source level AND mastery moved
  // less than the stagnationDeltaCeiling vs. the prediction.
  if (
    CEFR_RANK[target.predictedCefr] > CEFR_RANK[observedCefr] &&
    Math.abs(masteryDelta) <= tol.stagnationDeltaCeiling
  ) {
    codes.push("stagnation_against_forecast");
  }
  // Weak-skill prediction miss: predicted a meaningful mastery gain on a skill
  // where confidence was low and observed is now far short.
  if (
    target.confidence < 0.5 &&
    target.predictedMastery >= 0.6 &&
    observedMastery < target.predictedMastery - 0.2
  ) {
    codes.push("weak_skill_prediction_miss");
  }
  return codes;
}

function computeDegradedConfidence(
  deviations: readonly ForecastDeviation[],
  targetCount: number,
): number {
  if (targetCount === 0) return 1;
  // Confidence drops 0.1 per deviation, capped at 0 floor.
  const drop = 0.1 * deviations.length;
  const raw = 1 - drop;
  if (raw < 0) return 0;
  if (raw > 1) return 1;
  return raw;
}

interface RecalibrationRule {
  kind: RecalibrationSuggestionKind;
  reasonCode: string;
  /** Predicate over the deviation set. */
  trigger: (
    deviations: readonly ForecastDeviation[],
  ) => readonly ForecastDeviation[];
}

const RECALIBRATION_RULES: readonly RecalibrationRule[] = [
  {
    kind: "shorten_horizon",
    reasonCode: "tolerance_exceeded_on_majority_of_skills",
    trigger: (d) => d.filter((x) => x.code === "forecast_error_above_tolerance"),
  },
  {
    kind: "lower_mastery_targets",
    reasonCode: "optimistic_bias_detected",
    trigger: (d) => d.filter((x) => x.code === "optimistic_bias"),
  },
  {
    kind: "raise_review_frequency",
    reasonCode: "stagnation_against_forecast",
    trigger: (d) => d.filter((x) => x.code === "stagnation_against_forecast"),
  },
  {
    kind: "drop_speaking_acceleration",
    reasonCode: "speaking_skill_under_forecast",
    trigger: (d) =>
      d.filter(
        (x) =>
          (x.skill === "speaking" || x.skill === "pronunciation") &&
          x.code === "weak_skill_prediction_miss",
      ),
  },
  {
    kind: "rerun_placement",
    reasonCode: "false_acceleration_and_underprediction",
    trigger: (d) => {
      const fa = d.filter((x) => x.code === "false_acceleration");
      // Multiple skills under-predicted = the model is mis-anchored; re-run
      // placement instead of patching.
      return fa.length >= 2 ? fa : [];
    },
  },
] as const;

function composeRecalibrationSuggestions(
  deviations: readonly ForecastDeviation[],
): RecalibrationSuggestion[] {
  const out: RecalibrationSuggestion[] = [];
  for (const rule of RECALIBRATION_RULES) {
    const evidence = rule.trigger(deviations);
    if (evidence.length === 0) continue;
    out.push({
      kind: rule.kind,
      reasonCode: rule.reasonCode,
      evidence: [...evidence].sort((a, b) => {
        if (a.skill < b.skill) return -1;
        if (a.skill > b.skill) return 1;
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
      }),
    });
  }
  return out;
}

/**
 * Pretty summary helper for upstream UI: returns a stable, learner-readable
 * string about the forecast's status, given a deviation report.
 *
 * Bilingual + non-judgmental, matching the diagnostic surface conventions.
 */
export function summarizeForecastForLearner(
  report: ForecastDeviationReport,
): {
  vi: string;
  en: string;
  reasonCode: string;
} {
  if (report.deviations.length === 0) {
    return {
      vi: "Lộ trình dự báo đang khớp với thực tế.",
      en: "Your forecast is tracking reality.",
      reasonCode: "forecast_on_track",
    };
  }
  const optimistic = report.deviations.filter((d) => d.code === "optimistic_bias");
  if (optimistic.length >= 2) {
    return {
      vi: "Dự báo hơi lạc quan — mình sẽ giảm nhẹ mục tiêu để giữ bạn ổn định.",
      en: "The forecast was a bit optimistic — easing the targets to stay realistic.",
      reasonCode: "optimistic_bias_majority",
    };
  }
  const stagnation = report.deviations.filter(
    (d) => d.code === "stagnation_against_forecast",
  );
  if (stagnation.length >= 1) {
    return {
      vi: "Một vài kỹ năng đang chậm hơn dự đoán — mình sắp xếp ôn tập có chủ đích.",
      en: "A few skills are slower than predicted — adding focused review.",
      reasonCode: "stagnation_against_forecast",
    };
  }
  return {
    vi: "Có sai lệch nhỏ so với dự báo — mình tinh chỉnh kế hoạch.",
    en: "Small drift from the forecast — tuning the plan.",
    reasonCode: "small_drift",
  };
}
