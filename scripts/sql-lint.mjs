#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";

export const APPROVAL_MARKER_PREFIX = "-- CHAU-APPROVED: Approve Phase 2 destructive SQL for ";

const FORBIDDEN_PATTERNS = [
  { name: "DROP", pattern: /\bdrop\b/i },
  { name: "TRUNCATE", pattern: /\btruncate\b/i },
  { name: "DELETE", pattern: /\bdelete\s+from\b/i },
  { name: "UPDATE", pattern: /\bupdate\b/i },
  { name: "REVOKE", pattern: /\brevoke\b/i },
  { name: "ALTER...DROP", pattern: /\balter\b[\s\S]*?\bdrop\b/i },
];

export function stripSqlCommentsAndStrings(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--.*$/gm, " ")
    .replace(/'(?:''|[^'])*'/g, "''")
    .replace(/\$(\w*)\$[\s\S]*?\$\1\$/g, "$$");
}

export function hasApprovalMarker(sql) {
  return sql.split(/\r?\n/).some((line) => line.startsWith(APPROVAL_MARKER_PREFIX) && line.trim().length > APPROVAL_MARKER_PREFIX.length);
}

export function lintSqlText(sql, filePath = "<inline>") {
  const normalized = stripSqlCommentsAndStrings(sql);
  const findings = FORBIDDEN_PATTERNS
    .filter(({ pattern }) => pattern.test(normalized))
    .map(({ name }) => name);

  if (findings.length === 0 || hasApprovalMarker(sql)) {
    return { ok: true, filePath, findings };
  }

  return {
    ok: false,
    filePath,
    findings,
    message: `${filePath}: destructive SQL requires marker: ${APPROVAL_MARKER_PREFIX}<task>`,
  };
}

export function lintSqlFiles(files, cwd = process.cwd()) {
  return files
    .filter((file) => /^supabase\/migrations\/.*\.sql$/u.test(file))
    .map((file) => lintSqlText(readFileSync(file, "utf8"), relative(cwd, file)));
}

function main(argv) {
  const files = argv.filter((arg) => arg.endsWith(".sql"));
  if (files.length === 0) {
    console.log("sql-lint: no SQL files to lint");
    return 0;
  }

  const results = lintSqlFiles(files);
  const failures = results.filter((result) => !result.ok);
  for (const result of results) {
    const status = result.ok ? "PASS" : "FAIL";
    console.log(`${status} ${result.filePath}${result.findings.length ? ` [${result.findings.join(", ")}]` : ""}`);
    if (result.message) console.error(result.message);
  }
  return failures.length > 0 ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
