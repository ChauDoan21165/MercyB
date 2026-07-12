#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const SOURCE_PATH = "src/languages/vietnamese/lessons-a1.ts";
const INVENTORY_PATH = "reports/cell-inventory/vn-en-a1-inventory.json";
const OUTPUT_PATH = "reports/cell-inventory/audio-map-vn-en-a1.json";

const SUPABASE_URL = "https://buemdfxyhxunzpgdoqin.supabase.co";
const BUCKET = "room-audio";
const TTS_CACHE_PREFIX = "tts-cache";
const ENGLISH_AZURE_VOICE = "en-US-AvaMultilingualNeural";
const ENGLISH_LANGUAGE = "en";

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function writeText(relativePath, text) {
  fs.writeFileSync(path.join(ROOT, relativePath), text);
}

function loadVietnameseA1Lessons() {
  const source = readText(SOURCE_PATH);
  const executable = source
    .replace(/^import type .*;\n/gm, "")
    .replace("export const lessons: VietnameseLesson[] =", "const lessons =")
    .replace(/\nexport default lessons;\s*$/m, "\nlessons;");

  return vm.runInNewContext(executable, {}, { filename: SOURCE_PATH });
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function pickText(object, key) {
  const value = object?.[key];
  return hasText(value) ? value.trim() : null;
}

function lessonLabel(lesson) {
  return `${String(lesson.id).padStart(3, "0")} ${lesson.title_en}`;
}

function sha256Hex(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function publicTtsCacheUrl(hash) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${TTS_CACHE_PREFIX}/${hash}.mp3`;
}

function azureTuple({ role, text, sourceField }) {
  const trimmedText = String(text ?? "").trim();
  const sha256 = sha256Hex(`azure|${ENGLISH_AZURE_VOICE}|${ENGLISH_LANGUAGE}|${trimmedText}`);
  return {
    role,
    voice: ENGLISH_AZURE_VOICE,
    language: ENGLISH_LANGUAGE,
    text: trimmedText,
    source_field: sourceField,
    sha256,
    url: publicTtsCacheUrl(sha256),
  };
}

function buildRowsFromSource(lessons) {
  const rows = [];

  for (const lesson of lessons) {
    const phrases = Array.isArray(lesson.phrases) ? lesson.phrases : [];
    phrases.forEach((phrase, index) => {
      const ordinal = index + 1;
      const english = pickText(phrase, "english");
      const vietnamese = pickText(phrase, "vietnamese");
      const pronunciation = pickText(phrase, "pronunciation") ?? pickText(phrase, "pronunciation_hint");
      if (!english) return;

      rows.push({
        cell_id: `vi-en:A1:lesson-${String(lesson.id).padStart(3, "0")}:vocabulary-${String(ordinal).padStart(3, "0")}`,
        cell_type: "Vocabulary Item",
        source_file: SOURCE_PATH,
        source_object: {
          lesson_id: lesson.id,
          lesson_title_en: lesson.title_en,
          ordinal,
        },
        address: {
          Language: "Vietnamese->English",
          Level: "A1",
          Lesson: lessonLabel(lesson),
          Dialogue: null,
          Turn: null,
          Sentence: vietnamese,
          Vocabulary: `${String(ordinal).padStart(3, "0")} ${english}`,
          Pronunciation: pronunciation,
          Audio: null,
        },
        tuples: [
          azureTuple({
            role: "english_target",
            text: english,
            sourceField: "phrase.english",
          }),
        ],
      });
    });

    const dialogue = Array.isArray(lesson.dialogue) ? lesson.dialogue : [];
    dialogue.forEach((turn, index) => {
      const ordinal = index + 1;
      const speaker = pickText(turn, "speaker") ?? "Unknown";
      const english = pickText(turn, "english");
      const vietnamese = pickText(turn, "vietnamese");
      const pronunciation = pickText(turn, "pronunciation") ?? pickText(turn, "pronunciation_hint");
      if (!english) return;

      rows.push({
        cell_id: `vi-en:A1:lesson-${String(lesson.id).padStart(3, "0")}:dialogue-turn-${String(ordinal).padStart(3, "0")}`,
        cell_type: "Dialogue Turn",
        source_file: SOURCE_PATH,
        source_object: {
          lesson_id: lesson.id,
          lesson_title_en: lesson.title_en,
          ordinal,
        },
        address: {
          Language: "Vietnamese->English",
          Level: "A1",
          Lesson: lessonLabel(lesson),
          Dialogue: lesson.title_en,
          Turn: `${String(ordinal).padStart(3, "0")} ${speaker}`,
          Sentence: vietnamese,
          Vocabulary: null,
          Pronunciation: pronunciation,
          Audio: null,
        },
        tuples: [
          azureTuple({
            role: "english_target",
            text: english,
            sourceField: "dialogue.english",
          }),
        ],
      });
    });
  }

  return rows.sort((a, b) => a.cell_id.localeCompare(b.cell_id));
}

function assertInventoryAlignment(rows) {
  const inventory = JSON.parse(readText(INVENTORY_PATH));
  const cells = Array.isArray(inventory?.cells) ? inventory.cells : [];
  const relevantCells = cells.filter((cell) =>
    cell?.cell_type === "Vocabulary Item" || cell?.cell_type === "Dialogue Turn"
  );
  const inventoryIds = relevantCells.map((cell) => cell.id).sort();
  const rowIds = rows.map((row) => row.cell_id).sort();

  if (inventoryIds.length !== rowIds.length) {
    throw new Error(`Audio map row count ${rowIds.length} does not match inventory count ${inventoryIds.length}`);
  }

  for (let index = 0; index < inventoryIds.length; index += 1) {
    if (inventoryIds[index] !== rowIds[index]) {
      throw new Error(`Audio map cell mismatch at ${index}: ${rowIds[index]} !== ${inventoryIds[index]}`);
    }
  }
}

const lessons = loadVietnameseA1Lessons();
const rows = buildRowsFromSource(lessons);
assertInventoryAlignment(rows);

const tupleCount = rows.reduce((count, row) => count + row.tuples.length, 0);
const output = {
  metadata: {
    generated_by: "scripts/cell-os/build-audio-map-vn-en-a1.mjs",
    content_source: SOURCE_PATH,
    inventory_source: INVENTORY_PATH,
    supabase_url: SUPABASE_URL,
    bucket: BUCKET,
    cache_prefix: TTS_CACHE_PREFIX,
    hash_formula: "sha256(`azure|${azureVoice.name}|${language}|${text.trim()}`)",
    runtime_tuple_finding: {
      english_target: {
        status: "resolved",
        voice: ENGLISH_AZURE_VOICE,
        language: ENGLISH_LANGUAGE,
        text_fields_by_cell_type: {
          "Vocabulary Item": "phrase.english",
          "Dialogue Turn": "dialogue.english",
        },
      },
      vietnamese_support_audio: {
        status: "not_emitted_as_tts_cache_tuple",
        reason: "The Vietnamese A1 lesson UI plays pre-generated room-audio lesson bundle keys via LessonAudioButton/useAudioUrl. The codebase states no production surface today calls fetchCloudTtsUrl({ language: 'vi' }).",
      },
    },
  },
  summary: {
    cells: rows.length,
    tuples: tupleCount,
    english_target_tuples: tupleCount,
    vietnamese_tts_cache_tuples: 0,
  },
  cells: rows,
};

writeText(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
