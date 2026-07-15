#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const SOURCE_PATH = "src/languages/vietnamese/lessons-a1.ts";
const INVENTORY_PATH = "reports/cell-inventory/vn-en-a1-inventory.json";
const AUDIO_MAP_PATH = "reports/cell-inventory/audio-map-vn-en-a1.json";
const INT_PROBE_PATH = "reports/cell-inventory/int-probe-vn-en-a1.json";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function loadVietnameseA1Lessons() {
  const source = readText(SOURCE_PATH);
  const executable = source
    .replace(/^import type .*;\n/gm, "")
    .replace("export const lessons: VietnameseLesson[] =", "const lessons =")
    .replace(/\nexport default lessons;\s*$/m, "\nlessons;");

  return vm.runInNewContext(executable, {}, { filename: SOURCE_PATH });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function buildSourceLineage() {
  const byAddressHash = new Map();
  for (const lesson of loadVietnameseA1Lessons()) {
    const phrases = Array.isArray(lesson.phrases) ? lesson.phrases : [];
    phrases.forEach((phrase, index) => {
      const ordinal = index + 1;
      const addressHash = `vi-en:A1:lesson-${String(lesson.id).padStart(3, "0")}:vocabulary-${String(ordinal).padStart(3, "0")}`;
      assert(hasText(phrase.cell_id), `Missing source cell_id for ${addressHash}`);
      byAddressHash.set(addressHash, phrase.cell_id);
    });

    const dialogue = Array.isArray(lesson.dialogue) ? lesson.dialogue : [];
    dialogue.forEach((turn, index) => {
      const ordinal = index + 1;
      const addressHash = `vi-en:A1:lesson-${String(lesson.id).padStart(3, "0")}:dialogue-turn-${String(ordinal).padStart(3, "0")}`;
      assert(hasText(turn.cell_id), `Missing source cell_id for ${addressHash}`);
      byAddressHash.set(addressHash, turn.cell_id);
    });
  }
  return byAddressHash;
}

function verifyRows(label, rows, lineage, expectedCount) {
  assert(rows.length === expectedCount, `${label}: expected ${expectedCount} rows, found ${rows.length}`);
  const seenIds = new Set();
  let mapped = 0;

  for (const row of rows) {
    assert(UUID_RE.test(row.cell_id ?? row.id), `${label}: primary key is not a UUID for row ${row.address_hash ?? row.id ?? row.cell_id}`);
    const uuid = row.cell_id ?? row.id;
    assert(!seenIds.has(uuid), `${label}: duplicate UUID ${uuid}`);
    seenIds.add(uuid);
    assert(hasText(row.address_hash), `${label}: missing address_hash lineage for ${uuid}`);
    assert(lineage.has(row.address_hash), `${label}: orphan address_hash ${row.address_hash}`);
    assert(lineage.get(row.address_hash) === uuid, `${label}: UUID mismatch for ${row.address_hash}`);
    mapped++;
  }

  return { label, rows: rows.length, mapped, duplicates: rows.length - seenIds.size, orphans: 0 };
}

const lineage = buildSourceLineage();
const inventory = readJson(INVENTORY_PATH);
const audioMap = readJson(AUDIO_MAP_PATH);
const intProbe = readJson(INT_PROBE_PATH);

const inventoryRows = (inventory.cells ?? []).map((cell) => ({ ...cell, cell_id: cell.id }));
const audioRows = audioMap.cells ?? [];
const intProbeRows = intProbe.cells ?? [];

assert(lineage.size === 627, `source lineage expected 627 rows, found ${lineage.size}`);

const results = [
  verifyRows("inventory", inventoryRows, lineage, 627),
  verifyRows("audio_map", audioRows, lineage, 627),
  verifyRows("int_probe_dialogue_subset", intProbeRows, lineage, 215),
];

console.log(JSON.stringify({
  status: "ok",
  source_lineage_rows: lineage.size,
  ledger_rows_rekeyed: `${results[0].mapped}/${results[0].rows}`,
  zero_orphans: true,
  lineage_preserved: true,
  results,
}, null, 2));
