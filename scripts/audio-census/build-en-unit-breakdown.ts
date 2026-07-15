import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { SPEECH_SENTENCES } from "../../src/data/speechSentencesSchema.ts";
import { IELTS_LISTENING_ITEMS } from "../../src/data/exam-prep/ielts/listening-items.ts";
import { IELTS_SPEAKING_TOPICS } from "../../src/data/exam-prep/ielts/speaking-topics.ts";
import { PHONEME_DRILL_PACKS } from "../../src/data/pronunciation/phoneme-drills/index.ts";
import { DAILY_CHALLENGES } from "../../src/data/pronunciation-challenges/index.ts";
import { ALL_MULTI_ACCENT_ENTRIES } from "../../src/data/pronunciation/multiAccentReferences.ts";
import {
  DRILL_CATEGORIES,
  getDrillByCategory,
} from "../../src/lib/pronunciation/soundPairDrills.ts";

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "unleveled";

type ContentType =
  | "speech_drill_sentence"
  | "ielts_speaking_sample_sentence"
  | "ielts_listening_script"
  | "phoneme_drill_sentence"
  | "pronunciation_challenge_sentence"
  | "sound_pair_word_or_phrase"
  | "ipa_reference_vocabulary"
  | "other";

type ReconcileRow = {
  index: number;
  bucket: string;
  category: string;
  language: string;
  voice: string;
  text: string;
  sha256: string;
  storage_key: string;
  source: string;
  evidence: string;
};

type SourceTrace = {
  source: string;
  file: string;
  level: Level;
  lesson: string;
  unit: string;
  content_type: ContentType;
  notes?: string;
};

type ClassifiedUnit = ReconcileRow & {
  level: Level;
  file: string;
  lesson: string;
  unit: string;
  content_type: ContentType;
  source_traces: SourceTrace[];
};

type EnReconcile = {
  metadata?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  classifications: ReconcileRow[];
};

const REPORT_DIR = resolve("reports/audio-census");
const INPUT = resolve(REPORT_DIR, "en-reconcile.json");
const JSON_OUT = resolve(REPORT_DIR, "en-unit-breakdown.json");
const MD_OUT = resolve(REPORT_DIR, "en-unit-breakdown.md");

function normalizedText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function splitIntoSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function cleanWeakSample(text: string): string {
  return text.replace(/\s*\[[^\]]+\]/g, "").replace(/\s+/g, " ").trim();
}

function key(text: string): string {
  return normalizedText(text).toLowerCase();
}

function firstByText<T>(rows: T[], getText: (row: T) => string): Map<string, T[]> {
  const out = new Map<string, T[]>();
  for (const row of rows) {
    const k = key(getText(row));
    const bucket = out.get(k) ?? [];
    bucket.push(row);
    out.set(k, bucket);
  }
  return out;
}

const speechByText = firstByText(SPEECH_SENTENCES, (row) => row.target_en);
const listeningById = new Map(IELTS_LISTENING_ITEMS.map((row) => [row.id, row]));
const listeningByText = firstByText(IELTS_LISTENING_ITEMS, (row) => row.audio_script);
const challengeById = new Map(DAILY_CHALLENGES.map((row) => [row.id, row]));
const challengeByText = firstByText([...DAILY_CHALLENGES], (row) => row.content_en);
const ipaWordSet = new Set(ALL_MULTI_ACCENT_ENTRIES.map((row) => key(row.word)));

const phonemePackBySlug = new Map(PHONEME_DRILL_PACKS.map((pack) => [pack.slug, pack]));
const phonemeSentenceByText = new Map<string, Array<{ slug: string; sentence_index: number }>>();
for (const pack of PHONEME_DRILL_PACKS) {
  pack.sentences.forEach((sentence, index) => {
    const k = key(sentence.sentence_en);
    const rows = phonemeSentenceByText.get(k) ?? [];
    rows.push({ slug: pack.slug, sentence_index: index + 1 });
    phonemeSentenceByText.set(k, rows);
  });
}

const soundPairByText = new Map<string, Array<{ category: string; role: "target" | "contrast"; pair_index: number }>>();
for (const category of DRILL_CATEGORIES) {
  const pairs = getDrillByCategory(category, { size: Number.MAX_SAFE_INTEGER, seed: 1 });
  pairs.forEach((pair, index) => {
    for (const role of ["target", "contrast"] as const) {
      const k = key(pair[role]);
      const rows = soundPairByText.get(k) ?? [];
      rows.push({ category, role, pair_index: index + 1 });
      soundPairByText.set(k, rows);
    }
  });
}

type IeltsSpeakingSentence = {
  topic_id: string;
  part: number;
  band: "band7" | "band5";
  sentence_index: number;
  text: string;
  level: Extract<Level, "B1" | "B2">;
};

const ieltsSpeakingByText = new Map<string, IeltsSpeakingSentence[]>();
for (const topic of IELTS_SPEAKING_TOPICS) {
  const strong = splitIntoSentences(topic.sample_strong_answer_band_7);
  strong.forEach((text, index) => {
    const rows = ieltsSpeakingByText.get(key(text)) ?? [];
    rows.push({
      topic_id: topic.id,
      part: topic.part,
      band: "band7",
      sentence_index: index + 1,
      text,
      level: "B2",
    });
    ieltsSpeakingByText.set(key(text), rows);
  });
  const weak = splitIntoSentences(cleanWeakSample(topic.sample_weak_answer_band_5));
  weak.forEach((text, index) => {
    const rows = ieltsSpeakingByText.get(key(text)) ?? [];
    rows.push({
      topic_id: topic.id,
      part: topic.part,
      band: "band5",
      sentence_index: index + 1,
      text,
      level: "B1",
    });
    ieltsSpeakingByText.set(key(text), rows);
  });
}

function parseSource(source: string): string[] {
  return source.split(";").map((part) => part.trim()).filter(Boolean);
}

function traceSource(source: string, text: string): SourceTrace {
  const parts = source.split(":");
  const file = parts[0] ?? source;
  const id = parts[1] ?? "";
  const sub = parts[2] ?? "";
  const textKey = key(text);

  if (source.startsWith("src/pages/SpeechDrillPage.tsx:SPEECH_SENTENCES")) {
    const sentence = speechByText.get(textKey)?.[0];
    return {
      source,
      file,
      level: (sentence?.cefr ?? "unleveled") as Level,
      lesson: sentence ? `${sentence.cefr}/${sentence.context}` : "SPEECH_SENTENCES",
      unit: sentence?.id ?? "unknown-speech-sentence",
      content_type: "speech_drill_sentence",
    };
  }

  if (source.startsWith("src/lib/speech/lessonPractice.ts:")) {
    const matched = ieltsSpeakingByText.get(textKey)?.find((row) => row.topic_id === id && row.band === sub)
      ?? ieltsSpeakingByText.get(textKey)?.[0];
    const level = sub === "band7" ? "B2" : sub === "band5" ? "B1" : (matched?.level ?? "unleveled");
    return {
      source,
      file,
      level,
      lesson: matched ? `IELTS Speaking Part ${matched.part}/${matched.topic_id}/${matched.band}` : `IELTS Speaking/${id}/${sub}`,
      unit: matched ? `sentence_${matched.sentence_index}` : "sample_answer_sentence",
      content_type: "ielts_speaking_sample_sentence",
    };
  }

  if (source.startsWith("src/pages/exam-prep/ielts/ListeningItem.tsx:")) {
    const item = listeningById.get(id) ?? listeningByText.get(textKey)?.[0];
    return {
      source,
      file,
      level: "unleveled",
      lesson: item ? `IELTS Listening Section ${item.section}/${item.id}` : `IELTS Listening/${id}`,
      unit: "audio_script",
      content_type: "ielts_listening_script",
      notes: item ? `difficulty_band=${item.difficulty_band}` : undefined,
    };
  }

  if (source.startsWith("src/pages/practice/PhonemeDrillPage.tsx:")) {
    const pack = phonemePackBySlug.get(id);
    const matched = phonemeSentenceByText.get(textKey)?.find((row) => row.slug === id)
      ?? phonemeSentenceByText.get(textKey)?.[0];
    return {
      source,
      file,
      level: "unleveled",
      lesson: `phoneme_pack/${id}`,
      unit: matched ? `sentence_${matched.sentence_index}` : "drill_sentence",
      content_type: "phoneme_drill_sentence",
      notes: pack?.pack_kind ?? "phoneme",
    };
  }

  if (source.startsWith("src/data/pronunciation-challenges/index.ts:")) {
    const challenge = challengeById.get(id) ?? challengeByText.get(textKey)?.[0];
    return {
      source,
      file,
      level: "unleveled",
      lesson: challenge ? `daily_challenge/${challenge.id}` : `daily_challenge/${id}`,
      unit: "content_en",
      content_type: "pronunciation_challenge_sentence",
      notes: challenge ? `${challenge.type}/${challenge.difficulty}` : undefined,
    };
  }

  if (source.startsWith("src/lib/pronunciation/multiAccentTTS.ts:")) {
    return {
      source,
      file,
      level: "unleveled",
      lesson: "multi_accent_references",
      unit: ipaWordSet.has(textKey) ? `word/${normalizedText(text).toLowerCase()}` : "word",
      content_type: "ipa_reference_vocabulary",
    };
  }

  if (source.startsWith("src/components/speech/SoundPairDrillCard.tsx:")) {
    const matched = soundPairByText.get(textKey)?.find((row) => row.category === id && row.role === sub)
      ?? soundPairByText.get(textKey)?.[0];
    return {
      source,
      file,
      level: "unleveled",
      lesson: `sound_pair/${id}`,
      unit: matched ? `pair_${matched.pair_index}/${matched.role}` : sub || "word",
      content_type: "sound_pair_word_or_phrase",
    };
  }

  return {
    source,
    file,
    level: "unleveled",
    lesson: id || "unknown",
    unit: sub || "unknown",
    content_type: "other",
  };
}

function choosePrimary(traces: SourceTrace[]): SourceTrace {
  const priority: ContentType[] = [
    "speech_drill_sentence",
    "ielts_speaking_sample_sentence",
    "ielts_listening_script",
    "phoneme_drill_sentence",
    "pronunciation_challenge_sentence",
    "sound_pair_word_or_phrase",
    "ipa_reference_vocabulary",
    "other",
  ];
  return traces.slice().sort((a, b) => priority.indexOf(a.content_type) - priority.indexOf(b.content_type))[0] ?? traces[0];
}

function inc(table: Record<string, Record<string, number>>, level: string, type: string): void {
  table[level] ??= {};
  table[level][type] = (table[level][type] ?? 0) + 1;
}

function sortedObject<T>(record: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
}

function markdownTable(levelTypeTable: Record<string, Record<string, number>>): string[] {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2", "unleveled"];
  const types = [...new Set(Object.values(levelTypeTable).flatMap((row) => Object.keys(row)))].sort();
  const lines = [
    `| level | ${types.join(" | ")} | total |`,
    `| --- | ${types.map(() => "---:").join(" | ")} | ---: |`,
  ];
  for (const level of levels) {
    const row = levelTypeTable[level] ?? {};
    const total = types.reduce((sum, type) => sum + (row[type] ?? 0), 0);
    if (total === 0) continue;
    lines.push(`| ${level} | ${types.map((type) => String(row[type] ?? 0)).join(" | ")} | ${total} |`);
  }
  return lines;
}

function sampleLines(units: ClassifiedUnit[]): string[] {
  const byType = new Map<ContentType, ClassifiedUnit[]>();
  for (const unit of units) {
    const rows = byType.get(unit.content_type) ?? [];
    rows.push(unit);
    byType.set(unit.content_type, rows);
  }
  const lines: string[] = [];
  for (const [type, rows] of [...byType.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`### ${type}`, "");
    for (const unit of rows.slice(0, 10)) {
      lines.push(`- [${unit.level}] ${unit.lesson} / ${unit.unit}: ${unit.text}`);
    }
    lines.push("");
  }
  return lines;
}

async function main(): Promise<void> {
  const input = JSON.parse(await readFile(INPUT, "utf8")) as EnReconcile;
  const runtimeRows = input.classifications.filter((row) => row.bucket === "runtime_tts_only_first_play");
  const units: ClassifiedUnit[] = runtimeRows.map((row) => {
    const traces = parseSource(row.source).map((source) => traceSource(source, row.text));
    const primary = choosePrimary(traces);
    return {
      ...row,
      level: primary.level,
      file: primary.file,
      lesson: primary.lesson,
      unit: primary.unit,
      content_type: primary.content_type,
      source_traces: traces,
    };
  });

  const levelTypeTable: Record<string, Record<string, number>> = {};
  const typeTotals: Record<string, number> = {};
  const levelTotals: Record<string, number> = {};
  for (const unit of units) {
    inc(levelTypeTable, unit.level, unit.content_type);
    typeTotals[unit.content_type] = (typeTotals[unit.content_type] ?? 0) + 1;
    levelTotals[unit.level] = (levelTotals[unit.level] ?? 0) + 1;
  }

  const report = {
    metadata: {
      generated_at: new Date().toISOString(),
      source: "reports/audio-census/en-reconcile.json",
      source_runtime_bucket: "runtime_tts_only_first_play",
      source_units: runtimeRows.length,
      classification_rule: "Read the existing en-reconcile classifications and enrich each row from the same shipped source modules used by the census enumeration.",
      no_storage_or_tts_calls: true,
    },
    verification: {
      expected_runtime_tts_only_units: 1325,
      classified_units: units.length,
      totals_reconcile: units.length === 1325,
      unclassified_units: units.filter((unit) => unit.content_type === "other").length,
      multi_source_units: units.filter((unit) => unit.source_traces.length > 1).length,
    },
    level_type_table: sortedObject(levelTypeTable),
    level_totals: sortedObject(levelTotals),
    content_type_totals: sortedObject(typeTotals),
    units,
    samples_by_content_type: Object.fromEntries(
      Object.entries(
        units.reduce((acc, unit) => {
          acc[unit.content_type] ??= [];
          if (acc[unit.content_type].length < 10) {
            acc[unit.content_type].push({
              level: unit.level,
              lesson: unit.lesson,
              unit: unit.unit,
              text: unit.text,
              source: unit.source,
            });
          }
          return acc;
        }, {} as Record<string, Array<Record<string, string>>>),
      ).sort(([a], [b]) => a.localeCompare(b)),
    ),
  };

  if (!report.verification.totals_reconcile) {
    throw new Error(`Expected 1325 runtime-TTS-only units, classified ${units.length}`);
  }

  const md = [
    "# English Runtime-TTS Unit Breakdown",
    "",
    `Generated: ${report.metadata.generated_at}`,
    "",
    "## Verification",
    "",
    `- Runtime-TTS-only units classified: ${report.verification.classified_units}/1325`,
    `- Multi-source units retained with all source traces: ${report.verification.multi_source_units}`,
    `- Unclassified/other units: ${report.verification.unclassified_units}`,
    "",
    "## Level x Content Type",
    "",
    ...markdownTable(levelTypeTable),
    "",
    "## Content Type Totals",
    "",
    ...Object.entries(report.content_type_totals).map(([type, count]) => `- ${type}: ${count}`),
    "",
    "## Samples",
    "",
    ...sampleLines(units),
  ].join("\n");

  await writeFile(JSON_OUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(MD_OUT, `${md}\n`, "utf8");

  console.log(`[en-unit-breakdown] classified ${units.length}/1325`);
  console.log("[en-unit-breakdown] content types:", JSON.stringify(report.content_type_totals));
  console.log("[en-unit-breakdown] levels:", JSON.stringify(report.level_totals));
}

main().catch((error) => {
  console.error("[en-unit-breakdown] failed:", error);
  process.exit(1);
});
