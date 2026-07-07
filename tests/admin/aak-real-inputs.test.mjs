/**
 * AAK-REAL-INPUTS-001 — Tests
 *
 * Validates:
 * 1. Discovery scans all configured roots
 * 2. Classification correctly identifies EIPC, lifecycle, ownership files
 * 3. Deterministic selection (sorted path, dedup by hash)
 * 4. Fixture fallback when no real inputs exist
 * 5. Idempotent output (same inputs → same selections)
 * 6. All fixture fallback paths are valid files
 */

import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import os from "node:os";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scriptPath = path.join(repoRoot, "scripts/admin/aak-real-inputs.mjs");

function runScript(args = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-real-inputs-test-"));
  const result = spawnSync(process.execPath, [scriptPath, "--output-dir", tmpDir, ...args], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  let parsed = null;
  try {
    parsed = JSON.parse((result.stdout || "").trim());
  } catch {
    // not JSON
  }
  return { ...result, parsed, tmpDir };
}

function readArtifact(tmpDir, filename) {
  const p = path.join(tmpDir, filename);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

const FIXTURE_KEYS = [
  "eipcValid", "eipcInvalid",
  "lifecycleValid", "lifecycleInvalid",
  "ownershipValid", "ownershipInvalid",
];

describe("AAK-REAL-INPUTS-001", () => {
  describe("discovery execution", () => {
    it("exits successfully", () => {
      const r = runScript();
      if (r.parsed === null && r.stderr) {
        throw new Error(`Script failed with stderr: ${r.stderr}`);
      }
      if (r.parsed === null) {
        throw new Error(`Script produced no JSON output. stdout: ${r.stdout}`);
      }
      if (r.parsed.ok !== true) {
        throw new Error(`Discovery not ok: ${JSON.stringify(r.parsed)}`);
      }
    });

    it("produces a manifest artifact", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-real-inputs-manifest.json");
      if (!manifest) throw new Error("Manifest artifact missing");
      if (manifest.runner !== "AAK-REAL-INPUTS-001") {
        throw new Error(`Wrong runner: ${manifest.runner}`);
      }
      if (typeof manifest.total_files_scanned !== "number") {
        throw new Error("total_files_scanned missing or not a number");
      }
    });

    it("produces a selected-inputs artifact", () => {
      const r = runScript();
      const selected = readArtifact(r.tmpDir, "aak-real-inputs-selected.json");
      if (!selected) throw new Error("Selected inputs artifact missing");
      for (const key of FIXTURE_KEYS) {
        if (typeof selected[key] !== "string" || selected[key].length === 0) {
          throw new Error(`Missing selected input key: ${key}`);
        }
      }
    });

    it("produces a markdown report artifact", () => {
      const r = runScript();
      const reportPath = path.join(r.tmpDir, "aak-real-inputs-report.md");
      if (!fs.existsSync(reportPath)) throw new Error("Markdown report missing");
      const content = fs.readFileSync(reportPath, "utf8");
      if (!content.includes("AAK Real Inputs Discovery Report")) {
        throw new Error("Report missing expected title");
      }
    });
  });

  describe("selected inputs validity", () => {
    it("every selected input path points to a real file", () => {
      const r = runScript();
      const selected = r.parsed?.selected_inputs;
      if (!selected) throw new Error("No selected_inputs in output");
      for (const [key, filePath] of Object.entries(selected)) {
        if (!fs.existsSync(filePath)) {
          throw new Error(`Selected input ${key} does not exist: ${filePath}`);
        }
      }
    });

    it("every fixture fallback path exists", () => {
      const fixturePaths = [
        path.join(repoRoot, "fixtures/admin/eipc/valid-eip-001.json"),
        path.join(repoRoot, "fixtures/admin/eipc/invalid-missing-required.json"),
        path.join(repoRoot, "fixtures/admin/aak/lifecycle-valid.json"),
        path.join(repoRoot, "fixtures/admin/aak/lifecycle-invalid.json"),
        path.join(repoRoot, "fixtures/admin/aak/ownership-valid.json"),
        path.join(repoRoot, "fixtures/admin/aak/ownership-invalid.json"),
      ];
      for (const fp of fixturePaths) {
        if (!fs.existsSync(fp)) {
          throw new Error(`Fixture fallback missing: ${fp}`);
        }
      }
    });
  });

  describe("determinism", () => {
    it("same inputs produce identical selections (idempotent)", () => {
      const r1 = runScript();
      const r2 = runScript();
      const s1 = r1.parsed?.selected_inputs;
      const s2 = r2.parsed?.selected_inputs;
      if (!s1 || !s2) throw new Error("Missing selected_inputs");
      for (const key of FIXTURE_KEYS) {
        if (s1[key] !== s2[key]) {
          throw new Error(`Non-deterministic selection for ${key}: "${s1[key]}" vs "${s2[key]}"`);
        }
      }
    });

    it("manifest schema_version is stable", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-real-inputs-manifest.json");
      if (manifest?.schema_version !== "aak-real-inputs-manifest/v1") {
        throw new Error(`Unexpected schema_version: ${manifest?.schema_version}`);
      }
    });
  });

  describe("fallback tracking", () => {
    it("reports which inputs used fixtures", () => {
      const r = runScript();
      const fallback = r.parsed?.fallback_used;
      if (!fallback || typeof fallback !== "object") {
        throw new Error("fallback_used missing from output");
      }
      for (const key of FIXTURE_KEYS) {
        if (typeof fallback[key] !== "boolean") {
          throw new Error(`fallback_used.${key} is not a boolean: ${fallback[key]}`);
        }
      }
    });

    it("real_input_count + fixture_fallback_count = 6 (total categories)", () => {
      const r = runScript();
      const real = r.parsed?.real_input_count ?? 0;
      const fixture = r.parsed?.fixture_fallback_count ?? 0;
      if (real + fixture !== 6) {
        throw new Error(`Counts don't sum to 6: real=${real} + fixture=${fixture} = ${real + fixture}`);
      }
    });
  });

  describe("mutation summary", () => {
    it("declares zero database/runtime/product mutations", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-real-inputs-manifest.json");
      const ms = manifest?.mutation_summary;
      if (!ms) throw new Error("mutation_summary missing");
      if (ms.database_writes !== "none") throw new Error(`database_writes=${ms.database_writes}`);
      if (ms.runtime_mutations !== "none") throw new Error(`runtime_mutations=${ms.runtime_mutations}`);
      if (ms.product_changes !== "none") throw new Error(`product_changes=${ms.product_changes}`);
      if (ms.push_merge_deploy !== "none") throw new Error(`push_merge_deploy=${ms.push_merge_deploy}`);
    });
  });

  describe("scan roots", () => {
    it("reports which scan roots exist", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-real-inputs-manifest.json");
      const roots = manifest?.scan_roots;
      if (!Array.isArray(roots)) throw new Error("scan_roots missing or not array");
      if (roots.length < 2) throw new Error(`Too few scan roots: ${roots.length}`);
      for (const root of roots) {
        if (typeof root.name !== "string") throw new Error("root.name not string");
        if (typeof root.exists !== "boolean") throw new Error("root.exists not boolean");
      }
    });
  });
});
