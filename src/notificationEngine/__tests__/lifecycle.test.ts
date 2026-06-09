import { beforeEach, describe, expect, it, vi } from "vitest";

import type { HabitSnapshot, NotificationPreferences } from "../types";

const prefs = (
  over: Partial<NotificationPreferences> = {},
): NotificationPreferences => ({
  dailyReminderEnabled: true,
  dailyReminderLocalTime: "19:30",
  streakSaveEnabled: true,
  timezone: "UTC",
  ...over,
});

const snap = (over: Partial<HabitSnapshot> = {}): HabitSnapshot => ({
  todayLocal: "2026-06-02",
  yesterdayLocal: "2026-06-01",
  timezone: "UTC",
  streakDays: 5,
  serverStreaksEnabled: true,
  serverLastStudiedDate: "2026-06-01",
  isAtRiskToday: true,
  dueCount: 0,
  nextScheduledAt: "2026-06-03T01:00:00Z",
  ...over,
});

const h = vi.hoisted(() => ({
  flags: { FEATURE_NOTIFICATIONS: true },
  userId: "u1" as string | null,
  permissionGranted: true,
  prefs: null as NotificationPreferences | null,
  snapshot: null as HabitSnapshot | null,
  loadPrefs: vi.fn(async (_userId: string) => h.prefs),
  buildSnapshot: vi.fn(async (_userId: string, _now?: Date) => h.snapshot),
  checkPermission: vi.fn(async () => h.permissionGranted),
  scheduleDaily: vi.fn(async (_args: unknown) => {}),
  scheduleOneShot: vi.fn(async (_args: unknown) => {}),
  cancel: vi.fn(async (_ids: number[]) => {}),
  addListener: vi.fn(async () => ({ remove: vi.fn(async () => {}) })),
}));

vi.mock("@/lib/featureFlags", () => ({ FEATURE_FLAGS: h.flags }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: async () => ({
        data: { user: h.userId ? { id: h.userId } : null },
      }),
    },
  },
}));

vi.mock("@capacitor/app", () => ({
  App: { addListener: h.addListener },
}));

vi.mock("../preferences", () => ({
  loadNotificationPreferences: h.loadPrefs,
}));

vi.mock("../readModel", () => ({
  buildHabitSnapshot: h.buildSnapshot,
}));

vi.mock("../permissions", () => ({
  checkNotificationPermission: h.checkPermission,
}));

vi.mock("../localScheduler", () => ({
  scheduleRepeatingDaily: h.scheduleDaily,
  scheduleOneShotLocal: h.scheduleOneShot,
  cancel: h.cancel,
}));

import {
  __resetLifecycleStateForTests,
  bootNotificationEngine,
  refreshNotificationSchedule,
  suppressStreakSaveForToday,
} from "../lifecycle";
import { NOTIFICATION_IDS } from "../types";

beforeEach(() => {
  h.flags.FEATURE_NOTIFICATIONS = true;
  h.userId = "u1";
  h.permissionGranted = true;
  h.prefs = prefs();
  h.snapshot = snap();
  h.loadPrefs.mockClear();
  h.buildSnapshot.mockClear();
  h.checkPermission.mockClear();
  h.scheduleDaily.mockClear();
  h.scheduleOneShot.mockClear();
  h.cancel.mockClear();
  h.addListener.mockClear();
  localStorage.clear();
  __resetLifecycleStateForTests();
});

describe("notification lifecycle", () => {
  it("no-ops when the feature flag is off", async () => {
    h.flags.FEATURE_NOTIFICATIONS = false;

    await refreshNotificationSchedule(new Date("2026-06-02T03:00:00Z"));
    await bootNotificationEngine();

    expect(h.checkPermission).not.toHaveBeenCalled();
    expect(h.loadPrefs).not.toHaveBeenCalled();
    expect(h.buildSnapshot).not.toHaveBeenCalled();
    expect(h.scheduleDaily).not.toHaveBeenCalled();
    expect(h.scheduleOneShot).not.toHaveBeenCalled();
    expect(h.cancel).not.toHaveBeenCalled();
    expect(h.addListener).not.toHaveBeenCalled();
  });

  it("does not prompt on refresh and cancels every channel when permission is denied", async () => {
    h.permissionGranted = false;

    await refreshNotificationSchedule(new Date("2026-06-02T03:00:00Z"));

    expect(h.checkPermission).toHaveBeenCalledTimes(1);
    expect(h.scheduleDaily).not.toHaveBeenCalled();
    expect(h.scheduleOneShot).not.toHaveBeenCalled();
    expect(h.cancel).toHaveBeenCalledWith([NOTIFICATION_IDS.daily_reminder]);
    expect(h.cancel).toHaveBeenCalledWith([NOTIFICATION_IDS.streak_save]);
    expect(h.cancel).toHaveBeenCalledWith([NOTIFICATION_IDS.due_review]);
  });

  it("dedupes identical scheduler operations across repeated refreshes", async () => {
    const now = new Date("2026-06-02T03:00:00");

    await refreshNotificationSchedule(now);
    await refreshNotificationSchedule(now);

    expect(h.scheduleDaily).toHaveBeenCalledTimes(1);
    expect(h.scheduleOneShot).toHaveBeenCalledTimes(2);

    h.prefs = prefs({ dailyReminderLocalTime: "21:45" });
    await refreshNotificationSchedule(now);

    expect(h.scheduleDaily).toHaveBeenCalledTimes(2);
    expect(h.scheduleOneShot).toHaveBeenCalledTimes(2);
  });

  it("keeps streak-save cancelled after today's first action even if server data is stale", async () => {
    const now = new Date("2026-06-02T03:00:00Z");
    suppressStreakSaveForToday(now);

    await refreshNotificationSchedule(now);

    expect(h.cancel).toHaveBeenCalledWith([NOTIFICATION_IDS.streak_save]);
    expect(h.scheduleOneShot).not.toHaveBeenCalledWith(
      expect.objectContaining({ id: NOTIFICATION_IDS.streak_save }),
    );
  });
});
