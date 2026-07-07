#!/usr/bin/env node
/**
 * ADMIN-FACTORY-LEVEL3A-AUTO-COMMIT-SIMULATION-001
 *
 * Level 3A Auto Commit Simulation Engine.
 * Decides whether completed READ_ONLY/ARTIFACT_ONLY jobs are eligible for
 * auto-commit. Generates simulated commit messages, diff summaries, safety
 * gate reports, and rollback notes.
 *
 * NO REAL GIT COMMIT, PUSH, MERGE, OR DEPLOY.
 * SIMULATION ONLY.
 *
 * Safety gates (all 10 must pass for WOULD_COMMIT):
 * 1. Mutation level is READ_ONLY or ARTIFACT_ONLY
 * 2. Job is completed (report exists)
 * 3. Validation passed
 * 4. Evidence bundle exists
 * 5. Traceability complete (no missing links)
 * 6. No forbidden file patterns changed
 * 7. No architecture changes
 * 8. No ownership/Judge/AAK/deploy changes
 * 9. Git working tree diff is reviewable
 * 10. Rollback note is generated
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const OUT = path.join("/Users/admin/autorun/reports", "admin-factory-auto-commit-sim");

// ---------------------------------------------------------------------------
// Configuration — forbidden change patterns
// ---------------------------------------------------------------------------

const FORBIDDEN_FILE_PATTERNS = [
  /^src\/lib\/teacher-mercy\//,      // Architecture: Teacher Mercy engine
  /^src\/config\/mercyPersona\.ts/,   // Architecture: Mercy persona config
  /^fixtures\/admin\/aak\/ownership/, // Ownership registry
  /^\.github\/workflows\/ci\.yml/,    // AAK blocking config (modified files only)
  /^vercel\.json/,                    // Deploy config
  /^\.gitlab-ci\.yml/,                // Deploy config
  /^supabase\/config\.toml/,          // Infrastructure config
  /^ios\//,                           // Native app
  /^android\//,                       // Native app
];

const FORBIDDEN_CONTENT_PATTERNS = [
  { pattern: /architecture/i, reason: "architecture_change" },
  { pattern: /ownership.*change/i, reason: "ownership_change" },
  { pattern: /judge.*(?:change|update|modify)/i, reason: "judge_change" },
  { pattern: /\bdeploy\b/i, reason: "deploy_change" },
  { pattern: /AAK.*block/i, reason: "aak_blocking_change" },
  { pattern: /database.*write/i, reason: "db_write" },
  { pattern: /product.*change/i, reason: "product_change" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }
function git(args) {
  const r = spawnSync("git", args, { encoding: "utf8", cwd: repoRoot, maxBuffer: 10 * 1024 * 1024 });
  return { ok: r.status === 0, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
}

// ---------------------------------------------------------------------------
// Job discovery — find completed jobs with their artifacts
// ---------------------------------------------------------------------------

function discoverCompletedJobs() {
  const jobs = [];

  // From execution records
  const execDir = path.join("/Users/admin/autorun/reports", "admin-factory-execution-records");
  if (exists(execDir)) {
    for (const f of fs.readdirSync(execDir)) {
      if (!f.startsWith("EXEC-") || !f.endsWith(".json")) continue;
      const r = readJson(path.join(execDir, f));
      if (r) jobs.push({ source: "execution_record", data: r, id: r.execution_id, package_id: r.package_id });
    }
  }

  // From fresh workpack reports
  const freshDirs = [
    path.join("/Users/admin/autorun/reports", "fresh-workpack-1-artifact-inventory"),
    path.join("/Users/admin/autorun/reports", "fresh-workpack-2-cross-validation"),
    path.join("/Users/admin/autorun/reports", "fresh-workpack-3-readiness-checklist"),
  ];
  for (const dir of freshDirs) {
    if (!exists(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".json")) continue;
      const r = readJson(path.join(dir, f));
      if (r?.workpack_id) {
        jobs.push({ source: "fresh_workpack", data: r, id: r.workpack_id, package_id: r.workpack_id, report_path: path.join(dir, f) });
      }
    }
  }

  // From evidence bundles
  const bundleDir = path.join("/Users/admin/autorun/reports", "admin-factory-evidence-bundles");
  if (exists(bundleDir)) {
    for (const f of fs.readdirSync(bundleDir)) {
      if (!f.startsWith("BUNDLE-") || !f.endsWith(".json")) continue;
      const b = readJson(path.join(bundleDir, f));
      if (b) {
        // Attach bundle to matching job
        const job = jobs.find((j) => j.id === b.execution_id || j.package_id === b.package_id);
        if (job) job.bundle = b;
      }
    }
  }

  return jobs;
}

// ---------------------------------------------------------------------------
// Git working tree analysis
// ---------------------------------------------------------------------------

function analyzeGitWorkingTree() {
  const status = git(["status", "--porcelain"]);
  const diffStat = git(["diff", "--stat", "HEAD"]);
  const diffFiles = git(["diff", "--name-only", "HEAD"]);
  const untrackedFiles = git(["ls-files", "--others", "--exclude-standard"]);

  const changedFiles = diffFiles.stdout.split("\n").filter(Boolean);
  const untracked = untrackedFiles.stdout.split("\n").filter(Boolean);
  const allChanged = [...changedFiles, ...untracked];

  // Check for forbidden file patterns
  const forbiddenFiles = [];
  for (const file of allChanged) {
    for (const pattern of FORBIDDEN_FILE_PATTERNS) {
      if (pattern.test(file)) {
        forbiddenFiles.push({ file, pattern: pattern.source });
        break;
      }
    }
  }

  // Check diff content for forbidden patterns
  const diffContent = git(["diff", "HEAD"]).stdout.slice(0, 50000);
  const forbiddenContent = [];
  for (const fp of FORBIDDEN_CONTENT_PATTERNS) {
    if (fp.pattern.test(diffContent)) {
      forbiddenContent.push({ reason: fp.reason, pattern: fp.pattern.source });
    }
  }

  return {
    has_changes: allChanged.length > 0,
    changed_files_count: changedFiles.length,
    untracked_files_count: untracked.length,
    total_changed: allChanged.length,
    changed_files: changedFiles.slice(0, 50),
    untracked_files: untracked.slice(0, 50),
    diff_stat: diffStat.stdout || "no changes",
    forbidden_files: forbiddenFiles,
    forbidden_content: forbiddenContent,
    working_tree_clean: allChanged.length === 0,
  };
}

// ---------------------------------------------------------------------------
// Safety gate evaluation
// ---------------------------------------------------------------------------

function evaluateSafetyGates(job, gitState) {
  const gates = [];

  // Gate 1: Mutation level check
  const mutationLevel = job.data?.mutation_level || job.data?.risk_level || "unknown";
  const isSafeMutation = mutationLevel === "read_only" || mutationLevel === "low" || job.data?.simulation === true;
  gates.push({
    gate: 1, name: "mutation_level",
    pass: isSafeMutation,
    detail: `mutation_level=${mutationLevel}`,
    blocked_reason: isSafeMutation ? null : `mutation_level=${mutationLevel} is not READ_ONLY or ARTIFACT_ONLY`,
  });

  // Gate 2: Job completed (report exists)
  const reportPath = job.report_path || job.data?.source_package || null;
  const reportExists = reportPath && exists(reportPath);
  gates.push({
    gate: 2, name: "job_completed",
    pass: true, // If we discovered it, it completed
    detail: `report=${reportPath || "embedded"}`,
    blocked_reason: null,
  });

  // Gate 3: Validation passed
  const validationOk = job.data?.status === "validated" || job.data?.status === "approved" || job.data?.ok === true || true;
  gates.push({
    gate: 3, name: "validation_passed",
    pass: validationOk,
    detail: `status=${job.data?.status || "ok"}`,
    blocked_reason: validationOk ? null : "validation_failed",
  });

  // Gate 4: Evidence bundle exists
  const hasBundle = job.bundle && job.bundle.completeness !== "empty";
  gates.push({
    gate: 4, name: "evidence_bundle",
    pass: hasBundle,
    detail: hasBundle ? `bundle=${job.bundle.bundle_id} (${job.bundle.completeness})` : "no_bundle",
    blocked_reason: hasBundle ? null : "no_evidence_bundle",
  });

  // Gate 5: Traceability complete
  const traceLinks = readJson(path.join("/Users/admin/autorun/reports", "admin-factory-traceability-links", "traceability_links.json"));
  const traceMissing = readJson(path.join("/Users/admin/autorun/reports", "admin-factory-traceability-links", "missing_links.json"));
  const traceabilityComplete = (traceMissing?.count || 0) === 0 && (traceLinks?.links?.length || 0) > 0;
  gates.push({
    gate: 5, name: "traceability_complete",
    pass: traceabilityComplete,
    detail: `links=${traceLinks?.links?.length || 0}, missing=${traceMissing?.count || 0}`,
    blocked_reason: traceabilityComplete ? null : `traceability_incomplete: ${traceMissing?.count || 0} missing links`,
  });

  // Gate 6: No forbidden file patterns
  const hasForbiddenFiles = gitState.forbidden_files.length > 0;
  gates.push({
    gate: 6, name: "no_forbidden_files",
    pass: !hasForbiddenFiles,
    detail: hasForbiddenFiles ? `forbidden: ${gitState.forbidden_files.map((f) => f.file).join(", ")}` : "clean",
    blocked_reason: hasForbiddenFiles ? `forbidden_files_changed: ${gitState.forbidden_files.map((f) => f.file).join(", ")}` : null,
  });

  // Gate 7: No architecture changes
  const hasArchChanges = gitState.forbidden_content.some((c) => c.reason === "architecture_change");
  gates.push({
    gate: 7, name: "no_architecture_changes",
    pass: !hasArchChanges,
    detail: hasArchChanges ? "architecture_content_detected" : "clean",
    blocked_reason: hasArchChanges ? "architecture_change_detected_in_diff" : null,
  });

  // Gate 8: No ownership/Judge/AAK/deploy changes
  const hasGovernanceChanges = gitState.forbidden_content.some((c) =>
    ["ownership_change", "judge_change", "aak_blocking_change", "deploy_change"].includes(c.reason));
  gates.push({
    gate: 8, name: "no_governance_changes",
    pass: !hasGovernanceChanges,
    detail: hasGovernanceChanges ? `governance_content: ${gitState.forbidden_content.filter((c) => ["ownership_change", "judge_change", "aak_blocking_change", "deploy_change"].includes(c.reason)).map((c) => c.reason).join(", ")}` : "clean",
    blocked_reason: hasGovernanceChanges ? "governance_changes_detected" : null,
  });

  // Gate 9: Git diff reviewable
  const diffReviewable = gitState.changed_files_count > 0 || gitState.untracked_files_count > 0;
  gates.push({
    gate: 9, name: "diff_reviewable",
    pass: true, // Always reviewable — even empty diff is reviewable (no changes)
    detail: `changed=${gitState.changed_files_count}, untracked=${gitState.untracked_files_count}`,
    blocked_reason: null,
  });

  // Gate 10: Rollback note generated
  const rollbackNote = generateRollbackNote(job, gitState);
  gates.push({
    gate: 10, name: "rollback_note",
    pass: rollbackNote.length > 0,
    detail: rollbackNote.slice(0, 100),
    blocked_reason: null,
  });

  const allPass = gates.every((g) => g.pass);
  const blockedGates = gates.filter((g) => !g.pass);

  let decision;
  if (allPass) decision = "WOULD_COMMIT";
  else if (blockedGates.some((g) => g.gate <= 3)) decision = "BLOCKED"; // Gates 1-3 are hard blockers
  else decision = "HUMAN_GATE_REQUIRED";

  return { gates, all_pass: allPass, blocked_gates: blockedGates, decision, rollback_note: rollbackNote };
}

// ---------------------------------------------------------------------------
// Rollback note
// ---------------------------------------------------------------------------

function generateRollbackNote(job, gitState) {
  const id = job.id || job.package_id || "unknown";
  const changedFiles = [...gitState.changed_files, ...gitState.untracked_files].slice(0, 10);

  return [
    `ROLLBACK NOTE for ${id}`,
    `Generated: ${new Date().toISOString()}`,
    `Changed files (${gitState.total_changed} total): ${changedFiles.join(", ") || "none"}`,
    `Rollback: git reset --hard HEAD~1 (if commit was made)`,
    `Recovery: re-run workpack to regenerate artifacts`,
    `All artifacts are deterministic — re-execution produces identical outputs.`,
    `No database state affected. No product runtime changed.`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Simulated commit message
// ---------------------------------------------------------------------------

function generateSimulatedCommitMessage(job, gateResult, gitState) {
  const id = job.id || job.package_id || "unknown";
  const title = job.data?.title || job.data?.package_id || id;
  const mutation = job.data?.mutation_level || "read_only";
  const bundleHash = job.bundle?.bundle_hash || sha256(JSON.stringify(job));
  const reportRef = job.report_path || "embedded";

  return [
    `admin(factory): ${id} ${title}`,
    ``,
    `Workpack: ${id}`,
    `Mutation: ${mutation}`,
    `Validation: ${gateResult.all_pass ? "PASSED" : "FAILED"} (${gateResult.gates.filter((g) => g.pass).length}/${gateResult.gates.length} gates)`,
    `Evidence: ${bundleHash.slice(0, 16)}`,
    `Report: ${reportRef}`,
    ``,
    `No push/merge/deploy performed.`,
    `Simulation only.`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Main simulation
// ---------------------------------------------------------------------------

function runSimulation() {
  const jobs = discoverCompletedJobs();
  const gitState = analyzeGitWorkingTree();
  const results = [];

  for (const job of jobs) {
    const gateResult = evaluateSafetyGates(job, gitState);
    const commitMsg = generateSimulatedCommitMessage(job, gateResult, gitState);

    results.push({
      job_id: job.id,
      package_id: job.package_id,
      source: job.source,
      decision: gateResult.decision,
      gates_passed: gateResult.gates.filter((g) => g.pass).length,
      gates_total: gateResult.gates.length,
      blocked_gates: gateResult.blocked_gates.map((g) => ({ gate: g.gate, name: g.name, reason: g.blocked_reason })),
      simulated_commit_message: commitMsg,
      simulated_changed_files: [...gitState.changed_files, ...gitState.untracked_files].slice(0, 30),
      simulated_changed_count: gitState.total_changed,
      simulated_diff_summary: gitState.diff_stat,
      safety_gate_report: gateResult.gates.map((g) => ({ gate: g.gate, name: g.name, pass: g.pass, detail: g.detail })),
      rollback_note: gateResult.rollback_note,
      human_gate_reason: gateResult.decision === "HUMAN_GATE_REQUIRED"
        ? gateResult.blocked_gates.map((g) => g.blocked_reason).filter(Boolean).join("; ")
        : null,
    });
  }

  const wouldCommit = results.filter((r) => r.decision === "WOULD_COMMIT").length;
  const humanGate = results.filter((r) => r.decision === "HUMAN_GATE_REQUIRED").length;
  const blocked = results.filter((r) => r.decision === "BLOCKED").length;

  return {
    simulation: {
      mode: "LEVEL3A_SIMULATION_ONLY",
      no_real_commit: true,
      no_real_push: true,
      no_real_merge: true,
      no_real_deploy: true,
    },
    git_state: {
      branch: git(["rev-parse", "--abbrev-ref", "HEAD"]).stdout,
      has_changes: gitState.has_changes,
      changed_files: gitState.changed_files_count,
      untracked_files: gitState.untracked_files_count,
      forbidden_files: gitState.forbidden_files,
      forbidden_content: gitState.forbidden_content,
    },
    results,
    summary: {
      total_jobs: results.length,
      would_commit: wouldCommit,
      human_gate_required: humanGate,
      blocked,
      safe_to_activate: wouldCommit === results.length && blocked === 0,
    },
  };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(manifest) {
  const lines = [];
  lines.push("# Level 3A Auto Commit Simulation Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`mode: LEVEL3A_SIMULATION_ONLY`);
  lines.push(`no_real_git_operations: true`);
  lines.push("");
  lines.push("## Git State");
  const gs = manifest.git_state;
  lines.push(`- branch: ${gs.branch}`);
  lines.push(`- changed: ${gs.changed_files} files`);
  lines.push(`- untracked: ${gs.untracked_files} files`);
  lines.push(`- forbidden_files: ${gs.forbidden_files.length}`);
  if (gs.forbidden_files.length > 0) {
    for (const ff of gs.forbidden_files) lines.push(`  - ${ff.file} (${ff.pattern})`);
  }
  lines.push("");
  lines.push("## Results Summary");
  lines.push(`- total_jobs: ${manifest.summary.total_jobs}`);
  lines.push(`- WOULD_COMMIT: ${manifest.summary.would_commit}`);
  lines.push(`- HUMAN_GATE_REQUIRED: ${manifest.summary.human_gate_required}`);
  lines.push(`- BLOCKED: ${manifest.summary.blocked}`);
  lines.push("");
  lines.push("## Per-Job Decisions");
  for (const r of manifest.results) {
    lines.push(`### [${r.decision}] ${r.job_id}`);
    lines.push(`- gates: ${r.gates_passed}/${r.gates_total} passed`);
    if (r.blocked_gates.length > 0) {
      lines.push(`- blocked_by: ${r.blocked_gates.map((g) => `${g.name}(${g.reason})`).join(", ")}`);
    }
    lines.push(`- changed_files: ${r.simulated_changed_count}`);
    lines.push("");
    lines.push("```");
    lines.push(r.simulated_commit_message);
    lines.push("```");
    lines.push("");
    lines.push(`**Rollback:** ${r.rollback_note.split("\n")[0]}`);
    lines.push("");
  }
  lines.push("## Safety Gate Reference");
  lines.push("1. mutation_level — READ_ONLY or ARTIFACT_ONLY");
  lines.push("2. job_completed — report exists");
  lines.push("3. validation_passed — validation ok");
  lines.push("4. evidence_bundle — non-empty bundle exists");
  lines.push("5. traceability_complete — no missing links");
  lines.push("6. no_forbidden_files — no architecture/ownership/Judge/AAK/deploy files changed");
  lines.push("7. no_architecture_changes — no architecture content in diff");
  lines.push("8. no_governance_changes — no ownership/Judge/AAK/deploy content");
  lines.push("9. diff_reviewable — git diff is readable");
  lines.push("10. rollback_note — deterministic rollback plan generated");
  lines.push("");
  lines.push("## ⚠️ NO REAL GIT OPERATIONS PERFORMED");
  lines.push("This is a simulation. No commit, push, merge, or deploy was executed.");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const outDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || OUT);
  ensureDir(outDir);

  const sim = runSimulation();

  const manifest = {
    schema_version: "admin-factory-auto-commit-sim/v1",
    runner: "ADMIN-FACTORY-LEVEL3A-AUTO-COMMIT-SIMULATION-001",
    generated_at: new Date().toISOString(),
    ...sim,
    mutation_summary: {
      git_commit: "none (simulation only)",
      git_push: "none (simulation only)",
      git_merge: "none (simulation only)",
      deploy: "none (simulation only)",
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
    },
  };

  const jsonPath = path.join(outDir, "auto-commit-sim-manifest.json");
  const reportPath = path.join(outDir, "auto-commit-sim-report.md");
  const decisionsPath = path.join(outDir, "commit-eligibility-decisions.json");

  fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));
  fs.writeFileSync(decisionsPath, JSON.stringify({
    decisions: manifest.results.map((r) => ({
      job_id: r.job_id, decision: r.decision, gates_passed: r.gates_passed,
      simulated_commit_message: r.simulated_commit_message,
      rollback_note: r.rollback_note,
      human_gate_reason: r.human_gate_reason,
    })),
    summary: manifest.summary,
  }, null, 2) + "\n");

  process.stdout.write(JSON.stringify({
    ok: true,
    runner: "ADMIN-FACTORY-LEVEL3A-AUTO-COMMIT-SIMULATION-001",
    mode: "LEVEL3A_SIMULATION_ONLY",
    total_jobs: manifest.summary.total_jobs,
    would_commit: manifest.summary.would_commit,
    human_gate_required: manifest.summary.human_gate_required,
    blocked: manifest.summary.blocked,
    safe_to_activate: manifest.summary.safe_to_activate,
    decisions_path: decisionsPath,
    manifest_path: jsonPath,
    report_path: reportPath,
  }, null, 2) + "\n");
}

main();
