// src/pages/languages/PunjabiLessonsPage.tsx — /languages/punjabi
import { useMemo } from "react";
import { Link } from "react-router-dom";

import * as Course from "@/languages/punjabi";

type LessonRecord = Record<string, unknown>;
type UiLang = "vi" | "en";

const COURSE = Course as Record<string, unknown>;

function asRecord(value: unknown): LessonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as LessonRecord)
    : null;
}

function asArray(value: unknown): LessonRecord[] {
  return Array.isArray(value) ? value.filter((item): item is LessonRecord => Boolean(asRecord(item))) : [];
}

function collectLessons(): LessonRecord[] {
  const candidates = [
    COURSE.allPunjabiLessons,
    COURSE.punjabiLessons,
    COURSE.lessons,
    COURSE.default,
  ];

  for (const candidate of candidates) {
    const arr = asArray(candidate);
    if (arr.length > 0) return arr;
  }

  return [];
}

const ALL_LESSONS = collectLessons();

function textFrom(value: unknown, uiLang: UiLang): string | null {
  if (typeof value === "string" && value.trim()) return value;
  const obj = asRecord(value);
  if (!obj) return null;
  const preferred = obj[uiLang];
  if (typeof preferred === "string" && preferred.trim()) return preferred;
  const english = obj.en;
  if (typeof english === "string" && english.trim()) return english;
  const vietnamese = obj.vi;
  if (typeof vietnamese === "string" && vietnamese.trim()) return vietnamese;
  return null;
}

function pickText(lesson: LessonRecord, uiLang: UiLang, keys: string[]): string | null {
  for (const key of keys) {
    const value = textFrom(lesson[key], uiLang);
    if (value) return value;
  }
  return null;
}

function lessonTitle(lesson: LessonRecord, uiLang: UiLang, index: number): string {
  return (
    pickText(lesson, uiLang, [
      "title",
      "title_" + uiLang,
      "titleEn",
      "title_en",
      "name",
      "label",
    ]) ?? "Punjabi lesson " + String(index + 1)
  );
}

function lessonDescription(lesson: LessonRecord, uiLang: UiLang): string {
  return (
    pickText(lesson, uiLang, [
      "description",
      "description_" + uiLang,
      "summary",
      "summary_" + uiLang,
      "goal",
      "goal_" + uiLang,
      "learner_goal",
      "learner_goal_" + uiLang,
      "intro",
      "intro_" + uiLang,
    ]) ?? "Gurmukhi is the primary script; romanization is only a bridge. Shahmukhi is awareness-only unless a future full track is approved."
  );
}

function lessonLevel(lesson: LessonRecord): string {
  const level = lesson.level ?? lesson.cefr ?? lesson.cefrLevel;
  return typeof level === "string" && level.trim() ? level : "Lesson";
}

export default function PunjabiLessonsPage() {
  const uiLang: UiLang = "vi";

  const lessons = useMemo(() => ALL_LESSONS.slice(0, 96), []);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <nav aria-label="Language navigation">
        <Link
          to="/languages"
          className="text-sm font-semibold text-blue-700 underline-offset-4 hover:underline"
        >
          ← Xem ngôn ngữ khác / View other languages
        </Link>
      </nav>

      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-200">
          ਪੰਜਾਬੀ
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Punjabi lessons
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-100">
          {uiLang === "vi" ? "Bài học Punjabi thực dụng với Gurmukhi làm chữ chính, kèm ngữ cảnh sinh tồn Canada khi phù hợp." : "Practical Punjabi lessons with Gurmukhi-first reading and Canada survival contexts where useful."}
        </p>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Gurmukhi is the primary script; romanization is only a bridge. Shahmukhi is awareness-only unless a future full track is approved.
        </p>
      </section>

      <section aria-label="Punjabi lesson list" className="grid gap-4 md:grid-cols-2">
        {lessons.length === 0 ? (
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
            <h2 className="font-semibold">Lessons are being prepared</h2>
            <p className="mt-2 text-sm">
              The Punjabi route is public, but no lesson array was exported yet.
            </p>
          </article>
        ) : (
          lessons.map((lesson, index) => (
            <article
              key={String(lesson.id ?? lesson.slug ?? index)}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-950">
                  {lessonTitle(lesson, uiLang, index)}
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {lessonLevel(lesson)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {lessonDescription(lesson, uiLang)}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
