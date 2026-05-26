/**
 * Cohort retention analytics.
 *
 * Reads from `analytics_cohort_retention(weeks)` — the SECURITY
 * DEFINER RPC that gates on `get_admin_level >= 9`. Non-admins get a
 * `42501` from Postgres; this module surfaces it as a discriminated
 * `Result<T>` so the dashboard can render targeted error copy without
 * try/catch.
 *
 * Functions:
 *   - `getCohortRetention(weeks)`       returns rows for a chart
 *                                       grouped by cohort × day-offset.
 *   - `getCohortStats(cohortWeek)`      returns just one cohort's
 *                                       day-1/7/14/30 row set, for the
 *                                       per-cohort detail view.
 *
 * Step 11 — extends analytics WITHOUT touching `src/lib/analytics.ts`
 * core (per the task constraint). New file by design.
 */

import { supabase } from "@/lib/supabaseClient";

export type CohortRetentionRow = {
  cohort_week: string;       // ISO date 'YYYY-MM-DD' (Postgres date)
  day_offset: number;        // 1, 7, 14, 30
  cohort_size: number;
  retained_users: number;
  retention_pct: number;     // 0..100, 1 decimal
};

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

const DEFAULT_WEEKS = 12;
const MAX_WEEKS = 52;

/**
 * Pull the cohort × day-offset retention grid for the last `weeks`
 * cohorts. Defaults to 12 weeks. Clamped to [1, 52] to mirror the
 * server-side cap.
 */
export async function getCohortRetention(
  weeks: number = DEFAULT_WEEKS,
): Promise<Result<CohortRetentionRow[]>> {
  const clamped = clampWeeks(weeks);
  const { data, error } = await supabase.rpc("analytics_cohort_retention", {
    p_weeks: clamped,
  });
  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  return { ok: true, data: ((data ?? []) as CohortRetentionRow[]) };
}

/**
 * Filter the full retention set down to a single cohort. Returns the
 * canonical 4-row set (day 1, 7, 14, 30) — but tolerates the view
 * returning fewer rows if the cohort is brand new (e.g. signed up 3
 * days ago, no day-7 entry yet).
 */
export async function getCohortStats(
  cohortWeek: string,
): Promise<Result<CohortRetentionRow[]>> {
  if (!cohortWeek) {
    return { ok: false, error: "cohortWeek is required", code: "VALIDATION" };
  }
  // Pull 52 weeks once, then filter — cheaper than a custom RPC and
  // keeps the migration surface small. Dashboards already cache the
  // full pull.
  const all = await getCohortRetention(MAX_WEEKS);
  if (!all.ok) return all;
  const rows = all.data
    .filter((r) => r.cohort_week === cohortWeek)
    .sort((a, b) => a.day_offset - b.day_offset);
  return { ok: true, data: rows };
}

/**
 * Pure transform: pivot retention rows from
 *   `Array<{cohort_week, day_offset, retention_pct, ...}>`
 * into one row per cohort with day-1/7/14/30 columns. Easier to feed
 * to a recharts <LineChart>.
 */
export function pivotForChart(
  rows: ReadonlyArray<CohortRetentionRow>,
): Array<{
  cohort_week: string;
  cohort_size: number;
  d1: number | null;
  d7: number | null;
  d14: number | null;
  d30: number | null;
}> {
  const byCohort = new Map<
    string,
    {
      cohort_week: string;
      cohort_size: number;
      d1: number | null;
      d7: number | null;
      d14: number | null;
      d30: number | null;
    }
  >();

  for (const r of rows) {
    let entry = byCohort.get(r.cohort_week);
    if (!entry) {
      entry = {
        cohort_week: r.cohort_week,
        cohort_size: r.cohort_size,
        d1: null,
        d7: null,
        d14: null,
        d30: null,
      };
      byCohort.set(r.cohort_week, entry);
    }
    if (r.day_offset === 1) entry.d1 = r.retention_pct;
    if (r.day_offset === 7) entry.d7 = r.retention_pct;
    if (r.day_offset === 14) entry.d14 = r.retention_pct;
    if (r.day_offset === 30) entry.d30 = r.retention_pct;
  }

  return Array.from(byCohort.values()).sort((a, b) =>
    a.cohort_week < b.cohort_week ? 1 : -1,
  );
}

function clampWeeks(weeks: number): number {
  if (!Number.isFinite(weeks) || weeks < 1) return DEFAULT_WEEKS;
  return Math.min(MAX_WEEKS, Math.floor(weeks));
}
