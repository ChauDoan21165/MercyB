import { describe, it, expect } from "vitest";
import {
  ALERT_THRESHOLDS,
  DEFAULT_THRESHOLD_USD,
  evaluateAlert,
  shouldDispatchEmail,
} from "../costAlerts";
import { DEFAULT_USD_VND_RATE } from "../costMonitoring";

const CAP_VND = DEFAULT_THRESHOLD_USD * DEFAULT_USD_VND_RATE; // $100 × 25000 = 2,500,000

describe("evaluateAlert", () => {
  it("returns 'ok' below the watch threshold (75%)", () => {
    const e = evaluateAlert(CAP_VND * 0.5);
    expect(e.level).toBe("ok");
    expect(e.ratio).toBeCloseTo(0.5, 4);
  });

  it("returns 'watch' between 75% and 100%", () => {
    expect(evaluateAlert(CAP_VND * 0.75).level).toBe("watch");
    expect(evaluateAlert(CAP_VND * 0.99).level).toBe("watch");
  });

  it("returns 'alert' at and above 100%", () => {
    expect(evaluateAlert(CAP_VND).level).toBe("alert");
    expect(evaluateAlert(CAP_VND * 2).level).toBe("alert");
  });

  it("respects custom threshold + FX rate", () => {
    // $1 cap × 30000 VND/USD = 30,000 VND
    const e = evaluateAlert(45_000, 1, 30_000);
    expect(e.thresholdVnd).toBe(30_000);
    expect(e.level).toBe("alert");
    expect(e.ratio).toBe(1.5);
  });

  it("emits a bilingual message for each level", () => {
    const ok = evaluateAlert(0);
    expect(ok.message.vi.length).toBeGreaterThan(10);
    expect(ok.message.en.length).toBeGreaterThan(10);

    const watch = evaluateAlert(CAP_VND * 0.8);
    expect(watch.message.vi).toContain("80%");
    expect(watch.message.en).toContain("80%");

    const alert = evaluateAlert(CAP_VND * 1.2);
    expect(alert.message.vi).toContain("120%");
    expect(alert.message.en).toContain("120%");
  });

  it("threshold ratios match the documented spec (75/100)", () => {
    expect(ALERT_THRESHOLDS).toEqual({ watchRatio: 0.75, alertRatio: 1.0 });
  });
});

describe("shouldDispatchEmail", () => {
  it("dispatches on first transition into watch from null/ok", () => {
    expect(shouldDispatchEmail("watch", null)).toBe(true);
    expect(shouldDispatchEmail("watch", "ok")).toBe(true);
    expect(shouldDispatchEmail("alert", null)).toBe(true);
    expect(shouldDispatchEmail("alert", "ok")).toBe(true);
    expect(shouldDispatchEmail("alert", "watch")).toBe(true);
  });

  it("does not redispatch when staying at the same level", () => {
    expect(shouldDispatchEmail("watch", "watch")).toBe(false);
    expect(shouldDispatchEmail("alert", "alert")).toBe(false);
  });

  it("does not dispatch on de-escalation", () => {
    expect(shouldDispatchEmail("watch", "alert")).toBe(false);
    expect(shouldDispatchEmail("ok", "alert")).toBe(false);
  });

  it("never dispatches when current is 'ok'", () => {
    expect(shouldDispatchEmail("ok", null)).toBe(false);
    expect(shouldDispatchEmail("ok", "watch")).toBe(false);
  });
});
