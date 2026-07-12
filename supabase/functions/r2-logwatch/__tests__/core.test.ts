import { describe, expect, it } from "vitest";

import { diagnose, formatEmailText, groupEvents, type R2Event, SYNTHETIC_USER_ID_PREFIX } from "../core.ts";

function event(overrides: Partial<R2Event>): R2Event {
  return {
    source: "function_failure_logs",
    id: "evt-1",
    occurredAt: "2026-07-12T10:00:00.000Z",
    provider: "function_failure",
    route: "/api/mercy-ai",
    mode: "sentence-correction",
    status: 502,
    errorClass: "provider_failed",
    message: "OpenAI 502",
    requestId: "req-1",
    userId: null,
    ...overrides,
  };
}

describe("r2-logwatch grouping", () => {
  it("groups by stable server-side signature and tracks first/last seen", () => {
    const groups = groupEvents([
      event({ id: "evt-1", occurredAt: "2026-07-12T10:04:00.000Z", requestId: "req-2" }),
      event({ id: "evt-2", occurredAt: "2026-07-12T10:01:00.000Z", requestId: "req-1" }),
      event({ id: "evt-3", route: "/api/other", requestId: "req-3" }),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({
      route: "/api/mercy-ai",
      count: 2,
      firstSeenAt: "2026-07-12T10:01:00.000Z",
      lastSeenAt: "2026-07-12T10:04:00.000Z",
      requestIds: ["req-2", "req-1"],
    });
  });

  it("excludes the synthetic account from source rows that carry user_id", () => {
    const groups = groupEvents([
      event({ id: "real", userId: null }),
      event({ id: "synthetic", userId: `${SYNTHETIC_USER_ID_PREFIX}aaaa-bbbb-cccc-123456789012` }),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].count).toBe(1);
  });

  it("formats a pre-diagnosed email body", () => {
    const [group] = groupEvents([event({})]);
    const body = formatEmailText([group], new Date("2026-07-12T10:00:00Z"), new Date("2026-07-12T10:15:00Z"));

    expect(diagnose(group)).toContain("/api/mercy-ai");
    expect(body).toContain("MercyBlade R2 LOGWATCH");
    expect(body).toContain("Count: 1");
    expect(body).toContain("Diagnosis:");
  });
});
