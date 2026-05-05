// src/pages/languages/JapaneseLessonsPage.tsx — /languages/japanese
//
// Phase 0 PR-G: Japanese cuts over to the shared <LessonRenderer>.
// Hero copy is preserved verbatim from the prior bespoke implementation.

import { Link } from "react-router-dom";

import { lessons as JAPANESE_LESSONS } from "@/languages/japanese/lessons";
import { normalizeJapaneseLesson } from "@/languages/japanese/normalize";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillColors,
  cefrPillLabels,
} from "@/components/languages/lessonThemes";

const HERO_VI =
  "Tiếng Nhật cho người Việt — từ hiragana đến mẫu câu giao tiếp.";
const HERO_EN =
  "Japanese for Vietnamese learners — from hiragana to conversation.";

const JAPANESE_LEVELS = ["A1", "A2", "B1", "B2"] as const;

export default function JapaneseLessonsPage() {
  const theme = lessonThemes.japanese;
  const normalized = JAPANESE_LESSONS.map((lesson) =>
    normalizeJapaneseLesson(lesson),
  );

  const grouped = JAPANESE_LEVELS.map((level) => ({
    level,
    lessons: normalized.filter((l) => l.level === level),
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          🇯🇵 Tiếng Nhật · Japanese
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          Từ bảng chữ cái đến ngữ pháp trung cấp — giải thích theo cách người
          Việt hiểu. Có bài tập, hội thoại thực tế, và mẹo ghi nhớ.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {JAPANESE_LESSONS.length} bài · A1 → B2 · hội thoại thực tế
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium text-amber-700 underline"
          >
            Xem ngôn ngữ khác / View other languages
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
