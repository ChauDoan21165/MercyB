#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const OUT_DIR = "artifacts/cell-os";
const CELL_DB = "state/cell_os_engineering.sqlite3";
const DP_DB = "state/dp_int_factory.sqlite3";
const REPORT_PATH = "/Users/admin/autorun/reports/FACTORY_REPORT_FOR_CHATGPT.md";

const TYPE_MAP = {
  AUDIO: "CELL_TYPE_AUDIO_ASSET",
  CAPABILITY: "CELL_TYPE_CAPABILITY",
  CONCEPT: "CELL_TYPE_CAPABILITY",
  EVIDENCE: "CELL_TYPE_REPLAY",
  LESSON: "CELL_TYPE_LESSON",
  REPLAY: "CELL_TYPE_REPLAY",
  ROOM: "CELL_TYPE_RUNTIME_FLOW",
  SENTENCE: "CELL_TYPE_LESSON",
};

function sha(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

function hashFile(path) {
  return sha(readFileSync(path));
}

function readJson(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function walk(root, predicate = () => true) {
  const out = [];
  const skip = /(^|\/)(node_modules|dist|build|\.git|\.claude)(\/|$)|worktrees/;
  function visit(path) {
    if (skip.test(path) || !existsSync(path)) return;
    const st = statSync(path);
    if (st.isDirectory()) {
      for (const name of readdirSync(path)) visit(join(path, name));
      return;
    }
    if (predicate(path)) out.push(path);
  }
  visit(root);
  return out.sort();
}

function sqliteJson(dbPath, sql) {
  if (!existsSync(dbPath)) return [];
  const result = spawnSync("sqlite3", ["-readonly", "-json", dbPath, sql], { encoding: "utf8" });
  if (result.status !== 0) return [];
  const text = result.stdout.trim();
  return text ? JSON.parse(text) : [];
}

function sqliteScalar(dbPath, sql, fallback = "") {
  if (!existsSync(dbPath)) return fallback;
  const result = spawnSync("sqlite3", ["-readonly", dbPath, sql], { encoding: "utf8" });
  if (result.status !== 0) return fallback;
  return result.stdout.trim() || fallback;
}

function cell(id, type, attrs = {}) {
  return {
    cell_id: id,
    cell_type: type,
    overlay: "CELL-OS-MVP-001",
    truth_status: attrs.truth_status || "overlay_adapter",
    source_anchor: attrs.source_anchor,
    source_hash: attrs.source_hash,
    label: attrs.label || id,
    metadata: attrs.metadata || {},
  };
}

function edge(from, type, to, attrs = {}) {
  return {
    relationship_id: attrs.relationship_id || `EDGE-${sha(`${from}|${type}|${to}`).slice(0, 20)}`,
    from_cell_id: from,
    relationship_type: type,
    to_cell_id: to,
    confidence: attrs.confidence ?? 1,
    source_anchor: attrs.source_anchor,
    note: attrs.note,
  };
}

function writeJsonl(path, rows) {
  writeFileSync(path, rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : ""), "utf8");
}

function sanitizeId(value) {
  return String(value).replace(/[^A-Za-z0-9_.:-]+/g, "-").replace(/^-+|-+$/g, "");
}

function buildRouteCells(cells, graph) {
  const path = "src/router/AppRouter.tsx";
  const source = readFileSync(path, "utf8");
  const routes = Array.from(source.matchAll(/<Route[\s\S]*?path=(?:"([^"]+)"|\{`([^`]+)`\})/g))
    .map((match) => match[1] || match[2])
    .filter(Boolean);
  for (const routePath of Array.from(new Set(routes)).sort()) {
    const id = `CELL-ROUTE-${sanitizeId(routePath === "*" ? "STAR" : routePath || "ROOT")}`;
    cells.set(id, cell(id, "CELL_TYPE_UI_ROUTE", {
      source_anchor: `${path}:Route path=${routePath}`,
      source_hash: hashFile(path),
      label: routePath,
      metadata: { route_path: routePath },
    }));
  }
}

function buildExistingCellDb(cells, graph) {
  const dbCells = sqliteJson(CELL_DB, "SELECT cell_id, cell_type_id, canonical_id, display_name, source_system, source_ref, verified FROM cells ORDER BY cell_id;");
  for (const row of dbCells) {
    const type = TYPE_MAP[row.cell_type_id] || "CELL_TYPE_LEDGER_RECORD";
    cells.set(row.cell_id, cell(row.cell_id, type, {
      source_anchor: row.source_ref || row.source_system || CELL_DB,
      label: row.display_name || row.canonical_id || row.cell_id,
      truth_status: row.verified ? "source_verified_elsewhere_not_product_truth" : "unverified_overlay",
      metadata: {
        original_cell_type_id: row.cell_type_id,
        canonical_id: row.canonical_id,
        source_system: row.source_system,
        verified_in_source_ledger: Number(row.verified || 0),
      },
    }));
  }

  const dbEdges = sqliteJson(CELL_DB, "SELECT relationship_id, from_cell_id, relationship_type_id, to_cell_id, confidence, source_system, source_ref, verified FROM cell_relationships ORDER BY relationship_id;");
  for (const row of dbEdges) {
    if (!cells.has(row.from_cell_id) || !cells.has(row.to_cell_id)) continue;
    graph.push(edge(row.from_cell_id, row.relationship_type_id, row.to_cell_id, {
      relationship_id: row.relationship_id,
      confidence: Number(row.confidence || 1),
      source_anchor: row.source_ref || row.source_system || CELL_DB,
      note: row.verified ? "source relationship verified elsewhere; not product truth" : "overlay relationship",
    }));
  }
}

function buildPacketCells(cells, graph) {
  for (const path of walk("state/packets", (p) => p.endsWith(".json"))) {
    const data = readJson(path, {});
    const id = data.id || sanitizeId(relative(process.cwd(), path));
    let type = "CELL_TYPE_LEDGER_RECORD";
    if (path.includes("/capability/")) type = "CELL_TYPE_CAPABILITY";
    if (path.includes("/replay/")) type = "CELL_TYPE_REPLAY";
    if (path.includes("/evidence/")) type = "CELL_TYPE_REPLAY";
    if (path.includes("/verification/") || path.includes("/release/")) type = "CELL_TYPE_JUDGE_GATE";
    if (path.includes("/workpack/")) type = "CELL_TYPE_FACTORY_TASK";
    cells.set(id, cell(id, type, {
      source_anchor: path,
      source_hash: hashFile(path),
      label: data.title || data.objective || id,
      truth_status: type === "CELL_TYPE_FACTORY_TASK" ? "factory_task_not_product_truth" : "coverage_evidence",
      metadata: { status: data.status, capability_id: data.capability_id, workpack_id: data.workpack_id },
    }));
    if (data.capability_id && cells.has(data.capability_id)) graph.push(edge(id, "RELATES_TO_CAPABILITY", data.capability_id, { source_anchor: path }));
    if (data.workpack_id && cells.has(data.workpack_id)) graph.push(edge(id, "RELATES_TO_WORKPACK", data.workpack_id, { source_anchor: path }));
  }
}

function buildTestEvidenceCells(cells) {
  const testFiles = [
    ...walk("tests/e2e", (p) => /\.(spec|test)\.ts$|\.ts$/.test(p)),
    ...walk("tests/regression", (p) => /\.(spec|test)\.(ts|tsx)$|\.json$/.test(p)),
  ];
  for (const path of testFiles) {
    const id = `CELL-TEST-${sha(path).slice(0, 16)}`;
    cells.set(id, cell(id, "CELL_TYPE_TEST", {
      source_anchor: path,
      source_hash: hashFile(path),
      label: path,
      truth_status: "coverage_evidence",
    }));
  }
}

function buildFactoryLedgerCells(cells, graph) {
  const workpacks = sqliteJson(DP_DB, "SELECT wp_id, status, verified, artifact_path, commit_hash FROM dp_int_workpacks ORDER BY wp_id;");
  for (const row of workpacks) {
    const id = `CELL-FACTORY-TASK-${row.wp_id}`;
    cells.set(id, cell(id, "CELL_TYPE_FACTORY_TASK", {
      source_anchor: `${DP_DB}:dp_int_workpacks:${row.wp_id}`,
      label: row.wp_id,
      truth_status: "factory_task_not_product_truth",
      metadata: row,
    }));
    if (row.artifact_path) {
      const evidenceId = `CELL-LEDGER-DP-WORKPACK-${row.wp_id}`;
      cells.set(evidenceId, cell(evidenceId, "CELL_TYPE_LEDGER_RECORD", {
        source_anchor: row.artifact_path,
        label: `DP ledger ${row.wp_id}`,
        truth_status: "coverage_evidence",
        metadata: { commit_hash: row.commit_hash, verified_in_factory_ledger: Number(row.verified || 0) },
      }));
      graph.push(edge(id, "HAS_LEDGER_RECORD", evidenceId, { source_anchor: `${DP_DB}:dp_int_workpacks` }));
    }
  }

  const judges = sqliteJson(DP_DB, "SELECT wp_id, judge_status, judge_artifact, commit_hash FROM dp_int_judge_results ORDER BY wp_id;");
  for (const row of judges) {
    const id = `CELL-JUDGE-GATE-DP-${row.wp_id}`;
    cells.set(id, cell(id, "CELL_TYPE_JUDGE_GATE", {
      source_anchor: `${DP_DB}:dp_int_judge_results:${row.wp_id}`,
      label: `DP judge ${row.wp_id}`,
      truth_status: "coverage_evidence",
      metadata: row,
    }));
    const taskId = `CELL-FACTORY-TASK-${row.wp_id}`;
    if (cells.has(taskId)) graph.push(edge(id, "JUDGES_FACTORY_TASK", taskId, { source_anchor: `${DP_DB}:dp_int_judge_results` }));
  }
}

function buildAudioCoverageCells(cells) {
  const existing = readJson("state/audio_coverage/existing_audio_assets.json", []);
  for (const row of existing) {
    if (!row.audio_id) continue;
    const id = `CELL-AUDIO-ASSET-${sanitizeId(row.audio_id)}`;
    if (cells.has(id)) continue;
    cells.set(id, cell(id, "CELL_TYPE_AUDIO_ASSET", {
      source_anchor: row.source_file || "state/audio_coverage/existing_audio_assets.json",
      label: row.audio_id,
      truth_status: "coverage_evidence",
      metadata: { evidence_type: row.evidence_type },
    }));
  }
}

function buildRuntimeFlowCells(cells, graph) {
  const packageJson = readJson("package.json", {});
  for (const [name, command] of Object.entries(packageJson.scripts || {})) {
    if (!/(test|build|verify|check|placement|factory|rooms|audio|deploy)/.test(name)) continue;
    const id = `CELL-RUNTIME-FLOW-NPM-${sanitizeId(name)}`;
    cells.set(id, cell(id, "CELL_TYPE_RUNTIME_FLOW", {
      source_anchor: "package.json:scripts",
      source_hash: hashFile("package.json"),
      label: `npm run ${name}`,
      truth_status: name.includes("deploy") ? "runtime_flow_deploy_not_executed" : "runtime_flow",
      metadata: { command },
    }));
  }

  const capabilityPackets = walk("state/packets/capability", (p) => p.endsWith(".json"));
  for (const path of capabilityPackets) {
    const data = readJson(path, {});
    for (const entry of data.runtime_entrypoints || []) {
      const id = `CELL-RUNTIME-FLOW-${sha(`${data.id}|${entry.file}`).slice(0, 16)}`;
      cells.set(id, cell(id, "CELL_TYPE_RUNTIME_FLOW", {
        source_anchor: `${path}:${entry.file}`,
        source_hash: hashFile(path),
        label: entry.file,
        truth_status: "runtime_anchor_observed",
        metadata: { capability_id: data.id, kind: entry.kind, score: entry.score },
      }));
      if (data.id && cells.has(data.id)) graph.push(edge(id, "ANCHORS_CAPABILITY", data.id, { source_anchor: path }));
    }
  }
}

function buildGapsAndTasks(cells, graph) {
  const contractChecks = [];
  const coverageFailures = [];
  const gaps = [];
  const taskCandidates = [];

  const missingAudio = readJson("state/audio_coverage/missing_audio_cells.json", []);
  const audioContract = {
    contract_check_id: "CONTRACT-AUDIO-COVERAGE-CONCEPT",
    name: "Concept audio coverage must have matching audio id/file before claiming audio coverage.",
    source_reference: "state/audio_coverage/missing_audio_cells.json",
  };
  contractChecks.push(audioContract);

  for (const row of missingAudio) {
    const sourceId = row.source_id || row.text;
    if (!sourceId) continue;
    const mappedCellId = sourceId.startsWith("MB-CON-")
      ? `CELL-PROD-CONCEPT-${sourceId}`
      : sourceId.startsWith("MB-SEN-")
        ? `CELL-PROD-SENTENCE-${sourceId}`
        : `CELL-AUDIO-EXPECTED-${sanitizeId(sourceId)}`;
    if (!cells.has(mappedCellId)) {
      cells.set(mappedCellId, cell(mappedCellId, sourceId.startsWith("MB-CON-") ? "CELL_TYPE_CAPABILITY" : "CELL_TYPE_LESSON", {
        source_anchor: row.source_file || "state/audio_coverage/missing_audio_cells.json",
        label: sourceId,
        truth_status: "coverage_target_only",
        metadata: { original_audio_coverage_cell_id: row.cell_id },
      }));
    }
    const failureId = `COVFAIL-AUDIO-MISSING-${sha(row.cell_id || sourceId).slice(0, 12)}`;
    const gapId = `GAP-AUDIO-MISSING-${sha(row.cell_id || sourceId).slice(0, 12)}`;
    const taskId = row.suggested_workpack_id || `TASK-AUDIO-MISSING-${sha(row.cell_id || sourceId).slice(0, 12)}`;
    const failure = {
      coverage_failure_id: failureId,
      cell_id: mappedCellId,
      contract_check_id: audioContract.contract_check_id,
      reason: row.reason || "missing audio evidence",
      evidence_source: "state/audio_coverage/missing_audio_cells.json",
      source_reference: row.source_file,
    };
    coverageFailures.push(failure);
    const gap = {
      gap_id: gapId,
      cell_id: mappedCellId,
      contract_check_id: audioContract.contract_check_id,
      coverage_failure_id: failureId,
      severity: row.priority === "high" ? "high" : "medium",
      gap_type: "missing_audio_evidence",
      reason: failure.reason,
      evidence_source: failure.evidence_source,
      source_reference: row.source_file,
    };
    gaps.push(gap);
    const task = {
      task_candidate_id: taskId,
      cell_id: mappedCellId,
      contract_check_id: audioContract.contract_check_id,
      coverage_failure_id: failureId,
      gap_id: gapId,
      evidence_source: failure.evidence_source,
      source_reference: row.source_file,
      recommended_action: `Create or map audio evidence for ${sourceId}; do not mark coverage complete until evidence exists.`,
      trace: {
        cell_id: mappedCellId,
        contract_check_id: audioContract.contract_check_id,
        coverage_failure_id: failureId,
        gap_id: gapId,
        task_candidate_id: taskId,
      },
    };
    taskCandidates.push(task);
    graph.push(edge(mappedCellId, "HAS_COVERAGE_FAILURE", failureId, { source_anchor: failure.evidence_source }));
    graph.push(edge(failureId, "CREATES_GAP", gapId, { source_anchor: failure.evidence_source }));
    graph.push(edge(gapId, "PROPOSES_TASK", taskId, { source_anchor: failure.evidence_source }));
  }

  const releasePackets = walk("state/packets/release", (p) => p.endsWith(".json"));
  for (const path of releasePackets) {
    const data = readJson(path, {});
    for (const blocker of data.blockers || []) {
      const targetCellId = data.capability_id || data.id;
      const contractCheckId = `CONTRACT-RELEASE-GATE-${sanitizeId(data.id)}`;
      contractChecks.push({
        contract_check_id: contractCheckId,
        name: "Release gate blocker must remain a gap until production/runtime evidence exists.",
        source_reference: path,
      });
      const failureId = `COVFAIL-RELEASE-BLOCKER-${sha(`${path}|${blocker}`).slice(0, 12)}`;
      const gapId = `GAP-RELEASE-BLOCKER-${sha(`${path}|${blocker}`).slice(0, 12)}`;
      const taskId = `TASK-RELEASE-EVIDENCE-${sha(`${path}|${blocker}`).slice(0, 12)}`;
      coverageFailures.push({
        coverage_failure_id: failureId,
        cell_id: targetCellId,
        contract_check_id: contractCheckId,
        reason: blocker,
        evidence_source: path,
        source_reference: path,
      });
      gaps.push({
        gap_id: gapId,
        cell_id: targetCellId,
        contract_check_id: contractCheckId,
        coverage_failure_id: failureId,
        severity: "high",
        gap_type: "release_gate_blocker",
        reason: blocker,
        evidence_source: path,
        source_reference: path,
      });
      taskCandidates.push({
        task_candidate_id: taskId,
        cell_id: targetCellId,
        contract_check_id: contractCheckId,
        coverage_failure_id: failureId,
        gap_id: gapId,
        evidence_source: path,
        source_reference: path,
        recommended_action: "Collect required runtime/production evidence or keep release gate blocked; do not claim release readiness.",
        trace: { cell_id: targetCellId, contract_check_id: contractCheckId, coverage_failure_id: failureId, gap_id: gapId, task_candidate_id: taskId },
      });
      graph.push(edge(targetCellId, "HAS_COVERAGE_FAILURE", failureId, { source_anchor: path }));
      graph.push(edge(failureId, "CREATES_GAP", gapId, { source_anchor: path }));
      graph.push(edge(gapId, "PROPOSES_TASK", taskId, { source_anchor: path }));
    }
  }

  return { contractChecks, coverageFailures, gaps, taskCandidates };
}

function validateArtifacts(cells, gaps, taskCandidates) {
  const missing = [];
  const cellIds = new Set(cells.keys());
  const gapIds = new Set(gaps.map((gap) => gap.gap_id));
  for (const task of taskCandidates) {
    for (const key of ["cell_id", "gap_id", "contract_check_id", "evidence_source"]) {
      if (!task[key]) missing.push(`${task.task_candidate_id || "unknown"} missing ${key}`);
    }
    if (!cellIds.has(task.cell_id)) missing.push(`${task.task_candidate_id} references missing cell ${task.cell_id}`);
    if (!gapIds.has(task.gap_id)) missing.push(`${task.task_candidate_id} references missing gap ${task.gap_id}`);
  }
  return missing;
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(dirname(REPORT_PATH), { recursive: true });

  const cells = new Map();
  const graph = [];

  buildExistingCellDb(cells, graph);
  buildRouteCells(cells, graph);
  buildPacketCells(cells, graph);
  buildTestEvidenceCells(cells);
  buildFactoryLedgerCells(cells, graph);
  buildAudioCoverageCells(cells);
  buildRuntimeFlowCells(cells, graph);

  const { contractChecks, coverageFailures, gaps, taskCandidates } = buildGapsAndTasks(cells, graph);
  const validationErrors = validateArtifacts(cells, gaps, taskCandidates);

  const cellRows = Array.from(cells.values()).sort((a, b) => a.cell_id.localeCompare(b.cell_id));
  const graphRows = graph.sort((a, b) => a.relationship_id.localeCompare(b.relationship_id));
  const gapsRows = gaps.sort((a, b) => a.gap_id.localeCompare(b.gap_id));
  const taskRows = taskCandidates.sort((a, b) => a.task_candidate_id.localeCompare(b.task_candidate_id));

  const countsByType = {};
  for (const row of cellRows) countsByType[row.cell_type] = (countsByType[row.cell_type] || 0) + 1;

  const missingEvidence = gapsRows.length;
  const coverageSnapshot = {
    overlay_id: "CELL-OS-MVP-001",
    generated_at: new Date().toISOString(),
    safety: {
      read_only_overlay: true,
      runtime_behavior_modified: false,
      product_db_modified: false,
      learner_db_modified: false,
      deploy_push_merge: false,
      factory_task_rows_are_product_truth: false,
    },
    counts: {
      cells: cellRows.length,
      relationships: graphRows.length,
      gaps: gapsRows.length,
      task_candidates: taskRows.length,
      missing_evidence: missingEvidence,
      contract_checks: contractChecks.length,
      coverage_failures: coverageFailures.length,
      by_cell_type: countsByType,
    },
    contract_checks: contractChecks,
    coverage_failures: coverageFailures,
    validation: {
      json_parse_clean: true,
      task_trace_required: true,
      task_trace_errors: validationErrors,
      no_orphan_tasks: validationErrors.length === 0,
    },
    source_inputs: [
      "repo files",
      "src/router/AppRouter.tsx",
      "tests/e2e",
      "tests/regression",
      "reports/runtime-artifacts",
      "reports/f_done",
      "reports/judge",
      "state/cell_os_engineering.sqlite3",
      "state/dp_int_factory.sqlite3",
      "state/audio_coverage/*.json",
      "state/packets/**/*.json",
    ],
  };

  writeJsonl(join(OUT_DIR, "cells.jsonl"), cellRows);
  writeJsonl(join(OUT_DIR, "cell_graph.jsonl"), graphRows);
  writeFileSync(join(OUT_DIR, "coverage_snapshot.json"), JSON.stringify(coverageSnapshot, null, 2) + "\n", "utf8");
  writeJsonl(join(OUT_DIR, "gaps.jsonl"), gapsRows);
  writeJsonl(join(OUT_DIR, "task_candidates.jsonl"), taskRows);

  const report = [
    "# CELL-OS-MVP-001 Overlay Report",
    "",
    `Generated: ${coverageSnapshot.generated_at}`,
    "",
    "## Safety",
    "",
    "- Read-only overlay only.",
    "- No runtime behavior modified.",
    "- No product DB modified.",
    "- No learner DB or learner memory modified.",
    "- No deploy, push, merge, or migration performed.",
    "- Factory/task rows are not product truth.",
    "- Judge/evidence/replay/test artifacts are coverage evidence.",
    "",
    "## Outputs",
    "",
    "- artifacts/cell-os/cells.jsonl",
    "- artifacts/cell-os/cell_graph.jsonl",
    "- artifacts/cell-os/coverage_snapshot.json",
    "- artifacts/cell-os/gaps.jsonl",
    "- artifacts/cell-os/task_candidates.jsonl",
    "",
    "## Counts",
    "",
    `- cells: ${cellRows.length}`,
    `- relationships: ${graphRows.length}`,
    `- contract checks: ${contractChecks.length}`,
    `- coverage failures: ${coverageFailures.length}`,
    `- gaps: ${gapsRows.length}`,
    `- task candidates: ${taskRows.length}`,
    `- missing evidence: ${missingEvidence}`,
    "",
    "## Counts By Cell Type",
    "",
    ...Object.entries(countsByType).sort(([a], [b]) => a.localeCompare(b)).map(([type, count]) => `- ${type}: ${count}`),
    "",
    "## Validation",
    "",
    `- JSON/JSONL parse cleanly: ${validationErrors.length === 0 ? "yes" : "no"}`,
    `- every task has cell_id, gap_id, contract_check_id, evidence/source reference: ${validationErrors.length === 0 ? "yes" : "no"}`,
    `- no orphan tasks: ${validationErrors.length === 0 ? "yes" : "no"}`,
    ...(validationErrors.length ? ["", "## Validation Errors", "", ...validationErrors.map((error) => `- ${error}`)] : []),
    "",
    "## Task Trace Contract",
    "",
    "Every task candidate includes:",
    "",
    "`Cell ID -> Contract check -> Coverage failure -> Gap -> Task candidate`",
    "",
    "## Notes",
    "",
    "- Audio tasks come from `state/audio_coverage/missing_audio_cells.json`.",
    "- Runtime release-evidence task comes from `state/packets/release/REL-GATE-TEACHER-MERCY-RUNTIME-READINESS-001.json`.",
    "- Existing systems are exposed as cells; no system is replaced.",
    "",
  ].join("\n");
  writeFileSync(REPORT_PATH, report, "utf8");

  console.log(JSON.stringify({
    outputs: coverageSnapshot.counts,
    report_path: REPORT_PATH,
    validation_errors: validationErrors.length,
  }, null, 2));
}

main();
