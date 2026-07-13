#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  extractAsianLang,
  extractFrenchOrGerman,
  extractSpanish,
} from "../build-audio-manifest.js";
import { isPhonicsOnly, lessonAudioBase, lessonAudioKey } from "../../src/lib/lessonAudio.js";

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type StructuredLang = "french" | "german" | "japanese" | "korean" | "chinese" | "spanish" | "vietnamese";
type StructuredLangCode = "fr" | "de" | "ja" | "ko" | "zh" | "es" | "vi";
type ManifestEntry = {
  storage_key: string;
  text: string;
  language: string;
  level: string;
  lesson_id: string | number;
  lesson_index: number;
  unit_kind: string;
  unit_index: number;
  speaker?: "A" | "B";
  char_count: number;
};
type LanguageLevelCounts = Record<string, Record<string, { linked: number; verified: number; unverified: number }>>;
type AudioLinkArtifactForMarkdown = {
  summary: {
    scheme_counts: Record<string, number>;
    linked_vs_verified_by_language_level: LanguageLevelCounts;
    unresolvable_audio_gaps_by_language: Record<string, number>;
  };
};

const ROOT = process.cwd();
const SUPABASE_URL = "https://buemdfxyhxunzpgdoqin.supabase.co";
const BUCKET = "room-audio";
const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const STRUCTURED_LANGS: Array<{ lang: StructuredLang; code: StructuredLangCode }> = [
  { lang: "french", code: "fr" },
  { lang: "german", code: "de" },
  { lang: "japanese", code: "ja" },
  { lang: "korean", code: "ko" },
  { lang: "chinese", code: "zh" },
  { lang: "spanish", code: "es" },
  { lang: "vietnamese", code: "vi" },
];
const OUTPUT_JSON = "reports/cell-inventory/audio-link-global.json";
const OUTPUT_MD = "reports/cell-inventory/audio-link-global.md";
const HEAD_TIMEOUT_MS = Number(process.env.AUDIO_LINK_HEAD_TIMEOUT_MS ?? 10000);
const HEAD_CONCURRENCY = Number(process.env.AUDIO_LINK_HEAD_CONCURRENCY ?? 64);

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function asText(value: unknown): string {
  return hasText(value) ? value.trim() : "";
}

function publicUrl(storageKey: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storageKey.split("/").map(encodeURIComponent).join("/")}`;
}

async function headOk(url: string): Promise<{ ok: boolean; status: number | null }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEAD_TIMEOUT_MS);
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    return { ok: response.ok, status: response.status };
  } catch {
    return { ok: false, status: null };
  } finally {
    clearTimeout(timeout);
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

async function loadLessons(lang: StructuredLang, level: Level): Promise<Record<string, unknown>[]> {
  const relative = `src/languages/${lang}/lessons-${level.toLowerCase()}.ts`;
  const absolute = path.join(ROOT, relative);
  if (!fs.existsSync(absolute)) return [];
  const mod = await import(pathToFileURL(absolute).href);
  const lessons = Array.isArray(mod.lessons) ? mod.lessons : Array.isArray(mod.default) ? mod.default : [];
  return lessons.filter((lesson: Record<string, unknown>) => lesson?.level === level);
}

function vietnameseEntries(lesson: Record<string, unknown>, lessonIndex: number, level: Level): ManifestEntry[] {
  const lessonId = lesson.id as string | number;
  const base = lessonAudioBase("vi", lessonId, level);
  const out: ManifestEntry[] = [];
  const phrases = Array.isArray(lesson.phrases) ? lesson.phrases as Array<Record<string, unknown>> : [];
  phrases.forEach((phrase, index) => {
    const text = asText(phrase.vietnamese);
    if (!text || isPhonicsOnly(text)) return;
    out.push({
      storage_key: lessonAudioKey(base, { kind: "phrase", index: index + 1 }),
      text,
      language: "vi",
      level,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "phrase",
      unit_index: index + 1,
      char_count: text.length,
    });
  });

  const dialogue = Array.isArray(lesson.dialogue) ? lesson.dialogue as Array<Record<string, unknown>> : [];
  dialogue.forEach((turn, index) => {
    const text = asText(turn.vietnamese);
    if (!text || isPhonicsOnly(text)) return;
    out.push({
      storage_key: lessonAudioKey(base, { kind: "dialogue_vi", index: index + 1 }),
      text,
      language: "vi",
      level,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "dialogue_vi",
      unit_index: index + 1,
      char_count: text.length,
    });
  });
  return out;
}

async function structuredEntries(): Promise<ManifestEntry[]> {
  const entries: ManifestEntry[] = [];
  for (const { lang } of STRUCTURED_LANGS) {
    for (const level of LEVELS) {
      const lessons = await loadLessons(lang, level);
      lessons.forEach((lesson, index) => {
        if (lang === "french" || lang === "german") {
          entries.push(...extractFrenchOrGerman(lang, lesson, index, level));
        } else if (lang === "japanese") {
          entries.push(...extractAsianLang(lang, lesson, index, level, {
            sentence: "japanese",
            dialogue: "japanese",
            vocab: "japanese",
            vocabKey: "vocabulary",
          }));
        } else if (lang === "korean") {
          entries.push(...extractAsianLang(lang, lesson, index, level, {
            sentence: "korean",
            dialogue: "hangul",
            vocab: "hangul",
            vocabKey: "vocabulary",
          }));
        } else if (lang === "chinese") {
          entries.push(...extractAsianLang(lang, lesson, index, level, {
            sentence: "chinese",
            dialogue: "chinese",
            vocab: "chinese",
            vocabKey: "vocab",
          }));
        } else if (lang === "spanish") {
          entries.push(...extractSpanish(lesson, index, level));
        } else if (lang === "vietnamese") {
          entries.push(...vietnameseEntries(lesson, index, level));
        }
      });
    }
  }
  return entries;
}

function legacyRootFiles(): string[] {
  const dirs = ["room-audio-fixed", "public/audio"];
  const files: string[] = [];
  for (const dir of dirs) {
    const absoluteDir = path.join(ROOT, dir);
    if (!fs.existsSync(absoluteDir)) continue;
    const stack = [absoluteDir];
    while (stack.length) {
      const current = stack.pop()!;
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const absolute = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(absolute);
        } else if (/\.(mp3|wav|m4a|ogg)$/i.test(entry.name)) {
          const relative = path.relative(absoluteDir, absolute).replaceAll("\\", "/");
          files.push(relative);
        }
      }
    }
  }
  return [...new Set(files)].sort();
}

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, item) => {
    const k = key(item);
    counts[k] = (counts[k] ?? 0) + 1;
    return counts;
  }, {});
}

function nestedCounts(entries: Array<{ language: string; level: string; verified: boolean }>): LanguageLevelCounts {
  const out: LanguageLevelCounts = {};
  for (const entry of entries) {
    out[entry.language] ??= {};
    out[entry.language][entry.level] ??= { linked: 0, verified: 0, unverified: 0 };
    out[entry.language][entry.level].linked += 1;
    if (entry.verified) out[entry.language][entry.level].verified += 1;
    else out[entry.language][entry.level].unverified += 1;
  }
  return out;
}

function renderMarkdown(artifact: AudioLinkArtifactForMarkdown): string {
  const schemeRows = Object.entries(artifact.summary.scheme_counts)
    .map(([scheme, count]) => `| ${scheme} | ${count} |`)
    .join("\n");
  const rows: string[] = [];
  for (const [language, levels] of Object.entries(artifact.summary.linked_vs_verified_by_language_level)) {
    for (const level of Object.keys(levels).sort()) {
      const c = levels[level];
      rows.push(`| ${language} | ${level} | ${c.linked} | ${c.verified} | ${c.unverified} |`);
    }
  }
  const gapRows = Object.entries(artifact.summary.unresolvable_audio_gaps_by_language)
    .map(([language, count]) => `| ${language} | ${count} |`)
    .join("\n");
  return `# WP-AUDIO-LINK-1 Global Audio Link

## Verdict

Scheme A legacy-root ingest and scheme B structured lesson-unit ingest are complete. Scheme B is intentionally linked to lesson JSON units, not CELL rows, per amendment 7. HEAD verification was run against the public \`room-audio\` bucket and the unresolvable audio gaps are preserved in the JSON artifact.

## Scheme Counts

| Scheme | Linked |
| --- | ---: |
${schemeRows}

## Linked Vs Verified By Language And Level

| Language | Level | Linked | Verified | Unverified |
| --- | --- | ---: | ---: | ---: |
${rows.join("\n")}

## Step 6 Unresolvable Audio Gaps By Language

| Language | Gaps |
| --- | ---: |
${gapRows}

## Check-K Rescope

Check-K remains cell-scoped. It may consume committed \`audio-map-*.json\` artifacts keyed by canonical cell UUIDs, but it must not count scheme B lesson-unit links as cell-level checked-in reference audio. The baseline definition was updated to make that distinction explicit.
`;
}

async function main() {
  const structured = await structuredEntries();
  const legacy = legacyRootFiles();
  const schemeB = structured.map((entry) => ({
    scheme: "B_structured_lesson_unit",
    language: entry.language,
    level: entry.level,
    storage_key: entry.storage_key,
    public_url: publicUrl(entry.storage_key),
    lesson_id: entry.lesson_id,
    lesson_index: entry.lesson_index,
    unit_kind: entry.unit_kind,
    unit_index: entry.unit_index,
    speaker: entry.speaker ?? null,
    text: entry.text,
    char_count: entry.char_count,
    link_granularity: "lesson_json_unit",
  }));
  const schemeA = legacy.map((storageKey) => ({
    scheme: "A_legacy_root",
    language: "legacy-root",
    level: "legacy-root",
    storage_key: storageKey,
    public_url: publicUrl(storageKey),
    link_granularity: "legacy_root_object",
  }));
  const links = [...schemeA, ...schemeB];
  console.log(`[audio-link] HEAD verifying ${links.length} links with concurrency=${HEAD_CONCURRENCY} timeout_ms=${HEAD_TIMEOUT_MS}`);
  const started = Date.now();
  const verified = await mapLimit(links, HEAD_CONCURRENCY, async (link, index) => {
    if (index > 0 && index % 1000 === 0) {
      console.log(`[audio-link] verified ${index}/${links.length}`);
    }
    const result = await headOk(link.public_url);
    return { ...link, verified: result.ok, head_status: result.status };
  });
  console.log(`[audio-link] HEAD verification finished in ${Date.now() - started}ms`);
  const gaps = verified.filter((link) => !link.verified);
  const artifact = {
    metadata: {
      generated_by: "scripts/cell-os/build-audio-link-global.ts",
      work_package: "WP-AUDIO-LINK-1",
      supabase_url: SUPABASE_URL,
      bucket: BUCKET,
      generated_at: new Date().toISOString(),
      schemes: {
        A_legacy_root: "Legacy root audio keys ingested from local root audio asset directories and verified as root objects in the room-audio bucket.",
        B_structured_lesson_unit: "Structured seven-language lesson audio keys generated from lesson JSON/TS units and linked at lesson-unit granularity, not CELL granularity.",
      },
      amendment_7: "Structured language audio is linked to lesson JSON units, not cell rows.",
      structured_languages: STRUCTURED_LANGS.map((item) => item.code),
      levels: LEVELS,
    },
    summary: {
      total_linked: verified.length,
      total_verified: verified.filter((link) => link.verified).length,
      total_unverified: gaps.length,
      scheme_counts: countBy(verified, (link) => link.scheme),
      scheme_verified_counts: countBy(verified.filter((link) => link.verified), (link) => link.scheme),
      linked_vs_verified_by_language_level: nestedCounts(verified),
      unresolvable_audio_gaps_by_language: countBy(gaps, (link) => link.language),
      unresolvable_audio_gaps_by_scheme: countBy(gaps, (link) => link.scheme),
    },
    unresolvable_audio_gaps: gaps.map((gap) => ({
      scheme: gap.scheme,
      language: gap.language,
      level: gap.level,
      storage_key: gap.storage_key,
      head_status: gap.head_status,
      lesson_id: "lesson_id" in gap ? gap.lesson_id : null,
      unit_kind: "unit_kind" in gap ? gap.unit_kind : null,
      unit_index: "unit_index" in gap ? gap.unit_index : null,
    })),
    links: verified,
  };
  fs.writeFileSync(path.join(ROOT, OUTPUT_JSON), `${JSON.stringify(artifact, null, 2)}\n`);
  fs.writeFileSync(path.join(ROOT, OUTPUT_MD), renderMarkdown(artifact));
  console.log(JSON.stringify({
    status: "ok",
    total_linked: artifact.summary.total_linked,
    total_verified: artifact.summary.total_verified,
    total_unverified: artifact.summary.total_unverified,
    output_json: OUTPUT_JSON,
    output_markdown: OUTPUT_MD,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
