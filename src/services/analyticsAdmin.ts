/**
 * Admin analytics client — calls the four SECURITY DEFINER RPCs shipped
 * by 20260427000000_admin_analytics_views.sql. Every RPC is gated on
 * get_admin_level(auth.uid()) >= 9 server-side; a non-admin JWT gets a
 * 42501 error.
 */

import { supabase } from "@/lib/supabaseClient";

export type DauRow = {
  day: string;
  active_users: number;
};

export type FeatureUsageRow = {
  event_name: string;
  event_count: number;
  unique_users: number;
};

export type FunnelRow = {
  stage_order: number;
  stage: string;
  count: number;
  pct_of_signups: number;
};

export type RoomPopularityRow = {
  room_id: string;
  enrollments: number;
  completions: number;
  avg_progress_pct: number | null;
  last_activity_at: string | null;
};

export type HeadlineNumbers = {
  totalUsers: number;
  activeLast7d: number;
  activeLast30d: number;
  payingUsers: number;
};

async function rpc<T>(fn: string): Promise<T[]> {
  const { data, error } = await supabase.rpc(fn);
  if (error) throw error;
  return (data ?? []) as T[];
}

export function fetchDailyActiveUsers(): Promise<DauRow[]> {
  return rpc<DauRow>("analytics_daily_active_users");
}

export function fetchFeatureUsage7d(): Promise<FeatureUsageRow[]> {
  return rpc<FeatureUsageRow>("analytics_feature_usage_7d");
}

export function fetchUserFunnel(): Promise<FunnelRow[]> {
  return rpc<FunnelRow>("analytics_user_funnel");
}

export function fetchRoomPopularity(): Promise<RoomPopularityRow[]> {
  return rpc<RoomPopularityRow>("analytics_room_popularity");
}

/**
 * Headline numbers derived from the DAU + funnel rows the dashboard
 * already fetches, plus a hardcoded paying-user count per the brief
 * (wire to Stripe later).
 */
export function deriveHeadlineNumbers(
  dau: DauRow[],
  funnel: FunnelRow[],
  payingUsersHardcoded = 6,
): HeadlineNumbers {
  const totalUsers =
    funnel.find((f) => f.stage === "signed_up")?.count ?? 0;

  const byDay = [...dau].sort((a, b) => a.day.localeCompare(b.day));
  const last7 = byDay.slice(-7);
  const last30 = byDay;

  // "Active in last N days" = distinct-ish count. The DAU view returns
  // per-day totals, so sum/max isn't correct for distinct users across
  // days. Best approximation from the view alone is MAX (any day had at
  // least that many unique users). Documented in the UI.
  const activeLast7d = last7.reduce(
    (m, r) => Math.max(m, r.active_users),
    0,
  );
  const activeLast30d = last30.reduce(
    (m, r) => Math.max(m, r.active_users),
    0,
  );

  return {
    totalUsers,
    activeLast7d,
    activeLast30d,
    payingUsers: payingUsersHardcoded,
  };
}

/** Human-readable funnel labels. Keep bilingual pairs. */
export const FUNNEL_LABELS: Record<string, { en: string; vi: string }> = {
  signed_up:           { en: "Signed up",            vi: "Đã đăng ký" },
  took_placement:      { en: "Took placement",       vi: "Đã làm kiểm tra" },
  completed_room:      { en: "Completed a room",     vi: "Hoàn thành 1 phòng" },
  tried_pronunciation: { en: "Tried pronunciation",  vi: "Đã thử phát âm" },
  hit_day_7_streak:    { en: "Hit 7-day streak",     vi: "Đạt chuỗi 7 ngày" },
};
