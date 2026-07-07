import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-human-gate-analyzer.mjs");

function run() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "l2hga-"));
  const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: d };
}

describe("HUMAN-GATE-ANALYZER-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("produces human-gate-analysis.json", () => { const r = run(); if (!fs.existsSync(r.parsed.manifest_path)) throw new Error("Missing"); });
  it("classifies gates by category", () => {
    const r = run();
    const m = JSON.parse(fs.readFileSync(r.parsed.manifest_path, "utf8"));
    if (!Array.isArray(m.analysis?.categories)) throw new Error("categories not array");
  });
  it("reports potentially_deterministic count", () => {
    const r = run();
    if (typeof r.parsed.potentially_deterministic !== "number") throw new Error("Missing potentially_deterministic");
  });
  it("potentially_deterministic + always_requires_human = total_gates", () => {
    const r = run();
    if (r.parsed.potentially_deterministic + r.parsed.always_requires_human !== r.parsed.total_gates) throw new Error("Count mismatch");
  });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.total_gates !== b.parsed?.total_gates) throw new Error("Non-deterministic"); });
});
