import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";
import {
  DP_INT_V1_FAMILIES,
  DP_INT_V1_FAMILY_TARGETS,
  DP_INT_V1_WORKPACKS,
  validateDpIntV1Workpacks,
} from "../tm-int/seed-dp-int-v1-workpacks.mjs";

const repoRoot = resolve(".");
const factoryScript = join(repoRoot, "scripts/tm-int/dp-int-factory.mjs");
const seedScript = join(repoRoot, "scripts/tm-int/seed-dp-int-v1-workpacks.mjs");
const roots = [];

function makeTempRoot() {
  const root = mkdtempSync(join(tmpdir(), "dp-int-v1-seed-test-"));
  roots.push(root);
  return root;
}

function dbPath(root) {
  return join(root, "dp_int_factory.sqlite3");
}

function runScript(root, script, args = []) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, DP_INT_FACTORY_DB: dbPath(root) },
  });
}

function sqlite(root, statement) {
  return spawnSync("sqlite3", [dbPath(root)], {
    cwd: repoRoot,
    encoding: "utf8",
    input: statement,
  });
}

afterEach(() => {
  while (roots.length > 0) {
    rmSync(roots.pop(), { recursive: true, force: true });
  }
});

describe("DP INT v1 workpack seed", () => {
  it("defines 260 validated workpacks across six families", () => {
    const validation = validateDpIntV1Workpacks(DP_INT_V1_WORKPACKS);

    expect(validation).toMatchObject({
      pass: true,
      count: 260,
      duplicateSemanticKeys: 0,
    });
    expect(validation.errors).toEqual([]);
    for (const family of DP_INT_V1_FAMILIES) {
      expect(validation.familyCounts[family]).toBe(DP_INT_V1_FAMILY_TARGETS[family]);
    }
    expect(DP_INT_V1_WORKPACKS.every((workpack) => workpack.status === "workpack_ready")).toBe(true);
    expect(DP_INT_V1_WORKPACKS.every((workpack) => workpack.verified === 0)).toBe(true);
    expect(DP_INT_V1_WORKPACKS.every((workpack) => workpack.tm_int_id === "DP-INT-v1")).toBe(true);
  });

  it("seeds only workpack_ready rows through the DP factory runtime", () => {
    const root = makeTempRoot();

    expect(runScript(root, factoryScript, ["init"]).status).toBe(0);
    const seed = runScript(root, seedScript);
    expect(seed.status).toBe(0);
    expect(seed.stdout).toContain("validated=260");
    expect(seed.stdout).toContain("seeded=260");

    const counts = sqlite(
      root,
      [
        "select count(*) from dp_int_workpacks;",
        "select count(*) from dp_int_workpacks where status='workpack_ready';",
        "select count(*) from dp_int_workpacks where status='running';",
        "select count(*) from dp_int_workpacks where status='f_done';",
        "select coalesce(sum(verified), 0) from dp_int_workpacks;",
        "select count(*) from dp_int_judge_results;",
      ].join("\n"),
    );
    expect(counts.status).toBe(0);
    expect(counts.stdout.trim().split(/\r?\n/)).toEqual(["260", "260", "0", "0", "0", "0"]);

    const closeout = runScript(root, factoryScript, ["closeout"]);
    expect(closeout.status).toBe(0);
    expect(closeout.stdout).toContain("workpack_ready");
    expect(closeout.stdout).toContain("running");
    expect(closeout.stdout).toContain("f_done");
    expect(closeout.stdout).toContain("verified");
    expect(closeout.stdout).toContain("judge_pass");
    expect(closeout.stdout).toContain("judge_fail");
  });

  it("adds only missing rows and preserves existing F/Judge state", () => {
    const root = makeTempRoot();

    expect(runScript(root, factoryScript, ["init"]).status).toBe(0);
    const firstSixty = DP_INT_V1_WORKPACKS.filter((workpack) => Number(workpack.wp_id.slice(-6)) <= 10);
    const importFile = join(root, "first-sixty.json");
    expect(firstSixty).toHaveLength(60);
    writeFileSync(importFile, JSON.stringify({ workpacks: firstSixty }, null, 2));
    expect(runScript(root, factoryScript, ["import-workpacks", importFile]).status).toBe(0);

    const fDone = sqlite(
      root,
      [
        "update dp_int_workpacks set status='f_done', artifact_path='reports/dp-int/a.md', validation_evidence='tests pass', commit_hash='abc123', f_done_at=datetime('now') where wp_id='DP-FOUNDATION-WP-000001';",
        "insert into dp_int_judge_results(wp_id, judge_status, commit_hash, judge_artifact, validation_summary, anti_fake_summary) values ('DP-FOUNDATION-WP-000001', 'judge_pass', 'abc123', 'reports/dp-int/judge.md', 'pass', 'separate ledger');",
      ].join("\n"),
    );
    expect(fDone.status).toBe(0);

    const seed = runScript(root, seedScript);
    expect(seed.status).toBe(0);
    expect(seed.stdout).toContain("validated=260");
    expect(seed.stdout).toContain("seeded=200");

    const counts = sqlite(
      root,
      [
        "select count(*) from dp_int_workpacks;",
        "select count(*) from dp_int_workpacks where status='workpack_ready';",
        "select count(*) from dp_int_workpacks where status='f_done';",
        "select coalesce(sum(verified), 0) from dp_int_workpacks;",
        "select count(*) from dp_int_judge_results where judge_status='judge_pass';",
        "select status, artifact_path, commit_hash from dp_int_workpacks where wp_id='DP-FOUNDATION-WP-000001';",
      ].join("\n"),
    );
    expect(counts.status).toBe(0);
    expect(counts.stdout.trim().split(/\r?\n/)).toEqual([
      "260",
      "259",
      "1",
      "0",
      "1",
      "f_done|reports/dp-int/a.md|abc123",
    ]);
  });
});
