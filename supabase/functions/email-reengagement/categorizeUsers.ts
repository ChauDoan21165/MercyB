/**
 * Pure categorization logic for re-engagement emails.
 *
 * Lives in its own file (no Deno imports) so vitest under Node can test it
 * without spinning up a Deno runtime. The edge function index.ts wraps this
 * with HTTP/Supabase glue.
 *
 * Buckets:
 *   - active_recently  : last seen < 7d  → skip (don't email)
 *   - warm             : 7d  ≤ x < 14d   → send 'reengagement_7d'
 *   - cool             : 14d ≤ x < 30d   → send 'reengagement_14d'
 *   - cold             : 30d ≤ x < 90d   → send 'reengagement_30d'
 *   - inactive_too_long: ≥ 90d           → skip (avoid spamming dead accounts)
 *   - never_active     : last_active_at is null → skip (no signal)
 *
 * Thresholds are intentionally absolute days in UTC. last_active_at is stored
 * as timestamptz so subtraction is timezone-safe; we do not consider local
 * timezone for bucket assignment (a user in UTC+7 vs UTC+0 lands in the same
 * bucket as long as their absolute time-since-last-seen matches).
 */

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

  // Future timestamps (clock skew, bad data) → treat as active.
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
