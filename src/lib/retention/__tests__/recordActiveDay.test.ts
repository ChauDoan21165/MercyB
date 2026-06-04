import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ emit: vi.fn() }));

// B's outcome-event emitter (dark behind RETENTION_OUTCOME_EVENTS) — spy on it.
vi.mock("@/lib/analytics", () => ({ emitFeatureOutcome: h.emit }));

import { recordActiveDay } from "@/lib/retention/recordActiveDay";

// Device-LOCAL calendar day (mirrors recordActiveDay's localDayKey). A UTC
// toISOString() stamp would differ for UTC+7 users in their early-morning window.
function localTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const STAMP_KEY = "mb.retention.lastActiveLocalDay";

beforeEach(() => {
  h.emit.mockClear();
  try { localStorage.clear(); } catch { /* global setup also resets */ }
});

describe("recordActiveDay — canonical active-day choke point", () => {
  it("emits one retention_loop 'completed' with a well-formed local_day on the first call of the day", () => {
    recordActiveDay();
    expect(h.emit).toHaveBeenCalledTimes(1);
    expect(h.emit).toHaveBeenCalledWith(
      "retention_loop",
      "completed",
      expect.objectContaining({ local_day: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) }),
    );
  });

  it("is idempotent per local day — repeated calls do not re-emit", () => {
    recordActiveDay();
    recordActiveDay();
    recordActiveDay();
    expect(h.emit).toHaveBeenCalledTimes(1);
  });

  it("stamps local_day as the device-LOCAL calendar day, not UTC", () => {
    recordActiveDay();
    const payload = h.emit.mock.calls[0]?.[2] as { local_day?: string } | undefined;
    expect(payload?.local_day).toBe(localTodayStr());
  });

  it("re-emits when the stored stamp is a previous local day", () => {
    localStorage.setItem(STAMP_KEY, "2000-01-01");
    recordActiveDay();
    expect(h.emit).toHaveBeenCalledTimes(1);
    expect(h.emit).toHaveBeenCalledWith(
      "retention_loop",
      "completed",
      expect.objectContaining({ local_day: localTodayStr() }),
    );
  });

  it("never throws even if the emitter throws", () => {
    h.emit.mockImplementationOnce(() => {
      throw new Error("telemetry down");
    });
    expect(() => recordActiveDay()).not.toThrow();
  });
});
