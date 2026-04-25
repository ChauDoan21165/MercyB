/**
 * Monthly data-moat report.
 *
 * Pulls the three compounding-analytics surfaces (cohort retention,
 * L1 rule effectiveness, weakness trends) and renders a Markdown
 * summary Chau can read in 5 minutes once a month and use to refine
 * content. The point isn't to replace the dashboards — it's to make
 * the trends greppable in a notebook, email, or PR.
 *
 * Pure separation:
 *   - `buildDataMoatReport(args)` is sync, takes already-fetched
 *     rows, and returns the markdown string. Easy to unit test.
 *   - `generateMonthlyDataMoatReport()` does the network round trips
 *     and calls the pure builder. Returns either the string or a
 *     `Result.ok=false` if any RPC failed.
 */

import {
  getCohortRetention,
  pivotForChart,
  type CohortRetentionRow,
} from "./cohortRetention";
import {
  getL1RuleEffectiveness,
  summariseRuleEffectiveness,
  type L1RuleEffectivenessRow,
} from "./ruleEffectiveness";
import {
  getWeaknessTrends,
  topImprovingWeaknesses,
  topWorseningWeaknesses,
  type WeaknessTrendRow,
} from "./weaknessTrends";

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export interface DataMoatReportInputs {
  cohorts: ReadonlyArray<CohortRetentionRow>;
  ruleEffectiveness: ReadonlyArray<L1RuleEffectivenessRow>;
  weaknessTrends: ReadonlyArray<WeaknessTrendRow>;
  /** ISO date the report represents (e.g. '2026-04-25'). Local default. */
  generatedAt?: string;
}

/**
 * Pure builder. Markdown out, no I/O. Stable across data sizes —
 * empty input arrays yield "No data" sections, not crashes.
 */
export function buildDataMoatReport(args: DataMoatReportInputs): string {
  const generatedAt =
    args.generatedAt ?? new Date().toISOString().slice(0, 10);
  const out: string[] = [];

  out.push(`# MercyBlade — Monthly Data Moat Report`);
  out.push(``);
  out.push(`_Generated: ${generatedAt}_`);
  out.push(``);
  out.push(
    `Each user makes the product smarter for the next. This report distils ` +
      `that compounding into three views: who stays, which L1 rules teach, and ` +
      `which weaknesses are spreading or fading.`,
  );
  out.push(``);

  // ── 1. Retention ────────────────────────────────────────────────────
  out.push(`## 1. Cohort retention`);
  out.push(``);
  const pivoted = pivotForChart(args.cohorts);
  if (pivoted.length === 0) {
    out.push(`No cohort data available yet.`);
    out.push(``);
  } else {
    out.push(`| Cohort week | Size | D1 | D7 | D14 | D30 |`);
    out.push(`|-------------|-----:|----|----|-----|-----|`);
    for (const c of pivoted.slice(0, 12)) {
      out.push(
        `| ${c.cohort_week} | ${c.cohort_size} | ${pct(c.d1)} | ${pct(c.d7)} | ${pct(c.d14)} | ${pct(c.d30)} |`,
      );
    }
    out.push(``);
    const newest = pivoted[0];
    const prev = pivoted[1];
    if (newest && prev && prev.d7 != null && newest.d7 != null) {
      const delta = newest.d7 - prev.d7;
      const arrow = delta >= 0 ? "↑" : "↓";
      out.push(
        `**D7 retention vs prior cohort:** ${arrow} ${Math.abs(delta).toFixed(1)} pts (${pct(newest.d7)} this week vs ${pct(prev.d7)} prior).`,
      );
      out.push(``);
    }
  }

  // ── 2. L1 rule effectiveness ────────────────────────────────────────
  out.push(`## 2. L1 rule effectiveness`);
  out.push(``);
  const summary = summariseRuleEffectiveness(args.ruleEffectiveness);
  if (summary.rules_with_data === 0) {
    out.push(`No rule effectiveness data with sufficient sample size yet.`);
    out.push(``);
  } else {
    out.push(
      `Rules with ≥ 5 distinct users: **${summary.rules_with_data}** of ${summary.total_rules}. ` +
        `Median improvement rate: **${(summary.median_improvement_rate * 100).toFixed(1)}%**. ` +
        `Rules below the 30% threshold (need attention): **${summary.needs_attention_count}**.`,
    );
    out.push(``);

    if (summary.best) {
      out.push(
        `### Top improving rule: \`${summary.best.rule_tag}\``,
      );
      out.push(
        `- improvement rate: **${(summary.best.improvement_rate * 100).toFixed(1)}%** ` +
          `(${summary.best.improvements} of ${summary.best.total_attempts} attempts, ` +
          `${summary.best.sample_size} users)`,
      );
      out.push(``);
    }
    if (summary.worst && summary.worst !== summary.best) {
      out.push(`### Bottom rule: \`${summary.worst.rule_tag}\``);
      out.push(
        `- improvement rate: **${(summary.worst.improvement_rate * 100).toFixed(1)}%** ` +
          `(${summary.worst.improvements} of ${summary.worst.total_attempts} attempts, ` +
          `${summary.worst.sample_size} users) — consider revising the feedback string or narrowing the trigger.`,
      );
      out.push(``);
    }
  }

  // ── 3. Weakness trends ──────────────────────────────────────────────
  out.push(`## 3. Weakness trends`);
  out.push(``);
  const improving = topImprovingWeaknesses(args.weaknessTrends, 5);
  const worsening = topWorseningWeaknesses(args.weaknessTrends, 5);

  if (improving.length === 0 && worsening.length === 0) {
    out.push(`No weakness-trend signal yet (need ≥ 2 weeks of placement data).`);
    out.push(``);
  } else {
    if (improving.length > 0) {
      out.push(`### Top improving weaknesses (week-over-week, fewer flags)`);
      for (const w of improving) {
        out.push(
          `- \`${w.weakness_tag}\` — ${w.latest_count} this week (${formatDelta(w.delta_vs_prev_week)} vs prev)`,
        );
      }
      out.push(``);
    }
    if (worsening.length > 0) {
      out.push(`### Top worsening weaknesses (week-over-week, more flags)`);
      for (const w of worsening) {
        out.push(
          `- \`${w.weakness_tag}\` — ${w.latest_count} this week (${formatDelta(w.delta_vs_prev_week)} vs prev) — consider promoting a related micro-lesson`,
        );
      }
      out.push(``);
    }
  }

  // ── Footer ──────────────────────────────────────────────────────────
  out.push(`---`);
  out.push(`_Source: \`analytics_cohort_retention\`, \`analytics_l1_rule_effectiveness\`, \`analytics_weakness_trends_weekly\`. Admin-only RPCs (level ≥ 9)._`);

  return out.join("\n") + "\n";
}

function pct(v: number | null): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  return `${v.toFixed(1)}%`;
}

function formatDelta(d: number): string {
  if (d === 0) return "no change";
  const arrow = d > 0 ? "↑" : "↓";
  return `${arrow} ${Math.abs(d)}`;
}

/**
 * Network-bound version. Calls the three RPCs in parallel; if any fail,
 * surfaces the first error. On success returns the markdown string.
 */
export async function generateMonthlyDataMoatReport(
  weeks = 12,
): Promise<Result<string>> {
  const [cohortRes, ruleRes, weaknessRes] = await Promise.all([
    getCohortRetention(weeks),
    getL1RuleEffectiveness(),
    getWeaknessTrends(weeks),
  ]);

  if (!cohortRes.ok) return cohortRes;
  if (!ruleRes.ok) return ruleRes;
  if (!weaknessRes.ok) return weaknessRes;

  return {
    ok: true,
    data: buildDataMoatReport({
      cohorts: cohortRes.data,
      ruleEffectiveness: ruleRes.data,
      weaknessTrends: weaknessRes.data,
    }),
  };
}
