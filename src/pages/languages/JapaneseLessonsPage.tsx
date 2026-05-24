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
import AITutorCtaBanner from "@/components/languages/AITutorCtaBanner";

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
  cefrPillLabel,
} from "@/components/languages/lessonThemes";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";

// HERO_VI = Vietnamese-audience line, untouched. HERO_EN = English-
// facing line, de-narrowed (no "for Vietnamese learners"). Shown
// conditionally on the global uiLang.
const HERO_VI =
  "Tiếng Nhật cho người Việt — từ hiragana đến mẫu câu giao tiếp.";
const HERO_EN =
  "Japanese — real-life lessons, explained clearly. From hiragana to natural conversation.";

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
  // Global gloss language (default "vi"); toggle lives in the chrome band.
  const [uiLang] = useLessonUiLang();

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

  // Defensive: one malformed lesson row must not crash the whole level.
  type Normalized = ReturnType<typeof normalizeJapaneseLesson>;
  const normalized = (lessons ?? [])
    .map((l): Normalized | null => {
      try {
        return normalizeJapaneseLesson(l);
      } catch (err) {
        console.warn("[JapaneseLessonsPage] skipping malformed lesson:", err);
        return null;
      }
    })
    .filter((x): x is Normalized => x !== null);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          🇯🇵 Tiếng Nhật · Japanese
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {uiLang === "en" ? HERO_EN : HERO_VI}
        </h1>
        {/* Single-language hero: title shows only the active uiLang.
            The other-language secondary line was UI duplication (and,
            in EN mode, audience-exclusionary per #518) — removed so the
            hero honours the global toggle's promise in both modes. */}
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {uiLang === "en"
            ? "From the kana to intermediate grammar — explained clearly, with exercises, real dialogues, and memory tips."
            : "Từ bảng chữ cái đến ngữ pháp trung cấp — giải thích theo cách người Việt hiểu. Có bài tập, hội thoại thực tế, và mẹo ghi nhớ."}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {JAPANESE_TOTAL_LESSONS} {uiLang === "en" ? "lessons" : "bài"} · A1 → C2
          {uiLang === "en" ? " · real dialogues" : " · hội thoại thực tế"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium text-amber-700 underline"
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>

        <AITutorCtaBanner uiLang={uiLang} target="ja" />
      </header>

      <nav
        aria-label={uiLang === "en" ? "Choose level" : "Chọn cấp độ"}
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
