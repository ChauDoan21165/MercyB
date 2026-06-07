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

function applyReturnAction(
  state: StreakState,
  todayLocal: string,
): StreakState {
  recordActiveDay();
  const result = computeNewStreakState(state, todayLocal);
  return "next" in result ? result.next : state;
}

describe("retention-loop E2E — lapsed learner recovery", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    h.emitFeatureOutcome.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("would send re-engagement while dark, then records one return and starts a new streak", async () => {
    let streak: StreakState = {
      current: 5,
      longest: 12,
      lastStudiedDate: "2026-06-01",
    };

    const atRiskBeforeBreak: HabitSnapshot = {
      todayLocal: "2026-06-02",
      yesterdayLocal: "2026-06-01",
      timezone: "America/Edmonton",
      streakDays: streak.current,
      serverStreaksEnabled: true,
      serverLastStudiedDate: streak.lastStudiedDate,
      isAtRiskToday: true,
      dueCount: 0,
      nextScheduledAt: null,
    };

    const permissionGranted = true;
    const reengagementDecision = planAll(
      atRiskBeforeBreak,
      prefs,
      permissionGranted,
      true,
      new Date(2026, 5, 2, 9, 0, 0),
    ).find((decision) => decision.id === NOTIFICATION_IDS.streak_save);

    expect(reengagementDecision).toMatchObject({
      kind: "scheduleOneShot",
      id: NOTIFICATION_IDS.streak_save,
    });
    if (reengagementDecision?.kind === "scheduleOneShot") {
      expect(reengagementDecision.at.getHours()).toBe(20);
      expect(reengagementDecision.title).toContain("5");
    }

    const FEATURE_NOTIFICATIONS = false;
    const darkDecisions = planAll(
      atRiskBeforeBreak,
      prefs,
      permissionGranted,
      FEATURE_NOTIFICATIONS,
      new Date(2026, 5, 2, 9, 0, 0),
    );
    expect(darkDecisions).toEqual([
      { kind: "cancel", id: NOTIFICATION_IDS.daily_reminder },
      { kind: "cancel", id: NOTIFICATION_IDS.streak_save },
      { kind: "cancel", id: NOTIFICATION_IDS.due_review },
    ]);

    vi.setSystemTime(new Date(2026, 5, 2, 23, 30, 0));
    await flushMicrotasks();
    expect(h.emitFeatureOutcome).not.toHaveBeenCalled();
    expect(streak).toEqual({
      current: 5,
      longest: 12,
      lastStudiedDate: "2026-06-01",
    });

    vi.setSystemTime(new Date(2026, 5, 4, 8, 15, 0));
    streak = applyReturnAction(streak, "2026-06-04");
    streak = applyReturnAction(streak, "2026-06-04");
    await flushMicrotasks();

    expect(streak).toEqual({
      current: 1,
      longest: 12,
      lastStudiedDate: "2026-06-04",
    });
    expect(h.emitFeatureOutcome).toHaveBeenCalledTimes(1);
    expect(h.emitFeatureOutcome).toHaveBeenCalledWith(
      "retention_loop",
      "completed",
      { local_day: "2026-06-04" },
    );
  });
});
