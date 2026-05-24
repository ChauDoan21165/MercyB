// src/pages/languages/GermanLessonsPage.tsx — /languages/german
//
// Phase 0 PR-F: German cuts over to the shared <LessonRenderer>.
// Existing category grouping (26 GERMAN_CATEGORIES) is preserved
// verbatim — German is category-organized within each level.
//
// Lazy-load split: the page loads only the selected level's lessons
// (lessons-a1.ts ... lessons-c2.ts) on demand and groups them into
// categories at render time.

// Phase 2 pilot: a FeaturedB2Lesson component at the top of the B2
// view fetches a single lesson from Supabase via useLessonData.
// The rest of the B2 lessons still load via the lazy import.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AITutorCtaBanner from "@/components/languages/AITutorCtaBanner";
import { useLessonData } from "@/hooks/useLessonData";

import {
  GERMAN_CATEGORIES,
  GERMAN_TOTAL_LESSONS,
  type GermanCategoryMeta,
  type GermanCefrLevel,
  type GermanLesson,
} from "@/languages/german/lessons";
import { normalizeGermanLesson } from "@/languages/german/normalize";
import { fetchLessonsBatch } from "@/hooks/useLessonData";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillLabel,
} from "@/components/languages/lessonThemes";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";
import type { LessonUiLang } from "@/components/mercy-guide/tabs/LanguageLessonsView";

// HERO_VI = Vietnamese-audience line, untouched. HERO_EN = English-
// facing line, de-narrowed (no "for Vietnamese learners") so English
// speakers are not excluded. Shown conditionally on the global uiLang.
const HERO_VI =
  "Tiếng Đức cho người Việt — từ guten Tag đến cách (cases).";
const HERO_EN =
  "German — real-life lessons, explained clearly. From hallo to der/die/das.";

const GERMAN_LEVELS: ReadonlyArray<GermanCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export default function GermanLessonsPage() {
  const theme = lessonThemes.german;
  const [level, setLevel] = useState<GermanCefrLevel>("A1");
  const [lessons, setLessons] = useState<GermanLesson[] | null>(null);
  // Read-only here — the toggle now lives in the global chrome band
  // (AppHeroShell); this page just consumes the shared choice.
  const [uiLang] = useLessonUiLang();

  useEffect(() => {
    let cancelled = false;
    fetchLessonsBatch<GermanLesson>("german", level.toLowerCase())
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[GermanLessonsPage] fetch failed", level, err);
          setLessons([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

  const lessonsByCategory = useMemo(() => {
    const map = new Map<string, GermanLesson[]>();
    if (!lessons) return map;
    for (const lesson of lessons) {
      const cat = lesson.category ?? "uncategorized";
      const arr = map.get(cat);
      if (arr) arr.push(lesson);
      else map.set(cat, [lesson]);
    }
    return map;
  }, [lessons]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      {/* Phase 2 pilot: per-lesson Supabase fetch demonstrated on
          the first B2 lesson only. Other levels / lessons unchanged. */}
      {level === "B2" && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50/60 p-4">
          <p className="text-xs font-semibold text-red-700 mb-2">
            Phase 2 pilot · Supabase per-lesson fetch (index 0)
          </p>
          <FeaturedB2Lesson uiLanguage={uiLang} />
        </div>
      )}

      <header className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
          Tiếng Đức · German
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
            ? "Pronunciation written for English speakers. Umlauts (ü, ö), the ich-Laut 'ch', and noun gender — explained the way English speakers actually need."
            : "Phát âm viết riêng cho người Việt. Umlaut (ü, ö), 'ch' ich-Laut, giống danh từ — giải thích theo cách người Việt hiểu."}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {GERMAN_TOTAL_LESSONS} {uiLang === "en" ? "lessons" : "bài"} · A1 → C2
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium text-red-700 underline"
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>

        <AITutorCtaBanner uiLang={uiLang} target="de" />
      </header>

      <nav
        aria-label={uiLang === "en" ? "Choose level" : "Chọn cấp độ"}
        className="mb-4 flex flex-wrap gap-2"
      >
        {GERMAN_LEVELS.map((lv) => {
          const active = lv === level;
          return (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-red-600 bg-red-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
              aria-pressed={active}
            >
              {cefrPillLabel(lv, uiLang)}
            </button>
          );
        })}
      </nav>

      {lessons === null ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
          {uiLang === "en"
            ? `Loading ${cefrPillLabel(level, uiLang)} lessons…`
            : `Đang tải bài học cấp độ ${cefrPillLabel(level, uiLang)}…`}
        </p>
      ) : lessons.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
          {uiLang === "en"
            ? "No lessons available for this level yet."
            : "Chưa có bài học cho cấp độ này."}
        </p>
      ) : (
        <div className="space-y-5">
          {GERMAN_CATEGORIES.map((cat) => {
            const catLessons = lessonsByCategory.get(cat.id);
            if (!catLessons || catLessons.length === 0) return null;
            return (
              <CategorySection
                key={cat.id}
                category={cat}
                lessons={catLessons}
                uiLanguage={uiLang}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function CategorySection({
  category,
  lessons,
  uiLanguage,
}: {
  category: GermanCategoryMeta;
  lessons: GermanLesson[];
  uiLanguage: LessonUiLang;
}) {
  const theme = lessonThemes.german;
  return (
    <section>
      <header className="mb-2 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          {uiLanguage === "en" ? category.title_en : category.title_vi}
        </h2>
        {/* Count only — the other-language category title was UI
            duplication of the <h2> above (which already picks uiLang). */}
        <span className="text-xs text-slate-500">
          {lessons.length}{" "}
          {uiLanguage === "en"
            ? lessons.length === 1
              ? "lesson"
              : "lessons"
            : "bài"}
        </span>
      </header>
      <ol className="space-y-2">
        {lessons.flatMap((lesson, idx) => {
          // Defensive: skip rows whose content is malformed rather than
          // crash the whole category.
          let normalized;
          try {
            normalized = normalizeGermanLesson(lesson, idx + 1);
          } catch (err) {
            console.warn(
              "[GermanLessonsPage] skipping malformed lesson:",
              err,
            );
            return [];
          }
          return [
            <li key={lesson.id}>
              <LessonRenderer
                lesson={normalized}
                theme={theme}
                uiLanguage={uiLanguage}
              />
            </li>,
          ];
        })}
      </ol>
    </section>
  );
}

// ── Phase 2 pilot: per-lesson Supabase fetch ────────────────────────

function FeaturedB2Lesson({ uiLanguage }: { uiLanguage: LessonUiLang }) {
  // 1-based lesson_index — matches DB storage. See useLessonData top comment.
  const { lesson, loading, error } = useLessonData("german", "b2", 1);
  const theme = lessonThemes.german;

  if (loading) {
    return (
      <div className="rounded-lg bg-slate-100 animate-pulse h-20 flex items-center justify-center">
        <span className="text-sm text-slate-400">
          Loading lesson from Supabase…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Could not load lesson. Please try again.
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-500">
        Lesson not found in database.
      </div>
    );
  }

  let normalized;
  try {
    normalized = normalizeGermanLesson(lesson as unknown as GermanLesson, 1);
  } catch (err) {
    console.warn("[FeaturedB2Lesson] malformed lesson content:", err);
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Could not render lesson. Please try again.
      </div>
    );
  }

  return (
    <div>
      <LessonRenderer
        lesson={normalized}
        theme={theme}
        uiLanguage={uiLanguage}
      />
    </div>
  );
}
