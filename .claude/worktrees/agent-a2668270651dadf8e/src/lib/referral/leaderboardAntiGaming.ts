// src/lib/referral/leaderboardAntiGaming.ts
//
// Pure helpers that mirror the SQL anti-gaming logic in
// supabase/migrations/20260427000000_referral_leaderboard.sql:
//
//   - applyDailyCap()      mirrors the LEAST(5, count(*)) per (owner, day)
//                          aggregation used by both materialized views.
//   - findFlaggableOwners() mirrors flag_suspicious_referrers(): owners
//                          with 10+ referrals in any 1h window.
//
// Tested in isolation (no DB, no I/O) so we can prove the rules without
// booting the migration.

const DAILY_CAP_DEFAULT = 5;
const BURST_THRESHOLD_DEFAULT = 10;
const BURST_WINDOW_MS_DEFAULT = 60 * 60 * 1000; // 1h

export type SuccessfulRef = {
  ownerUserId: string;
  /** Conversion timestamp (ISO string OR Date OR ms). */
  convertedAt: string | Date | number;
};

/**
 * Cap each (owner, calendar-day) bucket at `cap` (default 5).
 * Returns the per-owner total across all days, summed.
 *
 * Day boundary is UTC (date_trunc('day', ts) in the SQL view).
 */
export function applyDailyCap(
  refs: SuccessfulRef[],
  cap: number = DAILY_CAP_DEFAULT,
): Map<string, number> {
  const perDay = new Map<string, number>(); // key: `${owner}|${day}` → count
  for (const r of refs) {
    const ts = toMs(r.convertedAt);
    if (ts === null) continue;
    const day = utcDayKey(ts);
    const key = `${r.ownerUserId}|${day}`;
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  const totals = new Map<string, number>();
  for (const [key, raw] of perDay) {
    const [owner] = key.split("|");
    if (!owner) continue;
    const capped = Math.min(cap, raw);
    totals.set(owner, (totals.get(owner) ?? 0) + capped);
  }
  return totals;
}

export type ReferralEvent = {
  ownerUserId: string;
  /** When the referral_uses row was inserted. */
  usedAt: string | Date | number;
};

/**
 * Find owners with `threshold` or more referrals within any sliding
 * `windowMs` window. Mirrors the SQL window function in
 * flag_suspicious_referrers().
 *
 * Returns a Set of owner ids that should be flagged.
 */
export function findFlaggableOwners(
  events: ReferralEvent[],
  threshold: number = BURST_THRESHOLD_DEFAULT,
  windowMs: number = BURST_WINDOW_MS_DEFAULT,
): Set<string> {
  // Group + sort per owner.
  const byOwner = new Map<string, number[]>();
  for (const e of events) {
    const ts = toMs(e.usedAt);
    if (ts === null) continue;
    const arr = byOwner.get(e.ownerUserId);
    if (arr) {
      arr.push(ts);
    } else {
      byOwner.set(e.ownerUserId, [ts]);
    }
  }

  const flagged = new Set<string>();
  for (const [owner, times] of byOwner) {
    times.sort((a, b) => a - b);
    let left = 0;
    for (let right = 0; right < times.length; right++) {
      while (times[right]! - times[left]! > windowMs) left++;
      const inWindow = right - left + 1;
      if (inWindow >= threshold) {
        flagged.add(owner);
        break;
      }
    }
  }
  return flagged;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function toMs(v: string | Date | number): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (v instanceof Date) {
    const ms = v.getTime();
    return Number.isFinite(ms) ? ms : null;
  }
  if (typeof v === "string") {
    const ms = Date.parse(v);
    return Number.isFinite(ms) ? ms : null;
  }
  return null;
}

function utcDayKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
