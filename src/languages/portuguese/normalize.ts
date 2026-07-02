// src/languages/portuguese/normalize.ts
//
// Converts a Brazilian Portuguese lesson → NormalizedLesson for the shared
// <LessonRenderer>. Mirrors the French / Italian normalizers so the renderer
// stays field-name-pure and never reads a per-language alias.
//
// Like the Italian pack, the input shape is permissive: it covers the union of
// the fields a lesson file may carry and reads defensively. The Brazilian
// Portuguese target text lives in `s.pt`; for parity with the older packs that
// reused the legacy `s.en` slot for native content, we fall back to `s.en` when
// `s.pt` is absent (in that case there is no separate English gloss).
//
// Portuguese-specific concern: accents and nasal vowels. PT-BR uses the acute
// (á é í ó ú), grave (à), circumflex (â ê ô), tilde/nasal (ã õ, plus the nasal
// diphthongs ão ãe õe), diaeresis (legacy ü), and the cedilha (ç). These are
// phonemic, so lesson CONTENT must preserve them verbatim — the normalizer never
// strips them from displayed text. `foldPortugueseDiacritics` is exported only
// for accent-/nasal-insensitive *answer comparison* (lenient exercise grading),
// where "está"/"esta" or "não"/"nao" should be accepted as the same input.

import type {
  CefrLevel,
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";

type NormalizeUnknownRecord = Record<string, unknown>;

const normalizeStringOrUndefined = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const normalizeString = (value: unknown): string =>
  typeof value === "string" ? value : "";

// ── Permissive input shape ──────────────────────────────────────────────
// Only the fields the renderer consumes are typed; per-file extras (e.g.
// `category`) are accepted structurally and ignored.

type PortugueseSentenceInput = {
  /** Brazilian Portuguese target text. */
  pt?: string;
  /** Legacy slot: native text when `pt` is absent; otherwise the English gloss. */
  en?: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
};

type PortugueseVocabInput = {
  word: string;
  en: string;
  vi: string;
  pos?: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type PortugueseDialogueInput = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type PortugueseIdiomGlossInput = {
  idiom: string;
  literal: string;
  literal_en?: string;
  meaning: string;
  meaning_en?: string;
  example: string;
  example_en?: string;
};

export type PortugueseLessonInput = {
  id: string;
  level: CefrLevel;
  title_vi: string;
  title_en: string;
  sentences?: PortugueseSentenceInput[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  vocabulary?: PortugueseVocabInput[];
  dialogue?: PortugueseDialogueInput[];
  exercises?: Array<Record<string, unknown>>;
  dialogue_long?: PortugueseDialogueInput[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_en?: string;
  idiom_glosses?: PortugueseIdiomGlossInput[];
};

// ── Accent + nasal-vowel handling ───────────────────────────────────────
// Maps every accented Brazilian Portuguese letter (acute, grave, circumflex,
// tilde/nasal, diaeresis, cedilha) to its base letter. The nasal vowels ã and õ
// — and therefore the nasal diphthongs ão / ãe / õe, which are just these
// letters in sequence — fold to plain a / o. This is for LENIENT COMPARISON
// only; never run displayed lesson content through it (nasalization is phonemic
// in Portuguese and dropping it changes meaning, e.g. "pão" bread vs "pau" stick).
const PT_DIACRITIC_MAP: Record<string, string> = {
  á: "a", à: "a", â: "a", ã: "a", ä: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", õ: "o", ö: "o",
  ú: "u", ù: "u", û: "u", ü: "u",
  ç: "c",
  Á: "A", À: "A", Â: "A", Ã: "A", Ä: "A",
  É: "E", È: "E", Ê: "E", Ë: "E",
  Í: "I", Ì: "I", Î: "I", Ï: "I",
  Ó: "O", Ò: "O", Ô: "O", Õ: "O", Ö: "O",
  Ú: "U", Ù: "U", Û: "U", Ü: "U",
  Ç: "C",
};

/**
 * Fold Brazilian Portuguese accents and nasal vowels to their base letters.
 * Use for accent-/nasal-insensitive answer comparison only — NOT for display.
 * "Não está." → "Nao esta." ; "coração" → "coracao".
 */
export function foldPortugueseDiacritics(input: string): string {
  let out = "";
  for (const ch of input) out += PT_DIACRITIC_MAP[ch] ?? ch;
  return out;
}

/**
 * Compare two Portuguese strings ignoring accents, nasal marks, case, and
 * surrounding whitespace — the lenient bar used when grading typed answers so a
 * learner who omits a tilde or cedilha isn't marked wrong on a typo.
 */
export function portugueseAnswersMatch(a: string, b: string): boolean {
  const norm = (s: string) =>
    foldPortugueseDiacritics(s).toLowerCase().trim().replace(/\s+/g, " ");
  return norm(a) === norm(b);
}

// Stable hash for Portuguese string ids ("portuguese_saudacoes_intro" etc.) so
// the React key is deterministic without callers passing an explicit numeric id.
// Mirrors the French / Italian normalizers byte-for-byte. Caller may override
// via the second arg.
function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizePortugueseLesson(
  lesson: PortugueseLessonInput,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    sentences: (lesson.sentences ?? []).map((s) => {
      // Native text in `s.pt`, English gloss in `s.en`. Legacy fallback: when
      // `s.pt` is absent the native text reused `s.en` (no separate gloss).
      const native = s.pt ?? s.en ?? "";
      const en = s.pt ? s.en : undefined;
      return {
        native,
        en,
        vi: s.vi,
        pronunciationFocus: s.pronunciation_focus,
        pronunciationFocusEn: s.pronunciation_focus_en,
      };
    }),
    vocabulary: lesson.vocabulary?.map((v) => ({
      native: normalizeString(v.word),
      en: v.en,
      vi: v.vi,
      phonetic: v.pronunciation_vi,
      phoneticEn: v.pronunciation_en,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: normalizeString(d.text),
      en: d.en,
      vi: d.vi,
    })),
    exercises: normalizePortugueseExercises(lesson.exercises),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
    registerNotesVi: lesson.register_notes,
    registerNotesEn: lesson.register_notes_en,
    roleplayPromptsVi: lesson.roleplay_prompts,
    roleplayPromptsEn: lesson.roleplay_prompts_en,
    idiomGlosses: lesson.idiom_glosses?.map((g) => ({
      idiom: g.idiom,
      literal: g.literal,
      meaning: g.meaning,
      example: normalizeStringOrUndefined(g.example),
      literalEn: g.literal_en,
      meaningEn: g.meaning_en,
      exampleEn: g.example_en,
    })),
    dialogueLong: lesson.dialogue_long?.map((d) => ({
      speaker: d.speaker,
      native: normalizeString(d.text),
      en: d.en,
      vi: d.vi,
    })),
    // audioBase intentionally omitted: lessonAudioBase() (src/lib/lessonAudio.ts)
    // has no "pt" lang code yet, and wiring Portuguese into the audio manifest is
    // out of scope here. NormalizedLesson.audioBase is optional — the renderer
    // shows no audio buttons until the Portuguese audio bundle ships.
  };
}

function normalizePortugueseExercises(
  exercises: PortugueseLessonInput["exercises"],
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;
  const out: NormalizedExercise[] = [];
  for (const ex of exercises) {
    // Tolerate both "fill_blank" (underscore) and "fill-blank" (hyphen).
    const kind = String(ex.type ?? "").replace("_", "-");

    // Nested shape: { type, instruction_vi, instruction_en, items: [{prompt, answer, options?}] }
    if (Array.isArray(ex.items)) {
      if (kind === "matching") {
        out.push({
          kind: "matching",
          instruction: normalizeStringOrUndefined(ex.instruction_vi),
          instructionEn: normalizeStringOrUndefined(ex.instruction_en),
          pairs: (ex.items as NormalizeUnknownRecord[]).map((it) => ({
            a: String(it.prompt ?? ""),
            b: String(it.answer ?? ""),
          })),
        });
      } else if (kind === "fill-blank") {
        // Each nested item is its own self-contained prompt/answer.
        for (const it of ex.items) {
          out.push({
            kind: "fill-blank",
            question: String(it.prompt ?? ""),
            answer: String(it.answer ?? ""),
          });
        }
      } else if (kind === "translation") {
        for (const it of ex.items) {
          out.push({
            kind: "translation",
            vi: String(it.prompt ?? ""),
            native: String(it.answer ?? ""),
          });
        }
      }
      continue;
    }

    // Flat shape.
    if (kind === "fill-blank") {
      out.push({
        kind: "fill-blank",
        question: String(ex.question ?? ""),
        answer: String(ex.answer ?? ""),
        hint: normalizeStringOrUndefined(ex.hint_vi),
        hintEn: normalizeStringOrUndefined(ex.hint_en),
      });
    } else if (kind === "matching") {
      // Flat-shape pairs are tuples: [["pt", "vi"], ...].
      const raw: unknown[] = Array.isArray(ex.pairs) ? ex.pairs : [];
      out.push({
        kind: "matching",
        instruction: normalizeStringOrUndefined(ex.instruction ?? ex.instruction_vi),
        instructionEn: normalizeStringOrUndefined(ex.instruction_en),
        pairs: (raw as NormalizeUnknownRecord[]).map((p) =>
          Array.isArray(p)
            ? { a: String(p[0] ?? ""), b: String(p[1] ?? "") }
            : {
                a: String(p.a ?? p.prompt ?? p.portuguese ?? p.pt ?? ""),
                b: String(p.b ?? p.answer ?? p.vi ?? ""),
              },
        ),
      });
    } else if (kind === "translation") {
      out.push({
        kind: "translation",
        vi: String(ex.vietnamese ?? ""),
        en: normalizeStringOrUndefined(ex.english),
        native: String(ex.portuguese ?? ex.pt ?? ""),
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
