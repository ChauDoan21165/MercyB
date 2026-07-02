// src/languages/indonesian/normalize.ts
//
// Converts an Indonesian (Bahasa Indonesia) lesson → NormalizedLesson for the
// shared <LessonRenderer>. Mirrors the Portuguese / French / Italian normalizers
// so the renderer stays field-name-pure and never reads a per-language alias.
//
// Like the other packs, the input shape is permissive: it covers the union of
// the fields a lesson file may carry and reads defensively. The Indonesian target
// text lives in `s.id` (the ISO-639 code, matching how the Portuguese pack used
// `s.pt`); for parity with packs that reuse the legacy `s.en` slot for native
// content we fall back to `s.indo`, then `s.en`, when `s.id` is absent (in that
// last case there is no separate English gloss).
//
// Indonesian-specific concern: Bahasa Indonesia uses the plain Latin alphabet
// with essentially no diacritics in modern spelling — there are no tones, no
// accents, no cedillas (the rare `é`/`è`/`ê` only turn up in loanwords and older
// orthography). So unlike Portuguese, display text needs no diacritic protection.
// The real normalization problem here is REGISTER: colloquial / bahasa-gaul forms
// (gak, nggak, gue, lu, udah, …) versus the standard written forms (tidak, saya,
// kamu, sudah, …). `foldIndonesianInformal` maps the common colloquial spellings
// to their standard equivalents, and is used for LENIENT answer comparison only —
// it never rewrites displayed lesson content (a lesson that teaches slang must
// show the slang verbatim). `foldIndonesianDiacritics` strips the rare accented
// vowels, again for comparison only.

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

type IndonesianSentenceInput = {
  /** Indonesian target text (preferred slot). */
  id?: string;
  /** Alternative native slot used by some authoring waves. */
  indo?: string;
  /** Legacy slot: native text when `id`/`indo` are absent; else English gloss. */
  en?: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
};

type IndonesianVocabInput = {
  word: string;
  en: string;
  vi: string;
  pos?: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueInput = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianIdiomGlossInput = {
  idiom: string;
  literal: string;
  literal_en?: string;
  meaning: string;
  meaning_en?: string;
  example: string;
  example_en?: string;
};

export type IndonesianLessonInput = {
  id: string;
  level: CefrLevel;
  title_vi: string;
  title_en: string;
  sentences?: IndonesianSentenceInput[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabInput[];
  dialogue?: IndonesianDialogueInput[];
  exercises?: Array<Record<string, unknown>>;
  dialogue_long?: IndonesianDialogueInput[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_en?: string;
  idiom_glosses?: IndonesianIdiomGlossInput[];
};

// ── Diacritic handling ──────────────────────────────────────────────────
// Modern Indonesian is written in plain ASCII; the only accented letters that
// appear are `é`/`è`/`ê` (loanwords, names, pre-1972 spelling). Fold them to `e`
// for accent-insensitive answer comparison only — never for display.
const ID_DIACRITIC_MAP: Record<string, string> = {
  é: "e", è: "e", ê: "e", ë: "e",
  É: "E", È: "E", Ê: "E", Ë: "E",
};

/**
 * Fold the rare Indonesian accented vowels to their base letter.
 * Use for accent-insensitive answer comparison only — NOT for display.
 */
export function foldIndonesianDiacritics(input: string): string {
  let out = "";
  for (const ch of input) out += ID_DIACRITIC_MAP[ch] ?? ch;
  return out;
}

// ── Informal / bahasa-gaul handling ─────────────────────────────────────
// Maps common colloquial spellings and chat abbreviations to their standard
// written-Indonesian forms. Word-level only (whole-token match, case-folded);
// used for LENIENT answer grading so a learner who types "gak tau" instead of
// "tidak tahu" isn't marked wrong. NEVER run displayed lesson content through
// this — packs that teach slang must show the slang verbatim.
const ID_INFORMAL_MAP: Record<string, string> = {
  // negation
  gak: "tidak", nggak: "tidak", ngga: "tidak", ga: "tidak", gk: "tidak",
  kagak: "tidak", tak: "tidak", tdk: "tidak", engga: "tidak", enggak: "tidak",
  // pronouns
  gue: "saya", gua: "saya", gw: "saya", aku: "saya",
  lu: "kamu", lo: "kamu", elu: "kamu", elo: "kamu", loe: "kamu",
  // common contractions / chat shorthand
  udah: "sudah", udh: "sudah", dah: "sudah", uda: "sudah",
  belom: "belum", blm: "belum", blom: "belum",
  aja: "saja", aje: "saja",
  banget: "sangat", bgt: "sangat", bingits: "sangat",
  emang: "memang", emangnya: "memangnya",
  gimana: "bagaimana", gmn: "bagaimana", begimana: "bagaimana",
  kayak: "seperti", kaya: "seperti", kyk: "seperti",
  bikin: "membuat",
  kalo: "kalau", klo: "kalau", kl: "kalau",
  gitu: "begitu", gtu: "begitu",
  gini: "begini",
  trus: "terus", trs: "terus",
  yg: "yang",
  dgn: "dengan", dg: "dengan",
  utk: "untuk", untk: "untuk",
  sm: "sama",
  org: "orang",
  dr: "dari",
  tp: "tapi", tapinya: "tetapi", tetep: "tetap",
  bener: "benar", bner: "benar",
  doang: "saja",
  ngapain: "mengapa",
  napa: "kenapa", knp: "kenapa",
  pengen: "ingin", pengin: "ingin", mau: "ingin",
  cuman: "cuma", cmn: "cuma",
  jd: "jadi",
  sih: "",
  deh: "",
  dong: "",
};

/**
 * Replace whole-word colloquial / abbreviated Indonesian tokens with their
 * standard written forms. Case-insensitive, token-level. For answer comparison
 * only — never for display.
 * "Gue gak tau" → "saya tidak tahu" (after the answer-match pipeline lowercases).
 */
export function foldIndonesianInformal(input: string): string {
  return input
    .split(/(\s+)/) // keep the whitespace runs so spacing is preserved
    .map((tok) => {
      if (/^\s+$/.test(tok) || tok === "") return tok;
      // strip leading/trailing punctuation, map the bare word, re-attach.
      const m = tok.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
      if (!m) return tok;
      const [, pre, core, post] = m;
      const mapped = ID_INFORMAL_MAP[core.toLowerCase()];
      return mapped === undefined ? tok : `${pre}${mapped}${post}`;
    })
    .join("");
}

/**
 * Compare two Indonesian strings ignoring register (informal↔standard),
 * accents, case, punctuation, and surrounding whitespace — the lenient bar
 * used when grading typed answers so a learner who writes "gak" for "tidak"
 * or drops a particle ("sih"/"dong") isn't marked wrong.
 */
export function indonesianAnswersMatch(a: string, b: string): boolean {
  const norm = (s: string) =>
    foldIndonesianInformal(foldIndonesianDiacritics(s))
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ") // drop punctuation
      .trim()
      .replace(/\s+/g, " ");
  return norm(a) === norm(b);
}

// Stable hash for Indonesian string ids ("indonesian_salam_intro" etc.) so the
// React key is deterministic without callers passing an explicit numeric id.
// Mirrors the Portuguese / French / Italian normalizers byte-for-byte. Caller
// may override via the second arg.
function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeIndonesianLesson(
  lesson: IndonesianLessonInput,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    sentences: (lesson.sentences ?? []).map((s) => {
      // Native text in `s.id` (preferred) or `s.indo`; English gloss in `s.en`.
      // Legacy fallback: when neither native slot is present the native text
      // reused `s.en` (no separate gloss).
      const native = s.id ?? s.indo ?? s.en ?? "";
      const en = s.id ?? s.indo ? s.en : undefined;
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
    exercises: normalizeIndonesianExercises(lesson.exercises),
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
    // has no "id" lang code yet, and wiring Indonesian into the audio manifest is
    // out of scope here. NormalizedLesson.audioBase is optional — the renderer
    // shows no audio buttons until the Indonesian audio bundle ships.
  };
}

function normalizeIndonesianExercises(
  exercises: IndonesianLessonInput["exercises"],
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
      // Flat-shape pairs are tuples: [["id", "vi"], ...].
      const raw: unknown[] = Array.isArray(ex.pairs) ? ex.pairs : [];
      out.push({
        kind: "matching",
        instruction: normalizeStringOrUndefined(ex.instruction ?? ex.instruction_vi),
        instructionEn: normalizeStringOrUndefined(ex.instruction_en),
        pairs: (raw as NormalizeUnknownRecord[]).map((p) =>
          Array.isArray(p)
            ? { a: String(p[0] ?? ""), b: String(p[1] ?? "") }
            : {
                a: String(p.a ?? p.prompt ?? p.indonesian ?? p.id ?? p.indo ?? ""),
                b: String(p.b ?? p.answer ?? p.vi ?? ""),
              },
        ),
      });
    } else if (kind === "translation") {
      out.push({
        kind: "translation",
        vi: String(ex.vietnamese ?? ""),
        en: normalizeStringOrUndefined(ex.english),
        native: String(ex.indonesian ?? ex.id ?? ex.indo ?? ""),
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
