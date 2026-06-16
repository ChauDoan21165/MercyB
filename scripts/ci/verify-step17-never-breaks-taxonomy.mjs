#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const artifactPath = resolve(
  "docs/internal/intelligence-ladder/step17-never-breaks-taxonomy.md",
);

const requiredSections = [
  "Final Status",
  "Protection Rule",
  "Taxonomy",
  "CI Verifier",
  "Focused CI Command",
  "Missing Coverage",
  "Status Rule",
];

const requiredBehaviors = [
  "VN->EN correction detectors",
  "VN-accent transcript correction",
  "Vietlish corpus and prompt grounding",
  "Vietlish deterministic corrections",
  "Speak follow-up behavior",
  "Logic mode",
  "AI Tutor state machine",
  "AI Tutor state/reset behavior",
  "AI Tutor stale-session reset/notice",
  "AI Tutor memory boundaries",
  "Privacy and consent already covered",
];

const requiredPaths = [
  "src/lib/ai-tutor/__tests__/step5VnEnDetectors.test.ts",
  "src/lib/ai-tutor/__tests__/transcriptSanity.test.ts",
  "tests/regression/correction-golden.test.ts",
  "tests/regression/golden-set/correction-rules/vn-past-marker-regular-verb.json",
  "tests/regression/golden-set/correction-rules/has-past-time-marker.json",
  "tests/regression/golden-set/correction-rules/topic-comment.json",
  "tests/regression/golden-set/correction-rules/quantity-plural-s.json",
  "tests/regression/golden-set/correction-rules/missing-singular-article.json",
  "src/lib/tutor/__tests__/conversationPromptTemplates.test.ts",
  "src/lib/tutor/__tests__/conversationIntegrationContracts.test.ts",
  "src/lib/tutor/__tests__/step11VietlishCorpusD4Wave19.test.ts",
  "tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave19-200.json",
  "tests/regression/golden-set/correction-rules/vietlish-very-like.json",
  "tests/regression/golden-set/correction-rules/vietlish-duration-since-for.json",
  "tests/regression/golden-set/correction-rules/vietlish-discourse-according-to-me.json",
  "tests/regression/golden-set/correction-rules/vietlish-age-have-be.json",
  "tests/regression/golden-set/correction-rules/vietlish-collocation-take-photo.json",
  "src/lib/tutor/__tests__/speakFollowups.test.ts",
  "src/lib/tutor/__tests__/speakConversationState.test.ts",
  "src/lib/tutor/tests/vietlishLogicEngine.test.ts",
  "src/lib/tutor/tests/learningEventSummary.test.ts",
  "src/lib/tutor/__tests__/vietlishCuratedLogic.test.ts",
  "src/lib/ai-tutor/__tests__/sessionRuntime.test.ts",
  "src/lib/ai-tutor/__tests__/l1FollowUpLoop.test.ts",
  "docs/internal/intelligence-ladder/step16-observable-adaptation.md",
  "scripts/ci/verify-step16-observable-adaptation.mjs",
  "src/lib/ai-tutor/__tests__/staleSessionGuard.test.tsx",
  "src/lib/ai-tutor/WIRING_SPEC_STALE_SESSION_GUARD.md",
  "src/lib/ai-tutor/__tests__/learningMemory.test.ts",
  "src/lib/tutor/tests/studyOsBoundary.test.ts",
  "src/lib/ai-tutor/__tests__/safety.test.ts",
  "src/lib/tutor/__tests__/emotionalResponseBoundary.test.ts",
];

const focusedTests = [
  "src/lib/ai-tutor/__tests__/step5VnEnDetectors.test.ts",
  "src/lib/ai-tutor/__tests__/transcriptSanity.test.ts",
  "tests/regression/correction-golden.test.ts",
  "src/lib/tutor/__tests__/conversationPromptTemplates.test.ts",
  "src/lib/tutor/__tests__/speakFollowups.test.ts",
  "src/lib/tutor/tests/vietlishLogicEngine.test.ts",
  "src/lib/tutor/tests/learningEventSummary.test.ts",
  "src/lib/tutor/__tests__/vietlishCuratedLogic.test.ts",
  "src/lib/ai-tutor/__tests__/sessionRuntime.test.ts",
  "src/lib/ai-tutor/__tests__/l1FollowUpLoop.test.ts",
  "src/lib/ai-tutor/__tests__/staleSessionGuard.test.tsx",
  "src/lib/ai-tutor/__tests__/learningMemory.test.ts",
  "src/lib/ai-tutor/__tests__/safety.test.ts",
  "src/lib/tutor/__tests__/emotionalResponseBoundary.test.ts",
];

function fail(message) {
  console.error(`[step17-never-breaks-taxonomy] ${message}`);
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
  if (!haystack.includes(needle)) {
    fail(`${context} must include "${needle}"`);
  }
}

function runFocusedTests() {
  const result = spawnSync(
    process.execPath,
    ["./node_modules/vitest/vitest.mjs", "run", ...focusedTests],
    {
      cwd: resolve("."),
      encoding: "utf8",
      env: { ...process.env, CI: process.env.CI ?? "1" },
    },
  );

  if (result.status !== 0) {
    fail(
      [
        "focused never-breaks taxonomy tests failed",
        result.stdout.trim(),
        result.stderr.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

if (!existsSync(artifactPath)) {
  fail(`missing required file: ${artifactPath}`);
}

for (const path of requiredPaths) {
  if (!existsSync(resolve(path))) {
    fail(`missing mapped test or fixture: ${path}`);
  }
}

if (existsSync(artifactPath)) {
  const text = readText(artifactPath);
  const normalized = text.toLowerCase();

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
  } else if (
    finalStatusMatches[0] !==
    "never-breaks taxonomy created, with protected behaviors mapped to real tests and fixtures; missing coverage remains explicit."
  ) {
    fail(`invalid final status "${finalStatusMatches[0]}"`);
  }

  const taxonomy = section(text, "Taxonomy");
  for (const behavior of requiredBehaviors) {
    requireIncludes(taxonomy, behavior, "taxonomy");
  }

  for (const path of requiredPaths) {
    requireIncludes(text, path, "taxonomy mapped paths");
  }

  const missingCoverage = section(text, "Missing Coverage");
  for (const needle of [
    "No full live AI Tutor browser E2E",
    "does not claim exhaustive Vietnamese L1 transfer coverage",
    "does not prove ASR provider quality",
    "does not prove live speech recognition",
    "not broad model reasoning",
    "does not create new privacy guarantees",
  ]) {
    requireIncludes(missingCoverage, needle, "missing coverage");
  }

  const prohibitedClaims = [
    /\bexhaustive\s+(?:coverage|proof)\s+(?:is\s+)?(?:proven|complete|guaranteed)\b/i,
    /(?:^|[\n.])\s*(?:this taxonomy|coverage|ci|tests?)\s+(?:proves?|guarantees?)\s+all Vietlish can be corrected/i,
    /\bfull ASR quality proven\b/i,
    /\b(?:has|is|provides)\s+(?:a\s+)?live voice-session E2E proof\b/i,
    /\bpersistent personalization proven\b/i,
    /\buniversal privacy guarantee\b/i,
    /\bno missing coverage\b/i,
  ];
  for (const pattern of prohibitedClaims) {
    if (pattern.test(text)) {
      fail(`artifact contains prohibited overclaim: ${pattern}`);
    }
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

runFocusedTests();

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("[step17-never-breaks-taxonomy] verified");
