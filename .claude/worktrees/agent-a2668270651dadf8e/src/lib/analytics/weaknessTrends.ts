/**
 * Weakness-trend analytics.
 *
 * Reads `analytics_weakness_trends_weekly(weeks)` — admin-gated.
 * Returns one row per (week, weakness_tag).
 *
 * Pure helpers compute net-change-vs-prev-week and rank improving /
 * worsening weakness areas — the data shapes the dashboard chart and
 * the monthly data-moat report consume.
 */

import { supabase } from "@/lib/supabaseClient";

export type WeaknessTrendRow = {
  week_start: string;
  weakness_tag: string;
  total_occurrences: number;
  unique_users: number;
};

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

const DEFAULT_WEEKS = 12;
const MAX_WEEKS = 52;

export async function getWeaknessTrends(
  weeks: number = DEFAULT_WEEKS,
): Promise<Result<WeaknessTrendRow[]>> {
  const clamped = Number.isFinite(weeks) && weeks >= 1
    ? Math.min(MAX_WEEKS, Math.floor(weeks))
    : DEFAULT_WEEKS;
  const { data, error } = await supabase.rpc(
    "analytics_weakness_trends_weekly",
    { p_weeks: clamped },
  );
  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  return { ok: true, data: (data ?? []) as WeaknessTrendRow[] };
}

// ──────────────────────────────────────────────────────────────────────
// Pure helpers
// ──────────────────────────────────────────────────────────────────────

export interface WeaknessTagSummary {
  weakness_tag: string;
  /** Latest non-zero week's count, or 0 if no data. */
  latest_count: number;
  /**
   * Difference vs the previous week's count. Positive = worsening,
   * negative = improving (the metric counts placement-test weakness
   * flags, so MORE flags = more learners struggling).
   */
  delta_vs_prev_week: number;
  total_weeks_seen: number;
}

/**
 * Pivot the row stream into one summary entry per weakness_tag with
 * a delta vs previous week. Rows must be in week_start DESC order
 * (the RPC guarantees this).
 */
export function summariseWeaknessTrends(
  rows: ReadonlyArray<WeaknessTrendRow>,
): WeaknessTagSummary[] {
  const byTag = new Map<string, WeaknessTrendRow[]>();
  for (const r of rows) {
    if (!byTag.has(r.weakness_tag)) byTag.set(r.weakness_tag, []);
    byTag.get(r.weakness_tag)!.push(r);
  }

  const out: WeaknessTagSummary[] = [];
  for (const [tag, trend] of byTag.entries()) {
    // trend is already DESC by week_start when the RPC contract is honoured.
    const sorted = [...trend].sort((a, b) =>
      a.week_start < b.week_start ? 1 : -1,
    );
    const latest = sorted[0];
    const prev = sorted[1];
    out.push({
      weakness_tag: tag,
      latest_count: latest?.total_occurrences ?? 0,
      delta_vs_prev_week:
        (latest?.total_occurrences ?? 0) - (prev?.total_occurrences ?? 0),
      total_weeks_seen: sorted.length,
    });
  }
  return out;
}

/**
 * The N tags with the largest negative delta — i.e. weaknesses fading
 * fastest week-over-week. Returned in delta ASC order (most-improved
 * first).
 */
export function topImprovingWeaknesses(
  rows: ReadonlyArray<WeaknessTrendRow>,
  limit = 5,
): WeaknessTagSummary[] {
  return summariseWeaknessTrends(rows)
    .filter((s) => s.delta_vs_prev_week < 0 && s.total_weeks_seen >= 2)
    .sort((a, b) => a.delta_vs_prev_week - b.delta_vs_prev_week)
    .slice(0, limit);
}

/**
 * The N tags with the largest positive delta — weaknesses spreading.
 * Returned in delta DESC order (worst-trending first).
 */
export function topWorseningWeaknesses(
  rows: ReadonlyArray<WeaknessTrendRow>,
  limit = 5,
): WeaknessTagSummary[] {
  return summariseWeaknessTrends(rows)
    .filter((s) => s.delta_vs_prev_week > 0 && s.total_weeks_seen >= 2)
    .sort((a, b) => b.delta_vs_prev_week - a.delta_vs_prev_week)
    .slice(0, limit);
}
