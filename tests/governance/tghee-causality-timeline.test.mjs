import { describe, expect, it } from "vitest";
import { buildGovernanceEvents } from "../../scripts/governance/tghee-event-engine.mjs";
import { buildCausalityTimeline, enforceCausalityStrict } from "../../scripts/governance/tghee-causality-timeline.mjs";

describe("TGHEE causality timeline", () => {
  it("keeps root denial and current blocked-safe cause traceable", () => {
    const timeline = buildCausalityTimeline(buildGovernanceEvents());
    expect(() => enforceCausalityStrict(timeline)).not.toThrow();
    expect(timeline.root_denial_cause).toBeTruthy();
    expect(timeline.current_blocked_safe_cause).toBeTruthy();
    expect(timeline.current_blocked_safe_posture.production_safe).toBe(false);
    expect(timeline.causality_chain.every((event) => event.blocked_safe_after_event.production_safe === false)).toBe(true);
  });
});
