import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sp = path.join(repoRoot, "scripts/admin/admin-factory-judge-package-generator.mjs");
function run() { const d = fs.mkdtempSync(path.join(os.tmpdir(), "judge-pkg-")); const r = spawnSync(process.execPath, [sp, d], { encoding: "utf8", cwd: repoRoot }); let p = null; try { p = JSON.parse((r.stdout || "").trim()); } catch { /* */ } return { ...r, parsed: p, tmpDir: d }; }
describe("JUDGE-PACKAGE-GENERATOR-001", () => {
  it("exits ok", () => { const r = run(); if (!r.parsed?.ok) throw new Error(JSON.stringify(r.parsed)); });
  it("generates judge packages", () => { const r = run(); if (typeof r.parsed?.total_packages !== "number") throw new Error("No package count"); });
  it("reports judge_ready count", () => { const r = run(); if (typeof r.parsed?.judge_ready !== "number") throw new Error("No judge_ready"); });
  it("judge_ready <= total_packages", () => { const r = run(); if (r.parsed.judge_ready > r.parsed.total_packages) throw new Error("Impossible"); });
  it("is deterministic", () => { const a = run(), b = run(); if (a.parsed?.judge_ready !== b.parsed?.judge_ready) throw new Error("Non-deterministic"); });
});
