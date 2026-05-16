// src/components/languages/LessonRenderer.tsx
//
// Shared lesson renderer used by all 5 language module pages.
// Field-name-pure: takes a NormalizedLesson + LessonTheme. Per-language
// field-name aliasing happens at the normalizer boundary, NOT here —
// no s.en ?? s.english fallback chains, no isKorean(lang) branching.
//
// Sections (collapsed → expanded):
//   header  : number badge, title.vi, title.en, optional native title,
//             CEFR pill, expand chevron
//   stats   : counts of vocab/sentences/dialogue/exercises (when collapsed)
//   intro   : amber card; picks introEn/introVi by uiLanguage with a
//             fallback badge (legacy single-string `intro` = no badge)
//   sentences: slate card; native + romanization + en + vi + focus chips + note
//   vocab   : green 2-col grid if lesson.vocabulary
//   dialogue: purple card if lesson.dialogue
//   exercises: orange card; type-discriminated render per `kind`
//   cultural: blue card if lesson.culturalNotesEn / Vi (picks by uiLanguage, falls back)
//   tip     : amber card if lesson.tipAdviceEn / Vi (picks by uiLanguage, falls back)
//   grammar : violet card if lesson.grammar (Japanese-specific)
//
// Bilingual content selection: every `*Vi` field has an optional `*En`
// sibling on NormalizedLesson (see LessonRenderer.types.ts). For each
// section, the renderer picks the language matching the `uiLanguage`
// prop and falls back to the other when the preferred one is missing.
// When a fallback occurs, a small muted badge (e.g. "VI") is shown next
// to the section heading so the learner knows the displayed text isn't
// in their selected UI language.

import { useState } from "react";
import {
  Sparkles,
  Lightbulb,
  Volume2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageCircle,
  PenLine,
  GraduationCap,
} from "lucide-react";

import type {
  NormalizedLesson,
  LessonTheme,
  NormalizedExercise,
  NormalizedIdiomGloss,
  NormalizedDialogueLine,
  NormalizedAudioKinds,
} from "./LessonRenderer.types";
import { cefrPillColors, cefrPillLabels } from "./lessonThemes";
import { LessonAudioButton } from "./LessonAudioButton";
import {
  lessonAudioKey,
  dialogueShortSpeakerLetter,
  isPhonicsOnly,
} from "@/lib/lessonAudio";

// Renderer chrome labels.
//
// Until 2026-05, all language modules used Vietnamese as the source/UI
// language (lesson titles, study tips, cultural notes were Vietnamese;
// the foreign language was the *target*). The Spanish-for-English-
// speakers module is the first vertical where the source language is
// English, so the static chrome (section headings, audio aria-labels,
// count-chip units) needs to follow.
//
// Existing six language pages don't pass `uiLanguage`, so they inherit
// the "vi" default and render identically. Default is enforced via
// TypeScript so it's hard to regress.
const RENDERER_LABELS = {
  vi: {
    vocabChip: "từ vựng",
    sentenceChip: "câu",
    dialogueChip: "hội thoại",
    exerciseChip: "bài tập",
    sentenceAudioAria: "Phát âm câu",
    vocabAudioAria: "Phát âm",
    dialogueAudioAria: "Phát âm hội thoại",
    dialogueHeading: "Hội thoại",
    dialogueShortToggle: "Ngắn",
    dialogueLongToggle: "Mở rộng",
    cultureHeading: "Văn hoá",
    tipHeading: "Mẹo học",
    registerHeading: "Văn phong",
    roleplayHeading: "Luyện nói",
    idiomHeading: "Thành ngữ",
    grammarHeading: "Ngữ pháp",
    vocabHeading: "Từ vựng",
    vocabUnit: "từ",
    exercisesHeading: "Bài tập",
    exerciseLabels: {
      "fill-blank": "Điền vào chỗ trống",
      matching: "Nối",
      translation: "Dịch",
    },
  },
  en: {
    vocabChip: "vocab",
    sentenceChip: "sentences",
    dialogueChip: "dialogues",
    exerciseChip: "exercises",
    sentenceAudioAria: "Play sentence",
    vocabAudioAria: "Play",
    dialogueAudioAria: "Play dialogue",
    dialogueHeading: "Dialogue",
    dialogueShortToggle: "Short",
    dialogueLongToggle: "Extended",
    cultureHeading: "Culture",
    tipHeading: "Study tip",
    registerHeading: "Register",
    roleplayHeading: "Practice",
    idiomHeading: "Idioms",
    grammarHeading: "Grammar",
    vocabHeading: "Vocabulary",
    vocabUnit: "words",
    exercisesHeading: "Exercises",
    exerciseLabels: {
      "fill-blank": "Fill in the blank",
      matching: "Match",
      translation: "Translate",
    },
  },
} as const;

type RendererLabels = typeof RENDERER_LABELS[keyof typeof RENDERER_LABELS];

// Pick the value matching the preferred uiLanguage; fall back to the other
// when the preferred one is missing. Returns undefined only when both are.
function pick<T>(uiLang: "vi" | "en", en: T | undefined, vi: T | undefined): T | undefined {
  return uiLang === "en" ? (en ?? vi) : (vi ?? en);
}

// True when the displayed value came from the non-preferred language —
// i.e. the preferred value was missing and we fell back. Drives the badge.
function isFallback(uiLang: "vi" | "en", en: unknown, vi: unknown): boolean {
  return uiLang === "en" ? !en && !!vi : !vi && !!en;
}

function FallbackBadge({ other }: { other: "vi" | "en" }) {
  return (
    <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium uppercase text-slate-400">
      {other}
    </span>
  );
}

interface LessonRendererProps {
  lesson: NormalizedLesson;
  theme: LessonTheme;
  /**
   * UI / chrome language for headings, count-chip units, and audio
   * aria-labels. Defaults to "vi" so existing six language pages don't
   * regress. Pass "en" from English-source modules like
   * SpanishLessonsPage where the surrounding UI is already English.
   */
  uiLanguage?: "vi" | "en";
}

export function LessonRenderer({ lesson, theme, uiLanguage = "vi" }: LessonRendererProps) {
  const labels = RENDERER_LABELS[uiLanguage];
  const [open, setOpen] = useState(false);
  // dialogue_long is opt-in; default (false) keeps the dialogue card
  // showing only the short form so the default view is unchanged.
  const [showLong, setShowLong] = useState(false);

  const vocabCount = lesson.vocabulary?.length ?? 0;
  const sentCount = lesson.sentences?.length ?? 0;
  const dialCount = lesson.dialogue?.length ?? 0;
  const exerCount = lesson.exercises?.length ?? 0;

  return (
    <article
      className="overflow-hidden rounded-xl border bg-white"
      style={{ borderColor: `${theme.accent}22` }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <div
          className="flex-shrink-0 grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-white"
          style={{ background: theme.accent }}
        >
          {lesson.id}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-slate-900">
              {lesson.title.vi}
            </p>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${cefrPillColors[lesson.level] ?? ""}`}
            >
              {cefrPillLabels[lesson.level] ?? lesson.level}
            </span>
          </div>
          <p className="text-xs text-slate-500">{lesson.title.en}</p>
          {lesson.title.native && (
            <p className="text-xs italic text-slate-400 mt-0.5">
              {lesson.title.native}
              {lesson.title.romanization && (
                <span className="ml-1 not-italic">
                  ({lesson.title.romanization})
                </span>
              )}
            </p>
          )}

          {!open && (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
              {vocabCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> {vocabCount} {labels.vocabChip}
                </span>
              )}
              {sentCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> {sentCount} {labels.sentenceChip}
                </span>
              )}
              {dialCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> {dialCount} {labels.dialogueChip}
                </span>
              )}
              {exerCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <PenLine className="h-3 w-3" /> {exerCount} {labels.exerciseChip}
                </span>
              )}
            </div>
          )}
        </div>

        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />
        )}
      </button>

      {open && (
        <div
          className="border-t px-4 py-3 space-y-3"
          style={{ borderColor: `${theme.accent}11`, background: "rgb(248 250 252 / 0.6)" }}
        >
          {/* intro — Incidental D fix: pick introEn/introVi by
              uiLanguage with a fallback badge so an English-UI user
              seeing Vietnamese intro content is told so. Legacy single-
              language `intro` (pre-bilingual modules) renders with no
              badge — it is language-agnostic by contract. */}
          {(() => {
            const picked = pick(uiLanguage, lesson.introEn, lesson.introVi);
            const text = picked ?? lesson.intro;
            if (!text) return null;
            const fallback =
              picked !== undefined &&
              isFallback(uiLanguage, lesson.introEn, lesson.introVi);
            return (
              <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
                <p className="text-xs leading-relaxed text-amber-900">
                  {text}
                  {fallback && (
                    <FallbackBadge other={uiLanguage === "en" ? "vi" : "en"} />
                  )}
                </p>
              </div>
            );
          })()}

          {sentCount > 0 && (
            <ol className="space-y-2">
              {lesson.sentences.map((s, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="flex items-start gap-2">
                    {lesson.audioBase && (
                      <LessonAudioButton
                        audioKey={lessonAudioKey(
                          lesson.audioBase,
                          lesson.audioKinds?.sentence === "phrase"
                            ? { kind: "phrase", index: i + 1 }
                            : { kind: "sentence", index: i + 1 },
                        )}
                        ariaLabel={`${labels.sentenceAudioAria}: ${s.native}`}
                        accent={theme.accent}
                      />
                    )}
                    <p className="text-sm font-medium text-slate-900 flex-1">
                      {s.native}
                    </p>
                  </div>
                  {s.romanization && (
                    <p className="mt-0.5 text-xs italic text-slate-500">
                      {s.romanization}
                    </p>
                  )}
                  {uiLanguage === "en" ? (
                    <>
                      {s.en && (
                        <p className="mt-0.5 text-xs font-medium text-slate-700">
                          {s.en}
                        </p>
                      )}
                      {s.vi && (
                        <p className="mt-0.5 text-xs text-slate-500">{s.vi}</p>
                      )}
                    </>
                  ) : (
                    <>
                      {s.vi && (
                        <p className="mt-0.5 text-xs font-medium text-slate-700">
                          {s.vi}
                        </p>
                      )}
                      {s.en && (
                        <p className="mt-0.5 text-xs text-slate-500">{s.en}</p>
                      )}
                    </>
                  )}
                  {(() => {
                    const focus = pick(
                      uiLanguage,
                      s.pronunciationFocusEn,
                      s.pronunciationFocus,
                    );
                    if (!focus || focus.length === 0) return null;
                    const fallback = isFallback(
                      uiLanguage,
                      s.pronunciationFocusEn,
                      s.pronunciationFocus,
                    );
                    return (
                      <p
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px]"
                        style={{ color: theme.accent }}
                      >
                        <Volume2 className="h-3 w-3" />
                        {focus.join(" · ")}
                        {fallback && (
                          <FallbackBadge other={uiLanguage === "en" ? "vi" : "en"} />
                        )}
                      </p>
                    );
                  })()}
                  {s.note && (
                    <p className="mt-1 text-[11px] italic text-slate-400">
                      {s.note}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}

          {lesson.vocabulary && lesson.vocabulary.length > 0 && (
            <div className="rounded-lg border border-green-100 bg-green-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                <BookOpen className="h-3 w-3" />
                {labels.vocabHeading} ({lesson.vocabulary.length} {labels.vocabUnit})
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {lesson.vocabulary.map((v, vi) => (
                  <div key={vi} className="text-xs flex items-start gap-1.5">
                    {lesson.audioBase && !isPhonicsOnly(v.native) && (
                      <LessonAudioButton
                        audioKey={lessonAudioKey(lesson.audioBase, {
                          kind: "vocab",
                          index: vi + 1,
                        })}
                        ariaLabel={`${labels.vocabAudioAria}: ${v.native}`}
                        accent={theme.accent}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-slate-800">
                        {v.native}
                      </span>
                      {v.romanization && (
                        <span className="text-slate-400 ml-1">
                          {v.romanization}
                        </span>
                      )}
                      {(() => {
                        const gloss = pick(uiLanguage, v.en, v.vi);
                        return gloss ? (
                          <span className="text-slate-500 ml-2">{gloss}</span>
                        ) : null;
                      })()}
                      {(() => {
                        const phonetic = pick(uiLanguage, v.phoneticEn, v.phonetic);
                        return phonetic ? (
                          <span className="block text-[10px] text-slate-400">
                            {phonetic}
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {((lesson.dialogue?.length ?? 0) > 0 ||
            (lesson.dialogueLong?.length ?? 0) > 0) && (
            <div className="rounded-lg border border-purple-100 bg-purple-50/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                  <Sparkles className="h-3 w-3" />
                  {labels.dialogueHeading}
                </p>
                {lesson.dialogueLong && lesson.dialogueLong.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowLong((v) => !v)}
                    aria-pressed={showLong}
                    className="shrink-0 rounded-full border border-purple-200 px-2 py-0.5 text-[10px] font-medium text-purple-700 transition hover:bg-purple-100"
                  >
                    {showLong
                      ? labels.dialogueShortToggle
                      : labels.dialogueLongToggle}
                  </button>
                )}
              </div>
              {lesson.dialogue && lesson.dialogue.length > 0 && (
                <DialogueLineRows
                  lines={lesson.dialogue}
                  theme={theme}
                  uiLanguage={uiLanguage}
                  audioAria={labels.dialogueAudioAria}
                  audio={
                    lesson.audioBase
                      ? { base: lesson.audioBase, kinds: lesson.audioKinds }
                      : undefined
                  }
                />
              )}
              {showLong &&
                lesson.dialogueLong &&
                lesson.dialogueLong.length > 0 && (
                  <div className="mt-3 border-t border-purple-100 pt-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-purple-400">
                      {labels.dialogueLongToggle}
                    </p>
                    {/* No audio buttons: long-form has no generated audio. */}
                    <DialogueLineRows
                      lines={lesson.dialogueLong}
                      theme={theme}
                      uiLanguage={uiLanguage}
                      audioAria={labels.dialogueAudioAria}
                      showFallbackBadge
                    />
                  </div>
                )}
            </div>
          )}

          {lesson.exercises && lesson.exercises.length > 0 && (
            <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                <PenLine className="h-3 w-3" />
                {labels.exercisesHeading}
              </p>
              <ol className="mt-2 space-y-2">
                {lesson.exercises.map((ex, ei) => (
                  <li key={ei} className="text-xs text-slate-700">
                    <ExerciseRow
                      ex={ex}
                      index={ei}
                      labels={labels}
                      uiLanguage={uiLanguage}
                    />
                  </li>
                ))}
              </ol>
            </div>
          )}

          {(() => {
            const text = pick(uiLanguage, lesson.culturalNotesEn, lesson.culturalNotesVi);
            if (!text) return null;
            const fallback = isFallback(
              uiLanguage,
              lesson.culturalNotesEn,
              lesson.culturalNotesVi,
            );
            return (
              <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3">
                <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  <Sparkles className="h-3 w-3" />
                  {labels.cultureHeading}
                  {fallback && (
                    <FallbackBadge other={uiLanguage === "en" ? "vi" : "en"} />
                  )}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">{text}</p>
              </div>
            );
          })()}

          {(() => {
            const text = pick(uiLanguage, lesson.tipAdviceEn, lesson.tipAdviceVi);
            if (!text) return null;
            const fallback = isFallback(
              uiLanguage,
              lesson.tipAdviceEn,
              lesson.tipAdviceVi,
            );
            return (
              <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
                <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  <Lightbulb className="h-3 w-3" />
                  {labels.tipHeading}
                  {fallback && (
                    <FallbackBadge other={uiLanguage === "en" ? "vi" : "en"} />
                  )}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">{text}</p>
              </div>
            );
          })()}

          {/* register_notes — meta-advice, rendered as a small italic
              note under the study-tip card (per #496-locked decision). */}
          {(() => {
            const text = pick(
              uiLanguage,
              lesson.registerNotesEn,
              lesson.registerNotesVi,
            );
            if (!text) return null;
            const fallback = isFallback(
              uiLanguage,
              lesson.registerNotesEn,
              lesson.registerNotesVi,
            );
            return (
              <p className="px-1 text-[11px] italic leading-relaxed text-slate-500">
                <span className="font-semibold uppercase tracking-wide text-slate-400 not-italic">
                  {labels.registerHeading}
                  {fallback && (
                    <FallbackBadge other={uiLanguage === "en" ? "vi" : "en"} />
                  )}
                </span>{" "}
                {text}
              </p>
            );
          })()}

          {/* roleplay_prompts — static speaking-practice card in the
              indigo (speaking) family. No interactivity wired yet. */}
          {(() => {
            const prompts = pick(
              uiLanguage,
              lesson.roleplayPromptsEn,
              lesson.roleplayPromptsVi,
            );
            if (!prompts || prompts.length === 0) return null;
            const fallback = isFallback(
              uiLanguage,
              lesson.roleplayPromptsEn,
              lesson.roleplayPromptsVi,
            );
            return (
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
                <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  <MessageCircle className="h-3 w-3" />
                  {labels.roleplayHeading}
                  {fallback && (
                    <FallbackBadge other={uiLanguage === "en" ? "vi" : "en"} />
                  )}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {prompts.map((p, pi) => (
                    <li
                      key={pi}
                      className="flex items-start gap-2 text-xs leading-relaxed text-slate-700"
                    >
                      <MessageCircle className="mt-0.5 h-3 w-3 shrink-0 text-indigo-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

          {/* idiom_glosses — inline expandable list, one row per idiom
              (collapsed: idiom; expanded: literal/meaning/example,
              pick() per sub-field). #496-locked: not tooltips. */}
          {lesson.idiomGlosses && lesson.idiomGlosses.length > 0 && (
            <IdiomGlossList
              glosses={lesson.idiomGlosses}
              uiLanguage={uiLanguage}
              heading={labels.idiomHeading}
            />
          )}

          {lesson.grammar && lesson.grammar.length > 0 && (
            <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
                <GraduationCap className="h-3 w-3" />
                {labels.grammarHeading}
              </p>
              <ul className="mt-1.5 space-y-1.5">
                {lesson.grammar.map((g, gi) => (
                  <li
                    key={gi}
                    className="rounded-lg border border-violet-100 bg-white px-3 py-2 text-xs"
                  >
                    <p className="font-semibold text-violet-800">{g.point}</p>
                    <p className="mt-0.5 text-slate-600">{g.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ExerciseRow({
  ex,
  index,
  labels,
  uiLanguage,
}: {
  ex: NormalizedExercise;
  index: number;
  labels: RendererLabels;
  uiLanguage: "vi" | "en";
}) {
  const labelMap = labels.exerciseLabels;

  if (ex.kind === "fill-blank") {
    const hint = pick(uiLanguage, ex.hintEn, ex.hint);
    return (
      <>
        <span className="font-semibold">
          {index + 1}. {labelMap[ex.kind]}:
        </span>{" "}
        <span>{ex.question}</span>
        {hint && (
          <span className="block text-[10px] text-slate-500 italic">{hint}</span>
        )}
        <span className="block text-[10px] text-green-600 mt-0.5">
          → {ex.answer}
        </span>
      </>
    );
  }

  if (ex.kind === "matching") {
    const instruction = pick(uiLanguage, ex.instructionEn, ex.instruction);
    return (
      <>
        <span className="font-semibold">
          {index + 1}. {labelMap[ex.kind]}:
        </span>{" "}
        {instruction && <span>{instruction}</span>}
        <ul className="mt-1 ml-3 space-y-0.5 list-disc list-inside">
          {ex.pairs.map((p, pi) => (
            <li key={pi}>
              <span className="text-slate-700">{p.a}</span>
              <span className="text-[10px] text-green-600 ml-1">→ {p.b}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }

  // translation
  const prompt = pick(uiLanguage, ex.en, ex.vi);
  return (
    <>
      <span className="font-semibold">
        {index + 1}. {labelMap[ex.kind]}:
      </span>{" "}
      <span className="italic">"{prompt}"</span>
      <span className="block text-[10px] text-green-600 mt-0.5">
        → {ex.native}
        {ex.romanization && (
          <span className="text-slate-400 ml-1 italic">
            ({ex.romanization})
          </span>
        )}
      </span>
    </>
  );
}

// Renders a list of dialogue lines (speaker + native + romanization +
// glossed translation). Shared by the short `dialogue` and the opt-in
// `dialogue_long` forms. `audio` is omitted for the long form because
// only the short form has generated audio assets.
function DialogueLineRows({
  lines,
  theme,
  uiLanguage,
  audioAria,
  audio,
  showFallbackBadge = false,
}: {
  lines: NormalizedDialogueLine[];
  theme: LessonTheme;
  uiLanguage: "vi" | "en";
  audioAria: string;
  audio?: { base: string; kinds?: NormalizedAudioKinds };
  // Badge the gloss when pick() fell back to the non-UI language (the
  // #499 contract). Enabled ONLY for dialogue_long, whose normalized
  // en/vi are truthful. Left OFF for short `dialogue`: the Korean
  // short-dialogue normalizer puts English in the vi-named slot for all
  // 151 lessons (pre-existing, out of this PR's scope — see PR §10), so
  // badging it would falsely label English as "vi".
  showFallbackBadge?: boolean;
}) {
  return (
    <div className="mt-2 space-y-2">
      {lines.map((d, di) => (
        <div key={di} className="text-xs flex items-start gap-1.5">
          {audio && (
            <LessonAudioButton
              audioKey={lessonAudioKey(
                audio.base,
                audio.kinds?.dialogue === "dialogue_vi"
                  ? { kind: "dialogue_vi", index: di + 1 }
                  : {
                      kind: "dialogue_short",
                      index: di + 1,
                      speaker: dialogueShortSpeakerLetter(d.speaker),
                    },
              )}
              ariaLabel={`${audioAria}: ${d.native}`}
              accent={theme.accent}
            />
          )}
          <div className="min-w-0 flex-1">
            <span className="font-bold" style={{ color: theme.accent }}>
              {d.speaker}:
            </span>{" "}
            <span className="text-slate-900 font-medium">{d.native}</span>
            {d.romanization && (
              <span className="text-slate-400 ml-1 italic">
                ({d.romanization})
              </span>
            )}
            {(() => {
              // Pick the gloss in the UI language; badge (dialogue_long
              // only) when it fell back to the other language — same
              // #499 contract as the intro / sentence / cultural
              // surfaces. Under the default uiLanguage="vi" pick()
              // returns vi with no fallback, so the existing language
              // pages are unchanged.
              const gloss = pick(uiLanguage, d.en, d.vi);
              if (!gloss) return null;
              const fallback =
                showFallbackBadge && isFallback(uiLanguage, d.en, d.vi);
              return (
                <div className="text-slate-500 ml-5">
                  {gloss}
                  {fallback && (
                    <FallbackBadge other={uiLanguage === "en" ? "vi" : "en"} />
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}

// Inline expandable idiom list. One row per idiom; the row is the
// idiom itself, expanding to literal / meaning / example. Each sub-
// field is picked by uiLanguage with the same fallback-badge contract
// as the prose pedagogy fields. Tooltips were rejected in #496 §7 as
// mobile-hostile at 375px — an accordion keeps the lesson scannable.
function IdiomGlossList({
  glosses,
  uiLanguage,
  heading,
}: {
  glosses: NormalizedIdiomGloss[];
  uiLanguage: "vi" | "en";
  heading: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50/60 p-3">
      <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
        <BookOpen className="h-3 w-3" />
        {heading}
      </p>
      <ul className="mt-2 space-y-1">
        {glosses.map((g, gi) => {
          const isOpen = openIdx === gi;
          const literal = pick(uiLanguage, g.literalEn, g.literal);
          const meaning = pick(uiLanguage, g.meaningEn, g.meaning);
          const example = pick(uiLanguage, g.exampleEn, g.example);
          const fallback = isFallback(uiLanguage, g.meaningEn, g.meaning);
          return (
            <li
              key={gi}
              className="overflow-hidden rounded-md border border-teal-100 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : gi)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left transition hover:bg-teal-50/50"
              >
                <span className="text-xs font-semibold text-slate-800">
                  {g.idiom}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-3 w-3 shrink-0 text-teal-600" />
                ) : (
                  <ChevronDown className="h-3 w-3 shrink-0 text-teal-600" />
                )}
              </button>
              {isOpen && (
                <div className="space-y-0.5 border-t border-teal-50 px-2.5 py-1.5 text-xs">
                  {literal && (
                    <p className="text-slate-500">
                      <span className="italic">{literal}</span>
                    </p>
                  )}
                  {meaning && (
                    <p className="text-slate-700">
                      {meaning}
                      {fallback && (
                        <FallbackBadge other={uiLanguage === "en" ? "vi" : "en"} />
                      )}
                    </p>
                  )}
                  {example && (
                    <p className="italic text-slate-400">{example}</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LessonRenderer;
