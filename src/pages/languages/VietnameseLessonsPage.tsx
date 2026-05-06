// src/pages/languages/VietnameseLessonsPage.tsx — /languages/vietnamese

import { Link } from "react-router-dom";

import { VIETNAMESE_LESSONS } from "@/languages/vietnamese/lessons";
import { normalizeVietnameseLesson } from "@/languages/vietnamese/normalize";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillColors,
  cefrPillLabels,
} from "@/components/languages/lessonThemes";

const HERO_TITLE = "Vietnamese for Foreigners";
const HERO_SUBTITLE =
  "Learn Vietnamese for real life in Vietnam: cafes, taxis, shops, help, and simple introductions.";
const VIETNAMESE_LEVELS = ["A1"] as const;

export default function VietnameseLessonsPage() {
  const theme = lessonThemes.vietnamese;
  const normalized = VIETNAMESE_LESSONS.map((lesson) =>
    normalizeVietnameseLesson(lesson),
  );
  const phraseCount = VIETNAMESE_LESSONS.reduce(
    (sum, lesson) => sum + lesson.phrases.length,
    0,
  );

  const grouped = VIETNAMESE_LEVELS.map((level) => ({
    level,
    lessons: normalized.filter((lesson) => lesson.level === level),
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header
        className="mb-6 rounded-2xl border p-5"
        style={{
          borderColor: `${theme.accent}33`,
          background: `linear-gradient(135deg, ${theme.accent}0A, ${theme.accent}05)`,
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: theme.accent }}
        >
          🇻🇳 Survival Vietnamese
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_TITLE}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          {HERO_SUBTITLE}
        </p>
        <p className="mt-2 text-sm font-bold" style={{ color: theme.accent }}>
          {VIETNAMESE_LESSONS.length} lessons · {phraseCount} phrases
        </p>
        <p className="mt-3 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium underline"
            style={{ color: theme.accent }}
          >
            ← All languages
          </Link>
        </p>
      </header>

      <div className="space-y-6">
        {grouped.map(
          (group) =>
            group.lessons.length > 0 && (
              <section key={group.level}>
                <header className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    {cefrPillLabels[group.level] ?? group.level}
                  </h2>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cefrPillColors[group.level] ?? ""}`}
                  >
                    {group.lessons.length} lessons
                  </span>
                </header>
                <div className="space-y-2">
                  {group.lessons.map((lesson) => (
                    <LessonRenderer
                      key={lesson.id}
                      lesson={lesson}
                      theme={theme}
                    />
                  ))}
                </div>
              </section>
            ),
        )}
      </div>
    </div>
  );
}
