// src/lib/xp/xpClient.ts
//
// XP read/write helpers backed by user_xp + daily_challenges (RLS = own row).
//
// awardXp uses the increment_user_xp RPC for an atomic update — required
// because a daily challenge completion can race with a streak bonus award
// and we don't want a lost-update on total_xp.
//
// getXpThisWeek sums daily_challenges.xp_awarded for the current ISO-ish
// week (Mon → Sun) so users can see "120 XP this week" without a date
// scan over user_xp.

import { supabase } from "@/lib/supabaseClient";

export type XpSource =
  | "lesson"
  | "challenge"
  | "streak"
  | "pronunciation";

type IncrementResponse = {
  data: number | null;
  error: { message: string } | null;
};

export type AwardXpResult =
  | { ok: true; total: number }
  | { ok: false; error: string };

export async function awardXp(
  userId: string,
  points: number,
  source: XpSource,
): Promise<AwardXpResult> {
  // userId / source are not consumed server-side (auth.uid() drives row
  // ownership; source is for future event-sourcing). Keeping the args
  // makes the call sites self-documenting and lets us add a real
  // xp_events table later without changing callers.
  void userId;
  void source;

  if (!Number.isFinite(points) || points <= 0) {
    return { ok: false, error: "points must be a positive number" };
  }

  const result = (await (supabase as unknown as {
    rpc: (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<IncrementResponse>;
  }).rpc("increment_user_xp", { p_points: Math.round(points) })) as IncrementResponse;

  if (result.error) {
    return { ok: false, error: result.error.message };
  }

  return { ok: true, total: typeof result.data === "number" ? result.data : 0 };
}

type GetXpRow = { total_xp: number | null } | null;

export async function getXp(userId: string): Promise<number> {
  const { data, error } = await (supabase
    .from("user_xp") as unknown as {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => Promise<{ data: GetXpRow; error: { message: string } | null }>;
        };
      };
    })
    .select("total_xp")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return 0;
  const total = data.total_xp;
  return typeof total === "number" ? total : 0;
}

/**
 * Returns the inclusive [Mon 00:00, Mon next 00:00) date pair for the
 * week containing `ref` in the user's local timezone. Exported for
 * tests; not part of the public API.
 */
export function weekRange(ref: Date): { startISO: string; endISO: string } {
  const start = new Date(ref);
  start.setHours(0, 0, 0, 0);
  // JS getDay: 0=Sun..6=Sat. Treat Monday as week start (matches the
  // streak day boundary in profiles.timezone-derived day math).
  const day = start.getDay();
  const offsetToMonday = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - offsetToMonday);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const toISODate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return { startISO: toISODate(start), endISO: toISODate(end) };
}

type WeeklyRow = { xp_awarded: number | null };
type WeeklyResponse = {
  data: WeeklyRow[] | null;
  error: { message: string } | null;
};

export async function getXpThisWeek(
  userId: string,
  now: Date = new Date(),
): Promise<number> {
  const { startISO, endISO } = weekRange(now);

  const result: WeeklyResponse = await (supabase
    .from("daily_challenges") as unknown as {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          gte: (col: string, val: string) => {
            lt: (col: string, val: string) => Promise<WeeklyResponse>;
          };
        };
      };
    })
    .select("xp_awarded")
    .eq("user_id", userId)
    .gte("date", startISO)
    .lt("date", endISO);

  if (result.error || !result.data) return 0;
  return result.data.reduce((sum, row) => {
    const v = row.xp_awarded;
    return sum + (typeof v === "number" ? v : 0);
  }, 0);
}
