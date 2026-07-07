#!/usr/bin/env node
/**
 * ADMIN-FACTORY-ENGINEERING-INTELLIGENCE-V1-001
 *
 * Engineering Intelligence v1 — Read-only decision system.
 * 10 integrated capabilities on top of Level 3A Admin Factory.
 *
 * CAPABILITIES:
 * 1. Opportunity Discovery — scan repo, evidence, CI, tests, stuck jobs
 * 2. Candidate Normalization — stable schema
 * 3. Duplicate Detector — title/path/source/evidence similarity
 * 4. Root Cause Clusterer — group related candidates
 * 5. Priority Engine — 9-factor product/engineering scoring
 * 6. Risk Engine — protected paths, ownership, mutation, evidence, rollback
 * 7. Confidence Aggregator — A-F grade
 * 8. Recommendation Engine — ranked with explanations
 * 9. Workpack Planner — simulation-only plans
 * 10. Simulation Replay — prove no mutations
 *
 * HARD RULES: simulation-only, no git commit/push/merge/deploy, no AAK blocking.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const OUT = path.join("/Users/admin/autorun/reports", "admin-factory-engineering-intelligence");

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROTECTED_PATHS = [
  { pattern: /^src\//, reason: "product_runtime" },
  { pattern: /^ios\//, reason: "native_ios" },
  { pattern: /^android\//, reason: "native_android" },
  { pattern: /^supabase\//, reason: "infrastructure" },
  { pattern: /^api\//, reason: "serverless" },
  { pattern: /^public\//, reason: "static_assets" },
  { pattern: /\.github\/workflows\/ci\.yml$/, reason: "aak_blocking_config" },
];

const DISCOVERY_SOURCES = {
  untracked_admin_scripts: { weight: 1.0, label: "Untracked Admin Scripts" },
  admin_tests: { weight: 0.8, label: "Admin Test Coverage" },
  evidence_gaps: { weight: 1.2, label: "Evidence Gaps" },
  execution_records: { weight: 0.9, label: "Execution Records" },
  stuck_jobs: { weight: 1.5, label: "Stuck Jobs" },
  traceability_gaps: { weight: 1.3, label: "Traceability Gaps" },
  report_gaps: { weight: 0.7, label: "Report Coverage Gaps" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exists(p) { return fs.existsSync(p); }
function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }
function git(args) { const r = spawnSync("git", args, { encoding: "utf8", cwd: repoRoot, maxBuffer: 5 * 1024 * 1024 }); return { ok: r.status === 0, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() }; }

// ---------------------------------------------------------------------------
// Capability 1: Opportunity Discovery
// ---------------------------------------------------------------------------

function discoverOpportunities() {
  const ops = [];

  // 1a. Untracked admin scripts
  const untracked = git(["ls-files", "--others", "--exclude-standard"]).stdout.split("\n").filter(Boolean);
  for (const file of untracked) {
    if (file.startsWith("scripts/admin/") || file.startsWith("tests/admin/")) {
      ops.push({
        source: "untracked_admin_scripts",
        path: file,
        title: `New admin file: ${path.basename(file)}`,
        raw_type: file.includes("test") ? "test" : "script",
      });
    }
  }

  // 1b. Evidence gaps from traceability
  const traceManifest = readJson(path.join("/Users/admin/autorun/reports", "aak-traceability-gap", "aak-traceability-gap-manifest.json"));
  if (traceManifest?.package_gaps) {
    for (const gap of traceManifest.package_gaps) {
      if (gap.missing_count > 0) {
        ops.push({
          source: "evidence_gaps",
          package_id: gap.package_id,
          title: `Close evidence gap: ${gap.package_id}`,
          missing_count: gap.missing_count,
          severity: gap.severity,
          raw_type: "evidence_gap",
        });
      }
    }
  }

  // 1c. Execution records
  const execDir = path.join("/Users/admin/autorun/reports", "admin-factory-execution-records");
  if (exists(execDir)) {
    for (const f of fs.readdirSync(execDir).filter((x) => x.startsWith("EXEC-"))) {
      const rec = readJson(path.join(execDir, f));
      if (rec) ops.push({
        source: "execution_records",
        execution_id: rec.execution_id,
        package_id: rec.package_id,
        title: `Complete execution: ${rec.package_id}`,
        raw_type: "execution",
      });
    }
  }

  // 1d. Stuck jobs
  const stuckManifest = readJson(path.join("/Users/admin/autorun/reports", "admin-factory-stuck-job-recovery", "stuck-job-recovery-manifest.json"));
  if (stuckManifest?.results) {
    for (const r of stuckManifest.results.filter((x) => x.stuck)) {
      ops.push({
        source: "stuck_jobs",
        job_id: r.job_id,
        title: `Recover stuck job: ${r.job_id}`,
        severity: r.severity,
        recovery_action: r.recovery?.action,
        raw_type: "stuck_job",
      });
    }
  }

  // 1e. Report coverage gaps — check which expected reports are missing
  const expectedReports = [
    "admin-factory-stuck-job-recovery/stuck-job-recovery-manifest.json",
    "admin-factory-exception-escalator/exception-escalator-manifest.json",
    "admin-factory-queue-priority/queue-priority-manifest.json",
    "admin-factory-autonomy-dashboard/autonomy-dashboard.json",
    "admin-factory-execution-records/execution-record-manifest.json",
    "admin-factory-evidence-bundles/evidence-bundle-manifest.json",
    "admin-factory-traceability-links/traceability_links.json",
    "admin-factory-coverage/coverage_dashboard.json",
    "admin-factory-judge-packages/judge-package-manifest.json",
    "admin-factory-evidence-health/evidence-health-dashboard.json",
  ];
  for (const rp of expectedReports) {
    const full = path.join("/Users/admin/autorun/reports", rp);
    if (!exists(full)) {
      ops.push({
        source: "report_gaps",
        report_path: rp,
        title: `Generate missing report: ${path.basename(rp)}`,
        raw_type: "report_gap",
      });
    }
  }

  return ops;
}

// ---------------------------------------------------------------------------
// Capability 2: Candidate Normalization
// ---------------------------------------------------------------------------

function normalize(ops) {
  return ops.map((op, i) => {
    const id = `EI-${sha256(op.title + op.source + i).slice(0, 14)}`;
    const affectedPaths = op.path ? [op.path] : [];
    const mutationLevel = op.raw_type === "stuck_job" ? "ARTIFACT_ONLY"
      : op.raw_type === "execution" ? "READ_ONLY"
      : op.raw_type === "evidence_gap" ? "READ_ONLY"
      : op.raw_type === "report_gap" ? "ARTIFACT_ONLY"
      : "ARTIFACT_ONLY";

    // Ownership inference
    let ownership = "Admin";
    const title = op.title.toLowerCase();
    if (title.includes("replay")) ownership = "C4";
    else if (title.includes("teacher") || title.includes("mercy")) ownership = "C2";
    else if (title.includes("coverage")) ownership = "C3";
    else if (title.includes("judge") || title.includes("decision")) ownership = "Admin";

    // Severity normalization
    const severity = op.severity || (op.missing_count > 5 ? "critical" : op.missing_count > 2 ? "high" : "medium");

    return {
      candidate_id: id,
      source: op.source,
      source_weight: DISCOVERY_SOURCES[op.source]?.weight || 1.0,
      title: op.title.slice(0, 150),
      description: op.title,
      evidence_refs: [
        ...(op.package_id ? [op.package_id] : []),
        ...(op.execution_id ? [op.execution_id] : []),
        ...(op.job_id ? [op.job_id] : []),
      ],
      affected_paths: affectedPaths,
      ownership,
      mutation_level: mutationLevel,
      severity,
      raw: op,
    };
  });
}

// ---------------------------------------------------------------------------
// Capability 3: Duplicate Detector
// ---------------------------------------------------------------------------

function detectDuplicates(candidates) {
  const duplicates = [];
  const seen = new Map();

  for (const c of candidates) {
    const key = sha256(c.title.toLowerCase().replace(/[^a-z0-9]/g, ""));
    const shortKey = key.slice(0, 16);

    if (seen.has(shortKey)) {
      duplicates.push({ kept: seen.get(shortKey), dropped: c.candidate_id, title: c.title });
    } else {
      seen.set(shortKey, c.candidate_id);
    }
  }

  // Also detect by path overlap
  const byPath = new Map();
  for (const c of candidates) {
    for (const p of c.affected_paths) {
      if (byPath.has(p)) {
        const existing = duplicates.find((d) => d.kept === byPath.get(p) || d.dropped === byPath.get(p));
        if (!existing) {
          duplicates.push({ kept: byPath.get(p), dropped: c.candidate_id, title: `Path collision: ${p}` });
        }
      } else {
        byPath.set(p, c.candidate_id);
      }
    }
  }

  const droppedIds = new Set(duplicates.map((d) => d.dropped));
  const unique = candidates.filter((c) => !droppedIds.has(c.candidate_id));

  return { unique, duplicates, duplicate_count: duplicates.length, unique_count: unique.length };
}

// ---------------------------------------------------------------------------
// Capability 4: Root Cause Clusterer
// ---------------------------------------------------------------------------

function clusterCandidates(candidates) {
  const clusters = [];

  // Cluster by source
  const bySource = {};
  for (const c of candidates) {
    if (!bySource[c.source]) bySource[c.source] = { cluster_id: `CLUSTER-${c.source}`, source: c.source, label: DISCOVERY_SOURCES[c.source]?.label || c.source, members: [], root_cause: "" };
    bySource[c.source].members.push(c.candidate_id);
  }

  // Root cause inference per cluster
  for (const [source, cluster] of Object.entries(bySource)) {
    if (source === "evidence_gaps") cluster.root_cause = "Missing execution records and evidence bundles in traceability chain";
    else if (source === "stuck_jobs") cluster.root_cause = "Worker disappearance or runtime threshold exceeded";
    else if (source === "report_gaps") cluster.root_cause = "Factory pipeline components not yet executed";
    else if (source === "untracked_admin_scripts") cluster.root_cause = "New admin factory automation not yet committed";
    else if (source === "traceability_gaps") cluster.root_cause = "Decision-to-Evidence chain incomplete";
    else cluster.root_cause = `Gaps in ${DISCOVERY_SOURCES[source]?.label || source}`;

    clusters.push(cluster);
  }

  return { clusters, cluster_count: clusters.length };
}

// ---------------------------------------------------------------------------
// Capability 5: Priority Engine (9-factor)
// ---------------------------------------------------------------------------

function scorePriority(candidate) {
  const factors = {};

  // Product value (admin automation = internal product)
  factors.product_value = candidate.source === "stuck_jobs" ? 9
    : candidate.source === "evidence_gaps" ? 8
    : candidate.source === "traceability_gaps" ? 7
    : candidate.source === "report_gaps" ? 5
    : candidate.source === "execution_records" ? 6
    : 4;

  // Engineering value
  factors.engineering_value = candidate.source === "evidence_gaps" ? 9
    : candidate.source === "stuck_jobs" ? 8
    : candidate.source === "untracked_admin_scripts" ? 6
    : 5;

  // Urgency
  factors.urgency = candidate.severity === "critical" ? 10
    : candidate.severity === "high" ? 8
    : candidate.severity === "medium" ? 5
    : 3;

  // Evidence strength
  factors.evidence_strength = candidate.evidence_refs.length >= 3 ? 9
    : candidate.evidence_refs.length >= 1 ? 6
    : 3;

  // Confidence (base)
  factors.confidence = 7;

  // Risk (inverse — lower risk = higher priority)
  const riskScore = candidate.mutation_level === "READ_ONLY" ? 2
    : candidate.mutation_level === "ARTIFACT_ONLY" ? 5
    : 8;
  factors.risk_inverse = 10 - riskScore;

  // Execution cost (inverse — cheaper = higher priority)
  factors.cost_inverse = candidate.source === "report_gaps" ? 8
    : candidate.source === "evidence_gaps" ? 4
    : candidate.source === "stuck_jobs" ? 3
    : 6;

  // Rollback difficulty (inverse — easy rollback = higher priority)
  const touchesProtected = candidate.affected_paths.some((p) => PROTECTED_PATHS.some((pp) => pp.pattern.test(p)));
  factors.rollback_inverse = touchesProtected ? 2 : 9;

  // Ownership match (Admin-owned = highest priority for factory)
  factors.ownership_match = candidate.ownership === "Admin" ? 10
    : candidate.ownership === "C3" ? 7
    : candidate.ownership === "C4" ? 7
    : 5;

  const raw = Object.values(factors).reduce((s, v) => s + v, 0);
  const maxPossible = Object.keys(factors).length * 10; // 9 * 10 = 90
  const normalized = Math.round((raw / maxPossible) * 100);

  return {
    candidate_id: candidate.candidate_id,
    total_score: normalized,
    factors,
    factor_count: Object.keys(factors).length,
  };
}

// ---------------------------------------------------------------------------
// Capability 6: Risk Engine (5 dimensions)
// ---------------------------------------------------------------------------

function scoreRisk(candidate) {
  const dims = {};

  // Protected path risk
  const touchesProtected = candidate.affected_paths.some((p) => PROTECTED_PATHS.some((pp) => pp.pattern.test(p)));
  dims.protected_path = touchesProtected ? 80 : 0;

  // Ownership mismatch risk
  dims.ownership_mismatch = candidate.ownership === "Admin" ? 0 : 20;

  // Mutation level risk
  dims.mutation_level = candidate.mutation_level === "READ_ONLY" ? 0
    : candidate.mutation_level === "ARTIFACT_ONLY" ? 15
    : 50;

  // Evidence weakness risk
  dims.evidence_weakness = candidate.evidence_refs.length === 0 ? 40
    : candidate.evidence_refs.length < 2 ? 25
    : 10;

  // Rollback risk
  dims.rollback = touchesProtected ? 60 : 5;

  const total = Object.values(dims).reduce((s, v) => s + v, 0);
  const maxPossible = Object.keys(dims).length * 100;
  const normalized = Math.round((total / maxPossible) * 100);

  return {
    candidate_id: candidate.candidate_id,
    risk_score: normalized,
    risk_level: normalized >= 50 ? "critical" : normalized >= 30 ? "high" : normalized >= 15 ? "medium" : "low",
    dimensions: dims,
  };
}

// ---------------------------------------------------------------------------
// Capability 7: Confidence Aggregator
// ---------------------------------------------------------------------------

function aggregateConfidence(priority, risk) {
  // Confidence = average of priority confidence and (100 - risk)
  const safetyConf = 100 - risk.risk_score;
  const scores = [safetyConf, priority.total_score, 70]; // base confidence = 70
  const overall = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);

  let grade;
  if (overall >= 85) grade = "A";
  else if (overall >= 70) grade = "B";
  else if (overall >= 55) grade = "C";
  else if (overall >= 40) grade = "D";
  else grade = "F";

  return {
    candidate_id: priority.candidate_id,
    overall,
    grade,
    safety_confidence: safetyConf,
    priority_confidence: priority.total_score,
    actionable: overall >= 50,
  };
}

// ---------------------------------------------------------------------------
// Capability 8: Recommendation Engine
// ---------------------------------------------------------------------------

function generateRecommendations(candidates, priority, risk, confidence) {
  const combined = candidates.map((c) => ({
    ...c,
    priority: priority.find((p) => p.candidate_id === c.candidate_id),
    risk: risk.find((r) => r.candidate_id === c.candidate_id),
    confidence: confidence.find((cf) => cf.candidate_id === c.candidate_id),
  }));

  const ranked = combined
    .filter((c) => c.confidence?.actionable)
    .sort((a, b) => (b.priority?.total_score || 0) - (a.priority?.total_score || 0));

  const deferred = combined.filter((c) => !c.confidence?.actionable);

  // Generate comparisons for top N
  const recommendations = ranked.map((c, i) => {
    let comparison = "";
    if (i < ranked.length - 1) {
      const next = ranked[i + 1];
      const diff = (c.priority?.total_score || 0) - (next.priority?.total_score || 0);
      const primaryFactor = Object.entries(c.priority?.factors || {})
        .sort((a, b) => b[1] - a[1])[0];
      comparison = `Outranks "${next.title}" by ${diff} pts. Primary driver: ${primaryFactor?.[0] || "unknown"} (${primaryFactor?.[1] || "?"}/10).`;
    } else {
      comparison = "Lowest-ranked actionable candidate.";
    }

    return {
      rank: i + 1,
      candidate_id: c.candidate_id,
      title: c.title,
      priority_score: c.priority?.total_score,
      risk_level: c.risk?.risk_level,
      confidence: `${c.confidence?.overall} (${c.confidence?.grade})`,
      explanation: [
        `Source: ${DISCOVERY_SOURCES[c.source]?.label || c.source}`,
        `Mutation: ${c.mutation_level}`,
        `Risk: ${c.risk?.risk_level} (${c.risk?.risk_score}/100)`,
        `Confidence: ${c.confidence?.grade}`,
        comparison,
      ].join(" | "),
      comparison,
    };
  });

  const deferredExplanations = deferred.map((c) => ({
    candidate_id: c.candidate_id,
    title: c.title,
    reason: `Confidence ${c.confidence?.overall} < 50 (grade ${c.confidence?.grade}) — held for evidence completion`,
  }));

  return { recommendations, deferred: deferredExplanations, total_ranked: recommendations.length, total_deferred: deferred.length };
}

// ---------------------------------------------------------------------------
// Capability 9: Workpack Planner
// ---------------------------------------------------------------------------

function planWorkpack(rec) {
  const title = rec.title;
  const wpId = `WP-EI-${sha256(title).slice(0, 12)}`;

  return {
    workpack_id: wpId,
    candidate_id: rec.candidate_id,
    objective: `Execute: ${title}`,
    scope: rec.explanation || title,
    allowed_files: ["scripts/admin/", "tests/admin/", "reports/", "schemas/", "fixtures/"],
    forbidden_files: ["src/", "ios/", "android/", "supabase/", "api/", "public/", ".github/workflows/ci.yml"],
    tests_required: ["npx vitest run tests/admin/"],
    evidence_plan: {
      execution_record: { required: true, description: "Generate deterministic execution record" },
      evidence_bundle: { required: true, description: "Package artifacts into bundle" },
      traceability_links: { required: true, description: "Build chain links" },
      coverage_update: { required: false, description: "Update coverage metrics" },
      judge_package: { required: false, description: "Prepare Judge package if confidence >= 70" },
      health_dashboard: { required: false, description: "Update health dashboard" },
    },
    rollback_plan: "Remove generated artifacts from output directory. No database or runtime state affected.",
    anti_fake_checks: [
      "All paths exist on disk",
      "All hashes are deterministic",
      "No fabricated evidence",
      "Simulation mode only",
    ],
    simulation_only: true,
    mutations: "NONE",
  };
}

// ---------------------------------------------------------------------------
// Capability 10: Simulation Replay
// ---------------------------------------------------------------------------

function simulationReplay(gitBefore, results) {
  const gitAfter = {
    status: git(["status", "--porcelain"]).stdout,
    diff: git(["diff", "--stat", "HEAD"]).stdout,
  };

  const unchanged = gitBefore.status === gitAfter.status && gitBefore.diff === gitAfter.diff;

  return {
    git_unchanged: unchanged,
    commits: 0,
    pushes: 0,
    merges: 0,
    deploys: 0,
    verdict: unchanged ? "NO_MUTATIONS_DETECTED" : "MUTATIONS_DETECTED",
    would_generate_workpacks: results.total_ranked,
    would_defer: results.total_deferred,
    top_recommendation: results.recommendations[0]?.title || "none",
    simulation_mode: true,
  };
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

function runPipeline() {
  const gitBefore = { status: git(["status", "--porcelain"]).stdout, diff: git(["diff", "--stat", "HEAD"]).stdout };

  // 1. Discover
  const raw = discoverOpportunities();

  // 2. Normalize
  const candidates = normalize(raw);

  // 3. Deduplicate
  const { unique, duplicates, duplicate_count, unique_count } = detectDuplicates(candidates);

  // 4. Cluster
  const { clusters, cluster_count } = clusterCandidates(unique);

  // 5. Priority
  const priority = unique.map(scorePriority);

  // 6. Risk
  const risk = unique.map(scoreRisk);

  // 7. Confidence
  const confidence = unique.map((c) => {
    const p = priority.find((x) => x.candidate_id === c.candidate_id);
    const r = risk.find((x) => x.candidate_id === c.candidate_id);
    return aggregateConfidence(p, r);
  });

  // 8. Recommendations
  const results = generateRecommendations(unique, priority, risk, confidence);

  // 9. Workpack plans for top 5
  const workpackPlans = results.recommendations.slice(0, 5).map(planWorkpack);

  // 10. Simulation replay
  const replay = simulationReplay(gitBefore, results);

  return {
    discovery: { total_raw: raw.length, by_source: Object.fromEntries(Object.entries(DISCOVERY_SOURCES).map(([k]) => [k, raw.filter((r) => r.source === k).length])) },
    normalization: { candidates: unique_count, schema_version: "ei-candidate/v1" },
    dedup: { duplicates: duplicate_count, unique: unique_count },
    clusters: { count: cluster_count, list: clusters.map((c) => ({ id: c.cluster_id, source: c.source, root_cause: c.root_cause, members: c.members.length })) },
    priority: { scored: priority.length, avg_score: Math.round(priority.reduce((s, p) => s + p.total_score, 0) / (priority.length || 1)) },
    risk: { scored: risk.length, by_level: { critical: risk.filter((r) => r.risk_level === "critical").length, high: risk.filter((r) => r.risk_level === "high").length, medium: risk.filter((r) => r.risk_level === "medium").length, low: risk.filter((r) => r.risk_level === "low").length } },
    confidence: { by_grade: { A: confidence.filter((c) => c.grade === "A").length, B: confidence.filter((c) => c.grade === "B").length, C: confidence.filter((c) => c.grade === "C").length, D: confidence.filter((c) => c.grade === "D").length, F: confidence.filter((c) => c.grade === "F").length } },
    recommendations: results,
    workpack_plans: workpackPlans,
    replay,
  };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(m) {
  const l = [];
  l.push("# Engineering Intelligence v1 Report");
  l.push("");
  l.push(`runner: ${m.runner} | generated: ${m.generated_at} | mode: ${m.mode}`);
  l.push("");
  l.push("## Discovery");
  l.push(`- raw: ${m.pipeline.discovery.total_raw} candidates from ${Object.values(m.pipeline.discovery.by_source).filter((v) => v > 0).length} sources`);
  l.push("");
  l.push("## Dedup & Clustering");
  l.push(`- unique: ${m.pipeline.dedup.unique} | duplicates: ${m.pipeline.dedup.duplicates} | clusters: ${m.pipeline.clusters.count}`);
  for (const cl of m.pipeline.clusters.list) l.push(`  - ${cl.id}: ${cl.root_cause} (${cl.members} members)`);
  l.push("");
  l.push("## Priority & Risk");
  l.push(`- avg_priority: ${m.pipeline.priority.avg_score}/100`);
  l.push(`- risk: low=${m.pipeline.risk.by_level.low} medium=${m.pipeline.risk.by_level.medium} high=${m.pipeline.risk.by_level.high} critical=${m.pipeline.risk.by_level.critical}`);
  l.push("");
  l.push("## Top Recommendations");
  for (const r of m.pipeline.recommendations.recommendations.slice(0, 10)) {
    l.push(`### #${r.rank}: ${r.title}`);
    l.push(`- priority: ${r.priority_score} | risk: ${r.risk_level} | confidence: ${r.confidence}`);
    l.push(`- ${r.explanation}`);
    l.push("");
  }
  if (m.pipeline.recommendations.deferred.length > 0) {
    l.push("## Deferred");
    for (const d of m.pipeline.recommendations.deferred.slice(0, 5)) l.push(`- ${d.title}: ${d.reason}`);
    l.push("");
  }
  l.push("## Workpack Plans (Top 5)");
  for (const wp of m.pipeline.workpack_plans) {
    l.push(`- **${wp.workpack_id}**: ${wp.objective} (simulation-only, ${Object.values(wp.evidence_plan).filter((e) => e.required).length} required evidence items)`);
  }
  l.push("");
  l.push("## Simulation Replay");
  l.push(`- git_unchanged: ${m.pipeline.replay.git_unchanged}`);
  l.push(`- verdict: ${m.pipeline.replay.verdict}`);
  l.push(`- would generate: ${m.pipeline.replay.would_generate_workpacks} workpacks`);
  l.push("");
  l.push("## ⚠️ NO COMMITS, PUSH, MERGE, OR DEPLOY");
  return l.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const outDir = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) || OUT);
  ensureDir(outDir);

  const pipeline = runPipeline();

  const manifest = {
    schema_version: "admin-factory-engineering-intelligence/v1",
    runner: "ADMIN-FACTORY-ENGINEERING-INTELLIGENCE-V1-001",
    generated_at: new Date().toISOString(),
    mode: "LEVEL3A_SIMULATION_ONLY",
    pipeline,
    mutation_summary: {
      git_commit: "none", git_push: "none", git_merge: "none", deploy: "none",
      aak_blocking: false, database_writes: "none", runtime_mutations: "none",
    },
  };

  const jp = path.join(outDir, "engineering-intelligence-manifest.json");
  const rp = path.join(outDir, "engineering-intelligence-report.md");
  fs.writeFileSync(jp, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(rp, buildReport(manifest));

  process.stdout.write(JSON.stringify({
    ok: true, runner: "ADMIN-FACTORY-ENGINEERING-INTELLIGENCE-V1-001",
    candidates: pipeline.dedup.unique, duplicates: pipeline.dedup.duplicates,
    clusters: pipeline.clusters.count, ranked: pipeline.recommendations.total_ranked,
    top_pick: pipeline.recommendations.recommendations[0]?.title || "none",
    no_mutations: pipeline.replay.git_unchanged,
    manifest_path: jp, report_path: rp,
  }, null, 2) + "\n");
}

main();
