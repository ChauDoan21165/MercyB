// src/pages/languages/JapaneseLessonsPage.tsx — /languages/japanese
//
// Phase 0 PR-G: Japanese cuts over to the shared <LessonRenderer>.
// Hero copy is preserved verbatim from the prior bespoke implementation.
//
// Lazy-load split: lesson data lives in per-level files
// (lessons-a1.ts ... lessons-c2.ts) and is fetched on demand via
// loadLessonsForLevel from the lazy registry.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  JAPANESE_TOTAL_LESSONS,
  type JapaneseCefrLevel,
  type JapaneseLesson,
} from "@/languages/japanese/lessons";
import { normalizeJapaneseLesson } from "@/languages/japanese/normalize";
import { fetchLessonsBatch } from "@/hooks/useLessonData";
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

const JAPANESE_LEVELS: ReadonlyArray<JapaneseCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export default function JapaneseLessonsPage() {
  const theme = lessonThemes.japanese;
  const [level, setLevel] = useState<JapaneseCefrLevel>("A1");
  const [lessons, setLessons] = useState<JapaneseLesson[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLessons(null);
    fetchLessonsBatch<JapaneseLesson>("japanese", level.toLowerCase())
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[JapaneseLessonsPage] fetch failed", level, err);
          setLessons([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

  const normalized = (lessons ?? []).map((l) => normalizeJapaneseLesson(l));

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
          {JAPANESE_TOTAL_LESSONS} bài · A1 → C2 · hội thoại thực tế
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

      <nav
        aria-label="Chọn cấp độ"
        className="mb-4 flex flex-wrap gap-2"
      >
        {JAPANESE_LEVELS.map((lv) => {
          const active = lv === level;
          return (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-amber-600 bg-amber-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
              aria-pressed={active}
            >
              {cefrPillLabels[lv] ?? lv}
            </button>
          );
        })}
      </nav>

      <section>
        <header className="mb-2 flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {cefrPillLabels[level] ?? level}
          </h2>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cefrPillColors[level] ?? ""}`}
          >
            {lessons === null ? "đang tải…" : `${normalized.length} bài`}
          </span>
        </header>

        {lessons === null ? (
          <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
            Đang tải bài học cấp độ {cefrPillLabels[level] ?? level}…
          </p>
        ) : normalized.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
            Chưa có bài học cho cấp độ này.
          </p>
        ) : (
          <div className="space-y-2">
            {normalized.map((lesson) => (
              <LessonRenderer
                key={lesson.id}
                lesson={lesson}
                theme={theme}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
