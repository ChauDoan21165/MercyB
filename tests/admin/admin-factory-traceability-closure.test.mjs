import { describe, it, afterEach } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-traceability-closure.mjs");

const created = [];

// Hermetic: point the closure planner at a unique tmp reports-root (via
// ADMIN_FACTORY_REPORTS_ROOT) and seed a KNOWN traceability-gap fixture there,
// so the test reads OUR data — never ambient /Users/admin state. Deterministic
// on any machine. Cleaned up in afterEach → zero residue.
function run() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "l2tc-"));
  created.push(root);
  const gapDir = path.join(root, "aak-traceability-gap");
  fs.mkdirSync(gapDir, { recursive: true });
  fs.writeFileSync(
    path.join(gapDir, "aak-traceability-gap-manifest.json"),
    JSON.stringify({
      package_gaps: [
        {
          package_id: "PKG-1",
          missing_edges: [{ relationship: "DECISION_TO_EIP", from: "A", to: "B" }], // auto_fixable
          missing_nodes: ["EIP"], // auto_fixable
        },
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
  it("counts reflect the seeded fixture (1 DECISION edge + 1 EIP node, both auto-fixable)", () => {
    const r = run();
    if (r.parsed.total_gaps !== 2) throw new Error(`Expected 2 gaps, got ${r.parsed.total_gaps}`);
    if (r.parsed.auto_fixable !== 2) throw new Error(`Expected 2 auto_fixable, got ${r.parsed.auto_fixable}`);
    if (r.parsed.requires_human !== 0) throw new Error(`Expected 0 requires_human, got ${r.parsed.requires_human}`);
    const edges = JSON.parse(fs.readFileSync(r.parsed.missing_edges_path, "utf8"));
    if (!Array.isArray(edges.by_edge_type) || edges.by_edge_type.length !== 1) throw new Error("Expected 1 edge type");
  });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.total_gaps !== b.parsed?.total_gaps) throw new Error("Non-deterministic"); });
});
