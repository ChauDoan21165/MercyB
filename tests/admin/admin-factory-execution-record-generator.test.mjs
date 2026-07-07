import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-execution-record-generator.mjs");
function run() { const d = fs.mkdtempSync(path.join(os.tmpdir(), "exec-rec-")); const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot }); let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ } return { ...r, parsed: p, tmpDir: d }; }
describe("EXECUTION-RECORD-GENERATOR-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("discovers packages", () => { const r = run(); if (typeof r.parsed?.packages_discovered !== "number") throw new Error("No package count"); });
  it("generates execution records", () => { const r = run(); if (r.parsed?.records_generated < 1) throw new Error("No records generated"); });
  it("produces individual record files", () => { const r = run(); const files = fs.readdirSync(r.parsed.output_dir).filter((f) => f.startsWith("EXEC-")); if (files.length === 0) throw new Error("No record files"); });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.records_generated !== b.parsed?.records_generated) throw new Error("Non-deterministic"); });
});
