/**
 * ADMIN-FACTORY-AUTONOMY-DASHBOARD-001 — Tests
 */

import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scriptPath = path.join(repoRoot, "scripts/admin/admin-factory-autonomy-dashboard.mjs");

function runScript(args = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dashboard-test-"));
  const result = spawnSync(process.execPath, [scriptPath, "-o", tmpDir, ...args], { encoding: "utf8", cwd: repoRoot });
  let parsed = null;
  try { parsed = JSON.parse((result.stdout || "").trim()); } catch { /* */ }
  return { ...result, parsed, tmpDir };
}

describe("ADMIN-FACTORY-AUTONOMY-DASHBOARD-001", () => {
  it("exits successfully", () => {
    const r = runScript();
    if (!r.parsed?.ok) throw new Error(`Failed: ${JSON.stringify(r.parsed)}`);
  });

  it("reports an autonomy level", () => {
    const r = runScript();
    const level = r.parsed?.autonomy_level;
    if (!level) throw new Error("autonomy_level missing");
    if (!["LEVEL_1_ADVISORY_ONLY", "LEVEL_2_AUTO_EXECUTE_SAFE"].includes(level)) {
      throw new Error(`Unknown autonomy level: ${level}`);
    }
  });

  it("produces dashboard JSON", () => {
    const r = runScript();
    const jsonPath = r.parsed?.dashboard_json;
    if (!jsonPath || !fs.existsSync(jsonPath)) throw new Error("dashboard JSON missing");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (!data.autonomy) throw new Error("autonomy section missing");
    if (!data.workers) throw new Error("workers section missing");
    if (!data.queue) throw new Error("queue section missing");
    if (!data.simulation_actions) throw new Error("simulation_actions section missing");
    if (!data.human_gates) throw new Error("human_gates section missing");
  });

  it("produces dashboard Markdown", () => {
    const r = runScript();
    const mdPath = r.parsed?.dashboard_md;
    if (!mdPath || !fs.existsSync(mdPath)) throw new Error("dashboard MD missing");
    const content = fs.readFileSync(mdPath, "utf8");
    if (!content.includes("Admin Factory Autonomy Dashboard")) throw new Error("Bad title");
    if (!content.includes("Autonomy Status")) throw new Error("Missing Autonomy Status section");
    if (!content.includes("Workers")) throw new Error("Missing Workers section");
    if (!content.includes("Queue")) throw new Error("Missing Queue section");
  });

  it("includes data source references", () => {
    const r = runScript();
    const data = JSON.parse(fs.readFileSync(r.parsed.dashboard_json, "utf8"));
    if (!data.data_sources) throw new Error("data_sources missing");
  });

  it("is deterministic", () => {
    const r1 = runScript();
    const r2 = runScript();
    if (r1.parsed?.autonomy_level !== r2.parsed?.autonomy_level) throw new Error("Non-deterministic");
  });

  it("declares zero mutations", () => {
    const r = runScript();
    const md = fs.readFileSync(r.parsed.dashboard_md, "utf8");
    if (!md.includes("database_writes: none")) throw new Error("Should declare no mutations");
  });
});
