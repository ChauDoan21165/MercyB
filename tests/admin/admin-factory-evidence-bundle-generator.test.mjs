import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-evidence-bundle-generator.mjs");
function run() { const d = fs.mkdtempSync(path.join(os.tmpdir(), "ev-bundle-")); const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot }); let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ } return { ...r, parsed: p, tmpDir: d }; }
describe("EVIDENCE-BUNDLE-GENERATOR-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("generates bundles", () => { const r = run(); if (typeof r.parsed?.bundles_generated !== "number") throw new Error("No bundle count"); });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.bundles_generated !== b.parsed?.bundles_generated) throw new Error("Non-deterministic"); });
});
