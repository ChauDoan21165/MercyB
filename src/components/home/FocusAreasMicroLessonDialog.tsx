// src/components/home/FocusAreasMicroLessonDialog.tsx
//
// Radix Dialog that shows a "why this is hard for Vietnamese speakers"
// micro-lesson for a single weakness tag, and routes to the mapped
// room on primary CTA.
//
// Rendering paths (in priority order):
//   1. Rich pilot — `getRichLessonPilot(tag)` returns a hand-authored
//      RichLesson → render the five-section + 5-question quiz layout.
//   2. Adapted legacy — a MicroLesson exists for the tag → adapt it via
//      `fromMicroLesson` and render in the rich shape too. This keeps
//      the rich layout as the single rendering path while old content
//      keeps working without authoring effort.
//   3. Entry-only — no lesson available → fall back to the original
//      compact wrong/right summary (legacy compatibility, never
//      removed).
//
// Bilingual EN + VI throughout. Each section has a per-section toggle
// so the learner can hide one language and focus on the other; default
// shows both, Vietnamese first (Vietnamese-first non-negotiable).
//
// When `entry.linkedRoomId` is null the catalog doesn't yet have a
// matching room — the CTA flips to a disabled "coming soon" affordance
// instead of navigating anywhere.

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";

import type { WeaknessEntry } from "@/lib/weakness/weakness-catalog";
import { renderInlineBold } from "@/lib/weakness/renderInlineBold";
import { logFocusAreasLessonStarted } from "@/lib/weakness/focusAreasAnalytics";
import { getMicroLesson } from "@/lib/weakness/micro-lessons";
import {
  fromMicroLesson,
  type RichLesson,
  type RichLessonQuizQuestion,
  type RichLessonSection,
} from "@/lib/weakness/richLessonSchema";
import { getRichLessonPilot } from "@/data/richLessonsPilot";

interface FocusAreasMicroLessonDialogProps {
  /** null closes the dialog; non-null opens and drives content. */
  entry: WeaknessEntry | null;
  onOpenChange: (open: boolean) => void;
  /** Current user id for analytics; optional. */
  userId?: string | null;
}

type LessonLanguage = "both" | "vi" | "en";

const SECTION_ORDER: Array<{
  key: keyof RichLesson["sections"];
  labelEn: string;
  labelVi: string;
}> = [
  { key: "hook", labelEn: "Hook", labelVi: "Mở đầu" },
  { key: "why", labelEn: "Why this is hard", labelVi: "Vì sao khó" },
  { key: "pattern", labelEn: "Pattern", labelVi: "Quy tắc" },
  { key: "practice", labelEn: "Practice", labelVi: "Luyện tập" },
  { key: "takeaway", labelEn: "Takeaway", labelVi: "Ghi nhớ" },
];

function resolveRichLesson(entry: WeaknessEntry): RichLesson | null {
  const pilot = getRichLessonPilot(entry.tag);
  if (pilot) return pilot;
  const legacy = getMicroLesson(entry.tag);
  if (legacy) return fromMicroLesson(legacy);
  return null;
}

export default function FocusAreasMicroLessonDialog({
  entry,
  onOpenChange,
  userId,
}: FocusAreasMicroLessonDialogProps) {
  const navigate = useNavigate();
  const open = entry !== null;
  const hasRoom = entry !== null && entry.linkedRoomId !== null;
  const richLesson = entry ? resolveRichLesson(entry) : null;

  function handleStart() {
    if (!entry || !entry.linkedRoomId) return;
    if (userId) {
      logFocusAreasLessonStarted(userId, entry.tag, entry.linkedRoomId);
    }
    onOpenChange(false);
    navigate(`/room/${entry.linkedRoomId}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {entry ? (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Target className="h-5 w-5" aria-hidden />
              </div>
              <DialogTitle className="text-center text-lg font-semibold">
                {renderInlineBold(entry.shortLabel.en)}
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-slate-500">
                {renderInlineBold(entry.shortLabel.vi)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-1">
              <p className="text-sm leading-relaxed text-slate-800">
                {renderInlineBold(entry.longDescription.en)}
              </p>
              <p className="text-xs leading-relaxed text-slate-500">
                {renderInlineBold(entry.longDescription.vi)}
              </p>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-xs font-semibold uppercase text-rose-600">✗</span>
                  <span className="text-slate-700 line-through decoration-rose-300">
                    {entry.exampleWrong}
                  </span>
                </div>
                <div className="mt-1 flex items-start gap-2">
                  <span className="mt-0.5 text-xs font-semibold uppercase text-emerald-600">✓</span>
                  <span className="font-medium text-slate-800">{entry.exampleRight}</span>
                </div>
              </div>

              {richLesson ? (
                <RichLessonBody lesson={richLesson} />
              ) : null}
            </div>

            <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
              {hasRoom ? (
                <Button
                  type="button"
                  onClick={handleStart}
                  className="w-full bg-amber-500 text-white hover:bg-amber-600"
                >
                  Start lesson / Bắt đầu bài học
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full cursor-not-allowed bg-slate-200 text-slate-500 hover:bg-slate-200"
                >
                  Lesson coming soon / Sắp có bài học
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="w-full text-slate-500"
              >
                Not now / Để sau
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface RichLessonBodyProps {
  lesson: RichLesson;
}

function RichLessonBody({ lesson }: RichLessonBodyProps): React.ReactElement {
  const [langByKey, setLangByKey] = React.useState<
    Record<string, LessonLanguage>
  >({});

  function toggleSectionLang(key: string): void {
    setLangByKey((prev) => {
      const current = prev[key] ?? "both";
      const next: LessonLanguage =
        current === "both" ? "vi" : current === "vi" ? "en" : "both";
      return { ...prev, [key]: next };
    });
  }

  return (
    <div className="mt-4 space-y-3 border-t border-slate-200 pt-3">
      {SECTION_ORDER.map(({ key, labelEn, labelVi }) => {
        const section = lesson.sections[key];
        const lang = langByKey[key] ?? "both";
        return (
          <SectionBlock
            key={key}
            sectionKey={key}
            labelEn={labelEn}
            labelVi={labelVi}
            section={section}
            lang={lang}
            onToggleLang={() => toggleSectionLang(key)}
          />
        );
      })}

      <RichLessonQuiz quiz={lesson.quiz} />
    </div>
  );
}

interface SectionBlockProps {
  sectionKey: string;
  labelEn: string;
  labelVi: string;
  section: RichLessonSection;
  lang: LessonLanguage;
  onToggleLang: () => void;
}

function SectionBlock({
  sectionKey,
  labelEn,
  labelVi,
  section,
  lang,
  onToggleLang,
}: SectionBlockProps): React.ReactElement {
  const showVi = lang === "both" || lang === "vi";
  const showEn = lang === "both" || lang === "en";

  return (
    <section
      className="rounded-md border border-slate-200 bg-white p-3"
      data-rich-section={sectionKey}
    >
      <header className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          {labelVi} <span className="text-slate-400">/ {labelEn}</span>
        </h4>
        <button
          type="button"
          onClick={onToggleLang}
          className="rounded border border-slate-200 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-500 hover:bg-slate-50"
          aria-label={`Toggle language for ${labelEn}`}
        >
          {lang === "both" ? "VI+EN" : lang === "vi" ? "VI" : "EN"}
        </button>
      </header>
      {showVi ? (
        <p className="mt-1 text-sm leading-relaxed text-slate-800">
          {renderInlineBold(section.vi)}
        </p>
      ) : null}
      {showEn ? (
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {renderInlineBold(section.en)}
        </p>
      ) : null}
    </section>
  );
}

interface RichLessonQuizProps {
  quiz: RichLessonQuizQuestion[];
}

function RichLessonQuiz({ quiz }: RichLessonQuizProps): React.ReactElement {
  return (
    <section className="rounded-md border border-amber-200 bg-amber-50 p-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-800">
        Quiz nhanh / Quick quiz
      </h4>
      <ol className="mt-2 space-y-3 text-sm">
        {quiz.map((q, i) => (
          <QuizItem key={i} index={i} question={q} />
        ))}
      </ol>
    </section>
  );
}

interface QuizItemProps {
  index: number;
  question: RichLessonQuizQuestion;
}

function QuizItem({ index, question }: QuizItemProps): React.ReactElement {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <li className="rounded border border-amber-100 bg-white p-2">
      <p className="font-medium text-slate-800">
        {index + 1}. {question.question.vi}
      </p>
      <p className="text-xs text-slate-500">{question.question.en}</p>
      {question.options && question.options.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-xs text-slate-600">
          {question.options.map((opt, oi) => (
            <li key={oi}>
              <span className="mr-1 font-mono text-slate-400">
                {String.fromCharCode(65 + oi)}.
              </span>
              {opt}
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className="mt-2 text-xs font-medium text-amber-700 underline-offset-2 hover:underline"
      >
        {revealed ? "Ẩn đáp án / Hide answer" : "Hiện đáp án / Show answer"}
      </button>
      {revealed ? (
        <div className="mt-1 rounded bg-emerald-50 p-2 text-xs">
          <p className="font-semibold text-emerald-700">
            ✓ {question.correctAnswer}
          </p>
          {question.explanation ? (
            <>
              <p className="mt-1 text-slate-700">
                {renderInlineBold(question.explanation.vi)}
              </p>
              <p className="text-slate-500">
                {renderInlineBold(question.explanation.en)}
              </p>
            </>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
