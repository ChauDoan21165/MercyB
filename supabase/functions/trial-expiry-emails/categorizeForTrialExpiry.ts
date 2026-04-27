/**
 * Pure categorization for the trial-expiry email funnel.
 *
 * Mirrors the design of categorizeUsers in the email-reengagement skeleton:
 * keep all the logic that doesn't need Deno (or Supabase) in a standalone
 * module so vitest under Node can exercise it directly.
 *
 * Trial window:
 *   trial_expires_at = first non-null of profiles.trial_expires_at,
 *                      profiles.trial_ends_at, profiles.trial_end
 *                      (mirrors the fall-through pattern in the
 *                      azure-phoneme/checkTrialAccess function)
 *   FALLBACK when none of those columns is set:
 *     trial_started_at  = profiles.created_at
 *     trial_length_days = 3 (FREE_TRIAL_DAYS, mirrors ai-chat edge function)
 *                       + profiles.trial_extension_days (referral grants)
 *     trial_expires_at  = trial_started_at + trial_length_days
 *
 * Stage assignment, computed against `now`:
 *   D_minus_1   : 1.0 ≤ days_until_expiry < 1.5
 *   D_plus_1    : -1.0 < days_until_expiry ≤ -0.5  (i.e. 0.5–1 day past expiry)
 *   not_in_window: anything else
 *
 * Why half-day windows: a daily cron only runs once a day, so we want the
 * "today" sample to land cleanly inside one stage and never two. Tightening
 * to exactly 24h lets late/early cron runs still hit the right stage.
 *
 * Why no D_minus_3 stage: the trial is 3 days, so D-3 would fire on signup
 * day and overlap with the welcome email. The 2-stage funnel (D-1 reminder,
 * D+1 open-door) is the right cadence for a 3-day trial — fewer emails per
 * user, lower spam-complaint risk.
 *
 * Already-paid users (`tier >= 1`) get `not_in_window` regardless — we
 * never email a paying user about trial expiry. (The previous version
 * read `is_premium`; profiles uses `tier` instead — see the schema in
 * src/integrations/supabase/types.ts and the same gating in
 * useUserAccess.ts.)
 *
 * No PII leaves this module. Inputs are plain row shapes; outputs are
 * (user, stage) tuples for the wrapper to log.
 */

export const FREE_TRIAL_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface TrialUserRow {
  id: string;
  email: string | null;
  preferred_name: string | null;
  created_at: string | null;
  /**
   * profiles.tier — 0 (or null) means trial / free, >= 1 means paid.
   * Tier is stored as an integer in the DB; the generated TS types
   * surface it as `string` because of the historical column type, so
   * callers may pass either. Use `tierIsPaid` to normalise.
   */
  tier: number | string | null;
  /**
   * Explicit trial-expiry timestamp columns. If any are set we use the
   * first non-null in priority order. When all three are null we fall
   * back to `created_at + FREE_TRIAL_DAYS + trial_extension_days`.
   * Same fallback ordering as supabase/functions/azure-phoneme.
   */
  trial_expires_at: string | null;
  trial_ends_at: string | null;
  trial_end: string | null;
  trial_extension_days: number | null;
}

export type TrialStage =
  | "D_minus_1"
  | "D_plus_1"
  | "not_in_window";

export type TrialCampaign =
  | "trial_expiry_d_minus_1"
  | "trial_expiry_d_plus_1";

export const TRIAL_STAGE_TO_CAMPAIGN: Record<
  Exclude<TrialStage, "not_in_window">,
  TrialCampaign
> = {
  D_minus_1: "trial_expiry_d_minus_1",
  D_plus_1: "trial_expiry_d_plus_1",
};

/** True when the row's tier is >= 1 (i.e. paid). */
export function tierIsPaid(tier: TrialUserRow["tier"]): boolean {
  if (tier === null || tier === undefined) return false;
  if (typeof tier === "number") return Number.isFinite(tier) && tier >= 1;
  const parsed = Number.parseInt(tier, 10);
  return Number.isFinite(parsed) && parsed >= 1;
}

/** Parse an ISO timestamp into a Date, or return null on failure. */
function parseDateMaybe(value: string | null): Date | null {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms) : null;
}

/**
 * Compute the absolute trial-expiry timestamp for a row, or null if the
 * row is malformed (no usable trial column AND no created_at). Caller
 * decides what to do with null (typically: skip).
 */
export function trialExpiresAt(row: TrialUserRow): Date | null {
  // Prefer an explicit trial column when one is set. Walks the same
  // priority order as the azure-phoneme edge function so the two
  // surfaces never disagree about when a trial ends.
  const explicit =
    parseDateMaybe(row.trial_expires_at) ??
    parseDateMaybe(row.trial_ends_at) ??
    parseDateMaybe(row.trial_end);
  if (explicit) return explicit;

  // Fall back to created_at + free trial + referral extension days.
  if (!row.created_at) return null;
  const created = new Date(row.created_at).getTime();
  if (!Number.isFinite(created)) return null;
  const extension = Math.max(0, row.trial_extension_days ?? 0);
  return new Date(created + (FREE_TRIAL_DAYS + extension) * DAY_MS);
}

/**
 * Days until trial expiry (positive = future, negative = past). Returns
 * null when the trial timestamp can't be computed.
 */
export function daysUntilExpiry(row: TrialUserRow, now: Date): number | null {
  const expires = trialExpiresAt(row);
  if (!expires) return null;
  return (expires.getTime() - now.getTime()) / DAY_MS;
}

/**
 * Classify a single row into its trial-expiry stage. See module doc for
 * the windows. Premium / missing-email / never-trial users all return
 * "not_in_window" — caller doesn't need extra guards.
 */
export function stageFor(row: TrialUserRow, now: Date): TrialStage {
  if (tierIsPaid(row.tier)) return "not_in_window";
  if (!row.email) return "not_in_window";
  const days = daysUntilExpiry(row, now);
  if (days === null) return "not_in_window";

  if (days >= 1.0 && days < 1.5) return "D_minus_1";
  if (days > -1.0 && days <= -0.5) return "D_plus_1";
  return "not_in_window";
}

/**
 * Map a stage to the email_sends_log campaign string. Returns null for
 * "not_in_window".
 */
export function campaignForStage(stage: TrialStage): TrialCampaign | null {
  if (stage === "not_in_window") return null;
  return TRIAL_STAGE_TO_CAMPAIGN[stage];
}

export interface CategorizedTrialUsers {
  d_minus_1: TrialUserRow[];
  d_plus_1: TrialUserRow[];
  skipped: TrialUserRow[];
}

export function categorizeForTrialExpiry(
  rows: TrialUserRow[],
  now: Date,
): CategorizedTrialUsers {
  const out: CategorizedTrialUsers = {
    d_minus_1: [],
    d_plus_1: [],
    skipped: [],
  };
  for (const row of rows) {
    const stage = stageFor(row, now);
    if (stage === "D_minus_1") out.d_minus_1.push(row);
    else if (stage === "D_plus_1") out.d_plus_1.push(row);
    else out.skipped.push(row);
  }
  return out;
}
