import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const artifact = "docs/placement-v3/governance/a46-recursive-governance-collapse-simulator.json";
const fixtureDir = "tests/governance/fixtures/a46-recursive-collapse";

function runNpm(script, args = []) {
  return spawnSync("npm", ["run", script, "--", ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

function readReport() {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, artifact), "utf8"));
}

function expectBlockedSafeDecision(decision) {
  expect(decision.recursive_governance_survived).toBe(true);
  expect(decision.blocked_safe_preserved).toBe(true);
  expect(decision.readiness_allowed).toBe(false);
  expect(decision.release_allowed).toBe(false);
  expect(decision.production_safe).toBe(false);
  expect(decision.production_readiness).toBe(false);
  expect(decision.placement_v3_enabled).toBe(false);
  expect(decision.placement_v3_enablement).toBe("BLOCKED");
  expect(decision.live_validation_complete).toBe(false);
  expect(decision.live_provider_validated).toBe(false);
  expect(decision.provider_drift_measured).toBe(false);
  expect(decision.production_persistence_validated).toBe(false);
  expect(decision.writes_production_data).toBe(false);
  expect(decision.autonomous_execution).toBe("SUPERVISED_ONLY");
  expect(decision.do_not_enable_continuity).toBe(true);
}

describe("A46 recursive governance collapse simulator", () => {
  it("has the required recursive adversarial fixture inventory", () => {
    const files = fs.readdirSync(path.join(repoRoot, fixtureDir)).filter((file) => file.endsWith(".json"));
    expect(files).toEqual(
      expect.arrayContaining([
        "recursive-seal-fracture-level-1.json",
        "recursive-seal-fracture-level-2.json",
        "recursive-seal-fracture-level-3.json",
        "recursive-seal-self-reference-loop.json",
        "recursive-seal-canonical-overwrite.json",
        "replayed-governance-snapshot-wave-1.json",
        "replayed-governance-snapshot-wave-2.json",
        "replayed-governance-snapshot-wave-3.json",
        "stale-convergence-matrix-recursion.json",
        "stale-idempotency-recursion.json",
        "erased-a2-lineage-recursion.json",
        "erased-a33-lineage-recursion.json",
        "erased-a47-lineage-recursion.json",
        "erased-a49-lineage-recursion.json",
        "recursive-taxonomy-collapse.json",
        "recursive-provider-certification.json",
        "recursive-replay-certification.json",
        "recursive-persistence-validation.json",
        "recursive-release-approval.json",
        "recursive-autonomous-execution-escalation.json",
        "recursive-placement-enablement.json",
        "recursive-cross-branch-seal-copy.json",
        "recursive-canonical-identity-fork.json",
        "recursive-branch-domain-conflict.json",
        "recursive-orphaned-reconciliation.json",
        "recursive-distributed-worktree-conflict.json",
        "suppression-removal-wave-1.json",
        "suppression-removal-wave-2.json",
        "suppression-removal-wave-3.json",
        "suppression-inversion-attack.json",
      ]),
    );
  });

  it("generates recursive collapse simulation artifacts with blocked-safe final decision", () => {
    const result = runNpm("governance:a46:recursive-collapse-simulator");
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(fs.existsSync(path.join(repoRoot, artifact))).toBe(true);
    expect(fs.existsSync(path.join(repoRoot, artifact.replace(".json", ".md")))).toBe(true);

    const report = readReport();
    expect(report.simulation_id).toMatch(/^a46-recursive-collapse-/);
    expect(report.governance_mode).toBe("blocked_safe_recursive_collapse_simulation");
    expect(report.recursive_iteration_count).toBe(3);
    expect(report.recursive_corruption_inventory.length).toBeGreaterThanOrEqual(30);
    expectBlockedSafeDecision(report.final_governance_decision);
  });

  it("rejects recursive readiness, provider, replay, persistence, release, and autonomous attacks", () => {
    runNpm("governance:a46:recursive-collapse-simulator");
    const report = readReport();
    const readinessIds = report.recursive_readiness_attack_results.map((result) => result.id);

    expect(readinessIds).toEqual(
      expect.arrayContaining([
        "recursive-provider-certification",
        "recursive-replay-certification",
        "recursive-persistence-validation",
        "recursive-release-approval",
        "recursive-autonomous-execution-escalation",
        "recursive-placement-enablement",
      ]),
    );
    expect(report.recursive_readiness_attack_results.every((result) => result.rejected)).toBe(true);
    expect(report.recursive_readiness_attack_results.every((result) => result.accepted_as_canonical === false)).toBe(
      true,
    );
  });

  it("rejects recursive seal corruption, stale replay storms, and lineage collapse", () => {
    runNpm("governance:a46:recursive-collapse-simulator");
    const report = readReport();

    expect(report.recursive_seal_integrity_results.every((result) => result.rejected)).toBe(true);
    expect(report.recursive_replay_inventory.every((result) => result.rejected)).toBe(true);
    expect(report.recursive_lineage_integrity_results.every((result) => result.rejected)).toBe(true);
    expect(report.recursive_failure_taxonomy).toHaveProperty("seal_self_reference_loop");
    expect(report.recursive_failure_taxonomy).toHaveProperty("canonical_seal_overwrite");
    expect(report.recursive_failure_taxonomy).toHaveProperty("stale_replay_rejected");
    expect(Object.keys(report.recursive_failure_taxonomy).some((key) => key.startsWith("dependency_erasure:"))).toBe(
      true,
    );
  });

  it("rejects recursive branch-domain poisoning, canonical identity takeover, and suppression attacks", () => {
    runNpm("governance:a46:recursive-collapse-simulator");
    const report = readReport();

    expect(report.recursive_branch_domain_results.every((result) => result.rejected)).toBe(true);
    expect(report.recursive_canonical_identity_results.length).toBeGreaterThan(0);
    expect(report.recursive_canonical_identity_results.every((result) => result.accepted_as_canonical === false)).toBe(
      true,
    );
    expect(report.recursive_suppression_integrity_results.every((result) => result.rejected)).toBe(true);
    expect(report.blocked_safe_posture.unsupported_readiness_suppression_continuity_preserved).toBe(true);
  });

  it("models sequential, concurrent, and poisoned replay regeneration waves", () => {
    runNpm("governance:a46:recursive-collapse-simulator");
    const report = readReport();

    expect(report.recursive_regeneration_results.map((round) => round.mode)).toEqual([
      "sequential_recursive_corruption",
      "concurrent_recursive_corruption",
      "poisoned_replay_regeneration",
    ]);
    expect(report.recursive_regeneration_results.every((round) => round.blocked_safe_preserved)).toBe(true);
    expect(report.recursive_regeneration_results.every((round) => round.accepted_canonical_count === 0)).toBe(true);
  });

  it("passes strict mode while all recursive corruption remains rejected", () => {
    const result = runNpm("governance:a46:recursive-collapse-simulator", ["--strict"]);
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain("strict mode passed");
  });

  it("is integrated into A46 auto and governance validation", () => {
    const autoResult = runNpm("governance:a46:auto", ["--strict"]);
    expect(autoResult.status, autoResult.stderr || autoResult.stdout).toBe(0);
    expect(`${autoResult.stdout}\n${autoResult.stderr}`).toContain("recursive governance collapse resisted");

    const validateResult = runNpm("governance:validate");
    expect(validateResult.status, validateResult.stderr || validateResult.stdout).toBe(0);
    expect(`${validateResult.stdout}\n${validateResult.stderr}`).toContain(
      "recursive governance collapse simulator validation passed",
    );
  });
});
