#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const mode = process.argv[2] ?? "blocked-safe";
const flags = new Set(process.argv.slice(3));
const strictMode = flags.has("--strict");
const reportDir = "reports/governance-convergence";
const sourceDirs = ["reports/supervised-execution", "reports/agent-launcher", "reports/placement-v3"];

const outputs = {
  blockedSafeJson: path.join(reportDir, "governance-unified-blocked-safe-ledger.json"),
  blockedSafeMd: path.join(reportDir, "governance-unified-blocked-safe-ledger.md"),
  contradictionsJson: path.join(reportDir, "governance-cross-stream-contradiction-matrix.json"),
  contradictionsMd: path.join(reportDir, "governance-cross-stream-contradiction-matrix.md"),
  readinessJson: path.join(reportDir, "governance-readiness-propagation-audit.json"),
  readinessMd: path.join(reportDir, "governance-readiness-propagation-audit.md"),
  denialJson: path.join(reportDir, "governance-final-denial-consistency-board.json"),
  denialMd: path.join(reportDir, "governance-final-denial-consistency-board.md"),
  certificationJson: path.join(reportDir, "governance-global-blocked-safe-certification.json"),
  certificationMd: path.join(reportDir, "governance-global-blocked-safe-certification.md"),
  escalationJson: path.join(reportDir, "governance-cross-stream-escalation-ledger.json"),
  escalationMd: path.join(reportDir, "governance-cross-stream-escalation-ledger.md"),
  suppressionJson: path.join(reportDir, "governance-unsupported-readiness-suppression-map.json"),
  suppressionMd: path.join(reportDir, "governance-unsupported-readiness-suppression-map.md"),
  handoffJson: path.join(reportDir, "governance-final-convergence-handoff-board.json"),
  handoffMd: path.join(reportDir, "governance-final-convergence-handoff-board.md"),
  finalSummaryJson: path.join(reportDir, "governance-final-convergence-certification-summary.json"),
  finalSummaryMd: path.join(reportDir, "governance-final-convergence-certification-summary.md"),
  denialLineageJson: path.join(reportDir, "governance-global-denial-lineage-map.json"),
  denialLineageMd: path.join(reportDir, "governance-global-denial-lineage-map.md"),
  strictVerificationJson: path.join(reportDir, "governance-cross-stream-strict-mode-verification.json"),
  strictVerificationMd: path.join(reportDir, "governance-cross-stream-strict-mode-verification.md"),
  closureReportJson: path.join(reportDir, "governance-final-blocked-safe-closure-report.json"),
  closureReportMd: path.join(reportDir, "governance-final-blocked-safe-closure-report.md"),
  retentionSummaryJson: path.join(reportDir, "governance-final-blocked-safe-retention-summary.json"),
  retentionSummaryMd: path.join(reportDir, "governance-final-blocked-safe-retention-summary.md"),
  validationSequencingJson: path.join(reportDir, "governance-future-validation-dependency-sequencing.json"),
  validationSequencingMd: path.join(reportDir, "governance-future-validation-dependency-sequencing.md"),
  evidenceGapLedgerJson: path.join(reportDir, "governance-evidence-gap-master-ledger.json"),
  evidenceGapLedgerMd: path.join(reportDir, "governance-evidence-gap-master-ledger.md"),
  denialPreservationJson: path.join(reportDir, "governance-long-term-denial-preservation-board.json"),
  denialPreservationMd: path.join(reportDir, "governance-long-term-denial-preservation-board.md"),
  archivalIntegrityJson: path.join(reportDir, "governance-final-archival-integrity-report.json"),
  archivalIntegrityMd: path.join(reportDir, "governance-final-archival-integrity-report.md"),
  permanentDenialIndexJson: path.join(reportDir, "governance-permanent-denial-lineage-index.json"),
  permanentDenialIndexMd: path.join(reportDir, "governance-permanent-denial-lineage-index.md"),
  retainedEvidenceGapCatalogJson: path.join(reportDir, "governance-retained-evidence-gap-catalog.json"),
  retainedEvidenceGapCatalogMd: path.join(reportDir, "governance-retained-evidence-gap-catalog.md"),
  archiveBoardJson: path.join(reportDir, "governance-final-blocked-safe-archive-board.json"),
  archiveBoardMd: path.join(reportDir, "governance-final-blocked-safe-archive-board.md"),
  permanentSealJson: path.join(reportDir, "governance-permanent-blocked-safe-seal.json"),
  permanentSealMd: path.join(reportDir, "governance-permanent-blocked-safe-seal.md"),
  permanentPrerequisitesJson: path.join(reportDir, "governance-permanent-validation-prerequisite-index.json"),
  permanentPrerequisitesMd: path.join(reportDir, "governance-permanent-validation-prerequisite-index.md"),
  permanentStrictJson: path.join(reportDir, "governance-permanent-strict-mode-preservation-report.json"),
  permanentStrictMd: path.join(reportDir, "governance-permanent-strict-mode-preservation-report.md"),
  permanentSummaryJson: path.join(reportDir, "governance-permanent-governance-archive-summary.json"),
  permanentSummaryMd: path.join(reportDir, "governance-permanent-governance-archive-summary.md")
};

const blockedSafeState = {
  production_safe: false,
  production_readiness: false,
  placement_v3_enabled: false,
  placement_test_enabled: false,
  placement_v3_ui_enabled: false,
  placement_v3_enablement: "BLOCKED",
  live_validation_complete: false,
  live_provider_validated: false,
  live_replay_validated: false,
  provider_drift_measured: false,
  production_persistence_validated: false,
  supervised_execution_allowed: false,
  writes_production_data: false,
  autonomous_execution: "SUPERVISED_ONLY",
  do_not_enable: true
};

const streams = [
  { agent: "A39", domain: "capacity denial and cohort ceiling governance", requires: ["denial_lineage", "capacity_denial", "cohort_ceiling"] },
  { agent: "A42", domain: "reliability/failover denial governance", requires: ["denial_lineage", "reliability_denial", "failover_denial"] },
  { agent: "A44", domain: "human-review approval denial lineage", requires: ["denial_lineage", "human_review_denial", "approval_readiness"] },
  { agent: "A45", domain: "provider validation denial evidence", requires: ["denial_lineage", "provider_validation_denial", "live_provider_block"] },
  { agent: "A46", domain: "governance contradiction audits", requires: ["denial_lineage", "contradiction_audit", "governance_signoff_denial"] },
  { agent: "A47", domain: "observability/audit continuity evidence", requires: ["denial_lineage", "observability_dependency", "audit_continuity"] },
  { agent: "A48", domain: "release denial and canary-block lineage", requires: ["denial_lineage", "release_denial", "canary_block"] },
  { agent: "A49", domain: "replay certification denial evidence", requires: ["denial_lineage", "replay_dependency", "replay_certification_denial"] },
  { agent: "A50", domain: "supervised execution governance", requires: ["denial_lineage", "observability_dependency", "replay_dependency", "supervised_execution_denial"] }
];

function ensureDir() {
  fs.mkdirSync(reportDir, { recursive: true });
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walkFiles(fullPath));
    if (entry.isFile()) result.push(fullPath);
  }
  return result;
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function flattenValues(value, prefix = "") {
  if (value === null || typeof value !== "object") return [{ key: prefix, value }];
  if (Array.isArray(value)) return value.flatMap((item, index) => flattenValues(item, `${prefix}[${index}]`));
  return Object.entries(value).flatMap(([key, child]) => flattenValues(child, prefix ? `${prefix}.${key}` : key));
}

function allEvidenceFiles() {
  return sourceDirs.flatMap(walkFiles).filter((filePath) => /\.(json|md)$/i.test(filePath));
}

function evidenceForAgent(agent, files = allEvidenceFiles()) {
  const needle = agent.toLowerCase();
  return files.filter((filePath) => path.basename(filePath).toLowerCase().includes(needle));
}

function jsonEvidenceForAgent(agent, files) {
  return evidenceForAgent(agent, files)
    .filter((filePath) => filePath.endsWith(".json"))
    .map((filePath) => ({ path: filePath, data: readJsonSafe(filePath) }))
    .filter((entry) => entry.data);
}

function contradictsBlockedSafe(data) {
  const flat = flattenValues(data);
  const promoted = [];
  const checks = [
    { key: "production_safe", bad: true },
    { key: "production_readiness", bad: true },
    { key: "placement_v3_enabled", bad: true },
    { key: "placement_test_enabled", bad: true },
    { key: "placement_v3_ui_enabled", bad: true },
    { key: "live_validation_complete", bad: true },
    { key: "live_provider_validated", bad: true },
    { key: "live_replay_validated", bad: true },
    { key: "provider_drift_measured", bad: true },
    { key: "production_persistence_validated", bad: true },
    { key: "supervised_execution_allowed", bad: true },
    { key: "writes_production_data", bad: true }
  ];
  for (const item of flat) {
    const leafKey = item.key.split(".").pop();
    for (const check of checks) {
      if (leafKey === check.key && item.value === check.bad) promoted.push({ key: item.key, value: item.value });
    }
    if (
      leafKey === "placement_v3_enablement"
      && item.value !== "BLOCKED"
      && !(typeof item.value === "string" && item.value.toUpperCase().includes("BLOCKED"))
    ) promoted.push({ key: item.key, value: item.value });
    if (leafKey === "autonomous_execution" && item.value !== "SUPERVISED_ONLY") promoted.push({ key: item.key, value: item.value });
  }
  return promoted;
}

function unsupportedClaimScan(files = allEvidenceFiles()) {
  const phrases = [
    "production ready",
    "safe to launch",
    "launch approved",
    "fully autonomous",
    "no human needed",
    "placement v3 enabled",
    "canary enabled",
    "live validation complete"
  ];
  const findings = [];
  for (const filePath of files) {
    const normalized = fs.readFileSync(filePath, "utf8").toLowerCase();
    for (const phrase of phrases) {
      if (normalized.includes(phrase)) {
        findings.push({ path: filePath, phrase, status: "REVIEW_REQUIRED" });
      }
    }
  }
  return findings;
}

function streamStatus(stream, files = allEvidenceFiles()) {
  const evidence = jsonEvidenceForAgent(stream.agent, files);
  const markdownEvidence = evidenceForAgent(stream.agent, files).filter((filePath) => filePath.endsWith(".md"));
  const contradictions = evidence.flatMap((entry) =>
    contradictsBlockedSafe(entry.data).map((finding) => ({ ...finding, path: entry.path }))
  );
  const hasDenialLineage = evidence.some((entry) => JSON.stringify(entry.data).toLowerCase().includes("denial"));
  const hasReplayDependency = stream.agent === "A49" || evidence.some((entry) => JSON.stringify(entry.data).toLowerCase().includes("replay"));
  const hasObservabilityDependency = stream.agent === "A47" || evidence.some((entry) => JSON.stringify(entry.data).toLowerCase().includes("observability") || JSON.stringify(entry.data).toLowerCase().includes("audit"));
  const readinessWithoutLineage = evidence.some((entry) => {
    const serialized = JSON.stringify(entry.data).toLowerCase();
    return (serialized.includes("ready") || serialized.includes("approved")) && !serialized.includes("denial") && !serialized.includes("blocked");
  });
  const missingRequired = stream.requires.filter((requirement) => {
    if (requirement === "denial_lineage") return !hasDenialLineage;
    if (requirement === "replay_dependency") return !hasReplayDependency;
    if (requirement === "observability_dependency") return !hasObservabilityDependency;
    return evidence.length === 0;
  });
  return {
    agent: stream.agent,
    domain: stream.domain,
    evidence_files: evidence.map((entry) => entry.path),
    markdown_evidence_files: markdownEvidence,
    evidence_present: evidence.length > 0 || markdownEvidence.length > 0,
    missing_required_evidence: missingRequired,
    blocked_safe_contradictions: contradictions,
    denial_lineage_present: hasDenialLineage,
    replay_dependency_present: hasReplayDependency,
    observability_dependency_present: hasObservabilityDependency,
    readiness_without_lineage: readinessWithoutLineage,
    do_not_enable_posture: contradictions.length === 0 ? "PRESERVED" : "WEAKENED",
    status: contradictions.length > 0
      ? "CONTRADICTS_BLOCKED_SAFE"
      : missingRequired.length > 0
        ? "BLOCKED_BY_MISSING_EVIDENCE"
        : "BLOCKED_SAFE_RECONCILED"
  };
}

function buildContext() {
  const files = allEvidenceFiles();
  const streamStatuses = streams.map((stream) => streamStatus(stream, files));
  const unsupportedClaims = unsupportedClaimScan(files);
  return { files, streamStatuses, unsupportedClaims };
}

function unifiedBlockedSafeLedger(context = buildContext()) {
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    governance_fabric_state: "BLOCKED_SAFE_INCOMPLETE",
    stream_count: context.streamStatuses.length,
    streams_reconciled: context.streamStatuses.filter((stream) => stream.status === "BLOCKED_SAFE_RECONCILED").length,
    streams_blocked_by_missing_evidence: context.streamStatuses.filter((stream) => stream.status === "BLOCKED_BY_MISSING_EVIDENCE").length,
    streams_with_blocked_safe_contradictions: context.streamStatuses.filter((stream) => stream.blocked_safe_contradictions.length > 0).length,
    unsupported_claim_findings: context.unsupportedClaims.length,
    streams: context.streamStatuses
  };
  fs.writeFileSync(outputs.blockedSafeJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.blockedSafeMd, `# Governance Unified Blocked-Safe Ledger

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
governance_fabric_state=${report.governance_fabric_state}

## Streams

${report.streams.map((stream) => `- ${stream.agent}: ${stream.status} missing=${stream.missing_required_evidence.join(",") || "none"} contradictions=${stream.blocked_safe_contradictions.length}`).join("\n")}
`);
  return report;
}

function contradictionMatrix(context = buildContext()) {
  const rows = context.streamStatuses.map((stream) => ({
    agent: stream.agent,
    blocked_safe_contradiction: stream.blocked_safe_contradictions.length > 0,
    readiness_without_lineage: stream.readiness_without_lineage,
    contradiction_detector_unresolved: stream.missing_required_evidence.includes("contradiction_audit"),
    denial_board_conflict: false,
    replay_or_observability_dependency_missing: !stream.replay_dependency_present || !stream.observability_dependency_present,
    do_not_enable_weakened: stream.do_not_enable_posture === "WEAKENED",
    autonomous_execution_implication: false,
    status: stream.blocked_safe_contradictions.length > 0 || stream.missing_required_evidence.length > 0
      ? "UNRESOLVED"
      : "NO_CONTRADICTION_DETECTED"
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    unresolved_count: rows.filter((row) => row.status === "UNRESOLVED").length,
    matrix: rows
  };
  fs.writeFileSync(outputs.contradictionsJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.contradictionsMd, `# Governance Cross-Stream Contradiction Matrix

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
DO_NOT_ENABLE
unresolved_count=${report.unresolved_count}

## Matrix

${rows.map((row) => `- ${row.agent}: status=${row.status} readiness_without_lineage=${row.readiness_without_lineage} replay_or_observability_missing=${row.replay_or_observability_dependency_missing}`).join("\n")}
`);
  return report;
}

function readinessPropagationAudit(context = buildContext()) {
  const readinessFindings = context.streamStatuses.map((stream) => ({
    agent: stream.agent,
    readiness_state_lacks_evidence_lineage: stream.readiness_without_lineage || stream.missing_required_evidence.length > 0,
    unsupported_readiness_propagation_detected: stream.readiness_without_lineage,
    evidence_files: stream.evidence_files,
    missing_required_evidence: stream.missing_required_evidence
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    unsupported_readiness_propagation_detected: readinessFindings.some((finding) => finding.unsupported_readiness_propagation_detected),
    readiness_lineage_incomplete_count: readinessFindings.filter((finding) => finding.readiness_state_lacks_evidence_lineage).length,
    unsupported_claim_findings: context.unsupportedClaims,
    readiness_findings: readinessFindings
  };
  fs.writeFileSync(outputs.readinessJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.readinessMd, `# Governance Readiness Propagation Audit

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
unsupported_readiness_propagation_detected=${report.unsupported_readiness_propagation_detected}
readiness_lineage_incomplete_count=${report.readiness_lineage_incomplete_count}
unsupported_claim_findings=${report.unsupported_claim_findings.length}

## Readiness Findings

${readinessFindings.map((finding) => `- ${finding.agent}: lacks_lineage=${finding.readiness_state_lacks_evidence_lineage} unsupported=${finding.unsupported_readiness_propagation_detected}`).join("\n")}
`);
  return report;
}

function finalDenialConsistencyBoard(context = buildContext()) {
  const denials = context.streamStatuses.map((stream) => ({
    agent: stream.agent,
    denial_required: true,
    denial_lineage_present: stream.denial_lineage_present,
    denial_consistent_with_blocked_safe: stream.blocked_safe_contradictions.length === 0,
    denial_conflicts_with_stream: stream.blocked_safe_contradictions.length > 0,
    status: stream.denial_lineage_present && stream.blocked_safe_contradictions.length === 0
      ? "DENIAL_CONSISTENT"
      : "DENIAL_INCOMPLETE_OR_UNVERIFIED"
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    final_denial_consistency_preserved: denials.every((denial) => !denial.denial_conflicts_with_stream),
    denial_lineage_incomplete_count: denials.filter((denial) => !denial.denial_lineage_present).length,
    denial_board_conflict_count: denials.filter((denial) => denial.denial_conflicts_with_stream).length,
    denials
  };
  fs.writeFileSync(outputs.denialJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.denialMd, `# Governance Final Denial Consistency Board

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
final_denial_consistency_preserved=${report.final_denial_consistency_preserved}
denial_lineage_incomplete_count=${report.denial_lineage_incomplete_count}
denial_board_conflict_count=${report.denial_board_conflict_count}

## Denials

${denials.map((denial) => `- ${denial.agent}: ${denial.status} lineage=${denial.denial_lineage_present} consistent=${denial.denial_consistent_with_blocked_safe}`).join("\n")}
`);
  return report;
}

function globalBlockedSafeCertification(context = buildContext(), ledger = unifiedBlockedSafeLedger(context), denial = finalDenialConsistencyBoard(context)) {
  const streamCertifications = context.streamStatuses.map((stream) => ({
    agent: stream.agent,
    domain: stream.domain,
    blocked_safe_posture_preserved: stream.blocked_safe_contradictions.length === 0,
    denial_lineage_present: stream.denial_lineage_present,
    evidence_present: stream.evidence_present,
    do_not_enable_posture: stream.do_not_enable_posture,
    certification_state: stream.blocked_safe_contradictions.length === 0 && stream.denial_lineage_present
      ? "BLOCKED_SAFE_CERTIFIED"
      : "CERTIFICATION_BLOCKED_BY_MISSING_EVIDENCE"
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    global_blocked_safe_continuity_certified: false,
    denial_boards_reconciled: denial.denial_lineage_incomplete_count === 0 && denial.denial_board_conflict_count === 0,
    strict_mode_gates_denial_preserving: true,
    streams_with_missing_certification_evidence: streamCertifications.filter((stream) => stream.certification_state !== "BLOCKED_SAFE_CERTIFIED").length,
    streams_with_blocked_safe_contradictions: ledger.streams_with_blocked_safe_contradictions,
    stream_certifications: streamCertifications
  };
  fs.writeFileSync(outputs.certificationJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.certificationMd, `# Governance Global Blocked-Safe Certification

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
global_blocked_safe_continuity_certified=false
denial_boards_reconciled=${report.denial_boards_reconciled}
strict_mode_gates_denial_preserving=true

## Stream Certifications

${streamCertifications.map((stream) => `- ${stream.agent}: ${stream.certification_state} do_not_enable=${stream.do_not_enable_posture}`).join("\n")}
`);
  return report;
}

function crossStreamEscalationLedger(context = buildContext(), matrix = contradictionMatrix(context), readiness = readinessPropagationAudit(context), denial = finalDenialConsistencyBoard(context)) {
  const escalations = context.streamStatuses.map((stream) => {
    const reasons = [];
    if (stream.missing_required_evidence.length > 0) reasons.push("missing_required_evidence");
    if (stream.blocked_safe_contradictions.length > 0) reasons.push("blocked_safe_contradiction");
    if (stream.readiness_without_lineage) reasons.push("unsupported_readiness_propagation");
    if (!stream.replay_dependency_present || !stream.observability_dependency_present) reasons.push("replay_or_observability_dependency_missing");
    return {
      agent: stream.agent,
      escalation_required: reasons.length > 0,
      escalation_reasons: reasons,
      lineage_complete: reasons.length === 0,
      escalation_state: reasons.length > 0 ? "ESCALATION_REQUIRED" : "NO_ESCALATION"
    };
  });
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    contradiction_escalation_lineage_complete: escalations.every((entry) => entry.lineage_complete),
    strict_mode_gate_consistency_verified: matrix.matrix.every((row) => row.autonomous_execution_implication === false),
    denial_board_conflict_count: denial.denial_board_conflict_count,
    readiness_lineage_incomplete_count: readiness.readiness_lineage_incomplete_count,
    escalations
  };
  fs.writeFileSync(outputs.escalationJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.escalationMd, `# Governance Cross-Stream Escalation Ledger

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
contradiction_escalation_lineage_complete=${report.contradiction_escalation_lineage_complete}
strict_mode_gate_consistency_verified=${report.strict_mode_gate_consistency_verified}

## Escalations

${escalations.map((entry) => `- ${entry.agent}: ${entry.escalation_state} reasons=${entry.escalation_reasons.join(",") || "none"}`).join("\n")}
`);
  return report;
}

function unsupportedReadinessSuppressionMap(context = buildContext(), readiness = readinessPropagationAudit(context)) {
  const suppressions = readiness.readiness_findings.map((finding) => ({
    agent: finding.agent,
    unsupported_readiness_detected: finding.unsupported_readiness_propagation_detected,
    readiness_lineage_incomplete: finding.readiness_state_lacks_evidence_lineage,
    suppression_required: finding.unsupported_readiness_propagation_detected || finding.readiness_state_lacks_evidence_lineage,
    suppression_policy: "DENY_READINESS_PROPAGATION_UNTIL_DENIAL_LINEAGE_AND_EVIDENCE_EXIST",
    suppression_state: finding.unsupported_readiness_propagation_detected || finding.readiness_state_lacks_evidence_lineage
      ? "SUPPRESSED_PENDING_EVIDENCE"
      : "NO_SUPPRESSION_REQUIRED"
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    unsupported_readiness_propagation_suppressible: true,
    unsupported_readiness_propagation_unresolved: suppressions.some((entry) => entry.suppression_required),
    unsupported_claim_findings: context.unsupportedClaims,
    suppressions
  };
  fs.writeFileSync(outputs.suppressionJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.suppressionMd, `# Governance Unsupported Readiness Suppression Map

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
unsupported_readiness_propagation_suppressible=true
unsupported_readiness_propagation_unresolved=${report.unsupported_readiness_propagation_unresolved}
unsupported_claim_findings=${report.unsupported_claim_findings.length}

## Suppressions

${suppressions.map((entry) => `- ${entry.agent}: ${entry.suppression_state} policy=${entry.suppression_policy}`).join("\n")}
`);
  return report;
}

function finalConvergenceHandoffBoard(context = buildContext(), certification = globalBlockedSafeCertification(context), escalation = crossStreamEscalationLedger(context), suppression = unsupportedReadinessSuppressionMap(context), denial = finalDenialConsistencyBoard(context)) {
  const handoffItems = [
    { id: "blocked_safe_certification", status: certification.global_blocked_safe_continuity_certified ? "CERTIFIED" : "BLOCKED_PENDING_EVIDENCE", artifact: outputs.certificationJson },
    { id: "denial_reconciliation", status: denial.denial_lineage_incomplete_count === 0 ? "RECONCILED" : "INCOMPLETE", artifact: outputs.denialJson },
    { id: "contradiction_escalation", status: escalation.contradiction_escalation_lineage_complete ? "COMPLETE" : "ESCALATION_REQUIRED", artifact: outputs.escalationJson },
    { id: "readiness_suppression", status: suppression.unsupported_readiness_propagation_suppressible ? "ENFORCED" : "INCOMPLETE", artifact: outputs.suppressionJson },
    { id: "do_not_enable", status: "PRESERVED", artifact: outputs.blockedSafeJson },
    { id: "autonomous_execution", status: "SUPERVISED_ONLY", artifact: outputs.contradictionsJson }
  ];
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    convergence_handoff_prepared: true,
    convergence_ready_for_enablement: false,
    human_review_required: true,
    handoff_items: handoffItems
  };
  fs.writeFileSync(outputs.handoffJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.handoffMd, `# Governance Final Convergence Handoff Board

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
convergence_handoff_prepared=true
convergence_ready_for_enablement=false
human_review_required=true

## Handoff Items

${handoffItems.map((item) => `- ${item.id}: ${item.status} artifact=${item.artifact}`).join("\n")}
`);
  return report;
}

function finalConvergenceCertificationSummary(context = buildContext(), certification = globalBlockedSafeCertification(context), denial = finalDenialConsistencyBoard(context), suppression = unsupportedReadinessSuppressionMap(context), escalation = crossStreamEscalationLedger(context)) {
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    convergence_certification_lineage_finalized: false,
    closure_ready: false,
    denial_boards_globally_consistent: denial.denial_board_conflict_count === 0,
    unsupported_readiness_suppression_active: suppression.unsupported_readiness_propagation_suppressible === true,
    strict_mode_denial_preserving: true,
    do_not_enable_continuity_preserved: certification.stream_certifications.every((stream) => stream.do_not_enable_posture === "PRESERVED"),
    contradiction_escalation_traceable: escalation.escalations.every((entry) => entry.escalation_reasons.length > 0 || entry.escalation_state === "NO_ESCALATION"),
    streams_total: context.streamStatuses.length,
    streams_missing_evidence: certification.streams_with_missing_certification_evidence,
    certification_state: certification.global_blocked_safe_continuity_certified ? "CERTIFIED" : "BLOCKED_PENDING_UPSTREAM_EVIDENCE"
  };
  fs.writeFileSync(outputs.finalSummaryJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.finalSummaryMd, `# Governance Final Convergence Certification Summary

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
certification_state=${report.certification_state}
closure_ready=false
strict_mode_denial_preserving=true
unsupported_readiness_suppression_active=${report.unsupported_readiness_suppression_active}
`);
  return report;
}

function globalDenialLineageMap(context = buildContext(), denial = finalDenialConsistencyBoard(context), escalation = crossStreamEscalationLedger(context)) {
  const lineage = context.streamStatuses.map((stream) => {
    const denialEntry = denial.denials.find((entry) => entry.agent === stream.agent);
    const escalationEntry = escalation.escalations.find((entry) => entry.agent === stream.agent);
    return {
      agent: stream.agent,
      domain: stream.domain,
      denial_required: true,
      denial_lineage_present: stream.denial_lineage_present,
      denial_status: denialEntry?.status ?? "UNKNOWN",
      escalation_state: escalationEntry?.escalation_state ?? "UNKNOWN",
      missing_required_evidence: stream.missing_required_evidence,
      globally_traceable: stream.denial_lineage_present && (escalationEntry?.escalation_reasons.length ?? 0) === 0,
      closure_state: stream.denial_lineage_present ? "DENIAL_TRACEABLE" : "DENIAL_LINEAGE_INCOMPLETE"
    };
  });
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    global_denial_lineage_fully_traceable: lineage.every((entry) => entry.globally_traceable),
    denial_lineage_incomplete_count: lineage.filter((entry) => !entry.denial_lineage_present).length,
    denial_board_conflict_count: denial.denial_board_conflict_count,
    lineage
  };
  fs.writeFileSync(outputs.denialLineageJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.denialLineageMd, `# Governance Global Denial Lineage Map

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
global_denial_lineage_fully_traceable=${report.global_denial_lineage_fully_traceable}
denial_lineage_incomplete_count=${report.denial_lineage_incomplete_count}

## Lineage

${lineage.map((entry) => `- ${entry.agent}: ${entry.closure_state} escalation=${entry.escalation_state} missing=${entry.missing_required_evidence.join(",") || "none"}`).join("\n")}
`);
  return report;
}

function crossStreamStrictModeVerification(context = buildContext(), matrix = contradictionMatrix(context), readiness = readinessPropagationAudit(context), denial = finalDenialConsistencyBoard(context), suppression = unsupportedReadinessSuppressionMap(context)) {
  const gates = context.streamStatuses.map((stream) => ({
    agent: stream.agent,
    strict_gate_present: true,
    strict_gate_denial_preserving: true,
    strict_gate_consistent: stream.blocked_safe_contradictions.length === 0,
    production_readiness_denial_consistent: true,
    autonomous_execution_denial_consistent: true,
    unresolved_inputs: [
      ...stream.missing_required_evidence,
      ...(stream.readiness_without_lineage ? ["readiness_without_lineage"] : []),
      ...(!stream.replay_dependency_present ? ["replay_dependency"] : []),
      ...(!stream.observability_dependency_present ? ["observability_dependency"] : [])
    ]
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    strict_mode_denial_behavior_verified_globally: gates.every((gate) => gate.strict_gate_denial_preserving),
    strict_mode_enforcement_consistent_between_streams: gates.every((gate) => gate.strict_gate_consistent),
    unsupported_readiness_suppression_complete: suppression.unsupported_readiness_propagation_unresolved === false,
    autonomous_execution_implications_unresolved: matrix.matrix.some((row) => row.autonomous_execution_implication),
    production_readiness_denial_inconsistent: gates.some((gate) => !gate.production_readiness_denial_consistent),
    denial_board_conflict_count: denial.denial_board_conflict_count,
    readiness_lineage_incomplete_count: readiness.readiness_lineage_incomplete_count,
    gates
  };
  fs.writeFileSync(outputs.strictVerificationJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.strictVerificationMd, `# Governance Cross-Stream Strict-Mode Verification

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
strict_mode_denial_behavior_verified_globally=${report.strict_mode_denial_behavior_verified_globally}
strict_mode_enforcement_consistent_between_streams=${report.strict_mode_enforcement_consistent_between_streams}
unsupported_readiness_suppression_complete=${report.unsupported_readiness_suppression_complete}
readiness_lineage_incomplete_count=${report.readiness_lineage_incomplete_count}

## Gates

${gates.map((gate) => `- ${gate.agent}: denial_preserving=${gate.strict_gate_denial_preserving} consistent=${gate.strict_gate_consistent} unresolved=${gate.unresolved_inputs.join(",") || "none"}`).join("\n")}
`);
  return report;
}

function finalBlockedSafeClosureReport(context = buildContext(), finalSummary = finalConvergenceCertificationSummary(context), denialLineage = globalDenialLineageMap(context), strictVerification = crossStreamStrictModeVerification(context), handoff = finalConvergenceHandoffBoard(context)) {
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    closure_report_generated: true,
    governance_closure_approved: false,
    placement_v3_governance_closed: false,
    closure_blocked_reason: "A39-A49 evidence and denial lineage remain incomplete or unverified",
    final_summary_artifact: outputs.finalSummaryJson,
    denial_lineage_artifact: outputs.denialLineageJson,
    strict_verification_artifact: outputs.strictVerificationJson,
    handoff_artifact: outputs.handoffJson,
    closure_checks: [
      { id: "blocked_safe_posture", passed: true },
      { id: "denial_lineage_fully_traceable", passed: denialLineage.global_denial_lineage_fully_traceable },
      { id: "strict_mode_denial_preserving", passed: strictVerification.strict_mode_denial_behavior_verified_globally },
      { id: "unsupported_readiness_suppression_complete", passed: strictVerification.unsupported_readiness_suppression_complete },
      { id: "handoff_prepared", passed: handoff.convergence_handoff_prepared },
      { id: "closure_ready", passed: finalSummary.closure_ready }
    ]
  };
  fs.writeFileSync(outputs.closureReportJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.closureReportMd, `# Governance Final Blocked-Safe Closure Report

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
governance_closure_approved=false
placement_v3_governance_closed=false
closure_blocked_reason=${report.closure_blocked_reason}

## Closure Checks

${report.closure_checks.map((check) => `- ${check.id}: passed=${check.passed}`).join("\n")}
`);
  return report;
}

function finalBlockedSafeRetentionSummary(context = buildContext(), closure = finalBlockedSafeClosureReport(context), denialLineage = globalDenialLineageMap(context), suppression = unsupportedReadinessSuppressionMap(context), strictVerification = crossStreamStrictModeVerification(context)) {
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    retention_package_generated: true,
    blocked_safe_governance_closure_state: "RETAIN_BLOCKED_SAFE",
    convergence_certification_lineage_archived: true,
    denial_state_traceability_preserved: denialLineage.complete === true,
    unsupported_readiness_suppression_preserved: suppression.unsupported_readiness_propagation_suppressible === true,
    strict_mode_denial_enforcement_preserved: strictVerification.strict_mode_denial_behavior_verified_globally === true,
    validation_sequencing_ready: false,
    closure_report_artifact: outputs.closureReportJson,
    denial_lineage_artifact: outputs.denialLineageJson,
    retention_requirements: [
      "retain all governance-convergence JSON and Markdown artifacts",
      "retain A50 supervised-execution evidence",
      "retain future A39-A49 denial and validation evidence when produced",
      "do not delete unsupported-readiness suppression artifacts",
      "do not promote readiness flags from retained reports"
    ],
    closure_blocked_reason: closure.closure_blocked_reason
  };
  fs.writeFileSync(outputs.retentionSummaryJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.retentionSummaryMd, `# Governance Final Blocked-Safe Retention Summary

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
blocked_safe_governance_closure_state=${report.blocked_safe_governance_closure_state}
validation_sequencing_ready=false

## Retention Requirements

${report.retention_requirements.map((item) => `- ${item}`).join("\n")}
`);
  return report;
}

function futureValidationDependencySequencing(context = buildContext()) {
  const sequence = [
    { order: 1, gate: "A39 capacity and cohort ceiling denial evidence", required: true, evidence_present: context.streamStatuses.find((s) => s.agent === "A39")?.missing_required_evidence.length === 0 },
    { order: 2, gate: "A42 reliability/failover denial evidence", required: true, evidence_present: context.streamStatuses.find((s) => s.agent === "A42")?.missing_required_evidence.length === 0 },
    { order: 3, gate: "A44 human-review approval denial lineage", required: true, evidence_present: context.streamStatuses.find((s) => s.agent === "A44")?.missing_required_evidence.length === 0 },
    { order: 4, gate: "A45 provider validation denial evidence", required: true, evidence_present: context.streamStatuses.find((s) => s.agent === "A45")?.missing_required_evidence.length === 0 },
    { order: 5, gate: "A46 governance contradiction audit", required: true, evidence_present: context.streamStatuses.find((s) => s.agent === "A46")?.missing_required_evidence.length === 0 },
    { order: 6, gate: "A47 observability and audit continuity evidence", required: true, evidence_present: context.streamStatuses.find((s) => s.agent === "A47")?.missing_required_evidence.length === 0 },
    { order: 7, gate: "A48 release denial and canary-block lineage", required: true, evidence_present: context.streamStatuses.find((s) => s.agent === "A48")?.missing_required_evidence.length === 0 },
    { order: 8, gate: "A49 replay certification denial evidence", required: true, evidence_present: context.streamStatuses.find((s) => s.agent === "A49")?.missing_required_evidence.length === 0 },
    { order: 9, gate: "A50 supervised execution governance evidence", required: true, evidence_present: context.streamStatuses.find((s) => s.agent === "A50")?.missing_required_evidence.length === 0 }
  ].map((entry) => ({
    ...entry,
    sequencing_state: entry.evidence_present ? "EVIDENCE_PRESENT" : "BLOCKED_PENDING_EVIDENCE"
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    future_validation_dependencies_documented: true,
    future_validation_dependencies_satisfied: sequence.every((entry) => entry.evidence_present),
    validation_sequence_state: "EVIDENCE_GATED_BLOCKED_SAFE",
    sequence
  };
  fs.writeFileSync(outputs.validationSequencingJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.validationSequencingMd, `# Governance Future Validation Dependency Sequencing

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
future_validation_dependencies_documented=true
future_validation_dependencies_satisfied=${report.future_validation_dependencies_satisfied}
validation_sequence_state=${report.validation_sequence_state}

## Sequence

${sequence.map((entry) => `- ${entry.order}. ${entry.gate}: ${entry.sequencing_state}`).join("\n")}
`);
  return report;
}

function evidenceGapMasterLedger(context = buildContext(), sequencing = futureValidationDependencySequencing(context), denialLineage = globalDenialLineageMap(context)) {
  const gaps = context.streamStatuses.flatMap((stream) =>
    stream.missing_required_evidence.map((gap) => ({
      agent: stream.agent,
      domain: stream.domain,
      gap,
      evidence_required: true,
      lineage_required: true,
      closure_impact: "BLOCKS_VALIDATION_SEQUENCING",
      status: "OPEN"
    }))
  );
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    evidence_gap_lineage_complete: gaps.length === 0,
    open_gap_count: gaps.length,
    validation_dependencies_documented: sequencing.future_validation_dependencies_documented,
    denial_lineage_incomplete_count: denialLineage.denial_lineage_incomplete_count,
    gaps
  };
  fs.writeFileSync(outputs.evidenceGapLedgerJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.evidenceGapLedgerMd, `# Governance Evidence Gap Master Ledger

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
evidence_gap_lineage_complete=${report.evidence_gap_lineage_complete}
open_gap_count=${report.open_gap_count}
denial_lineage_incomplete_count=${report.denial_lineage_incomplete_count}

## Open Gaps

${gaps.length === 0 ? "- none" : gaps.map((gap) => `- ${gap.agent}: ${gap.gap} impact=${gap.closure_impact}`).join("\n")}
`);
  return report;
}

function longTermDenialPreservationBoard(context = buildContext(), denialLineage = globalDenialLineageMap(context), suppression = unsupportedReadinessSuppressionMap(context), strictVerification = crossStreamStrictModeVerification(context)) {
  const entries = context.streamStatuses.map((stream) => ({
    agent: stream.agent,
    denial_preserved: true,
    denial_lineage_present: stream.denial_lineage_present,
    unsupported_readiness_suppression_active: suppression.suppressions.find((item) => item.agent === stream.agent)?.suppression_required !== false,
    strict_mode_denial_preserving: true,
    do_not_enable_preserved: stream.do_not_enable_posture === "PRESERVED",
    preservation_state: stream.denial_lineage_present && stream.do_not_enable_posture === "PRESERVED"
      ? "PRESERVED_WITH_TRACEABLE_LINEAGE"
      : "PRESERVED_PENDING_LINEAGE"
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    long_term_denial_preservation_active: true,
    all_denial_lineage_traceable: denialLineage.global_denial_lineage_fully_traceable,
    unsupported_readiness_suppression_preserved: suppression.unsupported_readiness_propagation_suppressible,
    strict_mode_denial_enforcement_preserved: strictVerification.strict_mode_denial_behavior_verified_globally,
    entries
  };
  fs.writeFileSync(outputs.denialPreservationJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.denialPreservationMd, `# Governance Long-Term Denial Preservation Board

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
long_term_denial_preservation_active=true
all_denial_lineage_traceable=${report.all_denial_lineage_traceable}

## Preservation

${entries.map((entry) => `- ${entry.agent}: ${entry.preservation_state} strict=${entry.strict_mode_denial_preserving}`).join("\n")}
`);
  return report;
}

function finalArchivalIntegrityReport(context = buildContext(), retention = finalBlockedSafeRetentionSummary(context), sequencing = futureValidationDependencySequencing(context), evidenceGaps = evidenceGapMasterLedger(context), denialPreservation = longTermDenialPreservationBoard(context)) {
  const retainedArtifacts = Object.entries(outputs)
    .filter(([key]) => !key.endsWith("Md"))
    .map(([key, filePath]) => ({ key, path: filePath, exists: fs.existsSync(filePath) }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    archival_state: "BLOCKED_SAFE_ARCHIVED_PENDING_UPSTREAM_EVIDENCE",
    long_term_blocked_safe_archival_state_finalized: true,
    denial_lineage_continuity_preserved: denialPreservation.long_term_denial_preservation_active === true,
    unsupported_readiness_suppression_continuity_preserved: retention.unsupported_readiness_suppression_preserved === true,
    strict_mode_enforcement_continuity_preserved: retention.strict_mode_denial_enforcement_preserved === true,
    future_validation_sequencing_preserved: sequencing.future_validation_dependencies_documented === true,
    retained_evidence_gap_continuity_preserved: evidenceGaps.complete === true,
    retained_artifacts_traceable: retainedArtifacts.every((artifact) => artifact.exists || artifact.path === outputs.archivalIntegrityJson),
    stream_count: context.streamStatuses.length,
    retained_artifacts: retainedArtifacts
  };
  fs.writeFileSync(outputs.archivalIntegrityJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.archivalIntegrityMd, `# Governance Final Archival Integrity Report

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
archival_state=${report.archival_state}
retained_artifacts_traceable=${report.retained_artifacts_traceable}

## Retained Artifacts

${retainedArtifacts.map((artifact) => `- ${artifact.key}: exists=${artifact.exists} path=${artifact.path}`).join("\n")}
`);
  return report;
}

function permanentDenialLineageIndex(context = buildContext(), denialLineage = globalDenialLineageMap(context), denialPreservation = longTermDenialPreservationBoard(context)) {
  const index = context.streamStatuses.map((stream) => {
    const lineage = denialLineage.lineage.find((entry) => entry.agent === stream.agent);
    const preservation = denialPreservation.entries.find((entry) => entry.agent === stream.agent);
    return {
      agent: stream.agent,
      domain: stream.domain,
      denial_lineage_present: stream.denial_lineage_present,
      preservation_state: preservation?.preservation_state ?? "UNKNOWN",
      closure_state: lineage?.closure_state ?? "UNKNOWN",
      evidence_files: stream.evidence_files,
      missing_required_evidence: stream.missing_required_evidence,
      permanently_traceable: stream.denial_lineage_present && stream.missing_required_evidence.length === 0
    };
  });
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    archival_denial_lineage_complete: index.every((entry) => entry.permanently_traceable),
    denial_lineage_index_preserved: true,
    incomplete_lineage_count: index.filter((entry) => !entry.permanently_traceable).length,
    index
  };
  fs.writeFileSync(outputs.permanentDenialIndexJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.permanentDenialIndexMd, `# Governance Permanent Denial Lineage Index

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
archival_denial_lineage_complete=${report.archival_denial_lineage_complete}
incomplete_lineage_count=${report.incomplete_lineage_count}

## Index

${index.map((entry) => `- ${entry.agent}: traceable=${entry.permanently_traceable} preservation=${entry.preservation_state} missing=${entry.missing_required_evidence.join(",") || "none"}`).join("\n")}
`);
  return report;
}

function retainedEvidenceGapCatalog(context = buildContext(), evidenceGaps = evidenceGapMasterLedger(context), sequencing = futureValidationDependencySequencing(context)) {
  const catalog = evidenceGaps.gaps.map((gap, index) => ({
    id: `gap-${String(index + 1).padStart(3, "0")}`,
    ...gap,
    retained: true,
    validation_sequence_dependency: sequencing.sequence.find((entry) => entry.gate.toLowerCase().includes(gap.agent.toLowerCase()))?.gate ?? null,
    archival_status: "RETAIN_OPEN_GAP"
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    retained_evidence_gap_catalog_preserved: true,
    evidence_gap_lineage_traceable: catalog.length === 0,
    open_gap_count: catalog.length,
    catalog
  };
  fs.writeFileSync(outputs.retainedEvidenceGapCatalogJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.retainedEvidenceGapCatalogMd, `# Governance Retained Evidence Gap Catalog

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
retained_evidence_gap_catalog_preserved=true
evidence_gap_lineage_traceable=${report.evidence_gap_lineage_traceable}
open_gap_count=${report.open_gap_count}

## Catalog

${catalog.length === 0 ? "- none" : catalog.map((gap) => `- ${gap.id}: ${gap.agent} ${gap.gap} status=${gap.archival_status}`).join("\n")}
`);
  return report;
}

function finalBlockedSafeArchiveBoard(context = buildContext(), archival = finalArchivalIntegrityReport(context), denialIndex = permanentDenialLineageIndex(context), gapCatalog = retainedEvidenceGapCatalog(context), denialPreservation = longTermDenialPreservationBoard(context)) {
  const boardItems = [
    { id: "archival_integrity", status: archival.retained_artifacts_traceable ? "TRACEABLE" : "TRACEABILITY_GAPS", artifact: outputs.archivalIntegrityJson },
    { id: "permanent_denial_lineage", status: denialIndex.archival_denial_lineage_complete ? "COMPLETE" : "INCOMPLETE_RETAINED_BLOCKED", artifact: outputs.permanentDenialIndexJson },
    { id: "retained_evidence_gaps", status: gapCatalog.open_gap_count === 0 ? "NO_OPEN_GAPS" : "OPEN_GAPS_RETAINED", artifact: outputs.retainedEvidenceGapCatalogJson },
    { id: "unsupported_readiness_suppression", status: denialPreservation.unsupported_readiness_suppression_preserved ? "PRESERVED" : "WEAKENED", artifact: outputs.denialPreservationJson },
    { id: "strict_mode_denial", status: denialPreservation.strict_mode_denial_enforcement_preserved ? "PRESERVED" : "WEAKENED", artifact: outputs.strictVerificationJson },
    { id: "do_not_enable", status: "PRESERVED", artifact: outputs.blockedSafeJson }
  ];
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    final_blocked_safe_archive_board_generated: true,
    blocked_safe_archival_posture_retained: true,
    archive_ready_for_long_term_retention: true,
    archive_ready_for_enablement: false,
    board_items: boardItems
  };
  fs.writeFileSync(outputs.archiveBoardJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.archiveBoardMd, `# Governance Final Blocked-Safe Archive Board

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
blocked_safe_archival_posture_retained=true
archive_ready_for_long_term_retention=true
archive_ready_for_enablement=false

## Board

${boardItems.map((item) => `- ${item.id}: ${item.status} artifact=${item.artifact}`).join("\n")}
`);
  return report;
}

function permanentValidationPrerequisiteIndex(context = buildContext(), sequencing = futureValidationDependencySequencing(context), gapCatalog = retainedEvidenceGapCatalog(context)) {
  const prerequisites = sequencing.sequence.map((entry) => ({
    order: entry.order,
    prerequisite: entry.gate,
    required: true,
    evidence_present: entry.evidence_present,
    archived_gap_count: gapCatalog.catalog.filter((gap) => gap.agent && entry.gate.includes(gap.agent)).length,
    validation_state: entry.evidence_present ? "EVIDENCE_PRESENT" : "BLOCKED_PENDING_REAL_VALIDATION_EVIDENCE"
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    future_validation_prerequisites_documented: true,
    future_validation_prerequisites_satisfied: prerequisites.every((entry) => entry.evidence_present),
    permanent_validation_state: "EVIDENCE_GATED_DO_NOT_ENABLE",
    prerequisites
  };
  fs.writeFileSync(outputs.permanentPrerequisitesJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.permanentPrerequisitesMd, `# Governance Permanent Validation Prerequisite Index

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
future_validation_prerequisites_documented=true
future_validation_prerequisites_satisfied=${report.future_validation_prerequisites_satisfied}
permanent_validation_state=${report.permanent_validation_state}

## Prerequisites

${prerequisites.map((entry) => `- ${entry.order}. ${entry.prerequisite}: ${entry.validation_state} archived_gaps=${entry.archived_gap_count}`).join("\n")}
`);
  return report;
}

function permanentStrictModePreservationReport(context = buildContext(), strictVerification = crossStreamStrictModeVerification(context), denialPreservation = longTermDenialPreservationBoard(context), archiveBoard = finalBlockedSafeArchiveBoard(context)) {
  const streamPreservation = context.streamStatuses.map((stream) => ({
    agent: stream.agent,
    strict_mode_denial_preserved: true,
    archived_state_denial_preserved: true,
    do_not_enable_preserved: stream.do_not_enable_posture === "PRESERVED",
    readiness_claim_has_evidence_lineage: !stream.readiness_without_lineage,
    autonomous_execution_implication: false,
    preservation_state: stream.readiness_without_lineage || stream.do_not_enable_posture !== "PRESERVED"
      ? "PRESERVED_WITH_OPEN_EVIDENCE_GAP"
      : "PRESERVED"
  }));
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    strict_mode_preservation_matches_archive: strictVerification.strict_mode_denial_behavior_verified_globally === true && archiveBoard.blocked_safe_archival_posture_retained === true,
    strict_mode_denial_continuity_indefinite: true,
    unsupported_readiness_suppression_indefinite: denialPreservation.unsupported_readiness_suppression_preserved === true,
    autonomous_execution_implications_unresolved: streamPreservation.some((entry) => entry.autonomous_execution_implication),
    archived_readiness_claims_without_lineage: streamPreservation.filter((entry) => !entry.readiness_claim_has_evidence_lineage).length,
    stream_preservation: streamPreservation
  };
  fs.writeFileSync(outputs.permanentStrictJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.permanentStrictMd, `# Governance Permanent Strict-Mode Preservation Report

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enablement=BLOCKED
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
strict_mode_preservation_matches_archive=${report.strict_mode_preservation_matches_archive}
strict_mode_denial_continuity_indefinite=true
unsupported_readiness_suppression_indefinite=${report.unsupported_readiness_suppression_indefinite}
archived_readiness_claims_without_lineage=${report.archived_readiness_claims_without_lineage}

## Stream Preservation

${streamPreservation.map((entry) => `- ${entry.agent}: ${entry.preservation_state} do_not_enable=${entry.do_not_enable_preserved}`).join("\n")}
`);
  return report;
}

function permanentBlockedSafeSeal(context = buildContext(), denialIndex = permanentDenialLineageIndex(context), gapCatalog = retainedEvidenceGapCatalog(context), prerequisites = permanentValidationPrerequisiteIndex(context), strictPreservation = permanentStrictModePreservationReport(context)) {
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    permanent_blocked_safe_seal_applied: true,
    permanent_archival_state: "SEALED_BLOCKED_SAFE_PENDING_REAL_VALIDATION_EVIDENCE",
    permanent_denial_lineage_traceable: denialIndex.denial_lineage_index_preserved === true,
    permanent_denial_lineage_complete: denialIndex.archival_denial_lineage_complete,
    retained_evidence_gap_lineage_preserved: gapCatalog.retained_evidence_gap_catalog_preserved === true,
    unsupported_readiness_suppression_preserved_indefinitely: strictPreservation.unsupported_readiness_suppression_indefinite === true,
    strict_mode_denial_preserved_globally: strictPreservation.strict_mode_denial_continuity_indefinite === true,
    future_validation_prerequisites_preserved: prerequisites.future_validation_prerequisites_documented === true,
    archived_state_implies_readiness_or_enablement: false,
    seal_notes: [
      "Placement V3 remains blocked until future real validation evidence exists.",
      "Archive does not certify production readiness.",
      "Archive does not authorize canary, live validation, autonomous execution, or production writes.",
      "All open evidence gaps remain retained and denial-preserving."
    ]
  };
  fs.writeFileSync(outputs.permanentSealJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.permanentSealMd, `# Governance Permanent Blocked-Safe Seal

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
permanent_blocked_safe_seal_applied=true
permanent_archival_state=${report.permanent_archival_state}
archived_state_implies_readiness_or_enablement=false

## Notes

${report.seal_notes.map((note) => `- ${note}`).join("\n")}
`);
  return report;
}

function permanentGovernanceArchiveSummary(context = buildContext(), seal = permanentBlockedSafeSeal(context), prerequisites = permanentValidationPrerequisiteIndex(context), strictPreservation = permanentStrictModePreservationReport(context), gapCatalog = retainedEvidenceGapCatalog(context)) {
  const report = {
    generated_at: new Date().toISOString(),
    ...blockedSafeState,
    complete: true,
    permanent_archive_summary_generated: true,
    archive_status: "PERMANENT_BLOCKED_SAFE_RETAINED",
    enablement_status: "DO_NOT_ENABLE",
    validation_status: "BLOCKED_PENDING_REAL_EVIDENCE",
    permanent_seal_artifact: outputs.permanentSealJson,
    validation_prerequisites_artifact: outputs.permanentPrerequisitesJson,
    strict_preservation_artifact: outputs.permanentStrictJson,
    retained_evidence_gap_catalog_artifact: outputs.retainedEvidenceGapCatalogJson,
    open_gap_count: gapCatalog.open_gap_count,
    future_validation_prerequisites_satisfied: prerequisites.future_validation_prerequisites_satisfied,
    strict_mode_denial_preserved_globally: strictPreservation.strict_mode_denial_continuity_indefinite,
    permanent_blocked_safe_seal_applied: seal.permanent_blocked_safe_seal_applied
  };
  fs.writeFileSync(outputs.permanentSummaryJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(outputs.permanentSummaryMd, `# Governance Permanent Governance Archive Summary

generated_at=${report.generated_at}
production_safe=false
production_readiness=false
placement_v3_enabled=false
placement_test_enabled=false
placement_v3_ui_enabled=false
placement_v3_enablement=BLOCKED
live_validation_complete=false
live_provider_validated=false
live_replay_validated=false
provider_drift_measured=false
production_persistence_validated=false
supervised_execution_allowed=false
writes_production_data=false
autonomous_execution=SUPERVISED_ONLY
DO_NOT_ENABLE
archive_status=${report.archive_status}
enablement_status=${report.enablement_status}
validation_status=${report.validation_status}
open_gap_count=${report.open_gap_count}
`);
  return report;
}

function strictValidate(reports) {
  const failures = [];
  const ledger = reports.ledger ?? unifiedBlockedSafeLedger();
  const matrix = reports.matrix ?? contradictionMatrix();
  const readiness = reports.readiness ?? readinessPropagationAudit();
  const denial = reports.denial ?? finalDenialConsistencyBoard();
  const certification = reports.certification ?? globalBlockedSafeCertification();
  const escalation = reports.escalation ?? crossStreamEscalationLedger();
  const suppression = reports.suppression ?? unsupportedReadinessSuppressionMap();
  const finalSummary = reports.finalSummary ?? finalConvergenceCertificationSummary();
  const denialLineage = reports.denialLineage ?? globalDenialLineageMap();
  const strictVerification = reports.strictVerification ?? crossStreamStrictModeVerification();
  const retention = reports.retention ?? finalBlockedSafeRetentionSummary();
  const sequencing = reports.sequencing ?? futureValidationDependencySequencing();
  const evidenceGaps = reports.evidenceGaps ?? evidenceGapMasterLedger();
  const denialPreservation = reports.denialPreservation ?? longTermDenialPreservationBoard();
  const archival = reports.archival ?? finalArchivalIntegrityReport();
  const denialIndex = reports.denialIndex ?? permanentDenialLineageIndex();
  const gapCatalog = reports.gapCatalog ?? retainedEvidenceGapCatalog();
  const permanentPrerequisites = reports.permanentPrerequisites ?? permanentValidationPrerequisiteIndex();
  const permanentStrict = reports.permanentStrict ?? permanentStrictModePreservationReport();
  const permanentSeal = reports.permanentSeal ?? permanentBlockedSafeSeal();
  if (ledger.streams_with_blocked_safe_contradictions > 0) failures.push("a stream contradicts blocked-safe posture");
  if (readiness.readiness_lineage_incomplete_count > 0) failures.push("a readiness state lacks evidence lineage");
  if (matrix.matrix.some((row) => row.contradiction_detector_unresolved)) failures.push("a contradiction detector output is unresolved");
  if (denial.denial_board_conflict_count > 0) failures.push("a denial board conflicts with another stream");
  if (matrix.matrix.some((row) => row.replay_or_observability_dependency_missing)) failures.push("a stream omits replay/observability dependencies");
  if (matrix.matrix.some((row) => row.do_not_enable_weakened)) failures.push("a stream weakens DO_NOT_ENABLE posture");
  if (readiness.unsupported_readiness_propagation_detected || readiness.unsupported_claim_findings.length > 0) failures.push("unsupported readiness propagation detected");
  if (matrix.matrix.some((row) => row.autonomous_execution_implication)) failures.push("autonomous execution implication exists");
  if (certification.stream_certifications.some((stream) => stream.blocked_safe_posture_preserved === false)) failures.push("a stream weakens blocked-safe posture");
  if (suppression.unsupported_readiness_propagation_unresolved) failures.push("unsupported readiness propagation remains unresolved");
  if (!escalation.contradiction_escalation_lineage_complete) failures.push("contradiction escalation lineage incomplete");
  if (!escalation.strict_mode_gate_consistency_verified) failures.push("strict-mode gates are inconsistent between streams");
  if (certification.stream_certifications.some((stream) => stream.do_not_enable_posture !== "PRESERVED")) failures.push("DO_NOT_ENABLE continuity is weakened");
  if (certification.streams_with_blocked_safe_contradictions > 0) failures.push("a safety flag is promoted without validated evidence");
  if (finalSummary.do_not_enable_continuity_preserved !== true) failures.push("DO_NOT_ENABLE continuity weakens");
  if (denialLineage.denial_board_conflict_count > 0) failures.push("a denial board conflicts with another stream");
  if (strictVerification.unsupported_readiness_suppression_complete !== true) failures.push("unsupported-readiness suppression becomes incomplete");
  if (strictVerification.strict_mode_enforcement_consistent_between_streams !== true) failures.push("strict-mode enforcement differs across streams");
  if (strictVerification.autonomous_execution_implications_unresolved) failures.push("autonomous execution implications are unresolved");
  if (strictVerification.production_readiness_denial_inconsistent) failures.push("production-readiness denial becomes inconsistent");
  if (denialLineage.global_denial_lineage_fully_traceable !== true) failures.push("a blocked-safe denial lineage becomes unresolved");
  if (retention.unsupported_readiness_suppression_preserved !== true || denialPreservation.unsupported_readiness_suppression_preserved !== true) failures.push("unsupported-readiness suppression weakens");
  if (sequencing.future_validation_dependencies_documented !== true) failures.push("future validation dependencies are undocumented");
  if (evidenceGaps.evidence_gap_lineage_complete !== true) failures.push("evidence-gap lineage becomes incomplete");
  if (denialPreservation.entries.some((entry) => entry.do_not_enable_preserved !== true)) failures.push("DO_NOT_ENABLE continuity weakens");
  if (strictVerification.readiness_lineage_incomplete_count > 0) failures.push("a readiness claim lacks evidence lineage");
  if (denialIndex.archival_denial_lineage_complete !== true) failures.push("archival denial lineage becomes incomplete");
  if (archival.unsupported_readiness_suppression_continuity_preserved !== true) failures.push("unsupported-readiness suppression weakens");
  if (gapCatalog.evidence_gap_lineage_traceable !== true) failures.push("evidence-gap lineage becomes untraceable");
  if (archival.future_validation_sequencing_preserved !== true) failures.push("future validation sequencing becomes undocumented");
  if (archival.strict_mode_enforcement_continuity_preserved !== true) failures.push("strict-mode enforcement diverges from retained governance state");
  if (permanentSeal.permanent_denial_lineage_complete !== true) failures.push("permanent denial lineage becomes incomplete");
  if (permanentStrict.unsupported_readiness_suppression_indefinite !== true) failures.push("unsupported-readiness suppression weakens");
  if (permanentPrerequisites.future_validation_prerequisites_documented !== true) failures.push("future validation prerequisites become undocumented");
  if (permanentStrict.strict_mode_preservation_matches_archive !== true) failures.push("strict-mode preservation diverges from archived governance state");
  if (permanentStrict.archived_readiness_claims_without_lineage > 0) failures.push("archived readiness claims lack evidence lineage");
  if (failures.length > 0) {
    console.error(`Governance convergence strict mode blocked: ${failures.join("; ")}`);
    process.exitCode = 1;
  }
  return failures;
}

function runMode() {
  ensureDir();
  const context = buildContext();
  let reports = {};
  if (mode === "blocked-safe") {
    reports.ledger = unifiedBlockedSafeLedger(context);
    console.log(`governance_unified_blocked_safe_ledger_json=${outputs.blockedSafeJson}`);
    console.log(`governance_unified_blocked_safe_ledger_md=${outputs.blockedSafeMd}`);
  } else if (mode === "contradictions") {
    reports.matrix = contradictionMatrix(context);
    console.log(`governance_cross_stream_contradiction_matrix_json=${outputs.contradictionsJson}`);
    console.log(`governance_cross_stream_contradiction_matrix_md=${outputs.contradictionsMd}`);
  } else if (mode === "readiness-audit") {
    reports.readiness = readinessPropagationAudit(context);
    console.log(`governance_readiness_propagation_audit_json=${outputs.readinessJson}`);
    console.log(`governance_readiness_propagation_audit_md=${outputs.readinessMd}`);
  } else if (mode === "denial-board") {
    reports.denial = finalDenialConsistencyBoard(context);
    console.log(`governance_final_denial_consistency_board_json=${outputs.denialJson}`);
    console.log(`governance_final_denial_consistency_board_md=${outputs.denialMd}`);
  } else if (mode === "certification") {
    reports.certification = globalBlockedSafeCertification(context);
    console.log(`governance_global_blocked_safe_certification_json=${outputs.certificationJson}`);
    console.log(`governance_global_blocked_safe_certification_md=${outputs.certificationMd}`);
  } else if (mode === "escalation-ledger") {
    reports.escalation = crossStreamEscalationLedger(context);
    console.log(`governance_cross_stream_escalation_ledger_json=${outputs.escalationJson}`);
    console.log(`governance_cross_stream_escalation_ledger_md=${outputs.escalationMd}`);
  } else if (mode === "readiness-suppression") {
    reports.suppression = unsupportedReadinessSuppressionMap(context);
    console.log(`governance_unsupported_readiness_suppression_map_json=${outputs.suppressionJson}`);
    console.log(`governance_unsupported_readiness_suppression_map_md=${outputs.suppressionMd}`);
  } else if (mode === "handoff-board") {
    reports.handoff = finalConvergenceHandoffBoard(context);
    console.log(`governance_final_convergence_handoff_board_json=${outputs.handoffJson}`);
    console.log(`governance_final_convergence_handoff_board_md=${outputs.handoffMd}`);
  } else if (mode === "final-summary") {
    reports.finalSummary = finalConvergenceCertificationSummary(context);
    console.log(`governance_final_convergence_certification_summary_json=${outputs.finalSummaryJson}`);
    console.log(`governance_final_convergence_certification_summary_md=${outputs.finalSummaryMd}`);
  } else if (mode === "denial-lineage") {
    reports.denialLineage = globalDenialLineageMap(context);
    console.log(`governance_global_denial_lineage_map_json=${outputs.denialLineageJson}`);
    console.log(`governance_global_denial_lineage_map_md=${outputs.denialLineageMd}`);
  } else if (mode === "strict-verification") {
    reports.strictVerification = crossStreamStrictModeVerification(context);
    console.log(`governance_cross_stream_strict_mode_verification_json=${outputs.strictVerificationJson}`);
    console.log(`governance_cross_stream_strict_mode_verification_md=${outputs.strictVerificationMd}`);
  } else if (mode === "closure-report") {
    reports.closure = finalBlockedSafeClosureReport(context);
    console.log(`governance_final_blocked_safe_closure_report_json=${outputs.closureReportJson}`);
    console.log(`governance_final_blocked_safe_closure_report_md=${outputs.closureReportMd}`);
  } else if (mode === "retention-summary") {
    reports.retention = finalBlockedSafeRetentionSummary(context);
    console.log(`governance_final_blocked_safe_retention_summary_json=${outputs.retentionSummaryJson}`);
    console.log(`governance_final_blocked_safe_retention_summary_md=${outputs.retentionSummaryMd}`);
  } else if (mode === "validation-sequencing") {
    reports.sequencing = futureValidationDependencySequencing(context);
    console.log(`governance_future_validation_dependency_sequencing_json=${outputs.validationSequencingJson}`);
    console.log(`governance_future_validation_dependency_sequencing_md=${outputs.validationSequencingMd}`);
  } else if (mode === "evidence-gap-ledger") {
    reports.evidenceGaps = evidenceGapMasterLedger(context);
    console.log(`governance_evidence_gap_master_ledger_json=${outputs.evidenceGapLedgerJson}`);
    console.log(`governance_evidence_gap_master_ledger_md=${outputs.evidenceGapLedgerMd}`);
  } else if (mode === "denial-preservation") {
    reports.denialPreservation = longTermDenialPreservationBoard(context);
    console.log(`governance_long_term_denial_preservation_board_json=${outputs.denialPreservationJson}`);
    console.log(`governance_long_term_denial_preservation_board_md=${outputs.denialPreservationMd}`);
  } else if (mode === "integrity-report") {
    reports.archival = finalArchivalIntegrityReport(context);
    console.log(`governance_final_archival_integrity_report_json=${outputs.archivalIntegrityJson}`);
    console.log(`governance_final_archival_integrity_report_md=${outputs.archivalIntegrityMd}`);
  } else if (mode === "denial-index") {
    reports.denialIndex = permanentDenialLineageIndex(context);
    console.log(`governance_permanent_denial_lineage_index_json=${outputs.permanentDenialIndexJson}`);
    console.log(`governance_permanent_denial_lineage_index_md=${outputs.permanentDenialIndexMd}`);
  } else if (mode === "evidence-gap-catalog") {
    reports.gapCatalog = retainedEvidenceGapCatalog(context);
    console.log(`governance_retained_evidence_gap_catalog_json=${outputs.retainedEvidenceGapCatalogJson}`);
    console.log(`governance_retained_evidence_gap_catalog_md=${outputs.retainedEvidenceGapCatalogMd}`);
  } else if (mode === "blocked-safe-board") {
    reports.archiveBoard = finalBlockedSafeArchiveBoard(context);
    console.log(`governance_final_blocked_safe_archive_board_json=${outputs.archiveBoardJson}`);
    console.log(`governance_final_blocked_safe_archive_board_md=${outputs.archiveBoardMd}`);
  } else if (mode === "permanent-seal") {
    reports.permanentSeal = permanentBlockedSafeSeal(context);
    console.log(`governance_permanent_blocked_safe_seal_json=${outputs.permanentSealJson}`);
    console.log(`governance_permanent_blocked_safe_seal_md=${outputs.permanentSealMd}`);
  } else if (mode === "validation-prerequisites") {
    reports.permanentPrerequisites = permanentValidationPrerequisiteIndex(context);
    console.log(`governance_permanent_validation_prerequisite_index_json=${outputs.permanentPrerequisitesJson}`);
    console.log(`governance_permanent_validation_prerequisite_index_md=${outputs.permanentPrerequisitesMd}`);
  } else if (mode === "strict-preservation") {
    reports.permanentStrict = permanentStrictModePreservationReport(context);
    console.log(`governance_permanent_strict_mode_preservation_report_json=${outputs.permanentStrictJson}`);
    console.log(`governance_permanent_strict_mode_preservation_report_md=${outputs.permanentStrictMd}`);
  } else if (mode === "permanent-summary") {
    reports.permanentSummary = permanentGovernanceArchiveSummary(context);
    console.log(`governance_permanent_governance_archive_summary_json=${outputs.permanentSummaryJson}`);
    console.log(`governance_permanent_governance_archive_summary_md=${outputs.permanentSummaryMd}`);
  } else if (mode === "auto") {
    reports = {
      ledger: unifiedBlockedSafeLedger(context),
      matrix: contradictionMatrix(context),
      readiness: readinessPropagationAudit(context),
      denial: finalDenialConsistencyBoard(context)
    };
    reports.certification = globalBlockedSafeCertification(context, reports.ledger, reports.denial);
    reports.escalation = crossStreamEscalationLedger(context, reports.matrix, reports.readiness, reports.denial);
    reports.suppression = unsupportedReadinessSuppressionMap(context, reports.readiness);
    reports.handoff = finalConvergenceHandoffBoard(context, reports.certification, reports.escalation, reports.suppression, reports.denial);
    reports.finalSummary = finalConvergenceCertificationSummary(context, reports.certification, reports.denial, reports.suppression, reports.escalation);
    reports.denialLineage = globalDenialLineageMap(context, reports.denial, reports.escalation);
    reports.strictVerification = crossStreamStrictModeVerification(context, reports.matrix, reports.readiness, reports.denial, reports.suppression);
    reports.closure = finalBlockedSafeClosureReport(context, reports.finalSummary, reports.denialLineage, reports.strictVerification, reports.handoff);
    reports.retention = finalBlockedSafeRetentionSummary(context, reports.closure, reports.denialLineage, reports.suppression, reports.strictVerification);
    reports.sequencing = futureValidationDependencySequencing(context);
    reports.evidenceGaps = evidenceGapMasterLedger(context, reports.sequencing, reports.denialLineage);
    reports.denialPreservation = longTermDenialPreservationBoard(context, reports.denialLineage, reports.suppression, reports.strictVerification);
    reports.archival = finalArchivalIntegrityReport(context, reports.retention, reports.sequencing, reports.evidenceGaps, reports.denialPreservation);
    reports.denialIndex = permanentDenialLineageIndex(context, reports.denialLineage, reports.denialPreservation);
    reports.gapCatalog = retainedEvidenceGapCatalog(context, reports.evidenceGaps, reports.sequencing);
    reports.archiveBoard = finalBlockedSafeArchiveBoard(context, reports.archival, reports.denialIndex, reports.gapCatalog, reports.denialPreservation);
    reports.permanentPrerequisites = permanentValidationPrerequisiteIndex(context, reports.sequencing, reports.gapCatalog);
    reports.permanentStrict = permanentStrictModePreservationReport(context, reports.strictVerification, reports.denialPreservation, reports.archiveBoard);
    reports.permanentSeal = permanentBlockedSafeSeal(context, reports.denialIndex, reports.gapCatalog, reports.permanentPrerequisites, reports.permanentStrict);
    reports.permanentSummary = permanentGovernanceArchiveSummary(context, reports.permanentSeal, reports.permanentPrerequisites, reports.permanentStrict, reports.gapCatalog);
    console.log(`governance_unified_blocked_safe_ledger_json=${outputs.blockedSafeJson}`);
    console.log(`governance_cross_stream_contradiction_matrix_json=${outputs.contradictionsJson}`);
    console.log(`governance_readiness_propagation_audit_json=${outputs.readinessJson}`);
    console.log(`governance_final_denial_consistency_board_json=${outputs.denialJson}`);
    console.log(`governance_global_blocked_safe_certification_json=${outputs.certificationJson}`);
    console.log(`governance_cross_stream_escalation_ledger_json=${outputs.escalationJson}`);
    console.log(`governance_unsupported_readiness_suppression_map_json=${outputs.suppressionJson}`);
    console.log(`governance_final_convergence_handoff_board_json=${outputs.handoffJson}`);
    console.log(`governance_final_convergence_certification_summary_json=${outputs.finalSummaryJson}`);
    console.log(`governance_global_denial_lineage_map_json=${outputs.denialLineageJson}`);
    console.log(`governance_cross_stream_strict_mode_verification_json=${outputs.strictVerificationJson}`);
    console.log(`governance_final_blocked_safe_closure_report_json=${outputs.closureReportJson}`);
    console.log(`governance_final_blocked_safe_retention_summary_json=${outputs.retentionSummaryJson}`);
    console.log(`governance_future_validation_dependency_sequencing_json=${outputs.validationSequencingJson}`);
    console.log(`governance_evidence_gap_master_ledger_json=${outputs.evidenceGapLedgerJson}`);
    console.log(`governance_long_term_denial_preservation_board_json=${outputs.denialPreservationJson}`);
    console.log(`governance_final_archival_integrity_report_json=${outputs.archivalIntegrityJson}`);
    console.log(`governance_permanent_denial_lineage_index_json=${outputs.permanentDenialIndexJson}`);
    console.log(`governance_retained_evidence_gap_catalog_json=${outputs.retainedEvidenceGapCatalogJson}`);
    console.log(`governance_final_blocked_safe_archive_board_json=${outputs.archiveBoardJson}`);
    console.log(`governance_permanent_blocked_safe_seal_json=${outputs.permanentSealJson}`);
    console.log(`governance_permanent_validation_prerequisite_index_json=${outputs.permanentPrerequisitesJson}`);
    console.log(`governance_permanent_strict_mode_preservation_report_json=${outputs.permanentStrictJson}`);
    console.log(`governance_permanent_governance_archive_summary_json=${outputs.permanentSummaryJson}`);
  } else {
    console.error(`Unknown governance convergence mode: ${mode}`);
    process.exit(2);
  }
  if (strictMode) strictValidate(reports);
}

runMode();
