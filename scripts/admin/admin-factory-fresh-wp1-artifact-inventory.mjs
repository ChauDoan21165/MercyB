#!/usr/bin/env node
/**
 * FRESH-WP-001 — Factory Artifact Inventory
 * READ_ONLY. Scans all factory output directories and produces a deterministic inventory.
 * No mutations. No DB writes. No product changes.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join("/Users/admin/autorun/reports/fresh-workpack-1-artifact-inventory");

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }

const SCAN_ROOTS = [
  "/Users/admin/autorun/reports",
  path.join(repoRoot, "state/packets"),
  path.join(repoRoot, "artifacts"),
  path.join(repoRoot, "fixtures/admin"),
];

function scan() {
  const inventory = { roots: {}, total_files: 0, total_bytes: 0, by_extension: {} };
  for (const root of SCAN_ROOTS) {
    if (!exists(root)) { inventory.roots[root] = { exists: false, files: 0 }; continue; }
    const files = [];
    const stack = [root];
    while (stack.length) {
      const dir = stack.pop();
      let entries;
      try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") stack.push(full);
        else if (e.isFile()) {
          try {
            const stat = fs.statSync(full);
            const ext = path.extname(e.name).slice(1) || "none";
            files.push({ path: full, bytes: stat.size, ext });
            inventory.total_files += 1;
            inventory.total_bytes += stat.size;
            inventory.by_extension[ext] = (inventory.by_extension[ext] || 0) + 1;
          } catch { /* skip */ }
        }
      }
    }
    inventory.roots[root] = { exists: true, files: files.length, bytes: files.reduce((s, f) => s + f.bytes, 0) };
  }
  return inventory;
}

function main() {
  ensureDir(OUT);
  const inventory = scan();
  const report = {
    schema: "fresh-workpack/v1", workpack_id: "FRESH-WP-001",
    title: "Factory Artifact Inventory",
    generated_at: new Date().toISOString(),
    runner: "ADMIN-FACTORY-FRESH-WP1",
    mutation_level: "read_only", risk_level: "low",
    inventory,
    summary: `${inventory.total_files} files, ${(inventory.total_bytes / 1024 / 1024).toFixed(1)} MB across ${Object.keys(inventory.roots).length} roots`,
  };
  const p = path.join(OUT, "artifact-inventory.json");
  fs.writeFileSync(p, JSON.stringify(report, null, 2) + "\n");
  process.stdout.write(JSON.stringify({ ok: true, workpack: "FRESH-WP-001", total_files: inventory.total_files, report_path: p }, null, 2) + "\n");
}
main();
