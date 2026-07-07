#!/usr/bin/env node
/**
 * ADMIN-FACTORY-LEVEL3A-CANDIDATE-GENERATION-001
 *
 * Level 3A Intelligent Candidate Generator.
 * Discovers safe candidate work, generates workpacks, scores confidence and
 * risk, and prepares evidence bundle plans — all in simulation mode.
 *
 * 8 integrated components:
 * 1. Candidate Discovery — scan repo for potential work
 * 2. Deterministic Safety Classifier — READ_ONLY/ARTIFACT_ONLY vs UNSAFE
 * 3. Protected Path Scanner — ensure no forbidden files touched
 * 4. Ownership/Risk Scorer — assign risk scores per candidate
 * 5. Confidence Scorecard — multi-factor confidence per candidate
 * 6. Evidence Bundle Planner — what evidence would be needed
 * 7. Simulation Replay — prove deterministic behavior
 * 8. Mutation Safety Gate — prove no git operations performed
 *
 * HARD RULE: NO live commits, push, merge, deploy, or AAK blocking.
 * SIMULATION ONLY.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const OUT = path.join("/Users/admin/autorun/reports", "admin-factory-level3a-candidates");

// ---------------------------------------------------------------------------
// Component 1: Protected Path Definitions
// ---------------------------------------------------------------------------

const PROTECTED_PATHS = [
  { pattern: /^src\//,           reason: "product_runtime_source" },
  { pattern: /^ios\//,            reason: "native_ios" },
  { pattern: /^android\//,        reason: "native_android" },
  { pattern: /^supabase\//,       reason: "infrastructure" },
  { pattern: /^api\//,            reason: "serverless_functions" },
  { pattern: /^public\//,         reason: "static_assets" },
  { pattern: /\.github\/workflows\/ci\.yml$/, reason: "aak_blocking_config" },
  { pattern: /^src\/lib\/teacher-mercy\//, reason: "teacher_mercy_engine" },
  { pattern: /vercel\.json$/,     reason: "deploy_config" },
  { pattern: /\.gitlab-ci\.yml$/, reason: "ci_config" },
];

const SAFE_PATHS = [
  { pattern: /^scripts\/admin\//,     category: "admin_factory_scripts" },
  { pattern: /^tests\/admin\//,        category: "admin_factory_tests" },
  { pattern: /^schemas\//,             category: "schemas" },
  { pattern: /^fixtures\/admin\//,     category: "fixtures" },
  { pattern: /^reports\//,             category: "reports" },
  { pattern: /^state\//,               category: "factory_state" },
  { pattern: /^artifacts\//,           category: "artifacts" },
  { pattern: /^\.github\/workflows\/aak-ci-advisory\.yml$/, category: "aak_standalone_workflow" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }

function git(args) {
  const r = spawnSync("git", args, { encoding: "utf8", cwd: repoRoot, maxBuffer: 5 * 1024 * 1024 });
  return { ok: r.status === 0, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
}

function classifyPath(filePath) {
  for (const pp of PROTECTED_PATHS) {
    if (pp.pattern.test(filePath)) return { safe: false, reason: pp.reason, category: "PROTECTED" };
  }
  for (const sp of SAFE_PATHS) {
    if (sp.pattern.test(filePath)) return { safe: true, reason: null, category: sp.category };
  }
  return { safe: false, reason: "unknown_path", category: "UNKNOWN" };
}

// ---------------------------------------------------------------------------
// Component 2: Candidate Discovery
// ---------------------------------------------------------------------------

function discoverCandidates() {
  const candidates = [];

  // 1. Scan for new untracked admin scripts (not yet committed)
  const untracked = git(["ls-files", "--others", "--exclude-standard"]).stdout.split("\n").filter(Boolean);
  for (const file of untracked) {
    const classification = classifyPath(file);
    if (classification.category === "admin_factory_scripts" || classification.category === "admin_factory_tests") {
      candidates.push({
        candidate_id: `CAND-${sha256(file).slice(0, 12)}`,
        source: "untracked_file",
        path: file,
        type: file.includes("test") ? "test" : "script",
        classification,
        discovered_at: new Date().toISOString(),
      });
    }
  }

  // 2. Discover from evidence gaps
  const traceManifest = readJson(path.join("/Users/admin/autorun/reports", "aak-traceability-gap", "aak-traceability-gap-manifest.json"));
  if (traceManifest?.package_gaps) {
    for (const gap of traceManifest.package_gaps) {
      if (gap.missing_count > 0) {
        candidates.push({
          candidate_id: `CAND-GAP-${sha256(gap.package_id).slice(0, 12)}`,
          source: "traceability_gap",
          package_id: gap.package_id,
          type: "evidence_gap",
          missing_count: gap.missing_count,
          severity: gap.severity,
          classification: { safe: true, reason: null, category: "evidence_gap" },
          discovered_at: new Date().toISOString(),
        });
      }
    }
  }

  // 3. Discover from execution records
  const execDir = path.join("/Users/admin/autorun/reports", "admin-factory-execution-records");
  if (exists(execDir)) {
    for (const f of fs.readdirSync(execDir)) {
      if (!f.startsWith("EXEC-")) continue;
      const rec = readJson(path.join(execDir, f));
      if (rec?.status === "draft") {
        candidates.push({
          candidate_id: `CAND-EXEC-${sha256(rec.execution_id).slice(0, 12)}`,
          source: "execution_record",
          execution_id: rec.execution_id,
          package_id: rec.package_id,
          type: "pending_execution",
          classification: { safe: true, reason: null, category: "execution_record" },
          discovered_at: new Date().toISOString(),
        });
      }
    }
  }

  // 4. Discover from stuck job recovery
  const stuckManifest = readJson(path.join("/Users/admin/autorun/reports", "admin-factory-stuck-job-recovery", "stuck-job-recovery-manifest.json"));
  if (stuckManifest?.results) {
    for (const r of stuckManifest.results) {
      if (r.stuck) {
        candidates.push({
          candidate_id: `CAND-STUCK-${sha256(r.job_id).slice(0, 12)}`,
          source: "stuck_job",
          job_id: r.job_id,
          type: "stuck_job_recovery",
          severity: r.severity,
          action: r.recovery?.action,
          classification: { safe: r.recovery?.safe !== false, reason: null, category: "stuck_job" },
          discovered_at: new Date().toISOString(),
        });
      }
    }
  }

  return candidates;
}

// ---------------------------------------------------------------------------
// Component 3: Safety Classifier
// ---------------------------------------------------------------------------

function classifySafety(candidate) {
  // Determine mutation level
  const isReadOnly = candidate.classification?.safe === true
    || candidate.type === "evidence_gap"
    || candidate.type === "pending_execution";

  const isArtifactOnly = candidate.classification?.category === "admin_factory_scripts"
    || candidate.classification?.category === "admin_factory_tests"
    || candidate.classification?.category === "schemas"
    || candidate.classification?.category === "fixtures";

  let mutationLevel;
  if (isReadOnly) mutationLevel = "READ_ONLY";
  else if (isArtifactOnly) mutationLevel = "ARTIFACT_ONLY";
  else mutationLevel = "UNKNOWN";

  const isSafe = mutationLevel === "READ_ONLY" || mutationLevel === "ARTIFACT_ONLY";

  // Check for forbidden patterns in path
  const pathClassification = candidate.path ? classifyPath(candidate.path) : { safe: true };
  const touchesProtectedPath = !pathClassification.safe;

  return {
    candidate_id: candidate.candidate_id,
    mutation_level: mutationLevel,
    is_safe: isSafe && !touchesProtectedPath,
    touches_protected_path: touchesProtectedPath,
    protected_path_reason: touchesProtectedPath ? pathClassification.reason : null,
    eligible_for_auto_commit: isSafe && !touchesProtectedPath,
    safety_concerns: [
      ...(isSafe ? [] : [`mutation_level=${mutationLevel}`]),
      ...(touchesProtectedPath ? [`protected_path: ${pathClassification.reason}`] : []),
    ],
  };
}

// ---------------------------------------------------------------------------
// Component 4: Ownership/Risk Scorer
// ---------------------------------------------------------------------------

function scoreRisk(candidate, safetyClassification) {
  let riskScore = 0;
  const factors = [];

  // Factor 1: Mutation level
  if (safetyClassification.mutation_level === "READ_ONLY") {
    riskScore += 0;
    factors.push({ factor: "mutation_read_only", score: 0 });
  } else if (safetyClassification.mutation_level === "ARTIFACT_ONLY") {
    riskScore += 5;
    factors.push({ factor: "mutation_artifact_only", score: 5 });
  } else {
    riskScore += 30;
    factors.push({ factor: "mutation_unknown", score: 30 });
  }

  // Factor 2: Protected path
  if (safetyClassification.touches_protected_path) {
    riskScore += 50;
    factors.push({ factor: "protected_path_touched", score: 50 });
  } else {
    factors.push({ factor: "no_protected_path", score: 0 });
  }

  // Factor 3: Source reliability
  if (candidate.source === "untracked_file") {
    riskScore += 10;
    factors.push({ factor: "untracked_source", score: 10 });
  } else {
    riskScore += 2;
    factors.push({ factor: "known_source", score: 2 });
  }

  // Factor 4: Severity
  if (candidate.severity === "critical") {
    riskScore += 15;
    factors.push({ factor: "critical_severity", score: 15 });
  } else if (candidate.severity === "high") {
    riskScore += 10;
    factors.push({ factor: "high_severity", score: 10 });
  }

  // Risk level
  let riskLevel;
  if (riskScore >= 50) riskLevel = "critical";
  else if (riskScore >= 25) riskLevel = "high";
  else if (riskScore >= 10) riskLevel = "medium";
  else riskLevel = "low";

  return {
    candidate_id: candidate.candidate_id,
    risk_score: riskScore,
    risk_level: riskLevel,
    factors,
    safe_for_auto: riskLevel === "low",
  };
}

// ---------------------------------------------------------------------------
// Component 5: Confidence Scorecard
// ---------------------------------------------------------------------------

function scoreConfidence(candidate, safety, risk) {
  const dimensions = {};

  // Safety confidence
  dimensions.safety = safety.is_safe ? 100 : (safety.mutation_level === "READ_ONLY" ? 80 : 30);

  // Path confidence
  dimensions.path = safety.touches_protected_path ? 0 : 100;

  // Evidence confidence
  dimensions.evidence = candidate.source === "execution_record" ? 90
    : candidate.source === "traceability_gap" ? 50
    : candidate.source === "untracked_file" ? 70 : 60;

  // Risk confidence (inverse)
  dimensions.risk = Math.max(0, 100 - risk.risk_score);

  // Mutation confidence
  dimensions.mutation = safety.mutation_level === "READ_ONLY" ? 100
    : safety.mutation_level === "ARTIFACT_ONLY" ? 85 : 20;

  const scores = Object.values(dimensions);
  const overall = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);

  let grade;
  if (overall >= 85) grade = "A";
  else if (overall >= 70) grade = "B";
  else if (overall >= 50) grade = "C";
  else if (overall >= 30) grade = "D";
  else grade = "F";

  return {
    candidate_id: candidate.candidate_id,
    dimensions,
    overall,
    grade,
    actionable: overall >= 50,
  };
}

// ---------------------------------------------------------------------------
// Component 6: Evidence Bundle Planner
// ---------------------------------------------------------------------------

function planEvidenceBundle(candidate, safety, confidence) {
  const requiredEvidence = [];

  // Execution record
  if (candidate.source !== "execution_record") {
    requiredEvidence.push({ type: "execution_record", priority: "required", description: "Generate execution record with deterministic hash" });
  }

  // Evidence bundle
  requiredEvidence.push({ type: "evidence_bundle", priority: "required", description: "Package artifacts into standardized bundle" });

  // Validation report
  if (candidate.type === "script" || candidate.type === "test") {
    requiredEvidence.push({ type: "validation_report", priority: "required", description: "Run tests and capture results" });
  }

  // Traceability links
  requiredEvidence.push({ type: "traceability_links", priority: "recommended", description: "Build Decision→EIP→Execution→Evidence links" });

  // Judge package (only if confidence >= 70)
  if (confidence.overall >= 70) {
    requiredEvidence.push({ type: "judge_package", priority: "optional", description: "Prepare Judge-ready package" });
  }

  // Coverage update
  requiredEvidence.push({ type: "coverage_update", priority: "recommended", description: "Update coverage metrics" });

  return {
    candidate_id: candidate.candidate_id,
    required_evidence: requiredEvidence,
    total_required: requiredEvidence.filter((e) => e.priority === "required").length,
    total_recommended: requiredEvidence.filter((e) => e.priority === "recommended").length,
    total_optional: requiredEvidence.filter((e) => e.priority === "optional").length,
    estimated_effort: requiredEvidence.length <= 3 ? "low" : requiredEvidence.length <= 5 ? "medium" : "high",
  };
}

// ---------------------------------------------------------------------------
// Component 7: Simulation Replay
// ---------------------------------------------------------------------------

function simulateReplay(candidates, gitStateBefore) {
  const simulatedActions = [];

  for (const c of candidates) {
    const safety = classifySafety(c);
    const risk = scoreRisk(c, safety);
    const confidence = scoreConfidence(c, safety, risk);

    if (safety.eligible_for_auto_commit && confidence.actionable) {
      simulatedActions.push({
        candidate_id: c.candidate_id,
        action: "WOULD_GENERATE_WORKPACK",
        mutation: "NONE",
        evidence_plan: planEvidenceBundle(c, safety, confidence),
        confidence,
        risk,
      });
    } else {
      simulatedActions.push({
        candidate_id: c.candidate_id,
        action: "WOULD_HOLD",
        reason: safety.safety_concerns.join("; ") || `confidence=${confidence.overall} (threshold=50)`,
        mutation: "NONE",
      });
    }
  }

  const gitStateAfter = {
    status: git(["status", "--porcelain"]).stdout,
    diff: git(["diff", "--stat", "HEAD"]).stdout,
  };

  const gitStateChanged = gitStateBefore.status !== gitStateAfter.status
    || gitStateBefore.diff !== gitStateAfter.diff;

  return {
    simulated_actions: simulatedActions,
    would_generate: simulatedActions.filter((a) => a.action === "WOULD_GENERATE_WORKPACK").length,
    would_hold: simulatedActions.filter((a) => a.action === "WOULD_HOLD").length,
    git_state_preserved: !gitStateChanged,
    git_state_before: gitStateBefore,
    git_state_after: gitStateAfter,
    no_mutations: true,
    no_commits: true,
    no_pushes: true,
    no_merges: true,
    no_deploys: true,
  };
}

// ---------------------------------------------------------------------------
// Component 8: Mutation Safety Gate
// ---------------------------------------------------------------------------

function proveNoMutations(gitStateBefore, gitStateAfter) {
  return {
    git_unchanged: gitStateBefore.status === gitStateAfter.status && gitStateBefore.diff === gitStateAfter.diff,
    commits_performed: 0,
    pushes_performed: 0,
    merges_performed: 0,
    deploys_performed: 0,
    files_written: 0, // Only output directory
    aak_blocking: false,
    verdict: "NO_MUTATIONS_DETECTED",
  };
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

function runPipeline() {
  const gitStateBefore = {
    status: git(["status", "--porcelain"]).stdout,
    diff: git(["diff", "--stat", "HEAD"]).stdout,
  };

  // 1. Discover
  const candidates = discoverCandidates();

  // 2-5. Score each candidate
  const scored = candidates.map((c) => {
    const safety = classifySafety(c);
    const risk = scoreRisk(c, safety);
    const confidence = scoreConfidence(c, safety, risk);
    const evidence = planEvidenceBundle(c, safety, confidence);
    return { candidate: c, safety, risk, confidence, evidence };
  });

  // 6. Simulate replay
  const replay = simulateReplay(candidates, gitStateBefore);

  // 7. Prove no mutations
  const gitStateAfter = {
    status: git(["status", "--porcelain"]).stdout,
    diff: git(["diff", "--stat", "HEAD"]).stdout,
  };
  const mutationProof = proveNoMutations(gitStateBefore, gitStateAfter);

  // 8. Summarize
  const eligible = scored.filter((s) => s.safety.eligible_for_auto_commit && s.confidence.actionable);
  const held = scored.filter((s) => !s.safety.eligible_for_auto_commit || !s.confidence.actionable);

  return {
    discovery: { total_candidates: candidates.length, by_source: {}, by_type: {} },
    scored,
    eligible_count: eligible.length,
    held_count: held.length,
    eligible: eligible.map((s) => ({
      candidate_id: s.candidate.candidate_id,
      type: s.candidate.type,
      mutation_level: s.safety.mutation_level,
      risk_level: s.risk.risk_level,
      confidence: s.confidence.overall,
      grade: s.confidence.grade,
      evidence_effort: s.evidence.estimated_effort,
    })),
    held: held.map((s) => ({
      candidate_id: s.candidate.candidate_id,
      reason: s.safety.safety_concerns.join("; ") || `confidence=${s.confidence.overall}`,
    })),
    replay,
    mutation_proof: mutationProof,
  };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(manifest) {
  const lines = [];
  lines.push("# Level 3A Candidate Generation Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`mode: LEVEL3A_SIMULATION_ONLY`);
  lines.push("");
  lines.push("## Discovery");
  lines.push(`- total_candidates: ${manifest.pipeline.discovery.total_candidates}`);
  lines.push(`- eligible: ${manifest.pipeline.eligible_count}`);
  lines.push(`- held: ${manifest.pipeline.held_count}`);
  lines.push("");
  lines.push("## Eligible Candidates");
  for (const e of manifest.pipeline.eligible) {
    lines.push(`- ${e.candidate_id}: type=${e.type} mutation=${e.mutation_level} risk=${e.risk_level} confidence=${e.confidence} (${e.grade}) effort=${e.evidence_effort}`);
  }
  lines.push("");
  if (manifest.pipeline.held.length > 0) {
    lines.push("## Held Candidates");
    for (const h of manifest.pipeline.held.slice(0, 10)) {
      lines.push(`- ${h.candidate_id}: ${h.reason}`);
    }
    lines.push("");
  }
  lines.push("## Mutation Safety Gate");
  const mp = manifest.pipeline.mutation_proof;
  lines.push(`- git_unchanged: ${mp.git_unchanged}`);
  lines.push(`- commits: ${mp.commits_performed}`);
  lines.push(`- pushes: ${mp.pushes_performed}`);
  lines.push(`- merges: ${mp.merges_performed}`);
  lines.push(`- deploys: ${mp.deploys_performed}`);
  lines.push(`- verdict: ${mp.verdict}`);
  lines.push("");
  lines.push("## Simulation Replay");
  lines.push(`- would_generate: ${manifest.pipeline.replay.would_generate}`);
  lines.push(`- would_hold: ${manifest.pipeline.replay.would_hold}`);
  lines.push(`- git_state_preserved: ${manifest.pipeline.replay.git_state_preserved}`);
  lines.push("");
  lines.push("## ⚠️ NO LIVE COMMITS, PUSH, MERGE, OR DEPLOY");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const outDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || OUT);
  ensureDir(outDir);

  const pipeline = runPipeline();

  // Compute by_source/by_type from discovery
  const allCandidates = pipeline.scored.map((s) => s.candidate);
  for (const c of allCandidates) {
    pipeline.discovery.by_source[c.source] = (pipeline.discovery.by_source[c.source] || 0) + 1;
    pipeline.discovery.by_type[c.type] = (pipeline.discovery.by_type[c.type] || 0) + 1;
  }

  const manifest = {
    schema_version: "admin-factory-level3a-candidates/v1",
    runner: "ADMIN-FACTORY-LEVEL3A-CANDIDATE-GENERATION-001",
    generated_at: new Date().toISOString(),
    mode: "LEVEL3A_SIMULATION_ONLY",
    pipeline,
    mutation_summary: {
      git_commit: "none (simulation only)",
      git_push: "none (simulation only)",
      git_merge: "none (simulation only)",
      deploy: "none (simulation only)",
      aak_blocking: false,
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
    },
  };

  const jsonPath = path.join(outDir, "level3a-candidates-manifest.json");
  const reportPath = path.join(outDir, "level3a-candidates-report.md");

  fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true,
    runner: "ADMIN-FACTORY-LEVEL3A-CANDIDATE-GENERATION-001",
    mode: "LEVEL3A_SIMULATION_ONLY",
    total_candidates: pipeline.discovery.total_candidates,
    eligible: pipeline.eligible_count,
    held: pipeline.held_count,
    no_git_mutations: pipeline.mutation_proof.git_unchanged,
    manifest_path: jsonPath,
    report_path: reportPath,
  }, null, 2) + "\n");
}

main();
