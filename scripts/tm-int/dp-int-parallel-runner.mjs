#!/usr/bin/env node
import { existsSync, mkdirSync, symlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

export const DEFAULT_REPO_ROOT = "/Users/admin/MercyB";
export const DEFAULT_DB_PATH = "/Users/admin/MercyB/state/dp_int_factory.sqlite3";
export const DEFAULT_WORKTREE_ROOT = "/Users/admin/MercyB.worktrees";
export const DEFAULT_WORKER_COUNT = 5;
export const JUDGE_BACKLOG_LIMIT = 20;

function env(name, fallback) {
  return process.env[name] || fallback;
}

function repoRoot() {
  return env("DP_INT_REPO_ROOT", DEFAULT_REPO_ROOT);
}

function dbPath() {
  return env("DP_INT_FACTORY_DB", DEFAULT_DB_PATH);
}

function worktreeRoot() {
  return env("DP_INT_WORKTREE_ROOT", DEFAULT_WORKTREE_ROOT);
}

function sql(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot(),
    encoding: "utf8",
    input: options.input,
    env: { ...process.env, ...(options.env || {}) },
  });
  if (result.status !== 0 && options.check !== false) {
    throw new Error((result.stderr || result.stdout || `${command} ${args.join(" ")} failed`).trim());
  }
  return result;
}

function runSql(statement, options = {}) {
  mkdirSync(dirname(dbPath()), { recursive: true });
  return run("sqlite3", [dbPath()], { input: statement, check: options.check });
}

function scalarSql(statement) {
  return runSql(statement).stdout.trim();
}

export function workerId(index) {
  return `F-DP-INT-W${index}`;
}

export function workerPath(index) {
  return `${worktreeRoot()}/dp-f-${index}`;
}

export function workerBranch(index) {
  return `dp-int/f-worker-${index}`;
}

export function fileFamiliesFor(workpack) {
  return Array.from(
    new Set(
      [workpack.source_file, workpack.related_test_or_replay_file]
        .filter(Boolean)
        .map((file) => String(file).trim()),
    ),
  );
}

export function initializeParallelSchema() {
  runSql(`
CREATE TABLE IF NOT EXISTS dp_int_file_locks (
  file_family TEXT PRIMARY KEY,
  wp_id TEXT NOT NULL,
  worker_id TEXT NOT NULL,
  locked_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (wp_id) REFERENCES dp_int_workpacks(wp_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS dp_int_file_locks_worker_idx ON dp_int_file_locks(worker_id);
`);
}

export function activeCounts() {
  const rows = JSON.parse(
    run("sqlite3", ["-readonly", "-json", dbPath(), `
SELECT json_object(
  'ready', (SELECT COUNT(*) FROM dp_int_workpacks WHERE status='workpack_ready'),
  'running', (SELECT COUNT(*) FROM dp_int_workpacks WHERE status='running'),
  'f_done', (SELECT COUNT(*) FROM dp_int_workpacks WHERE status='f_done'),
  'f_done_unjudged', (SELECT COUNT(*) FROM dp_int_f_done_unjudged),
  'judge_pass', (SELECT COUNT(*) FROM dp_int_judge_results WHERE judge_status='judge_pass'),
  'judge_fail', (SELECT COUNT(*) FROM dp_int_judge_results WHERE judge_status='judge_fail'),
  'verified', (SELECT COALESCE(SUM(verified), 0) FROM dp_int_workpacks),
  'active_workers', (SELECT COUNT(DISTINCT claimed_by) FROM dp_int_workpacks WHERE status='running' AND claimed_by IS NOT NULL)
) AS counts;
`]).stdout,
  )[0]?.counts;
  return typeof rows === "string" ? JSON.parse(rows) : rows;
}

function worktreeStatus(path) {
  const result = run("git", ["status", "--short"], { cwd: path, check: false });
  return result.stdout.trim();
}

export function setupWorktree(index) {
  const path = workerPath(index);
  const branch = workerBranch(index);
  mkdirSync(worktreeRoot(), { recursive: true });

  if (!existsSync(path)) {
    run("git", ["worktree", "add", "-B", branch, path, "HEAD"]);
  }

  const mainNodeModules = `${repoRoot()}/node_modules`;
  const worktreeNodeModules = `${path}/node_modules`;
  if (existsSync(mainNodeModules) && !existsSync(worktreeNodeModules)) {
    symlinkSync(mainNodeModules, worktreeNodeModules, "dir");
  }

  return { index, worker_id: workerId(index), path, branch };
}

export function setupWorktrees(count = DEFAULT_WORKER_COUNT) {
  return Array.from({ length: count }, (_, offset) => setupWorktree(offset + 1));
}

function parseJsonRows(sqlStatement) {
  const output = run("sqlite3", ["-readonly", "-json", dbPath(), sqlStatement]).stdout.trim();
  return output ? JSON.parse(output) : [];
}

function currentRunningRows() {
  return parseJsonRows("SELECT wp_id, claimed_by AS worker_id, source_file, related_test_or_replay_file FROM dp_int_workpacks WHERE status='running'");
}

function seedLocksForRunningRows() {
  const rows = currentRunningRows();
  for (const row of rows) {
    for (const family of fileFamiliesFor(row)) {
      runSql(`
INSERT OR IGNORE INTO dp_int_file_locks(file_family, wp_id, worker_id)
VALUES (${sql(family)}, ${sql(row.wp_id)}, ${sql(row.worker_id || "unknown")});
`);
    }
  }
}

export function claimNext(index) {
  initializeParallelSchema();
  seedLocksForRunningRows();

  const worker = workerId(index);
  const path = workerPath(index);
  if (existsSync(path)) {
    const status = worktreeStatus(path);
    if (status) {
      return { claimed: false, reason: "worker_worktree_dirty", status };
    }
  }

  const candidates = parseJsonRows(`
SELECT wp_id, semantic_key, source_file, related_test_or_replay_file, objective, acceptance_tests
FROM dp_int_claimable
ORDER BY wp_id;
`);
  if (candidates.length === 0) return { claimed: false, reason: "ready_zero" };

  const backlog = Number(scalarSql("SELECT COUNT(*) FROM dp_int_f_done_unjudged;") || "0");
  if (backlog > JUDGE_BACKLOG_LIMIT) return { claimed: false, reason: "judge_backlog", backlog, limit: JUDGE_BACKLOG_LIMIT };

  for (const candidate of candidates) {
    const families = fileFamiliesFor(candidate);
    const locked = families.some(
      (family) => Number(scalarSql(`SELECT COUNT(*) FROM dp_int_file_locks WHERE file_family=${sql(family)};`) || "0") > 0,
    );
    if (locked) continue;

    runSql(`
BEGIN IMMEDIATE;
UPDATE dp_int_workpacks
SET status='running', claimed_by=${sql(worker)}, claimed_at=datetime('now')
WHERE wp_id=${sql(candidate.wp_id)} AND status='workpack_ready';
INSERT INTO dp_int_f_events(wp_id, actor, event_type, from_status, to_status, note)
SELECT ${sql(candidate.wp_id)}, ${sql(worker)}, 'claim', 'workpack_ready', 'running', 'F claimed DP INT workpack in isolated worktree.' WHERE changes() = 1;
${families.map((family) => `INSERT INTO dp_int_file_locks(file_family, wp_id, worker_id) VALUES (${sql(family)}, ${sql(candidate.wp_id)}, ${sql(worker)});`).join("\n")}
COMMIT;
`);
    return { claimed: true, worker_id: worker, worktree: path, ...candidate, file_families: families };
  }

  return { claimed: false, reason: "all_ready_file_locked" };
}

export function markDone({ index, wpId, artifactPath, validationEvidence, commitHash }) {
  initializeParallelSchema();
  const worker = workerId(index);
  runSql(`
BEGIN IMMEDIATE;
UPDATE dp_int_workpacks
SET status='f_done',
    artifact_path=${sql(artifactPath)},
    validation_evidence=${sql(validationEvidence)},
    commit_hash=${sql(commitHash)},
    f_done_at=datetime('now')
WHERE wp_id=${sql(wpId)} AND status='running' AND claimed_by=${sql(worker)};
INSERT INTO dp_int_f_events(wp_id, actor, event_type, from_status, to_status, note)
SELECT ${sql(wpId)}, ${sql(worker)}, 'f_done', 'running', 'f_done', ${sql(`Artifact: ${artifactPath}; validation: ${validationEvidence}; commit: ${commitHash}`)} WHERE changes() = 1;
DELETE FROM dp_int_file_locks WHERE wp_id=${sql(wpId)} AND worker_id=${sql(worker)};
COMMIT;
`);
  return parseJsonRows(`SELECT wp_id, status, verified, artifact_path, validation_evidence, commit_hash FROM dp_int_workpacks WHERE wp_id=${sql(wpId)};`)[0];
}

function codexPrompt(index) {
  return `You are DP INT F worker ${index} running in isolated git worktree ${workerPath(index)}.
Read /Users/admin/CEO1-SKILL.md first.
Do not run Judge. Do not set verified. Do not deploy, push, or merge.
Use central control plane DB only through /Users/admin/MercyB/scripts/tm-int/dp-int-parallel-runner.mjs.
Loop:
1. Run: node /Users/admin/MercyB/scripts/tm-int/dp-int-parallel-runner.mjs claim-next ${index}
2. If it returns claimed=false, stop and report reason. The tmux supervisor will restart you later if the stop condition is temporary.
3. Implement only the claimed workpack in this worktree and do not touch files outside its source/test family.
4. Run the workpack acceptance tests locally.
5. If validation fails, stop this worker only. Do not mark f_done.
6. If validation passes, write an F artifact under reports/f_done/dp-int-v1/, commit product/test/artifact changes on this worker branch, then run:
   node /Users/admin/MercyB/scripts/tm-int/dp-int-parallel-runner.mjs f-done ${index} <wp_id> <artifact_path> <validation_evidence> <commit_hash>
7. Continue until f_done_unjudged > ${JUDGE_BACKLOG_LIMIT}, ready=0, this worktree is dirty before claim, conflict appears, or validation fails.
Never write dp_int_judge_results. Keep verified at 0.`;
}

export function stopStatus(index) {
  const counts = activeCounts();
  const path = workerPath(index);
  const status = existsSync(path) ? worktreeStatus(path) : "";
  if (status) return { stop: true, reason: "worker_worktree_dirty", status };
  if (counts.f_done_unjudged > JUDGE_BACKLOG_LIMIT) {
    return { stop: true, reason: "judge_backlog", backlog: counts.f_done_unjudged, limit: JUDGE_BACKLOG_LIMIT };
  }
  if (counts.ready === 0) return { stop: true, reason: "ready_zero" };
  return { stop: false, reason: "continue", counts, limit: JUDGE_BACKLOG_LIMIT };
}

export function startWorker(index) {
  const setup = setupWorktree(index);
  const logPath = `/tmp/dp-int-f-worker-${index}-${new Date().toISOString().replace(/[:.]/g, "")}.log`;
  const session = `dp-int-f-worker-${index}`;
  run("tmux", ["kill-session", "-t", session], { check: false });
  const command = [
    `cd ${setup.path}`,
    "while true; do",
    `codex exec --dangerously-bypass-approvals-and-sandbox -C ${setup.path} ${JSON.stringify(codexPrompt(index))}`,
    `node ${repoRoot()}/scripts/tm-int/dp-int-parallel-runner.mjs should-stop ${index} && break`,
    "sleep 5",
    "done",
  ].join(" ");
  run("tmux", [
    "new-session",
    "-d",
    "-s",
    session,
    `${command} > ${logPath} 2>&1`,
  ]);
  const pane = run("tmux", ["list-panes", "-t", session, "-F", "#{pane_pid}"]).stdout.trim();
  const child = run("pgrep", ["-P", pane, "-f", "codex exec"], { check: false }).stdout.trim().split(/\r?\n/).filter(Boolean)[0] || pane;
  return { ...setup, session, pane_pid: Number(pane), pid: Number(child.split(/\s+/)[0] || child), logPath };
}

export function startWorkers(count = DEFAULT_WORKER_COUNT) {
  return Array.from({ length: count }, (_, offset) => startWorker(offset + 1));
}

function print(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

export function main(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;
  if (command === "setup-worktrees") return print(setupWorktrees(Number(args[0] || DEFAULT_WORKER_COUNT)));
  if (command === "claim-next") return print(claimNext(Number(args[0])));
  if (command === "f-done") {
    return print(markDone({
      index: Number(args[0]),
      wpId: args[1],
      artifactPath: args[2],
      validationEvidence: args[3],
      commitHash: args[4],
    }));
  }
  if (command === "start") return print(startWorkers(Number(args[0] || DEFAULT_WORKER_COUNT)));
  if (command === "status") return print(activeCounts());
  if (command === "should-stop") {
    const status = stopStatus(Number(args[0]));
    print(status);
    process.exit(status.stop ? 0 : 1);
  }
  throw new Error(`Usage: node scripts/tm-int/dp-int-parallel-runner.mjs <setup-worktrees|claim-next|f-done|start|status>`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
