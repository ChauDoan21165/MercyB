import { describe, expect, it } from "vitest";
import { buildGovernanceGraph } from "../../scripts/governance/gig-graph-engine.mjs";
import { buildReplayIntelligence } from "../../scripts/governance/gig-replay-intelligence.mjs";

describe("GIG replay intelligence", () => {
  it("keeps replay lineage rejected and explorable", () => {
    const replay = buildReplayIntelligence(buildGovernanceGraph());
    expect(replay.replay_canonical_state).toBe("rejected_non_canonical");
    expect(replay.replay_lineage_nodes.length).toBeGreaterThan(0);
    expect(replay.stale_replay_lineage.length).toBeGreaterThan(0);
  });

  it("surfaces replay contradiction as rejected non-canonical lineage", () => {
    const replay = buildReplayIntelligence(buildGovernanceGraph());
    expect(replay.replay_rejection_edges.length).toBeGreaterThan(0);
    expect(replay.replay_lineage_nodes.every((node) => node.attributes.replay_state !== "canonical")).toBe(true);
  });
});
