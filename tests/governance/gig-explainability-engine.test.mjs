import { describe, expect, it } from "vitest";
import { buildGovernanceGraph } from "../../scripts/governance/gig-graph-engine.mjs";
import { buildGraphQueries } from "../../scripts/governance/gig-query-engine.mjs";

describe("GIG explainability engine", () => {
  it("answers why blocked, stale, rejected, canonical, and unresolved", () => {
    const queries = buildGraphQueries(buildGovernanceGraph());
    const explain = queries.explainability;
    expect(explain.why_blocked).toContain("Unresolved dependencies");
    expect(explain.why_stale).toContain("Stale artifacts");
    expect(explain.why_rejected).toContain("Strict-mode");
    expect(explain.why_canonical).toContain("A46");
    expect(explain.why_unresolved.length).toBeGreaterThan(0);
    expect(explain.blocked_safe_introspection.production_safe).toBe(false);
  });
});
