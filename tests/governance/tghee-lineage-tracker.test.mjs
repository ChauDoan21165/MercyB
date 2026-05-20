import { describe, expect, it } from "vitest";
import { buildGovernanceEvents } from "../../scripts/governance/tghee-event-engine.mjs";
import { buildLineageEvolutionMap, enforceLineageStrict } from "../../scripts/governance/tghee-lineage-tracker.mjs";

describe("TGHEE lineage tracker", () => {
  it("preserves unresolved dependency lineage and A46 supersession", () => {
    const lineage = buildLineageEvolutionMap(buildGovernanceEvents());
    expect(() => enforceLineageStrict(lineage)).not.toThrow();
    expect(lineage.orphaned_lineage_policy).toContain("reject");
    expect(lineage.stale_lineage_policy).toContain("reject");
    expect(lineage.streams.find((stream) => stream.stream === "A42").superseded_by).toBe("A46 convergence governance");
    expect(lineage.unresolved_dependencies_preserved).toContain("A33 endurance evidence");
  });
});
