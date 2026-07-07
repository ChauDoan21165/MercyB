/**
 * AAK-LIFECYCLE-TRANSITION-RULES-001 — Tests
 *
 * Validates:
 * 1. Rules loading and validation
 * 2. Allowed transition listing
 * 3. Specific transition checking (allowed vs disallowed)
 * 4. Required artifact listing per transition
 * 5. Execution record validation (valid, invalid artifacts, invalid transition)
 * 6. Test case suite execution
 * 7. Graph analysis (states, entry, terminal, dead ends)
 * 8. Registration of new transitions
 * 9. Idempotent output
 * 10. Zero mutation summary (except register)
 */

import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scriptPath = path.join(repoRoot, "scripts/admin/aak-lifecycle-transition.mjs");
const rulesPath = path.join(repoRoot, "fixtures/admin/aak/lifecycle-transition-rules.json");
const casesPath = path.join(repoRoot, "fixtures/admin/aak/lifecycle-transition-cases.json");

function runCommand(command, extraArgs = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-lifecycle-test-"));
  const result = spawnSync(process.execPath, [scriptPath, command, "-o", tmpDir, ...extraArgs], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  let parsed = null;
  try { parsed = JSON.parse((result.stdout || "").trim()); } catch { /* not JSON */ }
  return { ...result, parsed, tmpDir };
}

function readArtifact(tmpDir, filename) {
  const p = path.join(tmpDir, filename);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

describe("AAK-LIFECYCLE-TRANSITION-RULES-001", () => {
  describe("validate", () => {
    it("validates the existing rules successfully", () => {
      const r = runCommand("validate", [rulesPath]);
      if (!r.parsed) throw new Error(`No JSON. stderr: ${r.stderr}`);
      if (r.parsed.ok !== true) {
        throw new Error(`Validation failed: ${JSON.stringify(r.parsed.errors)}`);
      }
    });

    it("reports rule_set_id, version, transition_count", () => {
      const r = runCommand("validate", [rulesPath]);
      if (r.parsed.rule_set_id !== "aak-lifecycle-transition-rules") {
        throw new Error(`Wrong rule_set_id: ${r.parsed.rule_set_id}`);
      }
      if (!r.parsed.version) throw new Error("version missing");
      if (r.parsed.transition_count !== 3) {
        throw new Error(`Expected 3 transitions, got ${r.parsed.transition_count}`);
      }
    });

    it("rejects a missing file", () => {
      const r = runCommand("validate", ["/nonexistent/rules.json"]);
      if (r.parsed?.ok !== false) throw new Error("Should reject missing file");
    });
  });

  describe("allowed", () => {
    it("lists 3 allowed transitions", () => {
      const r = runCommand("allowed", [rulesPath]);
      if (!r.parsed) throw new Error("No output");
      if (r.parsed.count !== 3) throw new Error(`Expected 3, got ${r.parsed.count}`);
      const expected = [
        "DRAFT->PLANNING_APPROVED",
        "ENGINEERING_VALIDATED->JUDGE_REVIEWED",
        "PLANNING_APPROVED->ENGINEERING_VALIDATED",
      ];
      for (const t of expected) {
        if (!r.parsed.allowed_transitions.includes(t)) {
          throw new Error(`Missing transition: ${t}`);
        }
      }
    });
  });

  describe("check", () => {
    it("allows DRAFT->PLANNING_APPROVED", () => {
      const r = runCommand("check", ["DRAFT", "PLANNING_APPROVED", rulesPath]);
      if (!r.parsed?.allowed) throw new Error("Should be allowed");
      if (r.parsed.required_artifacts.length < 1) throw new Error("Should have required artifacts");
    });

    it("rejects COMPLETED->ARCHIVED (not in rules)", () => {
      const r = runCommand("check", ["COMPLETED", "ARCHIVED", rulesPath]);
      if (r.status === 0) throw new Error("Should exit non-zero for disallowed transition");
      if (r.parsed?.allowed !== false) throw new Error("Should not be allowed");
    });
  });

  describe("artifacts", () => {
    it("returns required artifacts for DRAFT->PLANNING_APPROVED", () => {
      const r = runCommand("artifacts", ["DRAFT", "PLANNING_APPROVED", rulesPath]);
      if (!r.parsed) throw new Error("No output");
      if (!r.parsed.required_artifacts.includes("owner_team")) {
        throw new Error("Should require owner_team");
      }
    });

    it("fails for disallowed transition", () => {
      const r = runCommand("artifacts", ["COMPLETED", "ARCHIVED", rulesPath]);
      if (r.status === 0) throw new Error("Should exit non-zero");
    });
  });

  describe("validate-exec", () => {
    it("validates a valid execution record", () => {
      const validExec = path.join(repoRoot, "fixtures/admin/aak/lifecycle-valid.json");
      const r = runCommand("validate-exec", [validExec, rulesPath]);
      if (!r.parsed?.ok) throw new Error(`Valid exec should pass: ${JSON.stringify(r.parsed?.errors)}`);
    });

    it("rejects an invalid execution record (missing artifacts)", () => {
      const invalidExec = path.join(repoRoot, "fixtures/admin/aak/lifecycle-invalid.json");
      const r = runCommand("validate-exec", [invalidExec, rulesPath]);
      if (r.parsed?.ok !== false) throw new Error("Invalid exec should fail");
      if (!r.parsed?.diagnostic_codes?.includes("LIFECYCLE_ARTIFACT_REQUIRED")) {
        throw new Error(`Should have LIFECYCLE_ARTIFACT_REQUIRED: ${JSON.stringify(r.parsed?.diagnostic_codes)}`);
      }
    });

    it("rejects disallowed transition", () => {
      const invalidTrans = path.join(repoRoot, "fixtures/admin/aak/lifecycle-invalid-transition.json");
      const r = runCommand("validate-exec", [invalidTrans, rulesPath]);
      if (r.parsed?.ok !== false) throw new Error("Disallowed transition should fail");
      if (!r.parsed?.diagnostic_codes?.includes("LIFECYCLE_TRANSITION_NOT_ALLOWED")) {
        throw new Error(`Should have LIFECYCLE_TRANSITION_NOT_ALLOWED: ${JSON.stringify(r.parsed?.diagnostic_codes)}`);
      }
    });
  });

  describe("test-cases", () => {
    it("runs all test cases and all pass", () => {
      const r = runCommand("test-cases", [casesPath, rulesPath]);
      if (!r.parsed) throw new Error("No output");
      if (r.parsed.all_pass !== true) {
        throw new Error(`Not all test cases pass: ${JSON.stringify(r.parsed.results)}`);
      }
      if (r.parsed.total !== 3) throw new Error(`Expected 3 cases, got ${r.parsed.total}`);
    });
  });

  describe("states and graph", () => {
    it("lists lifecycle states", () => {
      const r = runCommand("states", [rulesPath]);
      if (!r.parsed?.states) throw new Error("No states");
      if (r.parsed.count < 4) throw new Error(`Expected >=4 states, got ${r.parsed.count}`);
    });

    it("graph includes adjacency and entry/terminal states", () => {
      const r = runCommand("graph", [rulesPath]);
      if (!r.parsed) throw new Error("No output");
      if (!r.parsed.entry_states?.includes("DRAFT")) {
        throw new Error("DRAFT should be an entry state");
      }
      if (!r.parsed.terminal_states?.includes("JUDGE_REVIEWED")) {
        throw new Error("JUDGE_REVIEWED should be a terminal state");
      }
      if (r.parsed.full_path_draft_to_judge !== true) {
        throw new Error("Should have continuous path from DRAFT to JUDGE_REVIEWED");
      }
    });
  });

  describe("health", () => {
    it("produces a health report with graph analysis", () => {
      const r = runCommand("health", [rulesPath, casesPath]);
      if (!r.parsed?.ok) throw new Error(`Health check failed: ${JSON.stringify(r.parsed)}`);
      const h = r.parsed.health?.health;
      if (!["healthy", "degraded", "warning", "critical"].includes(h)) {
        throw new Error(`Invalid health: ${h}`);
      }
    });

    it("produces manifest and report artifacts", () => {
      const r = runCommand("health", [rulesPath]);
      const manifest = readArtifact(r.tmpDir, "aak-lifecycle-transition-health.json");
      if (!manifest) throw new Error("Health manifest missing");
      const reportPath = path.join(r.tmpDir, "aak-lifecycle-transition-report.md");
      if (!fs.existsSync(reportPath)) throw new Error("Report missing");
      const content = fs.readFileSync(reportPath, "utf8");
      if (!content.includes("AAK Lifecycle Transition Rules Report")) {
        throw new Error("Report missing expected title");
      }
    });
  });

  describe("register", () => {
    it("registers a new transition and bumps version", () => {
      const tmpRules = path.join(os.tmpdir(), `test-lifecycle-rules-${Date.now()}.json`);
      fs.copyFileSync(rulesPath, tmpRules);

      const newTransition = JSON.stringify({
        transition: "JUDGE_REVIEWED->ACCEPTED",
        from: "JUDGE_REVIEWED",
        to: "ACCEPTED",
        required_artifacts: ["acceptance_ref", "final_judge_report_ref"],
        diagnostic_code: "LIFECYCLE_ACCEPTANCE_EVIDENCE_REQUIRED",
        description: "Judge-reviewed packages need acceptance and final report to be accepted.",
      });

      try {
        const r = runCommand("register", [newTransition, tmpRules]);
        if (!r.parsed?.ok) throw new Error(`Registration failed: ${JSON.stringify(r.parsed)}`);

        const updated = JSON.parse(fs.readFileSync(tmpRules, "utf8"));
        if (updated.transitions.length !== 4) {
          throw new Error(`Expected 4 transitions, got ${updated.transitions.length}`);
        }

        // Verify the new transition works
        const check = runCommand("check", ["JUDGE_REVIEWED", "ACCEPTED", tmpRules]);
        if (!check.parsed?.allowed) throw new Error("New transition should be allowed");
      } finally {
        try { fs.unlinkSync(tmpRules); } catch { /* ok */ }
        try { fs.unlinkSync(tmpRules + ".bak"); } catch { /* ok */ }
      }
    });

    it("rejects duplicate transition registration", () => {
      const tmpRules = path.join(os.tmpdir(), `test-lifecycle-dup-${Date.now()}.json`);
      fs.copyFileSync(rulesPath, tmpRules);

      const dupTransition = JSON.stringify({
        transition: "DRAFT->PLANNING_APPROVED",
        from: "DRAFT",
        to: "PLANNING_APPROVED",
        required_artifacts: ["owner_team"],
        diagnostic_code: "DUP",
      });

      try {
        const r = runCommand("register", [dupTransition, tmpRules]);
        if (r.parsed?.ok === true) throw new Error("Should reject duplicate");
      } finally {
        try { fs.unlinkSync(tmpRules); } catch { /* ok */ }
        try { fs.unlinkSync(tmpRules + ".bak"); } catch { /* ok */ }
      }
    });
  });

  describe("determinism", () => {
    it("idempotent: same check returns same result", () => {
      const r1 = runCommand("check", ["DRAFT", "PLANNING_APPROVED", rulesPath]);
      const r2 = runCommand("check", ["DRAFT", "PLANNING_APPROVED", rulesPath]);
      if (r1.parsed?.allowed !== r2.parsed?.allowed) {
        throw new Error("Non-deterministic");
      }
    });
  });

  describe("mutation summary", () => {
    it("validate/health/allowed declare zero mutations", () => {
      const r = runCommand("health", [rulesPath]);
      const manifest = readArtifact(r.tmpDir, "aak-lifecycle-transition-health.json");
      const ms = manifest?.mutation_summary;
      if (!ms) throw new Error("mutation_summary missing");
      if (ms.database_writes !== "none") throw new Error(`db=${ms.database_writes}`);
      if (ms.runtime_mutations !== "none") throw new Error(`runtime=${ms.runtime_mutations}`);
    });
  });
});
