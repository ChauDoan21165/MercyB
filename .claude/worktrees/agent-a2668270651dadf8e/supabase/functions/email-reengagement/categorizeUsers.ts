/**
 * Categorization logic for re-engagement emails.
 *
 * Two layers, both pure (no Deno imports — vitest under Node can run them):
 *
 *   1. Time-based buckets — `bucketFor`, `categorizeUsers` (A6 skeleton, PR #81).
 *      Looks at last_active_at only. Maps to reengagement_7d / 14d / 30d.
 *
 *   2. Behavior-based buckets — `categorizeForReengagement` (A10 funnel).
 *      Considers subscription / trial state on top of activity. Used to send
 *      the right template at the right moment in a user's lifecycle:
 *
 *        active_then_silent              — was active in last 30d, then 7+ days quiet
 *        trial_completed_no_subscribe    — finished trial, didn't pay, no return for 14+ days
 *        post_subscribe_disengaged       — paid subscriber, no activity in last 7 days
 *        almost_lapsed                   — paid subscriber, ≥25 days into period, low engagement
 *
 *      Plus a fifth synthetic campaign that is NOT bucket-driven:
 *        added_something_new             — monthly broadcast (manual trigger)
 *
 * Priority: when a user matches multiple behavior buckets (e.g., paid + silent
 * + near renewal), pick the most actionable one in this order:
 *   almost_lapsed > post_subscribe_disengaged > trial_completed_no_subscribe > active_then_silent
 *
 * Thresholds are absolute days in UTC. last_active_at / trial_ends_at /
 * current_period_end_at are all stored as timestamptz, so subtraction is
 * timezone-safe.
 */

// ─── Layer 1 — time-based (preserved from A6 skeleton) ────────────────────

export interface UserActivityRow {
  id: string;
  email: string | null;
  last_active_at: string | null;
}

export type Bucket =
  | "active_recently"
  | "warm"
  | "cool"
  | "cold"
  | "inactive_too_long"
  | "never_active";

export type Campaign =
  | "reengagement_7d"
  | "reengagement_14d"
  | "reengagement_30d";

const DAY_MS = 24 * 60 * 60 * 1000;

export const THRESHOLDS = {
  warmStartDays: 7,
  coolStartDays: 14,
  coldStartDays: 30,
  coldEndDays: 90,
} as const;

export function bucketFor(lastActiveAt: string | null, now: Date): Bucket {
  if (!lastActiveAt) return "never_active";

  const last = new Date(lastActiveAt).getTime();
  if (Number.isNaN(last)) return "never_active";

  const diffDays = (now.getTime() - last) / DAY_MS;

  if (diffDays < THRESHOLDS.warmStartDays) return "active_recently";
  if (diffDays < THRESHOLDS.coolStartDays) return "warm";
  if (diffDays < THRESHOLDS.coldStartDays) return "cool";
  if (diffDays < THRESHOLDS.coldEndDays) return "cold";
  return "inactive_too_long";
}

export function campaignFor(bucket: Bucket): Campaign | null {
  switch (bucket) {
    case "warm": return "reengagement_7d";
    case "cool": return "reengagement_14d";
    case "cold": return "reengagement_30d";
    default: return null;
  }
}

export interface CategorizedUsers {
  warm: UserActivityRow[];
  cool: UserActivityRow[];
  cold: UserActivityRow[];
  skipped: UserActivityRow[];
}

export function categorizeUsers(
  rows: UserActivityRow[],
  now: Date,
): CategorizedUsers {
  const out: CategorizedUsers = { warm: [], cool: [], cold: [], skipped: [] };
  for (const row of rows) {
    if (!row.email) {
      out.skipped.push(row);
      continue;
    }
    const bucket = bucketFor(row.last_active_at, now);
    if (bucket === "warm") out.warm.push(row);
    else if (bucket === "cool") out.cool.push(row);
    else if (bucket === "cold") out.cold.push(row);
    else out.skipped.push(row);
  }
  return out;
}

// ─── Layer 2 — behavior-based (A10 funnel) ────────────────────────────────

/**
 * Subscription/trial fields needed to decide a behavior bucket. All optional
 * so callers can pass through the joined subscription row even when a user
 * has no subscription record (free / trial-only users).
 */
export interface ReengagementUserRow extends UserActivityRow {
  trial_started_at: string | null;
  trial_ends_at: string | null;
  current_period_start_at: string | null;
  current_period_end_at: string | null;
  /** 'active' | 'past_due' | 'canceled' | 'trialing' | null */
  subscription_status: string | null;
  /** integer tier; 0 = free. */
  tier: number | null;
}

export type ReengagementBucket =
  | "active_then_silent"
  | "trial_completed_no_subscribe"
  | "post_subscribe_disengaged"
  | "almost_lapsed"
  | "skipped";

export type ReengagementCampaign =
  | "reengagement_active_then_silent"
  | "reengagement_trial_completed_d_plus_14"
  | "reengagement_post_subscribe_d_plus_7"
  | "reengagement_almost_lapsed"
  | "reengagement_added_something_new";

/**
 * One template/campaign per emailable bucket. The fifth campaign
 * (`added_something_new`) is a manual monthly broadcast and has no bucket.
 */
export const REENGAGEMENT_BUCKET_TO_CAMPAIGN: Record<
  Exclude<ReengagementBucket, "skipped">,
  ReengagementCampaign
> = {
  active_then_silent: "reengagement_active_then_silent",
  trial_completed_no_subscribe: "reengagement_trial_completed_d_plus_14",
  post_subscribe_disengaged: "reengagement_post_subscribe_d_plus_7",
  almost_lapsed: "reengagement_almost_lapsed",
};

export const REENGAGEMENT_THRESHOLDS = {
  /** active_then_silent: any activity within last 30 days, then 7+ silent. */
  silentDaysMin: 7,
  activityWindowDays: 30,
  /** trial_completed_no_subscribe: trial ended ≥ 14 days ago, no activity. */
  trialCompletedSilenceDays: 14,
  /** post_subscribe_disengaged: paid + 7+ days no activity. */
  paidSilenceDays: 7,
  /** almost_lapsed: paid period started ≥25 days ago AND low engagement. */
  almostLapsedDaysIntoPeriod: 25,
  /** "low engagement" = activity in last 30d under this many days. */
  almostLapsedActivityCeiling: 3,
} as const;

function daysBetween(from: string | null, now: Date): number | null {
  if (!from) return null;
  const t = new Date(from).getTime();
  if (Number.isNaN(t)) return null;
  return (now.getTime() - t) / DAY_MS;
}

function isPaidActive(user: ReengagementUserRow): boolean {
  // Treat tier > 0 OR explicit 'active'/'past_due' status as paid. 'past_due'
  // counts because the user is still a paying account whose card just failed
  // — exactly the cohort an "almost_lapsed" or "post_subscribe_disengaged"
  // nudge can save.
  if ((user.tier ?? 0) > 0) return true;
  const status = (user.subscription_status ?? "").toLowerCase();
  return status === "active" || status === "past_due";
}

function trialEndedAt(user: ReengagementUserRow): string | null {
  // Either explicit trial_ends_at, or fall back to current_period_end_at if
  // the row is in 'trialing' status (Stripe convention).
  if (user.trial_ends_at) return user.trial_ends_at;
  const status = (user.subscription_status ?? "").toLowerCase();
  if (status === "trialing") return user.current_period_end_at;
  return null;
}

/**
 * Optional recent-activity signal. If absent, the categorizer falls back to
 * `last_active_at` as a binary "any activity in window". Pass an explicit
 * count when you want the almost_lapsed engagement test to mean something.
 */
export interface RecentActivity {
  /** Distinct days with any activity in the last 30 days. */
  activeDaysLast30: number;
}

/**
 * Decide a single behavior bucket for one user. Returns "skipped" when the
 * user does not match any actionable cohort (or is missing an email).
 */
export function categorizeForReengagement(
  user: ReengagementUserRow,
  now: Date,
  activity?: RecentActivity,
): ReengagementBucket {
  if (!user.email) return "skipped";

  const T = REENGAGEMENT_THRESHOLDS;
  const sinceLastActive = daysBetween(user.last_active_at, now);
  const paid = isPaidActive(user);

  // 1. almost_lapsed — paid, deep into period, low engagement (renewal risk).
  //    Highest priority because the financial decision is about to be made.
  if (paid) {
    const daysIntoPeriod = daysBetween(user.current_period_start_at, now);
    const activeDays = activity?.activeDaysLast30 ?? null;
    if (
      daysIntoPeriod !== null &&
      daysIntoPeriod >= T.almostLapsedDaysIntoPeriod &&
      activeDays !== null &&
      activeDays < T.almostLapsedActivityCeiling
    ) {
      return "almost_lapsed";
    }
  }

  // 2. post_subscribe_disengaged — paid, silent for a week+.
  if (
    paid &&
    sinceLastActive !== null &&
    sinceLastActive >= T.paidSilenceDays
  ) {
    return "post_subscribe_disengaged";
  }

  // 3. trial_completed_no_subscribe — trial ended ≥14d ago, did not pay,
  //    has not returned. Skip if user is currently paid (handled above).
  const trialEnd = trialEndedAt(user);
  if (!paid && trialEnd) {
    const sinceTrialEnd = daysBetween(trialEnd, now);
    if (
      sinceTrialEnd !== null &&
      sinceTrialEnd >= T.trialCompletedSilenceDays &&
      sinceLastActive !== null &&
      sinceLastActive >= T.trialCompletedSilenceDays
    ) {
      return "trial_completed_no_subscribe";
    }
  }

  // 4. active_then_silent — had activity in the last 30 days but went quiet
  //    for 7+ days. Catches free users + lapsed-trial users who don't fit (3).
  if (
    sinceLastActive !== null &&
    sinceLastActive >= T.silentDaysMin &&
    sinceLastActive < T.activityWindowDays
  ) {
    return "active_then_silent";
  }

  return "skipped";
}

export function reengagementCampaignFor(
  bucket: ReengagementBucket,
): ReengagementCampaign | null {
  if (bucket === "skipped") return null;
  return REENGAGEMENT_BUCKET_TO_CAMPAIGN[bucket];
}

export interface CategorizedReengagement {
  active_then_silent: ReengagementUserRow[];
  trial_completed_no_subscribe: ReengagementUserRow[];
  post_subscribe_disengaged: ReengagementUserRow[];
  almost_lapsed: ReengagementUserRow[];
  skipped: ReengagementUserRow[];
}

export function categorizeUsersForReengagement(
  rows: ReengagementUserRow[],
  now: Date,
  activityByUser?: Map<string, RecentActivity>,
): CategorizedReengagement {
  const out: CategorizedReengagement = {
    active_then_silent: [],
    trial_completed_no_subscribe: [],
    post_subscribe_disengaged: [],
    almost_lapsed: [],
    skipped: [],
  };
  for (const row of rows) {
    const bucket = categorizeForReengagement(
      row,
      now,
      activityByUser?.get(row.id),
    );
    out[bucket].push(row);
  }
  return out;
}
