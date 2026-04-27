import { describe, expect, it, vi } from "vitest";

// classifyDegradation + decideAlert are pure, but the module imports
// supabaseClient (used by the async detect helper). Stub the client so
// the import chain doesn't try to read missing env vars in the test
// environment.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
    from: vi.fn(),
  },
}));

import {
  classifyDegradation,
  decideAlert,
} from "@/lib/admin/latencyAlerts";

describe("classifyDegradation", () => {
  it("returns insufficient_data when sample_count is below threshold", () => {
    const result = classifyDegradation({
      operation: "ai-chat.total",
      currentP95Ms: 9999,
      baselineP95Ms: 1000,
      sampleCount: 2,
    });
    expect(result.status).toBe("insufficient_data");
    expect(result.increase_percent).toBe(0);
  });

  it("classifies as healthy when current is within 20% of baseline", () => {
    const result = classifyDegradation({
      operation: "ai-chat.total",
      currentP95Ms: 1100,
      baselineP95Ms: 1000,
      sampleCount: 50,
    });
    expect(result.status).toBe("healthy");
    expect(result.increase_percent).toBe(10);
  });

  it("classifies as warning when current is 30-50% above baseline", () => {
    const result = classifyDegradation({
      operation: "ai-chat.total",
      currentP95Ms: 1400,
      baselineP95Ms: 1000,
      sampleCount: 50,
    });
    expect(result.status).toBe("warning");
    expect(result.increase_percent).toBe(40);
  });

  it("classifies as alert when current is more than 50% above baseline", () => {
    const result = classifyDegradation({
      operation: "ai-chat.total",
      currentP95Ms: 1600,
      baselineP95Ms: 1000,
      sampleCount: 50,
    });
    expect(result.status).toBe("alert");
    expect(result.increase_percent).toBe(60);
  });

  it("alert ceiling overrides percentage-only rule", () => {
    // baseline drift means percent change looks small, but the absolute
    // ceiling catches the regression anyway.
    const result = classifyDegradation({
      operation: "azure-phoneme.total",
      currentP95Ms: 3500,
      baselineP95Ms: 3200,
      sampleCount: 50,
      alertCeilingMs: 3000,
    });
    expect(result.status).toBe("alert");
  });

  it("treats zero-baseline edge by clamping to 1ms before division", () => {
    const result = classifyDegradation({
      operation: "ai-chat.total",
      currentP95Ms: 1000,
      baselineP95Ms: 0,
      sampleCount: 50,
    });
    expect(result.status).toBe("alert");
    expect(Number.isFinite(result.increase_percent)).toBe(true);
  });

  it("uses minSamples override when provided", () => {
    const result = classifyDegradation({
      operation: "ai-chat.total",
      currentP95Ms: 1100,
      baselineP95Ms: 1000,
      sampleCount: 3,
      minSamples: 2,
    });
    expect(result.status).toBe("healthy");
  });
});

describe("decideAlert", () => {
  const baseInput = {
    status: "alert" as const,
    recentAlerts: [] as { sent_at: string; severity: string }[],
    pausedUntil: null as string | null,
    now: new Date("2026-04-26T12:00:00Z"),
  };

  it("does not send when status is below alert", () => {
    const decision = decideAlert({ ...baseInput, status: "warning" });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("below_threshold");
  });

  it("does not send when paused window is still active", () => {
    const decision = decideAlert({
      ...baseInput,
      pausedUntil: new Date("2026-04-26T13:00:00Z").toISOString(),
    });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("paused");
  });

  it("sends past the pause window", () => {
    const decision = decideAlert({
      ...baseInput,
      pausedUntil: new Date("2026-04-26T11:00:00Z").toISOString(),
    });
    expect(decision.send).toBe(true);
  });

  it("dedupes when an alert was sent within 30 minutes", () => {
    const decision = decideAlert({
      ...baseInput,
      recentAlerts: [
        { sent_at: new Date("2026-04-26T11:45:00Z").toISOString(), severity: "alert" },
      ],
    });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("deduped");
  });

  it("sends after the dedup window has passed", () => {
    const decision = decideAlert({
      ...baseInput,
      recentAlerts: [
        { sent_at: new Date("2026-04-26T11:25:00Z").toISOString(), severity: "alert" },
      ],
    });
    expect(decision.send).toBe(true);
    if (decision.send) expect(decision.severity).toBe("alert");
  });

  it("escalates to sustained when 3+ alerts hit in the last hour", () => {
    const decision = decideAlert({
      ...baseInput,
      recentAlerts: [
        { sent_at: new Date("2026-04-26T11:25:00Z").toISOString(), severity: "alert" },
        { sent_at: new Date("2026-04-26T11:00:00Z").toISOString(), severity: "alert" },
        { sent_at: new Date("2026-04-26T10:30:00Z").toISOString(), severity: "alert" },
      ],
    });
    expect(decision.send).toBe(true);
    if (decision.send) expect(decision.severity).toBe("sustained");
  });

  it("uses 60-minute dedup for sustained alerts", () => {
    const decision = decideAlert({
      ...baseInput,
      recentAlerts: [
        { sent_at: new Date("2026-04-26T11:30:00Z").toISOString(), severity: "sustained" },
      ],
    });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("deduped");
  });

  it("ignores invalid pausedUntil timestamps", () => {
    const decision = decideAlert({ ...baseInput, pausedUntil: "not-a-date" });
    expect(decision.send).toBe(true);
  });

  it("doesn't dedup against alerts older than the window", () => {
    const decision = decideAlert({
      ...baseInput,
      recentAlerts: [
        { sent_at: new Date("2026-04-25T12:00:00Z").toISOString(), severity: "alert" },
      ],
    });
    expect(decision.send).toBe(true);
    if (decision.send) expect(decision.severity).toBe("alert");
  });
});
