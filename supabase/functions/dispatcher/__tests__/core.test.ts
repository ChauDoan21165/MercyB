import { describe, expect, it } from "vitest";

import {
  buildDigestEmail,
  buildIncidentEmail,
  incidentKeyFor,
  normalizeAlert,
  shouldAlert,
} from "../core.ts";

describe("dispatcher core", () => {
  it("normalizes robot aliases and dedupes cross-robot incidents by signature", () => {
    const r1 = normalizeAlert({
      robot: "client-error-alert",
      severity: "p1",
      signature: " POST /api/mercy-ai -> 502  ",
      summary: "Real users hit 502",
      evidence_url: "https://example.test/r1",
    }, new Date("2026-07-12T10:00:00Z"));
    const r2 = normalizeAlert({
      robot: "r2-logwatch",
      severity: "high",
      signature: "post /api/mercy-ai -> 502",
      summary: "Pages function logged 502",
      evidence_url: "https://example.test/r2",
    }, new Date("2026-07-12T10:01:00Z"));

    expect(r1.robot).toBe("R1 SENTINEL");
    expect(r2.robot).toBe("R2 LOGWATCH");
    expect(r1.severity).toBe("high");
    expect(r1.incidentKey).toBe(r2.incidentKey);
    expect(incidentKeyFor(r1.signature)).toBe("post /api/mercy-ai -> 502");
  });

  it("routes high and critical to incident email while digesting lower severities", () => {
    expect(shouldAlert("critical", "high")).toBe(true);
    expect(shouldAlert("high", "high")).toBe(true);
    expect(shouldAlert("medium", "high")).toBe(false);
    expect(shouldAlert("low", "high")).toBe(false);
  });

  it("builds a single incident email with robots and evidence", () => {
    const alert = normalizeAlert({
      robot: "r1",
      severity: "high",
      signature: "POST /api/mercy-ai -> 502",
      summary: "Roleplay turns fail",
      evidence_url: "https://example.test/trace",
    }, new Date("2026-07-12T10:00:00Z"));

    const email = buildIncidentEmail({
      incidentId: "incident-1",
      alert,
      eventCount: 2,
      robots: ["R1 SENTINEL", "R2 LOGWATCH"],
      firstSeenAt: "2026-07-12T10:00:00.000Z",
      lastSeenAt: "2026-07-12T10:02:00.000Z",
    });

    expect(email.subject).toContain("MercyBlade R1 SENTINEL");
    expect(email.text).toContain("Robots: R1 SENTINEL, R2 LOGWATCH");
    expect(email.text).toContain("Evidence: https://example.test/trace");
    expect(email.text).toContain("Dispatcher");
  });

  it("groups below-threshold events into a daily digest", () => {
    const first = normalizeAlert({
      robot: "r0",
      severity: "medium",
      signature: "journey retry succeeded",
      summary: "One transient retry",
    }, new Date("2026-07-12T10:00:00Z"));
    const second = normalizeAlert({
      robot: "r2",
      severity: "low",
      signature: "journey retry succeeded",
      summary: "Same weak signal from logs",
    }, new Date("2026-07-12T10:05:00Z"));

    const digest = buildDigestEmail({
      events: [first, second],
      since: "2026-07-12T00:00:00.000Z",
      until: "2026-07-13T00:00:00.000Z",
    });

    expect(digest.subject).toContain("2 below-threshold events");
    expect(digest.text).toContain("Signatures: 1");
    expect(digest.text).toContain("Robots: R0 WALKER, R2 LOGWATCH");
    expect(digest.text).toContain("Count: 2");
  });
});
