import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRpc = vi.fn();
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { rpc: (...args: unknown[]) => mockRpc(...args) },
}));

import {
  deriveHeadlineNumbers,
  fetchDailyActiveUsers,
  fetchFeatureUsage7d,
  fetchRoomPopularity,
  fetchUserFunnel,
  FUNNEL_LABELS,
} from "../analyticsAdmin";

beforeEach(() => mockRpc.mockReset());

describe("analyticsAdmin RPC callers", () => {
  it("fetchDailyActiveUsers calls analytics_daily_active_users", async () => {
    mockRpc.mockResolvedValueOnce({ data: [{ day: "2026-04-24", active_users: 5 }], error: null });
    const r = await fetchDailyActiveUsers();
    expect(mockRpc).toHaveBeenCalledWith("analytics_daily_active_users");
    expect(r).toEqual([{ day: "2026-04-24", active_users: 5 }]);
  });

  it("fetchFeatureUsage7d calls analytics_feature_usage_7d", async () => {
    mockRpc.mockResolvedValueOnce({ data: [], error: null });
    await fetchFeatureUsage7d();
    expect(mockRpc).toHaveBeenCalledWith("analytics_feature_usage_7d");
  });

  it("fetchUserFunnel calls analytics_user_funnel", async () => {
    mockRpc.mockResolvedValueOnce({ data: [], error: null });
    await fetchUserFunnel();
    expect(mockRpc).toHaveBeenCalledWith("analytics_user_funnel");
  });

  it("fetchRoomPopularity calls analytics_room_popularity", async () => {
    mockRpc.mockResolvedValueOnce({ data: [], error: null });
    await fetchRoomPopularity();
    expect(mockRpc).toHaveBeenCalledWith("analytics_room_popularity");
  });

  it("throws when the RPC returns an error (admin-gate rejection)", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: "admin access required", code: "42501" } });
    await expect(fetchDailyActiveUsers()).rejects.toEqual({
      message: "admin access required",
      code: "42501",
    });
  });

  it("returns [] when RPC returns null data", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: null });
    const r = await fetchFeatureUsage7d();
    expect(r).toEqual([]);
  });
});

describe("deriveHeadlineNumbers", () => {
  const dau = [
    { day: "2026-04-01", active_users: 2 },
    { day: "2026-04-10", active_users: 9 },
    { day: "2026-04-22", active_users: 4 },
    { day: "2026-04-23", active_users: 7 },
    { day: "2026-04-24", active_users: 11 },
  ];
  const funnel = [
    { stage_order: 1, stage: "signed_up", count: 115, pct_of_signups: 100.0 },
    { stage_order: 2, stage: "took_placement", count: 60, pct_of_signups: 52.2 },
    { stage_order: 3, stage: "completed_room", count: 30, pct_of_signups: 26.1 },
    { stage_order: 4, stage: "tried_pronunciation", count: 12, pct_of_signups: 10.4 },
    { stage_order: 5, stage: "hit_day_7_streak", count: 3, pct_of_signups: 2.6 },
  ];

  it("uses funnel's signed_up row as total users", () => {
    const kpi = deriveHeadlineNumbers(dau, funnel);
    expect(kpi.totalUsers).toBe(115);
  });

  it("peaks DAU across the last 7 and last 30 windows", () => {
    const kpi = deriveHeadlineNumbers(dau, funnel);
    // Sorted ascending, last 7 = entire dau set (only 5 entries). Max = 11.
    expect(kpi.activeLast7d).toBe(11);
    expect(kpi.activeLast30d).toBe(11);
  });

  it("defaults paying users to 6 per the brief", () => {
    const kpi = deriveHeadlineNumbers(dau, funnel);
    expect(kpi.payingUsers).toBe(6);
  });

  it("allows overriding paying users (future Stripe wiring)", () => {
    const kpi = deriveHeadlineNumbers(dau, funnel, 42);
    expect(kpi.payingUsers).toBe(42);
  });

  it("returns 0 totalUsers when funnel is empty", () => {
    const kpi = deriveHeadlineNumbers(dau, []);
    expect(kpi.totalUsers).toBe(0);
  });

  it("handles empty DAU arrays", () => {
    const kpi = deriveHeadlineNumbers([], funnel);
    expect(kpi.activeLast7d).toBe(0);
    expect(kpi.activeLast30d).toBe(0);
  });
});

describe("FUNNEL_LABELS", () => {
  it("covers every canonical stage name the view emits", () => {
    for (const stage of [
      "signed_up",
      "took_placement",
      "completed_room",
      "tried_pronunciation",
      "hit_day_7_streak",
    ]) {
      expect(FUNNEL_LABELS[stage]).toBeDefined();
      expect(FUNNEL_LABELS[stage].en.length).toBeGreaterThan(0);
      expect(FUNNEL_LABELS[stage].vi.length).toBeGreaterThan(0);
    }
  });
});
