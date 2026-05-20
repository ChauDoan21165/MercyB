import { describe, expect, it } from "vitest";
import { buildGovernanceCausality } from "../../scripts/governance/gig-causality-engine.mjs";
import { buildGovernanceGraph } from "../../scripts/governance/gig-graph-engine.mjs";

describe("GIG causality engine", () => {
  it("makes blocked-safe causality machine-readable", () => {
    const causality = buildGovernanceCausality(buildGovernanceGraph());
    expect(causality.machine_readable).toBe(true);
    expect(causality.causality_edges.length).toBeGreaterThan(0);
    expect(causality.current_denial_causes.some((cause) => /strict|denial|recovery/i.test(cause.label))).toBe(true);
  });
});
