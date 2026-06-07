// src/notificationEngine/__tests__/refreshSchedule.test.ts
//
// ON-path flip-safety for the notification engine ORCHESTRATOR. The planners
// are unit-tested in planner.test.ts; this locks how refreshNotificationSchedule
// wires them to the adapter — the behaviour that must be correct the instant
// FEATURE_NOTIFICATIONS flips on:
//
//   - feature OFF / no user → total no-op (no permission read, no adapter call).
//   - permission NOT granted → idempotent TEARDOWN: every channel cancelled,
//     nothing scheduled. (refresh/boot must NEVER prompt — it only ever
//     *checks* permission; the prompt lives solely in onFirstCompletedActivity.)
//   - permission granted → schedules exactly the planned channels.
//   - re-running the refresh reuses the same notification ids (replace, not
//     duplicate) → safe to call on every foreground/background pass.

import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  flags: { FEATURE_NOTIFICATIONS: true as boolean },
  getUser: vi.fn(async () => ({ data: { user: { id: "u1" } as { id: string } | null } })),
  checkPermission: vi.fn(async () => true),
  loadPrefs: vi.fn(async () => ({
    dailyReminderEnabled: true,
    dailyReminderLocalTime: "19:30",
    streakSaveEnabled: true,
    timezone: "Asia/Ho_Chi_Minh",
  })),
  buildSnapshot: vi.fn(async () => ({
    todayLocal: "2026-06-02",
    yesterdayLocal: "2026-06-01",
    timezone: "Asia/Ho_Chi_Minh",
    streakDays: 5,
    serverStreaksEnabled: true,
    serverLastStudiedDate: "2026-06-01",
    isAtRiskToday: true,
    dueCount: 3,
    nextScheduledAt: null,
  })),
  scheduleDaily: vi.fn(async (..._a: unknown[]) => {}),
  scheduleOneShot: vi.fn(async (..._a: unknown[]) => {}),
  cancel: vi.fn(async (..._a: unknown[]) => {}),
}));

vi.mock("@capacitor/app", () => ({ App: { addListener: vi.fn(async () => ({ remove: vi.fn() })) } }));
vi.mock("@/lib/featureFlags", () => ({ FEATURE_FLAGS: h.flags }));
vi.mock("@/lib/supabaseClient", () => ({ supabase: { auth: { getUser: h.getUser } } }));
vi.mock("../permissions", () => ({ checkNotificationPermission: h.checkPermission }));
vi.mock("../preferences", () => ({ loadNotificationPreferences: h.loadPrefs }));
vi.mock("../readModel", () => ({ buildHabitSnapshot: h.buildSnapshot }));
vi.mock("../localScheduler", () => ({
  scheduleRepeatingDaily: h.scheduleDaily,
  scheduleOneShotLocal: h.scheduleOneShot,
  cancel: h.cancel,
}));

import { refreshNotificationSchedule, planAll } from "../lifecycle";
import { NOTIFICATION_IDS } from "../types";
import type { HabitSnapshot, NotificationPreferences } from "../types";

const NOW = new Date("2026-06-02T03:00:00Z");

function allMockClear() {
  for (const fn of [
    h.getUser, h.checkPermission, h.loadPrefs, h.buildSnapshot,
    h.scheduleDaily, h.scheduleOneShot, h.cancel,
  ]) fn.mockClear();
}

beforeEach(() => {
  h.flags.FEATURE_NOTIFICATIONS = true;
  h.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
  h.checkPermission.mockResolvedValue(true);
  allMockClear();
});

describe("refreshNotificationSchedule — gate before any work", () => {
  it("is a total no-op when the feature is OFF", async () => {
    h.flags.FEATURE_NOTIFICATIONS = false;
    await refreshNotificationSchedule(NOW);
    expect(h.getUser).not.toHaveBeenCalled();
    expect(h.checkPermission).not.toHaveBeenCalled();
    expect(h.scheduleDaily).not.toHaveBeenCalled();
    expect(h.scheduleOneShot).not.toHaveBeenCalled();
    expect(h.cancel).not.toHaveBeenCalled();
  });

  it("no-ops for a signed-out user (no permission read, no adapter call)", async () => {
    h.getUser.mockResolvedValue({ data: { user: null } });
    await refreshNotificationSchedule(NOW);
    expect(h.checkPermission).toHaveBeenCalledTimes(0);
    expect(h.scheduleDaily).not.toHaveBeenCalled();
    expect(h.cancel).not.toHaveBeenCalled();
  });
});

describe("refreshNotificationSchedule — permission gating (never prompts)", () => {
  it("permission NOT granted → cancels every channel, schedules nothing", async () => {
    h.checkPermission.mockResolvedValue(false);
    await refreshNotificationSchedule(NOW);

    expect(h.scheduleDaily).not.toHaveBeenCalled();
    expect(h.scheduleOneShot).not.toHaveBeenCalled();
    const cancelledIds = h.cancel.mock.calls.flatMap((c) => c[0] as number[]);
    expect(cancelledIds).toEqual(
      expect.arrayContaining([
        NOTIFICATION_IDS.daily_reminder,
        NOTIFICATION_IDS.streak_save,
        NOTIFICATION_IDS.due_review,
      ]),
    );
  });

  it("only ever CHECKS permission — the refresh path holds no prompt", async () => {
    // checkNotificationPermission is the sole permission call; the prompt
    // (requestNotificationPermissionOnce) is not even wired into this path.
    await refreshNotificationSchedule(NOW);
    expect(h.checkPermission).toHaveBeenCalledTimes(1);
  });
});

describe("refreshNotificationSchedule — granted: schedules the planned channels", () => {
  it("schedules the daily reminder + at-risk streak-save + due-review", async () => {
    await refreshNotificationSchedule(NOW);

    expect(h.scheduleDaily).toHaveBeenCalledTimes(1);
    expect(h.scheduleDaily.mock.calls[0][0]).toMatchObject({
      id: NOTIFICATION_IDS.daily_reminder,
      hour: 19,
      minute: 30,
    });

    const oneShotIds = h.scheduleOneShot.mock.calls.map((c) => (c[0] as { id: number }).id);
    expect(oneShotIds).toContain(NOTIFICATION_IDS.streak_save);
    expect(oneShotIds).toContain(NOTIFICATION_IDS.due_review);
  });

  it("cancels the streak-save (not schedule) when the streak is not at risk", async () => {
    h.buildSnapshot.mockResolvedValue({
      todayLocal: "2026-06-02", yesterdayLocal: "2026-06-01", timezone: "Asia/Ho_Chi_Minh",
      streakDays: 5, serverStreaksEnabled: true, serverLastStudiedDate: "2026-06-02",
      isAtRiskToday: false, dueCount: 0, nextScheduledAt: null,
    });
    await refreshNotificationSchedule(NOW);
    const oneShotIds = h.scheduleOneShot.mock.calls.map((c) => (c[0] as { id: number }).id);
    expect(oneShotIds).not.toContain(NOTIFICATION_IDS.streak_save);
    const cancelledIds = h.cancel.mock.calls.flatMap((c) => c[0] as number[]);
    expect(cancelledIds).toContain(NOTIFICATION_IDS.streak_save);
  });

  it("is idempotent across passes — reuses the same ids (replace, never duplicate)", async () => {
    await refreshNotificationSchedule(NOW);
    const firstDailyId = (h.scheduleDaily.mock.calls[0][0] as { id: number }).id;
    allMockClear();

    await refreshNotificationSchedule(NOW);
    expect(h.scheduleDaily).toHaveBeenCalledTimes(1);
    expect((h.scheduleDaily.mock.calls[0][0] as { id: number }).id).toBe(firstDailyId);
  });
});

describe("planAll — composes the three channels in a stable order", () => {
  const prefs: NotificationPreferences = {
    dailyReminderEnabled: true,
    dailyReminderLocalTime: "19:30",
    streakSaveEnabled: true,
    timezone: "Asia/Ho_Chi_Minh",
  };
  const snapshot: HabitSnapshot = {
    todayLocal: "2026-06-02", yesterdayLocal: "2026-06-01", timezone: "Asia/Ho_Chi_Minh",
    streakDays: 5, serverStreaksEnabled: true, serverLastStudiedDate: "2026-06-01",
    isAtRiskToday: true, dueCount: 2, nextScheduledAt: null,
  };

  it("returns [daily_reminder, streak_save, due_review]", () => {
    const out = planAll(snapshot, prefs, true, true, NOW);
    expect(out.map((d) => d.id)).toEqual([
      NOTIFICATION_IDS.daily_reminder,
      NOTIFICATION_IDS.streak_save,
      NOTIFICATION_IDS.due_review,
    ]);
  });

  it("with the feature off, every channel resolves to cancel", () => {
    const out = planAll(snapshot, prefs, true, false, NOW);
    expect(out.every((d) => d.kind === "cancel")).toBe(true);
  });
});
