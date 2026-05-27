// src/lib/referral/leaderboardClient.ts
//
// Read-side client for the safe public monthly + all-time referral
// leaderboard projections. These physical tables intentionally omit raw
// auth/profile user IDs.

import { supabase } from "@/lib/supabaseClient";

export type MonthlyLeaderboardRow = {
  rank: number;
  display_name: string;
  total_referrals_this_month: number;
  successful_conversions: number;
  month_starts_on: string; // YYYY-MM-DD
};

export type AllTimeLeaderboardRow = {
  rank: number;
  display_name: string;
  total_referrals: number;
  total_premium_conversions: number;
  first_referral_date: string | null;
};

export type Period = "this_month" | "last_month" | "all_time";

/** Monday-anchored ISO date for the first day of the given month (UTC). */
export function monthStartIso(ref: Date = new Date()): string {
  const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1));
  return d.toISOString().slice(0, 10);
}

/** Same for the previous month. */
export function lastMonthStartIso(ref: Date = new Date()): string {
  const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - 1, 1));
  return d.toISOString().slice(0, 10);
}

/** Current month bucket as 'YYYY-MM'. Used by the recognition email. */
export function monthBucket(ref: Date = new Date()): string {
  const y = ref.getUTCFullYear();
  const m = ref.getUTCMonth() + 1;
  return `${y}-${m < 10 ? "0" : ""}${m}`;
}

type MonthlyResp = {
  data: MonthlyLeaderboardRow[] | null;
  error: { message: string } | null;
};
type AllTimeResp = {
  data: AllTimeLeaderboardRow[] | null;
  error: { message: string } | null;
};

export async function getMonthlyTop(
  monthStart: string,
  limit = 100,
): Promise<MonthlyLeaderboardRow[]> {
  const result = (await (supabase
    .from("referral_leaderboard_monthly_public") as unknown as {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          order: (
            col: string,
            opts: { ascending: boolean },
          ) => { limit: (n: number) => Promise<MonthlyResp> };
        };
      };
    })
    .select(
      "rank, display_name, total_referrals_this_month, successful_conversions, month_starts_on",
    )
    .eq("month_starts_on", monthStart)
    .order("rank", { ascending: true })
    .limit(Math.max(1, Math.min(500, Math.round(limit))))) as MonthlyResp;

  if (result.error || !Array.isArray(result.data)) return [];
  return result.data;
}

export async function getAllTimeTop(
  limit = 100,
): Promise<AllTimeLeaderboardRow[]> {
  const result = (await (supabase
    .from("referral_leaderboard_all_time_public") as unknown as {
      select: (cols: string) => {
        order: (
          col: string,
          opts: { ascending: boolean },
        ) => { limit: (n: number) => Promise<AllTimeResp> };
      };
    })
    .select(
      "rank, display_name, total_referrals, total_premium_conversions, first_referral_date",
    )
    .order("rank", { ascending: true })
    .limit(Math.max(1, Math.min(500, Math.round(limit))))) as AllTimeResp;

  if (result.error || !Array.isArray(result.data)) return [];
  return result.data;
}
