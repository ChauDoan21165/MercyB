#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const OUT_DIR = "artifacts/cell-os";
const REPORT_PATH = "/Users/admin/autorun/reports/FACTORY_REPORT_FOR_CHATGPT.md";
const ALLOWED_SIGNAL_TYPES = new Set([
  "HEALTHY",
  "EVIDENCE_MISSING",
  "DEPENDENCY_MISSING",
  "REPLAY_MISSING",
  "AUDIO_MISSING",
  "PRODUCTION_PROOF_MISSING",
  "DUPLICATE_SUSPECTED",
  "DEPRECATED_SUSPECTED",
  "BLOCKED",
]);
const SEVERITY_WEIGHT = { critical: 100, high: 80, medium: 45, low: 20 };
const SEVERITY_SCORE = { critical: 4, high: 3, medium: 2, low: 1 };

function sha(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

function readJson(path, fallback = null) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function readJsonl(path) {
  const text = readFileSync(path, "utf8").trim();
  if (!text) return [];
  return text.split("\n").filter(Boolean).map((line) => JSON.parse(line));
}

function writeJsonl(path, rows) {
  writeFileSync(path, rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : ""), "utf8");
}

function priorityScore(severity, productValue, dependencyImpact, repairCost) {
  return (SEVERITY_WEIGHT[severity] || 0) + productValue + dependencyImpact - repairCost;
}

function signalTypeFor(gap) {
  if (gap.contract_id === "CONTRACT-SAFETY-RUNTIME-RELEASE-EVIDENCE") return "PRODUCTION_PROOF_MISSING";
  if (gap.contract_id === "CONTRACT-DOMAIN-AUDIO-COVERAGE-CONCEPT") return "AUDIO_MISSING";
  if (/replay/i.test(gap.contract_item_id || gap.gap_type || "")) return "REPLAY_MISSING";
  if (/depend/i.test(gap.contract_item_id || gap.gap_type || "")) return "DEPENDENCY_MISSING";
  return "EVIDENCE_MISSING";
}

function scoreParts(signalType, severity) {
  if (signalType === "PRODUCTION_PROOF_MISSING") {
    return { product_value: 35, dependency_impact: 25, repair_cost: 10, severity };
  }
  if (signalType === "AUDIO_MISSING") {
    return { product_value: 12, dependency_impact: 8, repair_cost: 18, severity };
  }
  return { product_value: 10, dependency_impact: 5, repair_cost: 12, severity };
}

function signalFromGap(gap, cell, evaluation) {
  const signalType = signalTypeFor(gap);
  const parts = scoreParts(signalType, gap.severity);
  const signal = {
    signal_id: `SIGNAL-${sha(`${gap.gap_id}|${gap.evaluation_id}`).slice(0, 18)}`,
    cell_id: gap.cell_id,
    cell_type: cell.cell_type,
    source_gap_id: gap.gap_id,
    contract_id: gap.contract_id,
    contract_item_id: gap.contract_item_id,
    evaluation_id: gap.evaluation_id,
    signal_type: signalType,
    severity: gap.severity,
    confidence: evaluation ? 1 : 0.75,
    product_value: parts.product_value,
    dependency_impact: parts.dependency_impact,
    repair_cost: parts.repair_cost,
    priority_score: priorityScore(parts.severity, parts.product_value, parts.dependency_impact, parts.repair_cost),
    reason: gap.reason || evaluation?.missing_evidence_reason || "contract evaluation did not pass",
    evidence_ref: gap.evidence_ref || evaluation?.evidence_ref,
    missing_evidence_reason: gap.missing_evidence_reason || evaluation?.missing_evidence_reason,
    source_path: gap.source_path || evaluation?.source_path,
    source_anchor: gap.source_anchor || evaluation?.source_anchor,
  };
  if (!ALLOWED_SIGNAL_TYPES.has(signal.signal_type)) {
    throw new Error(`Invalid signal type ${signal.signal_type}`);
  }
  return signal;
}

function chunk(rows, size) {
  const out = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}

function traceForSignals(signals) {
  return signals.map((signal) => ({
    cell_id: signal.cell_id,
    contract_id: signal.contract_id,
    contract_item_id: signal.contract_item_id,
    evaluation_id: signal.evaluation_id,
    gap_id: signal.source_gap_id,
    signal_id: signal.signal_id,
  }));
}

function repairPlan(planId, attrs) {
  return {
    repair_plan_id: planId,
    title: attrs.title,
    rank: attrs.rank,
    grouped_signal_ids: attrs.signals.map((signal) => signal.signal_id),
    affected_cell_ids: [...new Set(attrs.signals.map((signal) => signal.cell_id))],
    primary_cell_id: attrs.primary_cell_id || attrs.signals[0]?.cell_id,
    repair_type: attrs.repair_type,
    expected_product_value: attrs.expected_product_value,
    estimated_repair_cost: attrs.estimated_repair_cost,
    priority_score: attrs.priority_score,
    acceptance_checks: attrs.acceptance_checks,
    judge_checks: attrs.judge_checks,
    anti_fake_checks: attrs.anti_fake_checks,
    source_trace: traceForSignals(attrs.signals),
  };
}

function buildRepairPlans(signals) {
  const plans = [];
  const releaseSignals = signals.filter((signal) => signal.signal_type === "PRODUCTION_PROOF_MISSING")
    .sort((a, b) => b.priority_score - a.priority_score);
  const audioSignals = signals.filter((signal) => signal.signal_type === "AUDIO_MISSING")
    .sort((a, b) => a.cell_id.localeCompare(b.cell_id));
  const otherSignals = signals.filter((signal) => !["PRODUCTION_PROOF_MISSING", "AUDIO_MISSING"].includes(signal.signal_type))
    .sort((a, b) => b.priority_score - a.priority_score);

  for (const signal of releaseSignals) {
    plans.push(repairPlan(`REPAIR-PLAN-RUNTIME-PROOF-${sha(signal.signal_id).slice(0, 10)}`, {
      rank: 0,
      signals: [signal],
      title: "Collect runtime production proof for Teacher Mercy readiness gate",
      repair_type: "production_proof_evidence",
      expected_product_value: 35,
      estimated_repair_cost: 10,
      priority_score: signal.priority_score,
      acceptance_checks: [
        "source-anchored runtime or production replay evidence exists",
        "release gate blocker is removed only by evidence, not by assertion",
        "Teacher Mercy behavior is not changed by the overlay",
      ],
      judge_checks: [
        "judge verifies source path exists",
        "judge verifies evidence is replay/runtime proof and not factory-task status alone",
      ],
      anti_fake_checks: [
        "no generated capability claims without source anchors",
        "no product readiness claim from task rows alone",
      ],
    }));
  }

  let batchNumber = 1;
  for (const batch of chunk(audioSignals, 50)) {
    if (!batch.length) continue;
    const maxScore = Math.max(...batch.map((signal) => signal.priority_score));
    plans.push(repairPlan(`REPAIR-PLAN-AUDIO-MISSING-BATCH-${String(batchNumber).padStart(3, "0")}`, {
      rank: 0,
      signals: batch,
      title: `Map or create concept audio evidence batch ${batchNumber}`,
      repair_type: "audio_evidence_batch",
      expected_product_value: batch.reduce((sum, signal) => sum + signal.product_value, 0),
      estimated_repair_cost: batch.reduce((sum, signal) => sum + signal.repair_cost, 0),
      priority_score: maxScore,
      repair_cost: batch.reduce((sum, signal) => sum + signal.repair_cost, 0),
      acceptance_checks: [
        "each affected concept has a source-anchored audio id or audio file reference",
        "audio coverage is not marked complete without file/id evidence",
        "batch preserves original source cell IDs",
      ],
      judge_checks: [
        "judge checks all grouped signal source gaps are resolved or still open",
        "judge checks no unrelated product behavior changed",
      ],
      anti_fake_checks: [
        "no synthetic audio claims without path/hash/reference",
        "no copied audio payloads in Cell OS artifacts",
      ],
    }));
    batchNumber += 1;
  }

  for (const signal of otherSignals) {
    plans.push(repairPlan(`REPAIR-PLAN-${sha(signal.signal_id).slice(0, 14)}`, {
      rank: 0,
      signals: [signal],
      title: `Resolve ${signal.signal_type} for ${signal.cell_id}`,
      repair_type: signal.signal_type.toLowerCase(),
      expected_product_value: signal.product_value,
      estimated_repair_cost: signal.repair_cost,
      priority_score: signal.priority_score,
      acceptance_checks: ["contract item passes with source-anchored evidence"],
      judge_checks: ["judge verifies referenced evidence exists"],
      anti_fake_checks: ["no unverifiable evidence claim"],
    }));
  }

  plans.sort((a, b) => (b.priority_score - a.priority_score) || a.repair_plan_id.localeCompare(b.repair_plan_id));
  plans.forEach((plan, index) => { plan.rank = index + 1; });
  return plans;
}

function updateTaskCandidates(tasks, signals, repairPlans) {
  const signalByGap = new Map(signals.map((signal) => [signal.source_gap_id, signal]));
  const planBySignal = new Map();
  for (const plan of repairPlans) {
    for (const signalId of plan.grouped_signal_ids) planBySignal.set(signalId, plan);
  }

  return tasks.map((task) => {
    const signal = signalByGap.get(task.gap_id);
    if (!signal) return task;
    const plan = planBySignal.get(signal.signal_id);
    return {
      ...task,
      signal_id: signal.signal_id,
      repair_plan_id: plan?.repair_plan_id,
      trace: {
        ...(task.trace || {}),
        signal_id: signal.signal_id,
        repair_plan_id: plan?.repair_plan_id,
      },
    };
  });
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key]] = (out[row[key]] || 0) + 1;
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

function focusedGitStatus() {
  const result = spawnSync("git", ["status", "--short", "--", "scripts/cell-os", "artifacts/cell-os"], { encoding: "utf8" });
  if (result.status !== 0) return `git status failed: ${result.stderr.trim()}`;
  return result.stdout.trim() || "clean";
}

function validate({ cells, evaluations, gaps, signals, repairPlans, tasks }) {
  const errors = [];
  const cellIds = new Set(cells.map((cell) => cell.cell_id));
  const evalIds = new Set(evaluations.map((evaluation) => evaluation.evaluation_id));
  const failGapIds = new Set(gaps.filter((gap) => gap.status === "FAIL").map((gap) => gap.gap_id));
  const gapIds = new Set(gaps.map((gap) => gap.gap_id));
  const signalIds = new Set(signals.map((signal) => signal.signal_id));
  const signalByGap = new Map(signals.map((signal) => [signal.source_gap_id, signal]));
  const planIds = new Set(repairPlans.map((plan) => plan.repair_plan_id));

  for (const gapId of failGapIds) {
    if (!signalByGap.has(gapId)) errors.push(`FAIL gap ${gapId} has no signal`);
  }

  for (const signal of signals) {
    if (!cellIds.has(signal.cell_id)) errors.push(`${signal.signal_id} references missing cell ${signal.cell_id}`);
    if (!gapIds.has(signal.source_gap_id)) errors.push(`${signal.signal_id} references missing gap ${signal.source_gap_id}`);
    if (!evalIds.has(signal.evaluation_id)) errors.push(`${signal.signal_id} references missing evaluation ${signal.evaluation_id}`);
    if (!ALLOWED_SIGNAL_TYPES.has(signal.signal_type)) errors.push(`${signal.signal_id} has invalid signal_type ${signal.signal_type}`);
    if (!signal.evidence_ref && !signal.missing_evidence_reason) errors.push(`${signal.signal_id} lacks evidence_ref or missing_evidence_reason`);
  }

  for (const plan of repairPlans) {
    if (!plan.grouped_signal_ids?.length) errors.push(`${plan.repair_plan_id} has no signals`);
    for (const signalId of plan.grouped_signal_ids || []) {
      if (!signalIds.has(signalId)) errors.push(`${plan.repair_plan_id} references missing signal ${signalId}`);
    }
    if (!cellIds.has(plan.primary_cell_id)) errors.push(`${plan.repair_plan_id} references missing primary cell ${plan.primary_cell_id}`);
  }

  for (const task of tasks) {
    if (task.gap_id && failGapIds.has(task.gap_id)) {
      if (!task.signal_id || !signalIds.has(task.signal_id)) errors.push(`${task.task_candidate_id} missing valid signal trace`);
      if (!task.repair_plan_id || !planIds.has(task.repair_plan_id)) errors.push(`${task.task_candidate_id} missing valid repair plan trace`);
    }
  }

  return errors;
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(dirname(REPORT_PATH), { recursive: true });

  const cells = readJsonl(join(OUT_DIR, "cells.jsonl"));
  const contracts = readJsonl(join(OUT_DIR, "contracts.jsonl"));
  const evaluations = readJsonl(join(OUT_DIR, "contract_evaluations.jsonl"));
  const gaps = readJsonl(join(OUT_DIR, "gaps.jsonl"));
  const previousTasks = readJsonl(join(OUT_DIR, "task_candidates.jsonl"));
  const previousSnapshot = readJson(join(OUT_DIR, "coverage_snapshot.json"), {});

  const cellsById = new Map(cells.map((cell) => [cell.cell_id, cell]));
  const evaluationsById = new Map(evaluations.map((evaluation) => [evaluation.evaluation_id, evaluation]));
  const failGaps = gaps.filter((gap) => gap.status === "FAIL");
  const signals = failGaps.map((gap) => signalFromGap(gap, cellsById.get(gap.cell_id), evaluationsById.get(gap.evaluation_id)))
    .sort((a, b) => (b.priority_score - a.priority_score) || a.signal_id.localeCompare(b.signal_id));
  const repairPlans = buildRepairPlans(signals);
  const tasks = updateTaskCandidates(previousTasks, signals, repairPlans)
    .sort((a, b) => a.task_candidate_id.localeCompare(b.task_candidate_id));
  const validationErrors = validate({ cells, evaluations, gaps, signals, repairPlans, tasks });
  const signalCountsByType = countBy(signals, "signal_type");
  const topRepairPlans = repairPlans.slice(0, 20);
  const gitStatus = focusedGitStatus();

  const snapshot = {
    ...previousSnapshot,
    overlay_id: "CELL-OS-003",
    previous_overlay_id: previousSnapshot.overlay_id || "CELL-OS-002",
    generated_at: new Date().toISOString(),
    safety: {
      ...(previousSnapshot.safety || {}),
      read_only_overlay: true,
      runtime_behavior_modified: false,
      product_db_modified: false,
      learner_db_modified: false,
      deploy_push_merge: false,
      signals_are_diagnostic_only: true,
    },
    counts: {
      ...(previousSnapshot.counts || {}),
      cells: cells.length,
      contracts: contracts.length,
      contract_evaluations: evaluations.length,
      gaps: gaps.length,
      task_candidates: tasks.length,
      cell_signals: signals.length,
      repair_plans: repairPlans.length,
      signal_counts_by_type: signalCountsByType,
    },
    intelligence_signals: {
      id: "CELL-OS-003",
      ranking_formula: "priority_score = severity_weight + product_value + dependency_impact - repair_cost",
      signal_path: "artifacts/cell-os/cell_signals.jsonl",
      repair_plan_path: "artifacts/cell-os/repair_plan.jsonl",
      required_priority_behavior: {
        runtime_proof_gap_above_concept_audio_gaps: repairPlans[0]?.repair_type === "production_proof_evidence",
        concept_audio_grouped_into_batches: repairPlans.filter((plan) => plan.repair_type === "audio_evidence_batch").length,
      },
      top_20_repair_plans: topRepairPlans,
    },
    validation: {
      ...(previousSnapshot.validation || {}),
      json_parse_clean: validationErrors.length === 0,
      every_fail_gap_has_signal: failGaps.every((gap) => signals.some((signal) => signal.source_gap_id === gap.gap_id)),
      every_repair_plan_references_valid_signal_ids: validationErrors.filter((error) => error.includes("references missing signal")).length === 0,
      every_grouped_signal_references_valid_gap_cell_contract_evaluation: validationErrors.filter((error) => error.includes("references missing cell") || error.includes("references missing gap") || error.includes("references missing evaluation")).length === 0,
      task_candidates_include_signal_repair_plan_trace: validationErrors.filter((error) => error.includes("missing valid signal trace") || error.includes("missing valid repair plan trace")).length === 0,
      no_orphan_signals: validationErrors.filter((error) => error.startsWith("SIGNAL-")).length === 0,
      no_orphan_repair_plans: validationErrors.filter((error) => error.startsWith("REPAIR-PLAN-")).length === 0,
      errors: validationErrors,
    },
  };

  writeJsonl(join(OUT_DIR, "cell_signals.jsonl"), signals);
  writeJsonl(join(OUT_DIR, "repair_plan.jsonl"), repairPlans);
  writeFileSync(join(OUT_DIR, "coverage_snapshot.json"), JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  writeJsonl(join(OUT_DIR, "task_candidates.jsonl"), tasks);

  const report = [
    "# CELL-OS-003 Cell Intelligence Signals Report",
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
    "- Cell signals are diagnostic only and do not modify Cells directly.",
    "- No large evidence copied; outputs store only path/hash/reference fields.",
    "",
    "## Outputs",
    "",
    "- artifacts/cell-os/cell_signals.jsonl",
    "- artifacts/cell-os/repair_plan.jsonl",
    "- artifacts/cell-os/coverage_snapshot.json",
    "- artifacts/cell-os/task_candidates.jsonl",
    "",
    "## Counts",
    "",
    `- cells: ${cells.length}`,
    `- contracts: ${contracts.length}`,
    `- contract evaluations: ${evaluations.length}`,
    `- FAIL gaps: ${failGaps.length}`,
    `- cell signals: ${signals.length}`,
    `- repair plans: ${repairPlans.length}`,
    `- task candidates: ${tasks.length}`,
    "",
    "## Signal Counts By Type",
    "",
    ...Object.entries(signalCountsByType).map(([type, count]) => `- ${type}: ${count}`),
    "",
    "## Top 20 Repair Plans By Priority",
    "",
    ...topRepairPlans.map((plan) => `- rank ${plan.rank}: ${plan.repair_plan_id} score=${plan.priority_score} type=${plan.repair_type} signals=${plan.grouped_signal_ids.length} title=${plan.title}`),
    "",
    "## Validation",
    "",
    `- JSON/JSONL parse cleanly: ${validationErrors.length === 0 ? "yes" : "no"}`,
    `- every FAIL gap has at least one signal: ${snapshot.validation.every_fail_gap_has_signal ? "yes" : "no"}`,
    `- every repair plan references valid signal IDs: ${snapshot.validation.every_repair_plan_references_valid_signal_ids ? "yes" : "no"}`,
    `- every grouped signal references valid gap/cell/contract/evaluation: ${snapshot.validation.every_grouped_signal_references_valid_gap_cell_contract_evaluation ? "yes" : "no"}`,
    `- task_candidates include signal/repair-plan trace where applicable: ${snapshot.validation.task_candidates_include_signal_repair_plan_trace ? "yes" : "no"}`,
    `- no orphan signals: ${snapshot.validation.no_orphan_signals ? "yes" : "no"}`,
    `- no orphan repair plans: ${snapshot.validation.no_orphan_repair_plans ? "yes" : "no"}`,
    `- runtime proof gap ranks above concept-audio gaps: ${snapshot.intelligence_signals.required_priority_behavior.runtime_proof_gap_above_concept_audio_gaps ? "yes" : "no"}`,
    `- concept-audio missing evidence grouped into repair batches: ${snapshot.intelligence_signals.required_priority_behavior.concept_audio_grouped_into_batches}`,
    ...(validationErrors.length ? ["", "## Validation Errors", "", ...validationErrors.map((error) => `- ${error}`)] : []),
    "",
    "## Trace Contract",
    "",
    "`Cell ID -> Contract -> Contract Item -> Evaluation -> Gap -> Signal -> Repair Plan`",
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

if (!existsSync(join(OUT_DIR, "contract_evaluations.jsonl"))) {
  throw new Error("Missing CELL-OS-002 contract evaluations. Run build-contract-engine first.");
}

main();
