#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { lintSqlFiles } from "./sql-lint.mjs";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    encoding: "utf8",
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with ${result.status}`);
  }
}

function capture(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr}`);
  }
  return result.stdout.trim();
}

function changedFiles() {
  const explicit = process.argv.slice(2);
  if (explicit.length > 0) return explicit;

  const before = process.env.CI_COMMIT_BEFORE_SHA;
  const after = process.env.CI_COMMIT_SHA || "HEAD";
  if (!before || /^0+$/.test(before)) {
    return capture("git", ["diff-tree", "--no-commit-id", "--name-only", "-r", after]).split(/\r?\n/).filter(Boolean);
  }
  return capture("git", ["diff", "--name-only", before, after]).split(/\r?\n/).filter(Boolean);
}

function sqlLiteral(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

function main() {
  const databaseUrl = process.env.MIGRATOR_DATABASE_URL;
  if (!databaseUrl) throw new Error("MIGRATOR_DATABASE_URL is required");

  const files = changedFiles()
    .filter((file) => /^supabase\/migrations\/.*\.sql$/u.test(file))
    .filter((file) => existsSync(file))
    .sort((a, b) => basename(a).localeCompare(basename(b)));

  if (files.length === 0) {
    console.log("apply-migrations-on-main: no new migration files");
    return;
  }

  const lintResults = lintSqlFiles(files);
  const failures = lintResults.filter((result) => !result.ok);
  for (const result of lintResults) {
    console.log(`${result.ok ? "PASS" : "FAIL"} ${result.filePath}${result.findings.length ? ` [${result.findings.join(", ")}]` : ""}`);
  }
  if (failures.length > 0) {
    throw new Error("sql-lint failed; refusing to apply migrations");
  }

  run("psql", [
    databaseUrl,
    "-v",
    "ON_ERROR_STOP=1",
    "-c",
    "create table if not exists public.applied_migrations (filename text primary key, applied_at timestamptz not null default now(), commit_sha text null)",
  ]);

  for (const file of files) {
    const filename = basename(file);
    const exists = capture("psql", [
      databaseUrl,
      "-tAc",
      `select 1 from public.applied_migrations where filename = ${sqlLiteral(filename)} limit 1`,
    ]);
    if (exists === "1") {
      console.log(`apply-migrations-on-main: skip already applied ${filename}`);
      continue;
    }

    console.log(`apply-migrations-on-main: applying ${file}`);
    run("psql", [databaseUrl, "-v", "ON_ERROR_STOP=1", "-f", file]);
    run("psql", [
      databaseUrl,
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      `insert into public.applied_migrations (filename, commit_sha) values (${sqlLiteral(filename)}, ${sqlLiteral(process.env.CI_COMMIT_SHA || "")})`,
    ]);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
