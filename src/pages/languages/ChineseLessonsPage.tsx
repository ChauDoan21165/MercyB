// src/pages/languages/ChineseLessonsPage.tsx — /languages/chinese
//
// Phase 0 PR-D: Chinese cuts over from the shared LanguageLessonsPage
// to the dedicated shared <LessonRenderer> component. Korean already
// migrated in PR-C (commit 939791ae); Chinese is the last user of
// LanguageLessonsPage, which is deleted in this same commit.

import { Link } from "react-router-dom";

import { lessons as CHINESE_LESSONS } from "@/languages/chinese/lessons";
import { normalizeChineseLesson } from "@/languages/chinese/normalize";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillColors,
  cefrPillLabels,
} from "@/components/languages/lessonThemes";

const HERO_VI =
  "Tiếng Trung cho người Việt — từ bính âm đến chữ Hán.";
const HERO_EN =
  "Chinese for Vietnamese learners — from pinyin to hanzi.";

const CHINESE_LEVELS = ["A1", "A2", "B1", "B2"] as const;

export default function ChineseLessonsPage() {
  const theme = lessonThemes.chinese;
  const normalized = CHINESE_LESSONS.map((lesson) =>
    normalizeChineseLesson(lesson),
  );

  const grouped = CHINESE_LEVELS.map((level) => ({
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
          🇨🇳 Tiếng Trung · Chinese
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p
          className="mt-2 text-sm font-bold"
          style={{ color: theme.accent }}
        >
          {CHINESE_LESSONS.length} bài · {CHINESE_LESSONS.length} lessons
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
