// src/languages/italian/normalize.ts
//
// Converts an Italian lesson → NormalizedLesson for the shared <LessonRenderer>.
//
// The six Italian per-level files (lessons-a1 … lessons-c2) do NOT share a single
// `ItalianLesson` type — the pack was authored in two waves with divergent shapes:
//   • a1 / a2 / b2 — Italian sentence content in `s.it`, optional English gloss in
//     `s.en`, plus `l1_notes_vi` (Vietnamese L1-interference mistake+fix notes).
//   • b1 / c1 / c2 — Italian sentence content reuses `s.en` (French-legacy field
//     name, no `s.it`), plus `idiom_glosses`, `dialogue_long`, `roleplay_prompts`,
//     and `register_notes`.
// Rather than depend on one file's `ItalianLesson` type, this normalizer takes a
// permissive structural input covering the union of both waves and reads
// defensively (native = s.it ?? s.en). Exercises mix a nested `items[]` shape
// (a1/a2) and a flat shape (b1+), exactly like the French pack — see
// `normalizeItalianExercises`.

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
// Union of every field used across the six Italian level files. Only the
// fields the renderer consumes are typed; per-file extras (e.g. `category`)
// are accepted structurally and ignored.

type ItalianSentenceInput = {
  /** a1/a2/b2 carry the Italian target here. */
  it?: string;
  /** b1/c1/c2 carry the Italian target here; a1/a2/b2 carry an English gloss. */
  en?: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
};

type ItalianVocabInput = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type ItalianDialogueInput = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type ItalianIdiomGlossInput = {
  idiom: string;
  literal: string;
  literal_en?: string;
  meaning: string;
  meaning_en?: string;
  example: string;
  example_en?: string;
};

export type ItalianLessonInput = {
  id: string;
  level: CefrLevel;
  title_vi: string;
  title_en: string;
  sentences?: ItalianSentenceInput[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  vocabulary?: ItalianVocabInput[];
  dialogue?: ItalianDialogueInput[];
  exercises?: Array<Record<string, unknown>>;
  dialogue_long?: ItalianDialogueInput[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_en?: string;
  idiom_glosses?: ItalianIdiomGlossInput[];
  // a1 / a2 / b2 only — Vietnamese L1-interference notes. NormalizedLesson has no
  // slot for these yet, so they are not surfaced by the renderer; kept in the
  // input type so a future renderer field can map them without a churn here.
  l1_notes_vi?: Array<{ mistake: string; fix_vi: string }>;
};

// Stable hash for Italian string ids ("lregistro_e_sfumatura" etc.) so the React
// key is deterministic without callers passing an explicit numeric id. Mirrors
// the French normalizer's helper byte-for-byte. Caller may override via `id`.
function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeItalianLesson(
  lesson: ItalianLessonInput,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    sentences: (lesson.sentences ?? []).map((s) => {
      // a1/a2/b2: Italian in `s.it`, English gloss in `s.en`.
      // b1/c1/c2: Italian in `s.en` (no `s.it`) → no separate English gloss.
      const native = s.it ?? s.en ?? "";
      const en = s.it ? s.en : undefined;
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
    exercises: normalizeItalianExercises(lesson.exercises),
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
    // has no "it" lang code yet, and wiring Italian into the audio manifest is out
    // of scope for this file. NormalizedLesson.audioBase is optional — the renderer
    // simply shows no audio buttons until the Italian audio bundle ships.
  };
}

function normalizeItalianExercises(
  exercises: ItalianLessonInput["exercises"],
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;
  const out: NormalizedExercise[] = [];
  for (const ex of exercises) {
    // a1/a2 use "fill_blank" (underscore); b1+ use "fill-blank" (hyphen).
    const kind = String(ex.type ?? "").replace("_", "-");

    // a1/a2 nested shape: { type, instruction_vi, instruction_en, items: [{prompt, answer, options?}] }
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

    // b1/b2/c1/c2 flat shape.
    if (kind === "fill-blank") {
      out.push({
        kind: "fill-blank",
        question: String(ex.question ?? ""),
        answer: String(ex.answer ?? ""),
        hint: normalizeStringOrUndefined(ex.hint_vi),
        hintEn: normalizeStringOrUndefined(ex.hint_en),
      });
    } else if (kind === "matching") {
      // Flat-shape pairs are tuples: [["it", "vi"], ...].
      const raw: unknown[] = Array.isArray(ex.pairs) ? ex.pairs : [];
      out.push({
        kind: "matching",
        instruction: normalizeStringOrUndefined(ex.instruction ?? ex.instruction_vi),
        instructionEn: normalizeStringOrUndefined(ex.instruction_en),
        pairs: (raw as NormalizeUnknownRecord[]).map((p) =>
          Array.isArray(p)
            ? { a: String(p[0] ?? ""), b: String(p[1] ?? "") }
            : {
                a: String(p.a ?? p.prompt ?? p.italian ?? ""),
                b: String(p.b ?? p.answer ?? p.vi ?? ""),
              },
        ),
      });
    } else if (kind === "translation") {
      out.push({
        kind: "translation",
        vi: String(ex.vietnamese ?? ""),
        en: normalizeStringOrUndefined(ex.english),
        native: String(ex.italian ?? ""),
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
