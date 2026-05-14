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
//   intro   : amber card if lesson.intro
//   sentences: slate card; native + romanization + en + vi + focus chips + note
//   vocab   : green 2-col grid if lesson.vocabulary
//   dialogue: purple card if lesson.dialogue
//   exercises: orange card; type-discriminated render per `kind`
//   cultural: blue card if lesson.culturalNotesVi
//   tip     : amber card if lesson.tipAdviceVi
//   grammar : violet card if lesson.grammar (Japanese-specific)

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
    cultureHeading: "Văn hoá",
    tipHeading: "Mẹo học",
    grammarHeading: "Ngữ pháp",
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
    cultureHeading: "Culture",
    tipHeading: "Study tip",
    grammarHeading: "Grammar",
  },
} as const;

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
          {lesson.intro && (
            <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
              <p className="text-xs leading-relaxed text-amber-900">
                {lesson.intro}
              </p>
            </div>
          )}

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
                  {s.en && (
                    <p className="mt-0.5 text-xs font-medium text-slate-700">
                      {s.en}
                    </p>
                  )}
                  {s.vi && (
                    <p className="mt-0.5 text-xs text-slate-600">{s.vi}</p>
                  )}
                  {s.pronunciationFocus && s.pronunciationFocus.length > 0 && (
                    <p
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px]"
                      style={{ color: theme.accent }}
                    >
                      <Volume2 className="h-3 w-3" />
                      {s.pronunciationFocus.join(" · ")}
                    </p>
                  )}
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
                Từ vựng ({lesson.vocabulary.length} từ)
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
                      {(v.en || v.vi) && (
                        <span className="text-slate-500 ml-2">
                          {v.vi ?? v.en}
                        </span>
                      )}
                      {v.phonetic && (
                        <span className="block text-[10px] text-slate-400">
                          {v.phonetic}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lesson.dialogue && lesson.dialogue.length > 0 && (
            <div className="rounded-lg border border-purple-100 bg-purple-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                <Sparkles className="h-3 w-3" />
                {labels.dialogueHeading}
              </p>
              <div className="mt-2 space-y-2">
                {lesson.dialogue.map((d, di) => (
                  <div key={di} className="text-xs flex items-start gap-1.5">
                    {lesson.audioBase && (
                      <LessonAudioButton
                        audioKey={lessonAudioKey(
                          lesson.audioBase,
                          lesson.audioKinds?.dialogue === "dialogue_vi"
                            ? { kind: "dialogue_vi", index: di + 1 }
                            : {
                                kind: "dialogue_short",
                                index: di + 1,
                                speaker: dialogueShortSpeakerLetter(d.speaker),
                              },
                        )}
                        ariaLabel={`${labels.dialogueAudioAria}: ${d.native}`}
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
                      {(d.en || d.vi) && (
                        <div className="text-slate-500 ml-5">
                          {d.vi ?? d.en}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lesson.exercises && lesson.exercises.length > 0 && (
            <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                <PenLine className="h-3 w-3" />
                Bài tập
              </p>
              <ol className="mt-2 space-y-2">
                {lesson.exercises.map((ex, ei) => (
                  <li key={ei} className="text-xs text-slate-700">
                    <ExerciseRow ex={ex} index={ei} />
                  </li>
                ))}
              </ol>
            </div>
          )}

          {lesson.culturalNotesVi && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                <Sparkles className="h-3 w-3" />
                {labels.cultureHeading}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-700">
                {lesson.culturalNotesVi}
              </p>
            </div>
          )}

          {lesson.tipAdviceVi && (
            <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                <Lightbulb className="h-3 w-3" />
                {labels.tipHeading}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-700">
                {lesson.tipAdviceVi}
              </p>
            </div>
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

function ExerciseRow({ ex, index }: { ex: NormalizedExercise; index: number }) {
  const labelMap: Record<NormalizedExercise["kind"], string> = {
    "fill-blank": "Điền vào chỗ trống",
    matching: "Nối",
    translation: "Dịch",
  };

  if (ex.kind === "fill-blank") {
    return (
      <>
        <span className="font-semibold">
          {index + 1}. {labelMap[ex.kind]}:
        </span>{" "}
        <span>{ex.question}</span>
        <span className="block text-[10px] text-green-600 mt-0.5">
          → {ex.answer}
        </span>
      </>
    );
  }

  if (ex.kind === "matching") {
    return (
      <>
        <span className="font-semibold">
          {index + 1}. {labelMap[ex.kind]}:
        </span>{" "}
        {ex.instruction && <span>{ex.instruction}</span>}
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
  return (
    <>
      <span className="font-semibold">
        {index + 1}. {labelMap[ex.kind]}:
      </span>{" "}
      <span className="italic">"{ex.vi}"</span>
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

export default LessonRenderer;
