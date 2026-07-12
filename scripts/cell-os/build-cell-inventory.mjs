#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const REGISTRY_PATH = "src/lib/tutor/languageRegistry.ts";
const SOURCE_PATH = "src/languages/vietnamese/lessons-a1.ts";
const MULTI_ACCENT_IPA_PATH = "src/data/pronunciation/multiAccentReferences.ts";
const F5_IPA_PATHS = [
  "src/content-factory/f5-minimal-pairs/wave1-50.json",
  "src/content-factory/f5-minimal-pairs/wave2-50.json",
];
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

function normalizeWordKey(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[“”"']/g, "")
    .replace(/[^a-z]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function wordTokens(value) {
  return normalizeWordKey(value).split(" ").filter(Boolean);
}

function buildIpaLexicon() {
  const lexicon = new Map();
  const add = (word, ipa, source) => {
    const key = normalizeWordKey(word);
    if (!key || !hasText(ipa)) return;
    if (!lexicon.has(key)) {
      lexicon.set(key, { word: key, ipa: String(ipa).trim(), source });
    }
  };

  const multiAccentSource = readText(MULTI_ACCENT_IPA_PATH);
  const multiAccentEntries = multiAccentSource.matchAll(/\{\s*word:\s*"([^"]+)"[\s\S]*?us_ipa:\s*"([^"]+)"/g);
  for (const match of multiAccentEntries) {
    add(match[1], match[2], MULTI_ACCENT_IPA_PATH);
  }

  for (const relativePath of F5_IPA_PATHS) {
    const parsed = JSON.parse(readText(relativePath));
    for (const item of parsed.minimalPairs ?? []) {
      add(item?.pair?.target, item?.ipa?.target, relativePath);
      add(item?.pair?.contrast, item?.ipa?.contrast, relativePath);
    }
  }

  return lexicon;
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
  const ipaReference = object?.ipa_reference ?? null;
  const translation = hasAnyText(object, ["english", "translation", "translation_en"]) && hasAnyText(object, ["vietnamese", "text", "sentence"]);
  const runtimeTtsText = pickText(object, ["vietnamese", "english", "text", "sentence"]);
  const audioStatus = audio ? "addressable_asset" : runtimeTtsText ? "runtime_tts_only" : "none";

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
    audio_status: audioStatus,
    audio_reference: audio,
    ipa_status: ipaReference ? "addressable_in_pronunciation_libs" : "absent",
    ipa_reference: ipaReference,
    has_audio: audioStatus === "addressable_asset",
    has_ipa: ipaReference !== null,
    has_translation: translation,
  };
}

function buildCells(lessons, ipaLexicon) {
  const cells = [];

  for (const lesson of lessons) {
    const phrases = Array.isArray(lesson.phrases) ? lesson.phrases : [];
    phrases.forEach((phrase, index) => {
      const ordinal = index + 1;
      const id = `vi-en:A1:lesson-${String(lesson.id).padStart(3, "0")}:vocabulary-${String(ordinal).padStart(3, "0")}`;
      const english = pickText(phrase, ["english"]);
      const vietnamese = pickText(phrase, ["vietnamese"]);
      const pronunciation = pickText(phrase, ["pronunciation", "pronunciation_hint"]);
      const ipaReference = ipaLexicon.get(normalizeWordKey(english)) ?? null;

      cells.push(
        baseCell({
          id,
          cellType: "Vocabulary Item",
          lesson,
          ordinal,
          object: { ...phrase, ipa_reference: ipaReference },
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

function statusExamples(cells, predicate) {
  return cells
    .filter(predicate)
    .slice(0, 20)
    .map((cell) => ({
      id: cell.id,
      cell_type: cell.cell_type,
      address_text: cell.address_text,
    }));
}

function buildInventory(lessons, ipaLexicon) {
  const cells = buildCells(lessons, ipaLexicon);
  const vocabularyCells = cells.filter((cell) => cell.cell_type === "Vocabulary Item");
  const vocabularyTokenSet = new Set();
  for (const cell of vocabularyCells) {
    const label = String(cell.address.Vocabulary ?? "").replace(/^\d+\s+/, "");
    for (const token of wordTokens(label)) vocabularyTokenSet.add(token);
  }
  const vocabularyTokens = [...vocabularyTokenSet].sort();
  const vocabularyTokensWithIpa = vocabularyTokens.filter((token) => ipaLexicon.has(token));
  const gaps = {
    no_addressable_reference_audio: {
      count: cells.filter((cell) => cell.audio_status !== "addressable_asset").length,
      first_20_examples: statusExamples(cells, (cell) => cell.audio_status !== "addressable_asset"),
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
      audio_finding_sources: [
        "src/components/admin/TtsAudioGenerator.tsx",
        "src/components/admin/WarmthAudioGenerator.tsx",
        "src/components/AudioPlayer.tsx",
        "src/components/ai-tutor/SpeakPracticeMode.tsx",
        "src/lib/roomAudioResolver.ts",
        "supabase/functions/generate-room-audio/index.ts",
        "supabase/functions/generate-warmth-audio/index.ts",
        "supabase/functions/mercy-tts/core.ts",
      ],
      ipa_sources: [MULTI_ACCENT_IPA_PATH, ...F5_IPA_PATHS],
      wedge: WEDGE,
      note: "Only CELL-layer objects are counted. Lessons and dialogues are structural parents; audio, IPA, and translations are resources.",
      audio_model_note: "Generated/admin audio persists in Supabase Storage buckets, but no per-cell audio resource is present in this content schema. Speak/runtime paths can synthesize or cache TTS by text, not by stable lesson cell address.",
      ipa_model_note: "Vocabulary Item IPA cell coverage is counted only when the normalized English label has an exact key in the pronunciation IPA libraries. Token coverage is reported separately as repair context because the libraries are word-keyed while many A1 vocabulary labels are phrases.",
    },
    summary: {
      total_cells: cells.length,
      cells_by_layer: countBy(cells, "layer"),
      cells_by_type: countBy(cells, "cell_type"),
      cells_by_audio_status: countBy(cells, "audio_status"),
      cells_by_ipa_status: countBy(cells, "ipa_status"),
      addressable_reference_audio_cells: cells.filter((cell) => cell.audio_status === "addressable_asset").length,
      runtime_tts_only_cells: cells.filter((cell) => cell.audio_status === "runtime_tts_only").length,
      no_audio_cells: cells.filter((cell) => cell.audio_status === "none").length,
      vocabulary_ipa_coverage: {
        total_vocabulary_items: vocabularyCells.length,
        addressable_in_pronunciation_libs: vocabularyCells.filter((cell) => cell.ipa_status === "addressable_in_pronunciation_libs").length,
        absent: vocabularyCells.filter((cell) => cell.ipa_status === "absent").length,
        unique_english_word_tokens: vocabularyTokens.length,
        unique_english_word_tokens_with_ipa: vocabularyTokensWithIpa.length,
        unique_english_word_tokens_absent_from_ipa: vocabularyTokens.length - vocabularyTokensWithIpa.length,
      },
      gaps: {
        no_addressable_reference_audio: gaps.no_addressable_reference_audio.count,
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

Audio finding: audio for this surface is runtime-generated or admin-generated. Admin generators persist files in Supabase Storage buckets (\`audio/paths\`, \`audio/welcome\`, \`audio/warmth\`), room playback resolves keys through the \`room-audio\` bucket, and tutor TTS can cache finalized Azure clips under \`room-audio/tts-cache/{sha256}.mp3\`. The Vietnamese A1 content schema has no per-cell audio resource keyed by lesson/phrase/dialogue cell address, so the world model should not claim replayable per-cell reference audio for this wedge; it can claim runtime TTS coverage unless a stable cell-addressed asset is added.

## Summary

| Question | Count |
| --- | ---: |
| Total CELL-layer cells | ${summary.total_cells} |
| Cells with addressable reference audio | ${summary.addressable_reference_audio_cells} |
| Cells covered only by runtime TTS | ${summary.runtime_tts_only_cells} |
| Cells with no audio path | ${summary.no_audio_cells} |
| Vocabulary items with addressable IPA in pronunciation libs | ${summary.vocabulary_ipa_coverage.addressable_in_pronunciation_libs} |
| Vocabulary items absent from pronunciation IPA libs | ${summary.vocabulary_ipa_coverage.absent} |
| Unique vocabulary word tokens with IPA | ${summary.vocabulary_ipa_coverage.unique_english_word_tokens_with_ipa} |
| Unique vocabulary word tokens absent from IPA | ${summary.vocabulary_ipa_coverage.unique_english_word_tokens_absent_from_ipa} |
| All cells lacking IPA resource | ${summary.gaps.lacking_ipa} |
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

## Audio Status

| Audio status | Count |
| --- | ---: |
${Object.entries(summary.cells_by_audio_status)
  .map(([status, count]) => `| ${status} | ${count} |`)
  .join("\n")}

## IPA Status

| IPA status | Count |
| --- | ---: |
${Object.entries(summary.cells_by_ipa_status)
  .map(([status, count]) => `| ${status} | ${count} |`)
  .join("\n")}

## First 20 Without Addressable Reference Audio

${renderExamples(gaps.no_addressable_reference_audio.first_20_examples)}
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
const ipaLexicon = buildIpaLexicon();
const inventory = buildInventory(lessons, ipaLexicon);

writeFile(INVENTORY_PATH, `${JSON.stringify(inventory, null, 2)}\n`);
const persistedInventory = JSON.parse(readText(INVENTORY_PATH));
writeFile(GAPS_PATH, renderMarkdown(persistedInventory));
