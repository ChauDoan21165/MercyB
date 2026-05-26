// supabase/functions/_shared/cohortRetentionMath.ts
//
// Deno-side mirror of the pure cohort-math helpers from
// src/lib/admin/cohortRetention.ts. The edge function (Deno) and the
// browser bundle (Node/Vite) cannot share a TS path-alias import, so
// this file holds the canonical Deno copy. Tests in
// src/lib/admin/__tests__/cohortRetention.test.ts cover the same
// behaviour against the browser-side copy; if you change one, mirror
// the change here.
//
// Keep them byte-equivalent on the algorithmic level — the test suite
// in __tests__/cohortRetentionMath.test.ts (Deno) re-exercises the
// invariants on this file directly so drift is caught.

export const RETENTION_DAY_OFFSETS = [0, 1, 3, 7, 14, 30] as const;
export type RetentionDayOffset = (typeof RETENTION_DAY_OFFSETS)[number];

export type Segment = "all" | "free" | "paid";

export interface ProfileRow {
  id: string;
  created_at: string;
  tier?: number | null;
}

export interface ActivityRow {
  user_id: string;
  active_at: string;
}

export interface CohortBucketCount {
  cohortWeekStart: string;
  daysSinceSignup: RetentionDayOffset;
  activeUsers: number;
  totalUsers: number;
}

function startOfDayUtc(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );
}

export function startOfWeekUtc(d: Date): Date {
  const day = startOfDayUtc(d);
  const dow = day.getUTCDay();
  const back = dow === 0 ? 6 : dow - 1;
  day.setUTCDate(day.getUTCDate() - back);
  return day;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: Date, b: Date): number {
  const ms = startOfDayUtc(b).getTime() - startOfDayUtc(a).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

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

export function computeCohortRetention(
  cohort: ReadonlyArray<ProfileRow>,
  activityIndex: ReadonlyMap<string, ReadonlySet<string>>,
  now: Date = new Date(),
): CohortBucketCount[] {
  if (cohort.length === 0) return [];
  const label = toIsoDate(startOfWeekUtc(new Date(cohort[0].created_at)));
  const out: CohortBucketCount[] = [];
  for (const offset of RETENTION_DAY_OFFSETS) {
    let active = 0;
    let total = 0;
    for (const p of cohort) {
      const signup = new Date(p.created_at);
      if (!Number.isFinite(signup.getTime())) continue;
      const daysOld = daysBetween(signup, now);
      if (daysOld < offset) continue;
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
