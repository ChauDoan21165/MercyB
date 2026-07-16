import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  DECISIONS,
  classifyJob,
  detectDuplicate,
  detectPathLocks,
  evaluateCiState,
  evaluateDispatchGate,
  evaluateMachineHealth,
  pathLockKey,
} from "../../scripts/ops/mf-gate.mjs";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const gateScript = path.join(repoRoot, "scripts/ops/mf-gate.mjs");

describe("MercyForge dispatch gate v1", () => {
  it("classifies Type A docs/reports/evidence jobs and dispatches them to Admin", () => {
    const result = evaluateDispatchGate({
      job: {
        job_id: "907",
        title: "Add Dispatch Gate v1 report",
        paths: ["reports/ops/mercyforge-dispatch-gate-v1.md"],
      },
      context: {
        ci: { gitlabSaturated: true },
      },
    });

    expect(result).toMatchObject({
      decision: DECISIONS.DISPATCH_TO_ADMIN,
      job_type: "Type A",
      recommended_target: "ADMIN",
      path_lock_key: "reports/ops",
    });
    expect(result.risk_flags).toContain("GITLAB_SATURATED");
  });

  it("classifies Type B ops script/test jobs and dispatches to healthy C2 first", () => {
    const result = evaluateDispatchGate({
      job: {
        job_id: "907",
        title: "Add Dispatch Gate v1",
        paths: ["scripts/ops/mf-gate.mjs", "tests/ops/mf-gate.test.mjs"],
      },
      context: {
        machineHealth: {
          runners: [
            { role: "C2", status: "online", diskFreeGb: 80 },
            { role: "C4", status: "online", diskFreeGb: 80 },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      decision: DECISIONS.DISPATCH_TO_C2,
      job_type: "Type B",
      recommended_target: "C2",
      risk_flags: [],
    });
  });

  it("classifies Type C app/product code and prefers C4 when healthy", () => {
    expect(
      evaluateDispatchGate({
        job: { job_id: "product-change", paths: ["src/pages/Home.tsx"] },
        context: {
          machineHealth: { runners: [{ role: "C4", status: "healthy", diskFreeGb: 50 }] },
        },
      }),
    ).toMatchObject({
      decision: DECISIONS.DISPATCH_TO_C4,
      job_type: "Type C",
      recommended_target: "C4",
    });
  });

  it("rejects unsafe Type D paths without owner override and holds them with owner override", () => {
    const rejected = evaluateDispatchGate({
      job: {
        job_id: "unsafe",
        paths: ["auth/session.ts", "supabase/migrations/202606170001_rls.sql", ".env.production", "wrangler.toml"],
      },
    });

    const held = evaluateDispatchGate({
      job: {
        job_id: "owner-directed",
        ownerOverride: true,
        paths: ["billing/checkout.ts"],
      },
    });

    expect(rejected).toMatchObject({
      decision: DECISIONS.REJECT_UNSAFE,
      job_type: "Type D",
      recommended_target: "ADMIN",
    });
    expect(rejected.risk_flags).toEqual(
      expect.arrayContaining([
        "UNSAFE_AUTH",
        "UNSAFE_SQL_RLS_MIGRATIONS",
        "UNSAFE_ENV",
        "UNSAFE_SUPABASE_MIGRATIONS",
        "UNSAFE_WRANGLER",
      ]),
    );
    expect(held).toMatchObject({
      decision: DECISIONS.HOLD_FOR_OWNER,
      job_type: "Type D",
    });
  });

  it("evaluates machine health disk floors, stale worker flags, and runner status inputs", () => {
    const result = evaluateMachineHealth({
      runners: [
        { role: "C2", status: "online", diskFreeGb: 13.9, diskFloorGb: 14 },
        { role: "C4", status: "offline", diskFreeGb: 50 },
        { role: "ADMIN", status: "online", diskFreeGb: 50, staleWorkerProcess: true },
      ],
    });

    expect(result.healthyTargets).toEqual([]);
    expect(result.riskFlags).toEqual(
      expect.arrayContaining(["C2_DISK_BELOW_FLOOR", "C4_RUNNER_OFFLINE", "ADMIN_STALE_WORKER_PROCESS"]),
    );
  });

  it("waits when GitLab is saturated for non-doc work", () => {
    expect(
      evaluateDispatchGate({
        job: { job_id: "ops-change", paths: ["scripts/ops/mf-gate.mjs"] },
        context: {
          ci: { gitlabSaturated: true },
          machineHealth: { runners: [{ role: "C2", status: "online", diskFreeGb: 80 }] },
        },
      }),
    ).toMatchObject({
      decision: DECISIONS.WAIT,
      job_type: "Type B",
      recommended_target: "C2",
    });
  });

  it("treats latest main manual-only deploy jobs as clean and failed automatic jobs as owner hold", () => {
    expect(
      evaluateCiState({
        latestMain: {
          jobs: [
            { name: "lint", status: "success" },
            { name: "production deploy", stage: "production", status: "manual", when: "manual" },
            { name: "production release", stage: "production", status: "created", when: "manual" },
          ],
        },
      }),
    ).toMatchObject({
      mainClean: true,
      failedAutomaticJobs: [],
    });

    expect(
      evaluateDispatchGate({
        job: { job_id: "ops-change", paths: ["scripts/ops/mf-gate.mjs"] },
        context: {
          machineHealth: { runners: [{ role: "C2", status: "online", diskFreeGb: 80 }] },
          ci: {
            latestMain: {
              jobs: [
                { name: "lint", status: "success" },
                { name: "unit", status: "failed" },
                { name: "production deploy", status: "manual", when: "manual" },
              ],
            },
          },
        },
      }),
    ).toMatchObject({
      decision: DECISIONS.HOLD_FOR_OWNER,
      details: {
        ci: {
          failedAutomaticJobs: [{ name: "unit", status: "failed" }],
        },
      },
    });
  });

  it("rejects duplicate/stale jobs by same job id, title, branch, artifacts, MR, and known stale key", () => {
    expect(
      detectDuplicate(
        { job_id: "same-id", title: "Same Title", branch: "ops/same", expectedArtifacts: ["reports/ops/same.md"] },
        {
          activeJobs: [{ job_id: "same-id" }, { title: "Same Title" }, { branch: "ops/same" }],
          artifacts: ["reports/ops/same.md"],
          mergeRequests: [{ iid: 1, state: "closed", sourceBranch: "ops/same" }],
        },
      ),
    ).toMatchObject({
      duplicate: true,
      artifactMatches: ["reports/ops/same.md"],
      activeJobs: expect.any(Array),
      mergeRequests: [{ iid: 1, state: "closed", branch: "ops/same", matchedBy: ["ops/same"] }],
    });

    expect(
      evaluateDispatchGate({
        job: { job_id: "903-success-streak-promotion-v1", paths: ["reports/ops/factory-success-streak-promotion-v1-2026-06-16.md"] },
      }),
    ).toMatchObject({
      decision: DECISIONS.REJECT_DUPLICATE,
      details: {
        duplicate: {
          knownStaleKey: "903-success-streak-promotion-v1",
        },
      },
    });
  });

  it("holds overlapping active path locks and ignores released locks", () => {
    const overlaps = detectPathLocks(["scripts/ops/mf-gate.mjs"], [
      { key: "reports", paths: ["reports/ops"], state: "active" },
      { key: "old-ops", paths: ["scripts/ops"], state: "released" },
      { key: "ops", paths: ["scripts/ops"], owner: "C2", state: "active" },
    ]);

    expect(overlaps).toEqual([{ key: "ops", owner: "C2", state: "active", paths: ["scripts/ops/mf-gate.mjs"] }]);
    expect(
      evaluateDispatchGate({
        job: { job_id: "ops-change", paths: ["scripts/ops/mf-gate.mjs"] },
        context: {
          machineHealth: { runners: [{ role: "C2", status: "online", diskFreeGb: 80 }] },
          pathLocks: [{ key: "ops", paths: ["scripts/ops"], owner: "C2" }],
        },
      }),
    ).toMatchObject({
      decision: DECISIONS.HOLD_FOR_OWNER,
      path_lock_key: "scripts/ops",
    });
  });

  it("exports deterministic job classification and path lock keys", () => {
    expect(classifyJob({ paths: ["reports/ops/a.md", "docs/b.md"] })).toMatchObject({ code: "A" });
    expect(classifyJob({ paths: ["scripts/ops/a.mjs", "tests/ops/a.test.mjs"] })).toMatchObject({ code: "B" });
    expect(classifyJob({ paths: ["src/App.tsx"] })).toMatchObject({ code: "C" });
    expect(pathLockKey(["tests/ops/b.test.mjs", "scripts/ops/a.mjs"])).toBe("scripts/ops+tests/ops");
  });

  it("can run as a CLI from stdin or file path and emits the v1 JSON contract", () => {
    const stdinRun = spawnSync(
      "node",
      [gateScript],
      {
        cwd: repoRoot,
        encoding: "utf8",
        input: JSON.stringify({
          job: { job_id: "907", paths: ["scripts/ops/mf-gate.mjs"] },
          context: { machineHealth: { runners: [{ role: "C2", status: "online", diskFreeGb: 80 }] } },
        }),
      },
    );
    expect(stdinRun.status).toBe(0);
    expect(JSON.parse(stdinRun.stdout)).toMatchObject({
      decision: DECISIONS.DISPATCH_TO_C2,
      reason: expect.any(String),
      job_type: "Type B",
      risk_flags: [],
      path_lock_key: "scripts/ops",
      recommended_target: "C2",
    });

    const tmpFile = path.join(os.tmpdir(), `mf-gate-${Date.now()}.json`);
    fs.writeFileSync(
      tmpFile,
      JSON.stringify({
        job: { job_id: "unsafe", paths: ["secrets/api-key.txt"] },
      }),
    );
    const fileRun = spawnSync("node", [gateScript, tmpFile], { cwd: repoRoot, encoding: "utf8" });
    fs.rmSync(tmpFile, { force: true });

    expect(fileRun.status).toBe(2);
    expect(JSON.parse(fileRun.stdout)).toMatchObject({
      decision: DECISIONS.REJECT_UNSAFE,
      job_type: "Type D",
      recommended_target: "ADMIN",
    });
  });
});
