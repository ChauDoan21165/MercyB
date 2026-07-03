import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const repoRoot = resolve(".");
const scriptPath = join(repoRoot, "scripts/factory/factory-runtime.mjs");
const roots = [];

function makeTempRoot() {
  const root = mkdtempSync(join(tmpdir(), "factory-runtime-"));
  roots.push(root);
  return root;
}

function dbPath(root) {
  return join(root, "factory_runtime.sqlite");
}

function run(root, args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, FACTORY_RUNTIME_DB: dbPath(root) },
  });
}

function sqlite(root, statement) {
  return spawnSync("sqlite3", [dbPath(root)], {
    cwd: repoRoot,
    encoding: "utf8",
    input: statement,
  });
}

function writeWorkpacks(root) {
  const file = join(root, "workpacks.json");
  writeFileSync(
    file,
    JSON.stringify(
      [
        {
          wp_id: "WP-T-001",
          semantic_key: "test.one",
          source_files: ["src/example.ts"],
          objective: "Harden the example boundary.",
          acceptance_tests: "Focused unit test passes.",
          validation_commands: ["npx eslint src/example.ts", "npx vitest run src/example.test.ts"],
          anti_fake_checks: ["no skipped tests", "no report-only progress"],
        },
      ],
      null,
      2,
    ),
  );
  return file;
}

function setupLane() {
  const root = makeTempRoot();
  expect(run(root, ["init-lane", "lane-test"]).status).toBe(0);
  expect(run(root, ["import-workpacks", "lane-test", writeWorkpacks(root)]).status).toBe(0);
  return root;
}

afterEach(() => {
  while (roots.length > 0) {
    rmSync(roots.pop(), { recursive: true, force: true });
  }
});

describe("factory-runtime schema constraints", () => {
  it("prevents F queue verified from being set to 1", () => {
    const root = setupLane();
    const result = sqlite(root, "update factory_workpacks set verified=1 where lane_id='lane-test' and wp_id='WP-T-001';");
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("F queue verified is locked to 0");
  });

  it("prevents F queue status from becoming verified", () => {
    const root = setupLane();
    const result = sqlite(root, "update factory_workpacks set status='verified' where lane_id='lane-test' and wp_id='WP-T-001';");
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("F queue status cannot be verified");
  });

  it("requires artifact and evidence for f_done", () => {
    const root = setupLane();
    expect(run(root, ["claim", "lane-test", "WP-T-001", "F"]).status).toBe(0);
    const result = sqlite(root, "update factory_workpacks set status='f_done' where lane_id='lane-test' and wp_id='WP-T-001';");
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("CHECK constraint failed");
  });

  it("keeps F verified at 0 when Judge records a pass", () => {
    const root = setupLane();
    expect(run(root, ["claim", "lane-test", "WP-T-001", "F"]).status).toBe(0);
    expect(run(root, ["f-done", "lane-test", "WP-T-001", "reports/f_done/test.md", "reports/f_done/test-validation.md", "abc1234"]).status).toBe(0);
    expect(run(root, ["judge-pass", "lane-test", "WP-T-001", "reports/judge/test.md", "abc1234"]).status).toBe(0);

    const result = sqlite(
      root,
      "select verified from factory_workpacks where lane_id='lane-test' and wp_id='WP-T-001'; select judge_status from factory_judge_results where lane_id='lane-test' and wp_id='WP-T-001';",
    );
    expect(result.status).toBe(0);
    expect(result.stdout.trim().split(/\r?\n/)).toEqual(["0", "judge_pass"]);
  });
});

describe("factory-runtime dashboard", () => {
  it("closeout separates f_done and judge_pass counts", () => {
    const root = setupLane();
    expect(run(root, ["claim", "lane-test", "WP-T-001", "F"]).status).toBe(0);
    expect(run(root, ["f-done", "lane-test", "WP-T-001", "artifact.md", "evidence.md", "abc1234"]).status).toBe(0);
    expect(run(root, ["judge-pass", "lane-test", "WP-T-001", "judge.md", "abc1234"]).status).toBe(0);
    const result = run(root, ["closeout", "lane-test"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("f_done");
    expect(result.stdout).toContain("judge_pass");
    expect(result.stdout).toContain("f_done_without_judge");
  });
});
