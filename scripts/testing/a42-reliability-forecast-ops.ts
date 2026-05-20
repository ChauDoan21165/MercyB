#!/usr/bin/env tsx

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

type RiskClassification = "LOW" | "MODERATE" | "ELEVATED" | "HIGH" | "CRITICAL" | "BLOCKED_BY_MISSING_EVIDENCE";

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
  data: Record<string, unknown> | null;
};

const EXPECTED_BRANCH = "feat/a42-reliability-forecast-ops";
const OUT_DIR = "docs/placement-v3/reliability-forecast";
const DROPBOX_DIR = path.join(OUT_DIR, "evidence-dropbox");
const AGENT_RUNS_DIR = "reports/agent-runs";
const STALENESS_THRESHOLD_HOURS = Number(process.env.A42_STALENESS_THRESHOLD_HOURS ?? 72);

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
  generateHandoffReport(summary, scoreboard, sources);
  console.log(`[a42] artifacts: ${OUT_DIR}`);
  console.log(`[a42] evidence manifest: ${path.join(OUT_DIR, "a42-evidence-source-manifest.json")}`);
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
      live_provider_validated: source.data ? safetyBoolean(source.data, "live_provider_validated") : null,
      real_user_validated: source.data ? safetyBoolean(source.data, "real_user_validated") : null,
      missingSafetyFields: source.missingSafetyFields,
      unsafeProductionClaim: source.unsafeProductionClaim,
    })),
    production_safe: false,
    placement_v3_enabled: false,
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
        missingSafetyFields: ["production_safe", "placement_v3_enabled", "live_provider_validated", "real_user_validated"],
        unsafeProductionClaim: false,
        data: null,
      };
    }
    const data = JSON.parse(readFileSync(resolved.path, "utf8")) as Record<string, unknown>;
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
  for (const key of ["production_safe", "placement_v3_enabled", "live_provider_validated", "real_user_validated"]) {
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
    live_provider_validated: false,
    real_user_validated: false,
    productionReadiness: "NO",
    placementV3Enablement: "BLOCKED",
  };
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
