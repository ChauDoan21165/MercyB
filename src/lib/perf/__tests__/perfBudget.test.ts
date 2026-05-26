import { describe, expect, it } from "vitest";
import {
  WEB_VITAL_THRESHOLDS,
  classifyDevice,
  rateVital,
  PERF_ALERT_RULES,
  BUNDLE_BUDGET,
} from "@/config/perfBudget";

describe("rateVital", () => {
  it("rates LCP <= 2500ms as good", () => {
    expect(rateVital("LCP", 2400)).toBe("good");
    expect(rateVital("LCP", 2500)).toBe("good");
  });
  it("rates LCP between 2500 and 4000 as needs_improvement", () => {
    expect(rateVital("LCP", 3000)).toBe("needs_improvement");
  });
  it("rates LCP > 4000 as poor", () => {
    expect(rateVital("LCP", 4500)).toBe("poor");
  });
  it("rates CLS <= 0.1 as good", () => {
    expect(rateVital("CLS", 0.05)).toBe("good");
  });
  it("rates CLS > 0.25 as poor", () => {
    expect(rateVital("CLS", 0.3)).toBe("poor");
  });
  it("rates negative or NaN as no_data", () => {
    expect(rateVital("LCP", -1)).toBe("no_data");
    expect(rateVital("LCP", NaN)).toBe("no_data");
  });
  it("returns no_data for unknown metric (defensive)", () => {
    // @ts-expect-error intentional invalid input
    expect(rateVital("XYZ", 100)).toBe("no_data");
  });
});

describe("classifyDevice", () => {
  it("classifies <768 width as mobile", () => {
    expect(classifyDevice(375)).toBe("mobile");
    expect(classifyDevice(767)).toBe("mobile");
  });
  it("classifies >=768 as desktop", () => {
    expect(classifyDevice(768)).toBe("desktop");
    expect(classifyDevice(1920)).toBe("desktop");
  });
});

describe("config invariants", () => {
  it("LCP good threshold matches Google's 2.5s cutoff", () => {
    expect(WEB_VITAL_THRESHOLDS.LCP.good).toBe(2500);
  });
  it("CLS thresholds match Google guidance", () => {
    expect(WEB_VITAL_THRESHOLDS.CLS.good).toBe(0.1);
    expect(WEB_VITAL_THRESHOLDS.CLS.needsImprovement).toBe(0.25);
  });
  it("PERF_ALERT_RULES.LCP_ALERT_MS aligns with the LCP poor cutoff", () => {
    expect(PERF_ALERT_RULES.LCP_ALERT_MS).toBe(WEB_VITAL_THRESHOLDS.LCP.needsImprovement);
  });
  it("BUNDLE_BUDGET totals are positive and per-chunk < total", () => {
    expect(BUNDLE_BUDGET.totalBytes).toBeGreaterThan(0);
    expect(BUNDLE_BUDGET.perChunkBytes).toBeLessThan(BUNDLE_BUDGET.totalBytes);
  });
});
