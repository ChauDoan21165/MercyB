#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const artifactPath = resolve(
  "docs/internal/intelligence-ladder/step13-18-privacy-register-gates.md",
);

const requiredPaths = [
  artifactPath,
  resolve("src/lib/conversationCapture/captureConsent.ts"),
  resolve("src/lib/conversationCapture/conversationCapture.ts"),
  resolve("src/lib/tutor/conversationTelemetry.ts"),
  resolve("src/lib/ai-tutor/learningMemory.ts"),
  resolve("src/lib/tutor/learningEventSummary.ts"),
  resolve("src/lib/ai-tutor/safety.ts"),
  resolve("src/lib/tutor/conversationWarmth.ts"),
  resolve("src/lib/tutor/emotionalResponseBoundary.ts"),
];

const focusedTests = [
  "src/lib/conversationCapture/__tests__/captureConsent.test.ts",
  "src/lib/conversationCapture/__tests__/conversationCapture.test.ts",
  "src/lib/tutor/__tests__/conversationIntegrationContracts.test.ts",
  "src/lib/ai-tutor/__tests__/learningMemory.test.ts",
  "src/lib/tutor/tests/learningEventSummary.test.ts",
  "src/lib/tutor/tests/studyOsBoundary.test.ts",
  "src/lib/ai-tutor/__tests__/safety.test.ts",
  "src/lib/tutor/__tests__/conversationWarmth.test.ts",
  "src/lib/tutor/__tests__/emotionalResponseBoundary.test.ts",
  "src/lib/ai-tutor/__tests__/aiTutorService.test.ts",
];

const focusedTestPaths = focusedTests.map((path) => resolve(path));

function fail(message) {
  console.error(`[step13-18-privacy-register-gates] ${message}`);
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

function requireIncludesCi(haystack, needle, context) {
  if (!haystack.toLowerCase().includes(needle.toLowerCase())) {
    fail(`${context} must include "${needle}"`);
  }
}

function requirePattern(haystack, pattern, context) {
  if (!pattern.test(haystack)) {
    fail(`${context} must match ${pattern}`);
  }
}

function requireNoPattern(haystack, pattern, context) {
  if (pattern.test(haystack)) {
    fail(`${context} must not match ${pattern}`);
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
        "focused privacy/register gate tests failed",
        result.stdout.trim(),
        result.stderr.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

for (const path of [...requiredPaths, ...focusedTestPaths]) {
  if (!existsSync(path)) fail(`missing required file: ${path}`);
}

if (existsSync(artifactPath)) {
  const text = readText(artifactPath);
  const normalized = text.toLowerCase();

  for (const heading of [
    "Final Status",
    "What Is Allowed",
    "What Is Blocked",
    "Tests Enforcing It",
    "Consent And Capture Gate",
    "Family And Parent Bridge",
    "Register And Politeness Gate",
    "What Remains Missing",
    "Status Rule",
  ]) {
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
    "privacy/register gates documented and verifier-backed; remaining gaps explicit."
  ) {
    fail(`invalid final status "${finalStatusMatches[0]}"`);
  }

  const allowed = section(text, "What Is Allowed");
  for (const needle of [
    "Generic family, parent, child, school, and childcare language practice",
    "Consented conversation capture",
    "safe aggregate tags",
    "Polite correction and abstention copy",
  ]) {
    requireIncludes(allowed, needle, "what is allowed");
  }

  const blocked = section(text, "What Is Blocked");
  for (const needle of [
    "No raw learner text persistence without consent",
    "No hidden surveillance",
    "No parent leakage",
    "No hidden parent or guardian reporting bridge",
    "No rude correction framing",
    "No overclaiming",
  ]) {
    requireIncludes(blocked, needle, "what is blocked");
  }

  const tests = section(text, "Tests Enforcing It");
  for (const path of focusedTests) {
    requireIncludes(tests, path, "tests enforcing it");
  }
  requireIncludes(
    tests,
    "scripts/ci/verify-step13-18-privacy-register-gates.mjs",
    "tests enforcing it",
  );

  const consent = section(text, "Consent And Capture Gate");
  for (const needle of [
    "defaults to no consent",
    "only the exact stored value",
    "re-checks before every turn write",
    "re-checks before session close",
    "does not authorize new capture callers",
    "data-persistence expansion",
  ]) {
    requireIncludesCi(consent, needle, "consent and capture gate");
  }

  const parent = section(text, "Family And Parent Bridge");
  for (const needle of [
    "not a reporting bridge",
    "childName",
    "learnerText",
    "transcript",
    "audioBlob",
    "kids mode",
    "no parent dashboard",
  ]) {
    requireIncludes(parent, needle, "family and parent bridge");
  }

  const register = section(text, "Register And Politeness Gate");
  for (const needle of [
    "Vietnamese-primary warmth",
    "blocks shame language",
    "blocks fabricated scores",
    "abstention redirects",
    "uncertainty becomes a live clarification reply",
    "distress pauses correction",
    "static polite refusal messages",
  ]) {
    requireIncludes(register, needle, "register and politeness gate");
  }

  const missing = section(text, "What Remains Missing");
  for (const needle of [
    "No full browser E2E",
    "No formal parent/guardian product surface",
    "No account-level consent lifecycle audit",
    "No RLS or database migration audit",
    "No broad production telemetry audit",
    "No human-rater register benchmark",
    "This packet does not eliminate every learner privacy risk",
  ]) {
    requireIncludes(missing, needle, "what remains missing");
  }

  const prohibitedClaims = [
    /\bprivacy\s+(?:certified|complete|guaranteed)\b/i,
    /\bno\s+privacy\s+risk\b/i,
    /\ball\s+learner\s+privacy\s+risk\s+is\s+eliminated\b/i,
    /\bparent\s+dashboard\s+(?:safe|audited|certified|implemented)\b/i,
    /\bguardian\s+reporting\s+(?:safe|audited|implemented)\b/i,
    /\buniversal\s+no-leak\s+guarantee\b/i,
    /\braw learner text persistence is always blocked\b/i,
  ];
  for (const pattern of prohibitedClaims) {
    if (pattern.test(text)) {
      fail(`artifact contains prohibited overclaim: ${pattern}`);
    }
  }
}

if (existsSync(resolve("src/lib/conversationCapture/captureConsent.ts"))) {
  const source = readText(resolve("src/lib/conversationCapture/captureConsent.ts"));
  requireIncludes(source, 'const CONSENT_KEY = "mb-capture-consent"', "capture consent source");
  requirePattern(
    source,
    /getItem\(CONSENT_KEY\)\s*===\s*"true"/,
    "capture consent source",
  );
  requirePattern(source, /catch\s*{\s*return false;\s*\/\/ fail closed\s*}/, "capture consent source");
  requirePattern(
    source,
    /raw\s*===\s*"true"\s*\|\|\s*raw\s*===\s*"false"/,
    "capture consent decision source",
  );
}

if (existsSync(resolve("src/lib/tutor/conversationTelemetry.ts"))) {
  const source = readText(resolve("src/lib/tutor/conversationTelemetry.ts"));
  requireIncludes(source, 'import { hasCaptureConsent }', "conversation telemetry source");
  requirePattern(source, /const consentAtStart\s*=\s*hasCaptureConsent\(\)/, "conversation telemetry source");
  requirePattern(source, /if \(consentAtStart && userId\)\s*{[\s\S]*startSession/, "conversation telemetry source");
  requirePattern(source, /if \(session\.sessionId && hasCaptureConsent\(\)\)\s*{[\s\S]*logTurn/, "conversation telemetry source");
  requirePattern(source, /if \(session\.sessionId && hasCaptureConsent\(\)\)\s*{[\s\S]*endSession/, "conversation telemetry source");
}

if (existsSync(resolve("src/lib/conversationCapture/conversationCapture.ts"))) {
  const source = readText(resolve("src/lib/conversationCapture/conversationCapture.ts"));
  requireIncludes(
    source,
    "Consent is the CALLER's job",
    "conversation capture source",
  );
  requireIncludes(source, "learner_input", "conversation capture source");
  requireIncludes(source, "ai_response", "conversation capture source");
}

if (existsSync(resolve("src/lib/ai-tutor/learningMemory.ts"))) {
  const source = readText(resolve("src/lib/ai-tutor/learningMemory.ts"));
  for (const needle of [
    "Does NOT store: raw audio, raw user text, raw transcripts",
    "Safe aggregate strengths only; never raw learner text.",
    "Safe aggregate review topics only; never raw learner text.",
    "sanitizeMemoryTag",
    "return \"general\"",
  ]) {
    requireIncludes(source, needle, "learning memory source");
  }
  for (const pattern of [
    /\blearnerText\b/,
    /\bcorrectedText\b/,
    /\btranscript\s*:/,
    /\baudioBlob\b/,
    /\brawAudio\b/,
  ]) {
    requireNoPattern(source.replace(/\/\/.*$/gm, ""), pattern, "learning memory executable source");
  }
}

if (existsSync(resolve("src/lib/ai-tutor/safety.ts"))) {
  const source = readText(resolve("src/lib/ai-tutor/safety.ts"));
  requireIncludes(source, "Returns false when isKidsMode is true", "safety source");
  requirePattern(source, /return !context\.isKidsMode;/, "safety source");
  requireIncludes(source, "All messages are polite, in Vietnamese", "safety source");
  requireIncludes(source, "Never log raw learner text or raw provider output", "safety source");
}

if (existsSync(resolve("src/lib/tutor/emotionalResponseBoundary.ts"))) {
  const source = readText(resolve("src/lib/tutor/emotionalResponseBoundary.ts"));
  for (const pattern of [
    /\blocalStorage\b/,
    /\bsessionStorage\b/,
    /\bindexedDB\b/i,
    /\bcookie\b/i,
    /\bsupabase\b/i,
    /\bfetch\s*\(/,
    /\bopenai\b/i,
    /\banthropic\b/i,
  ]) {
    requireNoPattern(source, pattern, "emotional response boundary source");
  }
  for (const forbidden of [/diagnos/i, /depress/i, /anxiety/i, /trauma/i, /clinical/i]) {
    requireNoPattern(source, forbidden, "emotional response boundary source");
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

runFocusedTests();

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("[step13-18-privacy-register-gates] verified");
