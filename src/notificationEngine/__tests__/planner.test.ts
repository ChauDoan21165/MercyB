import { describe, it, expect } from "vitest";

import {
  planDailyReminder,
  planStreakSave,
  planDueReview,
} from "../lifecycle";
import { NOTIFICATION_IDS } from "../types";
import type { HabitSnapshot, NotificationPreferences } from "../types";

const prefs = (over: Partial<NotificationPreferences> = {}): NotificationPreferences => ({
  dailyReminderEnabled: true,
  dailyReminderLocalTime: "19:30",
  streakSaveEnabled: true,
  timezone: "Asia/Ho_Chi_Minh",
  ...over,
});

const snap = (over: Partial<HabitSnapshot> = {}): HabitSnapshot => ({
  todayLocal: "2026-06-02",
  yesterdayLocal: "2026-06-01",
  timezone: "Asia/Ho_Chi_Minh",
  streakDays: 5,
  serverStreaksEnabled: true,
  serverLastStudiedDate: "2026-06-01",
  isAtRiskToday: true,
  dueCount: 0,
  nextScheduledAt: null,
  ...over,
});

const ON = true;
const GRANTED = true;

describe("planDailyReminder (id 1001)", () => {
  it("schedules a repeating daily at the configured local time", () => {
    const d = planDailyReminder(prefs({ dailyReminderLocalTime: "08:15" }), GRANTED, ON);
    expect(d).toMatchObject({
      kind: "scheduleDaily",
      id: NOTIFICATION_IDS.daily_reminder,
      hour: 8,
      minute: 15,
    });
  });

  it("reschedules to the new time when the preference changes", () => {
    const a = planDailyReminder(prefs({ dailyReminderLocalTime: "07:00" }), GRANTED, ON);
    const b = planDailyReminder(prefs({ dailyReminderLocalTime: "21:45" }), GRANTED, ON);
    expect(a).toMatchObject({ kind: "scheduleDaily", hour: 7, minute: 0 });
    expect(b).toMatchObject({ kind: "scheduleDaily", hour: 21, minute: 45 });
  });

  it("cancels when disabled, off, or permission not granted", () => {
    expect(planDailyReminder(prefs({ dailyReminderEnabled: false }), GRANTED, ON)).toEqual({
      kind: "cancel",
      id: NOTIFICATION_IDS.daily_reminder,
    });
    expect(planDailyReminder(prefs(), GRANTED, false)).toMatchObject({ kind: "cancel" });
    expect(planDailyReminder(prefs(), false, ON)).toMatchObject({ kind: "cancel" });
  });
});

describe("planStreakSave (id 1002) — SERVER_STREAKS gated", () => {
  it("schedules a 20:00 one-shot only when server streaks on + at risk", () => {
    const now = new Date(2026, 5, 2, 3, 0, 0);
    const d = planStreakSave(snap(), prefs(), GRANTED, ON, now);
    expect(d.kind).toBe("scheduleOneShot");
    if (d.kind === "scheduleOneShot") {
      expect(d.id).toBe(NOTIFICATION_IDS.streak_save);
      expect(d.at.getHours()).toBe(20); // device-local 20:00
      expect(d.title).toContain("5"); // {{streak}} interpolated
    }
  });

  it("skips a stale same-day warning when 20:00 is already in the past", () => {
    const now = new Date("2026-06-02T21:00:00");
    expect(planStreakSave(snap(), prefs(), GRANTED, ON, now)).toEqual({
      kind: "cancel",
      id: NOTIFICATION_IDS.streak_save,
    });
  });

  it("still schedules same-day warning when 20:00 is in the future", () => {
    const now = new Date("2026-06-02T19:59:00");
    const d = planStreakSave(snap(), prefs(), GRANTED, ON, now);
    expect(d.kind).toBe("scheduleOneShot");
    if (d.kind === "scheduleOneShot") {
      expect(d.at.getHours()).toBe(20);
      expect(d.at.getTime()).toBeGreaterThan(now.getTime());
    }
  });

  it("cancels 1002 when SERVER_STREAKS is off", () => {
    expect(
      planStreakSave(snap({ serverStreaksEnabled: false, isAtRiskToday: false }), prefs(), GRANTED, ON),
    ).toEqual({ kind: "cancel", id: NOTIFICATION_IDS.streak_save });
  });

  it("cancels when not at risk (already studied today / not yesterday)", () => {
    expect(planStreakSave(snap({ isAtRiskToday: false }), prefs(), GRANTED, ON)).toMatchObject({
      kind: "cancel",
    });
  });

  it("cancels when streak-save preference off, feature off, or no permission", () => {
    expect(planStreakSave(snap(), prefs({ streakSaveEnabled: false }), GRANTED, ON)).toMatchObject({ kind: "cancel" });
    expect(planStreakSave(snap(), prefs(), GRANTED, false)).toMatchObject({ kind: "cancel" });
    expect(planStreakSave(snap(), prefs(), false, ON)).toMatchObject({ kind: "cancel" });
  });
});

describe("planDueReview (id 1003)", () => {
  it("schedules ~15 min out when cards are due now", () => {
    const now = new Date("2026-06-02T03:00:00Z");
    const d = planDueReview(snap({ dueCount: 7 }), GRANTED, ON, now);
    expect(d.kind).toBe("scheduleOneShot");
    if (d.kind === "scheduleOneShot") {
      expect(d.id).toBe(NOTIFICATION_IDS.due_review);
      expect(d.at.getTime()).toBe(now.getTime() + 15 * 60 * 1000);
      expect(d.title).toContain("7"); // {{count}} interpolated
    }
  });

  it("schedules at the soonest review when none currently due", () => {
    const now = new Date("2026-06-02T03:00:00Z");
    const d = planDueReview(
      snap({ dueCount: 0, nextScheduledAt: "2026-06-03T01:00:00Z" }),
      GRANTED,
      ON,
      now,
    );
    expect(d.kind).toBe("scheduleOneShot");
    if (d.kind === "scheduleOneShot") {
      expect(d.at.toISOString()).toBe("2026-06-03T01:00:00.000Z");
      expect(d.at.getTime()).toBeGreaterThan(now.getTime());
    }
  });

  it("skips stale soonest-review timestamps that are already in the past", () => {
    const now = new Date("2026-06-02T03:00:00Z");
    expect(
      planDueReview(
        snap({ dueCount: 0, nextScheduledAt: "2026-06-02T02:59:59Z" }),
        GRANTED,
        ON,
        now,
      ),
    ).toEqual({
      kind: "cancel",
      id: NOTIFICATION_IDS.due_review,
    });
  });

  it("cancels when nothing due and no soonest review", () => {
    expect(planDueReview(snap({ dueCount: 0, nextScheduledAt: null }), GRANTED, ON)).toEqual({
      kind: "cancel",
      id: NOTIFICATION_IDS.due_review,
    });
  });

  it("cancels when feature off or no permission", () => {
    expect(planDueReview(snap({ dueCount: 5 }), GRANTED, false)).toMatchObject({ kind: "cancel" });
    expect(planDueReview(snap({ dueCount: 5 }), false, ON)).toMatchObject({ kind: "cancel" });
  });
});
