import { describe, it, afterEach } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-human-gate-analyzer.mjs");

const created = [];

// Hermetic: point the analyzer at a unique tmp reports-root (via
// ADMIN_FACTORY_REPORTS_ROOT) and seed a KNOWN escalator fixture there, so the
// test reads OUR data — never ambient /Users/admin state. Deterministic on any
// machine (incl. the Admin host). Cleaned up in afterEach → zero residue.
function run() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "l2hga-"));
  created.push(root);
  const escDir = path.join(root, "admin-factory-exception-escalator");
  fs.mkdirSync(escDir, { recursive: true });
  fs.writeFileSync(
    path.join(escDir, "exception-escalator-manifest.json"),
    JSON.stringify({
      results: [
        { item_id: "GATE-OWN-1", classification: "HUMAN_GATE_REQUIRED", severity: "high", matched_rules: [{ category: "ownership" }] },
        { item_id: "GATE-SAFE-1", classification: "HUMAN_GATE_REQUIRED", severity: "critical", matched_rules: [{ category: "safety" }] },
        { item_id: "NOT-A-GATE", classification: "AUTO_RESOLVED", severity: "low", matched_rules: [{ category: "retry" }] },
      ],
    }),
  );
  const r = spawnSync(process.execPath, [sp, root], {
    encoding: "utf8",
    cwd: repoRoot,
    env: { ...process.env, ADMIN_FACTORY_REPORTS_ROOT: root },
  });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: root };
}

afterEach(() => {
  for (const d of created.splice(0)) fs.rmSync(d, { recursive: true, force: true });
});

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
  it("counts reflect the seeded fixture (2 HUMAN_GATE_REQUIRED: ownership=deterministic, safety=human)", () => {
    const r = run();
    if (r.parsed.total_gates !== 2) throw new Error(`Expected 2 gates, got ${r.parsed.total_gates}`);
    if (r.parsed.potentially_deterministic !== 1) throw new Error(`Expected 1 deterministic, got ${r.parsed.potentially_deterministic}`);
    if (r.parsed.always_requires_human !== 1) throw new Error(`Expected 1 human, got ${r.parsed.always_requires_human}`);
    const m = JSON.parse(fs.readFileSync(r.parsed.manifest_path, "utf8"));
    if (m.analysis.categories.length !== 2) throw new Error(`Expected 2 categories, got ${m.analysis.categories.length}`);
  });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.total_gates !== b.parsed?.total_gates) throw new Error("Non-deterministic"); });
});
