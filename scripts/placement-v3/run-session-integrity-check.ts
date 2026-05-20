#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";

type RawMetric = {
  runId: string;
  iteration: number;
  scenario: string;
  pass: boolean;
  sessionId: string | null;
  completionState: string | null;
  responses: number;
  retries: number;
  fallbacks: number;
  timeouts: number;
  duplicateSubmissions: number;
  persistenceErrors: number;
  recommendationErrors: number;
  cefrOutcome: string | null;
  failures: unknown[];
};

type Violation = {
  runId: string;
  iteration: number;
  sessionId: string | null;
  type: string;
  severity: "low" | "medium" | "high";
  message: string;
  metadata?: Record<string, unknown>;
};

function arg(name: string, fallback: string): string {
  const flag = `--${name}=`;
  return process.argv.find((value) => value.startsWith(flag))?.slice(flag.length) ?? fallback;
}

function readMetrics(input: string): RawMetric[] {
  const stat = fs.statSync(input);
  const dir = stat.isDirectory() ? input : path.dirname(input);
  return fs.readdirSync(dir)
    .filter((file) => /^\d{4}-.+\.json$/.test(file))
    .sort()
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as RawMetric);
}

function check(metrics: RawMetric[]): Violation[] {
  const violations: Violation[] = [];
  const seenSessions = new Set<string>();
  for (const metric of metrics) {
    if (!metric.sessionId) {
      violations.push({
        runId: metric.runId,
        iteration: metric.iteration,
        sessionId: null,
        type: "orphan_session",
        severity: metric.scenario === "interrupted_persistence" ? "medium" : "high",
        message: "Run did not produce a session id.",
      });
    } else if (seenSessions.has(metric.sessionId)) {
      violations.push({
        runId: metric.runId,
        iteration: metric.iteration,
        sessionId: metric.sessionId,
        type: "duplicate_session_id",
        severity: "high",
        message: "Two run iterations reused the same session id.",
      });
    } else {
      seenSessions.add(metric.sessionId);
    }

    if (metric.scenario !== "abandon" && metric.completionState !== "completed") {
      violations.push({
        runId: metric.runId,
        iteration: metric.iteration,
        sessionId: metric.sessionId,
        type: "incomplete_session",
        severity: "high",
        message: `Expected completed session, got ${metric.completionState ?? "null"}.`,
      });
    }

    if (metric.scenario === "abandon" && metric.completionState !== "abandoned") {
      violations.push({
        runId: metric.runId,
        iteration: metric.iteration,
        sessionId: metric.sessionId,
        type: "impossible_state_transition",
        severity: "high",
        message: `Abandon scenario ended in ${metric.completionState ?? "null"}.`,
      });
    }

    if (metric.completionState === "completed" && metric.responses < 5) {
      violations.push({
        runId: metric.runId,
        iteration: metric.iteration,
        sessionId: metric.sessionId,
        type: "incomplete_session",
        severity: "high",
        message: `Completed session only has ${metric.responses} responses.`,
      });
    }

    if (metric.duplicateSubmissions > 2) {
      violations.push({
        runId: metric.runId,
        iteration: metric.iteration,
        sessionId: metric.sessionId,
        type: "replayed_submission",
        severity: "medium",
        message: `Observed ${metric.duplicateSubmissions} duplicate submissions.`,
      });
    }

    if (metric.retries >= 8) {
      violations.push({
        runId: metric.runId,
        iteration: metric.iteration,
        sessionId: metric.sessionId,
        type: "retry_loop",
        severity: "high",
        message: `Observed ${metric.retries} retries.`,
      });
    }

    if (metric.completionState === "completed" && !metric.cefrOutcome) {
      violations.push({
        runId: metric.runId,
        iteration: metric.iteration,
        sessionId: metric.sessionId,
        type: "inconsistent_cefr_outcome",
        severity: "high",
        message: "Completed session has no CEFR outcome.",
      });
    }

    if (!metric.pass && metric.failures.length === 0) {
      violations.push({
        runId: metric.runId,
        iteration: metric.iteration,
        sessionId: metric.sessionId,
        type: "unclassified_failure",
        severity: "medium",
        message: "Run failed without a classified failure.",
      });
    }
  }
  return violations;
}

const input = arg("input", "docs/placement-v3/endurance/raw-runs");
const out = arg("out", path.join(input, "integrity.json"));
const metrics = readMetrics(input);
const violations = check(metrics);
const result = {
  input,
  checkedAt: new Date().toISOString(),
  totalRuns: metrics.length,
  violationCount: violations.length,
  violations,
};
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (violations.some((v) => v.severity === "high")) process.exitCode = 1;
