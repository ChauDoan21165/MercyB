#!/usr/bin/env tsx
/**
 * Auto-Fix Suite – Part 2: Entry count auditor
 *
 * Reports rooms with entries.length < 2 or > 8.
 * Does NOT modify files – just prints a report.
 *
 * Usage:
 *   npx tsx scripts/audit-room-entries.ts
 */

import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "public", "data");

type Problem = {
  file: string;
  id?: unknown;
  count: number | null;
  reason: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function main() {
  console.log("🔍 Auditing room entry counts in", DATA_DIR);

  let files: string[] = [];
  try {
    files = readdirSync(DATA_DIR).filter(
      (f) => f.endsWith(".json") && f !== "room-metrics.json",
    );
  } catch (e) {
    console.error("❌ Cannot read data dir:", DATA_DIR);
    console.error(e);
    process.exitCode = 2;
    return;
  }

  const problems: Problem[] = [];

  for (const file of files) {
    const full = join(DATA_DIR, file);

    let raw: string;
    try {
      raw = readFileSync(full, "utf8");
    } catch {
      problems.push({
        file,
        count: null,
        reason: "file read error",
      });
      continue;
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      problems.push({
        file,
        count: null,
        reason: "JSON parse error",
      });
      continue;
    }

    const room = isRecord(json) ? json : {};
    const id = room.id;
    const entries = room.entries;

    if (!Array.isArray(entries)) {
      problems.push({
        file,
        id,
        count: null,
        reason: "entries is not an array",
      });
      continue;
    }

    const count = entries.length;
    if (count < 2 || count > 8) {
      problems.push({
        file,
        id,
        count,
        reason: `entries.length = ${count} (must be 2–8)`,
      });
    }
  }

  console.log("");
  if (!problems.length) {
    console.log("✅ All rooms have valid entry counts (2–8).");
    process.exitCode = 0;
    return;
  }

  console.log(`⚠️ Found ${problems.length} rooms with invalid entry counts:\n`);
  for (const p of problems) {
    console.log(`• ${p.file}${p.id ? `  [id: ${p.id}]` : ""} → ${p.reason}`);
  }

  // Non-zero so CI can flag it if you want.
  process.exitCode = 1;
}

main();
