import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const graphPath = path.join(root, "docs/placement-v3/governance/gig-governance-intelligence-graph.json");

function run(script, args = []) {
  return spawnSync("npm", ["run", script, "--", ...args], { cwd: root, encoding: "utf8" });
}

describe("GIG runtime", () => {
  it("generates the canonical governance intelligence graph", () => {
    const result = run("governance:gig:runtime");
    expect(result.status, result.stderr || result.stdout).toBe(0);
    const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));
    expect(graph.final_graph_decision.graph_queryable).toBe(true);
    expect(graph.final_graph_decision.production_safe).toBe(false);
    expect(graph.final_graph_decision.placement_v3_enablement).toBe("BLOCKED");
    expect(graph.final_graph_decision.autonomous_execution).toBe("SUPERVISED_ONLY");
    expect(graph.nodes.length).toBeGreaterThan(50);
    expect(graph.edges.length).toBeGreaterThan(100);
  });

  it("keeps required fixture groups visible in graph output", () => {
    run("governance:gig:runtime");
    const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));
    const groups = graph.fixture_history_groups.map((fixture) => fixture.group);
    expect(groups).toEqual(expect.arrayContaining(["replay-storm-history", "stale-authority-history", "canonical-identity-fork-history"]));
  });
});
