import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-traceability-closure.mjs");

function run() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "l2tc-"));
  const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: d };
}

describe("TRACEABILITY-CLOSURE-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("produces missing_edges.json", () => { const r = run(); if (!fs.existsSync(r.parsed.missing_edges_path)) throw new Error("Missing"); });
  it("classifies gaps as auto-fixable or requires-human", () => {
    const r = run();
    const edges = JSON.parse(fs.readFileSync(r.parsed.missing_edges_path, "utf8"));
    if (typeof edges.edges !== "object" && !Array.isArray(edges.edges)) throw new Error("edges not array");
    if (typeof r.parsed.auto_fixable !== "number") throw new Error("auto_fixable not a number");
    if (typeof r.parsed.requires_human !== "number") throw new Error("requires_human not a number");
  });
  it("auto_fixable + requires_human = total_gaps", () => {
    const r = run();
    if (r.parsed.auto_fixable + r.parsed.requires_human !== r.parsed.total_gaps) throw new Error("Count mismatch");
  });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.total_gaps !== b.parsed?.total_gaps) throw new Error("Non-deterministic"); });
});
