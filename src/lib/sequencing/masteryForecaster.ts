/**
 * masteryForecaster — per-learner mastery trajectory forecaster.
 *
 * Builds on the S15 mastery scorer to answer: "where is this learner headed,
 * and how confident are we?" Outputs horizon forecasts + confidence bands for
 * each interference pattern and a "this week's focus" list for MercyGuide.
 *
 * ## Model assumptions (minimal honest model)
 *
 * A1. DECAY-ONLY TRAJECTORY: p50 = score at horizon T under the S15 SM-2 decay
 *     function, assuming no new errors arrive. This is the optimistic floor —
 *     what happens if the learner stops making this error class. Real improvement
 *     with active practice will be faster.
 *
 * A2. CONFIDENCE BAND GROWTH: half-width = currentConfidenceWidth * sqrt(1 + d / HALF_LIFE).
 *     Band is wide for thin data AND widens further into the future.
 *
 * A3. ABSTAIN BELOW FLOOR: if attemptsCount < MIN_FORECAST_ATTEMPTS (3), emit
 *     abstain=true. Fewer than 3 observations cannot support a trajectory claim.
 *
 * A4. UNTESTED patterns are always abstained — no measurement exists to project from.
 *
 * A5. "Days to next level": the number of days until the p50 trajectory crosses the
 *     next level threshold under the decay model. Returns null if already at target
 *     level, or if the trajectory approaches the threshold asymptotically but never
 *     reaches it within 365 days.
 *
 * ## Output shape
 *
 * `forecastMasteryTrajectory` → MasteryForecastReport (full per-pattern detail)
 * `buildWeekFocus`            → WeekFocus (top-3 focus patterns for the UI)
 *
 * ## Wiring (A1)
 *
 * See WIRING_SPEC_S17.md in this directory.
 */

import type { VNL1Pattern } from "../../data/placement/vnL1Interference";
import {
  type LearnerInterferenceProfile,
  type InterferenceMasteryScore,
  type InterferenceMasteryLevel,
  MASTERY_HALF_LIFE_DAYS,
  scoringToLevel,
} from "./types";

// ── Constants (mirror S15 masteryScorer for consistency) ──────────────────
const NEUTRAL_SCORE = 0.55;
const SCORE_FLOOR = 0.05;
const SCORE_STEP = 0.075;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_FORECAST_DAYS = 365;

/** Minimum observations before we will issue a forecast. */
export const MIN_FORECAST_ATTEMPTS = 3;

// Level thresholds (same as scoringToLevel in types.ts)
const THRESHOLD_EMERGING = 0.35;
const THRESHOLD_CONSOLIDATING = 0.60;
const THRESHOLD_MASTERED = 0.80;

// ── Types ─────────────────────────────────────────────────────────────────

/** A point estimate + symmetric 68%-credible-interval band. */
export type ForecastPoint = {
  /** Pessimistic estimate (p10 → lower 10th percentile). */
  p10: number;
  /** Central estimate: decay-model projection assuming no new errors. */
  p50: number;
  /** Optimistic estimate (p90 → upper 90th percentile). */
  p90: number;
};

/** Forecast for a single interference pattern. */
export type MasteryForecast = {
  patternId: string;
  currentLevel: InterferenceMasteryLevel;
  /** Undefined when level === "untested". */
  currentScore: number | undefined;
  /**
   * true when insufficient data (attemptsCount < MIN_FORECAST_ATTEMPTS) or
   * level === "untested". When abstain=true, all horizon/daysToNextLevel fields
   * are undefined/null.
   */
  abstain: boolean;
  /** Human-readable reason for abstaining. Undefined when abstain=false. */
  abstainReason?: string;
  /** 7-day horizon forecast. Undefined when abstain=true. */
  horizon7: ForecastPoint | undefined;
  /** 14-day horizon forecast. Undefined when abstain=true. */
  horizon14: ForecastPoint | undefined;
  /**
   * Estimated days from `now` until the p50 trajectory crosses the next
   * level threshold. Null when:
   * - abstain=true
   * - already mastered
   * - trajectory does not reach threshold within MAX_FORECAST_DAYS
   */
  daysToNextLevel: number | null;
};

/** Full forecast report for all patterns in the learner profile. */
export type MasteryForecastReport = {
  learnerId: string;
  forecasts: MasteryForecast[];
  generatedAt: number;
  profileUpdatedAt: number;
};

/** One pattern in the "this week's focus" list. */
export type FocusPattern = {
  patternId: string;
  patternName: string;
  currentLevel: InterferenceMasteryLevel;
  /** null = abstain or already mastered */
  daysToNextLevel: number | null;
  /** 7-day forecast. Undefined if abstained. */
  horizon7: ForecastPoint | undefined;
  /** 1-indexed rank (1 = highest priority this week). */
  priorityRank: number;
  /**
   * Vietnamese-language summary for the MercyGuide UI.
   * e.g. "Article omission: đang gặp khó. Ước tính 12 ngày để lên mức 'đang hình thành'."
   */
  focusSummaryVi: string;
};

/**
 * "This week's focus" output: the top-3 patterns the learner should
 * prioritise, ordered by urgency and forecasted improvement horizon.
 */
export type WeekFocus = {
  learnerId: string;
  focusPatterns: FocusPattern[];
  generatedAt: number;
  /**
   * true when there are no patterns with enough data to generate recommendations.
   * UI should show a generic "keep practising" message instead.
   */
  abstain: boolean;
  /** Set when abstain=true. */
  abstainReason?: string;
};

// ── Internal helpers ──────────────────────────────────────────────────────

function rawScore(attemptsCount: number): number {
  return Math.max(SCORE_FLOOR, NEUTRAL_SCORE - attemptsCount * SCORE_STEP);
}

/**
 * Projected score at `daysOut` days from `now`, assuming lastSeenAt stays fixed.
 * Pure function: deterministic given inputs.
 */
export function scoreAtHorizon(
  attemptsCount: number,
  lastSeenAt: number,
  now: number,
  daysOut: number,
): number {
  const raw = rawScore(attemptsCount);
  const totalDaysSince = (now - lastSeenAt) / MS_PER_DAY + daysOut;
  const k = Math.exp(-totalDaysSince / MASTERY_HALF_LIFE_DAYS);
  return raw * k + NEUTRAL_SCORE * (1 - k);
}

/**
 * Band half-width at `daysOut` days from now.
 * Grows as sqrt(1 + daysOut / HALF_LIFE) so uncertainty accumulates over time.
 * Capped at 0.45 to prevent the band from covering the entire [0,1] space.
 */
export function bandHalfWidth(confidenceWidth: number, daysOut: number): number {
  return Math.min(0.45, confidenceWidth * Math.sqrt(1 + daysOut / MASTERY_HALF_LIFE_DAYS));
}

function makeForecastPoint(p50: number, halfWidth: number): ForecastPoint {
  return {
    p10: Math.max(0, p50 - halfWidth),
    p50,
    p90: Math.min(1, p50 + halfWidth),
  };
}

/**
 * Days until the p50 trajectory (decay model) crosses `threshold`.
 *
 * Derivation:
 *   scoreAt(d) = raw * k_d + 0.55 * (1 - k_d)   where k_d = exp(-(daysSince+d) / HL)
 *   Setting = threshold → k_d = (threshold - 0.55) / (raw - 0.55)
 *   → d = -HL * ln(ratio) - daysSince
 *
 * Returns null when:
 * - already above threshold (daysToNextLevel = 0 handled by caller)
 * - ratio ≤ 0 or ratio ≥ 1 (trajectory never crosses threshold)
 * - computed d > MAX_FORECAST_DAYS (too far out to be actionable)
 */
function daysToThreshold(
  attemptsCount: number,
  lastSeenAt: number,
  now: number,
  threshold: number,
): number | null {
  const raw = rawScore(attemptsCount);
  const daysSince = (now - lastSeenAt) / MS_PER_DAY;
  const currentScore = scoreAtHorizon(attemptsCount, lastSeenAt, now, 0);

  if (currentScore >= threshold) return 0;
  if (raw === threshold) return null; // degenerate

  const denominator = raw - NEUTRAL_SCORE;
  if (denominator === 0) return null; // raw = NEUTRAL → score is constant = NEUTRAL forever

  const ratio = (threshold - NEUTRAL_SCORE) / denominator;
  if (ratio <= 0 || ratio >= 1) return null;

  const totalDays = -MASTERY_HALF_LIFE_DAYS * Math.log(ratio);
  const d = totalDays - daysSince;

  if (d <= 0) return 0;
  if (d > MAX_FORECAST_DAYS) return null;
  return d;
}

function nextLevelThreshold(level: InterferenceMasteryLevel): number | null {
  if (level === "struggling")    return THRESHOLD_EMERGING;
  if (level === "emerging")      return THRESHOLD_CONSOLIDATING;
  if (level === "consolidating") return THRESHOLD_MASTERED;
  return null; // mastered or untested
}

function focusSummaryVi(
  patternName: string,
  level: InterferenceMasteryLevel,
  daysToNext: number | null,
): string {
  if (level === "struggling") {
    if (daysToNext !== null && daysToNext > 0) {
      return `${patternName}: đang gặp khó. Nếu không mắc lỗi mới, ước tính ${Math.ceil(daysToNext)} ngày để lên mức "đang hình thành".`;
    }
    return `${patternName}: đang gặp khó — cần ưu tiên luyện tập ngay.`;
  }
  if (level === "emerging") {
    if (daysToNext !== null && daysToNext > 0) {
      return `${patternName}: đang hình thành. Khoảng ${Math.ceil(daysToNext)} ngày nữa có thể đạt mức "củng cố".`;
    }
    return `${patternName}: đang hình thành — tiếp tục luyện tập đều đặn.`;
  }
  return `${patternName}: đang củng cố — duy trì ôn tập định kỳ.`;
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Forecast the mastery trajectory for a single interference pattern score.
 *
 * @param score - From `LearnerInterferenceProfile.masteryByPattern`
 * @param now   - Epoch ms (caller-supplied for determinism)
 */
export function forecastPatternTrajectory(
  score: InterferenceMasteryScore,
  now: number,
): MasteryForecast {
  if (score.level === "untested" || score.attemptsCount < MIN_FORECAST_ATTEMPTS) {
    return {
      patternId: score.patternId,
      currentLevel: score.level,
      currentScore: score.score,
      abstain: true,
      abstainReason:
        score.level === "untested"
          ? "Chưa có dữ liệu đánh giá cho lỗi này."
          : `Chưa đủ dữ liệu: ${score.attemptsCount} lần quan sát, cần ít nhất ${MIN_FORECAST_ATTEMPTS}.`,
      horizon7: undefined,
      horizon14: undefined,
      daysToNextLevel: null,
    };
  }

  const { attemptsCount, lastUpdatedAt, confidenceWidth, level } = score;

  const p50_7 = scoreAtHorizon(attemptsCount, lastUpdatedAt, now, 7);
  const hw7 = bandHalfWidth(confidenceWidth, 7);

  const p50_14 = scoreAtHorizon(attemptsCount, lastUpdatedAt, now, 14);
  const hw14 = bandHalfWidth(confidenceWidth, 14);

  const nextThreshold = nextLevelThreshold(level);
  const daysToNextLevel =
    nextThreshold !== null
      ? daysToThreshold(attemptsCount, lastUpdatedAt, now, nextThreshold)
      : null;

  return {
    patternId: score.patternId,
    currentLevel: level,
    currentScore: score.score,
    abstain: false,
    abstainReason: undefined,
    horizon7: makeForecastPoint(p50_7, hw7),
    horizon14: makeForecastPoint(p50_14, hw14),
    daysToNextLevel,
  };
}

/**
 * Forecast all patterns in `profile`.
 *
 * Only patterns present in `profile.masteryByPattern` are forecasted.
 * Untested patterns (absent from the map) are not included — they carry no
 * data to project from.
 *
 * @param profile - From `deriveMasteryProfile` (S15)
 * @param now     - Epoch ms (caller-supplied for determinism)
 */
export function forecastMasteryTrajectory(
  profile: LearnerInterferenceProfile,
  now: number,
): MasteryForecastReport {
  const forecasts: MasteryForecast[] = Object.values(profile.masteryByPattern).map(
    (score) => forecastPatternTrajectory(score, now),
  );

  return {
    learnerId: profile.learnerId,
    forecasts,
    generatedAt: now,
    profileUpdatedAt: profile.profileUpdatedAt,
  };
}

/**
 * Build the "this week's focus" output from a forecast report.
 *
 * Selects the top-3 highest-priority patterns (struggling first, then
 * closest to the next level threshold) and returns a MercyGuide-ready
 * summary with Vietnamese focus labels.
 *
 * @param report    - From `forecastMasteryTrajectory`
 * @param patterns  - VNL1 catalogue for pattern names
 */
export function buildWeekFocus(
  report: MasteryForecastReport,
  patterns: VNL1Pattern[],
): WeekFocus {
  const patternMap = new Map(patterns.map((p) => [p.id, p]));

  const LEVEL_ORDER: Partial<Record<InterferenceMasteryLevel, number>> = {
    struggling: 0,
    emerging: 1,
    consolidating: 2,
  };

  const active = report.forecasts
    .filter(
      (f) =>
        !f.abstain &&
        f.currentLevel !== "mastered" &&
        f.currentLevel !== "untested",
    )
    .sort((a, b) => {
      const la = LEVEL_ORDER[a.currentLevel] ?? 3;
      const lb = LEVEL_ORDER[b.currentLevel] ?? 3;
      if (la !== lb) return la - lb;
      const da = a.daysToNextLevel ?? MAX_FORECAST_DAYS;
      const db = b.daysToNextLevel ?? MAX_FORECAST_DAYS;
      return da - db;
    })
    .slice(0, 3);

  if (active.length === 0) {
    return {
      learnerId: report.learnerId,
      focusPatterns: [],
      generatedAt: report.generatedAt,
      abstain: true,
      abstainReason:
        "Chưa đủ dữ liệu để dự báo. Tiếp tục luyện tập để nhận gợi ý cá nhân hóa.",
    };
  }

  const focusPatterns: FocusPattern[] = active.map((f, i) => {
    const pattern = patternMap.get(f.patternId);
    const name = pattern?.name ?? f.patternId;
    return {
      patternId: f.patternId,
      patternName: name,
      currentLevel: f.currentLevel,
      daysToNextLevel: f.daysToNextLevel,
      horizon7: f.horizon7,
      priorityRank: i + 1,
      focusSummaryVi: focusSummaryVi(name, f.currentLevel, f.daysToNextLevel),
    };
  });

  return {
    learnerId: report.learnerId,
    focusPatterns,
    generatedAt: report.generatedAt,
    abstain: false,
  };
}
