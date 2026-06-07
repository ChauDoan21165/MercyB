// src/notificationEngine/__tests__/streakSaveSuppression.test.ts
//
// Locks the durable same-day streak-save suppression — the half that survives
// later refreshes. The pre-existing onFirstActionOfDay only cancel()led the
// pending 20:00 reminder, but its own refresh (and any later foreground
// refresh) could RE-ARM streak-save while the server's streak_last_studied_date
// still read "yesterday" (propagation lag) → a learner who already practiced
// gets nagged. suppressStreakSaveForToday() records a local-day marker that
// planStreakSave/planAll honor, so streak-save stays off for the rest of today.

import { describe, it, expect, beforeEach } from "vitest";

import { planStreakSave, planAll, suppressStreakSaveForToday } from "../lifecycle";
import { NOTIFICATION_IDS } from "../types";
import type { HabitSnapshot, NotificationPreferences } from "../types";

const NOW = new Date("2026-06-02T03:00:00Z");

const prefs = (over: Partial<NotificationPreferences> = {}): NotificationPreferences => ({
  dailyReminderEnabled: true,
  dailyReminderLocalTime: "19:30",
  streakSaveEnabled: true,
  timezone: "UTC",
  ...over,
});

// At-risk snapshot in UTC so the local-day comparison is runner-TZ-independent.
const atRisk = (over: Partial<HabitSnapshot> = {}): HabitSnapshot => ({
  todayLocal: "2026-06-02",
  yesterdayLocal: "2026-06-01",
  timezone: "UTC",
  streakDays: 5,
  serverStreaksEnabled: true,
  serverLastStudiedDate: "2026-06-01",
  isAtRiskToday: true,
  dueCount: 0,
  nextScheduledAt: null,
  ...over,
});

beforeEach(() => {
  localStorage.clear();
});

describe("planStreakSave — suppression flag wins over an at-risk snapshot", () => {
  it("schedules when at risk and NOT suppressed", () => {
    const d = planStreakSave(atRisk(), prefs(), true, true, NOW, "vi", false);
    expect(d.kind).toBe("scheduleOneShot");
  });

  it("cancels when suppressed, even though the snapshot still reads at-risk", () => {
    const d = planStreakSave(atRisk(), prefs(), true, true, NOW, "vi", true);
    expect(d).toEqual({ kind: "cancel", id: NOTIFICATION_IDS.streak_save });
  });
});

describe("planAll — reads the persisted same-day suppression marker", () => {
  it("suppresses streak-save for the rest of today after suppressStreakSaveForToday()", () => {
    // Snapshot's local day == the marker's local day (both UTC 'today').
    const todayUtc = new Date().toISOString().slice(0, 10);
    suppressStreakSaveForToday(); // marks 'now' (today, UTC)

    const out = planAll(atRisk({ todayLocal: todayUtc }), prefs(), true, true, NOW);
    const streakDecision = out.find((d) => d.id === NOTIFICATION_IDS.streak_save);
    expect(streakDecision?.kind).toBe("cancel");
  });

  it("does NOT carry a previous day's suppression into today (resets per local day)", () => {
    const todayUtc = new Date().toISOString().slice(0, 10);
    // Marker from a long-past day — must be ignored.
    suppressStreakSaveForToday(new Date("2020-01-01T12:00:00Z"));

    const out = planAll(atRisk({ todayLocal: todayUtc }), prefs(), true, true, NOW);
    const streakDecision = out.find((d) => d.id === NOTIFICATION_IDS.streak_save);
    expect(streakDecision?.kind).toBe("scheduleOneShot");
  });

  it("no marker → normal at-risk scheduling", () => {
    const todayUtc = new Date().toISOString().slice(0, 10);
    const out = planAll(atRisk({ todayLocal: todayUtc }), prefs(), true, true, NOW);
    const streakDecision = out.find((d) => d.id === NOTIFICATION_IDS.streak_save);
    expect(streakDecision?.kind).toBe("scheduleOneShot");
  });
});
