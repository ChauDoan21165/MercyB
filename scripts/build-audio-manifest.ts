/**
 * Build the lesson audio generation manifest for ALL levels (A1, A2, B1, B2).
 * DRY-RUN — does NOT call ElevenLabs or upload to Supabase. Walks all 5
 * lessons.ts files, finds every lesson at A1/A2/B1/B2, and emits one manifest
 * entry per spoken text unit.
 *
 * Output: ./audio-manifest.json (gitignored). Filename preserved from the
 * earlier B2-only builder so the existing generate-b2-audio.ts reads the
 * same file.
 *
 * Run:
 *   npx tsx scripts/build-audio-manifest.ts
 *
 * Storage key prefix is derived from `lesson.level.toLowerCase()`:
 *   a1/<lang>/<slug>/...
 *   a2/<lang>/<slug>/...
 *   b1/<lang>/<slug>/...
 *   b2/<lang>/<slug>/...
 *
 * Phonics-skip filter:
 *   Skip clips whose text is a pure-phonics string (hiragana, katakana, or
 *   Korean jamo — including compatibility jamo). Hangul syllable blocks
 *   (가나다) are kept; CJK Unified ideographs (一, 二, 我) are kept.
 *   Rationale: pure phonics (single あ, ㅏ, etc.) sound poor through TTS and
 *   the local kids/* phonics audio bundle covers them already.
 *
 * Schema mapping per language (recon-confirmed across A1/A2/B1/B2):
 *
 *   French  / German   — sentences[].en (holds native text by historical convention)
 *                        dialogue[].text, dialogue_long[].text (B2 only)
 *                        vocabulary[].word, idiom_glosses[].example (B2 only)
 *                        IDs are STRING (e.g., "french_b2_salary_negotiation",
 *                        "french_a1_greetings_intro").
 *                        Storage slug = id with "<lang>_<level>_" or
 *                        "<lang>_fluency_" prefix stripped.
 *                        French/German A1 has 5 lessons that are sentences-only
 *                        (no dialogue, no vocabulary) — Array.isArray guards
 *                        below handle this.
 *
 *   Japanese           — sentences[].japanese OR examples[].japanese
 *                        (older lessons including all A1/A2/B1 use 'examples')
 *                        dialogue[].japanese, dialogue_long[].japanese (when present)
 *                        vocabulary[].japanese, idiom_glosses[].example (B2 only)
 *                        IDs are NUMERIC.
 *
 *   Korean             — sentences[].korean
 *                        dialogue[].hangul, dialogue_long[].hangul (when present)
 *                        vocabulary[].hangul, idiom_glosses[].example (B2 only)
 *                        IDs are NUMERIC.
 *                        A1 has 110 jamo-only vocab entries (ㅏ ㅑ ㄱ ㄴ...) —
 *                        the phonics-skip filter below removes these.
 *
 *   Chinese            — sentences[].chinese
 *                        dialogue[].chinese, dialogue_long[].chinese (when present)
 *                        vocab[].chinese (note: 'vocab' not 'vocabulary')
 *                        idiom_glosses[].example (B2 only)
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

const LEVELS_TO_BUILD = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type Level = (typeof LEVELS_TO_BUILD)[number];

const OUTPUT_PATH = resolve("audio-manifest.json");

// ─── Phonics-skip filter ─────────────────────────────────────────────────
//
// Skip clips whose text is a SINGLE phonics character — Japanese hiragana,
// Japanese katakana, or Korean jamo (compatibility or modern). These are
// alphabet/phonics characters that synthesize poorly through TTS in isolation
// (the local kids/* audio bundle covers them already).
//
// Length-1 gate is critical: real Japanese loanwords and short words are
// often written entirely in kana (カメラ "camera", えいご "English",
// こんにちは "hello"). Those are real words, NOT phonics — keep them.
// Hanzi (一, 二, 我) and Hangul syllable blocks (가, 나, 다) are kept too —
// those are real words/syllables, not phonics, regardless of length.
//
// Ranges:
//   U+3040–U+309F  Hiragana
//   U+30A0–U+30FF  Katakana
//   U+3130–U+318F  Hangul Compatibility Jamo (ㄱ ㄴ ㅏ ㅑ — what shows up in data)
//   U+1100–U+11FF  Hangul Jamo (modern initial/medial/final)

const SINGLE_PHONICS_CHAR_REGEX = /^[぀-ゟ゠-ヿ㄰-㆏ᄀ-ᇿ]$/;

function isPhonicsOnly(text: string): boolean {
  // Only skip single-codepoint phonics characters.
  // Multi-character kana strings (real words) are kept.
  return text.length === 1 && SINGLE_PHONICS_CHAR_REGEX.test(text);
}

// Track skipped clips for the dry-run report
type SkipReason = "phonics" | "empty";
const skippedLog: Array<{
  reason: SkipReason;
  language: string;
  level: string;
  lesson_id: string | number;
  unit_kind: string;
  text: string;
}> = [];

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

function lessonStorageSlug(lang: LangKey, lessonId: string | number, level: Level): string {
  if (typeof lessonId === "number") return `l${lessonId}`;
  // String IDs:
  //   "french_b2_salary_negotiation"  → "lsalary_negotiation"
  //   "french_b1_renting_apartment"   → "lrenting_apartment"
  //   "french_a1_greetings_intro"     → "lgreetings_intro"
  //   "french_fluency_conditional"    → "lconditional"
  //   "french_greetings_intro"        → "lgreetings_intro" (no level token)
  let s = lessonId;
  s = s.replace(new RegExp(`^${lang}_${level.toLowerCase()}_`), "");
  s = s.replace(new RegExp(`^${lang}_fluency_`), "");
  s = s.replace(new RegExp(`^${lang}_`), "");
  return `l${s}`;
}

// ─── Manifest entry shape ─────────────────────────────────────────────────

type ManifestEntry = {
  storage_key: string; // e.g., a1/fr/lgreetings_intro/sentence_1.mp3
  text: string;
  voice_id: string;
  language: string; // ISO short code
  level: string; // CEFR level (A1, A2, B1, B2)
  lesson_id: string | number; // raw id from source data
  lesson_index: number; // ordinal among lessons-of-this-level in the file (0-based)
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

/**
 * Push a manifest entry, applying phonics + empty-text filters.
 * Returns true if pushed, false if skipped.
 */
function pushEntry(
  out: ManifestEntry[],
  entry: ManifestEntry,
  language: string,
  level: Level,
): boolean {
  if (!entry.text) {
    skippedLog.push({
      reason: "empty",
      language,
      level,
      lesson_id: entry.lesson_id,
      unit_kind: entry.unit_kind,
      text: "",
    });
    return false;
  }
  if (isPhonicsOnly(entry.text)) {
    skippedLog.push({
      reason: "phonics",
      language,
      level,
      lesson_id: entry.lesson_id,
      unit_kind: entry.unit_kind,
      text: entry.text,
    });
    return false;
  }
  out.push(entry);
  return true;
}

function extractFrenchOrGerman(
  lang: LangKey,
  lesson: Lesson,
  lessonIndex: number,
  level: Level,
): ManifestEntry[] {
  const out: ManifestEntry[] = [];
  const lessonId = lesson.id as string;
  const slug = lessonStorageSlug(lang, lessonId, level);
  const langCode = LANG_CODES[lang];
  const levelPrefix = level.toLowerCase();
  const dialogueVoices = pickTwoVoices(`${langCode}/${slug}`);

  const sentences = (lesson.sentences as Array<{ en?: string }>) ?? [];
  sentences.forEach((s, i) => {
    const text = asText(s.en);
    const key = `${levelPrefix}/${langCode}/${slug}/sentence_${i + 1}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: pickVoice(key),
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "sentence",
        unit_index: i + 1,
        char_count: text.length,
      },
      langCode,
      level,
    );
  });

  const dialogue = (lesson.dialogue as Array<{ text?: string; speaker?: string }>) ?? [];
  dialogue.forEach((d, i) => {
    const text = asText(d.text);
    const speakerLetter: "A" | "B" =
      (d.speaker ?? "").trim().toUpperCase().startsWith("B") ? "B" : "A";
    const key = `${levelPrefix}/${langCode}/${slug}/dialogue_short_${i + 1}_${speakerLetter}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: speakerLetter === "A" ? dialogueVoices[0] : dialogueVoices[1],
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "dialogue_short",
        unit_index: i + 1,
        speaker: speakerLetter,
        char_count: text.length,
      },
      langCode,
      level,
    );
  });

  const dialogueLong = (lesson.dialogue_long as Array<{ text?: string; speaker?: string }>) ?? [];
  dialogueLong.forEach((d, i) => {
    const text = asText(d.text);
    // Heuristic: alternate A/B by index since speaker labels in dialogue_long
    // are role names (Linh, Mme Laurent, etc.) not "A"/"B". Even index = A, odd = B.
    const speakerLetter: "A" | "B" = i % 2 === 0 ? "A" : "B";
    const key = `${levelPrefix}/${langCode}/${slug}/dialogue_long_${i + 1}_${speakerLetter}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: speakerLetter === "A" ? dialogueVoices[0] : dialogueVoices[1],
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "dialogue_long",
        unit_index: i + 1,
        speaker: speakerLetter,
        char_count: text.length,
      },
      langCode,
      level,
    );
  });

  const vocab = (lesson.vocabulary as Array<{ word?: string }>) ?? [];
  vocab.forEach((v, i) => {
    const text = asText(v.word);
    const key = `${levelPrefix}/${langCode}/${slug}/vocab_${i + 1}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: pickVoice(key),
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "vocab",
        unit_index: i + 1,
        char_count: text.length,
      },
      langCode,
      level,
    );
  });

  const idioms = (lesson.idiom_glosses as Array<{ example?: string }>) ?? [];
  idioms.forEach((idiom, i) => {
    const text = asText(idiom.example);
    const key = `${levelPrefix}/${langCode}/${slug}/idiom_${i + 1}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: pickVoice(key),
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "idiom",
        unit_index: i + 1,
        char_count: text.length,
      },
      langCode,
      level,
    );
  });

  return out;
}

function extractAsianLang(
  lang: LangKey,
  lesson: Lesson,
  lessonIndex: number,
  level: Level,
  textField: { sentence: string; dialogue: string; vocab: string; vocabKey: "vocabulary" | "vocab" },
): ManifestEntry[] {
  const out: ManifestEntry[] = [];
  const lessonId = lesson.id as number;
  const slug = lessonStorageSlug(lang, lessonId, level);
  const langCode = LANG_CODES[lang];
  const levelPrefix = level.toLowerCase();
  const dialogueVoices = pickTwoVoices(`${langCode}/${slug}`);

  // Older / lower-level Japanese lessons use 'examples' instead of 'sentences'.
  const sentencesArr =
    (lesson.sentences as Array<Record<string, unknown>>) ??
    (lesson.examples as Array<Record<string, unknown>>) ??
    [];
  sentencesArr.forEach((s, i) => {
    const text = asText(s[textField.sentence]);
    const key = `${levelPrefix}/${langCode}/${slug}/sentence_${i + 1}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: pickVoice(key),
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "sentence",
        unit_index: i + 1,
        char_count: text.length,
      },
      langCode,
      level,
    );
  });

  const dialogue = (lesson.dialogue as Array<Record<string, unknown>>) ?? [];
  dialogue.forEach((d, i) => {
    const text = asText(d[textField.dialogue]);
    const speakerRaw = asText(d.speaker as string).toUpperCase();
    const speakerLetter: "A" | "B" = speakerRaw.startsWith("B") ? "B" : "A";
    const key = `${levelPrefix}/${langCode}/${slug}/dialogue_short_${i + 1}_${speakerLetter}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: speakerLetter === "A" ? dialogueVoices[0] : dialogueVoices[1],
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "dialogue_short",
        unit_index: i + 1,
        speaker: speakerLetter,
        char_count: text.length,
      },
      langCode,
      level,
    );
  });

  const dialogueLong = (lesson.dialogue_long as Array<Record<string, unknown>>) ?? [];
  dialogueLong.forEach((d, i) => {
    const text = asText(d[textField.dialogue]);
    const speakerLetter: "A" | "B" = i % 2 === 0 ? "A" : "B";
    const key = `${levelPrefix}/${langCode}/${slug}/dialogue_long_${i + 1}_${speakerLetter}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: speakerLetter === "A" ? dialogueVoices[0] : dialogueVoices[1],
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "dialogue_long",
        unit_index: i + 1,
        speaker: speakerLetter,
        char_count: text.length,
      },
      langCode,
      level,
    );
  });

  const vocabArr = (lesson[textField.vocabKey] as Array<Record<string, unknown>>) ?? [];
  vocabArr.forEach((v, i) => {
    const text = asText(v[textField.vocab]);
    const key = `${levelPrefix}/${langCode}/${slug}/vocab_${i + 1}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: pickVoice(key),
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "vocab",
        unit_index: i + 1,
        char_count: text.length,
      },
      langCode,
      level,
    );
  });

  const idioms = (lesson.idiom_glosses as Array<Record<string, unknown>>) ?? [];
  idioms.forEach((idiom, i) => {
    const text = asText(idiom.example);
    const key = `${levelPrefix}/${langCode}/${slug}/idiom_${i + 1}.mp3`;
    pushEntry(
      out,
      {
        storage_key: key,
        text,
        voice_id: pickVoice(key),
        language: langCode,
        level,
        lesson_id: lessonId,
        lesson_index: lessonIndex,
        unit_kind: "idiom",
        unit_index: i + 1,
        char_count: text.length,
      },
      langCode,
      level,
    );
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
  const perLangLevelCounts: Record<
    string,
    Record<string, { lessons: number; clips: number; chars: number }>
  > = {};

  for (const lang of Object.keys(LANG_CODES) as LangKey[]) {
    const lessons = await loadLessons(lang);
    const langCode = LANG_CODES[lang];
    perLangLevelCounts[langCode] = {};

    for (const level of LEVELS_TO_BUILD) {
      const lessonsAtLevel = lessons.filter((l) => (l.level as string) === level);
      let clips = 0;
      let chars = 0;
      lessonsAtLevel.forEach((lesson, idx) => {
        let entries: ManifestEntry[] = [];
        if (lang === "french" || lang === "german") {
          entries = extractFrenchOrGerman(lang, lesson, idx, level);
        } else if (lang === "japanese") {
          entries = extractAsianLang(lang, lesson, idx, level, {
            sentence: "japanese",
            dialogue: "japanese",
            vocab: "japanese",
            vocabKey: "vocabulary",
          });
        } else if (lang === "korean") {
          entries = extractAsianLang(lang, lesson, idx, level, {
            sentence: "korean",
            dialogue: "hangul",
            vocab: "hangul",
            vocabKey: "vocabulary",
          });
        } else if (lang === "chinese") {
          entries = extractAsianLang(lang, lesson, idx, level, {
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
      perLangLevelCounts[langCode][level] = { lessons: lessonsAtLevel.length, clips, chars };
    }
  }

  // Per-unit-kind summary
  const perKind: Record<string, { count: number; chars: number }> = {};
  for (const e of allEntries) {
    const k = perKind[e.unit_kind] ?? { count: 0, chars: 0 };
    k.count++;
    k.chars += e.char_count;
    perKind[e.unit_kind] = k;
  }

  // Per-level totals
  const perLevel: Record<string, { clips: number; chars: number }> = {};
  for (const e of allEntries) {
    const l = perLevel[e.level] ?? { clips: 0, chars: 0 };
    l.clips++;
    l.chars += e.char_count;
    perLevel[e.level] = l;
  }

  const totalClips = allEntries.length;
  const totalChars = allEntries.reduce((a, e) => a + e.char_count, 0);

  // Skip summary
  const phonicsSkipped = skippedLog.filter((s) => s.reason === "phonics");
  const emptySkipped = skippedLog.filter((s) => s.reason === "empty");
  const phonicsByLang: Record<string, number> = {};
  for (const s of phonicsSkipped) phonicsByLang[s.language] = (phonicsByLang[s.language] ?? 0) + 1;

  const summary = {
    generated_at: new Date().toISOString(),
    voices: VOICE_IDS,
    model_id: "eleven_multilingual_v2",
    bucket: "room-audio",
    levels_built: LEVELS_TO_BUILD,
    totals: { total_clips: totalClips, total_chars: totalChars },
    per_level: perLevel,
    per_language_level: perLangLevelCounts,
    per_unit_kind: perKind,
    skipped: {
      phonics: phonicsSkipped.length,
      empty: emptySkipped.length,
      phonics_by_language: phonicsByLang,
      phonics_samples: phonicsSkipped.slice(0, 10),
    },
  };

  const out = { summary, entries: allEntries };
  writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), "utf8");

  // Print summary to stdout
  console.log("[manifest] written to", OUTPUT_PATH);
  console.log("[manifest] total clips:", totalClips);
  console.log("[manifest] total chars:", totalChars);
  console.log("[manifest] per level:");
  for (const [lvl, c] of Object.entries(perLevel)) {
    console.log(`  ${lvl}: clips=${c.clips}, chars=${c.chars}`);
  }
  console.log("[manifest] per unit kind:");
  for (const [kind, c] of Object.entries(perKind)) {
    console.log(`  ${kind}: count=${c.count}, chars=${c.chars}`);
  }
  console.log("[manifest] skipped:");
  console.log(`  phonics: ${phonicsSkipped.length} (by lang: ${JSON.stringify(phonicsByLang)})`);
  console.log(`  empty:   ${emptySkipped.length}`);
}

main().catch((err) => {
  console.error("[manifest] failed:", err);
  process.exit(1);
});
