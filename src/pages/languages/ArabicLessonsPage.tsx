// src/pages/languages/ArabicLessonsPage.tsx - /languages/arabic
//
// Public Arabic lesson page. W3 A2 renders the validated local arrays from
// src/languages/arabic only. Route, hub, and theme wiring belong to W3 A3.
// Remote loading, helper banners, generated extras, and media assets are out
// of scope for this page.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ARABIC_CATEGORIES,
  ARABIC_LESSONS_BY_LEVEL,
  ARABIC_TOTAL_LESSONS,
  ARABIC_VALIDATED_LEVELS,
  type ArabicCategoryMeta,
  type ArabicLesson,
  type ArabicLevel,
} from "@/languages/arabic";
import { cefrPillLabel } from "@/components/languages/lessonThemes";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";
import type { LessonUiLang } from "@/components/mercy-guide/tabs/LanguageLessonsView";

const ARABIC_ACCENT = "#0E7490";

const HERO_VI =
  "Tiếng Ả Rập chuẩn hiện đại cho người Việt - từ chữ viết đến diễn ngôn học thuật.";
const HERO_EN =
  "Modern Standard Arabic - local lessons from script basics to academic discourse.";

const ARABIC_RE = /[\u0600-\u06FF]/;

export default function ArabicLessonsPage() {
  const [level, setLevel] = useState<ArabicLevel>("A1");
  const [uiLang] = useLessonUiLang();

  const lessons = ARABIC_LESSONS_BY_LEVEL[level] ?? [];

  const lessonsByCategory = useMemo(() => {
    const map = new Map<string, ArabicLesson[]>();
    for (const lesson of lessons) {
      const cat = String(lesson.category ?? "uncategorized");
      const arr = map.get(cat);
      if (arr) arr.push(lesson);
      else map.set(cat, [lesson]);
    }
    return map;
  }, [lessons]);

  const orderedCategories = useMemo(
    () => orderedCategorySections(lessonsByCategory),
    [lessonsByCategory],
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header
        className="mb-6 rounded-lg border p-5"
        style={{
          borderColor: `${ARABIC_ACCENT}33`,
          background:
            "linear-gradient(135deg, rgb(236 254 255), rgb(239 246 255), rgb(248 250 252))",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: ARABIC_ACCENT }}
        >
          Tiếng Ả Rập chuẩn hiện đại · Modern Standard Arabic
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900">
          {uiLang === "en" ? HERO_EN : HERO_VI}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {uiLang === "en"
            ? "MSA-first lessons with Arabic script, practical romanization, and learner notes for English or Vietnamese mode."
            : "Bài học ưu tiên tiếng Ả Rập chuẩn hiện đại, có chữ Ả Rập, chuyển tự thực dụng và ghi chú theo chế độ tiếng Việt hoặc tiếng Anh."}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {ARABIC_TOTAL_LESSONS} {uiLang === "en" ? "lessons" : "bài"} · A1 → C2
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium underline"
            style={{ color: ARABIC_ACCENT }}
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>
      </header>

      <nav
        aria-label={uiLang === "en" ? "Choose level" : "Chọn cấp độ"}
        className="mb-4 flex flex-wrap gap-2"
      >
        {ARABIC_VALIDATED_LEVELS.map((lv) => {
          const active = lv === level;
          return (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-transparent text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
              style={active ? { backgroundColor: ARABIC_ACCENT } : undefined}
              aria-pressed={active}
            >
              {cefrPillLabel(lv, uiLang)}
            </button>
          );
        })}
      </nav>

      {lessons.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
          {uiLang === "en"
            ? "No local Arabic lessons available for this level yet."
            : "Chưa có bài học tiếng Ả Rập cục bộ cho cấp độ này."}
        </p>
      ) : (
        <div className="space-y-5">
          {orderedCategories.map((category) => {
            const catLessons = lessonsByCategory.get(category.id);
            if (!catLessons || catLessons.length === 0) return null;
            return (
              <CategorySection
                key={category.id}
                category={category}
                lessons={catLessons}
                uiLanguage={uiLang}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function orderedCategorySections(
  lessonsByCategory: Map<string, ArabicLesson[]>,
): ArabicCategoryMeta[] {
  const categories: ArabicCategoryMeta[] = [];
  const seen = new Set<string>();

  for (const category of ARABIC_CATEGORIES) {
    if (!lessonsByCategory.has(category.id)) continue;
    categories.push(category);
    seen.add(category.id);
  }

  for (const id of lessonsByCategory.keys()) {
    if (seen.has(id)) continue;
    categories.push({
      id: id as ArabicCategoryMeta["id"],
      title_vi: humanizeCategory(id),
      title_en: humanizeCategory(id),
      expected_count: lessonsByCategory.get(id)?.length ?? 0,
    });
  }

  return categories;
}

function CategorySection({
  category,
  lessons,
  uiLanguage,
}: {
  category: ArabicCategoryMeta;
  lessons: ArabicLesson[];
  uiLanguage: LessonUiLang;
}) {
  return (
    <section>
      <header className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">
          {uiLanguage === "en" ? category.title_en : category.title_vi}
        </h2>
        <span className="shrink-0 text-xs text-slate-500">
          {lessons.length}{" "}
          {uiLanguage === "en"
            ? lessons.length === 1
              ? "lesson"
              : "lessons"
            : "bài"}
        </span>
      </header>

      <ol className="space-y-3">
        {lessons.map((lesson, index) => (
          <li key={lesson.id}>
            <ArabicLessonCard
              lesson={lesson}
              lessonNumber={index + 1}
              uiLanguage={uiLanguage}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

function ArabicLessonCard({
  lesson,
  lessonNumber,
  uiLanguage,
}: {
  lesson: ArabicLesson;
  lessonNumber: number;
  uiLanguage: LessonUiLang;
}) {
  const [open, setOpen] = useState(false);
  const title = uiLanguage === "en" ? lesson.title_en : lesson.title_vi;
  const intro = uiLanguage === "en" ? lesson.intro_en : lesson.intro_vi;

  return (
    <article
      className="overflow-hidden rounded-lg border bg-white"
      style={{ borderColor: `${ARABIC_ACCENT}22` }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: ARABIC_ACCENT }}
        >
          {lessonNumber}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              {title}
            </span>
            <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-cyan-800">
              {cefrPillLabel(lesson.level, uiLanguage)}
            </span>
          </span>
          {!open && (
            <span className="mt-1 block text-[11px] text-slate-500">
              {(lesson.vocabulary?.length ?? 0)}{" "}
              {uiLanguage === "en" ? "vocab" : "từ"} ·{" "}
              {lesson.sentences.length}{" "}
              {uiLanguage === "en" ? "sentences" : "câu"} ·{" "}
              {lesson.exercises?.length ?? 0}{" "}
              {uiLanguage === "en" ? "exercises" : "bài tập"}
            </span>
          )}
        </span>
        <span className="shrink-0 text-lg leading-none text-slate-500">
          {open ? "⌃" : "⌄"}
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-cyan-100 bg-slate-50/70 px-4 py-4">
          <InfoBlock>{intro}</InfoBlock>

          <SentenceSection
            sentences={lesson.sentences}
            uiLanguage={uiLanguage}
          />

          {!!lesson.vocabulary?.length && (
            <VocabularySection
              vocabulary={lesson.vocabulary}
              uiLanguage={uiLanguage}
            />
          )}

          {!!lesson.dialogue?.length && (
            <DialogueSection dialogue={lesson.dialogue} uiLanguage={uiLanguage} />
          )}

          {!!lesson.exercises?.length && (
            <ExerciseSection exercises={lesson.exercises} uiLanguage={uiLanguage} />
          )}

          <NotesSection lesson={lesson} uiLanguage={uiLanguage} />
        </div>
      )}
    </article>
  );
}

function SentenceSection({
  sentences,
  uiLanguage,
}: {
  sentences: ArabicLesson["sentences"];
  uiLanguage: LessonUiLang;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">
        {uiLanguage === "en" ? "Examples" : "Câu mẫu"}
      </h3>
      <div className="space-y-3">
        {sentences.map((sentence, index) => (
          <div key={`${sentence.ar}-${index}`} className="space-y-1">
            <ArabicText className="text-base font-semibold">
              {sentence.ar}
            </ArabicText>
            {sentence.romanization && (
              <p className="text-xs italic text-slate-500" dir="ltr">
                {sentence.romanization}
              </p>
            )}
            <p className="text-sm text-slate-700">
              {uiLanguage === "en" ? sentence.en : sentence.vi}
            </p>
            <FocusChips
              items={
                uiLanguage === "en"
                  ? sentence.pronunciation_focus_en
                  : sentence.pronunciation_focus
              }
            />
            <OptionalNote>
              {uiLanguage === "en" ? sentence.note_en : sentence.note_vi}
            </OptionalNote>
          </div>
        ))}
      </div>
    </section>
  );
}

function VocabularySection({
  vocabulary,
  uiLanguage,
}: {
  vocabulary: NonNullable<ArabicLesson["vocabulary"]>;
  uiLanguage: LessonUiLang;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">
        {uiLanguage === "en" ? "Vocabulary" : "Từ vựng"}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {vocabulary.map((entry, index) => (
          <div
            key={`${entry.ar}-${index}`}
            className="rounded-lg border border-slate-100 bg-slate-50 p-2"
          >
            <ArabicText className="text-base font-semibold">
              {entry.ar}
            </ArabicText>
            {entry.romanization && (
              <p className="text-xs italic text-slate-500" dir="ltr">
                {entry.romanization}
              </p>
            )}
            <p className="text-sm text-slate-700">
              {uiLanguage === "en" ? entry.en : entry.vi}
            </p>
            {entry.pos && (
              <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                {entry.pos}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function DialogueSection({
  dialogue,
  uiLanguage,
}: {
  dialogue: NonNullable<ArabicLesson["dialogue"]>;
  uiLanguage: LessonUiLang;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">
        {uiLanguage === "en" ? "Dialogue" : "Hội thoại"}
      </h3>
      <div className="space-y-2">
        {dialogue.map((line, index) => (
          <div
            key={`${line.speaker}-${index}`}
            className="rounded-lg border border-slate-100 bg-slate-50 p-2"
          >
            <p className="text-xs font-semibold text-cyan-800">
              {line.speaker}
            </p>
            <ArabicText className="text-base font-semibold">
              {line.ar}
            </ArabicText>
            {line.romanization && (
              <p className="text-xs italic text-slate-500" dir="ltr">
                {line.romanization}
              </p>
            )}
            <p className="text-sm text-slate-700">
              {uiLanguage === "en" ? line.en : line.vi}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExerciseSection({
  exercises,
  uiLanguage,
}: {
  exercises: NonNullable<ArabicLesson["exercises"]>;
  uiLanguage: LessonUiLang;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">
        {uiLanguage === "en" ? "Exercises" : "Bài tập"}
      </h3>
      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <div key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-2">
            {exercise.type === "fill-blank" && (
              <>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {uiLanguage === "en" ? "Fill in the blank" : "Điền vào chỗ trống"}
                </p>
                <MaybeArabicText className="mt-1 text-sm font-medium text-slate-800">
                  {exercise.question}
                </MaybeArabicText>
                <AnswerLine answer={exercise.answer} />
                <OptionalNote>
                  {uiLanguage === "en" ? exercise.hint_en : exercise.hint_vi}
                </OptionalNote>
              </>
            )}

            {exercise.type === "matching" && (
              <>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {uiLanguage === "en" ? "Match" : "Nối"}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {uiLanguage === "en"
                    ? exercise.instruction_en
                    : exercise.instruction_vi}
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {exercise.pairs.map((pair, pairIndex) => (
                    <div
                      key={`${pair.ar}-${pairIndex}`}
                      className="rounded border border-slate-200 bg-white p-2"
                    >
                      <ArabicText className="text-sm font-semibold">
                        {pair.ar}
                      </ArabicText>
                      <p className="text-xs text-slate-600">
                        {uiLanguage === "en"
                          ? pair.meaning_en ?? pair.meaning_vi
                          : pair.meaning_vi}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {exercise.type === "translation" && (
              <>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {uiLanguage === "en" ? "Translate" : "Dịch"}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {uiLanguage === "en" ? exercise.en : exercise.vi}
                </p>
                <AnswerLine answer={exercise.ar} romanization={exercise.romanization} />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function NotesSection({
  lesson,
  uiLanguage,
}: {
  lesson: ArabicLesson;
  uiLanguage: LessonUiLang;
}) {
  const cultural = uiLanguage === "en"
    ? lesson.cultural_notes_en
    : lesson.cultural_notes_vi;
  const tip = uiLanguage === "en" ? lesson.tip_advice_en : lesson.tip_advice_vi;
  const register = uiLanguage === "en"
    ? lesson.register_notes_en
    : lesson.register_notes_vi;

  if (!cultural && !tip && !register) return null;

  return (
    <section className="space-y-2">
      {cultural && (
        <InfoBlock title={uiLanguage === "en" ? "Culture" : "Văn hoá"}>
          {cultural}
        </InfoBlock>
      )}
      {tip && (
        <InfoBlock title={uiLanguage === "en" ? "Study tip" : "Mẹo học"}>
          {tip}
        </InfoBlock>
      )}
      {register && (
        <InfoBlock title={uiLanguage === "en" ? "Register" : "Văn phong"}>
          {register}
        </InfoBlock>
      )}
    </section>
  );
}

function InfoBlock({
  title,
  children,
}: {
  title?: string;
  children: string;
}) {
  return (
    <div className="rounded-lg border border-cyan-100 bg-cyan-50/70 p-3">
      {title && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-800">
          {title}
        </p>
      )}
      <p className="text-sm leading-relaxed text-slate-700">{children}</p>
    </div>
  );
}

function FocusChips({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-cyan-50 px-2 py-0.5 text-[11px] text-cyan-900"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function OptionalNote({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="text-xs italic text-slate-500">{children}</p>;
}

function AnswerLine({
  answer,
  romanization,
}: {
  answer: string;
  romanization?: string;
}) {
  return (
    <div className="mt-2 rounded border border-cyan-100 bg-white p-2">
      <ArabicText className="text-sm font-semibold">{answer}</ArabicText>
      {romanization && (
        <p className="text-xs italic text-slate-500" dir="ltr">
          {romanization}
        </p>
      )}
    </div>
  );
}

function ArabicText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p className={`text-right ${className}`} dir="rtl" lang="ar">
      {children}
    </p>
  );
}

function MaybeArabicText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  if (ARABIC_RE.test(children)) {
    return (
      <p className={`text-right ${className}`} dir="rtl" lang="ar">
        {children}
      </p>
    );
  }
  return <p className={className}>{children}</p>;
}

function humanizeCategory(id: string): string {
  return id
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
