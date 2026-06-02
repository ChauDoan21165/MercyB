import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ data: null as Record<string, unknown> | null }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: h.data, error: null }),
        }),
      }),
    }),
  },
}));

import {
  loadNotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from "../preferences";

beforeEach(() => {
  h.data = null;
});

describe("preferences.loadNotificationPreferences", () => {
  it("falls back to defaults when there is no push_preferences row", async () => {
    h.data = null;
    const prefs = await loadNotificationPreferences("u1");
    expect(prefs).toEqual(DEFAULT_NOTIFICATION_PREFERENCES);
  });

  it("maps the push_preferences columns (and trims HH:MM:SS → HH:MM)", async () => {
    h.data = {
      daily_practice_enabled: true,
      daily_practice_local_time: "08:30:00",
      streak_grace_enabled: false,
      timezone: "Asia/Tokyo",
    };
    const prefs = await loadNotificationPreferences("u1");
    expect(prefs).toEqual({
      dailyReminderEnabled: true,
      dailyReminderLocalTime: "08:30",
      streakSaveEnabled: false,
      timezone: "Asia/Tokyo",
    });
  });
});
