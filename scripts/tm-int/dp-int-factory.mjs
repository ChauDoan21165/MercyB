#!/usr/bin/env node
import { mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { spawnSync } from "node:child_process";

export const DEFAULT_DB_PATH = "state/dp_int_factory.sqlite3";

const F_STATUSES = new Set(["workpack_ready", "running", "f_done"]);
const JUDGE_STATUSES = new Set(["judge_pass", "judge_fail"]);

function dbPath() {
  return process.env.DP_INT_FACTORY_DB || DEFAULT_DB_PATH;
}

function sql(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function required(value, name) {
  if (value === null || typeof value === "undefined" || String(value).trim().length === 0) {
    throw new Error(`Missing required argument: ${name}`);
  }
  return value;
}

function runSql(statement, { output = true } = {}) {
  const path = dbPath();
  mkdirSync(dirname(path), { recursive: true });
  const result = spawnSync("sqlite3", [path], {
    encoding: "utf8",
    input: statement,
  });

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "sqlite3 failed").trim());
  }

  if (output) process.stdout.write(result.stdout);
  return result.stdout;
}

export function initializeSchema() {
  runSql(
    `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS dp_int_workpacks (
  wp_id TEXT PRIMARY KEY,
  semantic_key TEXT NOT NULL UNIQUE,
  tm_int_id TEXT NOT NULL,
  source_file TEXT NOT NULL,
  source_line TEXT NOT NULL,
  source_anchor_excerpt TEXT NOT NULL,
  related_test_or_replay_file TEXT NOT NULL,
  objective TEXT NOT NULL,
  expected_product_value TEXT NOT NULL,
  acceptance_tests TEXT NOT NULL,
  judge_checks TEXT NOT NULL,
  anti_fake_checks TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('workpack_ready', 'running', 'f_done')) DEFAULT 'workpack_ready',
  verified INTEGER NOT NULL DEFAULT 0 CHECK(verified = 0),
  claimed_by TEXT,
  claimed_at TEXT,
  artifact_path TEXT,
  validation_evidence TEXT,
  commit_hash TEXT,
  f_done_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK(status != 'running' OR (claimed_by IS NOT NULL AND claimed_at IS NOT NULL)),
  CHECK(status != 'f_done' OR (
    artifact_path IS NOT NULL AND length(trim(artifact_path)) > 0 AND
    validation_evidence IS NOT NULL AND length(trim(validation_evidence)) > 0 AND
    commit_hash IS NOT NULL AND length(trim(commit_hash)) > 0
  ))
);

CREATE TABLE IF NOT EXISTS dp_int_f_events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  wp_id TEXT,
  actor TEXT NOT NULL,
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  note TEXT NOT NULL DEFAULT '',
  verified INTEGER NOT NULL DEFAULT 0 CHECK(verified = 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (wp_id) REFERENCES dp_int_workpacks(wp_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dp_int_judge_results (
  wp_id TEXT PRIMARY KEY,
  judge_status TEXT NOT NULL CHECK(judge_status IN ('judge_pass', 'judge_fail')),
  commit_hash TEXT NOT NULL,
  judge_artifact TEXT NOT NULL,
  validation_summary TEXT NOT NULL,
  anti_fake_summary TEXT NOT NULL,
  verified_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (wp_id) REFERENCES dp_int_workpacks(wp_id) ON DELETE CASCADE
);

CREATE VIEW IF NOT EXISTS dp_int_claimable AS
SELECT wp_id, semantic_key, tm_int_id, source_file, source_line, source_anchor_excerpt,
       related_test_or_replay_file, objective, expected_product_value, acceptance_tests,
       judge_checks, anti_fake_checks
FROM dp_int_workpacks
WHERE status = 'workpack_ready'
ORDER BY wp_id;

CREATE VIEW IF NOT EXISTS dp_int_running AS
SELECT wp_id, semantic_key, tm_int_id, claimed_by, claimed_at, source_file, objective,
       acceptance_tests, judge_checks, anti_fake_checks
FROM dp_int_workpacks
WHERE status = 'running'
ORDER BY claimed_at, wp_id;

CREATE VIEW IF NOT EXISTS dp_int_f_done_unjudged AS
SELECT w.wp_id, w.semantic_key, w.tm_int_id, w.artifact_path, w.validation_evidence,
       w.commit_hash, w.f_done_at
FROM dp_int_workpacks w
LEFT JOIN dp_int_judge_results j ON j.wp_id = w.wp_id
WHERE w.status = 'f_done' AND j.wp_id IS NULL
ORDER BY w.f_done_at, w.wp_id;

CREATE TRIGGER IF NOT EXISTS dp_int_workpacks_verified_insert_locked
BEFORE INSERT ON dp_int_workpacks
WHEN NEW.verified != 0
BEGIN
  SELECT RAISE(ABORT, 'DP INT F queue verified is locked to 0');
END;

CREATE TRIGGER IF NOT EXISTS dp_int_workpacks_verified_update_locked
BEFORE UPDATE OF verified ON dp_int_workpacks
WHEN NEW.verified != 0
BEGIN
  SELECT RAISE(ABORT, 'DP INT F queue cannot mark workpacks verified');
END;

CREATE TRIGGER IF NOT EXISTS dp_int_workpacks_no_verified_status_insert
BEFORE INSERT ON dp_int_workpacks
WHEN NEW.status = 'verified'
BEGIN
  SELECT RAISE(ABORT, 'DP INT F queue status cannot be verified');
END;

CREATE TRIGGER IF NOT EXISTS dp_int_workpacks_no_verified_status_update
BEFORE UPDATE OF status ON dp_int_workpacks
WHEN NEW.status = 'verified'
BEGIN
  SELECT RAISE(ABORT, 'DP INT F queue status cannot be verified');
END;

CREATE TRIGGER IF NOT EXISTS dp_int_events_verified_update_locked
BEFORE UPDATE OF verified ON dp_int_f_events
WHEN NEW.verified != 0
BEGIN
  SELECT RAISE(ABORT, 'DP INT F events cannot mark verified');
END;

CREATE TRIGGER IF NOT EXISTS dp_int_events_append_only_update
BEFORE UPDATE ON dp_int_f_events
BEGIN
  SELECT RAISE(ABORT, 'DP INT F events are append-only');
END;

CREATE TRIGGER IF NOT EXISTS dp_int_events_append_only_delete
BEFORE DELETE ON dp_int_f_events
BEGIN
  SELECT RAISE(ABORT, 'DP INT F events are append-only');
END;

CREATE TRIGGER IF NOT EXISTS dp_int_workpacks_updated_at
AFTER UPDATE ON dp_int_workpacks
BEGIN
  UPDATE dp_int_workpacks SET updated_at = datetime('now') WHERE wp_id = NEW.wp_id;
END;
`,
    { output: false },
  );
}

function asLineList(value, name) {
  const requiredValue = required(value, name);
  return Array.isArray(requiredValue) ? requiredValue.join("\n") : String(requiredValue);
}

function parseWorkpackFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  const items = Array.isArray(parsed) ? parsed : parsed.workpacks;
  if (!Array.isArray(items)) {
    throw new Error("Workpack file must be a JSON array or an object with a workpacks array");
  }

  return items.map((item, index) => {
    const status = required(item.status, `workpacks[${index}].status`);
    const verified = item.verified;
    if (status !== "workpack_ready") {
      throw new Error(`workpacks[${index}].status must be workpack_ready`);
    }
    if (verified !== 0) {
      throw new Error(`workpacks[${index}].verified must be 0`);
    }

    return {
      wp_id: required(item.wp_id, `workpacks[${index}].wp_id`),
      semantic_key: required(item.semantic_key, `workpacks[${index}].semantic_key`),
      tm_int_id: required(item.tm_int_id, `workpacks[${index}].tm_int_id`),
      source_file: required(item.source_file, `workpacks[${index}].source_file`),
      source_line: required(item.source_line, `workpacks[${index}].source_line`),
      source_anchor_excerpt: required(item.source_anchor_excerpt, `workpacks[${index}].source_anchor_excerpt`),
      related_test_or_replay_file: required(item.related_test_or_replay_file, `workpacks[${index}].related_test_or_replay_file`),
      objective: required(item.objective, `workpacks[${index}].objective`),
      expected_product_value: required(item.expected_product_value, `workpacks[${index}].expected_product_value`),
      acceptance_tests: asLineList(item.acceptance_tests, `workpacks[${index}].acceptance_tests`),
      judge_checks: asLineList(item.judge_checks, `workpacks[${index}].judge_checks`),
      anti_fake_checks: asLineList(item.anti_fake_checks, `workpacks[${index}].anti_fake_checks`),
    };
  });
}

function init() {
  initializeSchema();
  runSql(
    `INSERT INTO dp_int_f_events(actor, event_type, note) VALUES ('runtime', 'init', 'DP INT factory schema initialized.');
SELECT ${sql(dbPath())} AS db_path;`,
  );
}

function importWorkpacks(filePath) {
  initializeSchema();
  const workpacks = parseWorkpackFile(filePath);
  const rows = workpacks.map((wp) => (
    `INSERT INTO dp_int_workpacks(
  wp_id, semantic_key, tm_int_id, source_file, source_line, source_anchor_excerpt,
  related_test_or_replay_file, objective, expected_product_value, acceptance_tests,
  judge_checks, anti_fake_checks
) VALUES (
  ${sql(wp.wp_id)}, ${sql(wp.semantic_key)}, ${sql(wp.tm_int_id)}, ${sql(wp.source_file)}, ${sql(wp.source_line)}, ${sql(wp.source_anchor_excerpt)},
  ${sql(wp.related_test_or_replay_file)}, ${sql(wp.objective)}, ${sql(wp.expected_product_value)}, ${sql(wp.acceptance_tests)},
  ${sql(wp.judge_checks)}, ${sql(wp.anti_fake_checks)}
) ON CONFLICT(wp_id) DO UPDATE SET
  semantic_key=excluded.semantic_key,
  tm_int_id=excluded.tm_int_id,
  source_file=excluded.source_file,
  source_line=excluded.source_line,
  source_anchor_excerpt=excluded.source_anchor_excerpt,
  related_test_or_replay_file=excluded.related_test_or_replay_file,
  objective=excluded.objective,
  expected_product_value=excluded.expected_product_value,
  acceptance_tests=excluded.acceptance_tests,
  judge_checks=excluded.judge_checks,
  anti_fake_checks=excluded.anti_fake_checks
WHERE dp_int_workpacks.status = 'workpack_ready';`
  )).join("\n");

  runSql(
    `BEGIN IMMEDIATE;
${rows}
INSERT INTO dp_int_f_events(actor, event_type, note)
VALUES ('runtime', 'import-workpacks', ${sql(`Imported ${workpacks.length} DP INT workpack(s) from ${filePath}.`)});
COMMIT;
SELECT COUNT(*) AS rows FROM dp_int_workpacks;`,
  );
}

function next() {
  initializeSchema();
  runSql(".mode column\n.headers on\nSELECT * FROM dp_int_claimable LIMIT 10;");
}

function claim(wpId, worker) {
  initializeSchema();
  if (!F_STATUSES.has("running")) throw new Error("Invalid F status configuration");
  runSql(
    `BEGIN IMMEDIATE;
UPDATE dp_int_workpacks
SET status='running', claimed_by=${sql(worker)}, claimed_at=datetime('now')
WHERE wp_id=${sql(wpId)} AND status='workpack_ready';
INSERT INTO dp_int_f_events(wp_id, actor, event_type, from_status, to_status, note)
SELECT ${sql(wpId)}, ${sql(worker)}, 'claim', 'workpack_ready', 'running', 'F claimed DP INT workpack.' WHERE changes() = 1;
COMMIT;
SELECT wp_id, status, verified, claimed_by, claimed_at FROM dp_int_workpacks WHERE wp_id=${sql(wpId)};`,
  );
}

function fDone(wpId, artifactPath, validationEvidence, commitHash) {
  initializeSchema();
  required(artifactPath, "artifact_path");
  required(validationEvidence, "validation_evidence");
  required(commitHash, "commit_hash");
  runSql(
    `BEGIN IMMEDIATE;
UPDATE dp_int_workpacks
SET status='f_done',
    artifact_path=${sql(artifactPath)},
    validation_evidence=${sql(validationEvidence)},
    commit_hash=${sql(commitHash)},
    f_done_at=datetime('now')
WHERE wp_id=${sql(wpId)} AND status='running';
INSERT INTO dp_int_f_events(wp_id, actor, event_type, from_status, to_status, note)
SELECT ${sql(wpId)}, 'F', 'f_done', 'running', 'f_done', ${sql(`Artifact: ${artifactPath}; validation: ${validationEvidence}; commit: ${commitHash}`)} WHERE changes() = 1;
COMMIT;
SELECT wp_id, status, verified, artifact_path, validation_evidence, commit_hash FROM dp_int_workpacks WHERE wp_id=${sql(wpId)};`,
  );
}

function judge(wpId, judgeStatus, artifactPath, commitHash) {
  initializeSchema();
  if (!JUDGE_STATUSES.has(judgeStatus)) throw new Error(`Invalid judge status: ${judgeStatus}`);
  required(artifactPath, "judge_artifact");
  required(commitHash, "commit_hash");
  const validationSummary = `${judgeStatus} recorded by Judge/Admin for ${wpId} at ${commitHash}.`;
  const antiFakeSummary = "Judge ledger is separate from F queue; F verified remains locked to 0.";

  runSql(
    `BEGIN IMMEDIATE;
INSERT INTO dp_int_judge_results(wp_id, judge_status, commit_hash, judge_artifact, validation_summary, anti_fake_summary)
VALUES (${sql(wpId)}, ${sql(judgeStatus)}, ${sql(commitHash)}, ${sql(artifactPath)}, ${sql(validationSummary)}, ${sql(antiFakeSummary)})
ON CONFLICT(wp_id) DO UPDATE SET
  judge_status=excluded.judge_status,
  commit_hash=excluded.commit_hash,
  judge_artifact=excluded.judge_artifact,
  validation_summary=excluded.validation_summary,
  anti_fake_summary=excluded.anti_fake_summary,
  verified_at=datetime('now');
INSERT INTO dp_int_f_events(wp_id, actor, event_type, note)
VALUES (${sql(wpId)}, 'Judge', ${sql(judgeStatus)}, ${sql(`Judge artifact: ${artifactPath}; commit: ${commitHash}`)});
COMMIT;
SELECT wp_id, judge_status, commit_hash, judge_artifact, verified_at FROM dp_int_judge_results WHERE wp_id=${sql(wpId)};`,
  );
}

function closeout() {
  initializeSchema();
  runSql(
    `.mode column
.headers on
SELECT 'workpack_ready' AS status, COUNT(*) AS rows FROM dp_int_workpacks WHERE status='workpack_ready';
SELECT 'running' AS status, COUNT(*) AS rows FROM dp_int_workpacks WHERE status='running';
SELECT 'f_done' AS status, COUNT(*) AS rows FROM dp_int_workpacks WHERE status='f_done';
SELECT 'verified' AS metric, COALESCE(SUM(verified), 0) AS rows FROM dp_int_workpacks;
SELECT 'judge_pass' AS judge_status, COUNT(*) AS rows FROM dp_int_judge_results WHERE judge_status='judge_pass';
SELECT 'judge_fail' AS judge_status, COUNT(*) AS rows FROM dp_int_judge_results WHERE judge_status='judge_fail';
SELECT COUNT(*) AS f_done_unjudged FROM dp_int_f_done_unjudged;`,
  );
}

function help() {
  console.log(`Usage:
  node scripts/tm-int/dp-int-factory.mjs init
  node scripts/tm-int/dp-int-factory.mjs import-workpacks <file.json>
  node scripts/tm-int/dp-int-factory.mjs next
  node scripts/tm-int/dp-int-factory.mjs claim <wp_id> <worker>
  node scripts/tm-int/dp-int-factory.mjs f-done <wp_id> <artifact_path> <validation_evidence> <commit_hash>
  node scripts/tm-int/dp-int-factory.mjs judge-pass <wp_id> <judge_artifact> <commit_hash>
  node scripts/tm-int/dp-int-factory.mjs judge-fail <wp_id> <judge_artifact> <commit_hash>
  node scripts/tm-int/dp-int-factory.mjs closeout

Environment:
  DP_INT_FACTORY_DB=/path/to/dp_int_factory.sqlite3

F queue verified is locked to 0. Judge ledger is the only verification source.`);
}

export function main(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;
  if (!command || command === "help" || command === "--help") return help();
  if (command === "init") return init();
  if (command === "import-workpacks") return importWorkpacks(required(args[0], "file"));
  if (command === "next") return next();
  if (command === "claim") return claim(required(args[0], "wp_id"), required(args[1], "worker"));
  if (command === "f-done") {
    return fDone(
      required(args[0], "wp_id"),
      required(args[1], "artifact_path"),
      required(args[2], "validation_evidence"),
      required(args[3], "commit_hash"),
    );
  }
  if (command === "judge-pass") return judge(required(args[0], "wp_id"), "judge_pass", required(args[1], "judge_artifact"), required(args[2], "commit_hash"));
  if (command === "judge-fail") return judge(required(args[0], "wp_id"), "judge_fail", required(args[1], "judge_artifact"), required(args[2], "commit_hash"));
  if (command === "closeout") return closeout();
  throw new Error(`Unknown command: ${command}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

export const internals = {
  F_STATUSES,
  JUDGE_STATUSES,
  parseWorkpackFile,
  runSql,
  sql,
};
