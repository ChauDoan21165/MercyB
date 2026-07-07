import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-level2-replay.mjs");

function run(args = []) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "l2replay-"));
  const r = spawnSync(process.execPath, [sp, "-o", d, ...args], { encoding: "utf8", cwd: repoRoot });
  let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ }
  return { ...r, parsed: p, tmpDir: d };
}

describe("LEVEL2-REPLAY-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("collects snapshots", () => { const r = run(); if (typeof r.parsed?.snapshot_count !== "number") throw new Error("No snapshot count"); });
  it("produces prediction_accuracy.json", () => {
    const r = run();
    const a = JSON.parse(fs.readFileSync(r.parsed.accuracy_path, "utf8"));
    if (typeof a.accuracy_rate !== "number") throw new Error("No accuracy_rate");
  });
  it("produces report", () => { const r = run(); if (!fs.existsSync(r.parsed.report_path)) throw new Error("Report missing"); });
  it("marks no mutations", () => {
    const r = run();
    const m = JSON.parse(fs.readFileSync(r.parsed.manifest_path, "utf8"));
    if (m.mutation_summary.queue_mutations !== "none") throw new Error("Should be no mutations");
  });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.accuracy_rate !== b.parsed?.accuracy_rate) throw new Error("Non-deterministic"); });
});
