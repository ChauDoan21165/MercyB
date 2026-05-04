// src/pages/languages/KoreanLessonsPage.tsx — /languages/korean
//
// Phase 0 Task 5 PR-C: Korean cuts over from the shared
// LanguageLessonsPage (which Chinese still uses) to the dedicated
// shared <LessonRenderer> component. Hero copy is inlined here so
// LanguageLessonsPage can be deleted independently when Chinese cuts
// over later.

import { Link } from "react-router-dom";

import { lessons as KOREAN_LESSONS } from "@/languages/korean/lessons";
import { normalizeKoreanLesson } from "@/languages/korean/normalize";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillColors,
  cefrPillLabels,
} from "@/components/languages/lessonThemes";

const HERO_VI =
  "Tiếng Hàn cho người Việt — 50 bài từ hangul đến ngữ pháp nền tảng.";
const HERO_EN =
  "Korean for Vietnamese learners — 50 lessons from hangul to foundational grammar.";

const KOREAN_LEVELS = ["A1", "A2", "B1", "B2"] as const;

export default function KoreanLessonsPage() {
  const theme = lessonThemes.korean;
  const normalized = KOREAN_LESSONS.map((lesson) =>
    normalizeKoreanLesson(lesson),
  );

  const grouped = KOREAN_LEVELS.map((level) => ({
    level,
    lessons: normalized.filter((l) => l.level === level),
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
          🇰🇷 Tiếng Hàn · Korean
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p
          className="mt-2 text-sm font-bold"
          style={{ color: theme.accent }}
        >
          {KOREAN_LESSONS.length} bài · {KOREAN_LESSONS.length} lessons
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
                    {group.lessons.length} bài
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
