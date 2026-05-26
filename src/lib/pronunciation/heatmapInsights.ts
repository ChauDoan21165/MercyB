// Heatmap → headline insights. Pure on (HeatmapData) so the same
// snapshot always yields the same insights — drives the cards above
// the heatmap on /progress, AND the snippets injected into Mercy chat
// context. Two surfaces, one source of truth, no drift.
//
// Insight shapes are intentionally minimal: a kind, a phoneme, a score
// pair where useful, and bilingual copy. UI handles emoji / colors;
// this layer is data only.

import type { HeatmapData } from "./phonemeHeatmap";

export type InsightKind =
  | "most_improved"   // largest positive delta from window's first half to second half
  | "plateau"         // active phoneme with a near-zero delta (still being practised, not getting better)
  | "needs_work"      // lowest current-window average across all phonemes
  | "doing_well";     // highest current-window average

export type Insight = {
  kind: InsightKind;
  phoneme: string;
  /** Window average (0..100). */
  averageScore: number;
  /** Score change first-half → second-half (positive = improving). */
  delta: number | null;
  /** Attempt count across the whole window for this phoneme. */
  attemptCount: number;
  /** Vietnamese-primary headline (Mercy-voice). */
  copy_vi: string;
  /** English mirror — paired below VI in UI; used as-is in chat injection. */
  copy_en: string;
  /**
   * Suggested next step. Currently `/speak` for everything because we
   * don't have phoneme-specific drill rooms; kept as a field so we can
   * route to per-phoneme drills later without changing call sites.
   */
  action_target: string;
};

/** Floors to keep noise out of the insights cards. */
const MIN_ATTEMPTS_FOR_INSIGHT = 3;
const MOST_IMPROVED_DELTA_FLOOR = 5;
const PLATEAU_DELTA_BAND = 3;
const PLATEAU_MIN_ATTEMPTS = 6;
const DOING_WELL_FLOOR = 80;

/**
 * Produce up to four insights, in display order: most_improved,
 * plateau, needs_work, doing_well. Any of the four may be omitted
 * when the data doesn't justify it (e.g. nothing's plateaued yet).
 */
export function generateInsights(data: HeatmapData | null): Insight[] {
  if (!data) return [];

  const stats = perPhonemeStats(data);
  if (stats.length === 0) return [];

  const insights: Insight[] = [];

  // Most improved: largest second-half-minus-first-half delta, ≥ floor.
  const improved = [...stats]
    .filter(
      (s) =>
        s.attemptCount >= MIN_ATTEMPTS_FOR_INSIGHT &&
        s.delta !== null &&
        s.delta >= MOST_IMPROVED_DELTA_FLOOR,
    )
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0));
  const improvedTop = improved[0];
  if (improvedTop) {
    insights.push(buildMostImproved(improvedTop));
  }

  // Plateau: small absolute delta + enough attempts to know it's real.
  // Skip a phoneme that already shipped as "most improved".
  const plateau = stats
    .filter(
      (s) =>
        s.phoneme !== improvedTop?.phoneme &&
        s.attemptCount >= PLATEAU_MIN_ATTEMPTS &&
        s.delta !== null &&
        Math.abs(s.delta) <= PLATEAU_DELTA_BAND,
    )
    .sort((a, b) => a.averageScore - b.averageScore)[0];
  if (plateau) {
    insights.push(buildPlateau(plateau));
  }

  // Needs work: lowest window-wide average. Distinct from plateau —
  // could also be the lowest plateau, but display logic wants the
  // single lowest as a separate, more prescriptive card.
  const needs = [...stats]
    .filter((s) => s.attemptCount >= MIN_ATTEMPTS_FOR_INSIGHT)
    .sort((a, b) => a.averageScore - b.averageScore)[0];
  if (needs && needs.phoneme !== improvedTop?.phoneme) {
    insights.push(buildNeedsWork(needs));
  }

  // Doing well: highest window-wide average ≥ 80.
  const wins = [...stats]
    .filter(
      (s) =>
        s.attemptCount >= MIN_ATTEMPTS_FOR_INSIGHT &&
        s.averageScore >= DOING_WELL_FLOOR,
    )
    .sort((a, b) => b.averageScore - a.averageScore)[0];
  if (wins) {
    insights.push(buildDoingWell(wins));
  }

  return insights;
}

// ── Per-phoneme stats (window average + half-vs-half delta) ─────────────

type PerPhonemeStats = {
  phoneme: string;
  averageScore: number;
  attemptCount: number;
  /** First-half mean. Null when first half had zero samples. */
  firstHalfMean: number | null;
  /** Second-half mean. Null when second half had zero samples. */
  secondHalfMean: number | null;
  /** secondHalfMean - firstHalfMean. Null if either side is null. */
  delta: number | null;
};

export function perPhonemeStats(data: HeatmapData): PerPhonemeStats[] {
  const halfIdx = Math.floor(data.days.length / 2);
  // Build day → index map for O(1) half-classification.
  const dayIndex = new Map<string, number>();
  for (let i = 0; i < data.days.length; i += 1) {
    dayIndex.set(data.days[i], i);
  }

  // For each phoneme, collect: total sum/count + first-half sum/count + second-half sum/count.
  type Acc = {
    sum: number;
    count: number;
    firstSum: number;
    firstCount: number;
    secondSum: number;
    secondCount: number;
  };
  const byPhoneme = new Map<string, Acc>();
  for (const cell of data.cells) {
    const idx = dayIndex.get(cell.day);
    if (idx === undefined) continue;
    let acc = byPhoneme.get(cell.phoneme);
    if (!acc) {
      acc = {
        sum: 0,
        count: 0,
        firstSum: 0,
        firstCount: 0,
        secondSum: 0,
        secondCount: 0,
      };
      byPhoneme.set(cell.phoneme, acc);
    }
    // Cell average is already rounded; weight by attemptCount so a day
    // with 12 attempts isn't equal to a day with 1.
    acc.sum += cell.averageScore * cell.attemptCount;
    acc.count += cell.attemptCount;
    if (idx < halfIdx) {
      acc.firstSum += cell.averageScore * cell.attemptCount;
      acc.firstCount += cell.attemptCount;
    } else {
      acc.secondSum += cell.averageScore * cell.attemptCount;
      acc.secondCount += cell.attemptCount;
    }
  }

  const out: PerPhonemeStats[] = [];
  for (const [phoneme, a] of byPhoneme.entries()) {
    if (a.count === 0) continue;
    const firstHalfMean = a.firstCount > 0 ? a.firstSum / a.firstCount : null;
    const secondHalfMean = a.secondCount > 0 ? a.secondSum / a.secondCount : null;
    const delta =
      firstHalfMean !== null && secondHalfMean !== null
        ? Math.round(secondHalfMean - firstHalfMean)
        : null;
    out.push({
      phoneme,
      averageScore: Math.round(a.sum / a.count),
      attemptCount: a.count,
      firstHalfMean: firstHalfMean === null ? null : Math.round(firstHalfMean),
      secondHalfMean:
        secondHalfMean === null ? null : Math.round(secondHalfMean),
      delta,
    });
  }
  return out;
}

// ── Insight builders ────────────────────────────────────────────────────

function buildMostImproved(s: PerPhonemeStats): Insight {
  const before = s.firstHalfMean ?? 0;
  const after = s.secondHalfMean ?? s.averageScore;
  return {
    kind: "most_improved",
    phoneme: s.phoneme,
    averageScore: s.averageScore,
    delta: s.delta,
    attemptCount: s.attemptCount,
    copy_vi:
      `Đang cải thiện nhanh nhất: âm /${s.phoneme}/ — tăng từ ${before} lên ${after}.`,
    copy_en:
      `Improving fastest: /${s.phoneme}/ — went from ${before} to ${after}.`,
    action_target: "/speak",
  };
}

function buildPlateau(s: PerPhonemeStats): Insight {
  return {
    kind: "plateau",
    phoneme: s.phoneme,
    averageScore: s.averageScore,
    delta: s.delta,
    attemptCount: s.attemptCount,
    copy_vi:
      `Chưa cải thiện: âm /${s.phoneme}/ giữ ở mức ${s.averageScore}/100. ` +
      `Hãy thử một bài tập khác.`,
    copy_en:
      `Plateaued: /${s.phoneme}/ holding at ${s.averageScore}/100. Try a different drill.`,
    action_target: "/speak",
  };
}

function buildNeedsWork(s: PerPhonemeStats): Insight {
  return {
    kind: "needs_work",
    phoneme: s.phoneme,
    averageScore: s.averageScore,
    delta: s.delta,
    attemptCount: s.attemptCount,
    copy_vi:
      `Cần luyện thêm: âm /${s.phoneme}/ đang ở ${s.averageScore}/100 — thấp nhất tuần này.`,
    copy_en:
      `Needs work: /${s.phoneme}/ is at ${s.averageScore}/100 — lowest in window.`,
    action_target: "/speak",
  };
}

function buildDoingWell(s: PerPhonemeStats): Insight {
  return {
    kind: "doing_well",
    phoneme: s.phoneme,
    averageScore: s.averageScore,
    delta: s.delta,
    attemptCount: s.attemptCount,
    copy_vi:
      `Đang tốt nhất: âm /${s.phoneme}/ — ${s.averageScore}/100. Giữ vững!`,
    copy_en:
      `Doing well: /${s.phoneme}/ — ${s.averageScore}/100. Keep it up!`,
    action_target: "/speak",
  };
}
