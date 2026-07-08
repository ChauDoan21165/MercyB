#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const OUT_DIR = "artifacts/cell-os";
const REPORT_PATH = "/Users/admin/autorun/reports/FACTORY_REPORT_FOR_CHATGPT.md";

const REQUIRED_CELL_TYPES = [
  "CELL_TYPE_AUDIO_ASSET",
  "CELL_TYPE_CAPABILITY",
  "CELL_TYPE_FACTORY_TASK",
  "CELL_TYPE_JUDGE_GATE",
  "CELL_TYPE_LEDGER_RECORD",
  "CELL_TYPE_LESSON",
  "CELL_TYPE_REPLAY",
  "CELL_TYPE_RUNTIME_FLOW",
  "CELL_TYPE_TEST",
  "CELL_TYPE_UI_ROUTE",
];

const SEVERITY_SCORE = { critical: 4, high: 3, medium: 2, low: 1 };

function sha(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

function sanitizeId(value) {
  return String(value).replace(/[^A-Za-z0-9_.:-]+/g, "-").replace(/^-+|-+$/g, "");
}

function readJson(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function readJsonl(path) {
  return readFileSync(path, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJsonl(path, rows) {
  writeFileSync(path, rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : ""), "utf8");
}

function contract(contractId, attrs) {
  return {
    contract_id: contractId,
    contract_scope: attrs.contract_scope,
    applies_to_cell_type: attrs.applies_to_cell_type,
    overlay_kind: attrs.overlay_kind || "base",
    description: attrs.description,
    items: attrs.items,
  };
}

function baseContracts() {
  return REQUIRED_CELL_TYPES.map((cellType) => contract(`CONTRACT-BASE-${cellType}`, {
    contract_scope: "cell_type",
    applies_to_cell_type: cellType,
    overlay_kind: "base",
    description: `Reusable base contract for ${cellType}.`,
    items: [
      {
        contract_item_id: `CONTRACT-ITEM-${cellType}-SOURCE-ANCHOR`,
        description: "Cell must expose a source reference or anchor.",
        severity: "high",
      },
      {
        contract_item_id: `CONTRACT-ITEM-${cellType}-TRUTH-STATUS`,
        description: "Cell must declare overlay truth status without claiming product truth.",
        severity: "medium",
      },
    ],
  }));
}

function overlayContracts() {
  return [
    contract("CONTRACT-DOMAIN-AUDIO-COVERAGE-CONCEPT", {
      contract_scope: "domain_overlay",
      applies_to_cell_type: "CELL_TYPE_CAPABILITY",
      overlay_kind: "domain",
      description: "Concept cells with declared audio coverage expectations must have matching audio evidence before audio coverage is claimed.",
      items: [
        {
          contract_item_id: "CONTRACT-ITEM-CONCEPT-AUDIO-EVIDENCE-REQUIRED",
          description: "Expected concept audio must be backed by an audio id/file source reference.",
          severity: "medium",
        },
      ],
    }),
    contract("CONTRACT-SAFETY-RUNTIME-RELEASE-EVIDENCE", {
      contract_scope: "priority_safety_overlay",
      applies_to_cell_type: "CELL_TYPE_CAPABILITY",
      overlay_kind: "safety",
      description: "Runtime release-readiness capabilities with release blockers must remain gaps until runtime/production evidence exists.",
      items: [
        {
          contract_item_id: "CONTRACT-ITEM-RUNTIME-RELEASE-EVIDENCE-REQUIRED",
          description: "Release gate blocker must have source-anchored runtime evidence before readiness can be claimed.",
          severity: "high",
        },
      ],
    }),
  ];
}

function evaluationId(cellId, contractId, contractItemId) {
  return `EVAL-${sha(`${cellId}|${contractId}|${contractItemId}`).slice(0, 20)}`;
}

function baseEvaluationsForCell(cell, contractsByType) {
  const base = contractsByType.get(cell.cell_type);
  if (!base) {
    return [{
      evaluation_id: evaluationId(cell.cell_id, "CONTRACT-BASE-UNKNOWN-CELL-TYPE", "CONTRACT-ITEM-UNKNOWN-CELL-TYPE"),
      contract_id: "CONTRACT-BASE-UNKNOWN-CELL-TYPE",
      contract_item_id: "CONTRACT-ITEM-UNKNOWN-CELL-TYPE",
      cell_id: cell.cell_id,
      status: "UNKNOWN",
      severity: "high",
      missing_evidence_reason: `No reusable base contract exists for ${cell.cell_type}`,
      source_anchor: cell.source_anchor,
    }];
  }

  return base.items.map((item) => {
    const hasSource = Boolean(cell.source_anchor || cell.source_hash);
    const hasTruthStatus = Boolean(cell.truth_status);
    let status = "PASS";
    let evidenceRef = cell.source_anchor || cell.source_hash || null;
    let missingReason = null;

    if (item.contract_item_id.endsWith("-SOURCE-ANCHOR") && !hasSource) {
      status = "FAIL";
      evidenceRef = null;
      missingReason = "cell has no source_anchor or source_hash";
    }

    if (item.contract_item_id.endsWith("-TRUTH-STATUS")) {
      if (!hasTruthStatus) {
        status = "FAIL";
        evidenceRef = null;
        missingReason = "cell has no truth_status";
      } else if (cell.truth_status === "product_truth") {
        status = "FAIL";
        evidenceRef = null;
        missingReason = "overlay cell claims product truth";
      }
    }

    return {
      evaluation_id: evaluationId(cell.cell_id, base.contract_id, item.contract_item_id),
      contract_id: base.contract_id,
      contract_item_id: item.contract_item_id,
      cell_id: cell.cell_id,
      status,
      severity: item.severity,
      evidence_ref: evidenceRef || undefined,
      missing_evidence_reason: missingReason || undefined,
      source_path: cell.source_anchor && !cell.source_anchor.includes(":") ? cell.source_anchor : undefined,
      source_anchor: cell.source_anchor,
    };
  });
}

function missingAudioEvaluations(cellsById) {
  const missingRows = readJson("state/audio_coverage/missing_audio_cells.json", []);
  const out = [];
  const contractId = "CONTRACT-DOMAIN-AUDIO-COVERAGE-CONCEPT";
  const contractItemId = "CONTRACT-ITEM-CONCEPT-AUDIO-EVIDENCE-REQUIRED";

  for (const row of missingRows) {
    const sourceId = row.source_id || row.text;
    if (!sourceId) continue;
    const cellId = sourceId.startsWith("MB-CON-")
      ? `CELL-PROD-CONCEPT-${sourceId}`
      : sourceId.startsWith("MB-SEN-")
        ? `CELL-PROD-SENTENCE-${sourceId}`
        : `CELL-AUDIO-EXPECTED-${sanitizeId(sourceId)}`;
    if (!cellsById.has(cellId)) continue;
    out.push({
      evaluation_id: evaluationId(cellId, contractId, contractItemId),
      contract_id: contractId,
      contract_item_id: contractItemId,
      cell_id: cellId,
      status: "FAIL",
      severity: row.priority === "high" ? "high" : "medium",
      missing_evidence_reason: row.reason || "no matching audio id/file found",
      source_path: row.source_file,
      source_anchor: "state/audio_coverage/missing_audio_cells.json",
      source_row_id: row.cell_id,
      suggested_workpack_id: row.suggested_workpack_id,
    });
  }
  return out;
}

function releaseBlockerEvaluations(cellsById) {
  const path = "state/packets/release/REL-GATE-TEACHER-MERCY-RUNTIME-READINESS-001.json";
  const packet = readJson(path, null);
  if (!packet) return [];

  const cellId = packet.capability_id || packet.id;
  if (!cellsById.has(cellId)) return [];

  const contractId = "CONTRACT-SAFETY-RUNTIME-RELEASE-EVIDENCE";
  const contractItemId = "CONTRACT-ITEM-RUNTIME-RELEASE-EVIDENCE-REQUIRED";
  return (packet.blockers || []).map((blocker) => ({
    evaluation_id: evaluationId(`${cellId}|${blocker}`, contractId, contractItemId),
    contract_id: contractId,
    contract_item_id: contractItemId,
    cell_id: cellId,
    status: "FAIL",
    severity: "high",
    missing_evidence_reason: blocker,
    source_path: path,
    source_anchor: path,
  }));
}

function gapFromEvaluation(evaluation) {
  const gapType = evaluation.contract_id === "CONTRACT-DOMAIN-AUDIO-COVERAGE-CONCEPT"
    ? "missing_audio_evidence"
    : evaluation.contract_id === "CONTRACT-SAFETY-RUNTIME-RELEASE-EVIDENCE"
      ? "release_gate_blocker"
      : "contract_failure";
  return {
    gap_id: `GAP-${sha(evaluation.evaluation_id).slice(0, 16)}`,
    cell_id: evaluation.cell_id,
    contract_id: evaluation.contract_id,
    contract_item_id: evaluation.contract_item_id,
    evaluation_id: evaluation.evaluation_id,
    status: evaluation.status,
    severity: evaluation.severity,
    gap_type: gapType,
    reason: evaluation.missing_evidence_reason || "contract evaluation did not pass",
    evidence_ref: evaluation.evidence_ref,
    missing_evidence_reason: evaluation.missing_evidence_reason,
    source_path: evaluation.source_path,
    source_anchor: evaluation.source_anchor,
  };
}

function taskFromGap(gap, evaluation) {
  const isAudio = gap.contract_id === "CONTRACT-DOMAIN-AUDIO-COVERAGE-CONCEPT";
  const isRelease = gap.contract_id === "CONTRACT-SAFETY-RUNTIME-RELEASE-EVIDENCE";
  const taskId = evaluation.suggested_workpack_id || `TASK-${sha(gap.gap_id).slice(0, 16)}`;
  const recommendedAction = isAudio
    ? `Create or map source-anchored audio evidence for ${gap.cell_id}; do not mark coverage complete until evidence exists.`
    : isRelease
      ? "Collect required runtime/production replay evidence or keep release gate blocked; do not claim release readiness."
      : `Resolve ${gap.contract_item_id} for ${gap.cell_id} with source-anchored evidence.`;

  return {
    task_candidate_id: taskId,
    cell_id: gap.cell_id,
    contract_id: gap.contract_id,
    contract_item_id: gap.contract_item_id,
    evaluation_id: gap.evaluation_id,
    gap_id: gap.gap_id,
    evidence_ref: gap.evidence_ref,
    missing_evidence_reason: gap.missing_evidence_reason,
    source_path: gap.source_path,
    source_anchor: gap.source_anchor,
    recommended_action: recommendedAction,
    trace: {
      cell_id: gap.cell_id,
      contract_id: gap.contract_id,
      contract_item_id: gap.contract_item_id,
      evaluation_id: gap.evaluation_id,
      gap_id: gap.gap_id,
      task_candidate_id: taskId,
    },
  };
}

function validate(cells, evaluations, gaps, tasks) {
  const errors = [];
  const cellIds = new Set(cells.map((row) => row.cell_id));
  const evalsByCell = new Map();
  const evalsById = new Map();
  const gapsById = new Map();

  for (const evaluation of evaluations) {
    evalsById.set(evaluation.evaluation_id, evaluation);
    evalsByCell.set(evaluation.cell_id, (evalsByCell.get(evaluation.cell_id) || 0) + 1);
  }

  for (const cell of cells) {
    if (!evalsByCell.has(cell.cell_id)) errors.push(`${cell.cell_id} has no contract evaluation`);
  }

  for (const gap of gaps) {
    gapsById.set(gap.gap_id, gap);
    if (!cellIds.has(gap.cell_id)) errors.push(`${gap.gap_id} references missing cell ${gap.cell_id}`);
    const evaluation = evalsById.get(gap.evaluation_id);
    if (!evaluation) {
      errors.push(`${gap.gap_id} references missing evaluation ${gap.evaluation_id}`);
      continue;
    }
    const allowed = evaluation.status === "FAIL" || (evaluation.status === "UNKNOWN" && SEVERITY_SCORE[evaluation.severity] >= SEVERITY_SCORE.high);
    if (!allowed) errors.push(`${gap.gap_id} is not backed by FAIL or high-severity UNKNOWN`);
  }

  for (const task of tasks) {
    for (const key of ["cell_id", "contract_id", "contract_item_id", "evaluation_id", "gap_id"]) {
      if (!task[key]) errors.push(`${task.task_candidate_id || "unknown task"} missing ${key}`);
    }
    if (!cellIds.has(task.cell_id)) errors.push(`${task.task_candidate_id} references missing cell ${task.cell_id}`);
    if (!gapsById.has(task.gap_id)) errors.push(`${task.task_candidate_id} references missing gap ${task.gap_id}`);
    if (!evalsById.has(task.evaluation_id)) errors.push(`${task.task_candidate_id} references missing evaluation ${task.evaluation_id}`);
  }

  return errors;
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key]] = (out[row[key]] || 0) + 1;
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

function countEvaluationStatusByContract(evaluations) {
  const out = {};
  for (const evaluation of evaluations) {
    out[evaluation.contract_id] ||= { PASS: 0, FAIL: 0, UNKNOWN: 0 };
    out[evaluation.contract_id][evaluation.status] += 1;
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

function focusedGitStatus() {
  const result = spawnSync("git", ["status", "--short", "--", "scripts/cell-os", "artifacts/cell-os"], { encoding: "utf8" });
  if (result.status !== 0) return `git status failed: ${result.stderr.trim()}`;
  return result.stdout.trim() || "clean";
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(dirname(REPORT_PATH), { recursive: true });

  const cells = readJsonl(join(OUT_DIR, "cells.jsonl"));
  readJsonl(join(OUT_DIR, "cell_graph.jsonl"));
  readJsonl(join(OUT_DIR, "gaps.jsonl"));
  readJsonl(join(OUT_DIR, "task_candidates.jsonl"));
  const previousSnapshot = readJson(join(OUT_DIR, "coverage_snapshot.json"), {});

  const contracts = [...baseContracts(), ...overlayContracts()];
  const contractsByType = new Map(contracts.filter((row) => row.overlay_kind === "base").map((row) => [row.applies_to_cell_type, row]));
  const cellsById = new Map(cells.map((row) => [row.cell_id, row]));

  const evaluations = [
    ...cells.flatMap((row) => baseEvaluationsForCell(row, contractsByType)),
    ...missingAudioEvaluations(cellsById),
    ...releaseBlockerEvaluations(cellsById),
  ].sort((a, b) => a.evaluation_id.localeCompare(b.evaluation_id));

  const gapEvaluations = evaluations.filter((evaluation) => (
    evaluation.status === "FAIL" ||
    (evaluation.status === "UNKNOWN" && SEVERITY_SCORE[evaluation.severity] >= SEVERITY_SCORE.high)
  ));
  const gaps = gapEvaluations.map(gapFromEvaluation).sort((a, b) => a.gap_id.localeCompare(b.gap_id));
  const tasks = gaps.map((gap) => taskFromGap(gap, evaluations.find((evaluation) => evaluation.evaluation_id === gap.evaluation_id)))
    .sort((a, b) => a.task_candidate_id.localeCompare(b.task_candidate_id));

  const validationErrors = validate(cells, evaluations, gaps, tasks);
  const byCellType = countBy(cells, "cell_type");
  const byEvaluationStatus = { PASS: 0, FAIL: 0, UNKNOWN: 0, ...countBy(evaluations, "status") };
  const byContract = countEvaluationStatusByContract(evaluations);
  const gitStatus = focusedGitStatus();
  const topGaps = [...gaps]
    .sort((a, b) => (SEVERITY_SCORE[b.severity] - SEVERITY_SCORE[a.severity]) || a.gap_id.localeCompare(b.gap_id))
    .slice(0, 20);

  const snapshot = {
    ...previousSnapshot,
    overlay_id: "CELL-OS-002",
    generated_at: new Date().toISOString(),
    previous_overlay_id: previousSnapshot.overlay_id || "CELL-OS-MVP-001",
    safety: {
      ...(previousSnapshot.safety || {}),
      read_only_overlay: true,
      runtime_behavior_modified: false,
      product_db_modified: false,
      learner_db_modified: false,
      deploy_push_merge: false,
      factory_task_rows_are_product_truth: false,
      shared_contract_engine_only: true,
    },
    counts: {
      ...(previousSnapshot.counts || {}),
      cells: cells.length,
      contracts: contracts.length,
      contract_evaluations: evaluations.length,
      gaps: gaps.length,
      task_candidates: tasks.length,
      missing_evidence: gaps.length,
      by_cell_type: byCellType,
      by_evaluation_status: byEvaluationStatus,
      by_contract: byContract,
    },
    contract_engine: {
      id: "CELL-OS-002",
      model: "shared reusable contracts by cell_type with optional domain/safety overlays",
      contracts_path: "artifacts/cell-os/contracts.jsonl",
      evaluations_path: "artifacts/cell-os/contract_evaluations.jsonl",
      no_custom_contract_per_cell: true,
      top_20_highest_severity_gaps: topGaps,
    },
    validation: {
      json_parse_clean: validationErrors.length === 0,
      every_cell_has_contract_evaluation: cells.length === new Set(evaluations.map((row) => row.cell_id)).size,
      every_gap_traces_to_failed_or_high_unknown_contract_item: validationErrors.filter((error) => error.includes("backed by")).length === 0,
      every_task_traces_to_gap_and_cell: validationErrors.filter((error) => error.includes("task") || error.includes("TASK") || error.includes("WP-")).length === 0,
      no_orphan_gaps: validationErrors.filter((error) => error.includes("gap") && error.includes("missing")).length === 0,
      no_orphan_tasks: validationErrors.filter((error) => error.includes("task") || error.includes("TASK") || error.includes("WP-")).length === 0,
      errors: validationErrors,
    },
  };

  writeJsonl(join(OUT_DIR, "contracts.jsonl"), contracts);
  writeJsonl(join(OUT_DIR, "contract_evaluations.jsonl"), evaluations);
  writeFileSync(join(OUT_DIR, "coverage_snapshot.json"), JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  writeJsonl(join(OUT_DIR, "gaps.jsonl"), gaps);
  writeJsonl(join(OUT_DIR, "task_candidates.jsonl"), tasks);

  const report = [
    "# CELL-OS-002 Shared Contract Engine Report",
    "",
    `Generated: ${snapshot.generated_at}`,
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
    "- Contracts are shared by Cell Type with optional domain/safety overlays; no custom contract per Cell.",
    "",
    "## Outputs",
    "",
    "- artifacts/cell-os/contracts.jsonl",
    "- artifacts/cell-os/contract_evaluations.jsonl",
    "- artifacts/cell-os/coverage_snapshot.json",
    "- artifacts/cell-os/gaps.jsonl",
    "- artifacts/cell-os/task_candidates.jsonl",
    "",
    "## Counts",
    "",
    `- cells: ${cells.length}`,
    `- contracts: ${contracts.length}`,
    `- contract evaluations: ${evaluations.length}`,
    `- gaps: ${gaps.length}`,
    `- task candidates: ${tasks.length}`,
    `- missing evidence: ${gaps.length}`,
    "",
    "## Counts By Cell Type",
    "",
    ...Object.entries(byCellType).map(([type, count]) => `- ${type}: ${count}`),
    "",
    "## Evaluation Status Counts",
    "",
    ...Object.entries(byEvaluationStatus).map(([status, count]) => `- ${status}: ${count}`),
    "",
    "## Counts By Contract",
    "",
    ...Object.entries(byContract).flatMap(([contractId, statusCounts]) => [
      `- ${contractId}: PASS=${statusCounts.PASS}, FAIL=${statusCounts.FAIL}, UNKNOWN=${statusCounts.UNKNOWN}`,
    ]),
    "",
    "## Top 20 Highest-Severity Gaps",
    "",
    ...topGaps.map((gap) => `- ${gap.severity.toUpperCase()} ${gap.gap_id} ${gap.cell_id} ${gap.contract_item_id}: ${gap.reason}`),
    "",
    "## Validation",
    "",
    `- JSON/JSONL parse cleanly: ${validationErrors.length === 0 ? "yes" : "no"}`,
    `- every cell has contract evaluation count >= 1: ${snapshot.validation.every_cell_has_contract_evaluation ? "yes" : "no"}`,
    `- every gap traces to FAIL or high-severity UNKNOWN contract item: ${snapshot.validation.every_gap_traces_to_failed_or_high_unknown_contract_item ? "yes" : "no"}`,
    `- every task traces to a gap and cell: ${snapshot.validation.every_task_traces_to_gap_and_cell ? "yes" : "no"}`,
    `- no orphan gaps: ${snapshot.validation.no_orphan_gaps ? "yes" : "no"}`,
    `- no orphan tasks: ${snapshot.validation.no_orphan_tasks ? "yes" : "no"}`,
    ...(validationErrors.length ? ["", "## Validation Errors", "", ...validationErrors.map((error) => `- ${error}`)] : []),
    "",
    "## Task Trace Contract",
    "",
    "Every task candidate includes:",
    "",
    "`Cell ID -> Contract -> Contract Item -> Evaluation -> Gap -> Task candidate`",
    "",
    "## Focused Git Status",
    "",
    "```text",
    gitStatus,
    "```",
    "",
  ].join("\n");
  writeFileSync(REPORT_PATH, report, "utf8");

  console.log(JSON.stringify({
    counts: snapshot.counts,
    validation: snapshot.validation,
    report_path: REPORT_PATH,
  }, null, 2));
}

if (!existsSync(join(OUT_DIR, "cells.jsonl"))) {
  throw new Error("Missing CELL-OS-MVP-001 cells.jsonl. Run build-mvp-overlay first.");
}

main();
