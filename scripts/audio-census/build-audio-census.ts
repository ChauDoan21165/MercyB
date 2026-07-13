import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  extractAsianLang,
  extractFrenchOrGerman,
  extractSpanish,
} from "../build-audio-manifest.ts";
import { azureVoiceFor } from "../../supabase/functions/mercy-tts/azureProvider.ts";
import { englishTextForTts } from "../../src/lib/tutor/englishOnlyTts.ts";
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

type PreGeneratedLanguage = "fr" | "de" | "ja" | "ko" | "zh" | "vi" | "es";
type Level = "A1" | "A1+" | "A2" | "B1" | "B2" | "C1" | "C2";

type LessonAudioUnit = {
  category: "pregenerated_lesson_audio";
  language: PreGeneratedLanguage;
  level: string;
  text: string;
  storage_key: string;
  source: string;
  status?: "present" | "missing";
  bytes?: number | null;
};

type EnglishTtsUnit = {
  category: "english_tts_first";
  language: "en";
  voice: string;
  text: string;
  cache_key: string;
  storage_key: string;
  source: string;
  status?: "cached" | "tts_first_uncached";
  bytes?: number | null;
};

type StorageObject = {
  name: string;
  storage_key: string;
  bytes: number | null;
  updated_at?: string;
};

type LanguageSummary = {
  expected: number;
  present: number;
  missing: number;
  tts_first?: number;
  orphan_files?: number | null;
  size_outliers: number;
  median_bytes: number | null;
};

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://buemdfxyhxunzpgdoqin.supabase.co";
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
const BUCKET = "room-audio";
const TTS_CACHE_PREFIX = "tts-cache";
const REPORT_DIR = resolve("reports/audio-census");
const LEVELS: readonly Level[] = ["A1", "A1+", "A2", "B1", "B2", "C1", "C2"];

const LANGUAGE_NAMES = {
  french: "fr",
  german: "de",
  japanese: "ja",
  korean: "ko",
  chinese: "zh",
  spanish: "es",
} as const;

type ManifestLang = keyof typeof LANGUAGE_NAMES;

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function publicObjectUrl(storageKey: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURI(storageKey)}`;
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
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

function addEnglishUnit(
  out: Map<string, EnglishTtsUnit>,
  input: { text: string; source: string },
): void {
  const text = englishTextForTts(input.text).trim();
  if (!text) return;
  const language = "en";
  const voice = azureVoiceFor(language).name;
  const cacheKey = sha256(`azure|${voice}|${language}|${text}`);
  const key = `${language}\0${voice}\0${text}`;
  const existing = out.get(key);
  if (existing) {
    existing.source = `${existing.source}; ${input.source}`;
    return;
  }
  out.set(key, {
    category: "english_tts_first",
    language,
    voice,
    text,
    cache_key: cacheKey,
    storage_key: `${TTS_CACHE_PREFIX}/${cacheKey}.mp3`,
    source: input.source,
  });
}

async function importLessons(lang: ManifestLang | "vietnamese", level: Level): Promise<unknown[]> {
  const path = resolve(`src/languages/${lang}/lessons-${level.toLowerCase()}.ts`);
  if (!existsSync(path)) return [];
  const mod = await import(pathToFileURL(path).href);
  const candidates = [mod.lessons, mod.default];
  const lessons = candidates.find((candidate) => Array.isArray(candidate));
  if (!lessons) {
    throw new Error(`No lessons array found in ${path}`);
  }
  return lessons as unknown[];
}

async function buildPregeneratedUnits(): Promise<LessonAudioUnit[]> {
  const out: LessonAudioUnit[] = [];

  for (const lang of Object.keys(LANGUAGE_NAMES) as ManifestLang[]) {
    const language = LANGUAGE_NAMES[lang] as PreGeneratedLanguage;
    for (const level of LEVELS) {
      const lessons = await importLessons(lang, level);
      const lessonsAtLevel = lessons.filter((lesson) => {
        const record = lesson as { level?: unknown };
        return record.level === level;
      });
      lessonsAtLevel.forEach((lesson, lessonIndex) => {
        let entries: Array<{
          storage_key: string;
          text: string;
          language: string;
          level: string;
        }> = [];
        if (lang === "french" || lang === "german") {
          entries = extractFrenchOrGerman(lang, lesson as Record<string, unknown>, lessonIndex, level);
        } else if (lang === "japanese") {
          entries = extractAsianLang(lang, lesson as Record<string, unknown>, lessonIndex, level, {
            sentence: "japanese",
            dialogue: "japanese",
            vocab: "japanese",
            vocabKey: "vocabulary",
          });
        } else if (lang === "korean") {
          entries = extractAsianLang(lang, lesson as Record<string, unknown>, lessonIndex, level, {
            sentence: "korean",
            dialogue: "hangul",
            vocab: "hangul",
            vocabKey: "vocabulary",
          });
        } else if (lang === "chinese") {
          entries = extractAsianLang(lang, lesson as Record<string, unknown>, lessonIndex, level, {
            sentence: "chinese",
            dialogue: "chinese",
            vocab: "chinese",
            vocabKey: "vocab",
          });
        } else if (lang === "spanish") {
          entries = extractSpanish(lesson as Record<string, unknown>, lessonIndex, level);
        }
        for (const entry of entries) {
          out.push({
            category: "pregenerated_lesson_audio",
            language,
            level: entry.level,
            text: entry.text,
            storage_key: entry.storage_key,
            source: `scripts/build-audio-manifest.ts:${lang}:${level}`,
          });
        }
      });
    }
  }

  for (const level of LEVELS) {
    const lessons = await importLessons("vietnamese", level);
    const lessonsAtLevel = lessons.filter((lesson) => {
      const record = lesson as { level?: unknown };
      return record.level === level;
    });
    for (const lesson of lessonsAtLevel) {
      const record = lesson as {
        id: string | number;
        level?: string;
        phrases?: Array<{ vietnamese?: string }>;
        dialogue?: Array<{ vietnamese?: string }>;
      };
      const levelPrefix = String(record.level ?? level).toLowerCase();
      for (const [index, phrase] of (record.phrases ?? []).entries()) {
        const text = normalizeText(phrase.vietnamese ?? "");
        if (!text) continue;
        out.push({
          category: "pregenerated_lesson_audio",
          language: "vi",
          level,
          text: text.length < 3 ? `${text}.` : text,
          storage_key: `${levelPrefix}/vi/l${record.id}/phrase_${index + 1}.mp3`,
          source: "scripts/generate-vietnamese-audio.ts",
        });
      }
      for (const [index, line] of (record.dialogue ?? []).entries()) {
        const text = normalizeText(line.vietnamese ?? "");
        if (!text) continue;
        out.push({
          category: "pregenerated_lesson_audio",
          language: "vi",
          level,
          text: text.length < 3 ? `${text}.` : text,
          storage_key: `${levelPrefix}/vi/l${record.id}/dialogue_${index + 1}.mp3`,
          source: "scripts/generate-vietnamese-audio.ts",
        });
      }
    }
  }

  return out;
}

function buildEnglishTtsUnits(): EnglishTtsUnit[] {
  const units = new Map<string, EnglishTtsUnit>();

  for (const sentence of SPEECH_SENTENCES) {
    addEnglishUnit(units, {
      text: sentence.target_en,
      source: "src/pages/SpeechDrillPage.tsx:SPEECH_SENTENCES",
    });
  }

  for (const item of IELTS_LISTENING_ITEMS) {
    addEnglishUnit(units, {
      text: item.audio_script,
      source: `src/pages/exam-prep/ielts/ListeningItem.tsx:${item.id}`,
    });
  }

  for (const topic of IELTS_SPEAKING_TOPICS) {
    for (const sentence of splitIntoSentences(topic.sample_strong_answer_band_7)) {
      addEnglishUnit(units, {
        text: sentence,
        source: `src/lib/speech/lessonPractice.ts:${topic.id}:band7`,
      });
    }
    for (const sentence of splitIntoSentences(cleanWeakSample(topic.sample_weak_answer_band_5))) {
      addEnglishUnit(units, {
        text: sentence,
        source: `src/lib/speech/lessonPractice.ts:${topic.id}:band5`,
      });
    }
  }

  for (const pack of PHONEME_DRILL_PACKS) {
    for (const sentence of pack.sentences) {
      addEnglishUnit(units, {
        text: sentence.sentence_en,
        source: `src/pages/practice/PhonemeDrillPage.tsx:${pack.slug}`,
      });
    }
  }

  for (const challenge of DAILY_CHALLENGES) {
    addEnglishUnit(units, {
      text: challenge.content_en,
      source: `src/data/pronunciation-challenges/index.ts:${challenge.id}`,
    });
  }

  for (const entry of ALL_MULTI_ACCENT_ENTRIES) {
    addEnglishUnit(units, {
      text: entry.word,
      source: "src/lib/pronunciation/multiAccentTTS.ts:ALL_MULTI_ACCENT_ENTRIES",
    });
  }

  for (const category of DRILL_CATEGORIES) {
    const pairs = getDrillByCategory(category, { size: Number.MAX_SAFE_INTEGER });
    for (const pair of pairs) {
      addEnglishUnit(units, {
        text: pair.target,
        source: `src/components/speech/SoundPairDrillCard.tsx:${category}:target`,
      });
      addEnglishUnit(units, {
        text: pair.contrast,
        source: `src/components/speech/SoundPairDrillCard.tsx:${category}:contrast`,
      });
    }
  }

  return Array.from(units.values()).sort((a, b) => a.text.localeCompare(b.text));
}

async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
  onProgress?: (done: number, total: number) => void,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  let done = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index] as T, index);
      done += 1;
      onProgress?.(done, items.length);
    }
  });
  await Promise.all(workers);
  return results;
}

async function headObjectOnce(storageKey: string): Promise<{ present: boolean; bytes: number | null; status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(publicObjectUrl(storageKey), {
      method: "HEAD",
      signal: controller.signal,
    });
    const length = response.headers.get("content-length");
    return {
      present: response.ok,
      bytes: response.ok && length ? Number(length) : null,
      status: response.status,
    };
  } catch {
    return { present: false, bytes: null, status: 0 };
  } finally {
    clearTimeout(timer);
  }
}

async function headObject(storageKey: string): Promise<{ present: boolean; bytes: number | null; status: number }> {
  let last = await headObjectOnce(storageKey);
  if (last.present) return last;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await new Promise((resolveRetry) => setTimeout(resolveRetry, 250 * (attempt + 1)));
    last = await headObjectOnce(storageKey);
    if (last.present) return last;
  }
  return last;
}

async function listStoragePrefix(prefix: string): Promise<
  | { status: "listed"; objects: StorageObject[]; note?: string }
  | { status: "not_listable"; objects: StorageObject[]; note: string }
> {
  if (!ANON_KEY) {
    return {
      status: "not_listable",
      objects: [],
      note: "No VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY was available in the local environment.",
    };
  }

  const objects: StorageObject[] = [];
  const limit = 1000;
  let offset = 0;
  for (;;) {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${ANON_KEY}`,
        apikey: ANON_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        prefix,
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      }),
    });
    if (!response.ok) {
      return {
        status: "not_listable",
        objects: [],
        note: `Storage list returned HTTP ${response.status}; Chau must grant/select-policy or provide an anon key with list access.`,
      };
    }
    const data = (await response.json()) as Array<{
      name?: string;
      updated_at?: string;
      metadata?: { size?: number };
    }>;
    if (Array.isArray(data) && data.length === 0 && offset === 0) {
      return {
        status: "not_listable",
        objects: [],
        note: "Supabase returned 200 [] for the first page; per scope update this is treated as no select/list policy, not an empty prefix.",
      };
    }
    for (const object of data) {
      if (!object.name) continue;
      objects.push({
        name: object.name,
        storage_key: `${prefix}/${object.name}`.replace(/\/+/g, "/"),
        bytes: typeof object.metadata?.size === "number" ? object.metadata.size : null,
        updated_at: object.updated_at,
      });
    }
    if (!Array.isArray(data) || data.length < limit) break;
    offset += limit;
  }

  return { status: "listed", objects };
}

function median(values: readonly number[]): number | null {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid] as number;
  return ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
}

function summarize(
  pregenerated: readonly LessonAudioUnit[],
  english: readonly EnglishTtsUnit[],
): Record<string, LanguageSummary> {
  const summaries: Record<string, LanguageSummary> = {};
  const languages = new Set<string>([
    ...pregenerated.map((unit) => unit.language),
    ...english.map((unit) => unit.language),
  ]);

  for (const language of Array.from(languages).sort()) {
    const pre = pregenerated.filter((unit) => unit.language === language);
    const en = english.filter((unit) => unit.language === language);
    const sizes = [...pre, ...en]
      .map((unit) => unit.bytes)
      .filter((bytes): bytes is number => typeof bytes === "number");
    const med = median(sizes);
    const threshold = med === null ? 0 : Math.max(1024, med * 0.2);
    const outliers = [...pre, ...en].filter((unit) => {
      if (unit.status !== "present" && unit.status !== "cached") return false;
      const bytes = unit.bytes ?? null;
      return bytes === 0 || (bytes !== null && med !== null && bytes < threshold);
    });

    summaries[language] = {
      expected: pre.length,
      present: pre.filter((unit) => unit.status === "present").length,
      missing: pre.filter((unit) => unit.status === "missing").length,
      tts_first: en.length > 0 ? en.filter((unit) => unit.status === "tts_first_uncached").length : undefined,
      orphan_files: null,
      size_outliers: outliers.length,
      median_bytes: med === null ? null : Math.round(med),
    };
  }
  return summaries;
}

function markdownReport(input: {
  generatedAt: string;
  commit: string;
  summaries: Record<string, LanguageSummary>;
  pregenerated: readonly LessonAudioUnit[];
  english: readonly EnglishTtsUnit[];
  storageList: Awaited<ReturnType<typeof listStoragePrefix>>;
  orphans: StorageObject[];
  totalOrphanBytes: number;
  dynamicGaps: readonly string[];
}): string {
  const tableRows = Object.entries(input.summaries)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([language, summary]) =>
      `| ${language} | ${summary.expected} | ${summary.present} | ${summary.missing} | ${summary.tts_first ?? 0} | n/a | ${summary.size_outliers} |`,
    );
  tableRows.push(
    `| tts-cache orphan (unattributed) | 0 | 0 | 0 | 0 | ${input.orphans.length} | 0 |`,
  );
  const missingSamples = input.pregenerated
    .filter((unit) => unit.status === "missing")
    .slice(0, 40)
    .map((unit) => `- ${unit.language} ${unit.storage_key} — ${unit.text}`);
  const orphanSamples = input.orphans
    .slice(0, 20)
    .map((object) => `- ${object.storage_key} (${object.bytes ?? "unknown"} bytes)`);

  return [
    "# Audio Census",
    "",
    `Generated: ${input.generatedAt}`,
    `Commit: ${input.commit}`,
    "",
    "## Summary",
    "",
    "| language | expected pre-generated | present | missing | English tts-first uncached | orphan files | size outliers |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...tableRows,
    "",
    "English rows are runtime-TTS-first by current design. They are inventoried and HEAD-checked against `room-audio/tts-cache/`, but uncached English entries are not reported as missing pre-generated lesson audio. `tts-cache` orphan files are hash-only and cannot be attributed to a source language without an external map, so they are reported in one unattributed row.",
    "",
    "## Storage Listing",
    "",
    `Status: ${input.storageList.status}`,
    `Note: ${input.storageList.note ?? "Storage list succeeded."}`,
    `Listed objects: ${input.storageList.objects.length}`,
    `Orphans: ${input.orphans.length}`,
    `Orphan bytes: ${input.totalOrphanBytes}`,
    "",
    "## Missing Pre-Generated Samples",
    "",
    ...(missingSamples.length ? missingSamples : ["None in the first-party HEAD check."]),
    "",
    "## Orphan Sample",
    "",
    ...(orphanSamples.length ? orphanSamples : ["No orphan sample available because storage listing was not authoritative or no orphans were found."]),
    "",
    "## Non-Enumerable Runtime Surfaces",
    "",
    ...input.dynamicGaps.map((gap) => `- ${gap}`),
    "",
  ].join("\n");
}

async function gitCommit(): Promise<string> {
  try {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execFileAsync = promisify(execFile);
    const result = await execFileAsync("git", ["rev-parse", "HEAD"]);
    return result.stdout.trim();
  } catch {
    return "unknown";
  }
}

async function main(): Promise<void> {
  const generatedAt = new Date().toISOString();
  const commit = await gitCommit();
  const [pregenerated, english] = await Promise.all([
    buildPregeneratedUnits(),
    Promise.resolve(buildEnglishTtsUnits()),
  ]);
  console.log("[audio-census] inventory pregenerated:", pregenerated.length);
  console.log("[audio-census] inventory english tts-first:", english.length);

  await mapLimit(pregenerated, 48, async (unit) => {
    const head = await headObject(unit.storage_key);
    unit.status = head.present ? "present" : "missing";
    unit.bytes = head.bytes;
    return unit;
  }, (done, total) => {
    if (done % 1000 === 0 || done === total) {
      console.log(`[audio-census] pregenerated HEAD ${done}/${total}`);
    }
  });

  await mapLimit(english, 32, async (unit) => {
    const head = await headObject(unit.storage_key);
    unit.status = head.present ? "cached" : "tts_first_uncached";
    unit.bytes = head.bytes;
    return unit;
  }, (done, total) => {
    if (done % 250 === 0 || done === total) {
      console.log(`[audio-census] english tts-cache HEAD ${done}/${total}`);
    }
  });

  const storageList = await listStoragePrefix(TTS_CACHE_PREFIX);
  const expectedTtsKeys = new Set(english.map((unit) => unit.storage_key));
  const orphans = storageList.status === "listed"
    ? storageList.objects.filter((object) => !expectedTtsKeys.has(object.storage_key))
    : [];
  const totalOrphanBytes = orphans.reduce((sum, object) => sum + (object.bytes ?? 0), 0);
  const summaries = summarize(pregenerated, english);

  const dynamicGaps = [
    "src/pages/AiTutor.tsx: conversational TTS can include user/AI-generated text; no finite shipped-content inventory exists.",
    "src/components/mercy-guide/MercySpeakTab.tsx: reference/practice text can be user-selected or generated at runtime.",
    "src/pages/SpeechDrillPage.tsx:?practice= free-form URL text is intentionally runtime TTS and not enumerable from shipped content.",
    "tts-cache orphan language attribution is intentionally unavailable from object paths: cache files are SHA-256 hashes with no language prefix.",
  ];

  const report = {
    metadata: {
      generated_at: generatedAt,
      commit,
      supabase_url: SUPABASE_URL,
      bucket: BUCKET,
      cache_prefix: TTS_CACHE_PREFIX,
      read_only: true,
      no_synthesis_no_delete_no_rewarm: true,
      hash_contract: 'sha256("azure|{voice}|{lang}|{text}")',
      scope_update: {
        english_lesson_units: "tts_first_not_missing",
        empty_list_response: "not_listable_not_empty",
        pregenerated_languages: ["fr", "de", "ja", "ko", "zh", "vi", "es"],
      },
    },
    summaries,
    reconciliation: {
      pregenerated_expected: pregenerated.length,
      pregenerated_present: pregenerated.filter((unit) => unit.status === "present").length,
      pregenerated_missing: pregenerated.filter((unit) => unit.status === "missing").length,
      english_tts_first_expected: english.length,
      english_tts_cached: english.filter((unit) => unit.status === "cached").length,
      english_tts_first_uncached: english.filter((unit) => unit.status === "tts_first_uncached").length,
      tts_cache_listing_status: storageList.status,
      tts_cache_listed_objects: storageList.objects.length,
      tts_cache_referenced_objects: storageList.status === "listed"
        ? storageList.objects.filter((object) => expectedTtsKeys.has(object.storage_key)).length
        : null,
      tts_cache_orphan_objects: storageList.status === "listed" ? orphans.length : null,
      tts_cache_orphan_bytes: storageList.status === "listed" ? totalOrphanBytes : null,
      tts_cache_orphan_attribution: "unattributed_hash_only_paths",
    },
    storage_listing: storageList,
    missing_pregenerated: pregenerated.filter((unit) => unit.status === "missing"),
    english_tts_first: english,
    size_outliers: [...pregenerated, ...english].filter((unit) => {
      const summary = summaries[unit.language];
      if (!summary || summary.median_bytes === null) return false;
      if (unit.status !== "present" && unit.status !== "cached") return false;
      const bytes = unit.bytes ?? null;
      return bytes === 0 || (bytes !== null && bytes < Math.max(1024, summary.median_bytes * 0.2));
    }),
    orphans,
    dynamic_gaps: dynamicGaps,
    pregenerated_units: pregenerated,
  };

  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(resolve(REPORT_DIR, "census.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(
    resolve(REPORT_DIR, "census.md"),
    markdownReport({
      generatedAt,
      commit,
      summaries,
      pregenerated,
      english,
      storageList,
      orphans,
      totalOrphanBytes,
      dynamicGaps,
    }),
    "utf8",
  );

  console.log("[audio-census] pregenerated expected:", report.reconciliation.pregenerated_expected);
  console.log("[audio-census] pregenerated present:", report.reconciliation.pregenerated_present);
  console.log("[audio-census] pregenerated missing:", report.reconciliation.pregenerated_missing);
  console.log("[audio-census] english tts-first:", report.reconciliation.english_tts_first_expected);
  console.log("[audio-census] storage list:", storageList.status, storageList.note ?? "");
}

main().catch((error) => {
  console.error("[audio-census] failed:", error);
  process.exit(1);
});
