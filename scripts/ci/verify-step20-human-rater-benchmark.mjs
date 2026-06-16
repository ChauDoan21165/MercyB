#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const artifactPath = resolve(
  "docs/internal/intelligence-ladder/step20-human-rater-benchmark.md",
);

function fail(message) {
  console.error(`[step20-human-rater-benchmark] ${message}`);
  process.exitCode = 1;
}

function readText(path) {
  return readFileSync(path, "utf8");
}

function section(text, heading) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return "";

  const body = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) break;
    body.push(lines[index]);
  }
  return body.join("\n");
}

function requireIncludes(haystack, needle, context) {
  if (!haystack.toLowerCase().includes(needle.toLowerCase())) {
    fail(`${context} must include "${needle}"`);
  }
}

if (!existsSync(artifactPath)) {
  fail(`missing artifact: ${artifactPath}`);
} else {
  const text = readText(artifactPath);
  const normalized = text.toLowerCase();

  const requiredSections = [
    "Final Status",
    "Evidence Status",
    "Rubric",
    "Sample Categories",
    "Pass/Fail Threshold",
    "Rater Instructions",
    "What Counts as Real Human Evidence",
    "Missing Real Human-Rater Data",
    "Status Rule",
  ];

  for (const heading of requiredSections) {
    if (!section(text, heading).trim()) {
      fail(`missing or empty section: ## ${heading}`);
    }
  }

  const finalStatusMatches = [
    ...normalized.matchAll(/final status:\s*([^\n]+)/g),
  ].map((match) => match[1].trim());
  if (finalStatusMatches.length !== 1) {
    fail(`expected exactly one "Final status:" line, found ${finalStatusMatches.length}`);
  } else if (finalStatusMatches[0] !== "benchmark-ready, not evidence-closed") {
    fail(
      `invalid final status "${finalStatusMatches[0]}"; expected benchmark-ready, not evidence-closed`,
    );
  }

  requireIncludes(
    text,
    "No real human ratings exist yet",
    "artifact honesty statement",
  );
  requireIncludes(text, "does not claim that the benchmark has passed", "artifact");
  requireIncludes(text, "invented native-speaker", "artifact anti-fabrication guard");
  requireIncludes(text, "Model-generated ratings", "non-evidence list");
  requireIncludes(text, "CI passing output", "non-evidence list");

  const evidenceStatus = section(text, "Evidence Status");
  requireIncludes(evidenceStatus, "Real human ratings", "evidence status");
  requireIncludes(evidenceStatus, "Missing", "evidence status");
  requireIncludes(evidenceStatus, "Benchmark pass", "evidence status");
  requireIncludes(evidenceStatus, "Not claimed", "evidence status");
  requireIncludes(evidenceStatus, "must not be counted", "evidence status");

  const rubric = section(text, "Rubric");
  const rubricNeedles = [
    "Correction accuracy",
    "Explanation quality",
    "Learner safety and kindness",
    "Vietnamese L1 relevance",
    "Pedagogical next step",
    "Evidence grounding",
    "1-5 scale",
  ];
  for (const needle of rubricNeedles) {
    requireIncludes(rubric, needle, "rubric");
  }

  const categories = section(text, "Sample Categories");
  const categoryNeedles = [
    "at least 30",
    "Vietnamese grammar interference",
    "Pronunciation feedback",
    "Writing correction",
    "Conversation/tutor response",
    "Ambiguous or insufficient evidence",
    "High-risk learner-safety cases",
    "Regression sentinel cases",
    "anonymized",
  ];
  for (const needle of categoryNeedles) {
    requireIncludes(categories, needle, "sample categories");
  }

  const threshold = section(text, "Pass/Fail Threshold");
  const thresholdNeedles = [
    "At least 30",
    "At least 2 independent qualified raters",
    "Mean score",
    "4.2",
    "No dimension",
    "4.0",
    "90%",
    "Zero critical failures",
    "Inter-rater agreement",
    "adjudicated",
  ];
  for (const needle of thresholdNeedles) {
    requireIncludes(threshold, needle, "pass/fail threshold");
  }

  const instructions = section(text, "Rater Instructions");
  const instructionNeedles = [
    "Score only what is visible",
    "frozen sample packet",
    "unsupported certainty",
    "critical failure",
    "Work independently",
    "reviewer ID",
    "do not",
    "Invent",
  ];
  for (const needle of instructionNeedles) {
    requireIncludes(instructions, needle, "rater instructions");
  }

  const realEvidence = section(text, "What Counts as Real Human Evidence");
  const realEvidenceNeedles = [
    "actual qualified human raters",
    "frozen anonymized sample packet",
    "Raw rater score exports",
    "reviewer role/qualification",
    "review dates",
    "Per-sample, per-dimension scores",
    "Inter-rater agreement",
    "Owner acceptance",
    "Placeholder reviewer rows",
    "Invented native-speaker claims",
  ];
  for (const needle of realEvidenceNeedles) {
    requireIncludes(realEvidence, needle, "real human evidence definition");
  }

  const missing = section(text, "Missing Real Human-Rater Data");
  const missingNeedles = [
    "Frozen 30+ sample packet",
    "Completed raw rater sheets",
    "at least 2 qualified human raters",
    "Reviewer identities",
    "Review dates",
    "Per-sample dimension scores",
    "Critical-failure notes",
    "Aggregate pass/fail calculation",
    "Inter-rater agreement calculation",
    "Owner acceptance",
  ];
  for (const needle of missingNeedles) {
    requireIncludes(missing, needle, "missing real human-rater data");
  }

  const prohibitedClaims = [
    /\bbenchmark\s+passed\b/i,
    /\bhuman[- ]rater\s+benchmark\s+passed\b/i,
    /\bfully\s+evidence[- ]closed\b/i,
    /\bnative\s+speakers?\s+approved\b/i,
    /\breal\s+human\s+ratings\s+attached\b/i,
  ];
  for (const pattern of prohibitedClaims) {
    if (pattern.test(text)) {
      fail(`artifact contains prohibited unsupported pass/evidence claim: ${pattern}`);
    }
  }
}

if (process.exitCode) {
  process.exit();
}

console.log(`[step20-human-rater-benchmark] verified ${artifactPath}`);
