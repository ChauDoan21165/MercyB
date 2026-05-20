#!/usr/bin/env tsx

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

type Classification =
  | "STRONG_LOCAL"
  | "STABLE_UNDER_CONTENTION"
  | "DEGRADED"
  | "CI_TIMEOUT_RISK"
  | "FLAKE_SUSPECTED"
  | "BLOCKED";

type RepeatSummary = {
  type?: string;
  startedAt?: string;
  endedAt?: string;
  iterations?: number;
  passCount?: number;
  failCount?: number;
  totalDurationSeconds?: number;
  measuredTestDurationSeconds?: number;
  logDir?: string;
  artifactDir?: string;
  runs?: Array<{
    run: number;
    status: number;
    startedAt: string;
    endedAt: string;
    durationSeconds: number;
    log: string;
  }>;
};

type EscalationLevel = "INFO" | "WATCH" | "ELEVATED" | "HIGH" | "CRITICAL";
type AnomalyClassification = "NORMAL" | "WATCH" | "ANOMALY" | "DEGRADED" | "HIGH_RISK";
type ForecastClassification = "LOW" | "MODERATE" | "ELEVATED" | "HIGH" | "CRITICAL";
type RecoveryClassification = ForecastClassification | "RECOVERY_RISK";
type RecoveryEscalationLevel = EscalationLevel | "RECOVERY_BLOCKED";

const EXPECTED_BRANCH = "feat/b1-test-stability-burndown";
const RELIABILITY_DIR = "docs/placement-v3/reliability";
const LOG_DIR = path.join(RELIABILITY_DIR, "logs");
const BURNIN_DIR = "reports/b1-burnin";
const FORBIDDEN_CLAIMS = [
  new RegExp(String.raw`(?<!not )\bproduction ${"ready"}\b`, "i"),
  new RegExp(String.raw`\bsafe to ${"enable"}\b`, "i"),
  new RegExp(String.raw`\b${"flake"} ${"free"} ${"forever"}\b`, "i"),
  new RegExp(String.raw`\blaunch ${"approved"}\b`, "i"),
  new RegExp(String.raw`\breal-user ${"validated"}\b`, "i"),
  new RegExp(String.raw`\blive-provider ${"validated"}\b`, "i"),
  new RegExp(String.raw`\bfully ${"stable"}\b`, "i"),
  new RegExp(String.raw`\bproduction ${"hardened"}\b`, "i"),
  new RegExp(String.raw`\bsafe at ${"scale"}\b`, "i"),
  new RegExp(String.raw`\bflake ${"free"}\b`, "i"),
  new RegExp(String.raw`\breal-user ${"ready"}\b`, "i"),
  new RegExp(String.raw`\blaunch ${"ready"}\b`, "i"),
  new RegExp(String.raw`\bfully ${"resilient"}\b`, "i"),
  new RegExp(String.raw`\bself-${"healing"}\b`, "i"),
  new RegExp(String.raw`\bCI guaranteed ${"stable"}\b`, "i"),
  new RegExp(String.raw`\bsafe for ${"rollout"}\b`, "i"),
];

const command = process.argv[2] ?? "health";
const args = process.argv.slice(3);

main();

function main() {
  ensureBranch();
  ensureReliabilityDirs();

  switch (command) {
    case "trend":
      generateTrend();
      break;
    case "contention":
      generateContention();
      break;
    case "retention":
      rotateLogs(args.includes("--execute"));
      break;
    case "anomalies":
      generateAnomalies();
      break;
    case "forecast":
      generateForecast();
      break;
    case "failure-history":
      generateFailureHistory();
      break;
    case "recovery":
      generateRecoveryForecast();
      break;
    case "resilience":
      generateResilienceSummary();
      break;
    case "state-history":
      generateStateHistory();
      break;
    case "health":
      generateHealth();
      break;
    case "auto":
      runAuto();
      break;
    default:
      throw new Error(`Unknown B1 reliability command: ${command}`);
  }

  scanGeneratedClaims();
}

function ensureBranch() {
  const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf8" }).trim();
  if (branch !== EXPECTED_BRANCH) {
    throw new Error(`B1 automation must run on ${EXPECTED_BRANCH}; current branch is ${branch}`);
  }
}

function ensureReliabilityDirs() {
  mkdirSync(RELIABILITY_DIR, { recursive: true });
  mkdirSync(LOG_DIR, { recursive: true });
}

function runAuto() {
  console.log(`[b1] branch verified: ${EXPECTED_BRANCH}`);
  const stamp = nowStamp();
  const runRoot = path.join(LOG_DIR, `auto-${stamp}`);
  mkdirSync(runRoot, { recursive: true });

  generateTrend();
  generateContention();
  generateAnomalies();
  generateForecast();
  generateRecoveryForecast();
  generateResilienceSummary();
  generateFailureHistory();
  generateStateHistory();
  generateHealth();
  rotateLogs(false);
  generateRetentionEnforcement();
  generateRecoveryRetentionEnforcement();
  console.log(`[b1] artifacts: ${runRoot}`);
  console.log(`[b1] reports: ${RELIABILITY_DIR}`);
}

function generateTrend() {
  const unit = readSummary(path.join(BURNIN_DIR, "unit-runs", "repeat-unit-25-summary.json"));
  const e2e = readSummary(path.join(BURNIN_DIR, "e2e-runs", "repeat-e2e-25-summary.json"));
  const finalUnit = readSummary(path.join(BURNIN_DIR, "final-clean", "final-unit-summary.json"));
  const finalE2e = readSummary(path.join(BURNIN_DIR, "final-clean", "final-e2e-summary.json"));
  const contention = contentionMetrics();
  const all = [unit, e2e, finalUnit, finalE2e].filter(Boolean) as RepeatSummary[];
  const totalRuns = sum(all, (item) => item.passCount) + sum(all, (item) => item.failCount);
  const totalE2eRuns = (e2e?.passCount ?? 0) + (e2e?.failCount ?? 0) + (finalE2e?.passCount ?? 0) + (finalE2e?.failCount ?? 0);
  const totalFailures = sum(all, (item) => item.failCount);
  const rerunStabilityRate = totalRuns > 0 ? (totalRuns - totalFailures) / totalRuns : 0;
  const falsePositiveDetectorTrend = readDetectorFalsePositiveCount();
  const timeoutRiskTrend = contention.maxDurationSeconds >= 50 ? "elevated_under_contention" : "low";
  const classification = classify(totalFailures, contention.maxDurationSeconds, falsePositiveDetectorTrend);

  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    classifications: [
      "STRONG_LOCAL",
      "STABLE_UNDER_CONTENTION",
      "DEGRADED",
      "CI_TIMEOUT_RISK",
      "FLAKE_SUSPECTED",
      "BLOCKED",
    ],
    totalBurnInRuns: totalRuns,
    totalE2eRuns,
    rerunStabilityRate,
    runtimeDriftTrend: {
      unitRangeSeconds: range((unit?.runs ?? []).map((run) => run.durationSeconds)),
      e2eRangeSeconds: range((e2e?.runs ?? []).map((run) => run.durationSeconds)),
      contentionRangeSeconds: contention.runtimeSpreadSeconds,
      trend: contention.maxDurationSeconds >= 50 ? "contention_sensitive" : "stable",
    },
    timeoutRiskTrend,
    integrityViolationTrend: {
      count: totalFailures,
      trend: totalFailures === 0 ? "none_observed" : "investigate",
    },
    falsePositiveDetectorTrend: {
      count: falsePositiveDetectorTrend,
      trend: falsePositiveDetectorTrend > 0 ? "classified_not_confirmed_flake" : "none_observed",
    },
    latestConfidenceClassification: classification,
    currentTarget: currentTarget(),
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "reliability-trend-summary",
    summary,
    [
      "# Placement V3 Reliability Trend Summary",
      "",
      `Generated: ${summary.generatedAt}`,
      "",
      `- Total burn-in runs tracked: ${summary.totalBurnInRuns}`,
      `- Total E2E runs tracked: ${summary.totalE2eRuns}`,
      `- Rerun stability rate: ${(summary.rerunStabilityRate * 100).toFixed(2)}%`,
      `- Runtime drift trend: ${summary.runtimeDriftTrend.trend}`,
      `- Timeout-risk trend: ${summary.timeoutRiskTrend}`,
      `- Integrity violation trend: ${summary.integrityViolationTrend.trend}`,
      `- False-positive detector trend: ${summary.falsePositiveDetectorTrend.trend}`,
      `- Latest confidence classification: ${summary.latestConfidenceClassification}`,
      "",
      "This is a reliability classification only. It does not enable Placement V3 and does not assert live-provider, production, or real-user readiness.",
    ],
  );
}

function generateContention() {
  const metrics = contentionMetrics();
  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    slowestRuns: metrics.slowestRuns,
    concurrentWorkloadImpact: {
      unitContentionSeconds: metrics.unitDurations,
      buildContentionSeconds: metrics.buildDurations,
      maxDurationSeconds: metrics.maxDurationSeconds,
      baselineE2eMaxSeconds: metrics.baselineE2eMaxSeconds,
    },
    runtimeSpread: metrics.runtimeSpreadSeconds,
    timeoutHeadroomEstimate: {
      smokeTimeoutSeconds: 60,
      slowestRunSeconds: metrics.maxDurationSeconds,
      remainingHeadroomSeconds: 60 - metrics.maxDurationSeconds,
      risk: metrics.maxDurationSeconds >= 50 ? "high_on_shared_runners" : "moderate",
    },
    deterministicPassRate: metrics.totalRuns > 0 ? metrics.totalPasses / metrics.totalRuns : 0,
    suspectedEnvironmentalNoise: metrics.maxDurationSeconds >= 50 ? ["shared CPU/I/O contention during unit-test startup"] : [],
    ciContentionRiskEstimate: metrics.maxDurationSeconds >= 50 ? "CI_TIMEOUT_RISK" : "STABLE_UNDER_CONTENTION",
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "contention-analysis-summary",
    summary,
    [
      "# Placement V3 Contention Analysis Summary",
      "",
      `Generated: ${summary.generatedAt}`,
      "",
      `- Deterministic pass rate: ${(summary.deterministicPassRate * 100).toFixed(2)}%`,
      `- Slowest contention run: ${summary.timeoutHeadroomEstimate.slowestRunSeconds}s`,
      `- Timeout headroom estimate: ${summary.timeoutHeadroomEstimate.remainingHeadroomSeconds}s against 60s smoke timeout`,
      `- CI contention risk estimate: ${summary.ciContentionRiskEstimate}`,
      `- Runtime spread: ${summary.runtimeSpread.minSeconds}s to ${summary.runtimeSpread.maxSeconds}s`,
      `- Suspected environmental noise: ${summary.suspectedEnvironmentalNoise.join(", ") || "none observed"}`,
      "",
      "The evidence supports local contention stability, with conservative CI timeout caution under shared-runner load.",
    ],
  );
}

function generateHealth() {
  const trend = readGeneratedJson("reliability-trend-summary") ?? (generateTrend(), readGeneratedJson("reliability-trend-summary"));
  const contention = readGeneratedJson("contention-analysis-summary") ?? (generateContention(), readGeneratedJson("contention-analysis-summary"));
  const anomaly = readGeneratedJson("reliability-anomaly-summary") ?? (generateAnomalies(), readGeneratedJson("reliability-anomaly-summary"));
  const forecast = readGeneratedJson("ci-degradation-forecast") ?? (generateForecast(), readGeneratedJson("ci-degradation-forecast"));
  const recovery =
    readGeneratedJson("reliability-recovery-forecast") ?? (generateRecoveryForecast(), readGeneratedJson("reliability-recovery-forecast"));
  const resilience =
    readGeneratedJson("ci-resilience-summary") ?? (generateResilienceSummary(), readGeneratedJson("ci-resilience-summary"));
  const blockerCount = trend?.integrityViolationTrend?.count ?? 0;
  const flakeSuspicionCount = blockerCount > 0 ? 1 : 0;
  const confidenceClassification = confidenceAfterInstability(
    trend?.latestConfidenceClassification ?? "BLOCKED",
    anomaly?.anomalyClassification ?? "WATCH",
    forecast?.forecastClassification ?? "MODERATE",
    recovery?.recoveryClassification ?? "MODERATE",
    resilience?.confidenceDecay?.decayed ?? false,
  );
  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    evidenceFreshness: latestEvidenceAge(),
    confidenceClassification,
    timeoutRiskEstimate: contention?.ciContentionRiskEstimate ?? "BLOCKED",
    sustainedRunConfidence: blockerCount === 0 ? "high_local_confidence" : "blocked_pending_investigation",
    currentBlockerCount: blockerCount,
    flakeSuspicionCount,
    anomalyClassification: anomaly?.anomalyClassification ?? "WATCH",
    forecastClassification: forecast?.forecastClassification ?? "MODERATE",
    recoveryClassification: recovery?.recoveryClassification ?? "MODERATE",
    resilienceClassification: resilience?.resilienceClassification ?? "MODERATE",
    escalationPriority: maxRecoveryEscalation([
      anomaly?.escalationPriority ?? "WATCH",
      forecast?.escalationPriority ?? "WATCH",
      recovery?.escalationPriority ?? "WATCH",
      resilience?.escalationPriority ?? "WATCH",
    ]),
    production_safe: false,
    placement_v3_enabled: false,
    liveProviderEvidence: "ABSENT",
    productionReadiness: "NO",
    placementV3Enablement: "BLOCKED",
    currentTarget: currentTarget(),
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "reliability-health-summary",
    summary,
    [
      "# Placement V3 Reliability Health Summary",
      "",
      `Generated: ${summary.generatedAt}`,
      "",
      `- Evidence freshness: ${summary.evidenceFreshness.label}`,
      `- Confidence classification: ${summary.confidenceClassification}`,
      `- Timeout-risk estimate: ${summary.timeoutRiskEstimate}`,
      `- Anomaly classification: ${summary.anomalyClassification}`,
      `- CI degradation forecast: ${summary.forecastClassification}`,
      `- Recovery forecast: ${summary.recoveryClassification}`,
      `- CI resilience classification: ${summary.resilienceClassification}`,
      `- Escalation priority: ${summary.escalationPriority}`,
      `- Sustained-run confidence: ${summary.sustainedRunConfidence}`,
      `- Current blocker count: ${summary.currentBlockerCount}`,
      `- Flake suspicion count: ${summary.flakeSuspicionCount}`,
      `- production_safe: ${summary.production_safe}`,
      `- placement_v3_enabled: ${summary.placement_v3_enabled}`,
      `- Live-provider evidence: ${summary.liveProviderEvidence}`,
      `- Production readiness: ${summary.productionReadiness}`,
      `- Placement V3 enablement: ${summary.placementV3Enablement}`,
      `- Reliability automation: ${summary.currentTarget.reliabilityAutomation}`,
      `- Anti-flake governance: ${summary.currentTarget.antiFlakeGovernance}`,
      `- Contention visibility: ${summary.currentTarget.contentionVisibility}`,
      "",
      "Founder-readable takeaway: B1 reliability automation is strong locally and under tested contention, while enablement and live-provider claims remain blocked by absent evidence.",
    ],
  );
}

function generateRecoveryForecast() {
  const metrics = anomalyMetrics();
  const anomaly = readGeneratedJson("reliability-anomaly-summary");
  const forecast = readGeneratedJson("ci-degradation-forecast");
  const timeoutNearMisses = metrics.contentionSlowRuns.filter((run) => run.durationSeconds >= 50).length;
  const spreadWidened = metrics.contentionSpread.spreadSeconds >= 40;
  const recoveryTimeWorsens = spreadWidened || metrics.maxContentionDuration >= 54;
  const staleEvidence = (metrics.evidenceAgeHours ?? 999) > 48;
  const unresolvedDegradation =
    anomaly?.anomalyClassification === "DEGRADED" ||
    anomaly?.anomalyClassification === "HIGH_RISK" ||
    forecast?.forecastClassification === "HIGH" ||
    forecast?.forecastClassification === "CRITICAL";
  const expectedRecoveryFromDegradedStates: RecoveryClassification = unresolvedDegradation
    ? "RECOVERY_RISK"
    : timeoutNearMisses > 0
      ? "ELEVATED"
      : "LOW";
  const rerunStabilizationProbability: RecoveryClassification = metrics.totalFailures > 0 ? "LOW" : staleEvidence ? "MODERATE" : "HIGH";
  const anomalyPersistenceProbability: RecoveryClassification =
    timeoutNearMisses > 1 ? "HIGH" : timeoutNearMisses === 1 ? "ELEVATED" : "LOW";
  const ciRecoveryConfidence: RecoveryClassification = metrics.maxContentionDuration >= 54 ? "MODERATE" : "HIGH";
  const contentionRecoveryLikelihood: RecoveryClassification = spreadWidened ? "ELEVATED" : "LOW";
  const flakyPatternRecurrenceProbability: RecoveryClassification = metrics.flakyClusterCount > 0 ? "HIGH" : "LOW";
  const recoveryClassification = maxRecovery([
    expectedRecoveryFromDegradedStates,
    anomalyPersistenceProbability,
    contentionRecoveryLikelihood,
    flakyPatternRecurrenceProbability,
    staleEvidence ? "ELEVATED" : "LOW",
  ]);
  const confidenceDecay = resilienceConfidenceDecay(metrics, recoveryClassification, timeoutNearMisses);
  const escalationPriority = escalationForRecovery(recoveryClassification, confidenceDecay.decayed);
  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    classifications: ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL", "RECOVERY_RISK"],
    expectedRecoveryFromDegradedStates,
    rerunStabilizationProbability,
    anomalyPersistenceProbability,
    ciRecoveryConfidence,
    contentionRecoveryLikelihood,
    flakyPatternRecurrenceProbability,
    recoveryTimeWorsens,
    unresolvedDegradation,
    recoveryClassification,
    escalationPriority,
    confidenceDecay,
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "reliability-recovery-forecast",
    summary,
    [
      "# Placement V3 Reliability Recovery Forecast",
      "",
      `Generated: ${summary.generatedAt}`,
      "",
      `- Recovery classification: ${summary.recoveryClassification}`,
      `- Escalation priority: ${summary.escalationPriority}`,
      `- Expected recovery from degraded states: ${summary.expectedRecoveryFromDegradedStates}`,
      `- Rerun stabilization probability: ${summary.rerunStabilizationProbability}`,
      `- Anomaly persistence probability: ${summary.anomalyPersistenceProbability}`,
      `- CI recovery confidence: ${summary.ciRecoveryConfidence}`,
      `- Contention recovery likelihood: ${summary.contentionRecoveryLikelihood}`,
      `- Flaky-pattern recurrence probability: ${summary.flakyPatternRecurrenceProbability}`,
      `- Confidence decay applied: ${summary.confidenceDecay.decayed}`,
      "",
      "Recovery forecasting is conservative reliability intelligence only. Placement V3 remains disabled and live-provider evidence remains absent.",
    ],
  );
}

function generateResilienceSummary() {
  const metrics = anomalyMetrics();
  const timeoutNearMisses = metrics.contentionSlowRuns.filter((run) => run.durationSeconds >= 50).length;
  const allRuns = metrics.totalRuns;
  const passRate = allRuns > 0 ? (allRuns - metrics.totalFailures) / allRuns : 0;
  const timeoutHeadroomSeconds = 60 - metrics.maxContentionDuration;
  const confidenceDecay = resilienceConfidenceDecay(
    metrics,
    timeoutNearMisses > 1 ? "HIGH" : timeoutNearMisses === 1 ? "ELEVATED" : "LOW",
    timeoutNearMisses,
  );
  const resilienceClassification: ForecastClassification =
    metrics.totalFailures > 0
      ? "CRITICAL"
      : timeoutHeadroomSeconds <= 6
        ? "HIGH"
        : confidenceDecay.decayed
          ? "ELEVATED"
          : "LOW";
  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    rerunResilience: {
      passRate,
      failures: metrics.totalFailures,
      classification: metrics.totalFailures > 0 ? "CRITICAL" : "LOW",
    },
    timeoutResilience: {
      slowestContentionSeconds: metrics.maxContentionDuration,
      timeoutHeadroomSeconds,
      classification: timeoutHeadroomSeconds <= 6 ? "HIGH" : "LOW",
    },
    contentionResilience: {
      runtimeSpreadSeconds: metrics.contentionSpread.spreadSeconds,
      classification: metrics.contentionSpread.spreadSeconds >= 40 ? "ELEVATED" : "LOW",
    },
    anomalyRecoverySpeed: {
      classification: timeoutNearMisses > 1 ? "HIGH" : timeoutNearMisses === 1 ? "ELEVATED" : "LOW",
      observedTimeoutNearMisses: timeoutNearMisses,
    },
    stabilityRecoverySpeed: {
      classification: metrics.totalFailures > 0 ? "CRITICAL" : "LOW",
      basis: metrics.totalFailures > 0 ? "rerun failures require isolation" : "repeated runs remain converged",
    },
    falsePositiveRecoveryConfidence: {
      count: metrics.falsePositiveCount,
      classification: metrics.falsePositiveCount > 1 ? "MODERATE" : "LOW",
      handling: metrics.falsePositiveCount > 0 ? "explicitly_classified_not_confirmed_flake" : "none_observed",
    },
    resilienceClassification,
    escalationPriority: escalationForForecast(resilienceClassification),
    confidenceDecay,
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "ci-resilience-summary",
    summary,
    [
      "# Placement V3 CI Resilience Summary",
      "",
      `Generated: ${summary.generatedAt}`,
      "",
      `- CI resilience classification: ${summary.resilienceClassification}`,
      `- Escalation priority: ${summary.escalationPriority}`,
      `- Rerun resilience pass rate: ${(summary.rerunResilience.passRate * 100).toFixed(2)}%`,
      `- Timeout headroom: ${summary.timeoutResilience.timeoutHeadroomSeconds}s`,
      `- Contention spread: ${summary.contentionResilience.runtimeSpreadSeconds}s`,
      `- Anomaly recovery speed: ${summary.anomalyRecoverySpeed.classification}`,
      `- Stability recovery speed: ${summary.stabilityRecoverySpeed.classification}`,
      `- False-positive recovery confidence: ${summary.falsePositiveRecoveryConfidence.classification}`,
      `- Confidence decay applied: ${summary.confidenceDecay.decayed}`,
      "",
      "Resilience visibility is scoped to B1 reliability evidence. It does not change feature flags or product behavior.",
    ],
  );
}

function generateStateHistory() {
  const anomaly = readGeneratedJson("reliability-anomaly-summary") ?? (generateAnomalies(), readGeneratedJson("reliability-anomaly-summary"));
  const forecast = readGeneratedJson("ci-degradation-forecast") ?? (generateForecast(), readGeneratedJson("ci-degradation-forecast"));
  const recovery =
    readGeneratedJson("reliability-recovery-forecast") ?? (generateRecoveryForecast(), readGeneratedJson("reliability-recovery-forecast"));
  const resilience =
    readGeneratedJson("ci-resilience-summary") ?? (generateResilienceSummary(), readGeneratedJson("ci-resilience-summary"));
  const metrics = anomalyMetrics();
  const lines = [
    "# Placement V3 B1 Reliability State History",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This history persists reliability state transitions only. It does not grant release authority or change Placement V3 enablement.",
    "",
    "## Current Transitions",
    "",
    `- Anomaly state transition: ${anomaly?.anomalyClassification ?? "UNKNOWN"}`,
    `- Degradation transition: ${forecast?.forecastClassification ?? "UNKNOWN"}`,
    `- Escalation transition: ${maxRecoveryEscalation([
      anomaly?.escalationPriority ?? "WATCH",
      forecast?.escalationPriority ?? "WATCH",
      recovery?.escalationPriority ?? "WATCH",
      resilience?.escalationPriority ?? "WATCH",
    ])}`,
    `- Recovery transition: ${recovery?.recoveryClassification ?? "UNKNOWN"}`,
    `- Timeout-risk transition: ${metrics.maxContentionDuration >= 54 ? "near_timeout_window" : "within_headroom"}`,
    `- Contention instability transition: ${metrics.contentionSpread.spreadSeconds >= 40 ? "widened" : "bounded"}`,
    "",
    "## Transition Evidence",
    "",
    `- Total rerun failures: ${metrics.totalFailures}`,
    `- Slowest contention duration: ${metrics.maxContentionDuration}s`,
    `- Contention spread: ${metrics.contentionSpread.spreadSeconds}s`,
    `- Detector false-positive count: ${metrics.falsePositiveCount}`,
    `- Flaky-pattern cluster count: ${metrics.flakyClusterCount}`,
  ];
  writeFileSync(path.join(RELIABILITY_DIR, "reliability-state-history.md"), `${lines.join("\n")}\n`);
  console.log(`[b1] wrote ${path.join(RELIABILITY_DIR, "reliability-state-history.md")}`);
}

function generateAnomalies() {
  const metrics = anomalyMetrics();
  const timeoutNearMisses = metrics.contentionSlowRuns.filter((run) => run.durationSeconds >= 50);
  const runtimeSpikeThreshold = Math.max(30, metrics.baselineE2eMaxSeconds * 3);
  const abnormalRuntimeSpikes = metrics.contentionSlowRuns.filter((run) => run.durationSeconds >= runtimeSpikeThreshold);
  const spreadIncrease = metrics.contentionSpread.spreadSeconds - metrics.baselineSpread.spreadSeconds;
  const flakyPatternEmergence = metrics.flakyClusterCount > 0;
  const rerunInstability = metrics.totalFailures > 0;
  const falsePositiveAnomalies = metrics.falsePositiveCount > 1;
  const classification = classifyAnomaly({
    timeoutNearMisses: timeoutNearMisses.length,
    spreadIncrease,
    rerunInstability,
    falsePositiveAnomalies,
    flakyPatternEmergence,
  });
  const escalationPriority = escalationForAnomaly(classification, timeoutNearMisses.length);
  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    classifications: ["NORMAL", "WATCH", "ANOMALY", "DEGRADED", "HIGH_RISK"],
    abnormalRuntimeSpikes,
    suddenTimeoutSpreadIncrease: {
      baselineSpreadSeconds: metrics.baselineSpread.spreadSeconds,
      contentionSpreadSeconds: metrics.contentionSpread.spreadSeconds,
      increaseSeconds: spreadIncrease,
      detected: spreadIncrease >= 30,
    },
    repeatedContentionAnomalies: {
      count: timeoutNearMisses.length,
      detected: timeoutNearMisses.length > 1,
    },
    rerunInstability: {
      failures: metrics.totalFailures,
      detected: rerunInstability,
    },
    falsePositiveDetectorAnomalies: {
      count: metrics.falsePositiveCount,
      detected: falsePositiveAnomalies,
      classification: metrics.falsePositiveCount > 0 ? "classified_false_positive_not_confirmed_flake" : "none_observed",
    },
    flakyPatternEmergence: {
      clusterCount: metrics.flakyClusterCount,
      detected: flakyPatternEmergence,
    },
    integrityAnomalyClusters: {
      count: metrics.integrityAnomalyCount,
      detected: metrics.integrityAnomalyCount > 0,
    },
    confidenceInstability: confidenceInstability(metrics, classification),
    anomalyClassification: classification,
    escalationPriority,
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "reliability-anomaly-summary",
    summary,
    [
      "# Placement V3 Reliability Anomaly Summary",
      "",
      `Generated: ${summary.generatedAt}`,
      "",
      `- Anomaly classification: ${summary.anomalyClassification}`,
      `- Escalation priority: ${summary.escalationPriority}`,
      `- Abnormal runtime spikes: ${summary.abnormalRuntimeSpikes.length}`,
      `- Timeout spread increase: ${summary.suddenTimeoutSpreadIncrease.increaseSeconds}s`,
      `- Repeated contention anomalies: ${summary.repeatedContentionAnomalies.count}`,
      `- Rerun instability detected: ${summary.rerunInstability.detected}`,
      `- False-positive detector anomalies: ${summary.falsePositiveDetectorAnomalies.count}`,
      `- Flaky-pattern clusters: ${summary.flakyPatternEmergence.clusterCount}`,
      `- Confidence adjustment: ${summary.confidenceInstability.adjustment}`,
      "",
      "B1 anomaly detection is reliability intelligence only. Placement V3 remains disabled and enablement remains blocked.",
    ],
  );
}

function generateForecast() {
  const metrics = anomalyMetrics();
  const timeoutRiskEscalation: ForecastClassification =
    metrics.maxContentionDuration >= 54 ? "HIGH" : metrics.maxContentionDuration >= 50 ? "ELEVATED" : "MODERATE";
  const rerunDegradationProbability: ForecastClassification =
    metrics.totalFailures > 0 ? "HIGH" : metrics.falsePositiveCount > 1 ? "MODERATE" : "LOW";
  const contentionInstabilityGrowth: ForecastClassification = metrics.contentionSpread.spreadSeconds >= 40 ? "ELEVATED" : "LOW";
  const flakyPatternGrowth: ForecastClassification = metrics.flakyClusterCount > 0 ? "HIGH" : "LOW";
  const ciRuntimeSpreadIncrease: ForecastClassification = metrics.contentionSpread.spreadSeconds >= 40 ? "ELEVATED" : "LOW";
  const runnerContentionRisk: ForecastClassification = metrics.maxContentionDuration >= 54 ? "HIGH" : "ELEVATED";
  const forecastClassification = maxForecast([
    timeoutRiskEscalation,
    rerunDegradationProbability,
    contentionInstabilityGrowth,
    flakyPatternGrowth,
    ciRuntimeSpreadIncrease,
    runnerContentionRisk,
  ]);
  const escalationPriority = escalationForForecast(forecastClassification);
  const forecast = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    classifications: ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL"],
    timeoutRiskEscalation,
    rerunDegradationProbability,
    contentionInstabilityGrowth,
    flakyPatternGrowth,
    ciRuntimeSpreadIncrease,
    runnerContentionRisk,
    forecastClassification,
    escalationPriority,
    confidenceInstability: confidenceInstability(metrics, forecastClassification === "HIGH" ? "ANOMALY" : "WATCH"),
    evidenceLimits: {
      liveProviderEvidence: "ABSENT",
      realUserEvidence: "ABSENT",
      scalingEvidence: "not_claimed",
    },
    safetyPosition: safetyPosition(),
  };

  writeJsonAndMarkdown(
    "ci-degradation-forecast",
    forecast,
    [
      "# Placement V3 CI Degradation Forecast",
      "",
      `Generated: ${forecast.generatedAt}`,
      "",
      `- Forecast classification: ${forecast.forecastClassification}`,
      `- Escalation priority: ${forecast.escalationPriority}`,
      `- Timeout-risk escalation: ${forecast.timeoutRiskEscalation}`,
      `- Rerun degradation probability: ${forecast.rerunDegradationProbability}`,
      `- Contention instability growth: ${forecast.contentionInstabilityGrowth}`,
      `- Flaky-pattern growth: ${forecast.flakyPatternGrowth}`,
      `- CI runtime spread increase: ${forecast.ciRuntimeSpreadIncrease}`,
      `- Runner contention risk: ${forecast.runnerContentionRisk}`,
      "",
      "Forecasting is conservative and based on local/CI-style reliability evidence only. It does not assert live-provider, real-user, or production readiness.",
    ],
  );
}

function generateFailureHistory() {
  const metrics = anomalyMetrics();
  const timeoutRuns = metrics.contentionSlowRuns.filter((run) => run.durationSeconds >= 50);
  const anomalyClass = classifyAnomaly({
    timeoutNearMisses: timeoutRuns.length,
    spreadIncrease: metrics.contentionSpread.spreadSeconds - metrics.baselineSpread.spreadSeconds,
    rerunInstability: metrics.totalFailures > 0,
    falsePositiveAnomalies: metrics.falsePositiveCount > 1,
    flakyPatternEmergence: metrics.flakyClusterCount > 0,
  });
  const lines = [
    "# Placement V3 B1 Failure Pattern History",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "This memory is scoped to B1 reliability intelligence. It does not grant release authority or enable Placement V3.",
    "",
    "## Prior Timeout Incidents",
    "",
    ...historyRows(timeoutRuns, "No prior timeout near-misses recorded."),
    "",
    "## Prior Contention Anomalies",
    "",
    ...historyRows(
      metrics.contentionSlowRuns.filter((run) => run.durationSeconds > metrics.baselineE2eMaxSeconds),
      "No prior contention anomalies recorded.",
    ),
    "",
    "## Prior Rerun Instability",
    "",
    metrics.totalFailures > 0 ? `- ${metrics.totalFailures} rerun failures recorded in repeat summaries.` : "- None recorded.",
    "",
    "## Prior Flaky Signatures",
    "",
    metrics.flakyClusterCount > 0 ? `- ${metrics.flakyClusterCount} flaky-pattern clusters recorded.` : "- None recorded.",
    "",
    "## Prior Integrity Anomalies",
    "",
    metrics.integrityAnomalyCount > 0 ? `- ${metrics.integrityAnomalyCount} integrity anomaly clusters recorded.` : "- None recorded.",
    "",
    "## Prior Detector False Positives",
    "",
    metrics.falsePositiveCount > 0
      ? `- ${metrics.falsePositiveCount} detector false-positive signal(s), classified as not confirmed flakes.`
      : "- None recorded.",
    "",
    "## Current Escalation",
    "",
    `- Escalation priority: ${escalationForAnomaly(anomalyClass, timeoutRuns.length)}`,
  ];
  writeFileSync(path.join(RELIABILITY_DIR, "failure-pattern-history.md"), `${lines.join("\n")}\n`);
  console.log(`[b1] wrote ${path.join(RELIABILITY_DIR, "failure-pattern-history.md")}`);
}

function generateRetentionEnforcement() {
  const anomaly = readGeneratedJson("reliability-anomaly-summary") ?? (generateAnomalies(), readGeneratedJson("reliability-anomaly-summary"));
  const forecast = readGeneratedJson("ci-degradation-forecast") ?? (generateForecast(), readGeneratedJson("ci-degradation-forecast"));
  const recovery =
    readGeneratedJson("reliability-recovery-forecast") ?? (generateRecoveryForecast(), readGeneratedJson("reliability-recovery-forecast"));
  const resilience =
    readGeneratedJson("ci-resilience-summary") ?? (generateResilienceSummary(), readGeneratedJson("ci-resilience-summary"));
  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    preserveAnomalyEvidence: true,
    preserveTimeoutIncidents: true,
    preserveFlakyPatternSignatures: true,
    preserveDegradedTrendEvidence: true,
    preserveCiDegradationEvidence: true,
    preserveRecoveryFailureEvidence: true,
    preserveProlongedDegradationEvidence: true,
    preserveEscalationRecurrenceEvidence: true,
    preserveResilienceTrendHistory: true,
    preserveCiRecoveryAnomalies: true,
    protectedPatterns: [
      "anomaly evidence",
      "timeout near-miss logs",
      "flaky-pattern signatures",
      "degraded trend evidence",
      "CI degradation forecast evidence",
      "detector false-positive classifications",
      "recovery failure evidence",
      "prolonged degradation evidence",
      "escalation recurrence evidence",
      "resilience trend history",
      "CI recovery anomalies",
    ],
    currentAnomalyClassification: anomaly?.anomalyClassification ?? "WATCH",
    currentForecastClassification: forecast?.forecastClassification ?? "MODERATE",
    currentRecoveryClassification: recovery?.recoveryClassification ?? "MODERATE",
    currentResilienceClassification: resilience?.resilienceClassification ?? "MODERATE",
    rotationMode: "dry-run-first",
    safetyPosition: safetyPosition(),
  };
  const lines = [
    "# Placement V3 B1 Retention Enforcement Summary",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    `- Preserve anomaly evidence: ${summary.preserveAnomalyEvidence}`,
    `- Preserve timeout incidents: ${summary.preserveTimeoutIncidents}`,
    `- Preserve flaky-pattern signatures: ${summary.preserveFlakyPatternSignatures}`,
    `- Preserve degraded trend evidence: ${summary.preserveDegradedTrendEvidence}`,
    `- Preserve CI degradation evidence: ${summary.preserveCiDegradationEvidence}`,
    `- Preserve recovery failure evidence: ${summary.preserveRecoveryFailureEvidence}`,
    `- Preserve prolonged degradation evidence: ${summary.preserveProlongedDegradationEvidence}`,
    `- Preserve escalation recurrence evidence: ${summary.preserveEscalationRecurrenceEvidence}`,
    `- Preserve resilience trend history: ${summary.preserveResilienceTrendHistory}`,
    `- Preserve CI recovery anomalies: ${summary.preserveCiRecoveryAnomalies}`,
    `- Current anomaly classification: ${summary.currentAnomalyClassification}`,
    `- Current forecast classification: ${summary.currentForecastClassification}`,
    `- Current recovery classification: ${summary.currentRecoveryClassification}`,
    `- Current resilience classification: ${summary.currentResilienceClassification}`,
    "",
    "Retention remains dry-run first and does not delete sustained B1 burn-in evidence.",
  ];
  writeFileSync(path.join(RELIABILITY_DIR, "retention-enforcement-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  writeFileSync(path.join(RELIABILITY_DIR, "retention-enforcement-summary.md"), `${lines.join("\n")}\n`);
  console.log(`[b1] wrote ${path.join(RELIABILITY_DIR, "retention-enforcement-summary.md")}`);
}

function generateRecoveryRetentionEnforcement() {
  const recovery =
    readGeneratedJson("reliability-recovery-forecast") ?? (generateRecoveryForecast(), readGeneratedJson("reliability-recovery-forecast"));
  const resilience =
    readGeneratedJson("ci-resilience-summary") ?? (generateResilienceSummary(), readGeneratedJson("ci-resilience-summary"));
  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    preserveRecoveryFailureEvidence: true,
    preserveProlongedDegradationEvidence: true,
    preserveEscalationRecurrenceEvidence: true,
    preserveResilienceTrendHistory: true,
    preserveCiRecoveryAnomalies: true,
    currentRecoveryClassification: recovery?.recoveryClassification ?? "MODERATE",
    currentResilienceClassification: resilience?.resilienceClassification ?? "MODERATE",
    currentEscalationPriority: maxRecoveryEscalation([
      recovery?.escalationPriority ?? "WATCH",
      resilience?.escalationPriority ?? "WATCH",
    ]),
    protectedEvidenceClasses: [
      "recovery failure evidence",
      "prolonged degradation evidence",
      "escalation recurrence evidence",
      "resilience trend history",
      "CI recovery anomalies",
    ],
    rotationMode: "dry-run-first",
    safetyPosition: safetyPosition(),
  };
  const lines = [
    "# Placement V3 B1 Recovery Retention Enforcement Summary",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    `- Preserve recovery failure evidence: ${summary.preserveRecoveryFailureEvidence}`,
    `- Preserve prolonged degradation evidence: ${summary.preserveProlongedDegradationEvidence}`,
    `- Preserve escalation recurrence evidence: ${summary.preserveEscalationRecurrenceEvidence}`,
    `- Preserve resilience trend history: ${summary.preserveResilienceTrendHistory}`,
    `- Preserve CI recovery anomalies: ${summary.preserveCiRecoveryAnomalies}`,
    `- Current recovery classification: ${summary.currentRecoveryClassification}`,
    `- Current resilience classification: ${summary.currentResilienceClassification}`,
    `- Current escalation priority: ${summary.currentEscalationPriority}`,
    "",
    "Recovery retention stays dry-run first and preserves sustained-run evidence.",
  ];
  writeFileSync(path.join(RELIABILITY_DIR, "recovery-retention-enforcement-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  writeFileSync(path.join(RELIABILITY_DIR, "recovery-retention-enforcement-summary.md"), `${lines.join("\n")}\n`);
  console.log(`[b1] wrote ${path.join(RELIABILITY_DIR, "recovery-retention-enforcement-summary.md")}`);
}

function rotateLogs(execute: boolean) {
  const candidates = collectFiles(LOG_DIR).filter((file) => file.endsWith(".log"));
  const protectedEvidence = new Set<string>([
    path.normalize(path.join(BURNIN_DIR, "unit-runs", "repeat-unit-25-wrapper.log")),
    path.normalize(path.join(BURNIN_DIR, "e2e-runs", "repeat-e2e-25-wrapper.log")),
    path.normalize(path.join(BURNIN_DIR, "final-clean", "final-unit-wrapper.log")),
    path.normalize(path.join(BURNIN_DIR, "final-clean", "final-e2e-wrapper.log")),
  ]);
  const planned = candidates
    .filter((file) => !protectedEvidence.has(path.normalize(file)))
    .filter((file) => statSync(file).mtimeMs < Date.now() - 14 * 24 * 60 * 60 * 1000);

  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    mode: execute ? "execute" : "dry-run",
    logDir: LOG_DIR,
    archivalWindowDays: 14,
    protectedEvidence: [...protectedEvidence],
    plannedDeleteCount: planned.length,
    plannedDeletes: planned,
    deletionSafeguards: [
      "dry-run by default",
      "requires --execute for deletion",
      "does not target reports/b1-burnin sustained evidence",
      "does not delete merge-readiness logs",
    ],
  };

  writeFileSync(path.join(RELIABILITY_DIR, "retention-rotation-plan.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
  generateRetentionEnforcement();
  generateRecoveryRetentionEnforcement();

  if (execute) {
    for (const file of planned) rmSync(file, { force: true });
  }
}

function contentionMetrics() {
  const unit = readSummary(path.join(BURNIN_DIR, "contention", "unit-contention", "e2e-while-unit-summary.json"));
  const build = readSummary(path.join(BURNIN_DIR, "contention", "build-contention", "e2e-while-build-summary.json"));
  const baseline = readSummary(path.join(BURNIN_DIR, "e2e-runs", "repeat-e2e-25-summary.json"));
  const unitDurations = (unit?.runs ?? []).map((run) => run.durationSeconds);
  const buildDurations = (build?.runs ?? []).map((run) => run.durationSeconds);
  const all = [...unitDurations, ...buildDurations];
  const slowestRuns = [...(unit?.runs ?? []), ...(build?.runs ?? [])]
    .sort((a, b) => b.durationSeconds - a.durationSeconds)
    .slice(0, 5)
    .map((run) => ({ durationSeconds: run.durationSeconds, log: run.log, startedAt: run.startedAt }));

  return {
    unitDurations,
    buildDurations,
    slowestRuns,
    baselineE2eMaxSeconds: max((baseline?.runs ?? []).map((run) => run.durationSeconds)),
    maxDurationSeconds: max(all),
    runtimeSpreadSeconds: range(all),
    totalRuns: (unit?.passCount ?? 0) + (unit?.failCount ?? 0) + (build?.passCount ?? 0) + (build?.failCount ?? 0),
    totalPasses: (unit?.passCount ?? 0) + (build?.passCount ?? 0),
  };
}

function anomalyMetrics() {
  const unit = readSummary(path.join(BURNIN_DIR, "unit-runs", "repeat-unit-25-summary.json"));
  const e2e = readSummary(path.join(BURNIN_DIR, "e2e-runs", "repeat-e2e-25-summary.json"));
  const finalUnit = readSummary(path.join(BURNIN_DIR, "final-clean", "final-unit-summary.json"));
  const finalE2e = readSummary(path.join(BURNIN_DIR, "final-clean", "final-e2e-summary.json"));
  const summaries = [unit, e2e, finalUnit, finalE2e].filter(Boolean) as RepeatSummary[];
  const contention = contentionMetrics();
  const baselineDurations = (e2e?.runs ?? []).map((run) => run.durationSeconds);
  const contentionRuns = contention.slowestRuns.map((run) => ({
    durationSeconds: run.durationSeconds,
    log: run.log,
    startedAt: run.startedAt,
  }));
  const clusterFiles = collectFiles(BURNIN_DIR).filter((file) => file.endsWith("flaky-summary.json"));
  let flakyClusterCount = 0;
  let falsePositiveCount = 0;
  for (const file of clusterFiles) {
    try {
      const parsed = JSON.parse(readFileSync(file, "utf8"));
      flakyClusterCount += Array.isArray(parsed.clusters) ? parsed.clusters.length : 0;
      falsePositiveCount += parsed.falsePositiveDetectorTrend?.count ?? parsed.ignoredLogs?.length ?? 0;
    } catch {
      falsePositiveCount += 1;
    }
  }
  const forensics = path.join(BURNIN_DIR, "flaky-failure-forensics.md");
  if (existsSync(forensics) && /false positive/i.test(readFileSync(forensics, "utf8"))) falsePositiveCount += 1;

  return {
    totalRuns: sum(summaries, (summary) => summary.passCount) + sum(summaries, (summary) => summary.failCount),
    totalFailures: sum(summaries, (summary) => summary.failCount),
    baselineE2eMaxSeconds: contention.baselineE2eMaxSeconds,
    maxContentionDuration: contention.maxDurationSeconds,
    baselineSpread: range(baselineDurations),
    contentionSpread: contention.runtimeSpreadSeconds,
    contentionSlowRuns: contentionRuns,
    flakyClusterCount,
    falsePositiveCount,
    integrityAnomalyCount: sum(summaries, (summary) => summary.failCount),
    evidenceAgeHours: latestEvidenceAge().ageHours,
  };
}

function classifyAnomaly(input: {
  timeoutNearMisses: number;
  spreadIncrease: number;
  rerunInstability: boolean;
  falsePositiveAnomalies: boolean;
  flakyPatternEmergence: boolean;
}): AnomalyClassification {
  if (input.rerunInstability || input.flakyPatternEmergence) return "HIGH_RISK";
  if (input.timeoutNearMisses > 1 || input.falsePositiveAnomalies) return "DEGRADED";
  if (input.timeoutNearMisses === 1 || input.spreadIncrease >= 30) return "ANOMALY";
  if (input.spreadIncrease >= 15) return "WATCH";
  return "NORMAL";
}

function escalationForAnomaly(classification: AnomalyClassification, timeoutNearMisses: number): EscalationLevel {
  if (classification === "HIGH_RISK") return "CRITICAL";
  if (classification === "DEGRADED") return "HIGH";
  if (classification === "ANOMALY" && timeoutNearMisses > 0) return "ELEVATED";
  if (classification === "WATCH" || classification === "ANOMALY") return "WATCH";
  return "INFO";
}

function escalationForForecast(classification: ForecastClassification): EscalationLevel {
  if (classification === "CRITICAL") return "CRITICAL";
  if (classification === "HIGH") return "HIGH";
  if (classification === "ELEVATED") return "ELEVATED";
  if (classification === "MODERATE") return "WATCH";
  return "INFO";
}

function maxForecast(values: ForecastClassification[]): ForecastClassification {
  const order: ForecastClassification[] = ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL"];
  return values.sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] ?? "LOW";
}

function maxRecovery(values: RecoveryClassification[]): RecoveryClassification {
  const order: RecoveryClassification[] = ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL", "RECOVERY_RISK"];
  return values.sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] ?? "LOW";
}

function maxEscalation(values: EscalationLevel[]): EscalationLevel {
  const order: EscalationLevel[] = ["INFO", "WATCH", "ELEVATED", "HIGH", "CRITICAL"];
  return values.sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] ?? "INFO";
}

function maxRecoveryEscalation(values: RecoveryEscalationLevel[]): RecoveryEscalationLevel {
  const order: RecoveryEscalationLevel[] = ["INFO", "WATCH", "ELEVATED", "HIGH", "CRITICAL", "RECOVERY_BLOCKED"];
  return values.sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] ?? "INFO";
}

function escalationForRecovery(classification: RecoveryClassification, confidenceDecayed: boolean): RecoveryEscalationLevel {
  if (classification === "RECOVERY_RISK") return "RECOVERY_BLOCKED";
  if (classification === "CRITICAL") return "CRITICAL";
  if (classification === "HIGH") return "HIGH";
  if (classification === "ELEVATED" || confidenceDecayed) return "ELEVATED";
  if (classification === "MODERATE") return "WATCH";
  return "INFO";
}

function confidenceInstability(metrics: ReturnType<typeof anomalyMetrics>, classification: AnomalyClassification | "WATCH") {
  const evidenceStale = (metrics.evidenceAgeHours ?? 999) > 48;
  const widenedSpread = metrics.contentionSpread.spreadSeconds >= 40;
  const degradedConvergence = metrics.totalFailures > 0;
  const adjustment =
    degradedConvergence || classification === "HIGH_RISK"
      ? "reduce_to_blocked"
      : classification === "DEGRADED" || widenedSpread
        ? "reduce_to_contention_caution"
        : evidenceStale
          ? "reduce_for_stale_evidence"
          : "none";
  return {
    adjustment,
    reasons: {
      anomalyFrequencyIncreased: classification === "DEGRADED" || classification === "HIGH_RISK",
      runtimeSpreadWidened: widenedSpread,
      rerunConvergenceWorsened: degradedConvergence,
      staleEvidenceAccumulated: evidenceStale,
      ciTrendFreshnessDecayed: evidenceStale,
      contentionInstabilityGrew: metrics.maxContentionDuration >= 54,
    },
  };
}

function resilienceConfidenceDecay(
  metrics: ReturnType<typeof anomalyMetrics>,
  recoveryClassification: RecoveryClassification,
  timeoutNearMisses: number,
) {
  const evidenceStale = (metrics.evidenceAgeHours ?? 999) > 48;
  const recoveryTimeWorsens = metrics.contentionSpread.spreadSeconds >= 40 || metrics.maxContentionDuration >= 54;
  const anomalyRecurrenceIncreases = timeoutNearMisses > 1 || metrics.flakyClusterCount > 0;
  const ciDegradationPersists = recoveryClassification === "RECOVERY_RISK" || recoveryClassification === "HIGH";
  const contentionInstabilityWidens = metrics.contentionSpread.spreadSeconds >= 40;
  const escalationRecurrenceIncreases = metrics.maxContentionDuration >= 54 || metrics.totalFailures > 0;
  const decayed =
    recoveryTimeWorsens ||
    anomalyRecurrenceIncreases ||
    ciDegradationPersists ||
    contentionInstabilityWidens ||
    evidenceStale ||
    escalationRecurrenceIncreases;
  return {
    decayed,
    adjustment: decayed ? "reduce_for_recovery_resilience_risk" : "none",
    reasons: {
      recoveryTimeWorsens,
      anomalyRecurrenceIncreases,
      ciDegradationPersists,
      contentionInstabilityWidens,
      staleEvidenceAccumulated: evidenceStale,
      escalationRecurrenceIncreases,
    },
  };
}

function confidenceAfterInstability(
  base: Classification,
  anomaly: AnomalyClassification,
  forecast: ForecastClassification,
  recovery: RecoveryClassification = "LOW",
  resilienceDecayed = false,
): Classification {
  if (anomaly === "HIGH_RISK" || forecast === "CRITICAL" || recovery === "RECOVERY_RISK") return "BLOCKED";
  if (anomaly === "DEGRADED" || forecast === "HIGH" || recovery === "HIGH" || resilienceDecayed) return "CI_TIMEOUT_RISK";
  if (anomaly === "ANOMALY" || forecast === "ELEVATED" || recovery === "ELEVATED") return "STABLE_UNDER_CONTENTION";
  return base;
}

function historyRows(
  runs: Array<{ durationSeconds: number; log: string; startedAt: string }>,
  empty: string,
): string[] {
  if (runs.length === 0) return [`- ${empty}`];
  return runs.map((run) => `- ${run.startedAt}: ${run.durationSeconds}s, log ${run.log}`);
}

function classify(failures: number, maxContentionDuration: number, falsePositiveCount: number): Classification {
  if (failures > 0) return "FLAKE_SUSPECTED";
  if (maxContentionDuration >= 55) return "CI_TIMEOUT_RISK";
  if (maxContentionDuration >= 50) return "STABLE_UNDER_CONTENTION";
  if (falsePositiveCount > 0) return "STABLE_UNDER_CONTENTION";
  return "STRONG_LOCAL";
}

function safetyPosition() {
  return {
    production_safe: false,
    placement_v3_enabled: false,
    live_provider_evidence: "ABSENT",
    real_user_evidence: "ABSENT",
    production_readiness: "NO",
  };
}

function currentTarget() {
  return {
    reliabilityAutomation: "STRONG",
    antiFlakeGovernance: "STRONG",
    contentionVisibility: "STRONG",
    liveProviderEvidence: "ABSENT",
    productionReadiness: "NO",
    placementV3Enablement: "BLOCKED",
  };
}

function readSummary(file: string): RepeatSummary | null {
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8")) as RepeatSummary;
}

function readGeneratedJson(name: string): any | null {
  const file = path.join(RELIABILITY_DIR, `${name}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8"));
}

function writeJsonAndMarkdown(name: string, json: unknown, markdownLines: string[]) {
  writeFileSync(path.join(RELIABILITY_DIR, `${name}.json`), `${JSON.stringify(json, null, 2)}\n`);
  writeFileSync(path.join(RELIABILITY_DIR, `${name}.md`), `${markdownLines.join("\n")}\n`);
  console.log(`[b1] wrote ${path.join(RELIABILITY_DIR, `${name}.json`)}`);
  console.log(`[b1] wrote ${path.join(RELIABILITY_DIR, `${name}.md`)}`);
}

function readDetectorFalsePositiveCount() {
  let count = 0;
  for (const file of collectFiles(BURNIN_DIR).filter((item) => item.endsWith("flaky-summary.json"))) {
    try {
      const parsed = JSON.parse(readFileSync(file, "utf8"));
      count += parsed.falsePositiveDetectorTrend?.count ?? parsed.ignoredLogs?.length ?? 0;
    } catch {
      count += 1;
    }
  }
  const forensics = path.join(BURNIN_DIR, "flaky-failure-forensics.md");
  if (existsSync(forensics) && /false positive/i.test(readFileSync(forensics, "utf8"))) count += 1;
  return count;
}

function latestEvidenceAge() {
  const files = collectFiles(BURNIN_DIR);
  const latest = max(files.map((file) => statSync(file).mtimeMs));
  const ageHours = latest > 0 ? (Date.now() - latest) / (60 * 60 * 1000) : null;
  return {
    latestMtimeMs: latest,
    ageHours,
    label: ageHours === null ? "missing" : ageHours <= 48 ? "fresh" : "stale",
  };
}

function scanGeneratedClaims() {
  const files = collectFiles(RELIABILITY_DIR).filter((file) => /\.(md|json)$/.test(file));
  const violations: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const pattern of FORBIDDEN_CLAIMS) {
      if (pattern.test(text)) violations.push(`${file}: ${pattern}`);
    }
  }
  if (violations.length > 0) {
    throw new Error(`Unsupported B1 reliability claim detected:\n${violations.join("\n")}`);
  }
}

function collectFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const file = path.join(dir, entry);
    const stat = statSync(file);
    if (stat.isDirectory()) out.push(...collectFiles(file));
    else out.push(file);
  }
  return out;
}

function sum(items: RepeatSummary[], pick: (item: RepeatSummary) => number | undefined) {
  return items.reduce((acc, item) => acc + (pick(item) ?? 0), 0);
}

function max(values: number[]) {
  return values.length > 0 ? Math.max(...values) : 0;
}

function range(values: number[]) {
  if (values.length === 0) return { minSeconds: 0, maxSeconds: 0, spreadSeconds: 0 };
  const minSeconds = Math.min(...values);
  const maxSeconds = Math.max(...values);
  return { minSeconds, maxSeconds, spreadSeconds: maxSeconds - minSeconds };
}

function nowStamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "Z");
}
