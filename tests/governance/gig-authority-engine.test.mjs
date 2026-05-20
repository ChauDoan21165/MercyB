import { describe, expect, it } from "vitest";
import { buildAuthorityIntelligence } from "../../scripts/governance/gig-authority-engine.mjs";
import { buildGovernanceGraph } from "../../scripts/governance/gig-graph-engine.mjs";

describe("GIG authority engine", () => {
  it("explains canonical authority and branch-domain isolation", () => {
    const authority = buildAuthorityIntelligence(buildGovernanceGraph());
    expect(authority.canonical_owner).toBe("A46 convergence governance");
    expect(authority.branch_domain_isolation).toBe("preserved");
    expect(authority.forked_identity_policy).toContain("reject");
  });
});
