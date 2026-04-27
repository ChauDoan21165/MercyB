// src/lib/admin/cohortRetention.ts
//
// Pure functions for cohort retention math. No Supabase calls — the
// aggregator edge function and the unit tests both rely on these
// helpers, so isolating the logic from I/O keeps the contract
// testable without spinning up a database.
//
// "Active" users are defined application-side. The aggregator passes
// us pre-fetched profile + activity rows; we group profiles by
// signup-week, count those who were active on each measured day-since-
// signup offset, and return one row per (week, offset) pair.
//
// Day offsets we report:
//   day 0 = signup day itself (always 100% by definition, but emitted
//           so the dashboard's first column is anchored)
//   day 1, 3, 7, 14, 30 = the canonical retention checkpoints
//
// Privacy: this module receives user IDs only as opaque strings, and
// the public functions return only aggregated counts — never IDs.

/** Standard retention checkpoints used across the dashboard + tests. */
export const RETENTION_DAY_OFFSETS = [0, 1, 3, 7, 14, 30] as const;
export type RetentionDayOffset = (typeof RETENTION_DAY_OFFSETS)[number];

export type Segment = "all" | "free" | "paid";

export interface ProfileRow {
  /** Stable user UUID; treated as opaque. */
  id: string;
  /** ISO timestamp of profile insert (signup). */
  created_at: string;
  /** Tier 0 (or null) = free; ≥1 = paid. The aggregator may omit for "all"-only runs. */
  tier?: number | null;
}

export interface ActivityRow {
  user_id: string;
  /** ISO timestamp at which the user was demonstrably active. */
  active_at: string;
}

export interface CohortBucketCount {
  cohortWeekStart: string; // YYYY-MM-DD (Monday, UTC)
  daysSinceSignup: RetentionDayOffset;
  activeUsers: number;
  totalUsers: number;
}

// ── Date utilities ────────────────────────────────────────────────────
// Everything is computed in UTC so cohort boundaries are deterministic
// regardless of where the function runs.

function startOfDayUtc(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );
}

/** Monday 00:00 UTC of the week containing `d`. */
export function startOfWeekUtc(d: Date): Date {
  const day = startOfDayUtc(d);
  const dow = day.getUTCDay(); // Sun=0…Sat=6
  const back = dow === 0 ? 6 : dow - 1;
  day.setUTCDate(day.getUTCDate() - back);
  return day;
}

function toIsoDate(d: Date): string {
  // YYYY-MM-DD (UTC).
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: Date, b: Date): number {
  const ms = startOfDayUtc(b).getTime() - startOfDayUtc(a).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

// ── Activity index ────────────────────────────────────────────────────

/**
 * Build a per-user set of UTC day strings on which the user was active
 * (at least one row in the supplied activity stream that day).
 *
 * Pass the union of every activity source you care about — speech
 * attempts, session-heartbeats, mercy chats, etc. — and the aggregator
 * will treat each as "active" for that day. Order doesn't matter.
 */
export function buildActivityIndex(
  rows: ReadonlyArray<ActivityRow>,
): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  for (const r of rows) {
    if (!r.user_id || !r.active_at) continue;
    const day = r.active_at.slice(0, 10);
    if (!day) continue;
    let set = out.get(r.user_id);
    if (!set) {
      set = new Set<string>();
      out.set(r.user_id, set);
    }
    set.add(day);
  }
  return out;
}

// ── Cohort grouping ───────────────────────────────────────────────────

/**
 * Group profiles by signup week. Returns a Map keyed on
 * `cohortWeekStart` (YYYY-MM-DD, Monday UTC) → array of profiles in
 * that cohort. Profiles with unparseable created_at timestamps are
 * skipped — they would otherwise pollute every cohort with a
 * 1970-01-01 bucket.
 */
export function groupProfilesByWeek(
  profiles: ReadonlyArray<ProfileRow>,
): Map<string, ProfileRow[]> {
  const out = new Map<string, ProfileRow[]>();
  for (const p of profiles) {
    const t = new Date(p.created_at);
    if (!Number.isFinite(t.getTime())) continue;
    const week = toIsoDate(startOfWeekUtc(t));
    let bucket = out.get(week);
    if (!bucket) {
      bucket = [];
      out.set(week, bucket);
    }
    bucket.push(p);
  }
  return out;
}

// ── Segmentation ──────────────────────────────────────────────────────

export function filterBySegment(
  profiles: ReadonlyArray<ProfileRow>,
  segment: Segment,
): ProfileRow[] {
  if (segment === "all") return [...profiles];
  if (segment === "paid") {
    return profiles.filter((p) => (p.tier ?? 0) > 0);
  }
  return profiles.filter((p) => (p.tier ?? 0) <= 0);
}

// ── Retention computation ────────────────────────────────────────────

/**
 * Given one cohort (the profiles that signed up in a given week) plus
 * the activity index, compute the active+total counts at each day-
 * since-signup offset.
 *
 * "Active at day N" means: the user has at least one activity row
 * dated on the calendar day exactly N days after their own signup
 * day. Day 0 is the signup day.
 *
 * If `now` is supplied, offsets that have not yet elapsed for a given
 * user are treated as `unobserved`: they count toward total_users
 * only if every member of the cohort has had at least N days to
 * accumulate activity. The dashboard surfaces the unobserved cells
 * separately (or hides them).
 */
export function computeCohortRetention(
  cohort: ReadonlyArray<ProfileRow>,
  activityIndex: ReadonlyMap<string, ReadonlySet<string>>,
  now: Date = new Date(),
): CohortBucketCount[] {
  if (cohort.length === 0) return [];

  // Cohort label = the Monday of the signup-week of the first member;
  // they're already grouped by the caller, so any member works.
  const label = toIsoDate(startOfWeekUtc(new Date(cohort[0].created_at)));

  const out: CohortBucketCount[] = [];
  for (const offset of RETENTION_DAY_OFFSETS) {
    let active = 0;
    let total = 0;
    for (const p of cohort) {
      const signup = new Date(p.created_at);
      if (!Number.isFinite(signup.getTime())) continue;
      const daysOld = daysBetween(signup, now);
      if (daysOld < offset) continue; // not enough time has passed
      total += 1;

      const target = new Date(signup);
      target.setUTCDate(target.getUTCDate() + offset);
      const targetDay = toIsoDate(target);

      const days = activityIndex.get(p.id);
      if (days && days.has(targetDay)) active += 1;
    }
    out.push({
      cohortWeekStart: label,
      daysSinceSignup: offset,
      activeUsers: active,
      totalUsers: total,
    });
  }
  return out;
}

/**
 * Top-level convenience: takes ALL profiles + activity, segments,
 * groups by cohort, and emits the full triangle.
 */
export function buildRetentionTriangle(input: {
  profiles: ReadonlyArray<ProfileRow>;
  activity: ReadonlyArray<ActivityRow>;
  segment: Segment;
  now?: Date;
}): CohortBucketCount[] {
  const filtered = filterBySegment(input.profiles, input.segment);
  const cohorts = groupProfilesByWeek(filtered);
  const activityIndex = buildActivityIndex(input.activity);
  const out: CohortBucketCount[] = [];
  for (const [, members] of cohorts) {
    out.push(...computeCohortRetention(members, activityIndex, input.now));
  }
  out.sort((a, b) => {
    if (a.cohortWeekStart < b.cohortWeekStart) return 1;
    if (a.cohortWeekStart > b.cohortWeekStart) return -1;
    return a.daysSinceSignup - b.daysSinceSignup;
  });
  return out;
}

// ── Cell-colour helper for the triangle table ────────────────────────

export type RetentionTier = "red" | "yellow" | "green" | "n/a";

export function classifyRetention(
  activeUsers: number,
  totalUsers: number,
): { ratio: number | null; tier: RetentionTier } {
  if (totalUsers <= 0) return { ratio: null, tier: "n/a" };
  const ratio = activeUsers / totalUsers;
  let tier: RetentionTier = "yellow";
  if (ratio < 0.2) tier = "red";
  else if (ratio >= 0.5) tier = "green";
  return { ratio, tier };
}
