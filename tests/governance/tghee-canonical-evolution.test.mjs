import { describe, expect, it } from "vitest";
import { buildGovernanceEvents } from "../../scripts/governance/tghee-event-engine.mjs";
import { buildCanonicalAuthorityHistory, enforceCanonicalStrict } from "../../scripts/governance/tghee-canonical-evolution.mjs";

describe("TGHEE canonical evolution", () => {
  it("keeps canonical authority on A46 and rejects branch contamination", () => {
    const history = buildCanonicalAuthorityHistory(buildGovernanceEvents());
    expect(() => enforceCanonicalStrict(history)).not.toThrow();
    expect(history.canonical_authority).toBe("A46 convergence governance");
    expect(history.branch_domain_history.branch_domain_isolation).toBe("preserved");
    expect(history.branch_domain_history.cross_branch_contamination).toBe("rejected");
    expect(history.authority_transitions.every((transition) => transition.stale_lineage_authority === "rejected")).toBe(true);
  });
});
