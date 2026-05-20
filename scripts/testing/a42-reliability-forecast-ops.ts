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
  generateHandoffReport(summary, scoreboard, sources);
  if (args.includes("--strict")) enforceStrictMode(sources, readiness, forecast);
  console.log(`[a42] artifacts: ${OUT_DIR}`);
  console.log(`[a42] reliability reports: ${RELIABILITY_OUT_DIR}`);
  console.log(`[a42] evidence manifest: ${path.join(OUT_DIR, "a42-evidence-source-manifest.json")}`);
  console.log(`[a42] lineage map: ${path.join(RELIABILITY_OUT_DIR, "a42-reliability-evidence-lineage.json")}`);
  console.log(`[a42] endurance readiness matrix: ${path.join(RELIABILITY_OUT_DIR, "a42-endurance-readiness-matrix.json")}`);
  console.log(`[a42] placement reliability forecast: ${path.join(RELIABILITY_OUT_DIR, "a42-placement-reliability-forecast.json")}`);
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
        sourceAgent: source.key.startsWith("a33_") ? "A33" : "B1",
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
      sourceAgent: source.key.startsWith("a33_") ? "A33" : "B1",
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
  if (checks.some((check) => check.name.includes("timeout") && check.status !== "PASS")) return "BLOCKED_BY_TIMEOUT_RISK";
  if (checks.some((check) => check.name === "provider_retry_stability" && check.status !== "PASS")) return "BLOCKED_BY_PROVIDER_LATENCY_UNKNOWN";
  if (checks.some((check) => check.name === "replay_durability" && check.status !== "PASS")) return "BLOCKED_BY_REPLAY_DURABILITY_UNKNOWN";
  if (checks.some((check) => check.name === "failover_timeout_risk" && check.status !== "PASS")) return "BLOCKED_BY_FAILOVER_LATENCY_UNKNOWN";
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
) {
  const failures = [
    ...sources.filter((source) => source.key.startsWith("a33_") && !source.present).map((source) => `missing required A33 input: ${source.key}`),
    ...sources.filter((source) => source.rejected).map((source) => `rejected evidence: ${source.key}`),
    ...sources.filter((source) => source.missingSafetyFields.length > 0).map((source) => `missing safety fields: ${source.key}`),
  ];
  if (readiness.riskClassification !== "RELIABILITY_READY") failures.push(`endurance readiness blocked: ${readiness.riskClassification}`);
  if (forecast.riskClassification !== "RELIABILITY_READY") failures.push(`placement reliability forecast blocked: ${forecast.riskClassification}`);
  if (forecast.categories.some((item) => item.status === "UNKNOWN")) failures.push("provider or replay latency evidence unknown");
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
