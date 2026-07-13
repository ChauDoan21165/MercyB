#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const INVENTORY_PATH = "reports/cell-inventory/vn-en-a1-inventory.json";
const LESSON_SOURCE_PATH = "src/languages/vietnamese/lessons-a1.ts";
const CMUDICT_PATH = "scripts/data/cmudict.dict";
const JSON_OUT = "reports/cell-inventory/ipa-en-map-vn-en-a1.json";
const MD_OUT = "reports/cell-inventory/ipa-en-map-vn-en-a1.md";
const CMUDICT_SOURCE_URL = "https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict";
const CMUDICT_SHA256 = "81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22";

export const FIXTURE_WORDS = [
  "hello",
  "water",
  "teacher",
  "hospital",
  "ticket",
  "coffee",
  "airport",
  "doctor",
  "pharmacy",
  "apartment",
  "restaurant",
  "address",
  "weekend",
  "what's",
  "o'clock",
];

const ARPABET_TO_IPA = {
  AA: "ɑ",
  AE: "æ",
  AH: "ʌ",
  AO: "ɔ",
  AW: "aʊ",
  AY: "aɪ",
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  EH: "ɛ",
  ER: "ɝ",
  EY: "eɪ",
  F: "f",
  G: "ɡ",
  HH: "h",
  IH: "ɪ",
  IY: "i",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  OW: "oʊ",
  OY: "ɔɪ",
  P: "p",
  R: "r",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  UH: "ʊ",
  UW: "u",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
};

const UNSTRESSED_OVERRIDES = {
  AH: "ə",
  ER: "ɚ",
};

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function writeText(relativePath, value) {
  fs.mkdirSync(path.dirname(path.join(ROOT, relativePath)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, relativePath), value);
}

export function tokenizeEnglish(text) {
  return String(text ?? "")
    .toLowerCase()
    .match(/[a-z]+(?:'[a-z]+)*/g) ?? [];
}

function stripVariant(word) {
  return word.replace(/\(\d+\)$/, "");
}

export function loadCmuDict(dictText) {
  const entries = new Map();
  const variantCounts = new Map();

  for (const rawLine of dictText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith(";;;")) continue;
    const firstSpace = line.indexOf(" ");
    if (firstSpace <= 0) continue;
    const rawWord = line.slice(0, firstSpace);
    const word = stripVariant(rawWord.toLowerCase());
    const phones = line.slice(firstSpace + 1).trim().split(/\s+/);
    variantCounts.set(word, (variantCounts.get(word) ?? 0) + 1);
    if (!entries.has(word)) entries.set(word, phones);
  }

  return { entries, variantCounts };
}

export function arpabetPhonesToIpa(phones) {
  return phones.map((phone) => {
    const match = /^([A-Z]+)([012])?$/.exec(phone);
    if (!match) throw new Error(`Unsupported ARPABET phone: ${phone}`);
    const [, base, stress] = match;
    const mapped = stress === "0" && UNSTRESSED_OVERRIDES[base]
      ? UNSTRESSED_OVERRIDES[base]
      : ARPABET_TO_IPA[base];
    if (!mapped) throw new Error(`Missing ARPABET to IPA mapping for ${base}`);
    const marker = stress === "1" ? "ˈ" : stress === "2" ? "ˌ" : "";
    return `${marker}${mapped}`;
  }).join("");
}

function loadVietnameseA1Lessons() {
  const source = readText(LESSON_SOURCE_PATH);
  const executable = source
    .replace(/^import type .*;\n/gm, "")
    .replace("export const lessons: VietnameseLesson[] =", "const lessons =")
    .replace(/\nexport default lessons;\s*$/m, "\nlessons;");
  return vm.runInNewContext(executable, {}, { filename: LESSON_SOURCE_PATH });
}

function englishTextForCell(cell, lessons) {
  const lessonId = Number(cell.source_object?.lesson_id);
  const ordinal = Number(cell.source_object?.ordinal);
  const lesson = lessons.find((item) => Number(item.id) === lessonId);
  if (!lesson) return { text: null, source: "missing_lesson" };

  if (cell.cell_type === "Vocabulary Item") {
    const raw = String(cell.address?.Vocabulary ?? "");
    const fromInventory = raw.replace(/^\d+\s+/, "").trim();
    if (fromInventory) return { text: fromInventory, source: INVENTORY_PATH };
    const phrase = lesson.phrases?.[ordinal - 1]?.english;
    return phrase ? { text: phrase, source: LESSON_SOURCE_PATH } : { text: null, source: "missing_phrase" };
  }

  if (cell.cell_type === "Dialogue Turn") {
    const turn = lesson.dialogue?.[ordinal - 1]?.english;
    return turn ? { text: turn, source: LESSON_SOURCE_PATH } : { text: null, source: "missing_dialogue_turn" };
  }

  return { text: null, source: "unsupported_cell_type" };
}

function entryForCell(cell, lessons, dict) {
  const { text, source } = englishTextForCell(cell, lessons);
  const tokens = tokenizeEnglish(text ?? "");
  const oov = [];
  const words = tokens.map((token) => {
    const phones = dict.entries.get(token);
    if (!phones) {
      oov.push(token);
      return { word: token, arpabet: null, ipa: null, pronunciation_variant_count: 0 };
    }
    return {
      word: token,
      arpabet: phones,
      ipa: arpabetPhonesToIpa(phones),
      pronunciation_variant_count: dict.variantCounts.get(token) ?? 1,
    };
  });

  const status = text && tokens.length > 0 && oov.length === 0 ? "complete" : "partial";
  return {
    cell_id: cell.id,
    cell_type: cell.cell_type,
    source_text: source,
    address: cell.address,
    address_text: cell.address_text,
    exact_text: text,
    ipa_en: status === "complete" ? `/${words.map((word) => word.ipa).join(" ")}/` : null,
    status,
    oov: [...new Set(oov)].sort(),
    words,
  };
}

function fixtureRows(dict) {
  return FIXTURE_WORDS.map((word) => {
    const phones = dict.entries.get(word);
    return {
      word,
      arpabet: phones ?? null,
      ipa: phones ? `/${arpabetPhonesToIpa(phones)}/` : null,
      pronunciation_variant_count: dict.variantCounts.get(word) ?? 0,
    };
  });
}

function renderMarkdown(payload) {
  const complete = payload.summary.complete_cells;
  const partial = payload.summary.partial_cells;
  const oovList = payload.summary.oov_words.length
    ? payload.summary.oov_words.map((word) => `\`${word}\``).join(", ")
    : "_None._";
  const fixtures = payload.fixtures
    .map((item) => `| ${item.word} | ${item.ipa ?? "OOV"} | ${(item.arpabet ?? []).join(" ") || "OOV"} |`)
    .join("\n");

  return `# IPA EN Map: Vietnamese->English A1

Source inventory: \`${INVENTORY_PATH}\`

CMUdict source: ${CMUDICT_SOURCE_URL}

Vendored dictionary: \`${CMUDICT_PATH}\`

Vendored dictionary sha256: \`${payload.metadata.cmudict_sha256}\`

Convention: this generator emits citation-form dictionary IPA from CMUdict. ARPABET stress digits \`1\` and \`2\` become \`ˈ\` and \`ˌ\`, placed immediately before the stressed vowel phone. Stress digit \`0\` is unstressed; \`AH0\` is rendered \`ə\` and \`ER0\` is rendered \`ɚ\`. Connected-speech phenomena, reductions across word boundaries, linking, flapping, and accent-specific alternates are out of scope.

Honesty rules: out-of-vocabulary words receive no fabricated IPA; their utterance is marked \`partial\` with the OOV words listed. CMUdict homographs/multiple pronunciations use the first listed variant deterministically.

## Headline

| Metric | Count |
| --- | ---: |
| Total cells | ${payload.summary.total_cells} |
| Complete cells | ${complete} |
| Partial cells | ${partial} |
| Distinct OOV words | ${payload.summary.oov_words.length} |
| Unique multi-pronunciation words affected | ${payload.summary.multi_pronunciation_words_affected.length} |
| Cell word instances using first-variant multi-pronunciation entries | ${payload.summary.multi_pronunciation_token_instances} |

## OOV Words

${oovList}

## Fixture Words

| Word | IPA | CMUdict ARPABET |
| --- | --- | --- |
${fixtures}
`;
}

function buildPayload() {
  const inventory = JSON.parse(readText(INVENTORY_PATH));
  const lessons = loadVietnameseA1Lessons();
  const dict = loadCmuDict(readText(CMUDICT_PATH));
  const cells = inventory.cells.map((cell) => entryForCell(cell, lessons, dict));
  const oovWords = [...new Set(cells.flatMap((cell) => cell.oov))].sort();
  const multiWords = new Set();
  let multiInstances = 0;
  for (const cell of cells) {
    for (const word of cell.words) {
      if (word.pronunciation_variant_count > 1) {
        multiWords.add(word.word);
        multiInstances += 1;
      }
    }
  }

  return {
    metadata: {
      generated_by: "scripts/cell-os/generate-ipa-en.mjs",
      inventory_source: INVENTORY_PATH,
      fallback_text_source: LESSON_SOURCE_PATH,
      cmudict_source_url: CMUDICT_SOURCE_URL,
      cmudict_path: CMUDICT_PATH,
      cmudict_sha256: CMUDICT_SHA256,
      arpabet_to_ipa_convention: "Stress digits 1/2 become ˈ/ˌ before the stressed vowel phone; AH0 -> ə; ER0 -> ɚ; citation-form only.",
      connected_speech_scope: "Out of scope.",
    },
    summary: {
      total_cells: cells.length,
      complete_cells: cells.filter((cell) => cell.status === "complete").length,
      partial_cells: cells.filter((cell) => cell.status === "partial").length,
      oov_words: oovWords,
      multi_pronunciation_words_affected: [...multiWords].sort(),
      multi_pronunciation_token_instances: multiInstances,
    },
    fixtures: fixtureRows(dict),
    cells,
  };
}

export function main() {
  const payload = buildPayload();
  writeText(JSON_OUT, `${JSON.stringify(payload, null, 2)}\n`);
  writeText(MD_OUT, renderMarkdown(payload));
  console.log(`Wrote ${JSON_OUT}`);
  console.log(`Wrote ${MD_OUT}`);
  console.log(`RESULT complete=${payload.summary.complete_cells}/${payload.summary.total_cells} partial=${payload.summary.partial_cells} oov=${payload.summary.oov_words.length} multi_pron_words=${payload.summary.multi_pronunciation_words_affected.length}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
