import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  emitFeatureOutcome: vi.fn(async () => {}),
}));

vi.mock("@/lib/analytics", () => ({
  emitFeatureOutcome: h.emitFeatureOutcome,
}));

import { recordActiveDay } from "@/lib/retention/recordActiveDay";
import {
  computeNewStreakState,
  type StreakState,
} from "@/lib/streakMath";
import { planAll } from "@/notificationEngine/lifecycle";
import { NOTIFICATION_IDS } from "@/notificationEngine/types";
import type {
  HabitSnapshot,
  NotificationPreferences,
} from "@/notificationEngine/types";

const flushMicrotasks = () => Promise.resolve();

const prefs: NotificationPreferences = {
  dailyReminderEnabled: true,
  dailyReminderLocalTime: "19:30",
  streakSaveEnabled: true,
  timezone: "America/Edmonton",
};

function applyStudyDay(
  state: StreakState,
  todayLocal: string,
): StreakState {
  recordActiveDay();
  const result = computeNewStreakState(state, todayLocal);
  return "next" in result ? result.next : state;
}

describe("retention-loop E2E — returning learner across local-day boundary", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    h.emitFeatureOutcome.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("increments streak once, records one deduped retention outcome, and keeps notification scheduling dark", async () => {
    let streak: StreakState = {
      current: 7,
      longest: 9,
      lastStudiedDate: "2026-06-01",
    };

    vi.setSystemTime(new Date(2026, 5, 1, 23, 55, 0));
    streak = applyStudyDay(streak, "2026-06-01");
    await flushMicrotasks();

    expect(streak).toEqual({
      current: 7,
      longest: 9,
      lastStudiedDate: "2026-06-01",
    });
    expect(h.emitFeatureOutcome).toHaveBeenCalledTimes(1);
    expect(h.emitFeatureOutcome).toHaveBeenLastCalledWith(
      "retention_loop",
      "completed",
      { local_day: "2026-06-01" },
    );

    h.emitFeatureOutcome.mockClear();

    vi.setSystemTime(new Date(2026, 5, 2, 0, 5, 0));
    streak = applyStudyDay(streak, "2026-06-02");
    streak = applyStudyDay(streak, "2026-06-02");
    await flushMicrotasks();

    expect(streak).toEqual({
      current: 8,
      longest: 9,
      lastStudiedDate: "2026-06-02",
    });
    expect(h.emitFeatureOutcome).toHaveBeenCalledTimes(1);
    expect(h.emitFeatureOutcome).toHaveBeenCalledWith(
      "retention_loop",
      "completed",
      { local_day: "2026-06-02" },
    );

    const snapshot: HabitSnapshot = {
      todayLocal: "2026-06-02",
      yesterdayLocal: "2026-06-01",
      timezone: "America/Edmonton",
      streakDays: streak.current,
      serverStreaksEnabled: true,
      serverLastStudiedDate: streak.lastStudiedDate,
      isAtRiskToday: false,
      dueCount: 4,
      nextScheduledAt: null,
    };

    const FEATURE_NOTIFICATIONS = false;
    const permissionGranted = true;
    const decisions = planAll(
      snapshot,
      prefs,
      permissionGranted,
      FEATURE_NOTIFICATIONS,
      new Date(2026, 5, 2, 0, 10, 0),
    );

    expect(decisions).toEqual([
      { kind: "cancel", id: NOTIFICATION_IDS.daily_reminder },
      { kind: "cancel", id: NOTIFICATION_IDS.streak_save },
      { kind: "cancel", id: NOTIFICATION_IDS.due_review },
    ]);
    expect(decisions.some((decision) => decision.kind !== "cancel")).toBe(false);
  });
});
