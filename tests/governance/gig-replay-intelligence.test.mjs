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
});
