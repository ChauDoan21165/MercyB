// src/pages/languages/KoreanLessonsPage.tsx — /languages/korean
//
// Phase 0 Task 5 PR-C: Korean cuts over from the shared
// LanguageLessonsPage (which Chinese still uses) to the dedicated
// shared <LessonRenderer> component. Hero copy is inlined here so
// LanguageLessonsPage can be deleted independently when Chinese cuts
// over later.
//
// Lazy-load split: lesson data lives in per-level files
// (lessons-a1.ts ... lessons-c2.ts) and is fetched on demand via
// loadLessonsForLevel from the lazy registry.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  KOREAN_TOTAL_LESSONS,
  loadLessonsForLevel,
  type KoreanCefrLevel,
  type KoreanLesson,
} from "@/languages/korean/lessons";
import { normalizeKoreanLesson } from "@/languages/korean/normalize";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillColors,
  cefrPillLabels,
} from "@/components/languages/lessonThemes";

const HERO_VI =
  "Tiếng Hàn cho người Việt — từ hangul đến diễn ngôn nâng cao.";
const HERO_EN =
  "Korean for Vietnamese learners — from hangul to advanced discourse.";

const KOREAN_LEVELS: ReadonlyArray<KoreanCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export default function KoreanLessonsPage() {
  const theme = lessonThemes.korean;
  const [level, setLevel] = useState<KoreanCefrLevel>("A1");
  const [lessons, setLessons] = useState<KoreanLesson[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLessons(null);
    loadLessonsForLevel(level)
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[KoreanLessonsPage] level load failed", level, err);
          setLessons([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

  const normalized = (lessons ?? []).map((l) => normalizeKoreanLesson(l));

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
          {KOREAN_TOTAL_LESSONS} bài · {KOREAN_TOTAL_LESSONS} lessons
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

      <nav
        aria-label="Chọn cấp độ"
        className="mb-4 flex flex-wrap gap-2"
      >
        {KOREAN_LEVELS.map((lv) => {
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
              style={
                active
                  ? { backgroundColor: theme.accent }
                  : undefined
              }
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
