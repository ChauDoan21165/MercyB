import { describe, expect, it } from "vitest";
import { buildGovernanceGraph } from "../../scripts/governance/gig-graph-engine.mjs";
import { buildSealIntelligence } from "../../scripts/governance/gig-seal-intelligence.mjs";

describe("GIG seal intelligence", () => {
  it("keeps seal degradation connected to blocked-safe continuity", () => {
    const seal = buildSealIntelligence(buildGovernanceGraph());
    expect(seal.seal_continuity).toBe("blocked_safe_preserved");
    expect(seal.seal_nodes.length).toBeGreaterThan(0);
    expect(seal.degraded_seals.length).toBeGreaterThan(0);
  });
});
