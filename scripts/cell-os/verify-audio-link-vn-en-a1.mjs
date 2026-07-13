#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AUDIO_LINK_PATH = "reports/cell-inventory/audio-link-vn-en-a1.json";
const EXPECTED_TOTAL_CELLS = 627;
const EXPECTED_VOCABULARY_CELLS = 412;
const EXPECTED_DIALOGUE_CELLS = 215;
const EXPECTED_DIALOGUE_INT_STATES = {
  covered: 54,
  blind: 16,
  unmeasured: 145,
};

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function countBy(items, getValue) {
  return items.reduce((counts, item) => {
    const value = getValue(item);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

const artifact = readJson(AUDIO_LINK_PATH);
const links = Array.isArray(artifact?.links) ? artifact.links : [];
const byCellId = new Map();
const duplicateIds = [];

for (const link of links) {
  if (byCellId.has(link.cell_id)) duplicateIds.push(link.cell_id);
  byCellId.set(link.cell_id, link);
}

const cellsByType = countBy(links, (link) => link.cell_type);
const linkStatus = countBy(links, (link) => link.link_status);
const tupleLanguages = countBy(links, (link) => link.tuple?.language ?? "missing");
const tupleRoles = countBy(links, (link) => link.tuple?.role ?? "missing");
const dialogueLinks = links.filter((link) => link.cell_type === "Dialogue Turn");
const dialogueIntStates = countBy(dialogueLinks, (link) => link.int_probe?.state ?? "missing");
const badUrls = links.filter((link) => !String(link.tuple?.url ?? "").endsWith(`/tts-cache/${link.tuple?.sha256}.mp3`));

assert(links.length === EXPECTED_TOTAL_CELLS, `expected ${EXPECTED_TOTAL_CELLS} links, found ${links.length}`);
assert(duplicateIds.length === 0, `duplicate link cell ids: ${duplicateIds.join(", ")}`);
assert(cellsByType["Vocabulary Item"] === EXPECTED_VOCABULARY_CELLS, `expected ${EXPECTED_VOCABULARY_CELLS} vocabulary links, found ${cellsByType["Vocabulary Item"] ?? 0}`);
assert(cellsByType["Dialogue Turn"] === EXPECTED_DIALOGUE_CELLS, `expected ${EXPECTED_DIALOGUE_CELLS} dialogue links, found ${cellsByType["Dialogue Turn"] ?? 0}`);
assert(linkStatus.cache_addressable === EXPECTED_TOTAL_CELLS, `expected all links cache_addressable, found ${linkStatus.cache_addressable ?? 0}`);
assert(tupleRoles.english_target === EXPECTED_TOTAL_CELLS, `expected all tuples english_target, found ${tupleRoles.english_target ?? 0}`);
assert(tupleLanguages.en === EXPECTED_TOTAL_CELLS, `expected all tuples language=en, found ${tupleLanguages.en ?? 0}`);
assert((tupleLanguages.vi ?? 0) === 0, `expected zero Vietnamese TTS cache tuples, found ${tupleLanguages.vi}`);
assert(badUrls.length === 0, `url/hash mismatches: ${badUrls.map((link) => link.cell_id).join(", ")}`);

for (const [state, expected] of Object.entries(EXPECTED_DIALOGUE_INT_STATES)) {
  assert(dialogueIntStates[state] === expected, `expected ${expected} dialogue ${state} links, found ${dialogueIntStates[state] ?? 0}`);
}

console.log(JSON.stringify({
  status: "ok",
  links: links.length,
  cells_by_type: cellsByType,
  link_status: linkStatus,
  tuple_roles: tupleRoles,
  tuple_languages: tupleLanguages,
  dialogue_int_states: dialogueIntStates,
}, null, 2));
