#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const SOURCE_PATH = "src/languages/vietnamese/lessons-a1.ts";
const PAYLOAD_PATH = "reports/cell-inventory/ipa-en-map-vn-en-a1.json";
const EXPECTED = {
  total: 627,
  populated: 610,
  nulls: 17,
  oov: ["kh", "otp", "stomachache", "wi", "xem"],
};
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function loadLessons() {
  const source = readText(SOURCE_PATH);
  const executable = source
    .replace(/^import type .*;\n/gm, "")
    .replace("export const lessons: VietnameseLesson[] =", "const lessons =")
    .replace(/\nexport default lessons;\s*$/m, "\nlessons;");
  return vm.runInNewContext(executable, {}, { filename: SOURCE_PATH });
}

function fail(message) {
  console.error(`[verify-ipa-en] ${message}`);
  process.exitCode = 1;
}

const payload = JSON.parse(readText(PAYLOAD_PATH));
const payloadByCellId = new Map(payload.cells.map((cell) => [cell.cell_id, cell]));
const lessons = loadLessons();
const seenUuids = new Map();
const oov = new Set();
let total = 0;
let populated = 0;
let nulls = 0;

for (const lesson of lessons) {
  const lessonId = String(lesson.id).padStart(3, "0");
  for (const [index, phrase] of (lesson.phrases ?? []).entries()) {
    const syntheticId = `vi-en:A1:lesson-${lessonId}:vocabulary-${String(index + 1).padStart(3, "0")}`;
    checkObject({ syntheticId, object: phrase, english: phrase.english });
  }
  for (const [index, turn] of (lesson.dialogue ?? []).entries()) {
    const syntheticId = `vi-en:A1:lesson-${lessonId}:dialogue-turn-${String(index + 1).padStart(3, "0")}`;
    checkObject({ syntheticId, object: turn, english: turn.english });
  }
}

function checkObject({ syntheticId, object, english }) {
  total += 1;
  const payloadCell = payloadByCellId.get(syntheticId);
  if (!payloadCell) {
    fail(`Missing payload entry for ${syntheticId}`);
    return;
  }
  if (payloadCell.exact_text !== english) {
    fail(`${syntheticId} text mismatch: ${JSON.stringify(english)} !== ${JSON.stringify(payloadCell.exact_text)}`);
  }
  if (!UUID_RE.test(String(object.cell_id ?? ""))) {
    fail(`${syntheticId} missing persisted UUID cell_id`);
  } else if (seenUuids.has(object.cell_id)) {
    fail(`${syntheticId} duplicates UUID ${object.cell_id} from ${seenUuids.get(object.cell_id)}`);
  } else {
    seenUuids.set(object.cell_id, syntheticId);
  }

  if (payloadCell.status === "complete") {
    if (object.ipa_en !== payloadCell.ipa_en) {
      fail(`${syntheticId} ipa_en mismatch`);
    }
    if (typeof object.ipa_en === "string" && object.ipa_en.length > 0) populated += 1;
    else fail(`${syntheticId} expected populated ipa_en`);
  } else {
    if (object.ipa_en !== null) fail(`${syntheticId} expected ipa_en null`);
    nulls += 1;
    for (const word of payloadCell.oov ?? []) oov.add(word);
  }
}

const sortedOov = [...oov].sort();
if (total !== EXPECTED.total) fail(`Expected ${EXPECTED.total} cells, found ${total}`);
if (populated !== EXPECTED.populated) fail(`Expected ${EXPECTED.populated} populated ipa_en, found ${populated}`);
if (nulls !== EXPECTED.nulls) fail(`Expected ${EXPECTED.nulls} null ipa_en, found ${nulls}`);
if (seenUuids.size !== EXPECTED.total) fail(`Expected ${EXPECTED.total} unique UUIDs, found ${seenUuids.size}`);
if (JSON.stringify(sortedOov) !== JSON.stringify(EXPECTED.oov)) {
  fail(`Expected OOV ${EXPECTED.oov.join(", ")}, found ${sortedOov.join(", ")}`);
}

if (!process.exitCode) {
  console.log(`WP-IPA-APPLY verified: ${populated}/${total} populated, ${nulls} null, OOV=${sortedOov.join(", ")}`);
}
