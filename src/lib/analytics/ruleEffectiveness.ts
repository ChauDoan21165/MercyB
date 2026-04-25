/**
 * L1 rule-effectiveness analytics.
 *
 * Reads from `analytics_l1_rule_effectiveness()` — admin-gated RPC.
 *
 * Today the source is `speech_attempts.error_code` (proxy for L1
 * rule firings until dedicated rule-event logging ships). The shape
 * is rule-agnostic, so when the source flips the column names won't.
 *
 * Functions:
 *   - `getL1RuleEffectiveness()`         per-rule improvement rate.
 *   - `getRulesNeedingAttention(opts)`   filters to rules with a
 *                                         meaningful sample size and
 *                                         improvement_rate < threshold.
 *                                         Signal that a rule is
 *                                         confusing or wrong, so Chau
 *                                         can edit the feedback string.
 *
 * Pure helper:
 *   - `summariseRuleEffectiveness(rows)` builds the headline numbers
 *                                         for the report generator.
 */

import { supabase } from "@/lib/supabaseClient";

export type L1RuleEffectivenessRow = {
  rule_tag: string;
  total_attempts: number;
  improvements: number;
  /** 0..1 (Postgres returns numeric → number after JSON parse). */
  improvement_rate: number;
  sample_size: number;
};

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

/**
 * Floor sample size for `getRulesNeedingAttention`. Rules with fewer
 * than 5 distinct users aren't statistically meaningful — flagging
 * them as "needs attention" would create false signal during slow
 * weeks.
 */
export const NEEDS_ATTENTION_MIN_SAMPLE = 5;

/**
 * Default improvement-rate threshold below which a rule "needs
 * attention". 30% means: most learners who see this hint are NOT
 * improving on the next attempt — strong signal the message is
 * unclear or the rule fires too aggressively.
 */
export const NEEDS_ATTENTION_RATE_THRESHOLD = 0.3;

export async function getL1RuleEffectiveness(): Promise<
  Result<L1RuleEffectivenessRow[]>
> {
  const { data, error } = await supabase.rpc(
    "analytics_l1_rule_effectiveness",
  );
  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  // Postgres `numeric` comes back as a string in some clients. Normalise.
  const normalised = ((data ?? []) as Array<Record<string, unknown>>).map(
    (r) => ({
      rule_tag: String(r.rule_tag ?? ""),
      total_attempts: Number(r.total_attempts ?? 0),
      improvements: Number(r.improvements ?? 0),
      improvement_rate: Number(r.improvement_rate ?? 0),
      sample_size: Number(r.sample_size ?? 0),
    }),
  );
  return { ok: true, data: normalised };
}

export interface NeedsAttentionOptions {
  /** Override the default 30% threshold. Range [0..1]. */
  rateThreshold?: number;
  /** Override the default min-sample-size guard. */
  minSampleSize?: number;
}

/**
 * Filter to rules where improvement_rate is BELOW the threshold AND
 * the sample size is large enough to trust the signal. Sorted by
 * (improvement_rate ASC, total_attempts DESC) so the most-fired,
 * worst-performing rule is on top.
 */
export async function getRulesNeedingAttention(
  opts: NeedsAttentionOptions = {},
): Promise<Result<L1RuleEffectivenessRow[]>> {
  const result = await getL1RuleEffectiveness();
  if (!result.ok) return result;

  const rateThreshold =
    typeof opts.rateThreshold === "number"
      ? opts.rateThreshold
      : NEEDS_ATTENTION_RATE_THRESHOLD;
  const minSampleSize =
    typeof opts.minSampleSize === "number"
      ? opts.minSampleSize
      : NEEDS_ATTENTION_MIN_SAMPLE;

  const filtered = result.data
    .filter(
      (r) =>
        r.sample_size >= minSampleSize &&
        r.improvement_rate < rateThreshold,
    )
    .sort((a, b) => {
      if (a.improvement_rate !== b.improvement_rate) {
        return a.improvement_rate - b.improvement_rate;
      }
      return b.total_attempts - a.total_attempts;
    });

  return { ok: true, data: filtered };
}

// ──────────────────────────────────────────────────────────────────────
// Pure helpers (testable without Supabase)
// ──────────────────────────────────────────────────────────────────────

export interface RuleEffectivenessSummary {
  total_rules: number;
  rules_with_data: number;
  median_improvement_rate: number;
  best: L1RuleEffectivenessRow | null;
  worst: L1RuleEffectivenessRow | null;
  needs_attention_count: number;
}

/**
 * Summarise the rule grid for the monthly data-moat report. Handles
 * empty input (rules_with_data = 0, best/worst = null).
 */
export function summariseRuleEffectiveness(
  rows: ReadonlyArray<L1RuleEffectivenessRow>,
  opts: NeedsAttentionOptions = {},
): RuleEffectivenessSummary {
  if (rows.length === 0) {
    return {
      total_rules: 0,
      rules_with_data: 0,
      median_improvement_rate: 0,
      best: null,
      worst: null,
      needs_attention_count: 0,
    };
  }
  const rateThreshold =
    typeof opts.rateThreshold === "number"
      ? opts.rateThreshold
      : NEEDS_ATTENTION_RATE_THRESHOLD;
  const minSampleSize =
    typeof opts.minSampleSize === "number"
      ? opts.minSampleSize
      : NEEDS_ATTENTION_MIN_SAMPLE;

  const sample = rows.filter((r) => r.sample_size >= minSampleSize);
  const sorted = [...sample].sort(
    (a, b) => b.improvement_rate - a.improvement_rate,
  );
  const median =
    sorted.length === 0
      ? 0
      : sorted[Math.floor(sorted.length / 2)].improvement_rate;

  const needs_attention_count = sample.filter(
    (r) => r.improvement_rate < rateThreshold,
  ).length;

  return {
    total_rules: rows.length,
    rules_with_data: sample.length,
    median_improvement_rate: median,
    best: sorted[0] ?? null,
    worst: sorted[sorted.length - 1] ?? null,
    needs_attention_count,
  };
}
