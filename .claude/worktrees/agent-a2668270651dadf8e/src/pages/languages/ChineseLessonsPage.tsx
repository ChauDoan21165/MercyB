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
  type ChineseCefrLevel,
  type ChineseLesson,
} from "@/languages/chinese/lessons";
import { normalizeChineseLesson } from "@/languages/chinese/normalize";
import { fetchLessonsBatch } from "@/hooks/useLessonData";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillColors,
  cefrPillLabel,
} from "@/components/languages/lessonThemes";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";

// HERO_VI = Vietnamese-audience line, untouched. HERO_EN = English-
// facing line, de-narrowed (no "for Vietnamese learners"). Shown
// conditionally on the global uiLang.
const HERO_VI =
  "Tiếng Trung cho người Việt — từ bính âm đến chữ Hán.";
const HERO_EN =
  "Chinese — real-life lessons, explained clearly. From pinyin to hanzi.";

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
  // Global gloss language (default "vi"); toggle lives in the chrome band.
  const [uiLang] = useLessonUiLang();

  useEffect(() => {
    let cancelled = false;
    setLessons(null);
    fetchLessonsBatch<ChineseLesson>("chinese", level.toLowerCase())
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[ChineseLessonsPage] fetch failed", level, err);
          setLessons([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

  // Defensive: one malformed lesson row must not crash the whole level.
  type Normalized = ReturnType<typeof normalizeChineseLesson>;
  const normalized = (lessons ?? [])
    .map((l): Normalized | null => {
      try {
        return normalizeChineseLesson(l);
      } catch (err) {
        console.warn("[ChineseLessonsPage] skipping malformed lesson:", err);
        return null;
      }
    })
    .filter((x): x is Normalized => x !== null);

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
          {uiLang === "en" ? HERO_EN : HERO_VI}
        </h1>
        {/* Single-language hero: title shows only the active uiLang.
            The other-language secondary line was UI duplication (and,
            in EN mode, audience-exclusionary per #518) — removed so the
            hero honours the global toggle's promise in both modes. */}
        <p
          className="mt-2 text-sm font-bold"
          style={{ color: theme.accent }}
        >
          {uiLang === "en"
            ? `${CHINESE_TOTAL_LESSONS} lessons`
            : `${CHINESE_TOTAL_LESSONS} bài · ${CHINESE_TOTAL_LESSONS} lessons`}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium underline"
            style={{ color: theme.accent }}
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>
      </header>

      <nav
        aria-label={uiLang === "en" ? "Choose level" : "Chọn cấp độ"}
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
              {cefrPillLabel(lv, uiLang)}
            </button>
          );
        })}
      </nav>

      <section>
        <header className="mb-2 flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            {cefrPillLabel(level, uiLang)}
          </h2>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cefrPillColors[level] ?? ""}`}
          >
            {lessons === null
              ? uiLang === "en"
                ? "loading…"
                : "đang tải…"
              : `${normalized.length} ${uiLang === "en" ? "lessons" : "bài"}`}
          </span>
        </header>

        {lessons === null ? (
          <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
            {uiLang === "en"
              ? `Loading ${cefrPillLabel(level, uiLang)} lessons…`
              : `Đang tải bài học cấp độ ${cefrPillLabel(level, uiLang)}…`}
          </p>
        ) : normalized.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
            {uiLang === "en"
              ? "No lessons available for this level yet."
              : "Chưa có bài học cho cấp độ này."}
          </p>
        ) : (
          <div className="space-y-2">
            {normalized.map((lesson) => (
              <LessonRenderer
                key={lesson.id}
                lesson={lesson}
                theme={theme}
                uiLanguage={uiLang}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
