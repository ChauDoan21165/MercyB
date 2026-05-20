import { describe, expect, it } from "vitest";
import { TGHEE_BLOCKED_SAFE, assertDeterministicEvents, buildGovernanceEvents } from "../../scripts/governance/tghee-event-engine.mjs";

describe("TGHEE event engine", () => {
  it("builds stable event IDs and ordered causality", () => {
    const first = buildGovernanceEvents();
    const second = buildGovernanceEvents();
    expect(first.map((event) => event.event_id)).toEqual(second.map((event) => event.event_id));
    expect(() => assertDeterministicEvents(first)).not.toThrow();
    expect(first.map((event) => event.type)).toEqual(
      expect.arrayContaining([
        "denial introduced",
        "stale replay rejected",
        "seal restored",
        "canonical authority changed",
        "deterministic regeneration verified",
      ]),
    );
  });

  it("keeps blocked-safe fields on every historical event", () => {
    for (const event of buildGovernanceEvents()) {
      expect(event.blocked_safe_after_event).toEqual(TGHEE_BLOCKED_SAFE);
      expect(event.readiness_allowed_after_event).toBe(false);
      expect(event.release_allowed_after_event).toBe(false);
    }
  });
});
