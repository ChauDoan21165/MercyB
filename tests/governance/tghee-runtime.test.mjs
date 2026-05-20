import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const timelinePath = path.join(repoRoot, "docs/placement-v3/governance/tghee-governance-timeline.json");

function runNpm(script, args = []) {
  return spawnSync("npm", ["run", script, "--", ...args], { cwd: repoRoot, encoding: "utf8" });
}

describe("TGHEE runtime", () => {
  it("generates deterministic temporal governance timeline artifacts", () => {
    const result = runNpm("governance:tghee:timeline");
    expect(result.status, result.stderr || result.stdout).toBe(0);
    const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf8"));
    expect(timeline.governance_mode).toBe("blocked_safe_temporal_governance_history");
    expect(timeline.event_count).toBe(15);
    expect(timeline.deterministic_regeneration).toBe(true);
    expect(timeline.final_temporal_decision.production_safe).toBe(false);
    expect(timeline.final_temporal_decision.placement_v3_enablement).toBe("BLOCKED");
    expect(timeline.final_temporal_decision.autonomous_execution).toBe("SUPERVISED_ONLY");
  });

  it("preserves the required fixture hierarchy in generated history", () => {
    runNpm("governance:tghee:timeline");
    const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf8"));
    const groups = timeline.fixture_history_groups.map((fixture) => fixture.group);
    expect(groups).toEqual(
      expect.arrayContaining([
        "replay-storm-history",
        "stale-lineage-history",
        "recursive-collapse-history",
        "branch-domain-history",
        "orphaned-lineage-history",
        "replay-poisoning-history",
        "unresolved-propagation-history",
        "seal-degradation-history",
        "governance-recovery-history",
        "strict-mode-evolution-history",
        "adversarial-rejection-history",
        "canonical-authority-history",
      ]),
    );
  });
});
