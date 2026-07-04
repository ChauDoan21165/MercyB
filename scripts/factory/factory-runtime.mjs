#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { spawnSync } from "node:child_process";

export const DEFAULT_DB_PATH = "state/factory_runtime.sqlite";
export const SCHEMA_VERSION = 2;

const VALID_F_STATUSES = new Set(["workpack_ready", "running", "f_done", "held", "bad_workpack"]);
const VALID_JUDGE_STATUSES = new Set(["judge_pass", "judge_fail"]);
const F_STATUS_SQL = "'workpack_ready', 'running', 'f_done', 'held', 'bad_workpack'";

function dbPath() {
  return process.env.FACTORY_RUNTIME_DB || DEFAULT_DB_PATH;
}

function sql(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function required(value, name) {
  if (!value) {
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
    const message = (result.stderr || result.stdout || "sqlite3 failed").trim();
    throw new Error(message);
  }
  if (output) process.stdout.write(result.stdout);
  return result.stdout;
}

export function initializeSchema() {
  runSql(
    `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS factory_lanes (
  lane_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS factory_workpacks (
  lane_id TEXT NOT NULL,
  wp_id TEXT NOT NULL,
  semantic_key TEXT NOT NULL,
  source_files TEXT NOT NULL,
  objective TEXT NOT NULL,
  acceptance_tests TEXT NOT NULL,
  validation_commands TEXT NOT NULL,
  anti_fake_checks TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN (${F_STATUS_SQL})) DEFAULT 'workpack_ready',
  verified INTEGER NOT NULL DEFAULT 0 CHECK(verified = 0),
  artifact_path TEXT,
  validation_evidence TEXT,
  commit_hash TEXT,
  claimed_by TEXT,
  claimed_at TEXT,
  hold_reason TEXT,
  held_at TEXT,
  bad_workpack_at TEXT,
  f_done_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (lane_id, wp_id),
  UNIQUE (lane_id, semantic_key),
  FOREIGN KEY (lane_id) REFERENCES factory_lanes(lane_id) ON DELETE CASCADE,
  CHECK(status != 'running' OR (claimed_by IS NOT NULL AND claimed_at IS NOT NULL)),
  CHECK(status != 'f_done' OR (
    artifact_path IS NOT NULL AND length(trim(artifact_path)) > 0 AND
    validation_evidence IS NOT NULL AND length(trim(validation_evidence)) > 0
  )),
  CHECK(status != 'held' OR (
    hold_reason IS NOT NULL AND length(trim(hold_reason)) > 0 AND held_at IS NOT NULL
  )),
  CHECK(status != 'bad_workpack' OR (
    hold_reason IS NOT NULL AND length(trim(hold_reason)) > 0 AND bad_workpack_at IS NOT NULL
  ))
);
`,
    { output: false },
  );

  migrateFactoryWorkpacksSchema();

  runSql(
    `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS factory_judge_results (
  lane_id TEXT NOT NULL,
  wp_id TEXT NOT NULL,
  judge_status TEXT NOT NULL CHECK(judge_status IN ('judge_pass','judge_fail')),
  commit_hash TEXT NOT NULL,
  judge_artifact TEXT NOT NULL,
  validation_summary TEXT NOT NULL,
  anti_fake_summary TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  PRIMARY KEY (lane_id, wp_id),
  FOREIGN KEY (lane_id, wp_id) REFERENCES factory_workpacks(lane_id, wp_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS factory_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lane_id TEXT NOT NULL,
  wp_id TEXT,
  actor TEXT NOT NULL,
  event_type TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE VIEW IF NOT EXISTS factory_claimable AS
SELECT lane_id, wp_id, semantic_key, source_files, objective, acceptance_tests, validation_commands, anti_fake_checks
FROM factory_workpacks
WHERE status = 'workpack_ready'
ORDER BY lane_id, wp_id;

CREATE TRIGGER IF NOT EXISTS factory_workpacks_verified_insert_locked
BEFORE INSERT ON factory_workpacks
WHEN NEW.verified != 0
BEGIN
  SELECT RAISE(ABORT, 'F queue verified is locked to 0');
END;

CREATE TRIGGER IF NOT EXISTS factory_workpacks_verified_update_locked
BEFORE UPDATE OF verified ON factory_workpacks
WHEN NEW.verified != 0
BEGIN
  SELECT RAISE(ABORT, 'F queue verified is locked to 0');
END;

CREATE TRIGGER IF NOT EXISTS factory_workpacks_no_verified_status_insert
BEFORE INSERT ON factory_workpacks
WHEN NEW.status = 'verified'
BEGIN
  SELECT RAISE(ABORT, 'F queue status cannot be verified');
END;

CREATE TRIGGER IF NOT EXISTS factory_workpacks_no_verified_status_update
BEFORE UPDATE OF status ON factory_workpacks
WHEN NEW.status = 'verified'
BEGIN
  SELECT RAISE(ABORT, 'F queue status cannot be verified');
END;

CREATE TRIGGER IF NOT EXISTS factory_workpacks_updated_at
AFTER UPDATE ON factory_workpacks
BEGIN
  UPDATE factory_workpacks SET updated_at = datetime('now') WHERE lane_id = NEW.lane_id AND wp_id = NEW.wp_id;
END;

CREATE TRIGGER IF NOT EXISTS factory_lanes_updated_at
AFTER UPDATE ON factory_lanes
BEGIN
  UPDATE factory_lanes SET updated_at = datetime('now') WHERE lane_id = NEW.lane_id;
END;
`,
    { output: false },
  );
}

function migrateFactoryWorkpacksSchema() {
  const tableSql = runSql(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='factory_workpacks';",
    { output: false },
  );
  if (tableSql.includes("bad_workpack") && tableSql.includes("hold_reason")) {
    return;
  }
  runSql(
    `
PRAGMA foreign_keys = OFF;
BEGIN IMMEDIATE;
DROP VIEW IF EXISTS factory_claimable;
DROP TRIGGER IF EXISTS factory_workpacks_verified_insert_locked;
DROP TRIGGER IF EXISTS factory_workpacks_verified_update_locked;
DROP TRIGGER IF EXISTS factory_workpacks_no_verified_status_insert;
DROP TRIGGER IF EXISTS factory_workpacks_no_verified_status_update;
DROP TRIGGER IF EXISTS factory_workpacks_updated_at;
ALTER TABLE factory_workpacks RENAME TO factory_workpacks_old;
CREATE TABLE factory_workpacks (
  lane_id TEXT NOT NULL,
  wp_id TEXT NOT NULL,
  semantic_key TEXT NOT NULL,
  source_files TEXT NOT NULL,
  objective TEXT NOT NULL,
  acceptance_tests TEXT NOT NULL,
  validation_commands TEXT NOT NULL,
  anti_fake_checks TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN (${F_STATUS_SQL})) DEFAULT 'workpack_ready',
  verified INTEGER NOT NULL DEFAULT 0 CHECK(verified = 0),
  artifact_path TEXT,
  validation_evidence TEXT,
  commit_hash TEXT,
  claimed_by TEXT,
  claimed_at TEXT,
  hold_reason TEXT,
  held_at TEXT,
  bad_workpack_at TEXT,
  f_done_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (lane_id, wp_id),
  UNIQUE (lane_id, semantic_key),
  FOREIGN KEY (lane_id) REFERENCES factory_lanes(lane_id) ON DELETE CASCADE,
  CHECK(status != 'running' OR (claimed_by IS NOT NULL AND claimed_at IS NOT NULL)),
  CHECK(status != 'f_done' OR (
    artifact_path IS NOT NULL AND length(trim(artifact_path)) > 0 AND
    validation_evidence IS NOT NULL AND length(trim(validation_evidence)) > 0
  )),
  CHECK(status != 'held' OR (
    hold_reason IS NOT NULL AND length(trim(hold_reason)) > 0 AND held_at IS NOT NULL
  )),
  CHECK(status != 'bad_workpack' OR (
    hold_reason IS NOT NULL AND length(trim(hold_reason)) > 0 AND bad_workpack_at IS NOT NULL
  ))
);
INSERT INTO factory_workpacks(
  lane_id, wp_id, semantic_key, source_files, objective, acceptance_tests,
  validation_commands, anti_fake_checks, status, verified, artifact_path,
  validation_evidence, commit_hash, claimed_by, claimed_at, f_done_at,
  created_at, updated_at
)
SELECT
  lane_id, wp_id, semantic_key, source_files, objective, acceptance_tests,
  validation_commands, anti_fake_checks, status, verified, artifact_path,
  validation_evidence, commit_hash, claimed_by, claimed_at, f_done_at,
  created_at, updated_at
FROM factory_workpacks_old;
DROP TABLE factory_workpacks_old;
COMMIT;
PRAGMA foreign_keys = ON;
`,
    { output: false },
  );
}

function ensureLane(laneId) {
  initializeSchema();
  runSql(
    `INSERT OR IGNORE INTO factory_lanes(lane_id) VALUES (${sql(laneId)});
INSERT INTO factory_events(lane_id, actor, event_type, note) VALUES (${sql(laneId)}, 'runtime', 'init-lane', 'Lane initialized.');`,
    { output: false },
  );
}

function parseWorkpackFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  const items = Array.isArray(parsed) ? parsed : parsed.workpacks;
  if (!Array.isArray(items)) {
    throw new Error("Workpack file must be a JSON array or an object with a workpacks array");
  }
  return items.map((item, index) => {
    const wpId = item.wp_id || item.id;
    const semanticKey = item.semantic_key || item.semanticKey || wpId;
    const sourceFiles = item.source_files || item.files || [];
    const validationCommands = item.validation_commands || item.validationCommands || [];
    const antiFakeChecks = item.anti_fake_checks || item.antiFakeChecks || [];
    return {
      wp_id: required(wpId, `workpacks[${index}].wp_id`),
      semantic_key: required(semanticKey, `workpacks[${index}].semantic_key`),
      source_files: Array.isArray(sourceFiles) ? sourceFiles.join("\n") : String(sourceFiles ?? ""),
      objective: required(item.objective || item.real_gap || item.gap, `workpacks[${index}].objective`),
      acceptance_tests: required(
        item.acceptance_tests || item.acceptanceTests || item.acceptance_rule || item.acceptance,
        `workpacks[${index}].acceptance_tests`,
      ),
      validation_commands: Array.isArray(validationCommands)
        ? validationCommands.join("\n")
        : required(validationCommands, `workpacks[${index}].validation_commands`),
      anti_fake_checks: Array.isArray(antiFakeChecks)
        ? antiFakeChecks.join("\n")
        : required(antiFakeChecks, `workpacks[${index}].anti_fake_checks`),
    };
  });
}

function importWorkpacks(laneId, filePath) {
  ensureLane(laneId);
  const workpacks = parseWorkpackFile(filePath);
  const rows = workpacks
    .map(
      (wp) =>
        `INSERT INTO factory_workpacks(lane_id, wp_id, semantic_key, source_files, objective, acceptance_tests, validation_commands, anti_fake_checks)
VALUES (${sql(laneId)}, ${sql(wp.wp_id)}, ${sql(wp.semantic_key)}, ${sql(wp.source_files)}, ${sql(wp.objective)}, ${sql(wp.acceptance_tests)}, ${sql(wp.validation_commands)}, ${sql(wp.anti_fake_checks)})
ON CONFLICT(lane_id, wp_id) DO UPDATE SET
  semantic_key = excluded.semantic_key,
  source_files = excluded.source_files,
  objective = excluded.objective,
  acceptance_tests = excluded.acceptance_tests,
  validation_commands = excluded.validation_commands,
  anti_fake_checks = excluded.anti_fake_checks
WHERE factory_workpacks.status = 'workpack_ready';`,
    )
    .join("\n");
  runSql(
    `BEGIN IMMEDIATE;
${rows}
INSERT INTO factory_events(lane_id, actor, event_type, note) VALUES (${sql(laneId)}, 'runtime', 'import-workpacks', ${sql(`Imported ${workpacks.length} workpack(s) from ${filePath}`)});
COMMIT;
SELECT ${sql(laneId)} AS lane_id, COUNT(*) AS rows FROM factory_workpacks WHERE lane_id=${sql(laneId)};`,
  );
}

function status(laneId) {
  initializeSchema();
  runSql(
    `.mode column
.headers on
SELECT status, COUNT(*) AS rows FROM factory_workpacks WHERE lane_id=${sql(laneId)} GROUP BY status ORDER BY status;
SELECT verified, COUNT(*) AS rows FROM factory_workpacks WHERE lane_id=${sql(laneId)} GROUP BY verified ORDER BY verified;
SELECT judge_status, COUNT(*) AS rows FROM factory_judge_results WHERE lane_id=${sql(laneId)} GROUP BY judge_status ORDER BY judge_status;`,
  );
}

function next(laneId) {
  initializeSchema();
  runSql(
    `.mode column
.headers on
SELECT wp_id, semantic_key, source_files, objective, acceptance_tests, validation_commands, anti_fake_checks
FROM factory_workpacks
WHERE lane_id=${sql(laneId)} AND status='workpack_ready'
ORDER BY wp_id
LIMIT 10;`,
  );
}

function claim(laneId, wpId, worker) {
  initializeSchema();
  runSql(
    `BEGIN IMMEDIATE;
UPDATE factory_workpacks
SET status='running', claimed_by=${sql(worker)}, claimed_at=datetime('now')
WHERE lane_id=${sql(laneId)} AND wp_id=${sql(wpId)} AND status='workpack_ready';
INSERT INTO factory_events(lane_id, wp_id, actor, event_type, note)
SELECT ${sql(laneId)}, ${sql(wpId)}, ${sql(worker)}, 'claim', 'F claimed workpack.' WHERE changes() = 1;
COMMIT;
SELECT lane_id, wp_id, status, claimed_by, claimed_at, verified FROM factory_workpacks WHERE lane_id=${sql(laneId)} AND wp_id=${sql(wpId)};`,
  );
}

function fDone(laneId, wpId, artifact, evidence, commit) {
  initializeSchema();
  required(artifact, "artifact");
  required(evidence, "evidence");
  required(commit, "commit");
  runSql(
    `BEGIN IMMEDIATE;
UPDATE factory_workpacks
SET status='f_done', artifact_path=${sql(artifact)}, validation_evidence=${sql(evidence)}, commit_hash=${sql(commit)}, f_done_at=datetime('now')
WHERE lane_id=${sql(laneId)} AND wp_id=${sql(wpId)} AND status='running';
INSERT INTO factory_events(lane_id, wp_id, actor, event_type, note)
SELECT ${sql(laneId)}, ${sql(wpId)}, 'F', 'f_done', ${sql(`Artifact: ${artifact}; evidence: ${evidence}; commit: ${commit}`)} WHERE changes() = 1;
COMMIT;
SELECT lane_id, wp_id, status, verified, artifact_path, validation_evidence, commit_hash FROM factory_workpacks WHERE lane_id=${sql(laneId)} AND wp_id=${sql(wpId)};`,
  );
}

function hold(laneId, wpId, reason) {
  initializeSchema();
  required(reason, "reason");
  runSql(
    `BEGIN IMMEDIATE;
UPDATE factory_workpacks
SET status='held', hold_reason=${sql(reason)}, held_at=datetime('now')
WHERE lane_id=${sql(laneId)} AND wp_id=${sql(wpId)} AND status='running';
INSERT INTO factory_events(lane_id, wp_id, actor, event_type, note)
SELECT ${sql(laneId)}, ${sql(wpId)}, 'F', 'held', ${sql(reason)} WHERE changes() = 1;
COMMIT;
SELECT lane_id, wp_id, status, verified, hold_reason, held_at FROM factory_workpacks WHERE lane_id=${sql(laneId)} AND wp_id=${sql(wpId)};`,
  );
}

function badWorkpack(laneId, wpId, reason) {
  initializeSchema();
  required(reason, "reason");
  runSql(
    `BEGIN IMMEDIATE;
UPDATE factory_workpacks
SET status='bad_workpack', hold_reason=${sql(reason)}, bad_workpack_at=datetime('now')
WHERE lane_id=${sql(laneId)} AND wp_id=${sql(wpId)} AND status IN ('workpack_ready', 'running');
INSERT INTO factory_events(lane_id, wp_id, actor, event_type, note)
SELECT ${sql(laneId)}, ${sql(wpId)}, 'F', 'bad_workpack', ${sql(reason)} WHERE changes() = 1;
COMMIT;
SELECT lane_id, wp_id, status, verified, hold_reason, bad_workpack_at FROM factory_workpacks WHERE lane_id=${sql(laneId)} AND wp_id=${sql(wpId)};`,
  );
}

function judge(laneId, wpId, statusValue, artifact, commit) {
  initializeSchema();
  if (!VALID_JUDGE_STATUSES.has(statusValue)) throw new Error(`Invalid judge status: ${statusValue}`);
  required(artifact, "artifact");
  required(commit, "commit");
  const validationSummary = `${statusValue} recorded by Judge/Admin for ${wpId} at ${commit}.`;
  const antiFakeSummary = "Judge/Admin verification is separate from F queue; F verified remains locked to 0.";
  runSql(
    `BEGIN IMMEDIATE;
INSERT INTO factory_judge_results(lane_id, wp_id, judge_status, commit_hash, judge_artifact, validation_summary, anti_fake_summary, verified_at)
VALUES (${sql(laneId)}, ${sql(wpId)}, ${sql(statusValue)}, ${sql(commit)}, ${sql(artifact)}, ${sql(validationSummary)}, ${sql(antiFakeSummary)}, datetime('now'))
ON CONFLICT(lane_id, wp_id) DO UPDATE SET
  judge_status=excluded.judge_status,
  commit_hash=excluded.commit_hash,
  judge_artifact=excluded.judge_artifact,
  validation_summary=excluded.validation_summary,
  anti_fake_summary=excluded.anti_fake_summary,
  verified_at=excluded.verified_at;
INSERT INTO factory_events(lane_id, wp_id, actor, event_type, note)
VALUES (${sql(laneId)}, ${sql(wpId)}, 'Judge', ${sql(statusValue)}, ${sql(`Judge artifact: ${artifact}; commit: ${commit}`)});
COMMIT;
SELECT lane_id, wp_id, judge_status, commit_hash, judge_artifact, verified_at FROM factory_judge_results WHERE lane_id=${sql(laneId)} AND wp_id=${sql(wpId)};`,
  );
}

function closeout(laneId) {
  initializeSchema();
  runSql(
    `.mode column
.headers on
SELECT ${sql(laneId)} AS lane_id;
SELECT status, COUNT(*) AS rows FROM factory_workpacks WHERE lane_id=${sql(laneId)} GROUP BY status ORDER BY status;
SELECT verified, COUNT(*) AS rows FROM factory_workpacks WHERE lane_id=${sql(laneId)} GROUP BY verified ORDER BY verified;
SELECT judge_status, COUNT(*) AS rows FROM factory_judge_results WHERE lane_id=${sql(laneId)} GROUP BY judge_status ORDER BY judge_status;
SELECT COUNT(*) AS blockers FROM factory_workpacks WHERE lane_id=${sql(laneId)} AND status='running';
SELECT COUNT(*) AS held FROM factory_workpacks WHERE lane_id=${sql(laneId)} AND status='held';
SELECT COUNT(*) AS bad_workpack FROM factory_workpacks WHERE lane_id=${sql(laneId)} AND status='bad_workpack';
SELECT COUNT(*) AS ready FROM factory_workpacks WHERE lane_id=${sql(laneId)} AND status='workpack_ready';
SELECT COUNT(*) AS rejected FROM factory_judge_results WHERE lane_id=${sql(laneId)} AND judge_status='judge_fail';
SELECT COUNT(*) AS f_done_without_judge FROM factory_workpacks w
LEFT JOIN factory_judge_results j ON j.lane_id=w.lane_id AND j.wp_id=w.wp_id
WHERE w.lane_id=${sql(laneId)} AND w.status='f_done' AND j.wp_id IS NULL;`,
  );
}

function lane3CompatReport() {
  initializeSchema();
  const lane3Queue = "reports/lane3-f-workpack-queue-2026-07-03.sqlite";
  const lane3Judge = "state/lane3_judge.sqlite";
  if (!existsSync(lane3Queue) || !existsSync(lane3Judge)) {
    throw new Error("Lane 3 queue or Judge ledger is missing");
  }
  const queue = spawnSync("sqlite3", [lane3Queue], {
    encoding: "utf8",
    input:
      "select status,count(*) from lane3_workpacks group by status order by status; select verified,count(*) from lane3_workpacks group by verified order by verified;",
  });
  const judgeOut = spawnSync("sqlite3", [lane3Judge], {
    encoding: "utf8",
    input: "select judge_status,count(*) from lane3_judge_results group by judge_status order by judge_status;",
  });
  if (queue.status !== 0) throw new Error(queue.stderr || queue.stdout);
  if (judgeOut.status !== 0) throw new Error(judgeOut.stderr || judgeOut.stdout);
  process.stdout.write(
    [
      "# Lane 3 Compatibility Report",
      "",
      `Generic runtime DB: ${dbPath()}`,
      `Legacy F queue: ${lane3Queue}`,
      `Legacy Judge ledger: ${lane3Judge}`,
      "",
      "## F Queue",
      queue.stdout.trim(),
      "",
      "## Judge Ledger",
      judgeOut.stdout.trim(),
      "",
      "F verified remains legacy-control-plane metadata only. Product verification is Judge ledger output.",
      "",
    ].join("\n"),
  );
}

function help() {
  console.log(`Usage:
  node scripts/factory/factory-runtime.mjs init-lane <lane_id>
  node scripts/factory/factory-runtime.mjs import-workpacks <lane_id> <file.json>
  node scripts/factory/factory-runtime.mjs status <lane_id>
  node scripts/factory/factory-runtime.mjs next <lane_id>
  node scripts/factory/factory-runtime.mjs claim <lane_id> <wp_id> <worker>
  node scripts/factory/factory-runtime.mjs f-done <lane_id> <wp_id> <artifact> <evidence> <commit>
  node scripts/factory/factory-runtime.mjs hold <lane_id> <wp_id> <reason>
  node scripts/factory/factory-runtime.mjs bad-workpack <lane_id> <wp_id> <reason>
  node scripts/factory/factory-runtime.mjs judge-pass <lane_id> <wp_id> <artifact> <commit>
  node scripts/factory/factory-runtime.mjs judge-fail <lane_id> <wp_id> <artifact> <commit>
  node scripts/factory/factory-runtime.mjs closeout <lane_id>
  node scripts/factory/factory-runtime.mjs lane3-compat-report

Environment:
  FACTORY_RUNTIME_DB=/path/to/factory_runtime.sqlite

F queue verified is locked to 0. Judge ledger is the only product verification source.`);
}

export function main(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;
  if (!command || command === "--help" || command === "help") {
    help();
    return;
  }
  if (command === "init-lane") {
    const laneId = required(args[0], "lane_id");
    ensureLane(laneId);
    console.log(`initialized ${laneId} at ${dbPath()}`);
    return;
  }
  if (command === "import-workpacks") return importWorkpacks(required(args[0], "lane_id"), required(args[1], "file"));
  if (command === "status") return status(required(args[0], "lane_id"));
  if (command === "next") return next(required(args[0], "lane_id"));
  if (command === "claim") return claim(required(args[0], "lane_id"), required(args[1], "wp_id"), required(args[2], "worker"));
  if (command === "f-done") {
    return fDone(required(args[0], "lane_id"), required(args[1], "wp_id"), required(args[2], "artifact"), required(args[3], "evidence"), required(args[4], "commit"));
  }
  if (command === "hold") return hold(required(args[0], "lane_id"), required(args[1], "wp_id"), required(args[2], "reason"));
  if (command === "bad-workpack") return badWorkpack(required(args[0], "lane_id"), required(args[1], "wp_id"), required(args[2], "reason"));
  if (command === "judge-pass") return judge(required(args[0], "lane_id"), required(args[1], "wp_id"), "judge_pass", required(args[2], "artifact"), required(args[3], "commit"));
  if (command === "judge-fail") return judge(required(args[0], "lane_id"), required(args[1], "wp_id"), "judge_fail", required(args[2], "artifact"), required(args[3], "commit"));
  if (command === "closeout") return closeout(required(args[0], "lane_id"));
  if (command === "lane3-compat-report") return lane3CompatReport();
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
  VALID_F_STATUSES,
  VALID_JUDGE_STATUSES,
  parseWorkpackFile,
  runSql,
  sql,
};
