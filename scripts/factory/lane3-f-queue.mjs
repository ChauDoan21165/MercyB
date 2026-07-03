#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const DB_PATH = "reports/lane3-f-workpack-queue-2026-07-03.sqlite";

function sql(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function runSql(statement) {
  const result = spawnSync("sqlite3", [DB_PATH], {
    encoding: "utf8",
    input: statement,
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
  process.stdout.write(result.stdout);
}

const [command, ...args] = process.argv.slice(2);

if (command === "next") {
  runSql(".mode column\n.headers on\nSELECT * FROM f_claimable LIMIT 10;");
} else if (command === "status") {
  runSql(
    ".mode column\n.headers on\n" +
      "SELECT status, COUNT(*) AS rows FROM lane3_workpacks GROUP BY status ORDER BY status;\n" +
      "SELECT verified, COUNT(*) AS rows FROM lane3_workpacks GROUP BY verified;",
  );
} else if (command === "claim") {
  const [wpId, actor = "F"] = args;
  if (!wpId) {
    console.error("Usage: lane3-f-queue.mjs claim <WP-L3-NNN> [actor]");
    process.exit(2);
  }
  runSql(
    "BEGIN IMMEDIATE;\n" +
      `UPDATE lane3_workpacks SET status='running', claimed_by=${sql(actor)}, claimed_at=datetime('now') ` +
      `WHERE wp_id=${sql(wpId)} AND status='workpack_ready';\n` +
      `INSERT INTO f_events (wp_id, from_status, to_status, actor, note, verified) ` +
      `SELECT ${sql(wpId)}, 'workpack_ready', 'running', ${sql(actor)}, 'F claimed workpack for implementation.', 0 ` +
      `WHERE changes() = 1;\n` +
      "COMMIT;\n" +
      `SELECT wp_id, status, claimed_by, claimed_at FROM lane3_workpacks WHERE wp_id=${sql(wpId)};`,
  );
} else if (command === "done") {
  const [wpId, artifactPath, validationEvidence, commitHash = "", pushedAt = ""] = args;
  if (!wpId || !artifactPath || !validationEvidence) {
    console.error("Usage: lane3-f-queue.mjs done <WP-L3-NNN> <artifact_path> <validation_evidence> [commit_hash] [pushed_at]");
    process.exit(2);
  }
  runSql(
    "BEGIN IMMEDIATE;\n" +
      `UPDATE lane3_workpacks SET status='f_done', f_done_artifact=${sql(artifactPath)}, ` +
      `validation_evidence=${sql(validationEvidence)}, commit_hash=${sql(commitHash)}, pushed_at=${sql(pushedAt)} ` +
      `WHERE wp_id=${sql(wpId)} AND status='running';\n` +
      `INSERT INTO f_events (wp_id, from_status, to_status, actor, note, verified) ` +
      `SELECT ${sql(wpId)}, 'running', 'f_done', 'F', ${sql(`Artifact: ${artifactPath}; validation: ${validationEvidence}`)}, 0 ` +
      `WHERE changes() = 1;\n` +
      "COMMIT;\n" +
      `SELECT wp_id, status, verified, f_done_artifact, validation_evidence FROM lane3_workpacks WHERE wp_id=${sql(wpId)};`,
  );
} else {
  console.log(
    [
      "Usage:",
      "  node scripts/factory/lane3-f-queue.mjs status",
      "  node scripts/factory/lane3-f-queue.mjs next",
      "  node scripts/factory/lane3-f-queue.mjs claim <WP-L3-NNN> [actor]",
      "  node scripts/factory/lane3-f-queue.mjs done <WP-L3-NNN> <artifact_path> <validation_evidence> [commit_hash] [pushed_at]",
      "",
      "This script cannot mark workpacks verified. Judge/Admin promotion is separate.",
    ].join("\n"),
  );
}
