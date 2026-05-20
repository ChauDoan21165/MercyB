import { describe, expect, it } from "vitest";
import { buildGovernanceEvents } from "../../scripts/governance/tghee-event-engine.mjs";
import { buildReplayChronology, enforceReplayStrict } from "../../scripts/governance/tghee-replay-chronology.mjs";

describe("TGHEE replay chronology", () => {
  it("keeps stale replay and replay storms rejected historically", () => {
    const chronology = buildReplayChronology(buildGovernanceEvents());
    expect(() => enforceReplayStrict(chronology)).not.toThrow();
    expect(chronology.replay_events.length).toBeGreaterThan(0);
    expect(chronology.replay_events.every((event) => event.replay_state === "rejected_non_canonical")).toBe(true);
    expect(chronology.replay_storms.every((storm) => storm.stale_replay_became_canonical === false)).toBe(true);
  });
});
