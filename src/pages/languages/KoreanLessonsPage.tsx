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
import AITutorCtaBanner from "@/components/languages/AITutorCtaBanner";

import {
  KOREAN_TOTAL_LESSONS,
  type KoreanCefrLevel,
  type KoreanLesson,
} from "@/languages/korean/lessons";
import { normalizeKoreanLesson } from "@/languages/korean/normalize";
import { fetchLessonsBatch } from "@/hooks/useLessonData";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillColors,
  cefrPillLabel,
} from "@/components/languages/lessonThemes";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";

// HERO_VI is the Vietnamese-audience line — left untouched (Vietnamese-
// first). HERO_EN is the English-facing line: de-narrowed so English
// speakers (who can now use the app) are not told it is "for
// Vietnamese learners". Shown conditionally on the global uiLang.
const HERO_VI =
  "Tiếng Hàn cho người Việt — từ hangul đến diễn ngôn nâng cao.";
const HERO_EN =
  "Korean — real-life lessons, explained clearly. From hangul to advanced discourse.";

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
  // Global gloss language (default "vi"); toggle lives in the chrome band.
  const [uiLang] = useLessonUiLang();

  useEffect(() => {
    let cancelled = false;
    setLessons(null);
    fetchLessonsBatch<KoreanLesson>("korean", level.toLowerCase())
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[KoreanLessonsPage] fetch failed", level, err);
          setLessons([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

  // Defensive: one malformed lesson row must not crash the whole level.
  type Normalized = ReturnType<typeof normalizeKoreanLesson>;
  const normalized = (lessons ?? [])
    .map((l): Normalized | null => {
      try {
        return normalizeKoreanLesson(l);
      } catch (err) {
        console.warn("[KoreanLessonsPage] skipping malformed lesson:", err);
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
          🇰🇷 Tiếng Hàn · Korean
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
            ? `${KOREAN_TOTAL_LESSONS} lessons`
            : `${KOREAN_TOTAL_LESSONS} bài · ${KOREAN_TOTAL_LESSONS} lessons`}
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

        <AITutorCtaBanner uiLang={uiLang} target="ko" />
      </header>

      <nav
        aria-label={uiLang === "en" ? "Choose level" : "Chọn cấp độ"}
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
