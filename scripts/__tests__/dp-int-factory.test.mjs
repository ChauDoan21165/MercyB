import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const repoRoot = resolve(".");
const scriptPath = join(repoRoot, "scripts/tm-int/dp-int-factory.mjs");
const roots = [];

function makeTempRoot() {
  const root = mkdtempSync(join(tmpdir(), "dp-int-factory-"));
  roots.push(root);
  return root;
}

function dbPath(root) {
  return join(root, "dp_int_factory.sqlite3");
}

function run(root, args, extraEnv = {}) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, DP_INT_FACTORY_DB: dbPath(root), ...extraEnv },
  });
}

function sqlite(root, statement) {
  return spawnSync("sqlite3", [dbPath(root)], {
    cwd: repoRoot,
    encoding: "utf8",
    input: statement,
  });
}

function git(args) {
  return spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

function writeWorkpacks(root, overrides = {}) {
  const file = join(root, "workpacks.json");
  writeFileSync(
    file,
    JSON.stringify(
      {
        workpacks: [
          {
            wp_id: "DP-WP-001",
            semantic_key: "dp.contract.product_failure_guard",
            tm_int_id: "DP-FAC-001",
            source_file: "src/lib/tm-int/dp/dpValidator.ts",
            source_line: "1",
            source_anchor_excerpt: "validateDpDecision",
            related_test_or_replay_file: "src/lib/tm-int/dp/__tests__/dpValidator.test.ts",
            objective: "DP decisions cite evidence before claims.",
            expected_product_value: "Unsupported learner claims are blocked before PED acts.",
            acceptance_tests: ["npm test -- --run src/lib/tm-int/dp"],
            judge_checks: ["F verified remains zero", "Judge result is separate"],
            anti_fake_checks: ["no report-only progress", "no skipped tests"],
            status: "workpack_ready",
            verified: 0,
            ...overrides,
          },
        ],
      },
      null,
      2,
    ),
  );
  return file;
}

function setupImported(root = makeTempRoot()) {
  expect(run(root, ["init"]).status).toBe(0);
  expect(run(root, ["import-workpacks", writeWorkpacks(root)]).status).toBe(0);
  return root;
}

afterEach(() => {
  while (roots.length > 0) {
    rmSync(roots.pop(), { recursive: true, force: true });
  }
});

describe("DP INT factory control plane", () => {
  it("init creates schema", () => {
    const root = makeTempRoot();
    expect(run(root, ["init"]).status).toBe(0);

    const result = sqlite(root, ".tables");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("dp_int_workpacks");
    expect(result.stdout).toContain("dp_int_f_events");
    expect(result.stdout).toContain("dp_int_judge_results");
    expect(result.stdout).toContain("dp_int_claimable");
  });

  it("workpack import validates required fields", () => {
    const root = makeTempRoot();
    expect(run(root, ["init"]).status).toBe(0);
    const result = run(root, ["import-workpacks", writeWorkpacks(root, { semantic_key: "" })]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("workpacks[0].semantic_key");
  });

  it("workpack import requires workpack_ready seed status", () => {
    const root = makeTempRoot();
    expect(run(root, ["init"]).status).toBe(0);
    const result = run(root, ["import-workpacks", writeWorkpacks(root, { status: "running" })]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("status must be workpack_ready");
  });

  it("workpack import requires verified=0 seed value", () => {
    const root = makeTempRoot();
    expect(run(root, ["init"]).status).toBe(0);
    const result = run(root, ["import-workpacks", writeWorkpacks(root, { verified: 1 })]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("verified must be 0");
  });

  it("claim uses atomic running transition", () => {
    const root = setupImported();
    const first = run(root, ["claim", "DP-WP-001", "F-1"]);
    const second = run(root, ["claim", "DP-WP-001", "F-2"]);

    expect(first.status).toBe(0);
    expect(first.stdout).toContain("running");
    expect(first.stdout).toContain("F-1");
    expect(second.status).toBe(0);

    const result = sqlite(root, "select status, claimed_by from dp_int_workpacks where wp_id='DP-WP-001'; select count(*) from dp_int_f_events where event_type='claim';");
    expect(result.stdout.trim().split(/\r?\n/)).toEqual(["running|F-1", "1"]);
  });

  it("F refuses to claim while Judge ledger DB mutation is uncommitted", () => {
    const root = setupImported();
    const result = run(root, ["claim", "DP-WP-001", "F-1"], {
      DP_INT_FACTORY_TEST_GIT_STATUS: " M state/dp_int_factory.sqlite3",
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("F cannot claim workpacks until git status is clean");
    expect(result.stderr).toContain("state/dp_int_factory.sqlite3");
  });

  it("Judge/Admin cleanup is required before F resumes", () => {
    const root = setupImported();
    const blocked = run(root, ["claim", "DP-WP-001", "F-1"], {
      DP_INT_FACTORY_TEST_GIT_STATUS: " M state/dp_int_factory.sqlite3",
    });
    const resumed = run(root, ["claim", "DP-WP-001", "F-1"]);

    expect(blocked.status).not.toBe(0);
    expect(resumed.status).toBe(0);
    expect(resumed.stdout).toContain("running");
  });

  it("f-done requires artifact/evidence/commit", () => {
    const root = setupImported();
    expect(run(root, ["claim", "DP-WP-001", "F-1"]).status).toBe(0);
    const missingCommit = run(root, ["f-done", "DP-WP-001", "artifact.md", "validation.md", ""]);

    expect(missingCommit.status).not.toBe(0);
    expect(missingCommit.stderr).toContain("commit_hash");
  });

  it("F cannot set verified=1", () => {
    const root = setupImported();
    const result = sqlite(root, "update dp_int_workpacks set verified=1 where wp_id='DP-WP-001';");

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("DP INT F queue cannot mark workpacks verified");
  });

  it("F cannot use status=verified", () => {
    const root = setupImported();
    const result = sqlite(root, "update dp_int_workpacks set status='verified' where wp_id='DP-WP-001';");

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("DP INT F queue status cannot be verified");
  });

  it("F cannot write judge status into workpack row", () => {
    const root = setupImported();
    const result = sqlite(root, "update dp_int_workpacks set status='judge_pass' where wp_id='DP-WP-001';");

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("CHECK constraint failed");
  });

  it("judge-pass writes separate Judge result", () => {
    const root = setupImported();
    expect(run(root, ["claim", "DP-WP-001", "F-1"]).status).toBe(0);
    expect(run(root, ["f-done", "DP-WP-001", "artifact.md", "validation.md", "abc1234"]).status).toBe(0);
    expect(run(root, ["judge-pass", "DP-WP-001", "judge.md", "abc1234"]).status).toBe(0);

    const result = sqlite(root, "select verified from dp_int_workpacks where wp_id='DP-WP-001'; select judge_status from dp_int_judge_results where wp_id='DP-WP-001';");
    expect(result.stdout.trim().split(/\r?\n/)).toEqual(["0", "judge_pass"]);
  });

  it("judge-fail writes separate Judge result", () => {
    const root = setupImported();
    expect(run(root, ["judge-fail", "DP-WP-001", "judge-fail.md", "abc1234"]).status).toBe(0);

    const result = sqlite(root, "select verified from dp_int_workpacks where wp_id='DP-WP-001'; select judge_status from dp_int_judge_results where wp_id='DP-WP-001';");
    expect(result.stdout.trim().split(/\r?\n/)).toEqual(["0", "judge_fail"]);
  });

  it("verify-final promotes only through verifier authorization", () => {
    const root = setupImported();
    const commit = git(["rev-parse", "HEAD"]).stdout.trim();
    const artifact = "scripts/tm-int/dp-int-factory.mjs";
    const reportPath = join(root, "final-report.md");

    expect(run(root, ["claim", "DP-WP-001", "F-1"]).status).toBe(0);
    expect(run(root, ["f-done", "DP-WP-001", artifact, "validation passed", commit]).status).toBe(0);
    expect(run(root, ["judge-pass", "DP-WP-001", artifact, commit]).status).toBe(0);
    expect(run(root, ["verify-final", reportPath]).status).toBe(0);

    const blocked = sqlite(root, "update dp_int_workpacks set verified=0 where wp_id='DP-WP-001';");
    expect(blocked.status).not.toBe(0);
    expect(blocked.stderr).toContain("DP INT F queue cannot mark workpacks verified");

    const result = sqlite(root, "select verified from dp_int_workpacks where wp_id='DP-WP-001'; select verified_count from dp_int_verified_promotions;");
    expect(result.stdout.trim().split(/\r?\n/)).toEqual(["1", "1"]);
  });

  it("closeout reports ready/running/f_done/judge_pass/judge_fail/f_done_unjudged", () => {
    const root = setupImported();
    expect(run(root, ["claim", "DP-WP-001", "F-1"]).status).toBe(0);
    expect(run(root, ["f-done", "DP-WP-001", "artifact.md", "validation.md", "abc1234"]).status).toBe(0);
    expect(run(root, ["judge-pass", "DP-WP-001", "judge.md", "abc1234"]).status).toBe(0);
    const output = run(root, ["closeout"]);

    expect(output.status).toBe(0);
    expect(output.stdout).toContain("f_done");
    expect(output.stdout).toContain("judge_pass");
    expect(output.stdout).toContain("judge_fail");
    expect(output.stdout).toContain("f_done_unjudged");
  });
});
