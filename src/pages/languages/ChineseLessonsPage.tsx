// src/pages/languages/ChineseLessonsPage.tsx — /languages/chinese
//
// Phase 0 PR-D: Chinese cuts over from the shared LanguageLessonsPage
// to the dedicated shared <LessonRenderer> component. Korean already
// migrated in PR-C (commit 939791ae); Chinese is the last user of
// LanguageLessonsPage, which is deleted in this same commit.
//
// Lazy-load split: lesson data lives in per-level files
// (lessons-a1.ts ... lessons-c2.ts) and is fetched on demand via
// loadLessonsForLevel from the lazy registry. The page boots showing
// A1 only; switching levels triggers a brief load of that level's
// chunk.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  CHINESE_TOTAL_LESSONS,
  loadLessonsForLevel,
  type ChineseCefrLevel,
  type ChineseLesson,
} from "@/languages/chinese/lessons";
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

const CHINESE_LEVELS: ReadonlyArray<ChineseCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export default function ChineseLessonsPage() {
  const theme = lessonThemes.chinese;
  const [level, setLevel] = useState<ChineseCefrLevel>("A1");
  const [lessons, setLessons] = useState<ChineseLesson[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLessons(null);
    loadLessonsForLevel(level)
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[ChineseLessonsPage] level load failed", level, err);
          setLessons([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

  const normalized = (lessons ?? []).map((l) => normalizeChineseLesson(l));

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
          {CHINESE_TOTAL_LESSONS} bài · {CHINESE_TOTAL_LESSONS} lessons
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
        {CHINESE_LEVELS.map((lv) => {
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
