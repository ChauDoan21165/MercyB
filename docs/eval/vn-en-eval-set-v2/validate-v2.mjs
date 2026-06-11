#!/usr/bin/env node
// Local validation script — zero runtime deps, pure Node.js
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dir, "eval-set-v2.json"), "utf8"));

const VALID_TAGS = new Set([
  "tense","article","plural","preposition","word_order","copula",
  "collocation","register","pronoun","conjunction","literal_translation",
  "redundancy","omission",
]);
const VALID_LEVELS = new Set(["A1","A2","B1","B2","C1"]);
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

for (const e of entries) {
  const { id, input, expected, errorTags, tone, level, vietlishPattern } = e;

  if (!id) { fail("?", "missing id"); continue; }
  if (ids.has(id)) fail(id, `duplicate id`);
  ids.add(id);

  if (!input?.trim()) fail(id, "missing input");
  if (!expected?.trim()) fail(id, "missing expected");
  if (vietlishPattern === undefined || vietlishPattern === null) fail(id, "missing vietlishPattern");

  // errorTags
  if (!Array.isArray(errorTags)) {
    fail(id, "errorTags must be array");
  } else {
    for (const t of errorTags) {
      if (!VALID_TAGS.has(t)) fail(id, `unknown tag '${t}'`);
    }
  }

  // level
  if (!VALID_LEVELS.has(level)) fail(id, `invalid level '${level}'`);

  // tone
  if (!tone || typeof tone !== "object") {
    fail(id, "tone must be an object");
  } else {
    if (!VALID_REGISTERS.has(tone.register)) fail(id, `invalid register '${tone.register}'`);
    if (typeof tone.natural !== "boolean") fail(id, "tone.natural must be boolean");
    if (!tone.context?.trim()) fail(id, "tone.context must be non-empty");
  }

  // acceptable variants (empty tags) should have a vietlishPattern note
  if (errorTags?.length === 0 && !vietlishPattern?.toLowerCase().includes("acceptable")) {
    fail(id, "empty errorTags but vietlishPattern doesn't say 'acceptable'");
  }
}

// Coverage checks
const tagCounts = {};
for (const e of entries) {
  for (const t of e.errorTags ?? []) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
}
const levelCounts = {};
for (const e of entries) levelCounts[e.level] = (levelCounts[e.level] ?? 0) + 1;
const acceptableCount = entries.filter(e => e.errorTags?.length === 0).length;

console.log(`\n=== eval-set-v2 validation ===`);
console.log(`Entries: ${entries.length}`);
console.log(`Acceptable variants (errorTags=[]): ${acceptableCount}`);
console.log(`\nTag distribution:`);
for (const [t, c] of Object.entries(tagCounts).sort(([,a],[,b]) => b-a)) {
  console.log(`  ${t}: ${c}`);
}
console.log(`\nLevel distribution:`);
for (const [l, c] of Object.entries(levelCounts).sort()) {
  console.log(`  ${l}: ${c}`);
}

if (errors === 0) {
  console.log(`\n✓ All checks passed (${entries.length} entries, 0 errors)\n`);
  process.exit(0);
} else {
  console.error(`\n✗ ${errors} error(s) found\n`);
  process.exit(1);
}
