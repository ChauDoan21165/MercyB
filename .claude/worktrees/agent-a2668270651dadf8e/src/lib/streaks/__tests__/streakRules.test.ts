import { describe, it, expect } from "vitest";

import {
  applyFreeze,
  applyInsurance,
  canUseFreeze,
  canUseInsurance,
  isOnVacation,
  setVacation,
  type StreakV2State,
} from "../streakRules";

const baseState = (overrides: Partial<StreakV2State> = {}): StreakV2State => ({
  current: 5,
  longest: 12,
  lastStudiedDate: "2026-04-22",
  freezesUsedThisWeek: 0,
  lastFreezeAt: null,
  vacationUntil: null,
  insuranceUsedThisMonth: 0,
  lastInsuranceAt: null,
  ...overrides,
});

describe("canUseFreeze", () => {
  it("allows freeze when no freezes used this week", () => {
    expect(canUseFreeze(baseState(), "2026-04-23")).toEqual({ allowed: true });
  });

  it("allows the second freeze of the week", () => {
    const s = baseState({ freezesUsedThisWeek: 1, lastFreezeAt: "2026-04-21T10:00:00Z" });
    expect(canUseFreeze(s, "2026-04-23")).toEqual({ allowed: true });
  });

  it("blocks the third freeze of the week", () => {
    const s = baseState({ freezesUsedThisWeek: 2, lastFreezeAt: "2026-04-22T10:00:00Z" });
    expect(canUseFreeze(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "weekly_limit_reached",
    });
  });

  it("blocks a same-day second freeze even if budget remains", () => {
    const s = baseState({ freezesUsedThisWeek: 1, lastFreezeAt: "2026-04-23T03:00:00Z" });
    expect(canUseFreeze(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "already_used_today",
    });
  });

  it("denies freeze while user is on vacation (vacation already covers it)", () => {
    const s = baseState({ vacationUntil: "2026-04-30" });
    expect(canUseFreeze(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "on_vacation",
    });
  });

  it("allows freeze the day after vacation ends", () => {
    const s = baseState({ vacationUntil: "2026-04-22" });
    expect(canUseFreeze(s, "2026-04-23")).toEqual({ allowed: true });
  });
});

describe("isOnVacation", () => {
  it("returns false when no vacation set", () => {
    expect(isOnVacation({ vacationUntil: null }, "2026-04-23")).toBe(false);
  });

  it("returns true on the start of a future window", () => {
    expect(isOnVacation({ vacationUntil: "2026-05-10" }, "2026-04-23")).toBe(true);
  });

  it("returns true on the last day inclusively", () => {
    expect(isOnVacation({ vacationUntil: "2026-04-23" }, "2026-04-23")).toBe(true);
  });

  it("returns false the day after vacation ends", () => {
    expect(isOnVacation({ vacationUntil: "2026-04-22" }, "2026-04-23")).toBe(false);
  });

  it("handles year-boundary vacation correctly", () => {
    expect(isOnVacation({ vacationUntil: "2026-01-05" }, "2025-12-31")).toBe(true);
  });
});

describe("canUseInsurance", () => {
  it("allows insurance after a reset within the 7-day window", () => {
    // 4-day gap = past grace, so streak would have reset on next study.
    const s = baseState({ lastStudiedDate: "2026-04-19" });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({ allowed: true });
  });

  it("denies if insurance already used this month", () => {
    const s = baseState({ lastStudiedDate: "2026-04-19", insuranceUsedThisMonth: 1 });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "monthly_limit_reached",
    });
  });

  it("denies if current streak is 0 (nothing to insure)", () => {
    const s = baseState({ current: 0, lastStudiedDate: "2026-04-19" });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "no_streak_to_protect",
    });
  });

  it("denies if no lastStudiedDate", () => {
    const s = baseState({ current: 0, lastStudiedDate: null });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "no_streak_to_protect",
    });
  });

  it("denies same-day (no gap to buy back)", () => {
    const s = baseState({ lastStudiedDate: "2026-04-23" });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "no_gap",
    });
  });

  it("denies within grace (1-day gap, no reset would happen)", () => {
    const s = baseState({ lastStudiedDate: "2026-04-22" });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "no_gap",
    });
  });

  it("denies within 2-day grace (still no reset)", () => {
    const s = baseState({ lastStudiedDate: "2026-04-21" });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "no_gap",
    });
  });

  it("allows on the first day past grace (3-day gap)", () => {
    const s = baseState({ lastStudiedDate: "2026-04-20" });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({ allowed: true });
  });

  it("allows on the last day of the 7-day window", () => {
    const s = baseState({ lastStudiedDate: "2026-04-16" });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({ allowed: true });
  });

  it("denies past the 7-day window", () => {
    const s = baseState({ lastStudiedDate: "2026-04-15" });
    expect(canUseInsurance(s, "2026-04-23")).toEqual({
      allowed: false,
      reason: "gap_too_large",
    });
  });

  it("handles month boundary correctly inside the window", () => {
    const s = baseState({ lastStudiedDate: "2026-03-30" });
    expect(canUseInsurance(s, "2026-04-02")).toEqual({ allowed: true });
  });

  it("handles leap-year Feb→Mar boundary correctly", () => {
    // 2028 is a leap year; gap from Feb 28 → Mar 2 is 3 days.
    const s = baseState({ lastStudiedDate: "2028-02-28" });
    expect(canUseInsurance(s, "2028-03-02")).toEqual({ allowed: true });
  });
});

describe("applyFreeze", () => {
  it("increments freezes_used_this_week and stamps lastFreezeAt", () => {
    const s = baseState();
    const next = applyFreeze(s, "2026-04-23", "2026-04-23T08:00:00Z");
    expect(next.freezesUsedThisWeek).toBe(1);
    expect(next.lastFreezeAt).toBe("2026-04-23T08:00:00Z");
    expect(next.lastStudiedDate).toBe("2026-04-23");
  });

  it("does not mutate the input state", () => {
    const s = baseState();
    applyFreeze(s, "2026-04-23", "2026-04-23T08:00:00Z");
    expect(s.freezesUsedThisWeek).toBe(0);
    expect(s.lastFreezeAt).toBeNull();
  });

  it("throws when precondition fails", () => {
    const s = baseState({ freezesUsedThisWeek: 2 });
    expect(() => applyFreeze(s, "2026-04-23", "2026-04-23T08:00:00Z")).toThrow(
      /weekly_limit_reached/,
    );
  });
});

describe("applyInsurance", () => {
  it("increments current, preserves longest, stamps insurance counters", () => {
    const s = baseState({ current: 5, longest: 12, lastStudiedDate: "2026-04-19" });
    const next = applyInsurance(s, "2026-04-23", "2026-04-23T08:00:00Z");
    expect(next.current).toBe(6);
    expect(next.longest).toBe(12);
    expect(next.insuranceUsedThisMonth).toBe(1);
    expect(next.lastInsuranceAt).toBe("2026-04-23T08:00:00Z");
    expect(next.lastStudiedDate).toBe("2026-04-23");
  });

  it("updates longest when current exceeds it after restoration", () => {
    const s = baseState({ current: 12, longest: 12, lastStudiedDate: "2026-04-19" });
    const next = applyInsurance(s, "2026-04-23", "2026-04-23T08:00:00Z");
    expect(next.longest).toBe(13);
  });

  it("throws when precondition fails", () => {
    const s = baseState({ insuranceUsedThisMonth: 1, lastStudiedDate: "2026-04-19" });
    expect(() => applyInsurance(s, "2026-04-23", "2026-04-23T08:00:00Z")).toThrow(
      /monthly_limit_reached/,
    );
  });
});

describe("setVacation", () => {
  it("sets vacationUntil to the provided date", () => {
    const next = setVacation(baseState(), "2026-05-15");
    expect(next.vacationUntil).toBe("2026-05-15");
  });

  it("clears vacationUntil when null", () => {
    const next = setVacation(baseState({ vacationUntil: "2026-05-15" }), null);
    expect(next.vacationUntil).toBeNull();
  });

  it("does not mutate the input state", () => {
    const s = baseState();
    setVacation(s, "2026-05-15");
    expect(s.vacationUntil).toBeNull();
  });
});
