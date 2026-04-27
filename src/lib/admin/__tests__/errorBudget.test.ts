import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

import {
  classifyBudget,
  classifyStatus,
  computeBurnRate,
  decideBurnAlert,
} from "@/lib/admin/errorBudget";
import { getSloById } from "@/config/slos";

const ai_chat = getSloById("ai_chat_p99")!;
const azure_phoneme = getSloById("azure_phoneme_p99")!;

describe("classifyStatus", () => {
  it("returns healthy when remaining is plenty", () => {
    expect(classifyStatus(80)).toBe("healthy");
  });
  it("returns warning when 50-80% consumed", () => {
    expect(classifyStatus(40)).toBe("warning");
  });
  it("returns critical when 80-100% consumed", () => {
    expect(classifyStatus(15)).toBe("critical");
  });
  it("returns exhausted when remaining is zero or negative", () => {
    expect(classifyStatus(0)).toBe("exhausted");
    expect(classifyStatus(-5)).toBe("exhausted");
  });
});

describe("computeBurnRate", () => {
  it("returns 0 when total samples are below the minimum", () => {
    expect(
      computeBurnRate({
        sloBudgetPercent: 1,
        burnWindowBadCount: 5,
        burnWindowTotalCount: 10,
      }),
    ).toBe(0);
  });
  it("returns 1 when observed bad-rate equals SLO budget", () => {
    expect(
      computeBurnRate({
        sloBudgetPercent: 1,
        burnWindowBadCount: 1,
        burnWindowTotalCount: 100,
      }),
    ).toBe(1);
  });
  it("scales linearly with bad-rate", () => {
    expect(
      computeBurnRate({
        sloBudgetPercent: 1,
        burnWindowBadCount: 14,
        burnWindowTotalCount: 100,
      }),
    ).toBeCloseTo(14, 5);
  });
  it("returns 0 when budget is zero (degenerate SLO)", () => {
    expect(
      computeBurnRate({
        sloBudgetPercent: 0,
        burnWindowBadCount: 10,
        burnWindowTotalCount: 100,
      }),
    ).toBe(0);
  });
});

describe("classifyBudget", () => {
  it("returns no_data when sample count is too low", () => {
    const result = classifyBudget({
      slo: ai_chat,
      totalCount: 5,
      goodCount: 2,
    });
    expect(result.status).toBe("no_data");
  });

  it("returns healthy when actual exceeds target by a wide margin", () => {
    // 999/1000 = 99.9% with target 99% = only 10% of budget consumed = healthy.
    const result = classifyBudget({
      slo: ai_chat,
      totalCount: 1000,
      goodCount: 999,
      burnWindowBadCount: 0,
      burnWindowTotalCount: 100,
      burnWindowHours: 1,
    });
    expect(result.status).toBe("healthy");
    expect(result.actual_percent).toBeGreaterThanOrEqual(99);
  });

  it("returns critical when more than 80% of budget consumed", () => {
    // SLO budget = 1% of 1000 = 10 bad. 9 bad = 90% consumed = critical.
    const result = classifyBudget({
      slo: ai_chat,
      totalCount: 1000,
      goodCount: 991,
      burnWindowBadCount: 0,
      burnWindowTotalCount: 100,
      burnWindowHours: 1,
    });
    expect(result.status).toBe("critical");
    expect(result.budget_remaining_percent).toBeLessThan(20);
  });

  it("returns exhausted when budget is overrun", () => {
    const result = classifyBudget({
      slo: ai_chat,
      totalCount: 1000,
      goodCount: 980,
      burnWindowBadCount: 0,
      burnWindowTotalCount: 100,
      burnWindowHours: 1,
    });
    expect(result.status).toBe("exhausted");
    expect(result.budget_remaining_percent).toBe(0);
  });

  it("clamps goodCount to totalCount to avoid silly results", () => {
    const result = classifyBudget({
      slo: azure_phoneme,
      totalCount: 100,
      goodCount: 200,
    });
    expect(result.good_count).toBe(100);
    expect(result.bad_count).toBe(0);
  });

  it("computes a non-zero burn rate when burn window has bads", () => {
    const result = classifyBudget({
      slo: ai_chat,
      totalCount: 1000,
      goodCount: 995,
      burnWindowBadCount: 5,
      burnWindowTotalCount: 100,
      burnWindowHours: 1,
    });
    expect(result.burn_rate_per_hour).toBeGreaterThan(0);
  });

  it("projects an exhaustion date when burn rate > 0 and budget remains", () => {
    const result = classifyBudget({
      slo: ai_chat,
      totalCount: 1000,
      goodCount: 994,
      burnWindowBadCount: 5,
      burnWindowTotalCount: 100,
      burnWindowHours: 1,
    });
    expect(result.projected_exhaustion_at).toBeTruthy();
    if (result.projected_exhaustion_at) {
      expect(Date.parse(result.projected_exhaustion_at)).toBeGreaterThan(Date.now() - 1);
    }
  });

  it("does not project exhaustion when burn rate is 0", () => {
    const result = classifyBudget({
      slo: ai_chat,
      totalCount: 1000,
      goodCount: 995,
      burnWindowBadCount: 0,
      burnWindowTotalCount: 100,
      burnWindowHours: 1,
    });
    expect(result.projected_exhaustion_at).toBeNull();
  });
});

describe("decideBurnAlert", () => {
  const baseInput = {
    fastBurnRate: 0,
    slowBurnRate: 0,
    recentAlerts: [] as { sent_at: string; severity: string }[],
    pausedUntil: null as string | null,
    now: new Date("2026-04-27T12:00:00Z"),
  };

  it("does not send when both burn rates are below threshold", () => {
    const decision = decideBurnAlert({ ...baseInput, fastBurnRate: 5, slowBurnRate: 2 });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("below_thresholds");
  });

  it("fires fast severity when fast burn rate exceeds threshold", () => {
    const decision = decideBurnAlert({ ...baseInput, fastBurnRate: 20 });
    expect(decision.send).toBe(true);
    if (decision.send) expect(decision.severity).toBe("fast");
  });

  it("fires slow severity when only slow exceeds", () => {
    const decision = decideBurnAlert({ ...baseInput, slowBurnRate: 10 });
    expect(decision.send).toBe(true);
    if (decision.send) expect(decision.severity).toBe("slow");
  });

  it("prefers fast when both fire", () => {
    const decision = decideBurnAlert({
      ...baseInput,
      fastBurnRate: 20,
      slowBurnRate: 10,
    });
    expect(decision.send).toBe(true);
    if (decision.send) expect(decision.severity).toBe("fast");
  });

  it("dedupes when an alert was sent within 6 hours", () => {
    const decision = decideBurnAlert({
      ...baseInput,
      fastBurnRate: 20,
      recentAlerts: [
        { sent_at: new Date("2026-04-27T08:00:00Z").toISOString(), severity: "fast" },
      ],
    });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("deduped");
  });

  it("does not dedupe past the 6-hour window", () => {
    const decision = decideBurnAlert({
      ...baseInput,
      fastBurnRate: 20,
      recentAlerts: [
        { sent_at: new Date("2026-04-27T05:00:00Z").toISOString(), severity: "fast" },
      ],
    });
    expect(decision.send).toBe(true);
  });

  it("does not send when pause is active", () => {
    const decision = decideBurnAlert({
      ...baseInput,
      fastBurnRate: 20,
      pausedUntil: new Date("2026-04-27T13:00:00Z").toISOString(),
    });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("paused");
  });

  it("ignores invalid pausedUntil values", () => {
    const decision = decideBurnAlert({
      ...baseInput,
      fastBurnRate: 20,
      pausedUntil: "not-a-real-date",
    });
    expect(decision.send).toBe(true);
  });
});
