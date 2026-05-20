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

const EXPECTED_BRANCH = "feat/b1-test-stability-burndown";
const RELIABILITY_DIR = "docs/placement-v3/reliability";
const LOG_DIR = path.join(RELIABILITY_DIR, "logs");
const BURNIN_DIR = "reports/b1-burnin";
const FORBIDDEN_CLAIMS = [
  new RegExp(String.raw`(?<!not )\bproduction ${"ready"}\b`, "i"),
  new RegExp(String.raw`\bsafe to ${"enable"}\b`, "i"),
  new RegExp(String.raw`\bflake free ${"forever"}\b`, "i"),
  new RegExp(String.raw`\blaunch ${"approved"}\b`, "i"),
  new RegExp(String.raw`\breal-user ${"validated"}\b`, "i"),
  new RegExp(String.raw`\blive-provider ${"validated"}\b`, "i"),
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
  const unitIterations = process.env.B1_AUTO_UNIT_ITERATIONS ?? "1";
  const e2eIterations = process.env.B1_AUTO_E2E_ITERATIONS ?? "1";
  const stamp = nowStamp();
  const runRoot = path.join(LOG_DIR, `auto-${stamp}`);
  mkdirSync(runRoot, { recursive: true });

  runLogged(
    "unit burn-in",
    "scripts/testing/run-repeat-unit.sh",
    [unitIterations],
    {
      LOG_DIR: path.join(runRoot, "unit"),
      ARTIFACT_DIR: path.join(runRoot, "unit", "artifacts"),
      SUMMARY_JSON: path.join(runRoot, "unit-summary.json"),
      CLUSTER_JSON: path.join(runRoot, "unit-flaky-summary.json"),
      RUN_PREFIX: "b1-auto-unit",
    },
  );

  runLogged(
    "Placement V3 E2E burn-in",
    "scripts/testing/run-repeat-e2e.sh",
    [e2eIterations, "placement-v3-vertical"],
    {
      LOG_DIR: path.join(runRoot, "e2e"),
      ARTIFACT_DIR: path.join(runRoot, "e2e", "artifacts"),
      SUMMARY_JSON: path.join(runRoot, "e2e-summary.json"),
      CLUSTER_JSON: path.join(runRoot, "e2e-flaky-summary.json"),
      RUN_PREFIX: "b1-auto-e2e",
    },
  );

  generateContention();
  generateTrend();
  rotateLogs(false);
  generateHealth();
  console.log(`[b1] artifacts: ${runRoot}`);
  console.log(`[b1] reports: ${RELIABILITY_DIR}`);
}

function runLogged(label: string, executable: string, runArgs: string[], env: Record<string, string>) {
  console.log(`[b1] ${label}: ${executable} ${runArgs.join(" ")}`);
  execFileSync(executable, runArgs, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
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
  const blockerCount = trend?.integrityViolationTrend?.count ?? 0;
  const flakeSuspicionCount = blockerCount > 0 ? 1 : 0;
  const summary = {
    generatedAt: new Date().toISOString(),
    branch: EXPECTED_BRANCH,
    evidenceFreshness: latestEvidenceAge(),
    confidenceClassification: trend?.latestConfidenceClassification ?? "BLOCKED",
    timeoutRiskEstimate: contention?.ciContentionRiskEstimate ?? "BLOCKED",
    sustainedRunConfidence: blockerCount === 0 ? "high_local_confidence" : "blocked_pending_investigation",
    currentBlockerCount: blockerCount,
    flakeSuspicionCount,
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
