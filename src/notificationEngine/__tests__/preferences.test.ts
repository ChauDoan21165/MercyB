import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  data: null as Record<string, unknown> | null,
  error: null as { message: string } | null,
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: h.data, error: h.error }),
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
  h.error = null;
});

describe("preferences.loadNotificationPreferences — error surfacing (WP-H8)", () => {
  it("surfaces a Supabase load error (does not silently swallow) and still returns defaults", async () => {
    h.data = null;
    h.error = { message: "connection reset" };
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const prefs = await loadNotificationPreferences("u1");
      // Safe fallback preserved…
      expect(prefs).toEqual(DEFAULT_NOTIFICATION_PREFERENCES);
      // …but the failure is now observable, not swallowed.
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0].join(" ")).toMatch(/loadNotificationPreferences failed/i);
    } finally {
      warn.mockRestore();
    }
  });

  it("does not warn on the happy path (no error)", async () => {
    h.data = null;
    h.error = null;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      await loadNotificationPreferences("u1");
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
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
