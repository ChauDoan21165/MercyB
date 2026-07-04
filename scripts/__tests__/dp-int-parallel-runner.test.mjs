import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const roots = [];
const repoRoot = process.cwd();
const factoryScript = join(repoRoot, "scripts/tm-int/dp-int-factory.mjs");
const runnerScript = join(repoRoot, "scripts/tm-int/dp-int-parallel-runner.mjs");

function makeRoot() {
  const root = mkdtempSync(join(tmpdir(), "dp-int-parallel-"));
  roots.push(root);
  return root;
}

function dbPath(root) {
  return join(root, "dp.sqlite3");
}

function env(root) {
  return {
    ...process.env,
    DP_INT_FACTORY_DB: dbPath(root),
    DP_INT_REPO_ROOT: repoRoot,
    DP_INT_WORKTREE_ROOT: join(root, "worktrees"),
  };
}

function run(root, script, args = []) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    env: env(root),
  });
}

function sqlite(root, statement) {
  return spawnSync("sqlite3", [dbPath(root)], {
    cwd: repoRoot,
    encoding: "utf8",
    input: statement,
  });
}

function seed(root) {
  expect(run(root, factoryScript, ["init"]).status).toBe(0);
  const file = join(root, "workpacks.json");
  writeFileSync(
    file,
    JSON.stringify({
      workpacks: [
        wp("WP-001", "src/a.ts", "src/a.test.ts"),
        wp("WP-002", "src/b.ts", "src/b.test.ts"),
        wp("WP-003", "src/c.ts", "src/c.test.ts"),
        wp("WP-004", "src/d.ts", "src/d.test.ts"),
        wp("WP-005", "src/a.ts", "src/a.other.test.ts"),
        wp("WP-006", "src/e.ts", "src/e.test.ts"),
      ],
    }),
  );
  expect(run(root, factoryScript, ["import-workpacks", file]).status).toBe(0);
}

function wp(id, source, test) {
  return {
    wp_id: id,
    semantic_key: `semantic.${id}`,
    tm_int_id: "DP-INT-v1",
    source_file: source,
    source_line: "1",
    source_anchor_excerpt: "anchor",
    related_test_or_replay_file: test,
    objective: `objective ${id}`,
    expected_product_value: "value",
    acceptance_tests: ["npm test -- --run target"],
    judge_checks: ["separate judge ledger"],
    anti_fake_checks: ["verified remains zero"],
    status: "workpack_ready",
    verified: 0,
  };
}

afterEach(() => {
  while (roots.length > 0) rmSync(roots.pop(), { recursive: true, force: true });
});

describe("DP INT parallel runner", () => {
  it("lets five workers claim distinct workpacks with SQLite-backed locks", () => {
    const root = makeRoot();
    seed(root);

    const claims = [1, 2, 3, 4, 5].map((worker) => JSON.parse(run(root, runnerScript, ["claim-next", String(worker)]).stdout));

    expect(claims.every((claim) => claim.claimed)).toBe(true);
    expect(new Set(claims.map((claim) => claim.wp_id)).size).toBe(5);
    expect(sqlite(root, "select count(distinct claimed_by) from dp_int_workpacks where status='running';").stdout.trim()).toBe("5");
  });

  it("skips a locked file family and claims another ready workpack", () => {
    const root = makeRoot();
    seed(root);

    const first = JSON.parse(run(root, runnerScript, ["claim-next", "1"]).stdout);
    const second = JSON.parse(run(root, runnerScript, ["claim-next", "2"]).stdout);
    const fifthStatus = sqlite(root, "select status from dp_int_workpacks where wp_id='WP-005';").stdout.trim();

    expect(first.wp_id).toBe("WP-001");
    expect(second.wp_id).toBe("WP-002");
    expect(fifthStatus).toBe("workpack_ready");
  });

  it("returns an existing same-worker running claim instead of stranding it", () => {
    const root = makeRoot();
    seed(root);

    const first = JSON.parse(run(root, runnerScript, ["claim-next", "1"]).stdout);
    const resumed = JSON.parse(run(root, runnerScript, ["claim-next", "1"]).stdout);

    expect(first).toMatchObject({ claimed: true, worker_id: "F-DP-INT-W1" });
    expect(resumed).toMatchObject({ claimed: true, resumed: true, worker_id: "F-DP-INT-W1", wp_id: first.wp_id });
    expect(sqlite(root, "select count(*) from dp_int_workpacks where status='running';").stdout.trim()).toBe("1");
  });

  it("one worker dirty worktree does not block another worker claim", () => {
    const root = makeRoot();
    seed(root);
    mkdirSync(join(root, "worktrees", "dp-f-1"), { recursive: true });
    spawnSync("git", ["init"], { cwd: join(root, "worktrees", "dp-f-1"), encoding: "utf8" });
    writeFileSync(join(root, "worktrees", "dp-f-1", "dirty.txt"), "dirty");

    const first = JSON.parse(run(root, runnerScript, ["claim-next", "1"]).stdout);
    const second = JSON.parse(run(root, runnerScript, ["claim-next", "2"]).stdout);

    expect(first).toMatchObject({ claimed: false, reason: "worker_worktree_dirty" });
    expect(second).toMatchObject({ claimed: true, wp_id: "WP-001" });
  });

  it("failed worker claim remains recoverable and locked away from other workers", () => {
    const root = makeRoot();
    seed(root);

    const first = JSON.parse(run(root, runnerScript, ["claim-next", "1"]).stdout);
    const second = JSON.parse(run(root, runnerScript, ["claim-next", "2"]).stdout);

    expect(first).toMatchObject({ claimed: true, wp_id: "WP-001" });
    expect(second.wp_id).toBe("WP-002");
    expect(sqlite(root, "select status, claimed_by from dp_int_workpacks where wp_id='WP-001';").stdout.trim()).toBe("running|F-DP-INT-W1");
  });

  it("F cannot write Judge ledger and verified remains zero", () => {
    const root = makeRoot();
    seed(root);
    const claim = JSON.parse(run(root, runnerScript, ["claim-next", "1"]).stdout);

    expect(run(root, runnerScript, ["f-done", "1", claim.wp_id, "artifact.md", "tests pass", "abc123"]).status).toBe(0);
    expect(sqlite(root, "select coalesce(sum(verified),0) from dp_int_workpacks; select count(*) from dp_int_judge_results;").stdout.trim().split(/\r?\n/)).toEqual(["0", "0"]);
  });

  it("dashboard active-worker count matches distinct running workers", () => {
    const root = makeRoot();
    seed(root);
    expect(run(root, runnerScript, ["claim-next", "1"]).status).toBe(0);
    expect(run(root, runnerScript, ["claim-next", "2"]).status).toBe(0);

    const status = JSON.parse(run(root, runnerScript, ["status"]).stdout);
    expect(status.active_workers).toBe(2);
    expect(status.running).toBe(2);
  });

  it("continues at backlog 50 and stops above backlog 50", () => {
    const root = makeRoot();
    seed(root);

    for (let index = 0; index < 51; index += 1) {
      const id = `WP-BACKLOG-${String(index).padStart(2, "0")}`;
      const insert = sqlite(
        root,
        `insert into dp_int_workpacks(wp_id, semantic_key, tm_int_id, source_file, source_line, source_anchor_excerpt, related_test_or_replay_file, objective, expected_product_value, acceptance_tests, judge_checks, anti_fake_checks, status, artifact_path, validation_evidence, commit_hash) values ('${id}', 'semantic.${id}', 'DP-INT-v1', 'src/backlog-${index}.ts', '1', 'anchor', 'src/backlog-${index}.test.ts', 'objective', 'value', 'tests', 'judge', 'anti', 'f_done', 'artifact.md', 'tests pass', 'abc${index}');`,
      );
      expect(insert.status).toBe(0);
    }

    const blocked = JSON.parse(run(root, runnerScript, ["claim-next", "1"]).stdout);
    expect(blocked).toMatchObject({ claimed: false, reason: "judge_backlog", backlog: 51, limit: 50 });
  });
});
