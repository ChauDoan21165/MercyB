import { describe, expect, it } from "vitest";
import { buildGovernanceChronology } from "../../scripts/governance/gig-chronology-engine.mjs";
import { buildGovernanceGraph } from "../../scripts/governance/gig-graph-engine.mjs";

describe("GIG chronology engine", () => {
  it("preserves deterministic event ordering", () => {
    const chronology = buildGovernanceChronology(buildGovernanceGraph());
    expect(chronology.deterministic_ordering).toBe(true);
    expect(chronology.events.map((event) => event.ordinal)).toEqual([...chronology.events.map((event) => event.ordinal)].sort((a, b) => a - b));
  });
});
