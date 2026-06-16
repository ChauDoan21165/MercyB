#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const artifactPath = resolve(
  "docs/internal/intelligence-ladder/step16-observable-adaptation.md",
);
const sourcePath = resolve("src/lib/ai-tutor/l1FollowUpLoop.ts");
const testPath = resolve("src/lib/ai-tutor/__tests__/l1FollowUpLoop.test.ts");

function fail(message) {
  console.error(`[step16-observable-adaptation] ${message}`);
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

function requirePattern(haystack, pattern, context) {
  if (!pattern.test(haystack)) {
    fail(`${context} must match ${pattern}`);
  }
}

function runFocusedRuntimeTest() {
  const result = spawnSync(
    process.execPath,
    [
      "./node_modules/vitest/vitest.mjs",
      "run",
      "src/lib/ai-tutor/__tests__/l1FollowUpLoop.test.ts",
    ],
    {
      cwd: resolve("."),
      encoding: "utf8",
      env: { ...process.env, CI: process.env.CI ?? "1" },
    },
  );

  if (result.status !== 0) {
    fail(
      [
        "focused l1FollowUpLoop runtime tests failed",
        result.stdout.trim(),
        result.stderr.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

for (const path of [artifactPath, sourcePath, testPath]) {
  if (!existsSync(path)) fail(`missing required file: ${path}`);
}

if (existsSync(artifactPath)) {
  const text = readText(artifactPath);
  const normalized = text.toLowerCase();

  const requiredSections = [
    "Final Status",
    "Observable Adaptation Surface",
    "Focus Tag Behavior",
    "Follow-Up Selection Behavior",
    "Reset Behavior",
    "Summary/Cap Behavior",
    "Non-Persistent Session Behavior",
    "Current Test Evidence",
    "Anti-Fake-Personalization Guard",
    "What Is Not Yet Real",
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
  } else if (finalStatusMatches[0] !== "observable in-session adaptation proven, not personalization") {
    fail(
      `invalid final status "${finalStatusMatches[0]}"; expected observable in-session adaptation proven, not personalization`,
    );
  }

  const focus = section(text, "Focus Tag Behavior");
  for (const needle of [
    "focusTag",
    "advanceL1Focus",
    "initialL1FocusState",
    "start_focus",
    "converse_naturally",
    "sticky",
  ]) {
    requireIncludes(focus, needle, "focus tag behavior");
  }

  const followUp = section(text, "Follow-Up Selection Behavior");
  for (const needle of [
    "authored practice content",
    "L1WeaknessTag",
    "promptVi",
    "exampleEn",
    "continue_focus",
    "usedContextIds",
    "never repeats",
  ]) {
    requireIncludes(followUp, needle, "follow-up selection behavior");
  }

  const reset = section(text, "Reset Behavior");
  for (const needle of [
    "offer_move_on",
    "offeredMoveOn",
    "release_focus",
    "initialL1FocusState",
    "focusTag: null",
    "usedContextIds: []",
  ]) {
    requireIncludes(reset, needle, "reset behavior");
  }

  const cap = section(text, "Summary/Cap Behavior");
  for (const needle of [
    "L1_FOCUS_DEPTH_CAP",
    "3",
    "offerMoveOn: true",
    "followUp: null",
    "messageVi",
    "prevents a nag loop",
  ]) {
    requireIncludes(cap, needle, "summary/cap behavior");
  }

  const nonPersistent = section(text, "Non-Persistent Session Behavior");
  for (const needle of [
    "in-session only",
    "initialL1FocusState",
    "no localStorage",
    "no sessionStorage",
    "Supabase",
    "does not persist learner facts",
  ]) {
    requireIncludes(nonPersistent, needle, "non-persistent session behavior");
  }

  const notYetReal = section(text, "What Is Not Yet Real");
  for (const needle of [
    "no persistent learner profile",
    "no cross-session memory",
    "no mastery graph",
    "no consented durable learner-data capture",
    "no model-driven personalization",
    "no human-rater validation",
    "no production evidence",
  ]) {
    requireIncludes(notYetReal, needle, "what is not yet real");
  }

  const prohibitedClaims = [
    /\bpersonalized learning profile\s+proven\b/i,
    /\bpersistent weakness memory\s+proven\b/i,
    /\bcross-session personalization\s+proven\b/i,
    /\badaptive mastery model\s+proven\b/i,
    /\bhidden learner profiling\s+(proven|enabled|available|active)\b/i,
  ];
  for (const pattern of prohibitedClaims) {
    if (pattern.test(text)) {
      fail(`artifact contains prohibited personalization claim: ${pattern}`);
    }
  }
}

if (existsSync(sourcePath)) {
  const source = readText(sourcePath);

  for (const needle of [
    "export const L1_FOCUS_DEPTH_CAP = 3",
    "focusTag: null",
    "turnsOnTag: 0",
    "usedContextIds: []",
    "offeredMoveOn: false",
    "action: \"start_focus\"",
    "action: \"continue_focus\"",
    "action: \"offer_move_on\"",
    "action: \"release_focus\"",
    "action: \"converse_naturally\"",
    "export function advanceL1Focus",
    "export function followUpsForTag",
  ]) {
    requireIncludes(source, needle, "l1FollowUpLoop source");
  }

  const forbiddenPersistence = [
    /\blocalStorage\b/,
    /\bsessionStorage\b/,
    /\bindexedDB\b/i,
    /\bcookie\b/i,
    /\bsupabase\b/i,
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
  ];
  for (const pattern of forbiddenPersistence) {
    if (pattern.test(source)) {
      fail(`l1FollowUpLoop source contains persistence/network surface: ${pattern}`);
    }
  }
}

if (existsSync(testPath)) {
  const test = readText(testPath);
  for (const needle of [
    "starts a focus on the first high-confidence focusable tag",
    "delivers DEPTH_CAP distinct same-tag practices, then offers to move on",
    "offers to move on as soon as the learner produces a clean turn",
    "releases focus after an offer when the learner moves on cleanly",
    "stays on the current weakness even if a different high-severity tag fires",
    "is a pure function",
    "starts a new in-session state without carrying the prior focus",
  ]) {
    requireIncludes(test, needle, "l1FollowUpLoop tests");
  }

  for (const pattern of [
    /expect\(newSessionDecision\.action\)\.toBe\("converse_naturally"\)/,
    /expect\(newSessionDecision\.nextState\)\.toEqual\(initialL1FocusState\)/,
    /expect\(d\.action\)\.toBe\("offer_move_on"\)/,
    /expect\(d\.action\)\.toBe\("release_focus"\)/,
  ]) {
    requirePattern(test, pattern, "observable adaptation tests");
  }
}

if (process.exitCode) {
  process.exit();
}

runFocusedRuntimeTest();

if (process.exitCode) {
  process.exit();
}

console.log(`[step16-observable-adaptation] verified ${artifactPath}`);
