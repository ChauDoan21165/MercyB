#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const REGISTRY_PATH = "src/lib/tutor/languageRegistry.ts";
const SOURCE_PATH = "src/languages/vietnamese/lessons-a1.ts";
const INVENTORY_PATH = "reports/cell-inventory/vn-en-a1-inventory.json";
const GAPS_PATH = "reports/cell-inventory/vn-en-a1-gaps.md";

const WEDGE = {
  source_language: "Vietnamese",
  source_language_code: "vi",
  target_language: "English",
  target_language_code: "en",
  direction: "vi-en",
  level: "A1",
};

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function ensureEnglishRegistryEntry() {
  const source = readText(REGISTRY_PATH);
  if (!source.includes("en: {") || !source.includes('labelEn: "English"')) {
    throw new Error(`Unable to confirm English target language in ${REGISTRY_PATH}`);
  }
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

function pickText(object, keys) {
  for (const key of keys) {
    if (hasText(object?.[key])) return object[key].trim();
  }
  return null;
}

function hasAnyText(object, keys) {
  return pickText(object, keys) !== null;
}

function lessonLabel(lesson) {
  const id = String(lesson.id).padStart(3, "0");
  return `${id} ${lesson.title_en}`;
}

function makeAddressText(address) {
  return [
    `Language=${address.Language}`,
    `Level=${address.Level}`,
    `Lesson=${address.Lesson}`,
    address.Dialogue ? `Dialogue=${address.Dialogue}` : null,
    address.Turn ? `Turn=${address.Turn}` : null,
    address.Sentence ? `Sentence=${address.Sentence}` : null,
    address.Vocabulary ? `Vocabulary=${address.Vocabulary}` : null,
    address.Pronunciation ? `Pronunciation=${address.Pronunciation}` : "Pronunciation=missing",
    address.Audio ? `Audio=${address.Audio}` : "Audio=missing",
  ]
    .filter(Boolean)
    .join(" > ");
}

function baseCell({ id, cellType, lesson, ordinal, object, address }) {
  const audio = pickText(object, ["audio", "audioPath", "audio_path", "audioUrl", "audio_url", "tts_audio"]);
  const ipa = pickText(object, ["ipa", "IPA", "pronunciation_ipa", "ipa_pronunciation"]);
  const translation = hasAnyText(object, ["english", "translation", "translation_en"]) && hasAnyText(object, ["vietnamese", "text", "sentence"]);

  const fullAddress = {
    Language: `${WEDGE.source_language}->${WEDGE.target_language}`,
    Level: WEDGE.level,
    Lesson: lessonLabel(lesson),
    Dialogue: address.Dialogue ?? null,
    Turn: address.Turn ?? null,
    Sentence: address.Sentence ?? null,
    Vocabulary: address.Vocabulary ?? null,
    Pronunciation: address.Pronunciation ?? null,
    Audio: audio,
  };

  return {
    id,
    layer: "CELL",
    cell_type: cellType,
    source_file: SOURCE_PATH,
    source_object: {
      lesson_id: lesson.id,
      lesson_title_en: lesson.title_en,
      ordinal,
    },
    address: fullAddress,
    address_text: makeAddressText(fullAddress),
    has_audio: audio !== null,
    has_ipa: ipa !== null,
    has_translation: translation,
  };
}

function buildCells(lessons) {
  const cells = [];

  for (const lesson of lessons) {
    const phrases = Array.isArray(lesson.phrases) ? lesson.phrases : [];
    phrases.forEach((phrase, index) => {
      const ordinal = index + 1;
      const id = `vi-en:A1:lesson-${String(lesson.id).padStart(3, "0")}:vocabulary-${String(ordinal).padStart(3, "0")}`;
      const english = pickText(phrase, ["english"]);
      const vietnamese = pickText(phrase, ["vietnamese"]);
      const pronunciation = pickText(phrase, ["pronunciation", "pronunciation_hint"]);

      cells.push(
        baseCell({
          id,
          cellType: "Vocabulary Item",
          lesson,
          ordinal,
          object: phrase,
          address: {
            Sentence: vietnamese,
            Vocabulary: english ? `${String(ordinal).padStart(3, "0")} ${english}` : String(ordinal).padStart(3, "0"),
            Pronunciation: pronunciation,
          },
        }),
      );
    });

    const dialogue = Array.isArray(lesson.dialogue) ? lesson.dialogue : [];
    dialogue.forEach((turn, index) => {
      const ordinal = index + 1;
      const id = `vi-en:A1:lesson-${String(lesson.id).padStart(3, "0")}:dialogue-turn-${String(ordinal).padStart(3, "0")}`;
      const speaker = pickText(turn, ["speaker"]) ?? "Unknown";
      const vietnamese = pickText(turn, ["vietnamese"]);
      const pronunciation = pickText(turn, ["pronunciation", "pronunciation_hint"]);

      cells.push(
        baseCell({
          id,
          cellType: "Dialogue Turn",
          lesson,
          ordinal,
          object: turn,
          address: {
            Dialogue: lesson.title_en,
            Turn: `${String(ordinal).padStart(3, "0")} ${speaker}`,
            Sentence: vietnamese,
            Pronunciation: pronunciation,
          },
        }),
      );
    });
  }

  return cells;
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] ?? "UNKNOWN";
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function gapExamples(cells, key) {
  return cells
    .filter((cell) => cell[key] === false)
    .slice(0, 20)
    .map((cell) => ({
      id: cell.id,
      cell_type: cell.cell_type,
      address_text: cell.address_text,
    }));
}

function buildInventory(lessons) {
  const cells = buildCells(lessons);
  const gaps = {
    lacking_audio: {
      count: cells.filter((cell) => !cell.has_audio).length,
      first_20_examples: gapExamples(cells, "has_audio"),
    },
    lacking_ipa: {
      count: cells.filter((cell) => !cell.has_ipa).length,
      first_20_examples: gapExamples(cells, "has_ipa"),
    },
    lacking_translation: {
      count: cells.filter((cell) => !cell.has_translation).length,
      first_20_examples: gapExamples(cells, "has_translation"),
    },
  };

  return {
    metadata: {
      generated_by: "scripts/cell-os/build-cell-inventory.mjs",
      counting_rule_source: "docs/cell-runtime/v1/specs/anatomy-layer-model-v1.md",
      registry_source: REGISTRY_PATH,
      content_source: SOURCE_PATH,
      wedge: WEDGE,
      note: "Only CELL-layer objects are counted. Lessons and dialogues are structural parents; audio, IPA, and translations are resources.",
    },
    summary: {
      total_cells: cells.length,
      cells_by_layer: countBy(cells, "layer"),
      cells_by_type: countBy(cells, "cell_type"),
      gaps: {
        lacking_audio: gaps.lacking_audio.count,
        lacking_ipa: gaps.lacking_ipa.count,
        lacking_translation: gaps.lacking_translation.count,
      },
    },
    gaps,
    cells,
  };
}

function renderExamples(examples) {
  if (examples.length === 0) return "_None._\n";
  return examples.map((example, index) => `${index + 1}. \`${example.id}\` (${example.cell_type}) - ${example.address_text}`).join("\n") + "\n";
}

function renderMarkdown(inventory) {
  const { summary, gaps, metadata } = inventory;
  return `# Vietnamese->English A1 Cell Inventory Gaps

Source: \`${metadata.content_source}\`

Counting rule: only \`CELL\` layer objects count. Workpacks, events, diagnostics, organs, tissues, and resources are excluded.

## Summary

| Question | Count |
| --- | ---: |
| Total CELL-layer cells | ${summary.total_cells} |
| Lacking audio | ${summary.gaps.lacking_audio} |
| Lacking IPA | ${summary.gaps.lacking_ipa} |
| Lacking translation | ${summary.gaps.lacking_translation} |

## Total Cells By Layer

| Layer | Count |
| --- | ---: |
${Object.entries(summary.cells_by_layer)
  .map(([layer, count]) => `| ${layer} | ${count} |`)
  .join("\n")}

## Total Cells By Type

| Cell type | Count |
| --- | ---: |
${Object.entries(summary.cells_by_type)
  .map(([type, count]) => `| ${type} | ${count} |`)
  .join("\n")}

## First 20 Lacking Audio

${renderExamples(gaps.lacking_audio.first_20_examples)}
## First 20 Lacking IPA

${renderExamples(gaps.lacking_ipa.first_20_examples)}
## First 20 Lacking Translation

${renderExamples(gaps.lacking_translation.first_20_examples)}`;
}

function writeFile(relativePath, text) {
  fs.writeFileSync(path.join(ROOT, relativePath), text);
}

ensureEnglishRegistryEntry();
const lessons = loadVietnameseA1Lessons();
const inventory = buildInventory(lessons);

writeFile(INVENTORY_PATH, `${JSON.stringify(inventory, null, 2)}\n`);
const persistedInventory = JSON.parse(readText(INVENTORY_PATH));
writeFile(GAPS_PATH, renderMarkdown(persistedInventory));
