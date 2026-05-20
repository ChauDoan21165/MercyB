import { describe, expect, it } from "vitest";
import { buildGovernanceEvents } from "../../scripts/governance/tghee-event-engine.mjs";
import { buildUnresolvedDependencyHistory, enforceDependencyStrict } from "../../scripts/governance/tghee-dependency-evolution.mjs";

describe("TGHEE dependency evolution", () => {
  it("traces dependency origin, propagation, and unresolved state", () => {
    const history = buildUnresolvedDependencyHistory(buildGovernanceEvents());
    expect(() => enforceDependencyStrict(history)).not.toThrow();
    const endurance = history.dependencies.find((item) => item.dependency === "A33 endurance evidence");
    expect(endurance.originated_at_event_id).toBeTruthy();
    expect(endurance.current_state).toBe("unresolved");
    expect(endurance.blocked_streams).toContain("A42");
    expect(history.propagation_waves.map((wave) => wave.wave)).toContain("recursive_reinforcement");
  });
});
