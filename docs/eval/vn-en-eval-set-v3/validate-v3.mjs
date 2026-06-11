#!/usr/bin/env node
// Extended validator for eval-set-v3:
//   1. Schema validation (same rules as v2)
//   2. Cross-set dedup check: zero duplicate inputs vs v1 + v2 (case-insensitive)
//   3. Target-category coverage check: literal_translation | collocation >= 50%
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));

const data  = JSON.parse(readFileSync(join(__dir, "eval-set-v3.json"), "utf8"));
const v1    = JSON.parse(readFileSync(join(__dir, "../vn-en-eval-set-v1/eval-set.json"), "utf8"));
const v2    = JSON.parse(readFileSync(join(__dir, "../vn-en-eval-set-v2/eval-set-v2.json"), "utf8"));

const VALID_TAGS = new Set([
  "tense","article","plural","preposition","word_order","copula",
  "collocation","register","pronoun","conjunction","literal_translation",
  "redundancy","omission",
]);
const VALID_LEVELS    = new Set(["A1","A2","B1","B2","C1"]);
const VALID_REGISTERS = new Set(["informal","neutral","formal"]);

let errors = 0;
const ids = new Set();

function fail(id, msg) {
  console.error(`  FAIL [${id}] ${msg}`);
  errors++;
}

const entries = data.entries ?? [];

// count field
if (data.count !== entries.length) {
  console.error(`FAIL: count=${data.count} but entries.length=${entries.length}`);
  errors++;
}

// --- Schema validation ---
for (const e of entries) {
  const { id, input, expected, errorTags, tone, level, vietlishPattern } = e;

  if (!id) { fail("?", "missing id"); continue; }
  if (ids.has(id)) fail(id, "duplicate id");
  ids.add(id);

  if (!input?.trim())    fail(id, "missing input");
  if (!expected?.trim()) fail(id, "missing expected");
  if (vietlishPattern === undefined || vietlishPattern === null)
    fail(id, "missing vietlishPattern");

  if (!Array.isArray(errorTags)) {
    fail(id, "errorTags must be array");
  } else {
    for (const t of errorTags) {
      if (!VALID_TAGS.has(t)) fail(id, `unknown tag '${t}'`);
    }
  }

  if (!VALID_LEVELS.has(level)) fail(id, `invalid level '${level}'`);

  if (!tone || typeof tone !== "object") {
    fail(id, "tone must be an object");
  } else {
    if (!VALID_REGISTERS.has(tone.register)) fail(id, `invalid register '${tone.register}'`);
    if (typeof tone.natural !== "boolean")   fail(id, "tone.natural must be boolean");
    if (!tone.context?.trim())               fail(id, "tone.context must be non-empty");
  }

  if (errorTags?.length === 0 && !vietlishPattern?.toLowerCase().includes("acceptable")) {
    fail(id, "empty errorTags but vietlishPattern does not say 'acceptable'");
  }
}

// --- Cross-set dedup (case-insensitive, trimmed) ---
const priorInputs = new Set([
  ...(v1.entries ?? []).map(e => e.input?.trim().toLowerCase()),
  ...(v2.entries ?? []).map(e => e.input?.trim().toLowerCase()),
].filter(Boolean));

for (const e of entries) {
  const norm = e.input?.trim().toLowerCase();
  if (norm && priorInputs.has(norm)) {
    fail(e.id, `duplicate input vs v1/v2: "${e.input}"`);
  }
}

// --- Coverage checks ---
const tagCounts   = {};
const levelCounts = {};
const acceptableCount = entries.filter(e => e.errorTags?.length === 0).length;

for (const e of entries) {
  for (const t of e.errorTags ?? []) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  levelCounts[e.level] = (levelCounts[e.level] ?? 0) + 1;
}

// Target-category gate: literal_translation | collocation >= 50% of all entries
const targetEntries = entries.filter(e =>
  e.errorTags?.includes("literal_translation") || e.errorTags?.includes("collocation")
);
const targetRatio = targetEntries.length / entries.length;

console.log(`\n=== eval-set-v3 validation ===`);
console.log(`Entries: ${entries.length}`);
console.log(`Acceptable variants (errorTags=[]): ${acceptableCount}`);

console.log(`\nTag distribution:`);
for (const [t, c] of Object.entries(tagCounts).sort(([, a], [, b]) => b - a)) {
  console.log(`  ${t}: ${c}`);
}

console.log(`\nLevel distribution:`);
for (const [l, c] of Object.entries(levelCounts).sort()) {
  console.log(`  ${l}: ${c}`);
}

console.log(`\nStage-2 target categories (literal_translation | collocation):`);
console.log(`  entries hitting target: ${targetEntries.length} / ${entries.length} (${(targetRatio * 100).toFixed(0)}%)`);

if (targetRatio < 0.50) {
  console.error(`FAIL: target category coverage ${(targetRatio * 100).toFixed(0)}% < 50% required for v3`);
  errors++;
} else {
  console.log(`  ✓ target coverage gate passed (>=50%)`);
}

console.log(`\nCross-set dedup: checked against ${priorInputs.size} inputs from v1+v2`);

if (errors === 0) {
  console.log(`\n✓ All checks passed (${entries.length} entries, 0 errors)\n`);
  process.exit(0);
} else {
  console.error(`\n✗ ${errors} error(s) found\n`);
  process.exit(1);
}
