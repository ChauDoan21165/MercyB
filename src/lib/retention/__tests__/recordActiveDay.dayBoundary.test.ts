// src/lib/retention/__tests__/recordActiveDay.dayBoundary.test.ts
//
// The retention scoreboard rides on ONE grain: the device-LOCAL calendar
// day. This suite pins the two edges that have silently broken
// day-bucketed metrics before:
//
//   1. LOCAL day, not UTC — activity buckets on the learner's local
//      calendar day (getFullYear/getMonth/getDate), never a toISOString()
//      UTC date. On a non-UTC runner an early-morning instant proves it.
//   2. DAY BOUNDARY — crossing local midnight re-arms the once-per-day
//      emit; staying within the local day stays deduped.
//
// Clocks are built with the LOCAL Date constructor (new Date(y, mIdx, d,
// hh, mm)) so the chosen local day is deterministic on ANY runner TZ —
// vitest worker threads keep the process default zone (usually UTC) and do
// not honour a runtime process.env.TZ flip, so we drive local components
// directly instead.

import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

const h = vi.hoisted(() => ({ emit: vi.fn() }));

vi.mock("@/lib/analytics", () => ({ emitFeatureOutcome: h.emit }));

import { recordActiveDay } from "@/lib/retention/recordActiveDay";

const STAMP_KEY = "mb.retention.lastActiveLocalDay";

function localDayOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function emittedLocalDays(): string[] {
  return h.emit.mock.calls.map((c) => (c[2] as { local_day?: string })?.local_day ?? "");
}

beforeEach(() => {
  h.emit.mockClear();
  try {
    localStorage.clear();
  } catch {
    /* global setup also resets */
  }
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("recordActiveDay — local day, not UTC", () => {
  it("buckets on the activity's LOCAL calendar day", () => {
    const inst = new Date(2026, 5, 6, 0, 30); // local 00:30, 6 Jun, any TZ
    vi.setSystemTime(inst);
    recordActiveDay();
    expect(h.emit).toHaveBeenCalledTimes(1);
    expect(emittedLocalDays()[0]).toBe(localDayOf(inst)); // "2026-06-06"

    // On any runner ahead of UTC this early-morning instant's UTC date is
    // the PREVIOUS day — the local grain must win. (No-op on a UTC runner.)
    const utcDay = inst.toISOString().slice(0, 10);
    if (utcDay !== localDayOf(inst)) {
      expect(emittedLocalDays()[0]).not.toBe(utcDay);
    }
  });

  it("stamps a well-formed YYYY-MM-DD local_day", () => {
    vi.setSystemTime(new Date(2026, 0, 3, 9, 0)); // 3 Jan — single-digit M/D padding
    recordActiveDay();
    expect(emittedLocalDays()[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(emittedLocalDays()[0]).toBe("2026-01-03");
  });
});

describe("recordActiveDay — day-boundary dedup", () => {
  it("re-arms exactly once when the clock crosses local midnight", () => {
    vi.setSystemTime(new Date(2026, 5, 6, 23, 30)); // 23:30 local, 6th
    recordActiveDay();
    vi.setSystemTime(new Date(2026, 5, 7, 0, 10)); // 00:10 local, 7th
    recordActiveDay();
    vi.setSystemTime(new Date(2026, 5, 7, 12, 0)); // 12:00 local, 7th — same day
    recordActiveDay();

    expect(h.emit).toHaveBeenCalledTimes(2);
    expect(emittedLocalDays()).toEqual(["2026-06-06", "2026-06-07"]);
  });

  it("multiple calls within the same local day emit once", () => {
    vi.setSystemTime(new Date(2026, 5, 6, 0, 5)); // 00:05 local, 6th
    recordActiveDay();
    vi.setSystemTime(new Date(2026, 5, 6, 23, 0)); // 23:00 local, 6th
    recordActiveDay();

    expect(h.emit).toHaveBeenCalledTimes(1);
    expect(emittedLocalDays()).toEqual(["2026-06-06"]);
  });

  it("respects a stale local-day stamp and re-emits today's local day", () => {
    localStorage.setItem(STAMP_KEY, "2026-06-05");
    vi.setSystemTime(new Date(2026, 5, 6, 23, 30)); // 23:30 local, 6th
    recordActiveDay();
    expect(h.emit).toHaveBeenCalledTimes(1);
    expect(emittedLocalDays()[0]).toBe("2026-06-06");
    expect(localStorage.getItem(STAMP_KEY)).toBe("2026-06-06");
  });
});
