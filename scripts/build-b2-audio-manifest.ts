/**
 * Build the B2 audio generation manifest. DRY-RUN — does NOT call ElevenLabs
 * or upload to Supabase. Walks all 5 lessons.ts files, finds every B2 lesson,
 * and emits one manifest entry per spoken text unit.
 *
 * Output: /private/tmp/a1-audio-pipeline/audio-manifest.json (gitignored)
 *
 * Run:
 *   npx tsx scripts/build-b2-audio-manifest.ts
 *
 * Schema mapping per language (recon-confirmed):
 *
 *   French  / German   — sentences[].en (holds native text by historical convention)
 *                        dialogue[].text, dialogue_long[].text
 *                        vocabulary[].word, idiom_glosses[].example
 *                        IDs are STRING (e.g., "french_b2_salary_negotiation").
 *                        Storage slug = id with "<lang>_b2_" or "<lang>_fluency_" prefix stripped.
 *
 *   Japanese           — sentences[].japanese OR examples[].japanese (older lessons use 'examples')
 *                        dialogue[].japanese, dialogue_long[].japanese (when present)
 *                        vocabulary[].japanese, idiom_glosses[].example
 *                        IDs are NUMERIC.
 *
 *   Korean             — sentences[].korean
 *                        dialogue[].hangul, dialogue_long[].hangul (when present)
 *                        vocabulary[].hangul, idiom_glosses[].example
 *                        IDs are NUMERIC.
 *
 *   Chinese            — sentences[].chinese
 *                        dialogue[].chinese, dialogue_long[].chinese (when present)
 *                        vocab[].chinese (note: 'vocab' not 'vocabulary')
 *                        idiom_glosses[].example
 *                        IDs are NUMERIC.
 *
 * Voice rotation:
 *   - Single-speaker units (sentence/vocab/idiom): one of 6 voices, deterministic
 *     by fnv1a(storage_key) so re-runs are stable.
 *   - Dialogue units (short + long): two voices per lesson (one for speaker A, one for B),
 *     picked deterministically by fnv1a(lesson_key).
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// ─── Constants ────────────────────────────────────────────────────────────

const VOICE_IDS = [
  "hpp4J3VqNfWAUOO0d1Us",
  "CwhRBWXzGAHq8TQ4Fs17",
  "EXAVITQu4vr4xnSDxMaL",
  "FGY2WhTYpPnrIDTdsKH5",
  "bIHbv24MWmeRgasZH58o",
  "TX3LPaxmHKxFdv7VOQHJ",
] as const;

const LANG_CODES = {
  french: "fr",
  german: "de",
  japanese: "ja",
  korean: "ko",
  chinese: "zh",
} as const;

type LangKey = keyof typeof LANG_CODES;

const OUTPUT_PATH = resolve("audio-manifest.json");

// ─── Voice picking (deterministic) ───────────────────────────────────────

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
}

function pickVoice(seedKey: string): string {
  return VOICE_IDS[fnv1a(seedKey) % VOICE_IDS.length];
}

function pickTwoVoices(seedKey: string): [string, string] {
  const a = fnv1a(seedKey + "::A");
  const b = fnv1a(seedKey + "::B");
  const ai = a % VOICE_IDS.length;
  let bi = b % VOICE_IDS.length;
  if (bi === ai) bi = (bi + 1) % VOICE_IDS.length;
  return [VOICE_IDS[ai], VOICE_IDS[bi]];
}

// ─── Lesson-id → storage slug ─────────────────────────────────────────────

function lessonStorageSlug(lang: LangKey, lessonId: string | number): string {
  if (typeof lessonId === "number") return `l${lessonId}`;
  // String IDs: "french_b2_salary_negotiation" → "lsalary_negotiation"
  //             "french_fluency_conditional" → "lconditional"
  let s = lessonId;
  s = s.replace(new RegExp(`^${lang}_b2_`), "");
  s = s.replace(new RegExp(`^${lang}_fluency_`), "");
  s = s.replace(new RegExp(`^${lang}_`), "");
  return `l${s}`;
}

// ─── Manifest entry shape ─────────────────────────────────────────────────

type ManifestEntry = {
  storage_key: string; // e.g., b2/fr/lsalary_negotiation/sentence_1.mp3
  text: string;
  voice_id: string;
  language: string; // ISO short code
  lesson_id: string | number; // raw id from source data
  lesson_index: number; // ordinal among B2 lessons in the file (0-based)
  unit_kind: "sentence" | "dialogue_short" | "dialogue_long" | "vocab" | "idiom";
  unit_index: number; // 1-based
  speaker?: "A" | "B";
  char_count: number;
};

// ─── Per-language extractors ──────────────────────────────────────────────

type Lesson = Record<string, unknown>;

function asText(x: unknown): string {
  return typeof x === "string" ? x.trim() : "";
}

function extractFrenchOrGerman(lang: LangKey, lesson: Lesson, lessonIndex: number): ManifestEntry[] {
  const out: ManifestEntry[] = [];
  const lessonId = lesson.id as string;
  const slug = lessonStorageSlug(lang, lessonId);
  const langCode = LANG_CODES[lang];
  const dialogueVoices = pickTwoVoices(`${langCode}/${slug}`);

  const sentences = (lesson.sentences as Array<{ en?: string }>) ?? [];
  sentences.forEach((s, i) => {
    const text = asText(s.en);
    if (!text) return;
    const key = `b2/${langCode}/${slug}/sentence_${i + 1}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: pickVoice(key),
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "sentence",
      unit_index: i + 1,
      char_count: text.length,
    });
  });

  const dialogue = (lesson.dialogue as Array<{ text?: string; speaker?: string }>) ?? [];
  dialogue.forEach((d, i) => {
    const text = asText(d.text);
    if (!text) return;
    const speakerLetter: "A" | "B" =
      (d.speaker ?? "").trim().toUpperCase().startsWith("B") ? "B" : "A";
    const key = `b2/${langCode}/${slug}/dialogue_short_${i + 1}_${speakerLetter}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: speakerLetter === "A" ? dialogueVoices[0] : dialogueVoices[1],
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "dialogue_short",
      unit_index: i + 1,
      speaker: speakerLetter,
      char_count: text.length,
    });
  });

  const dialogueLong = (lesson.dialogue_long as Array<{ text?: string; speaker?: string }>) ?? [];
  dialogueLong.forEach((d, i) => {
    const text = asText(d.text);
    if (!text) return;
    // Heuristic: alternate A/B by index since speaker labels in dialogue_long
    // are role names (Linh, Mme Laurent, etc.) not "A"/"B". Even index = A, odd = B.
    const speakerLetter: "A" | "B" = i % 2 === 0 ? "A" : "B";
    const key = `b2/${langCode}/${slug}/dialogue_long_${i + 1}_${speakerLetter}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: speakerLetter === "A" ? dialogueVoices[0] : dialogueVoices[1],
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "dialogue_long",
      unit_index: i + 1,
      speaker: speakerLetter,
      char_count: text.length,
    });
  });

  const vocab = (lesson.vocabulary as Array<{ word?: string }>) ?? [];
  vocab.forEach((v, i) => {
    const text = asText(v.word);
    if (!text) return;
    const key = `b2/${langCode}/${slug}/vocab_${i + 1}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: pickVoice(key),
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "vocab",
      unit_index: i + 1,
      char_count: text.length,
    });
  });

  const idioms = (lesson.idiom_glosses as Array<{ example?: string }>) ?? [];
  idioms.forEach((id, i) => {
    const text = asText(id.example);
    if (!text) return;
    const key = `b2/${langCode}/${slug}/idiom_${i + 1}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: pickVoice(key),
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "idiom",
      unit_index: i + 1,
      char_count: text.length,
    });
  });

  return out;
}

function extractAsianLang(
  lang: LangKey,
  lesson: Lesson,
  lessonIndex: number,
  textField: { sentence: string; dialogue: string; vocab: string; vocabKey: "vocabulary" | "vocab" },
): ManifestEntry[] {
  const out: ManifestEntry[] = [];
  const lessonId = lesson.id as number;
  const slug = lessonStorageSlug(lang, lessonId);
  const langCode = LANG_CODES[lang];
  const dialogueVoices = pickTwoVoices(`${langCode}/${slug}`);

  // Older lessons use 'examples' instead of 'sentences' (Japanese 46-50)
  const sentencesArr =
    (lesson.sentences as Array<Record<string, unknown>>) ??
    (lesson.examples as Array<Record<string, unknown>>) ??
    [];
  sentencesArr.forEach((s, i) => {
    const text = asText(s[textField.sentence]);
    if (!text) return;
    const key = `b2/${langCode}/${slug}/sentence_${i + 1}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: pickVoice(key),
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "sentence",
      unit_index: i + 1,
      char_count: text.length,
    });
  });

  const dialogue = (lesson.dialogue as Array<Record<string, unknown>>) ?? [];
  dialogue.forEach((d, i) => {
    const text = asText(d[textField.dialogue]);
    if (!text) return;
    const speakerRaw = asText(d.speaker as string).toUpperCase();
    const speakerLetter: "A" | "B" = speakerRaw.startsWith("B") ? "B" : "A";
    const key = `b2/${langCode}/${slug}/dialogue_short_${i + 1}_${speakerLetter}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: speakerLetter === "A" ? dialogueVoices[0] : dialogueVoices[1],
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "dialogue_short",
      unit_index: i + 1,
      speaker: speakerLetter,
      char_count: text.length,
    });
  });

  const dialogueLong = (lesson.dialogue_long as Array<Record<string, unknown>>) ?? [];
  dialogueLong.forEach((d, i) => {
    const text = asText(d[textField.dialogue]);
    if (!text) return;
    const speakerLetter: "A" | "B" = i % 2 === 0 ? "A" : "B";
    const key = `b2/${langCode}/${slug}/dialogue_long_${i + 1}_${speakerLetter}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: speakerLetter === "A" ? dialogueVoices[0] : dialogueVoices[1],
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "dialogue_long",
      unit_index: i + 1,
      speaker: speakerLetter,
      char_count: text.length,
    });
  });

  const vocabArr = (lesson[textField.vocabKey] as Array<Record<string, unknown>>) ?? [];
  vocabArr.forEach((v, i) => {
    const text = asText(v[textField.vocab]);
    if (!text) return;
    const key = `b2/${langCode}/${slug}/vocab_${i + 1}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: pickVoice(key),
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "vocab",
      unit_index: i + 1,
      char_count: text.length,
    });
  });

  const idioms = (lesson.idiom_glosses as Array<Record<string, unknown>>) ?? [];
  idioms.forEach((id, i) => {
    const text = asText(id.example);
    if (!text) return;
    const key = `b2/${langCode}/${slug}/idiom_${i + 1}.mp3`;
    out.push({
      storage_key: key,
      text,
      voice_id: pickVoice(key),
      language: langCode,
      lesson_id: lessonId,
      lesson_index: lessonIndex,
      unit_kind: "idiom",
      unit_index: i + 1,
      char_count: text.length,
    });
  });

  return out;
}

// ─── Load lessons modules ─────────────────────────────────────────────────

async function loadLessons(lang: LangKey): Promise<Lesson[]> {
  const path = resolve(`src/languages/${lang}/lessons.ts`);
  const url = pathToFileURL(path).href;
  const mod = await import(url);
  // Conventions vary; gather all exports and concat the lesson arrays.
  const candidates = [
    mod.lessons,
    mod.LESSONS,
    mod.default,
    mod[`${lang.toUpperCase()}_LESSONS`],
    mod[`FRENCH_LESSONS`],
    mod[`GERMAN_LESSONS`],
    mod[`JAPANESE_LESSONS`],
    mod[`KOREAN_LESSONS`],
    mod[`CHINESE_LESSONS`],
  ];
  const arr = candidates.find((c) => Array.isArray(c)) as Lesson[] | undefined;
  if (!arr) throw new Error(`No lessons array found in ${lang}/lessons.ts`);
  return arr;
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const allEntries: ManifestEntry[] = [];
  const perLangCounts: Record<string, { lessons: number; clips: number; chars: number }> = {};

  for (const lang of Object.keys(LANG_CODES) as LangKey[]) {
    const lessons = await loadLessons(lang);
    const b2Lessons = lessons.filter((l) => (l.level as string) === "B2");
    let clips = 0;
    let chars = 0;
    b2Lessons.forEach((lesson, idx) => {
      let entries: ManifestEntry[] = [];
      if (lang === "french" || lang === "german") {
        entries = extractFrenchOrGerman(lang, lesson, idx);
      } else if (lang === "japanese") {
        entries = extractAsianLang(lang, lesson, idx, {
          sentence: "japanese",
          dialogue: "japanese",
          vocab: "japanese",
          vocabKey: "vocabulary",
        });
      } else if (lang === "korean") {
        entries = extractAsianLang(lang, lesson, idx, {
          sentence: "korean",
          dialogue: "hangul",
          vocab: "hangul",
          vocabKey: "vocabulary",
        });
      } else if (lang === "chinese") {
        entries = extractAsianLang(lang, lesson, idx, {
          sentence: "chinese",
          dialogue: "chinese",
          vocab: "chinese",
          vocabKey: "vocab",
        });
      }
      allEntries.push(...entries);
      clips += entries.length;
      chars += entries.reduce((a, e) => a + e.char_count, 0);
    });
    perLangCounts[LANG_CODES[lang]] = { lessons: b2Lessons.length, clips, chars };
  }

  // Per-unit-kind summary
  const perKind: Record<string, { count: number; chars: number }> = {};
  for (const e of allEntries) {
    const k = perKind[e.unit_kind] ?? { count: 0, chars: 0 };
    k.count++;
    k.chars += e.char_count;
    perKind[e.unit_kind] = k;
  }

  const totalClips = allEntries.length;
  const totalChars = allEntries.reduce((a, e) => a + e.char_count, 0);

  const summary = {
    generated_at: new Date().toISOString(),
    voices: VOICE_IDS,
    model_id: "eleven_multilingual_v2",
    bucket: "room-audio",
    totals: { total_clips: totalClips, total_chars: totalChars },
    per_language: perLangCounts,
    per_unit_kind: perKind,
  };

  const out = { summary, entries: allEntries };
  writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), "utf8");

  // Print summary to stdout
  console.log("[manifest] written to", OUTPUT_PATH);
  console.log("[manifest] total clips:", totalClips);
  console.log("[manifest] total chars:", totalChars);
  console.log("[manifest] per language:");
  for (const [code, c] of Object.entries(perLangCounts)) {
    console.log(`  ${code}: lessons=${c.lessons}, clips=${c.clips}, chars=${c.chars}`);
  }
  console.log("[manifest] per unit kind:");
  for (const [kind, c] of Object.entries(perKind)) {
    console.log(`  ${kind}: count=${c.count}, chars=${c.chars}`);
  }
}

main().catch((err) => {
  console.error("[manifest] failed:", err);
  process.exit(1);
});
