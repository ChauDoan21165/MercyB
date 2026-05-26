import { describe, expect, it } from "vitest";
import { decidePerfAlert } from "@/lib/admin/perfAlerts";

describe("decidePerfAlert", () => {
  const baseInput = {
    currentP95Ms: 5000,
    thresholdMs: 4000,
    sampleCount: 50,
    recentAlerts: [] as { sent_at: string }[],
    now: new Date("2026-04-27T12:00:00Z"),
  };

  it("does not send when sample count is too low", () => {
    const decision = decidePerfAlert({ ...baseInput, sampleCount: 3 });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("insufficient_data");
  });

  it("does not send when P95 is below the threshold", () => {
    const decision = decidePerfAlert({ ...baseInput, currentP95Ms: 3000 });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("below_threshold");
  });

  it("sends when P95 exceeds threshold and no recent alerts", () => {
    const decision = decidePerfAlert(baseInput);
    expect(decision.send).toBe(true);
    if (decision.send) expect(decision.severity).toBe("alert");
  });

  it("dedupes when an alert was sent within the dedup window", () => {
    const decision = decidePerfAlert({
      ...baseInput,
      recentAlerts: [{ sent_at: new Date("2026-04-27T10:00:00Z").toISOString() }],
    });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("deduped");
  });

  it("sends past the dedup window", () => {
    const decision = decidePerfAlert({
      ...baseInput,
      recentAlerts: [{ sent_at: new Date("2026-04-27T07:30:00Z").toISOString() }],
    });
    expect(decision.send).toBe(true);
  });

  it("respects custom dedup window override", () => {
    const decision = decidePerfAlert({
      ...baseInput,
      recentAlerts: [{ sent_at: new Date("2026-04-27T11:30:00Z").toISOString() }],
      dedupHours: 1,
    });
    expect(decision.send).toBe(false);
    if (!decision.send) expect(decision.reason).toBe("deduped");
  });
});
