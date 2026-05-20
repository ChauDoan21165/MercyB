#!/usr/bin/env tsx

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

type RiskClassification = "LOW" | "MODERATE" | "ELEVATED" | "HIGH" | "CRITICAL" | "BLOCKED_BY_MISSING_EVIDENCE";
type ReliabilityRiskClassification =
  | "RELIABILITY_READY"
  | "BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS"
  | "BLOCKED_BY_TIMEOUT_RISK"
  | "BLOCKED_BY_PROVIDER_LATENCY_UNKNOWN"
  | "BLOCKED_BY_REPLAY_DURABILITY_UNKNOWN"
  | "BLOCKED_BY_FAILOVER_LATENCY_UNKNOWN"
  | "BLOCKED_BY_ADAPTIVE_SESSION_RISK"
  | "BLOCKED_BY_GOVERNANCE";

type SourceStatus = {
  key: string;
  path: string;
  canonicalPath: string;
  sourceTier: "canonical" | "evidence-dropbox" | "reports-agent-runs" | "missing";
  required: boolean;
  present: boolean;
  rejected: boolean;
  rejectionReasons: string[];
  stale: boolean;
  ageHours: number | null;
  branch: string | null;
  generatedAt: string | null;
  missingSafetyFields: string[];
  unsafeProductionClaim: boolean;
  checksum: string | null;
  sourceAgent: string;
  sourceCommit: string | null;
  safetyClassification: "SAFE_FALSE_FLAGS" | "UNSAFE_TRUE_FLAGS" | "MISSING_SAFETY_FIELDS" | "MISSING";
  data: Record<string, unknown> | null;
};

const EXPECTED_BRANCH = "feat/a42-reliability-forecast-ops";
const OUT_DIR = "docs/placement-v3/reliability-forecast";
const RELIABILITY_OUT_DIR = "docs/placement-v3/reliability";
const DROPBOX_DIR = path.join(OUT_DIR, "evidence-dropbox");
const AGENT_RUNS_DIR = "reports/agent-runs";
const STALENESS_THRESHOLD_HOURS = Number(process.env.A42_STALENESS_THRESHOLD_HOURS ?? 72);
const args = process.argv.slice(3);

const SOURCES = [
  {
    key: "reliability_health",
    path: "docs/placement-v3/reliability/reliability-health-summary.json",
    required: true,
  },
  {
    key: "ci_degradation_forecast",
    path: "docs/placement-v3/reliability/ci-degradation-forecast.json",
    required: true,
  },
  {
    key: "reliability_recovery_forecast",
    path: "docs/placement-v3/reliability/reliability-recovery-forecast.json",
    required: true,
  },
  {
    key: "ci_resilience_summary",
    path: "docs/placement-v3/reliability/ci-resilience-summary.json",
    required: true,
  },
  {
    key: "reliability_anomaly_summary",
    path: "docs/placement-v3/reliability/reliability-anomaly-summary.json",
    required: true,
  },
  {
    key: "a33_endurance_health",
    path: "docs/placement-v3/endurance/endurance-health-summary.json",
    required: false,
  },
  {
    key: "a33_timeout_risk_forecast",
    path: "docs/placement-v3/endurance/timeout-risk-forecast.json",
    required: false,
  },
  {
    key: "a39_capacity_projections",
    path: "docs/placement-v3/capacity/a39-capacity-projections.json",
    required: false,
  },
  {
    key: "a39_capacity_denial_provider_burst_governance",
    path: "docs/placement-v3/capacity/a39-capacity-denial-provider-burst-governance.json",
    required: false,
  },
  {
    key: "a44_human_review_backlog_approval_denial",
    path: "docs/placement-v3/human-review/a44-human-review-backlog-approval-denial.json",
    required: false,
  },
  {
    key: "a45_provider_calibration_dependencies",
    path: "docs/placement-v3/provider-calibration/a45-provider-calibration-dependencies.json",
    required: false,
  },
  {
    key: "a45_provider_validation_drift_denial",
    path: "docs/placement-v3/provider-calibration/a45-provider-validation-drift-denial.json",
    required: false,
  },
  {
    key: "a46_governance_contradiction_audits",
    path: "docs/placement-v3/governance/a46-governance-contradiction-audits.json",
    required: false,
  },
  {
    key: "a47_observability_retention_drift_telemetry",
    path: "docs/placement-v3/observability/a47-observability-retention-drift-telemetry.json",
    required: false,
  },
  {
    key: "a47_observability_reconciliation_audit_continuity",
    path: "docs/placement-v3/observability/a47-observability-reconciliation-audit-continuity.json",
    required: false,
  },
  {
    key: "a48_release_canary_denial_governance",
    path: "docs/placement-v3/release/a48-release-canary-denial-governance.json",
    required: false,
  },
  {
    key: "a49_replay_reproducibility_thresholds",
    path: "docs/placement-v3/replay/a49-replay-reproducibility-thresholds.json",
    required: false,
  },
  {
    key: "a49_replay_reproducibility_contradiction_auditing",
    path: "docs/placement-v3/replay/a49-replay-reproducibility-contradiction-auditing.json",
    required: false,
  },
  {
    key: "a50_supervised_execution_constraints",
    path: "docs/placement-v3/supervision/a50-supervised-execution-constraints.json",
    required: false,
  },
  {
    key: "a50_supervised_execution_denial_governance",
    path: "docs/placement-v3/supervision/a50-supervised-execution-denial-governance.json",
    required: false,
  },
] as const;

const FORBIDDEN_CLAIMS = [
  new RegExp(String.raw`\bproduction ${"reliable"}\b`, "i"),
  new RegExp(String.raw`\bfully ${"resilient"}\b`, "i"),
  new RegExp(String.raw`\bCI guaranteed ${"stable"}\b`, "i"),
  new RegExp(String.raw`\breal-user ${"ready"}\b`, "i"),
  new RegExp(String.raw`\bsafe for ${"rollout"}\b`, "i"),
  new RegExp(String.raw`\blaunch ${"ready"}\b`, "i"),
  new RegExp(String.raw`(?<!not )\bproduction ${"ready"}\b`, "i"),
  new RegExp(String.raw`\blive-provider ${"ready"}\b`, "i"),
];

const command = process.argv[2] ?? "auto";

main();

function main() {
  ensureBranch();
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(RELIABILITY_OUT_DIR, { recursive: true });

  switch (command) {
    case "summary":
      generateOperatingSummary();
      break;
    case "scoreboard":
      generateScoreboard();
      break;
    case "handoff":
      generateHandoffReport();
      break;
    case "manifest":
      generateSourceManifest();
      break;
    case "latency-risk":
      generateProviderLatencyRisk();
      break;
    case "adaptive-reliability":
      generateAdaptiveSessionReliability();
      break;
    case "cross-stream":
      generateCrossStreamReliabilityDependencies();
      break;
    case "replay-durability":
      generateReplayDurabilityForecast();
      generateReplayDurabilityGovernance();
      break;
    case "failover-stability":
      generateFailoverStabilityForecast();
      generateProviderFailoverStabilityModel();
      break;
    case "observability-correlation":
      generateObservabilityReliabilityCorrelation();
      break;
    case "reconciliation":
      generateReliabilityGovernanceReconciliationLedger();
      break;
    case "contradiction-detector":
      generateFailoverContradictionDetector();
      break;
    case "durability-continuity":
      generateReplayDurabilityContinuityMap();
      break;
    case "blocked-safe-certification":
      generateBlockedSafeReliabilityCertification();
      break;
    case "threshold-policy":
      generateReliabilityThresholdPolicy();
      break;
    case "timeout-simulation":
      generateTimeoutIncidentSimulation();
      break;
    case "retry-budget":
      generateProviderRetryBudgetPolicy();
      break;
    case "session-sla":
      generateAssessmentSessionSlaPlan();
      break;
    case "evidence-schema":
      generateReliabilityEvidenceSchemaContract();
      break;
    case "pilot-endurance":
      generatePilotEnduranceTestPlan();
      break;
    case "timeout-schema":
      generateTimeoutThresholdSchema();
      break;
    case "latency-schema":
      generateProviderLatencyEvidenceSchema();
      break;
    case "endurance-criteria":
      generatePilotEnduranceAcceptanceCriteria();
      break;
    case "incident-response":
      generateReliabilityIncidentResponsePlan();
      break;
    case "timeout-escalation":
      generateProviderTimeoutEscalationPolicy();
      break;
    case "safety-margin":
      generateReliabilitySafetyMarginPolicy();
      break;
    case "auto":
      runAuto();
      break;
    default:
      throw new Error(`Unknown A42 reliability forecast command: ${command}`);
  }

  scanClaims();
}

function runAuto() {
  console.log(`[a42] branch verified: ${EXPECTED_BRANCH}`);
  const sources = ingestSources();
  generateSourceManifest(sources);
  const summary = generateOperatingSummary(sources);
  const scoreboard = generateScoreboard(summary);
  const lineage = generateLineageMap(sources);
  const readiness = generateEnduranceReadinessMatrix(sources);
  const forecast = generatePlacementReliabilityForecast(sources, readiness);
  const providerLatencyRisk = generateProviderLatencyRisk(sources);
  const adaptiveSessionReliability = generateAdaptiveSessionReliability(sources);
  const replayDurability = generateReplayDurabilityForecast(sources);
  const failoverStability = generateFailoverStabilityForecast(sources);
  const thresholdPolicy = generateReliabilityThresholdPolicy(sources);
  const timeoutSimulation = generateTimeoutIncidentSimulation(sources);
  const retryBudget = generateProviderRetryBudgetPolicy(sources);
  const sessionSla = generateAssessmentSessionSlaPlan(sources);
  const evidenceSchema = generateReliabilityEvidenceSchemaContract(sources);
  const pilotEndurance = generatePilotEnduranceTestPlan(sources);
  const timeoutSchema = generateTimeoutThresholdSchema(sources);
  const latencySchema = generateProviderLatencyEvidenceSchema(sources);
  const enduranceCriteria = generatePilotEnduranceAcceptanceCriteria(sources);
  const incidentResponse = generateReliabilityIncidentResponsePlan(sources);
  const timeoutEscalation = generateProviderTimeoutEscalationPolicy(sources);
  const safetyMargin = generateReliabilitySafetyMarginPolicy(sources);
  const crossStream = generateCrossStreamReliabilityDependencies(sources);
  const replayGovernance = generateReplayDurabilityGovernance(sources);
  const failoverModel = generateProviderFailoverStabilityModel(sources);
  const observabilityCorrelation = generateObservabilityReliabilityCorrelation(sources);
  const reconciliationLedger = generateReliabilityGovernanceReconciliationLedger(sources);
  const contradictionDetector = generateFailoverContradictionDetector(sources);
  const durabilityContinuity = generateReplayDurabilityContinuityMap(sources);
  const blockedSafeCertification = generateBlockedSafeReliabilityCertification(sources);
  generateHandoffReport(summary, scoreboard, sources);
  if (args.includes("--strict")) {
    enforceStrictMode(
      sources,
      readiness,
      forecast,
      providerLatencyRisk,
      adaptiveSessionReliability,
      replayDurability,
      failoverStability,
      thresholdPolicy,
      timeoutSimulation,
      retryBudget,
      sessionSla,
      evidenceSchema,
      pilotEndurance,
      timeoutSchema,
      latencySchema,
      enduranceCriteria,
      incidentResponse,
      timeoutEscalation,
      safetyMargin,
      crossStream,
      replayGovernance,
      failoverModel,
      observabilityCorrelation,
      reconciliationLedger,
      contradictionDetector,
      durabilityContinuity,
      blockedSafeCertification,
    );
  }
  console.log(`[a42] artifacts: ${OUT_DIR}`);
  console.log(`[a42] reliability reports: ${RELIABILITY_OUT_DIR}`);
  console.log(`[a42] evidence manifest: ${path.join(OUT_DIR, "a42-evidence-source-manifest.json")}`);
  console.log(`[a42] lineage map: ${path.join(RELIABILITY_OUT_DIR, "a42-reliability-evidence-lineage.json")}`);
  console.log(`[a42] endurance readiness matrix: ${path.join(RELIABILITY_OUT_DIR, "a42-endurance-readiness-matrix.json")}`);
  console.log(`[a42] placement reliability forecast: ${path.join(RELIABILITY_OUT_DIR, "a42-placement-reliability-forecast.json")}`);
  console.log(`[a42] provider latency risk: ${path.join(RELIABILITY_OUT_DIR, "a42-provider-latency-risk.json")}`);
  console.log(`[a42] adaptive session reliability: ${path.join(RELIABILITY_OUT_DIR, "a42-adaptive-session-reliability.json")}`);
  console.log(`[a42] replay durability forecast: ${path.join(RELIABILITY_OUT_DIR, "a42-replay-durability-forecast.json")}`);
  console.log(`[a42] failover stability forecast: ${path.join(RELIABILITY_OUT_DIR, "a42-failover-stability-forecast.json")}`);
  console.log(`[a42] reliability threshold policy: ${path.join(RELIABILITY_OUT_DIR, "a42-reliability-threshold-policy.json")}`);
  console.log(`[a42] timeout incident simulation: ${path.join(RELIABILITY_OUT_DIR, "a42-timeout-incident-simulation.json")}`);
  console.log(`[a42] provider retry budget policy: ${path.join(RELIABILITY_OUT_DIR, "a42-provider-retry-budget-policy.json")}`);
  console.log(`[a42] assessment session SLA plan: ${path.join(RELIABILITY_OUT_DIR, "a42-assessment-session-sla-plan.json")}`);
  console.log(`[a42] reliability evidence schema contract: ${path.join(RELIABILITY_OUT_DIR, "a42-reliability-evidence-schema-contract.json")}`);
  console.log(`[a42] pilot endurance test plan: ${path.join(RELIABILITY_OUT_DIR, "a42-pilot-endurance-test-plan.json")}`);
  console.log(`[a42] timeout threshold schema: ${path.join(RELIABILITY_OUT_DIR, "a42-timeout-threshold-schema.json")}`);
  console.log(`[a42] provider latency evidence schema: ${path.join(RELIABILITY_OUT_DIR, "a42-provider-latency-evidence-schema.json")}`);
  console.log(`[a42] pilot endurance acceptance criteria: ${path.join(RELIABILITY_OUT_DIR, "a42-pilot-endurance-acceptance-criteria.json")}`);
  console.log(`[a42] reliability incident response plan: ${path.join(RELIABILITY_OUT_DIR, "a42-reliability-incident-response-plan.json")}`);
  console.log(`[a42] provider timeout escalation policy: ${path.join(RELIABILITY_OUT_DIR, "a42-provider-timeout-escalation-policy.json")}`);
  console.log(`[a42] reliability safety margin policy: ${path.join(RELIABILITY_OUT_DIR, "a42-reliability-safety-margin-policy.json")}`);
  console.log(`[a42] cross-stream reliability dependencies: ${path.join(RELIABILITY_OUT_DIR, "a42-cross-stream-reliability-dependencies.json")}`);
  console.log(`[a42] replay durability governance: ${path.join(RELIABILITY_OUT_DIR, "a42-replay-durability-governance.json")}`);
  console.log(`[a42] provider failover stability model: ${path.join(RELIABILITY_OUT_DIR, "a42-provider-failover-stability-model.json")}`);
  console.log(`[a42] observability reliability correlation: ${path.join(RELIABILITY_OUT_DIR, "a42-observability-reliability-correlation.json")}`);
  console.log(`[a42] reliability governance reconciliation ledger: ${path.join(RELIABILITY_OUT_DIR, "a42-reliability-governance-reconciliation-ledger.json")}`);
  console.log(`[a42] failover contradiction detector: ${path.join(RELIABILITY_OUT_DIR, "a42-failover-contradiction-detector.json")}`);
  console.log(`[a42] replay durability continuity map: ${path.join(RELIABILITY_OUT_DIR, "a42-replay-durability-continuity-map.json")}`);
  console.log(`[a42] blocked-safe reliability certification: ${path.join(RELIABILITY_OUT_DIR, "a42-blocked-safe-reliability-certification.json")}`);
  console.log(`[a42] operating summary: ${path.join(OUT_DIR, "a42-reliability-operating-summary.json")}`);
  console.log(`[a42] forecast scoreboard: ${path.join(OUT_DIR, "a42-reliability-forecast-scoreboard.json")}`);
  console.log(`[a42] handoff report: ${path.join(OUT_DIR, "a42-reliability-handoff-report.md")}`);
}

function generateOperatingSummary(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const missingInputs = sources.filter((source) => !source.present).map((source) => source.key);
  const rejectedInputs = sources.filter((source) => source.rejected).map((source) => source.key);
  const staleInputs = sources.filter((source) => source.stale).map((source) => source.key);
  const missingBranchMetadata = sources.filter((source) => source.present && !source.branch).map((source) => source.key);
  const missingSafetyFields = sources
    .filter((source) => source.missingSafetyFields.length > 0)
    .map((source) => ({ key: source.key, fields: source.missingSafetyFields }));
  const unsafeProductionClaims = sources.filter((source) => source.unsafeProductionClaim).map((source) => source.key);
  const blocked = missingInputs.length > 0 || rejectedInputs.length > 0 || staleInputs.length > 0 || unsafeProductionClaims.length > 0;
  const summary = {
    generatedAt: new Date().toISOString(),
    agent: "A42",
    name: "ReliabilityForecastOps",
    branch: EXPECTED_BRANCH,
    domain: "reliability forecasting and CI resilience operations",
    dependsOn: ["B1 reliability outputs", "A33 endurance outputs"],
    mode: "active",
    reliability_health: pickSource(sources, "reliability_health"),
    ciDegradationRisk: pickSource(sources, "ci_degradation_forecast"),
    recoveryRisk: pickSource(sources, "reliability_recovery_forecast"),
    resilienceState: pickSource(sources, "ci_resilience_summary"),
    anomalyState: pickSource(sources, "reliability_anomaly_summary"),
    enduranceContext: {
      health: pickSource(sources, "a33_endurance_health"),
      timeoutRisk: pickSource(sources, "a33_timeout_risk_forecast"),
    },
    missingInputs,
    rejectedInputs,
    stalenessDetection: {
      thresholdHours: STALENESS_THRESHOLD_HOURS,
      staleInputs,
      missingBranchMetadata,
      missingSafetyFields,
      unsafeProductionClaims,
      stale: blocked,
    },
    evidenceFreshness: freshnessSummary(sources),
    classification: blocked ? "BLOCKED_BY_MISSING_EVIDENCE" : aggregateRisk(sources),
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "a42-reliability-operating-summary",
    summary,
    [
      "# A42 Reliability Operating Summary",
      "",
      `Generated: ${summary.generatedAt}`,
      "",
      `- Reliability health: ${labelValue(summary.reliability_health, "confidenceClassification")}`,
      `- CI degradation risk: ${labelValue(summary.ciDegradationRisk, "forecastClassification")}`,
      `- Recovery risk: ${labelValue(summary.recoveryRisk, "recoveryClassification")}`,
      `- Resilience state: ${labelValue(summary.resilienceState, "resilienceClassification")}`,
      `- Anomaly state: ${labelValue(summary.anomalyState, "anomalyClassification")}`,
      `- Endurance context: ${summary.enduranceContext.health.present ? "present" : "missing"}`,
      `- Missing inputs: ${summary.missingInputs.join(", ") || "none"}`,
      `- Rejected inputs: ${summary.rejectedInputs.join(", ") || "none"}`,
      `- Evidence freshness: ${summary.evidenceFreshness.label}`,
      `- Forecast classification: ${summary.classification}`,
      `- production_safe: ${summary.production_safe}`,
      `- placement_v3_enabled: ${summary.placement_v3_enabled}`,
      `- placement_test_enabled: ${summary.placement_test_enabled}`,
      `- placement_v3_ui_enabled: ${summary.placement_v3_ui_enabled}`,
      `- live_validation_complete: ${summary.live_validation_complete}`,
      `- live_provider_validated: ${summary.live_provider_validated}`,
      "",
      "A42 reads B1/A33 evidence and produces forecast intelligence only. It does not enable Placement V3 or claim live-provider, real-user, or production readiness.",
    ],
  );

  return summary;
}

function generateScoreboard(summary = generateOperatingSummary()) {
  const riskSignals = {
    ciDegradationRisk: labelValue(summary.ciDegradationRisk, "forecastClassification"),
    recoveryRisk: labelValue(summary.recoveryRisk, "recoveryClassification"),
    resilienceState: labelValue(summary.resilienceState, "resilienceClassification"),
    anomalyState: labelValue(summary.anomalyState, "anomalyClassification"),
    enduranceTimeoutRisk: labelValue(summary.enduranceContext.timeoutRisk, "forecastClassification"),
  };
  const scoreboard = {
    generatedAt: new Date().toISOString(),
    agent: "A42",
    branch: EXPECTED_BRANCH,
    classifications: ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL", "BLOCKED_BY_MISSING_EVIDENCE"],
    riskSignals,
    missingInputs: summary.missingInputs,
    rejectedInputs: summary.rejectedInputs,
    stale: summary.stalenessDetection.stale,
    evidenceFreshness: summary.evidenceFreshness,
    forecastClassification: summary.classification,
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "a42-reliability-forecast-scoreboard",
    scoreboard,
    [
      "# A42 Reliability Forecast Scoreboard",
      "",
      `Generated: ${scoreboard.generatedAt}`,
      "",
      `- Forecast classification: ${scoreboard.forecastClassification}`,
      `- CI degradation risk: ${scoreboard.riskSignals.ciDegradationRisk}`,
      `- Recovery risk: ${scoreboard.riskSignals.recoveryRisk}`,
      `- Resilience state: ${scoreboard.riskSignals.resilienceState}`,
      `- Anomaly state: ${scoreboard.riskSignals.anomalyState}`,
      `- Endurance timeout risk: ${scoreboard.riskSignals.enduranceTimeoutRisk}`,
      `- Missing inputs: ${scoreboard.missingInputs.join(", ") || "none"}`,
      `- Rejected inputs: ${scoreboard.rejectedInputs.join(", ") || "none"}`,
      `- Evidence freshness: ${scoreboard.evidenceFreshness.label}`,
      "",
      "Blocked classifications are safe outputs when evidence is missing or stale.",
    ],
  );

  return scoreboard;
}

function generateHandoffReport(summary = generateOperatingSummary(), scoreboard = generateScoreboard(summary), sources = ingestSources()) {
  const missingA33 = sources.filter((source) => source.key.startsWith("a33_") && !source.present);
  const rejected = sources.filter((source) => source.rejected);
  const lines = [
    "# A42 Reliability Handoff Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## What B1 Already Proved",
    "",
    "- B1 generated local reliability guardrail evidence, anomaly detection, CI degradation forecasts, recovery forecasts, resilience summaries, health summaries, and claim-safety checks.",
    "- A42 treats those B1 artifacts as read-only source evidence.",
    "",
    "## What A33 Adds As Supporting Evidence",
    "",
    summary.enduranceContext.health.present || summary.enduranceContext.timeoutRisk.present
      ? "- A33 endurance context is present and included as supporting forecast evidence."
      : "- A33 endurance context is missing in this branch; A42 therefore keeps the forecast blocked-safe.",
    "",
    "## Missing A33 Files",
    "",
    ...(
      missingA33.length > 0
        ? missingA33.flatMap((source) => [
            `- ${source.key}: ${source.canonicalPath}`,
            `  - Place a copied artifact at canonical path: ${source.canonicalPath}`,
            `  - Or place it in A42 dropbox as: ${path.join(DROPBOX_DIR, path.basename(source.canonicalPath))}`,
            `  - Or preserve it under reports/agent-runs/ with the same basename: ${path.basename(source.canonicalPath)}`,
          ])
        : ["- None."]
    ),
    "",
    "## Rejected Evidence",
    "",
    ...(rejected.length > 0 ? rejected.map((source) => `- ${source.key}: ${source.path} (${source.rejectionReasons.join("; ")})`) : ["- None."]),
    "",
    "## What Remains Unknown",
    "",
    "- Live-provider behavior remains unvalidated by A42 evidence.",
    "- Real-user cohort behavior remains unvalidated by A42 evidence.",
    "- Long-horizon CI runner variance beyond available source summaries remains unknown.",
    "- A42 does not execute endurance suites and does not own product test fixes.",
    "",
    "## What Cannot Be Claimed",
    "",
    "- Production readiness cannot be claimed.",
    "- Placement V3 enablement cannot be claimed.",
    "- Live-provider readiness cannot be claimed.",
    "- Real-user readiness cannot be claimed.",
    "",
    "## Evidence That Would Unlock Staging Reliability Validation",
    "",
    "- Fresh B1 reliability summaries with branch metadata and explicit safety fields.",
    "- Fresh A33 endurance health and timeout-risk summaries.",
    "- Staging-scoped reliability runs with artifact retention and no unsupported readiness claims.",
    "- Explicit validation that feature flags remain disabled until separate release governance authorizes otherwise.",
    "",
    "## Current A42 Forecast",
    "",
    `- Forecast classification: ${scoreboard.forecastClassification}`,
    `- Endurance health summary missing: ${missingA33.some((source) => source.key === "a33_endurance_health")}`,
    `- Timeout risk forecast missing: ${missingA33.some((source) => source.key === "a33_timeout_risk_forecast")}`,
    `- Missing inputs: ${summary.missingInputs.join(", ") || "none"}`,
    `- Rejected inputs: ${summary.rejectedInputs.join(", ") || "none"}`,
    `- production_safe: ${summary.production_safe}`,
    `- placement_v3_enabled: ${summary.placement_v3_enabled}`,
    `- live_provider_validated: ${summary.live_provider_validated}`,
  ];
  const file = path.join(OUT_DIR, "a42-reliability-handoff-report.md");
  writeFileSync(file, `${lines.join("\n")}\n`);
  console.log(`[a42] wrote ${file}`);
}

function generateSourceManifest(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const found = sources.filter((source) => source.present && !source.rejected);
  const missing = sources.filter((source) => !source.present);
  const rejected = sources.filter((source) => source.rejected);
  const manifest = {
    generatedAt: new Date().toISOString(),
    agent: "A42",
    branch: EXPECTED_BRANCH,
    resolutionOrder: ["canonical repo paths", DROPBOX_DIR, AGENT_RUNS_DIR, "blocked-safe missing input state"],
    foundInputs: found.map(sourceManifestRow),
    missingInputs: missing.map(sourceManifestRow),
    rejectedInputs: rejected.map(sourceManifestRow),
    sourcePaths: sources.map((source) => ({
      key: source.key,
      selectedPath: source.path,
      canonicalPath: source.canonicalPath,
      sourceTier: source.sourceTier,
    })),
    freshness: freshnessSummary(sources),
    safetyFields: sources.map((source) => ({
      key: source.key,
      production_safe: source.data ? safetyBoolean(source.data, "production_safe") : null,
      placement_v3_enabled: source.data ? safetyBoolean(source.data, "placement_v3_enabled") : null,
      placement_test_enabled: source.data ? safetyBoolean(source.data, "placement_test_enabled") : null,
      placement_v3_ui_enabled: source.data ? safetyBoolean(source.data, "placement_v3_ui_enabled") : null,
      live_validation_complete: source.data ? safetyBoolean(source.data, "live_validation_complete") : null,
      live_provider_validated: source.data ? safetyBoolean(source.data, "live_provider_validated") : null,
      real_user_validated: source.data ? safetyBoolean(source.data, "real_user_validated") : null,
      missingSafetyFields: source.missingSafetyFields,
      unsafeProductionClaim: source.unsafeProductionClaim,
    })),
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "a42-evidence-source-manifest",
    manifest,
    [
      "# A42 Evidence Source Manifest",
      "",
      `Generated: ${manifest.generatedAt}`,
      "",
      `- Found inputs: ${manifest.foundInputs.map((source) => source.key).join(", ") || "none"}`,
      `- Missing inputs: ${manifest.missingInputs.map((source) => source.key).join(", ") || "none"}`,
      `- Rejected inputs: ${manifest.rejectedInputs.map((source) => source.key).join(", ") || "none"}`,
      `- Evidence freshness: ${manifest.freshness.label}`,
      "",
      "## Resolution Order",
      "",
      ...manifest.resolutionOrder.map((item, index) => `${index + 1}. ${item}`),
      "",
      "## Selected Sources",
      "",
      ...manifest.sourcePaths.map((source) => `- ${source.key}: ${source.sourceTier} -> ${source.selectedPath}`),
      "",
      "A42 rejects or blocks unsafe imported evidence instead of treating it as merge or enablement authority.",
    ],
  );

  return manifest;
}

function generateLineageMap(sources: SourceStatus[]) {
  const lineage = {
    generatedAt: new Date().toISOString(),
    agent: "A42",
    branch: EXPECTED_BRANCH,
    inputs: sources.map((source) => ({
      key: source.key,
      sourcePath: source.path,
      canonicalPath: source.canonicalPath,
      sourceTier: source.sourceTier,
      sourceAgent: source.sourceAgent,
      sourceBranch: source.branch,
      sourceCommit: source.sourceCommit,
      checksum: source.checksum,
      ingestionStatus: source.rejected ? "rejected" : source.present ? "accepted" : "missing",
      rejectionReasons: source.rejectionReasons,
      stale: source.stale,
      fresh: source.present && !source.stale,
      generatedAt: source.generatedAt,
      ageHours: source.ageHours,
      safetyClassification: source.safetyClassification,
      missingSafetyFields: source.missingSafetyFields,
    })),
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    safetyPosition: safetyPosition(),
  };
  writeReliabilityJsonAndMarkdown(
    "a42-reliability-evidence-lineage",
    lineage,
    [
      "# A42 Reliability Evidence Lineage",
      "",
      `Generated: ${lineage.generatedAt}`,
      "",
      ...lineage.inputs.map(
        (source) =>
          `- ${source.key}: ${source.ingestionStatus}, ${source.sourceTier}, agent=${source.sourceAgent}, branch=${source.sourceBranch ?? "missing"}, commit=${source.sourceCommit ?? "missing"}, checksum=${source.checksum ?? "missing"}, safety=${source.safetyClassification}`,
      ),
      "",
      "A42 lineage records evidence provenance only. It does not mutate B1/A33 execution or enable Placement V3.",
    ],
  );
  return lineage;
}

function generateEnduranceReadinessMatrix(sources: SourceStatus[]) {
  const enduranceHealth = sources.find((source) => source.key === "a33_endurance_health");
  const timeoutForecast = sources.find((source) => source.key === "a33_timeout_risk_forecast");
  const checks = [
    readinessCheck("endurance_health_summary_presence", !!enduranceHealth?.present && !enduranceHealth.rejected),
    readinessCheck("timeout_risk_forecast_presence", !!timeoutForecast?.present && !timeoutForecast.rejected),
    readinessCheck("long_session_stability", boolEvidence(enduranceHealth?.data, ["longSessionStable", "long_session_stability"])),
    readinessCheck("provider_retry_stability", boolEvidence(enduranceHealth?.data, ["providerRetryStable", "provider_retry_stability"])),
    readinessCheck("replay_durability", boolEvidence(enduranceHealth?.data, ["replayDurable", "replay_durability"])),
    readinessCheck("ci_runtime_stability", boolEvidence(timeoutForecast?.data, ["ciRuntimeStable", "ci_runtime_stability"])),
    readinessCheck("assessment_session_timeout_risk", lowRiskEvidence(timeoutForecast?.data, ["assessmentSessionTimeoutRisk", "assessment_session_timeout_risk"])),
    readinessCheck("failover_timeout_risk", lowRiskEvidence(timeoutForecast?.data, ["failoverTimeoutRisk", "failover_timeout_risk"])),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const matrix = {
    generatedAt: new Date().toISOString(),
    agent: "A42",
    branch: EXPECTED_BRANCH,
    checks,
    riskClassification,
    ready: riskClassification === "RELIABILITY_READY",
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    safetyPosition: safetyPosition(),
  };
  writeReliabilityJsonAndMarkdown(
    "a42-endurance-readiness-matrix",
    matrix,
    [
      "# A42 Endurance Readiness Matrix",
      "",
      `Generated: ${matrix.generatedAt}`,
      "",
      `- Reliability risk classification: ${matrix.riskClassification}`,
      `- Ready: ${matrix.ready}`,
      "",
      ...matrix.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "All readiness checks remain evidence-gated. Missing A33 endurance inputs keep A42 blocked-safe.",
    ],
  );
  return matrix;
}

function generatePlacementReliabilityForecast(sources: SourceStatus[], readiness: ReturnType<typeof generateEnduranceReadinessMatrix>) {
  const timeoutForecast = sources.find((source) => source.key === "a33_timeout_risk_forecast")?.data ?? null;
  const categories = [
    latencyForecast(timeoutForecast, "adaptive_session_duration", ["adaptiveSessionDuration", "adaptive_session_duration"]),
    latencyForecast(timeoutForecast, "speaking_item_processing_latency", ["speakingItemProcessingLatency", "speaking_item_processing_latency"]),
    latencyForecast(timeoutForecast, "writing_item_processing_latency", ["writingItemProcessingLatency", "writing_item_processing_latency"]),
    latencyForecast(timeoutForecast, "translation_item_latency", ["translationItemLatency", "translation_item_latency"]),
    latencyForecast(timeoutForecast, "azure_phoneme_scoring_latency", ["azurePhonemeScoringLatency", "azure_phoneme_scoring_latency"]),
    latencyForecast(timeoutForecast, "openai_gemini_failover_latency", ["openaiGeminiFailoverLatency", "openai_gemini_failover_latency"]),
    latencyForecast(timeoutForecast, "replay_validation_runtime", ["replayValidationRuntime", "replay_validation_runtime"]),
    latencyForecast(timeoutForecast, "human_review_handoff_latency", ["humanReviewHandoffLatency", "human_review_handoff_latency"]),
  ];
  const unknownCount = categories.filter((item) => item.status === "UNKNOWN").length;
  const riskClassification =
    readiness.riskClassification !== "RELIABILITY_READY"
      ? readiness.riskClassification
      : unknownCount > 0
        ? "BLOCKED_BY_PROVIDER_LATENCY_UNKNOWN"
        : "RELIABILITY_READY";
  const forecast = {
    generatedAt: new Date().toISOString(),
    agent: "A42",
    branch: EXPECTED_BRANCH,
    standard: "Duolingo-standard placement reliability forecast",
    categories,
    unknownCount,
    riskClassification,
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    safetyPosition: safetyPosition(),
  };
  writeReliabilityJsonAndMarkdown(
    "a42-placement-reliability-forecast",
    forecast,
    [
      "# A42 Placement Reliability Forecast",
      "",
      `Generated: ${forecast.generatedAt}`,
      "",
      `- Reliability risk classification: ${forecast.riskClassification}`,
      `- Unknown latency categories: ${forecast.unknownCount}`,
      "",
      ...forecast.categories.map((item) => `- ${item.name}: ${item.status} (${item.reason})`),
      "",
      "This forecast is non-production, evidence-gated, and does not make live-provider calls.",
    ],
  );
  return forecast;
}

function generateProviderLatencyRisk(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    latencyVarianceCheck(timeoutForecast, "openai_latency_variance", ["openaiLatencyVariance", "openai_latency_variance"]),
    latencyVarianceCheck(timeoutForecast, "gemini_failover_latency_variance", ["geminiFailoverLatencyVariance", "gemini_failover_latency_variance"]),
    latencyVarianceCheck(timeoutForecast, "azure_phoneme_scoring_latency_variance", [
      "azurePhonemeScoringLatencyVariance",
      "azure_phoneme_scoring_latency_variance",
    ]),
    latencyVarianceCheck(timeoutForecast, "human_review_handoff_latency", ["humanReviewHandoffLatency", "human_review_handoff_latency"]),
    latencyVarianceCheck(timeoutForecast, "provider_timeout_unknowns", ["providerTimeoutUnknowns", "provider_timeout_unknowns"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = reliabilityForecastReport("provider latency risk", checks, riskClassification);
  writeReliabilityJsonAndMarkdown(
    "a42-provider-latency-risk",
    report,
    [
      "# A42 Provider Latency Risk",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Provider latency risk remains blocked-safe until A33 endurance and timeout evidence provide bounded latency variance.",
    ],
  );
  return report;
}

function generateAdaptiveSessionReliability(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    readinessCheck("adaptive_session_timeout_risk", lowRiskEvidence(timeoutForecast, ["adaptiveSessionTimeoutRisk", "adaptive_session_timeout_risk"])),
    readinessCheck("long_session_degradation_risk", lowRiskEvidence(enduranceHealth, ["longSessionDegradationRisk", "long_session_degradation_risk"])),
    readinessCheck("ci_runtime_stability", boolEvidence(timeoutForecast, ["ciRuntimeStable", "ci_runtime_stability"])),
    readinessCheck("assessment_session_timeout_risk", lowRiskEvidence(timeoutForecast, ["assessmentSessionTimeoutRisk", "assessment_session_timeout_risk"])),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = reliabilityForecastReport("adaptive session reliability", checks, riskClassification);
  writeReliabilityJsonAndMarkdown(
    "a42-adaptive-session-reliability",
    report,
    [
      "# A42 Adaptive Session Reliability",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Adaptive-session reliability remains blocked-safe until long-session and timeout evidence are present and fresh.",
    ],
  );
  return report;
}

function generateReplayDurabilityForecast(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    readinessCheck("replay_durability_uncertainty", boolEvidence(enduranceHealth, ["replayDurable", "replay_durability"])),
    latencyVarianceCheck(timeoutForecast, "replay_validation_runtime", ["replayValidationRuntime", "replay_validation_runtime"]),
    readinessCheck("replay_evidence_unknowns", boolEvidence(enduranceHealth, ["replayEvidenceComplete", "replay_evidence_complete"])),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = reliabilityForecastReport("replay durability forecast", checks, riskClassification);
  writeReliabilityJsonAndMarkdown(
    "a42-replay-durability-forecast",
    report,
    [
      "# A42 Replay Durability Forecast",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Replay durability remains blocked-safe until replay evidence is present, fresh, and explicitly durable.",
    ],
  );
  return report;
}

function generateFailoverStabilityForecast(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    readinessCheck("failover_retry_stability", boolEvidence(enduranceHealth, ["failoverRetryStable", "failover_retry_stability"])),
    readinessCheck("provider_retry_stability", boolEvidence(enduranceHealth, ["providerRetryStable", "provider_retry_stability"])),
    latencyVarianceCheck(timeoutForecast, "openai_gemini_failover_latency", ["openaiGeminiFailoverLatency", "openai_gemini_failover_latency"]),
    readinessCheck("failover_timeout_risk", lowRiskEvidence(timeoutForecast, ["failoverTimeoutRisk", "failover_timeout_risk"])),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = reliabilityForecastReport("failover stability forecast", checks, riskClassification);
  writeReliabilityJsonAndMarkdown(
    "a42-failover-stability-forecast",
    report,
    [
      "# A42 Failover Stability Forecast",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Failover stability remains blocked-safe until retry stability and failover latency evidence are bounded.",
    ],
  );
  return report;
}

function generateReliabilityThresholdPolicy(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const checks = [
    thresholdCheck(timeoutForecast, "max_acceptable_provider_latency", ["maxAcceptableProviderLatency", "max_acceptable_provider_latency"]),
    thresholdCheck(timeoutForecast, "max_adaptive_session_duration", ["maxAdaptiveSessionDuration", "max_adaptive_session_duration"]),
    thresholdCheck(timeoutForecast, "speaking_scoring_timeout_threshold", ["speakingScoringTimeoutThreshold", "speaking_scoring_timeout_threshold"]),
    thresholdCheck(timeoutForecast, "writing_scoring_timeout_threshold", ["writingScoringTimeoutThreshold", "writing_scoring_timeout_threshold"]),
    thresholdCheck(timeoutForecast, "azure_phoneme_timeout_threshold", ["azurePhonemeTimeoutThreshold", "azure_phoneme_timeout_threshold"]),
    thresholdCheck(enduranceHealth, "replay_durability_threshold", ["replayDurabilityThreshold", "replay_durability_threshold"]),
    thresholdCheck(timeoutForecast, "human_review_handoff_sla", ["humanReviewHandoffSla", "human_review_handoff_sla"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = reliabilityForecastReport("reliability threshold policy", checks, riskClassification);
  writeReliabilityJsonAndMarkdown(
    "a42-reliability-threshold-policy",
    report,
    [
      "# A42 Reliability Threshold Policy",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Threshold policy remains blocked-safe until A33 evidence defines explicit latency, timeout, replay, and handoff thresholds.",
    ],
  );
  return report;
}

function generateTimeoutIncidentSimulation(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    readinessCheck("timeout_incident_risk", lowRiskEvidence(timeoutForecast, ["timeoutIncidentRisk", "timeout_incident_risk"])),
    readinessCheck("adaptive_session_timeout_risk", lowRiskEvidence(timeoutForecast, ["adaptiveSessionTimeoutRisk", "adaptive_session_timeout_risk"])),
    readinessCheck("assessment_session_timeout_risk", lowRiskEvidence(timeoutForecast, ["assessmentSessionTimeoutRisk", "assessment_session_timeout_risk"])),
    readinessCheck("provider_timeout_unknowns", boolEvidence(timeoutForecast, ["providerTimeoutsResolved", "provider_timeouts_resolved"])),
    readinessCheck("failover_timeout_risk", lowRiskEvidence(timeoutForecast, ["failoverTimeoutRisk", "failover_timeout_risk"])),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = reliabilityForecastReport("timeout incident simulation", checks, riskClassification);
  writeReliabilityJsonAndMarkdown(
    "a42-timeout-incident-simulation",
    report,
    [
      "# A42 Timeout Incident Simulation",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Timeout incident simulation is planning-only and remains blocked until timeout behavior is evidenced by A33 artifacts.",
    ],
  );
  return report;
}

function generateProviderRetryBudgetPolicy(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    thresholdCheck(timeoutForecast, "retry_budget_ceiling", ["retryBudgetCeiling", "retry_budget_ceiling"]),
    thresholdCheck(timeoutForecast, "failover_retry_limit", ["failoverRetryLimit", "failover_retry_limit"]),
    readinessCheck("provider_retry_stability", boolEvidence(enduranceHealth, ["providerRetryStable", "provider_retry_stability"])),
    readinessCheck("failover_retry_stability", boolEvidence(enduranceHealth, ["failoverRetryStable", "failover_retry_stability"])),
    readinessCheck("provider_timeout_unknowns", boolEvidence(timeoutForecast, ["providerTimeoutsResolved", "provider_timeouts_resolved"])),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = reliabilityForecastReport("provider retry budget policy", checks, riskClassification);
  writeReliabilityJsonAndMarkdown(
    "a42-provider-retry-budget-policy",
    report,
    [
      "# A42 Provider Retry Budget Policy",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Provider retry budget policy remains blocked-safe until retry ceilings, failover limits, and provider timeout behavior are evidenced.",
    ],
  );
  return report;
}

function generateAssessmentSessionSlaPlan(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    thresholdCheck(timeoutForecast, "max_adaptive_session_duration", ["maxAdaptiveSessionDuration", "max_adaptive_session_duration"]),
    thresholdCheck(timeoutForecast, "speaking_scoring_timeout_threshold", ["speakingScoringTimeoutThreshold", "speaking_scoring_timeout_threshold"]),
    thresholdCheck(timeoutForecast, "writing_scoring_timeout_threshold", ["writingScoringTimeoutThreshold", "writing_scoring_timeout_threshold"]),
    thresholdCheck(timeoutForecast, "azure_phoneme_timeout_threshold", ["azurePhonemeTimeoutThreshold", "azure_phoneme_timeout_threshold"]),
    thresholdCheck(timeoutForecast, "human_review_handoff_sla", ["humanReviewHandoffSla", "human_review_handoff_sla"]),
    readinessCheck("assessment_session_timeout_risk", lowRiskEvidence(timeoutForecast, ["assessmentSessionTimeoutRisk", "assessment_session_timeout_risk"])),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = reliabilityForecastReport("assessment session SLA plan", checks, riskClassification);
  writeReliabilityJsonAndMarkdown(
    "a42-assessment-session-sla-plan",
    report,
    [
      "# A42 Assessment Session SLA Plan",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Assessment-session SLA planning remains blocked-safe until session duration, scoring timeout, and handoff thresholds are evidenced.",
    ],
  );
  return report;
}

function generateReliabilityEvidenceSchemaContract(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    evidenceSchemaCheck(enduranceHealth, "a33_endurance_evidence_schema", ["longSessionStable", "providerRetryStable", "replayDurable"]),
    evidenceSchemaCheck(timeoutForecast, "timeout_risk_evidence_schema", ["assessmentSessionTimeoutRisk", "failoverTimeoutRisk", "timeoutIncidentRisk"]),
    evidenceSchemaCheck(timeoutForecast, "provider_latency_evidence_schema", [
      "openaiLatencyVariance",
      "geminiFailoverLatencyVariance",
      "azurePhonemeScoringLatencyVariance",
    ]),
    evidenceSchemaCheck(enduranceHealth, "replay_durability_evidence_schema", ["replayDurable", "replayEvidenceComplete", "replayDurabilityThreshold"]),
    evidenceSchemaCheck(timeoutForecast, "retry_budget_evidence_requirements", ["retryBudgetCeiling", "failoverRetryLimit", "providerTimeoutsResolved"]),
    evidenceSchemaCheck(timeoutForecast, "assessment_session_sla_evidence_requirements", [
      "maxAdaptiveSessionDuration",
      "speakingScoringTimeoutThreshold",
      "writingScoringTimeoutThreshold",
      "humanReviewHandoffSla",
    ]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = schemaReport("reliability evidence schema contract", checks, riskClassification, [
    "A33 endurance summaries must expose long-session, retry, replay, and threshold evidence.",
    "A33 timeout forecasts must expose timeout risk, provider latency, retry budget, and SLA evidence.",
    "A42 treats absent source fields as blocked evidence, not as passing defaults.",
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-reliability-evidence-schema-contract",
    report,
    [
      "# A42 Reliability Evidence Schema Contract",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "This contract describes required evidence shapes only. It does not fabricate missing A33 evidence or enable Placement V3.",
    ],
  );
  return report;
}

function generatePilotEnduranceTestPlan(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    evidenceSchemaCheck(enduranceHealth, "pilot_endurance_test_requirements", ["pilotRunCount", "pilotDurationMinutes", "longSessionStable"]),
    evidenceSchemaCheck(timeoutForecast, "pilot_timeout_threshold_requirements", [
      "assessmentSessionTimeoutRisk",
      "speakingScoringTimeoutThreshold",
      "writingScoringTimeoutThreshold",
      "azurePhonemeTimeoutThreshold",
    ]),
    evidenceSchemaCheck(enduranceHealth, "pilot_replay_durability_requirements", ["replayDurable", "replayEvidenceComplete"]),
    evidenceSchemaCheck(timeoutForecast, "pilot_provider_latency_requirements", [
      "openaiLatencyVariance",
      "geminiFailoverLatencyVariance",
      "azurePhonemeScoringLatencyVariance",
    ]),
    evidenceSchemaCheck(timeoutForecast, "pilot_retry_budget_requirements", ["retryBudgetCeiling", "failoverRetryLimit"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = schemaReport("pilot endurance test plan", checks, riskClassification, [
    "Pilot endurance must include repeated adaptive-session runs, provider-latency capture, replay checks, and timeout-threshold validation.",
    "Pilot evidence must remain artifact-backed and safety-flagged before A42 can classify readiness differently.",
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-pilot-endurance-test-plan",
    report,
    [
      "# A42 Pilot Endurance Test Plan",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "The pilot plan is blocked-safe planning only. A42 does not run endurance tests or mutate A33 execution.",
    ],
  );
  return report;
}

function generateTimeoutThresholdSchema(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    thresholdCheck(timeoutForecast, "speaking_scoring_timeout_threshold", ["speakingScoringTimeoutThreshold", "speaking_scoring_timeout_threshold"]),
    thresholdCheck(timeoutForecast, "writing_scoring_timeout_threshold", ["writingScoringTimeoutThreshold", "writing_scoring_timeout_threshold"]),
    thresholdCheck(timeoutForecast, "azure_phoneme_timeout_threshold", ["azurePhonemeTimeoutThreshold", "azure_phoneme_timeout_threshold"]),
    thresholdCheck(timeoutForecast, "assessment_session_timeout_risk", ["assessmentSessionTimeoutRisk", "assessment_session_timeout_risk"]),
    thresholdCheck(timeoutForecast, "failover_timeout_risk", ["failoverTimeoutRisk", "failover_timeout_risk"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = schemaReport("timeout threshold schema", checks, riskClassification, [
    "Timeout schema requires explicit scoring thresholds for speaking, writing, and Azure phoneme scoring.",
    "Assessment-session and failover timeout risk must be present in A33 timeout evidence.",
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-timeout-threshold-schema",
    report,
    [
      "# A42 Timeout Threshold Schema",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Timeout schema validation remains blocked until timeout thresholds are provided by source evidence.",
    ],
  );
  return report;
}

function generateProviderLatencyEvidenceSchema(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    evidenceSchemaCheck(timeoutForecast, "openai_latency_evidence", ["openaiLatencyVariance", "maxAcceptableProviderLatency"]),
    evidenceSchemaCheck(timeoutForecast, "gemini_failover_latency_evidence", ["geminiFailoverLatencyVariance", "openaiGeminiFailoverLatency"]),
    evidenceSchemaCheck(timeoutForecast, "azure_phoneme_latency_evidence", ["azurePhonemeScoringLatencyVariance", "azurePhonemeTimeoutThreshold"]),
    evidenceSchemaCheck(timeoutForecast, "provider_timeout_evidence", ["providerTimeoutsResolved", "providerTimeoutUnknowns"]),
    evidenceSchemaCheck(timeoutForecast, "human_review_handoff_latency_evidence", ["humanReviewHandoffLatency", "humanReviewHandoffSla"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = schemaReport("provider latency evidence schema", checks, riskClassification, [
    "Provider latency schema requires bounded OpenAI, Gemini failover, Azure phoneme, timeout, and handoff evidence.",
    "A42 does not infer latency from absent artifacts.",
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-provider-latency-evidence-schema",
    report,
    [
      "# A42 Provider Latency Evidence Schema",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Provider latency schema validation remains blocked until source evidence provides bounded provider metrics.",
    ],
  );
  return report;
}

function generatePilotEnduranceAcceptanceCriteria(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    evidenceSchemaCheck(enduranceHealth, "pilot_run_count_acceptance", ["pilotRunCount", "minimumPassingPilotRuns"]),
    evidenceSchemaCheck(enduranceHealth, "long_session_acceptance", ["longSessionStable", "longSessionDegradationRisk"]),
    evidenceSchemaCheck(timeoutForecast, "timeout_acceptance", ["assessmentSessionTimeoutRisk", "timeoutIncidentRisk"]),
    evidenceSchemaCheck(enduranceHealth, "replay_acceptance", ["replayDurable", "replayEvidenceComplete"]),
    evidenceSchemaCheck(timeoutForecast, "provider_latency_acceptance", [
      "openaiLatencyVariance",
      "geminiFailoverLatencyVariance",
      "azurePhonemeScoringLatencyVariance",
    ]),
    evidenceSchemaCheck(timeoutForecast, "retry_budget_acceptance", ["retryBudgetCeiling", "failoverRetryLimit"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = schemaReport("pilot endurance acceptance criteria", checks, riskClassification, [
    "Acceptance criteria require artifact-backed run counts, long-session stability, timeout risk, replay durability, provider latency, and retry budget evidence.",
    "A42 cannot accept pilot endurance readiness from missing or implied evidence.",
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-pilot-endurance-acceptance-criteria",
    report,
    [
      "# A42 Pilot Endurance Acceptance Criteria",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Pilot endurance acceptance criteria remain blocked-safe until A33 evidence satisfies every required field.",
    ],
  );
  return report;
}

function generateReliabilityIncidentResponsePlan(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    evidenceSchemaCheck(timeoutForecast, "timeout_incident_triage", ["timeoutIncidentRisk", "timeoutEscalationOwner", "timeoutEscalationWindow"]),
    evidenceSchemaCheck(timeoutForecast, "provider_latency_incident_triage", ["providerTimeoutsResolved", "maxAcceptableProviderLatency"]),
    evidenceSchemaCheck(enduranceHealth, "replay_incident_triage", ["replayDurable", "replayEvidenceComplete"]),
    evidenceSchemaCheck(timeoutForecast, "retry_budget_incident_triage", ["retryBudgetCeiling", "failoverRetryLimit"]),
    evidenceSchemaCheck(timeoutForecast, "session_sla_incident_triage", ["maxAdaptiveSessionDuration", "humanReviewHandoffSla"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = schemaReport("reliability incident response plan", checks, riskClassification, [
    "Incident response planning requires explicit timeout, provider, replay, retry, and session-SLA triage evidence.",
    "A42 stores response-plan requirements only and does not claim incident readiness while evidence is missing.",
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-reliability-incident-response-plan",
    report,
    [
      "# A42 Reliability Incident Response Plan",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Incident response planning remains blocked-safe until source evidence defines the required triage and escalation fields.",
    ],
  );
  return report;
}

function generateProviderTimeoutEscalationPolicy(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    thresholdCheck(timeoutForecast, "provider_timeout_escalation_window", ["providerTimeoutEscalationWindow", "provider_timeout_escalation_window"]),
    thresholdCheck(timeoutForecast, "failover_timeout_escalation_window", ["failoverTimeoutEscalationWindow", "failover_timeout_escalation_window"]),
    thresholdCheck(timeoutForecast, "provider_timeout_incident_threshold", ["providerTimeoutIncidentThreshold", "provider_timeout_incident_threshold"]),
    thresholdCheck(timeoutForecast, "speaking_scoring_timeout_threshold", ["speakingScoringTimeoutThreshold", "speaking_scoring_timeout_threshold"]),
    thresholdCheck(timeoutForecast, "azure_phoneme_timeout_threshold", ["azurePhonemeTimeoutThreshold", "azure_phoneme_timeout_threshold"]),
    readinessCheck("provider_timeout_unknowns", boolEvidence(timeoutForecast, ["providerTimeoutsResolved", "provider_timeouts_resolved"])),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = schemaReport("provider timeout escalation policy", checks, riskClassification, [
    "Timeout escalation requires explicit escalation windows, incident thresholds, scoring thresholds, and provider-timeout resolution evidence.",
    "Escalation planning does not invoke providers or alter runtime behavior.",
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-provider-timeout-escalation-policy",
    report,
    [
      "# A42 Provider Timeout Escalation Policy",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Provider timeout escalation remains blocked-safe until timeout escalation evidence is present.",
    ],
  );
  return report;
}

function generateReliabilitySafetyMarginPolicy(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const enduranceHealth = sourceData(sources, "a33_endurance_health");
  const timeoutForecast = sourceData(sources, "a33_timeout_risk_forecast");
  const checks = [
    thresholdCheck(timeoutForecast, "provider_latency_safety_margin", ["providerLatencySafetyMargin", "provider_latency_safety_margin"]),
    thresholdCheck(timeoutForecast, "adaptive_session_duration_safety_margin", ["adaptiveSessionDurationSafetyMargin", "adaptive_session_duration_safety_margin"]),
    thresholdCheck(timeoutForecast, "scoring_timeout_safety_margin", ["scoringTimeoutSafetyMargin", "scoring_timeout_safety_margin"]),
    thresholdCheck(timeoutForecast, "human_review_handoff_safety_margin", ["humanReviewHandoffSafetyMargin", "human_review_handoff_safety_margin"]),
    thresholdCheck(enduranceHealth, "replay_durability_safety_margin", ["replayDurabilitySafetyMargin", "replay_durability_safety_margin"]),
    readinessCheck("long_session_degradation_risk", lowRiskEvidence(enduranceHealth, ["longSessionDegradationRisk", "long_session_degradation_risk"])),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = schemaReport("reliability safety margin policy", checks, riskClassification, [
    "Safety margins require explicit buffers for provider latency, adaptive sessions, scoring timeouts, handoff latency, and replay durability.",
    "A42 keeps safety-margin policy incomplete when margins are not backed by A33 evidence.",
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-reliability-safety-margin-policy",
    report,
    [
      "# A42 Reliability Safety Margin Policy",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Reliability safety margins remain blocked-safe until all margin evidence is present and bounded.",
    ],
  );
  return report;
}

function generateCrossStreamReliabilityDependencies(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const a33Endurance = sourceData(sources, "a33_endurance_health");
  const a33Timeout = sourceData(sources, "a33_timeout_risk_forecast");
  const a39Capacity = sourceData(sources, "a39_capacity_projections");
  const a45Provider = sourceData(sources, "a45_provider_calibration_dependencies");
  const a47Observability = sourceData(sources, "a47_observability_retention_drift_telemetry");
  const a49Replay = sourceData(sources, "a49_replay_reproducibility_thresholds");
  const a50Supervision = sourceData(sources, "a50_supervised_execution_constraints");
  const checks = [
    evidenceSchemaCheck(a33Endurance, "a33_endurance_to_adaptive_session_forecast", ["longSessionStable", "longSessionDegradationRisk"]),
    evidenceSchemaCheck(a33Timeout, "a33_timeout_to_escalation_readiness", ["timeoutIncidentRisk", "assessmentSessionTimeoutRisk"]),
    evidenceSchemaCheck(a39Capacity, "endurance_to_capacity_coupling", ["capacityProjection", "adaptiveSessionCapacityHeadroom"]),
    evidenceSchemaCheck(a45Provider, "provider_degradation_thresholds", ["providerDegradationThresholds", "failoverLineage"]),
    evidenceSchemaCheck(a47Observability, "observability_retention_assumptions", ["retentionWindowHours", "driftTelemetryAvailable"]),
    evidenceSchemaCheck(a49Replay, "replay_durability_assumptions", ["replayReproducibilityThreshold", "replayDurabilityConfidence"]),
    evidenceSchemaCheck(a50Supervision, "supervised_execution_dependencies", ["autonomous_execution", "supervisedOnly", "operatorApprovalRequired"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = crossStreamReport("cross-stream reliability dependencies", checks, riskClassification, [
    dependencyRow("A33", "endurance inputs", "adaptive-session endurance forecasting", !!a33Endurance),
    dependencyRow("A33", "timeout risk forecast", "timeout escalation readiness", !!a33Timeout),
    dependencyRow("A39", "capacity projections", "endurance-to-capacity coupling", !!a39Capacity),
    dependencyRow("A45", "provider calibration dependencies", "provider degradation and failover thresholds", !!a45Provider),
    dependencyRow("A47", "observability retention/drift telemetry", "drift-aware reliability correlation", !!a47Observability),
    dependencyRow("A49", "replay reproducibility thresholds", "replay durability confidence", !!a49Replay),
    dependencyRow("A50", "supervised execution constraints", "pilot reliability gating", !!a50Supervision),
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-cross-stream-reliability-dependencies",
    report,
    [
      "# A42 Cross-Stream Reliability Dependencies",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      "",
      ...report.dependencyLineage.map((item) => `- ${item.agent}: ${item.input} -> ${item.output} (${item.status})`),
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "A42 records cross-stream dependency lineage only. Missing upstream evidence keeps pilot reliability gating blocked-safe.",
    ],
  );
  return report;
}

function generateReplayDurabilityGovernance(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const a33Endurance = sourceData(sources, "a33_endurance_health");
  const a49Replay = sourceData(sources, "a49_replay_reproducibility_thresholds");
  const a47Observability = sourceData(sources, "a47_observability_retention_drift_telemetry");
  const a50Supervision = sourceData(sources, "a50_supervised_execution_constraints");
  const checks = [
    evidenceSchemaCheck(a33Endurance, "a33_replay_durability_inputs", ["replayDurable", "replayEvidenceComplete"]),
    evidenceSchemaCheck(a49Replay, "replay_durability_assumptions", ["replayReproducibilityThreshold", "replayDurabilityConfidence"]),
    evidenceSchemaCheck(a49Replay, "replay_reproducibility_thresholds", ["deterministicReplayRate", "replayMismatchThreshold"]),
    evidenceSchemaCheck(a47Observability, "observability_retention_for_replay", ["retentionWindowHours", "traceRetentionPolicy"]),
    evidenceSchemaCheck(a50Supervision, "supervised_replay_execution_constraints", ["supervisedOnly", "operatorApprovalRequired"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = crossStreamReport("replay durability governance", checks, riskClassification, [
    dependencyRow("A33", "replay durability evidence", "replay durability confidence", !!a33Endurance),
    dependencyRow("A49", "replay reproducibility thresholds", "replay governance thresholds", !!a49Replay),
    dependencyRow("A47", "trace and retention telemetry", "replay evidence preservation", !!a47Observability),
    dependencyRow("A50", "supervised execution constraints", "supervised replay gating", !!a50Supervision),
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-replay-durability-governance",
    report,
    [
      "# A42 Replay Durability Governance",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      "",
      ...report.dependencyLineage.map((item) => `- ${item.agent}: ${item.input} -> ${item.output} (${item.status})`),
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Replay durability governance remains blocked-safe and does not certify replay behavior without A49/A33/A47/A50 evidence.",
    ],
  );
  return report;
}

function generateProviderFailoverStabilityModel(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const a33Timeout = sourceData(sources, "a33_timeout_risk_forecast");
  const a45Provider = sourceData(sources, "a45_provider_calibration_dependencies");
  const a47Observability = sourceData(sources, "a47_observability_retention_drift_telemetry");
  const a50Supervision = sourceData(sources, "a50_supervised_execution_constraints");
  const checks = [
    evidenceSchemaCheck(a45Provider, "failover_lineage", ["failoverLineage", "providerCalibrationVersion"]),
    evidenceSchemaCheck(a45Provider, "provider_degradation_thresholds", ["providerDegradationThresholds", "providerCalibrationBounds"]),
    evidenceSchemaCheck(a33Timeout, "timeout_escalation_dependencies", ["failoverTimeoutRisk", "providerTimeoutsResolved"]),
    evidenceSchemaCheck(a47Observability, "failover_observability_retention", ["retentionWindowHours", "providerDriftTelemetry"]),
    evidenceSchemaCheck(a50Supervision, "supervised_failover_constraints", ["supervisedOnly", "operatorApprovalRequired"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = crossStreamReport("provider failover stability model", checks, riskClassification, [
    dependencyRow("A45", "provider calibration dependencies", "failover lineage and degradation thresholds", !!a45Provider),
    dependencyRow("A33", "timeout risk forecast", "timeout escalation dependencies", !!a33Timeout),
    dependencyRow("A47", "provider drift telemetry", "failover observability correlation", !!a47Observability),
    dependencyRow("A50", "supervised execution constraints", "supervised failover gating", !!a50Supervision),
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-provider-failover-stability-model",
    report,
    [
      "# A42 Provider Failover Stability Model",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      "",
      ...report.dependencyLineage.map((item) => `- ${item.agent}: ${item.input} -> ${item.output} (${item.status})`),
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Provider failover stability modeling is evidence-only and does not change provider execution.",
    ],
  );
  return report;
}

function generateObservabilityReliabilityCorrelation(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const a33Endurance = sourceData(sources, "a33_endurance_health");
  const a39Capacity = sourceData(sources, "a39_capacity_projections");
  const a47Observability = sourceData(sources, "a47_observability_retention_drift_telemetry");
  const a49Replay = sourceData(sources, "a49_replay_reproducibility_thresholds");
  const checks = [
    evidenceSchemaCheck(a47Observability, "observability_retention_assumptions", ["retentionWindowHours", "traceRetentionPolicy"]),
    evidenceSchemaCheck(a47Observability, "drift_telemetry_correlation", ["driftTelemetryAvailable", "reliabilityCorrelationSignals"]),
    evidenceSchemaCheck(a33Endurance, "endurance_signal_correlation", ["longSessionStable", "longSessionDegradationRisk"]),
    evidenceSchemaCheck(a39Capacity, "capacity_signal_correlation", ["capacityProjection", "adaptiveSessionCapacityHeadroom"]),
    evidenceSchemaCheck(a49Replay, "replay_signal_correlation", ["replayReproducibilityThreshold", "replayMismatchThreshold"]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = crossStreamReport("observability reliability correlation", checks, riskClassification, [
    dependencyRow("A47", "observability retention/drift telemetry", "reliability correlation visibility", !!a47Observability),
    dependencyRow("A33", "endurance inputs", "endurance signal correlation", !!a33Endurance),
    dependencyRow("A39", "capacity projections", "capacity reliability correlation", !!a39Capacity),
    dependencyRow("A49", "replay reproducibility thresholds", "replay signal correlation", !!a49Replay),
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-observability-reliability-correlation",
    report,
    [
      "# A42 Observability Reliability Correlation",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      "",
      ...report.dependencyLineage.map((item) => `- ${item.agent}: ${item.input} -> ${item.output} (${item.status})`),
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Observability correlation remains blocked-safe until retention, drift, endurance, capacity, and replay evidence are present.",
    ],
  );
  return report;
}

function generateReliabilityGovernanceReconciliationLedger(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const a39CapacityDenial = sourceData(sources, "a39_capacity_denial_provider_burst_governance");
  const a44HumanReview = sourceData(sources, "a44_human_review_backlog_approval_denial");
  const a45DriftDenial = sourceData(sources, "a45_provider_validation_drift_denial");
  const a46Contradictions = sourceData(sources, "a46_governance_contradiction_audits");
  const a47Continuity = sourceData(sources, "a47_observability_reconciliation_audit_continuity");
  const a48ReleaseDenial = sourceData(sources, "a48_release_canary_denial_governance");
  const a49ReplayContradictions = sourceData(sources, "a49_replay_reproducibility_contradiction_auditing");
  const a50SupervisionDenial = sourceData(sources, "a50_supervised_execution_denial_governance");
  const checks = [
    evidenceSchemaCheck(a39CapacityDenial, "capacity_denial_and_provider_burst_governance", [
      "capacityDenied",
      "providerBurstDenied",
      "burstGovernanceReason",
    ]),
    evidenceSchemaCheck(a44HumanReview, "human_review_backlog_and_approval_denial", [
      "humanReviewBacklogState",
      "approvalDenied",
      "approvalDenialReason",
    ]),
    evidenceSchemaCheck(a45DriftDenial, "provider_validation_and_drift_denial", [
      "providerValidationDenied",
      "driftDenied",
      "providerDegradationLineage",
    ]),
    evidenceSchemaCheck(a46Contradictions, "governance_contradiction_audit", [
      "contradictionAuditComplete",
      "unresolvedContradictions",
      "unsupportedReadinessClaims",
    ]),
    evidenceSchemaCheck(a47Continuity, "observability_reconciliation_and_audit_continuity", [
      "auditContinuityEvidence",
      "observabilityDependencies",
      "retentionContinuity",
    ]),
    evidenceSchemaCheck(a48ReleaseDenial, "release_and_canary_denial_governance", [
      "releaseDenied",
      "canaryDenied",
      "denialAuthority",
    ]),
    evidenceSchemaCheck(a49ReplayContradictions, "replay_reproducibility_contradiction_auditing", [
      "replayContradictionAuditComplete",
      "replayDurabilityContinuity",
      "unresolvedReplayContradictions",
    ]),
    evidenceSchemaCheck(a50SupervisionDenial, "supervised_execution_denial_governance", [
      "autonomous_execution",
      "supervisedOnly",
      "executionDenied",
    ]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = crossStreamReport("reliability governance reconciliation ledger", checks, riskClassification, [
    dependencyRow("A39", "capacity denial and provider burst governance", "capacity-gated reliability reconciliation", !!a39CapacityDenial),
    dependencyRow("A44", "human-review backlog and approval denial", "review-gated reliability reconciliation", !!a44HumanReview),
    dependencyRow("A45", "provider validation and drift denial", "provider-gated reliability reconciliation", !!a45DriftDenial),
    dependencyRow("A46", "governance contradiction audits", "unsupported readiness reconciliation", !!a46Contradictions),
    dependencyRow("A47", "observability reconciliation and audit continuity", "audit-continuity-backed reconciliation", !!a47Continuity),
    dependencyRow("A48", "release/canary denial governance", "release-denial-aware reliability reconciliation", !!a48ReleaseDenial),
    dependencyRow("A49", "replay contradiction auditing", "replay-continuity-aware reconciliation", !!a49ReplayContradictions),
    dependencyRow("A50", "supervised execution denial governance", "supervised-only reliability gating", !!a50SupervisionDenial),
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-reliability-governance-reconciliation-ledger",
    report,
    [
      "# A42 Reliability Governance Reconciliation Ledger",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      `- schema_completeness: ${report.schema_completeness}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      "",
      ...report.dependencyLineage.map((item) => `- ${item.agent}: ${item.input} -> ${item.output} (${item.status})`),
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "A42 reconciles denial and contradiction evidence only. Missing upstream governance evidence preserves blocked-safe reliability posture.",
    ],
  );
  return report;
}

function generateFailoverContradictionDetector(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const a39CapacityDenial = sourceData(sources, "a39_capacity_denial_provider_burst_governance");
  const a45DriftDenial = sourceData(sources, "a45_provider_validation_drift_denial");
  const a46Contradictions = sourceData(sources, "a46_governance_contradiction_audits");
  const a47Continuity = sourceData(sources, "a47_observability_reconciliation_audit_continuity");
  const a49ReplayContradictions = sourceData(sources, "a49_replay_reproducibility_contradiction_auditing");
  const a50SupervisionDenial = sourceData(sources, "a50_supervised_execution_denial_governance");
  const checks = [
    evidenceSchemaCheck(a39CapacityDenial, "provider_burst_denial_lineage", ["providerBurstDenied", "burstGovernanceReason"]),
    evidenceSchemaCheck(a45DriftDenial, "provider_degradation_lineage", [
      "providerDegradationLineage",
      "providerValidationDenied",
      "driftDenied",
    ]),
    evidenceSchemaCheck(a46Contradictions, "failover_contradictions_unresolved", [
      "failoverContradictionAuditComplete",
      "unresolvedFailoverContradictions",
    ]),
    evidenceSchemaCheck(a47Continuity, "observability_dependencies_for_failover", [
      "observabilityDependencies",
      "providerDriftTelemetry",
      "auditContinuityEvidence",
    ]),
    evidenceSchemaCheck(a49ReplayContradictions, "replay_failover_contradiction_trace", [
      "replayFailoverContradictions",
      "replayDurabilityContinuity",
    ]),
    evidenceSchemaCheck(a50SupervisionDenial, "supervised_execution_dependencies_for_failover", [
      "supervisedOnly",
      "executionDenied",
      "operatorApprovalRequired",
    ]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = crossStreamReport("failover contradiction detector", checks, riskClassification, [
    dependencyRow("A39", "provider burst denial governance", "burst/failover contradiction detection", !!a39CapacityDenial),
    dependencyRow("A45", "provider validation and drift denial", "provider degradation contradiction detection", !!a45DriftDenial),
    dependencyRow("A46", "governance contradiction audits", "failover contradiction closure", !!a46Contradictions),
    dependencyRow("A47", "observability audit continuity", "failover evidence continuity", !!a47Continuity),
    dependencyRow("A49", "replay contradiction auditing", "replay/failover contradiction traceability", !!a49ReplayContradictions),
    dependencyRow("A50", "supervised execution denial", "supervised-only failover gating", !!a50SupervisionDenial),
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-failover-contradiction-detector",
    report,
    [
      "# A42 Failover Contradiction Detector",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      `- schema_completeness: ${report.schema_completeness}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      "",
      ...report.dependencyLineage.map((item) => `- ${item.agent}: ${item.input} -> ${item.output} (${item.status})`),
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Failover contradictions remain unresolved until provider, capacity, observability, replay, and supervision evidence is complete.",
    ],
  );
  return report;
}

function generateReplayDurabilityContinuityMap(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const a44HumanReview = sourceData(sources, "a44_human_review_backlog_approval_denial");
  const a46Contradictions = sourceData(sources, "a46_governance_contradiction_audits");
  const a47Continuity = sourceData(sources, "a47_observability_reconciliation_audit_continuity");
  const a49ReplayContradictions = sourceData(sources, "a49_replay_reproducibility_contradiction_auditing");
  const a50SupervisionDenial = sourceData(sources, "a50_supervised_execution_denial_governance");
  const checks = [
    evidenceSchemaCheck(a49ReplayContradictions, "replay_durability_continuity", [
      "replayDurabilityContinuity",
      "replayContinuityWindow",
      "unresolvedReplayContradictions",
    ]),
    evidenceSchemaCheck(a47Continuity, "observability_audit_continuity_for_replay", [
      "auditContinuityEvidence",
      "retentionContinuity",
      "traceRetentionPolicy",
    ]),
    evidenceSchemaCheck(a46Contradictions, "replay_governance_contradiction_closure", [
      "contradictionAuditComplete",
      "unsupportedReadinessClaims",
      "unresolvedContradictions",
    ]),
    evidenceSchemaCheck(a44HumanReview, "human_review_replay_approval_denial", [
      "approvalDenied",
      "humanReviewBacklogState",
      "reviewContinuityEvidence",
    ]),
    evidenceSchemaCheck(a50SupervisionDenial, "supervised_replay_continuity_constraints", [
      "supervisedOnly",
      "executionDenied",
      "operatorApprovalRequired",
    ]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = crossStreamReport("replay durability continuity map", checks, riskClassification, [
    dependencyRow("A49", "replay reproducibility contradiction auditing", "replay durability continuity", !!a49ReplayContradictions),
    dependencyRow("A47", "observability audit continuity", "trace-retained replay continuity", !!a47Continuity),
    dependencyRow("A46", "governance contradiction audits", "unsupported replay readiness detection", !!a46Contradictions),
    dependencyRow("A44", "human-review approval denial", "human-review-gated replay continuity", !!a44HumanReview),
    dependencyRow("A50", "supervised execution denial", "supervised-only replay continuity", !!a50SupervisionDenial),
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-replay-durability-continuity-map",
    report,
    [
      "# A42 Replay Durability Continuity Map",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      `- schema_completeness: ${report.schema_completeness}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      "",
      ...report.dependencyLineage.map((item) => `- ${item.agent}: ${item.input} -> ${item.output} (${item.status})`),
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "Replay durability continuity is documented as blocked-safe incomplete until upstream continuity and contradiction evidence is present.",
    ],
  );
  return report;
}

function generateBlockedSafeReliabilityCertification(existingSources?: SourceStatus[]) {
  const sources = existingSources ?? ingestSources();
  const a33Endurance = sourceData(sources, "a33_endurance_health");
  const a39CapacityDenial = sourceData(sources, "a39_capacity_denial_provider_burst_governance");
  const a44HumanReview = sourceData(sources, "a44_human_review_backlog_approval_denial");
  const a45DriftDenial = sourceData(sources, "a45_provider_validation_drift_denial");
  const a46Contradictions = sourceData(sources, "a46_governance_contradiction_audits");
  const a47Continuity = sourceData(sources, "a47_observability_reconciliation_audit_continuity");
  const a48ReleaseDenial = sourceData(sources, "a48_release_canary_denial_governance");
  const a49ReplayContradictions = sourceData(sources, "a49_replay_reproducibility_contradiction_auditing");
  const a50SupervisionDenial = sourceData(sources, "a50_supervised_execution_denial_governance");
  const checks = [
    evidenceSchemaCheck(a33Endurance, "endurance_validation_supporting_evidence", ["longSessionStable", "replayDurable"]),
    evidenceSchemaCheck(a39CapacityDenial, "capacity_denial_supporting_evidence", ["capacityDenied", "providerBurstDenied"]),
    evidenceSchemaCheck(a44HumanReview, "human_review_denial_supporting_evidence", ["approvalDenied", "humanReviewBacklogState"]),
    evidenceSchemaCheck(a45DriftDenial, "provider_drift_denial_supporting_evidence", [
      "providerValidationDenied",
      "providerDegradationLineage",
    ]),
    evidenceSchemaCheck(a46Contradictions, "unsupported_readiness_claim_detection", [
      "unsupportedReadinessClaims",
      "contradictionAuditComplete",
    ]),
    evidenceSchemaCheck(a47Continuity, "observability_dependency_supporting_evidence", [
      "observabilityDependencies",
      "auditContinuityEvidence",
    ]),
    evidenceSchemaCheck(a48ReleaseDenial, "release_canary_denial_supporting_evidence", ["releaseDenied", "canaryDenied"]),
    evidenceSchemaCheck(a49ReplayContradictions, "replay_continuity_supporting_evidence", [
      "replayDurabilityContinuity",
      "unresolvedReplayContradictions",
    ]),
    evidenceSchemaCheck(a50SupervisionDenial, "supervised_execution_denial_supporting_evidence", [
      "autonomous_execution",
      "supervisedOnly",
      "executionDenied",
    ]),
  ];
  const riskClassification = classifyReliabilityRisk(sources, checks);
  const report = crossStreamReport("blocked-safe reliability certification", checks, riskClassification, [
    dependencyRow("A33", "endurance validation", "blocked-safe reliability certificate support", !!a33Endurance),
    dependencyRow("A39", "capacity denial and provider burst governance", "blocked-safe capacity support", !!a39CapacityDenial),
    dependencyRow("A44", "human-review denial evidence", "blocked-safe approval support", !!a44HumanReview),
    dependencyRow("A45", "provider drift denial evidence", "blocked-safe provider support", !!a45DriftDenial),
    dependencyRow("A46", "contradiction audits", "unsupported readiness detection support", !!a46Contradictions),
    dependencyRow("A47", "observability audit continuity", "blocked-safe observability support", !!a47Continuity),
    dependencyRow("A48", "release/canary denial governance", "blocked-safe release support", !!a48ReleaseDenial),
    dependencyRow("A49", "replay contradiction auditing", "blocked-safe replay support", !!a49ReplayContradictions),
    dependencyRow("A50", "supervised execution denial governance", "blocked-safe supervision support", !!a50SupervisionDenial),
  ]);
  writeReliabilityJsonAndMarkdown(
    "a42-blocked-safe-reliability-certification",
    report,
    [
      "# A42 Blocked-Safe Reliability Certification",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Reliability risk classification: ${report.riskClassification}`,
      `- Ready: ${report.ready}`,
      `- Complete: ${report.complete}`,
      `- schema_completeness: ${report.schema_completeness}`,
      `- autonomous_execution: ${report.autonomous_execution}`,
      `- production_safe: ${report.production_safe}`,
      `- placement_v3_enabled: ${report.placement_v3_enabled}`,
      `- live_provider_validated: ${report.live_provider_validated}`,
      "",
      ...report.dependencyLineage.map((item) => `- ${item.agent}: ${item.input} -> ${item.output} (${item.status})`),
      "",
      ...report.checks.map((check) => `- ${check.name}: ${check.status} (${check.reason})`),
      "",
      "This artifact certifies only that A42 remains blocked-safe under missing evidence. It is not production, provider, replay, release, or enablement approval.",
    ],
  );
  return report;
}

function ingestSources(): SourceStatus[] {
  return SOURCES.map((source) => {
    const resolved = resolveSource(source.path);
    if (!resolved) {
      return {
        key: source.key,
        path: source.path,
        canonicalPath: source.path,
        sourceTier: "missing",
        required: source.required,
        present: false,
        rejected: false,
        rejectionReasons: [],
        stale: true,
        ageHours: null,
        branch: null,
        generatedAt: null,
        missingSafetyFields: [
          "production_safe",
          "placement_v3_enabled",
          "placement_test_enabled",
          "placement_v3_ui_enabled",
          "live_validation_complete",
          "live_provider_validated",
          "real_user_validated",
        ],
        unsafeProductionClaim: false,
        checksum: null,
        sourceAgent: sourceAgentForKey(source.key),
        sourceCommit: null,
        safetyClassification: "MISSING",
        data: null,
      };
    }
    const raw = readFileSync(resolved.path, "utf8");
    const data = JSON.parse(raw) as Record<string, unknown>;
    const generatedAt = typeof data.generatedAt === "string" ? data.generatedAt : null;
    const ageHours = generatedAt ? (Date.now() - Date.parse(generatedAt)) / (60 * 60 * 1000) : null;
    const stale = ageHours === null || ageHours > STALENESS_THRESHOLD_HOURS;
    const branch = typeof data.branch === "string" ? data.branch : null;
    const rejectionReasons = importedEvidenceRejectionReasons(data);
    return {
      key: source.key,
      path: resolved.path,
      canonicalPath: source.path,
      sourceTier: resolved.tier,
      required: source.required,
      present: true,
      rejected: rejectionReasons.length > 0,
      rejectionReasons,
      stale: stale || rejectionReasons.length > 0,
      ageHours,
      branch,
      generatedAt,
      missingSafetyFields: safetyFieldGaps(data),
      unsafeProductionClaim: rejectionReasons.length > 0,
      checksum: checksum(raw),
      sourceAgent: sourceAgentForKey(source.key),
      sourceCommit: sourceCommit(data),
      safetyClassification: safetyClassification(data, rejectionReasons),
      data,
    };
  });
}

function resolveSource(canonicalPath: string): { path: string; tier: SourceStatus["sourceTier"] } | null {
  if (existsSync(canonicalPath)) return { path: canonicalPath, tier: "canonical" };

  const basename = path.basename(canonicalPath);
  const dropboxCandidate = path.join(DROPBOX_DIR, basename);
  if (existsSync(dropboxCandidate)) return { path: dropboxCandidate, tier: "evidence-dropbox" };

  const reportCandidate = findByBasename(AGENT_RUNS_DIR, basename);
  if (reportCandidate) return { path: reportCandidate, tier: "reports-agent-runs" };

  return null;
}

function importedEvidenceRejectionReasons(data: Record<string, unknown>) {
  const reasons: string[] = [];
  for (const key of [
    "production_safe",
    "placement_v3_enabled",
    "placement_test_enabled",
    "placement_v3_ui_enabled",
    "live_validation_complete",
    "live_provider_validated",
    "real_user_validated",
  ]) {
    if (safetyBoolean(data, key) === true && !hasExplicitVerifiedEvidence(data, key)) {
      reasons.push(`${key}=true_without_explicit_verified_evidence`);
    }
  }
  return reasons;
}

function hasExplicitVerifiedEvidence(data: Record<string, unknown>, key: string) {
  const evidence = data.verifiedEvidence;
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) return false;
  return (evidence as Record<string, unknown>)[key] === true;
}

function pickSource(sources: SourceStatus[], key: string) {
  const source = sources.find((item) => item.key === key);
  return {
    present: source?.present ?? false,
    stale: source?.stale ?? true,
    ageHours: source?.ageHours ?? null,
    branch: source?.branch ?? null,
    generatedAt: source?.generatedAt ?? null,
    data: source?.data ?? null,
  };
}

function aggregateRisk(sources: SourceStatus[]): RiskClassification {
  const values = sources.flatMap((source) => {
    if (!source.data) return ["BLOCKED_BY_MISSING_EVIDENCE" as RiskClassification];
    return [
      riskFromValue(source.data.forecastClassification),
      riskFromValue(source.data.recoveryClassification),
      riskFromValue(source.data.resilienceClassification),
      riskFromValue(source.data.anomalyClassification),
      riskFromValue(source.data.confidenceClassification),
    ];
  });
  return maxRisk(values);
}

function classifyReliabilityRisk(sources: SourceStatus[], checks: Array<{ name: string; status: string }>): ReliabilityRiskClassification {
  if (sources.some((source) => source.rejected)) return "BLOCKED_BY_GOVERNANCE";
  if (sources.some((source) => source.key.startsWith("a33_") && !source.present)) return "BLOCKED_BY_MISSING_A33_ENDURANCE_INPUTS";
  if (checks.some((check) => check.name.includes("adaptive_session") && check.status !== "PASS")) return "BLOCKED_BY_ADAPTIVE_SESSION_RISK";
  if (checks.some((check) => check.name === "provider_retry_stability" && check.status !== "PASS")) return "BLOCKED_BY_PROVIDER_LATENCY_UNKNOWN";
  if (checks.some((check) => check.name === "replay_durability" && check.status !== "PASS")) return "BLOCKED_BY_REPLAY_DURABILITY_UNKNOWN";
  if (checks.some((check) => check.name.includes("replay") && check.status !== "PASS")) return "BLOCKED_BY_REPLAY_DURABILITY_UNKNOWN";
  if (checks.some((check) => check.name === "failover_timeout_risk" && check.status !== "PASS")) return "BLOCKED_BY_FAILOVER_LATENCY_UNKNOWN";
  if (checks.some((check) => check.name.includes("failover") && check.status !== "PASS")) return "BLOCKED_BY_FAILOVER_LATENCY_UNKNOWN";
  if (checks.some((check) => check.name.includes("provider") && check.status !== "PASS")) return "BLOCKED_BY_PROVIDER_LATENCY_UNKNOWN";
  if (checks.some((check) => check.name.includes("latency") && check.status !== "PASS")) return "BLOCKED_BY_PROVIDER_LATENCY_UNKNOWN";
  if (checks.some((check) => check.name.includes("timeout") && check.status !== "PASS")) return "BLOCKED_BY_TIMEOUT_RISK";
  if (sources.some((source) => source.missingSafetyFields.length > 0 || source.stale)) return "BLOCKED_BY_GOVERNANCE";
  return "RELIABILITY_READY";
}

function readinessCheck(name: string, passed: boolean | null) {
  return {
    name,
    status: passed === true ? "PASS" : "BLOCKED",
    reason: passed === true ? "evidence_present" : "missing_or_insufficient_evidence",
  };
}

function boolEvidence(data: Record<string, unknown> | null | undefined, keys: string[]) {
  if (!data) return null;
  for (const key of keys) {
    const value = nestedValue(data, key);
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return ["pass", "passed", "stable", "low"].includes(value.toLowerCase());
  }
  return null;
}

function lowRiskEvidence(data: Record<string, unknown> | null | undefined, keys: string[]) {
  if (!data) return null;
  for (const key of keys) {
    const value = nestedValue(data, key);
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return ["low", "pass", "passed", "stable", "none"].includes(value.toLowerCase());
  }
  return null;
}

function latencyForecast(data: Record<string, unknown> | null, name: string, keys: string[]) {
  const value = data ? keys.map((key) => nestedValue(data, key)).find((item) => item !== undefined) : undefined;
  const status = value === undefined ? "UNKNOWN" : "EVIDENCE_PRESENT";
  return {
    name,
    status,
    value: value ?? null,
    reason: status === "UNKNOWN" ? "missing_latency_forecast_evidence" : "source_forecast_present",
  };
}

function latencyVarianceCheck(data: Record<string, unknown> | null, name: string, keys: string[]) {
  const forecast = latencyForecast(data, name, keys);
  return {
    name: forecast.name,
    status: forecast.status === "EVIDENCE_PRESENT" ? "PASS" : "BLOCKED",
    value: forecast.value,
    reason: forecast.status === "EVIDENCE_PRESENT" ? "bounded_forecast_evidence_present" : "missing_latency_or_timeout_evidence",
  };
}

function thresholdCheck(data: Record<string, unknown> | null, name: string, keys: string[]) {
  const value = data ? keys.map((key) => nestedValue(data, key)).find((item) => item !== undefined) : undefined;
  const hasThreshold = value !== undefined && value !== null && value !== "";
  return {
    name,
    status: hasThreshold ? "PASS" : "BLOCKED",
    value: hasThreshold ? value : null,
    reason: hasThreshold ? "threshold_defined_by_source_evidence" : "missing_threshold_policy_evidence",
  };
}

function evidenceSchemaCheck(data: Record<string, unknown> | null, name: string, requiredKeys: string[]) {
  const missingFields = data ? requiredKeys.filter((key) => nestedValue(data, key) === undefined) : requiredKeys;
  return {
    name,
    status: missingFields.length === 0 ? "PASS" : "BLOCKED",
    requiredFields: requiredKeys,
    missingFields,
    reason: missingFields.length === 0 ? "schema_fields_present_in_source_evidence" : "missing_schema_fields_or_source_evidence",
  };
}

function sourceData(sources: SourceStatus[], key: string) {
  return sources.find((source) => source.key === key)?.data ?? null;
}

function sourceAgentForKey(key: string) {
  const match = key.match(/^a(\d+)_/i);
  if (match) return `A${match[1]}`;
  return "B1";
}

function reliabilityForecastReport(name: string, checks: Array<{ name: string; status: string; reason: string; value?: unknown }>, riskClassification: ReliabilityRiskClassification) {
  return {
    generatedAt: new Date().toISOString(),
    agent: "A42",
    branch: EXPECTED_BRANCH,
    forecast: name,
    checks,
    blockedChecks: checks.filter((check) => check.status !== "PASS").map((check) => check.name),
    riskClassification,
    ready: riskClassification === "RELIABILITY_READY",
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    autonomous_execution: "SUPERVISED_ONLY",
    safetyPosition: safetyPosition(),
  };
}

function schemaReport(
  name: string,
  checks: Array<{ name: string; status: string; reason: string; requiredFields?: string[]; missingFields?: string[]; value?: unknown }>,
  riskClassification: ReliabilityRiskClassification,
  contractNotes: string[],
) {
  return {
    generatedAt: new Date().toISOString(),
    agent: "A42",
    branch: EXPECTED_BRANCH,
    schema: name,
    checks,
    contractNotes,
    incompleteChecks: checks.filter((check) => check.status !== "PASS").map((check) => check.name),
    complete: checks.every((check) => check.status === "PASS"),
    riskClassification,
    ready: riskClassification === "RELIABILITY_READY",
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    autonomous_execution: "SUPERVISED_ONLY",
    safetyPosition: safetyPosition(),
  };
}

function crossStreamReport(
  name: string,
  checks: Array<{ name: string; status: string; reason: string; requiredFields?: string[]; missingFields?: string[]; value?: unknown }>,
  riskClassification: ReliabilityRiskClassification,
  dependencyLineage: Array<{ agent: string; input: string; output: string; status: string }>,
) {
  return {
    generatedAt: new Date().toISOString(),
    agent: "A42",
    branch: EXPECTED_BRANCH,
    governance: name,
    dependencyLineage,
    checks,
    incompleteChecks: checks.filter((check) => check.status !== "PASS").map((check) => check.name),
    complete: checks.every((check) => check.status === "PASS"),
    schema_completeness: checks.every((check) => check.status === "PASS"),
    riskClassification,
    ready: riskClassification === "RELIABILITY_READY",
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    autonomous_execution: "SUPERVISED_ONLY",
    safetyPosition: safetyPosition(),
  };
}

function dependencyRow(agent: string, input: string, output: string, present: boolean) {
  return {
    agent,
    input,
    output,
    status: present ? "source_present_unverified" : "missing_source_evidence",
  };
}

function nestedValue(data: Record<string, unknown>, key: string): unknown {
  if (key in data) return data[key];
  const reliability = data.reliability;
  if (reliability && typeof reliability === "object" && !Array.isArray(reliability) && key in reliability) {
    return (reliability as Record<string, unknown>)[key];
  }
  const metrics = data.metrics;
  if (metrics && typeof metrics === "object" && !Array.isArray(metrics) && key in metrics) {
    return (metrics as Record<string, unknown>)[key];
  }
  return undefined;
}

function riskFromValue(value: unknown): RiskClassification {
  if (value === "CRITICAL" || value === "BLOCKED" || value === "HIGH_RISK" || value === "RECOVERY_RISK") return "CRITICAL";
  if (value === "HIGH" || value === "CI_TIMEOUT_RISK" || value === "DEGRADED") return "HIGH";
  if (value === "ELEVATED" || value === "ANOMALY") return "ELEVATED";
  if (value === "MODERATE" || value === "WATCH" || value === "STABLE_UNDER_CONTENTION") return "MODERATE";
  if (value === "LOW" || value === "NORMAL" || value === "STRONG_LOCAL") return "LOW";
  return "LOW";
}

function maxRisk(values: RiskClassification[]): RiskClassification {
  const order: RiskClassification[] = ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL", "BLOCKED_BY_MISSING_EVIDENCE"];
  return values.sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] ?? "BLOCKED_BY_MISSING_EVIDENCE";
}

function freshnessSummary(sources: SourceStatus[]) {
  const present = sources.filter((source) => source.present && source.ageHours !== null);
  const oldestAgeHours = present.length > 0 ? Math.max(...present.map((source) => source.ageHours ?? 0)) : null;
  const missingCount = sources.filter((source) => !source.present).length;
  const staleCount = sources.filter((source) => source.stale).length;
  return {
    thresholdHours: STALENESS_THRESHOLD_HOURS,
    oldestAgeHours,
    missingCount,
    staleCount,
    label: missingCount > 0 ? "blocked_missing_inputs" : staleCount > 0 ? "stale" : "fresh",
  };
}

function safetyFieldGaps(data: Record<string, unknown>) {
  const gaps: string[] = [];
  if (typeof safetyBoolean(data, "production_safe") !== "boolean") gaps.push("production_safe");
  if (typeof safetyBoolean(data, "placement_v3_enabled") !== "boolean") gaps.push("placement_v3_enabled");
  if (typeof safetyBoolean(data, "placement_test_enabled") !== "boolean") gaps.push("placement_test_enabled");
  if (typeof safetyBoolean(data, "placement_v3_ui_enabled") !== "boolean") gaps.push("placement_v3_ui_enabled");
  if (typeof safetyBoolean(data, "live_validation_complete") !== "boolean") gaps.push("live_validation_complete");
  if (typeof safetyBoolean(data, "live_provider_validated") !== "boolean") gaps.push("live_provider_validated");
  if (typeof safetyBoolean(data, "real_user_validated") !== "boolean") gaps.push("real_user_validated");
  return gaps;
}

function safetyBoolean(data: Record<string, unknown>, key: string) {
  if (typeof data[key] === "boolean") return data[key];
  const safety = data.safetyPosition;
  if (safety && typeof safety === "object" && !Array.isArray(safety)) {
    const value = (safety as Record<string, unknown>)[key];
    if (typeof value === "boolean") return value;
  }
  return null;
}

function labelValue(source: { present: boolean; data: Record<string, unknown> | null }, key: string) {
  if (!source.present || !source.data) return "missing";
  const value = source.data[key];
  return typeof value === "string" ? value : "unknown";
}

function safetyPosition() {
  return {
    production_safe: false,
    placement_v3_enabled: false,
    placement_test_enabled: false,
    placement_v3_ui_enabled: false,
    live_validation_complete: false,
    live_provider_validated: false,
    real_user_validated: false,
    autonomous_execution: "SUPERVISED_ONLY",
    productionReadiness: "NO",
    placementV3Enablement: "BLOCKED",
  };
}

function sourceCommit(data: Record<string, unknown>) {
  for (const key of ["commit", "sourceCommit", "gitCommit", "commitSha", "sha"]) {
    const value = data[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return null;
}

function safetyClassification(data: Record<string, unknown>, rejectionReasons: string[]) {
  if (rejectionReasons.length > 0) return "UNSAFE_TRUE_FLAGS";
  const gaps = safetyFieldGaps(data);
  if (gaps.length > 0) return "MISSING_SAFETY_FIELDS";
  return "SAFE_FALSE_FLAGS";
}

function checksum(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

function enforceStrictMode(
  sources: SourceStatus[],
  readiness: ReturnType<typeof generateEnduranceReadinessMatrix>,
  forecast: ReturnType<typeof generatePlacementReliabilityForecast>,
  providerLatencyRisk: ReturnType<typeof generateProviderLatencyRisk>,
  adaptiveSessionReliability: ReturnType<typeof generateAdaptiveSessionReliability>,
  replayDurability: ReturnType<typeof generateReplayDurabilityForecast>,
  failoverStability: ReturnType<typeof generateFailoverStabilityForecast>,
  thresholdPolicy: ReturnType<typeof generateReliabilityThresholdPolicy>,
  timeoutSimulation: ReturnType<typeof generateTimeoutIncidentSimulation>,
  retryBudget: ReturnType<typeof generateProviderRetryBudgetPolicy>,
  sessionSla: ReturnType<typeof generateAssessmentSessionSlaPlan>,
  evidenceSchema: ReturnType<typeof generateReliabilityEvidenceSchemaContract>,
  pilotEndurance: ReturnType<typeof generatePilotEnduranceTestPlan>,
  timeoutSchema: ReturnType<typeof generateTimeoutThresholdSchema>,
  latencySchema: ReturnType<typeof generateProviderLatencyEvidenceSchema>,
  enduranceCriteria: ReturnType<typeof generatePilotEnduranceAcceptanceCriteria>,
  incidentResponse: ReturnType<typeof generateReliabilityIncidentResponsePlan>,
  timeoutEscalation: ReturnType<typeof generateProviderTimeoutEscalationPolicy>,
  safetyMargin: ReturnType<typeof generateReliabilitySafetyMarginPolicy>,
  crossStream: ReturnType<typeof generateCrossStreamReliabilityDependencies>,
  replayGovernance: ReturnType<typeof generateReplayDurabilityGovernance>,
  failoverModel: ReturnType<typeof generateProviderFailoverStabilityModel>,
  observabilityCorrelation: ReturnType<typeof generateObservabilityReliabilityCorrelation>,
  reconciliationLedger: ReturnType<typeof generateReliabilityGovernanceReconciliationLedger>,
  contradictionDetector: ReturnType<typeof generateFailoverContradictionDetector>,
  durabilityContinuity: ReturnType<typeof generateReplayDurabilityContinuityMap>,
  blockedSafeCertification: ReturnType<typeof generateBlockedSafeReliabilityCertification>,
) {
  const failures = [
    ...sources.filter((source) => source.key.startsWith("a33_") && !source.present).map((source) => `missing required A33 input: ${source.key}`),
    ...sources.filter((source) => source.rejected).map((source) => `rejected evidence: ${source.key}`),
    ...sources.filter((source) => source.missingSafetyFields.length > 0).map((source) => `missing safety fields: ${source.key}`),
  ];
  if (readiness.riskClassification !== "RELIABILITY_READY") failures.push(`endurance readiness blocked: ${readiness.riskClassification}`);
  if (forecast.riskClassification !== "RELIABILITY_READY") failures.push(`placement reliability forecast blocked: ${forecast.riskClassification}`);
  if (providerLatencyRisk.riskClassification !== "RELIABILITY_READY") failures.push(`provider latency risk blocked: ${providerLatencyRisk.riskClassification}`);
  if (adaptiveSessionReliability.riskClassification !== "RELIABILITY_READY") {
    failures.push(`adaptive-session reliability blocked: ${adaptiveSessionReliability.riskClassification}`);
  }
  if (replayDurability.riskClassification !== "RELIABILITY_READY") failures.push(`replay durability blocked: ${replayDurability.riskClassification}`);
  if (failoverStability.riskClassification !== "RELIABILITY_READY") failures.push(`failover stability blocked: ${failoverStability.riskClassification}`);
  if (thresholdPolicy.riskClassification !== "RELIABILITY_READY") failures.push(`reliability threshold policy blocked: ${thresholdPolicy.riskClassification}`);
  if (timeoutSimulation.riskClassification !== "RELIABILITY_READY") failures.push(`timeout incident simulation blocked: ${timeoutSimulation.riskClassification}`);
  if (retryBudget.riskClassification !== "RELIABILITY_READY") failures.push(`provider retry budget blocked: ${retryBudget.riskClassification}`);
  if (sessionSla.riskClassification !== "RELIABILITY_READY") failures.push(`assessment session SLA blocked: ${sessionSla.riskClassification}`);
  if (evidenceSchema.riskClassification !== "RELIABILITY_READY") failures.push(`reliability evidence schema blocked: ${evidenceSchema.riskClassification}`);
  if (pilotEndurance.riskClassification !== "RELIABILITY_READY") failures.push(`pilot endurance test plan blocked: ${pilotEndurance.riskClassification}`);
  if (timeoutSchema.riskClassification !== "RELIABILITY_READY") failures.push(`timeout threshold schema blocked: ${timeoutSchema.riskClassification}`);
  if (latencySchema.riskClassification !== "RELIABILITY_READY") failures.push(`provider latency evidence schema blocked: ${latencySchema.riskClassification}`);
  if (enduranceCriteria.riskClassification !== "RELIABILITY_READY") {
    failures.push(`pilot endurance acceptance criteria blocked: ${enduranceCriteria.riskClassification}`);
  }
  if (incidentResponse.riskClassification !== "RELIABILITY_READY") failures.push(`reliability incident response plan blocked: ${incidentResponse.riskClassification}`);
  if (timeoutEscalation.riskClassification !== "RELIABILITY_READY") failures.push(`provider timeout escalation policy blocked: ${timeoutEscalation.riskClassification}`);
  if (safetyMargin.riskClassification !== "RELIABILITY_READY") failures.push(`reliability safety margin policy blocked: ${safetyMargin.riskClassification}`);
  if (crossStream.riskClassification !== "RELIABILITY_READY") failures.push(`cross-stream reliability dependencies blocked: ${crossStream.riskClassification}`);
  if (replayGovernance.riskClassification !== "RELIABILITY_READY") failures.push(`replay durability governance blocked: ${replayGovernance.riskClassification}`);
  if (failoverModel.riskClassification !== "RELIABILITY_READY") failures.push(`provider failover stability model blocked: ${failoverModel.riskClassification}`);
  if (observabilityCorrelation.riskClassification !== "RELIABILITY_READY") {
    failures.push(`observability reliability correlation blocked: ${observabilityCorrelation.riskClassification}`);
  }
  if (reconciliationLedger.riskClassification !== "RELIABILITY_READY") {
    failures.push(`reliability governance reconciliation ledger blocked: ${reconciliationLedger.riskClassification}`);
  }
  if (contradictionDetector.riskClassification !== "RELIABILITY_READY") {
    failures.push(`failover contradiction detector blocked: ${contradictionDetector.riskClassification}`);
  }
  if (durabilityContinuity.riskClassification !== "RELIABILITY_READY") {
    failures.push(`replay durability continuity map blocked: ${durabilityContinuity.riskClassification}`);
  }
  if (blockedSafeCertification.riskClassification !== "RELIABILITY_READY") {
    failures.push(`blocked-safe reliability certification blocked: ${blockedSafeCertification.riskClassification}`);
  }
  if (forecast.categories.some((item) => item.status === "UNKNOWN")) failures.push("provider or replay latency evidence unknown");
  if (providerLatencyRisk.checks.some((item) => item.status !== "PASS")) failures.push("provider latency evidence unknown");
  if (adaptiveSessionReliability.checks.some((item) => item.status !== "PASS")) failures.push("adaptive-session reliability evidence unknown");
  if (replayDurability.checks.some((item) => item.status !== "PASS")) failures.push("replay durability evidence unknown");
  if (failoverStability.checks.some((item) => item.status !== "PASS")) failures.push("failover stability evidence unknown");
  if (thresholdPolicy.checks.some((item) => item.status !== "PASS")) failures.push("reliability thresholds undefined");
  if (timeoutSimulation.checks.some((item) => item.status !== "PASS")) failures.push("timeout incident simulation missing");
  if (retryBudget.checks.some((item) => item.status !== "PASS")) failures.push("provider retry budget missing");
  if (sessionSla.checks.some((item) => item.status !== "PASS")) failures.push("assessment session SLA missing");
  if (!evidenceSchema.complete) failures.push("reliability evidence schema incomplete");
  if (!pilotEndurance.complete) failures.push("pilot endurance test plan incomplete");
  if (!timeoutSchema.complete) failures.push("timeout schema missing");
  if (!latencySchema.complete) failures.push("provider latency schema missing");
  if (!enduranceCriteria.complete) failures.push("pilot endurance acceptance criteria incomplete");
  if (!incidentResponse.complete) failures.push("reliability incident response planning incomplete");
  if (!timeoutEscalation.complete) failures.push("provider timeout escalation incomplete");
  if (!safetyMargin.complete) failures.push("reliability safety margins incomplete");
  if (!crossStream.complete) failures.push("cross-stream dependency lineage incomplete");
  if (!replayGovernance.complete) failures.push("replay durability assumptions missing");
  if (!failoverModel.complete) failures.push("failover lineage incomplete or provider degradation thresholds undefined");
  if (!observabilityCorrelation.complete) failures.push("observability retention assumptions absent");
  if (!reconciliationLedger.complete) failures.push("reliability-governance reconciliation incomplete");
  if (!contradictionDetector.complete) failures.push("failover contradictions unresolved");
  if (!durabilityContinuity.complete) failures.push("replay durability continuity undefined");
  if (!blockedSafeCertification.complete) failures.push("blocked-safe certification lacks supporting evidence");
  if (crossStream.checks.some((item) => item.name === "a33_timeout_to_escalation_readiness" && item.status !== "PASS")) {
    failures.push("timeout escalation dependencies undocumented");
  }
  if (crossStream.checks.some((item) => item.name === "endurance_to_capacity_coupling" && item.status !== "PASS")) {
    failures.push("endurance-to-capacity coupling undefined");
  }
  if (crossStream.checks.some((item) => item.name === "supervised_execution_dependencies" && item.status !== "PASS")) {
    failures.push("supervised execution dependencies missing");
  }
  if (reconciliationLedger.checks.some((item) => item.name === "governance_contradiction_audit" && item.status !== "PASS")) {
    failures.push("unsupported readiness claims unresolved");
  }
  if (contradictionDetector.checks.some((item) => item.name === "provider_degradation_lineage" && item.status !== "PASS")) {
    failures.push("provider degradation lineage incomplete");
  }
  if (contradictionDetector.checks.some((item) => item.name === "observability_dependencies_for_failover" && item.status !== "PASS")) {
    failures.push("observability dependencies missing");
  }
  if (durabilityContinuity.checks.some((item) => item.name === "supervised_replay_continuity_constraints" && item.status !== "PASS")) {
    failures.push("supervised execution dependencies incomplete");
  }
  failures.push("live provider validation incomplete");
  if (failures.length > 0) {
    throw new Error(`A42 strict mode blocked:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
}

function sourceManifestRow(source: SourceStatus) {
  return {
    key: source.key,
    present: source.present,
    rejected: source.rejected,
    rejectionReasons: source.rejectionReasons,
    sourcePath: source.path,
    canonicalPath: source.canonicalPath,
    sourceTier: source.sourceTier,
    fresh: source.present && !source.stale,
    stale: source.stale,
    ageHours: source.ageHours,
    branch: source.branch,
    generatedAt: source.generatedAt,
    safetyFields: {
      production_safe: source.data ? safetyBoolean(source.data, "production_safe") : null,
      placement_v3_enabled: source.data ? safetyBoolean(source.data, "placement_v3_enabled") : null,
      placement_test_enabled: source.data ? safetyBoolean(source.data, "placement_test_enabled") : null,
      placement_v3_ui_enabled: source.data ? safetyBoolean(source.data, "placement_v3_ui_enabled") : null,
      live_validation_complete: source.data ? safetyBoolean(source.data, "live_validation_complete") : null,
      live_provider_validated: source.data ? safetyBoolean(source.data, "live_provider_validated") : null,
      real_user_validated: source.data ? safetyBoolean(source.data, "real_user_validated") : null,
      missingSafetyFields: source.missingSafetyFields,
    },
  };
}

function findByBasename(dir: string, basename: string): string | null {
  if (!existsSync(dir)) return null;
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const file = path.join(dir, entry);
    const stat = statSync(file);
    if (stat.isDirectory()) {
      const found = findByBasename(file, basename);
      if (found) return found;
    } else if (path.basename(file) === basename) {
      return file;
    }
  }
  return null;
}

function ensureBranch() {
  const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf8" }).trim();
  if (branch !== EXPECTED_BRANCH) {
    throw new Error(`A42 automation must run on ${EXPECTED_BRANCH}; current branch is ${branch}`);
  }
}

function writeJsonAndMarkdown(name: string, json: unknown, markdownLines: string[]) {
  writeFileSync(path.join(OUT_DIR, `${name}.json`), `${JSON.stringify(json, null, 2)}\n`);
  writeFileSync(path.join(OUT_DIR, `${name}.md`), `${markdownLines.join("\n")}\n`);
  console.log(`[a42] wrote ${path.join(OUT_DIR, `${name}.json`)}`);
  console.log(`[a42] wrote ${path.join(OUT_DIR, `${name}.md`)}`);
}

function writeReliabilityJsonAndMarkdown(name: string, json: unknown, markdownLines: string[]) {
  writeFileSync(path.join(RELIABILITY_OUT_DIR, `${name}.json`), `${JSON.stringify(json, null, 2)}\n`);
  writeFileSync(path.join(RELIABILITY_OUT_DIR, `${name}.md`), `${markdownLines.join("\n")}\n`);
  console.log(`[a42] wrote ${path.join(RELIABILITY_OUT_DIR, `${name}.json`)}`);
  console.log(`[a42] wrote ${path.join(RELIABILITY_OUT_DIR, `${name}.md`)}`);
}

function scanClaims() {
  const files = [
    path.join(OUT_DIR, "a42-reliability-operating-summary.md"),
    path.join(OUT_DIR, "a42-reliability-operating-summary.json"),
    path.join(OUT_DIR, "a42-reliability-forecast-scoreboard.md"),
    path.join(OUT_DIR, "a42-reliability-forecast-scoreboard.json"),
    path.join(OUT_DIR, "a42-reliability-handoff-report.md"),
    path.join(OUT_DIR, "a42-evidence-source-manifest.md"),
    path.join(OUT_DIR, "a42-evidence-source-manifest.json"),
    path.join(OUT_DIR, "a42-evidence-import-guide.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-evidence-lineage.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-evidence-lineage.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-endurance-readiness-matrix.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-endurance-readiness-matrix.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-placement-reliability-forecast.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-placement-reliability-forecast.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-latency-risk.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-latency-risk.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-adaptive-session-reliability.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-adaptive-session-reliability.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-replay-durability-forecast.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-replay-durability-forecast.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-failover-stability-forecast.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-failover-stability-forecast.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-threshold-policy.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-threshold-policy.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-timeout-incident-simulation.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-timeout-incident-simulation.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-retry-budget-policy.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-retry-budget-policy.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-assessment-session-sla-plan.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-assessment-session-sla-plan.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-evidence-schema-contract.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-evidence-schema-contract.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-pilot-endurance-test-plan.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-pilot-endurance-test-plan.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-timeout-threshold-schema.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-timeout-threshold-schema.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-latency-evidence-schema.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-latency-evidence-schema.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-pilot-endurance-acceptance-criteria.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-pilot-endurance-acceptance-criteria.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-incident-response-plan.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-incident-response-plan.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-timeout-escalation-policy.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-timeout-escalation-policy.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-safety-margin-policy.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-safety-margin-policy.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-cross-stream-reliability-dependencies.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-cross-stream-reliability-dependencies.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-replay-durability-governance.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-replay-durability-governance.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-failover-stability-model.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-provider-failover-stability-model.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-observability-reliability-correlation.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-observability-reliability-correlation.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-governance-reconciliation-ledger.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-reliability-governance-reconciliation-ledger.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-failover-contradiction-detector.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-failover-contradiction-detector.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-replay-durability-continuity-map.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-replay-durability-continuity-map.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-blocked-safe-reliability-certification.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-blocked-safe-reliability-certification.json"),
    path.join(RELIABILITY_OUT_DIR, "a42-convergence-governance-handoff-summary.md"),
    path.join(RELIABILITY_OUT_DIR, "a42-convergence-governance-handoff-summary.json"),
  ].filter((file) => existsSync(file));
  const violations: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const pattern of FORBIDDEN_CLAIMS) {
      if (pattern.test(text)) violations.push(`${file}: ${pattern}`);
    }
  }
  if (violations.length > 0) {
    throw new Error(`Unsupported A42 reliability claim detected:\n${violations.join("\n")}`);
  }
}
