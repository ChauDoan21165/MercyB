import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const { adminState, flagState, rpcResults } = vi.hoisted(() => ({
  adminState: { level: 9, loading: false } as { level: number; loading: boolean },
  flagState: { enabled: true, loading: false } as { enabled: boolean; loading: boolean },
  rpcResults: {
    analytics_daily_active_users: [{ day: "2026-04-23", active_users: 7 }, { day: "2026-04-24", active_users: 11 }],
    analytics_feature_usage_7d:   [{ event_name: "room_pronunciation_practice_opened", event_count: 42, unique_users: 12 }],
    analytics_user_funnel:        [
      { stage_order: 1, stage: "signed_up", count: 115, pct_of_signups: 100 },
      { stage_order: 2, stage: "took_placement", count: 60, pct_of_signups: 52.2 },
      { stage_order: 3, stage: "completed_room", count: 30, pct_of_signups: 26.1 },
      { stage_order: 4, stage: "tried_pronunciation", count: 12, pct_of_signups: 10.4 },
      { stage_order: 5, stage: "hit_day_7_streak", count: 3, pct_of_signups: 2.6 },
    ],
    analytics_room_popularity:    [
      { room_id: "english_a1_a107", enrollments: 30, completions: 12, avg_progress_pct: 48.5, last_activity_at: "2026-04-24T10:00:00Z" },
      { room_id: "master_english_high_efficiency_vip3", enrollments: 50, completions: 5, avg_progress_pct: 22.1, last_activity_at: "2026-04-22T10:00:00Z" },
    ],
  } as Record<string, unknown[]>,
}));

vi.mock("@/hooks/admin/useAdminAccess", () => ({
  useAdminAccess: () => ({
    loading: adminState.loading,
    permissions: {
      level: adminState.level,
      isAdmin: adminState.level > 0,
      isAdminMaster: adminState.level >= 10,
      canViewAdmin: adminState.level > 0,
      canManageUsers: adminState.level >= 3,
      canManageContent: adminState.level >= 5,
      canManagePayments: adminState.level >= 7,
      canManageAdmins: adminState.level >= 8,
      canEditSystem: adminState.level >= 9,
    },
    userId: "test-user",
    email: "admin@test",
    error: null,
    refresh: async () => {},
  }),
}));
vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => ({ enabled: flagState.enabled, loading: flagState.loading }),
}));
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    rpc: (name: string) =>
      Promise.resolve({ data: rpcResults[name] ?? [], error: null }),
  },
}));

// Recharts renders tries to measure DOM; mock to a passthrough.
vi.mock("recharts", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 400, height: 200 }}>{children}</div>
    ),
  };
});

import AdminAnalyticsPage from "../AdminAnalyticsPage";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/admin/analytics"]}>
      <Routes>
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/" element={<div data-testid="home-route" />} />
        <Route path="/admin" element={<div data-testid="admin-root-route" />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  cleanup();
  adminState.level = 9;
  adminState.loading = false;
  flagState.enabled = true;
  flagState.loading = false;
});

describe("AdminAnalyticsPage — gating", () => {
  it("renders when admin level is 9 and flag is on", async () => {
    renderPage();
    await waitFor(() => expect(screen.getByTestId("admin-analytics-page")).toBeDefined());
  });

  it("redirects non-admin (level < 9) to /", async () => {
    adminState.level = 0;
    renderPage();
    await waitFor(() => expect(screen.getByTestId("home-route")).toBeDefined());
    expect(screen.queryByTestId("admin-analytics-page")).toBeNull();
  });

  it("redirects level 8 admin to / (level 9+ required)", async () => {
    adminState.level = 8;
    renderPage();
    await waitFor(() => expect(screen.getByTestId("home-route")).toBeDefined());
  });

  it("renders for level 10 master admin", async () => {
    adminState.level = 10;
    renderPage();
    await waitFor(() => expect(screen.getByTestId("admin-analytics-page")).toBeDefined());
  });

  it("redirects to /admin when the feature flag is off", async () => {
    flagState.enabled = false;
    renderPage();
    await waitFor(() => expect(screen.getByTestId("admin-root-route")).toBeDefined());
  });

  it("shows a loading state while admin check is pending", () => {
    adminState.loading = true;
    renderPage();
    expect(screen.getByText("Loading…")).toBeDefined();
  });
});

describe("AdminAnalyticsPage — data render", () => {
  it("renders KPI cards derived from funnel + DAU", async () => {
    renderPage();
    await waitFor(() => expect(screen.getByTestId("kpi-total-users").textContent).toBe("115"));
    expect(screen.getByTestId("kpi-active-7d").textContent).toBe("11");
    expect(screen.getByTestId("kpi-active-30d").textContent).toBe("11");
    expect(screen.getByTestId("kpi-paying-users").textContent).toBe("6");
  });

  it("renders the feature-usage table with all events", async () => {
    renderPage();
    await waitFor(() => {
      const table = screen.getByTestId("features-table");
      expect(table.textContent).toContain("room_pronunciation_practice_opened");
      expect(table.textContent).toContain("42");
    });
  });

  it("renders the funnel rows with bilingual labels + percentages", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId("funnel-row-signed_up")).toBeDefined();
      expect(screen.getByTestId("funnel-row-took_placement").textContent).toContain("52.2%");
      expect(screen.getByTestId("funnel-row-hit_day_7_streak").textContent).toContain("Hit 7-day streak");
      expect(screen.getByTestId("funnel-row-hit_day_7_streak").textContent).toContain("Đạt chuỗi 7 ngày");
    });
  });

  it("renders the rooms table", async () => {
    renderPage();
    await waitFor(() => {
      const table = screen.getByTestId("rooms-table");
      expect(table.textContent).toContain("english_a1_a107");
      expect(table.textContent).toContain("master_english_high_efficiency_vip3");
    });
  });
});

describe("AdminAnalyticsPage — rooms table sort", () => {
  it("defaults to enrollments desc — higher-enrollment room shows first", async () => {
    renderPage();
    await waitFor(() => {
      const rows = document.querySelectorAll("[data-testid='rooms-table'] tbody tr");
      expect(rows[0]?.textContent).toContain("master_english_high_efficiency_vip3");
    });
  });

  it("clicking the avg_progress_pct header re-sorts by that column", async () => {
    renderPage();
    await waitFor(() => screen.getByTestId("rooms-table"));

    // One click → sort by avg_progress_pct desc. Higher avg (48.5) comes first.
    fireEvent.click(screen.getByTestId("room-sort-avg_progress_pct"));
    await waitFor(() => {
      const rows = document.querySelectorAll("[data-testid='rooms-table'] tbody tr");
      expect(rows[0]?.textContent).toContain("english_a1_a107");
    });

    // Second click → flip to asc. Lower avg (22.1) comes first.
    fireEvent.click(screen.getByTestId("room-sort-avg_progress_pct"));
    await waitFor(() => {
      const rows = document.querySelectorAll("[data-testid='rooms-table'] tbody tr");
      expect(rows[0]?.textContent).toContain("master_english_high_efficiency_vip3");
    });
  });

  it("sort-by-room_id clicks cycle through string sort", async () => {
    renderPage();
    await waitFor(() => screen.getByTestId("rooms-table"));
    fireEvent.click(screen.getByTestId("room-sort-room_id"));
    await waitFor(() => {
      const rows = document.querySelectorAll("[data-testid='rooms-table'] tbody tr");
      // desc string sort: master_english... comes before english_a1...
      expect(rows[0]?.textContent).toContain("master_english_high_efficiency_vip3");
    });
  });
});
