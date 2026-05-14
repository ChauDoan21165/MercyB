// src/pages/languages/SpanishLessonsPage.tsx — /languages/spanish
//
// Spanish-for-English-speakers vertical. FIRST module whose source/UI
// language is English rather than Vietnamese. Mirrors the structure of
// FrenchLessonsPage but with:
//   - English hero copy (no Vietnamese subtitle)
//   - English CEFR pill labels (overrides cefrPillLabels for this page)
//   - English category section headers (driven by SpanishCategoryMeta.title)
//   - <LessonRenderer uiLanguage="en" /> so renderer chrome is English too
//
// Categories filter to the currently selected level — A2 headers don't
// appear on the A1 view. Empty-state copy is English.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  SPANISH_CATEGORIES,
  SPANISH_TOTAL_LESSONS,
  type SpanishCategoryMeta,
  type SpanishCefrLevel,
  type SpanishLesson,
} from "@/languages/spanish/lessons";
import { normalizeSpanishLesson } from "@/languages/spanish/normalize";
import { fetchLessonsBatch } from "@/hooks/useLessonData";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import { lessonThemes } from "@/components/languages/lessonThemes";
import type { LessonTheme } from "@/components/languages/LessonRenderer.types";

const SPANISH_LEVELS: ReadonlyArray<SpanishCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

// English CEFR pill labels — overrides cefrPillLabels (which is Vietnamese).
// Local to this page so the global map stays Vietnamese-default for the
// six existing language verticals.
const CEFR_PILL_LABELS_EN: Record<SpanishCefrLevel, string> = {
  A1: "A1 · Beginner",
  A2: "A2 · Elementary",
  B1: "B1 · Intermediate",
  B2: "B2 · Upper-Intermediate",
  C1: "C1 · Advanced",
  C2: "C2 · Mastery",
};

export default function SpanishLessonsPage() {
  const theme = lessonThemes.spanish;
  const [level, setLevel] = useState<SpanishCefrLevel>("A1");
  const [lessons, setLessons] = useState<SpanishLesson[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLessons(null);
    fetchLessonsBatch<SpanishLesson>("spanish", level.toLowerCase())
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[SpanishLessonsPage] fetch failed", level, err);
          setLessons([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

  const lessonsByCategory = useMemo(() => {
    const map = new Map<string, SpanishLesson[]>();
    if (!lessons) return map;
    for (const lesson of lessons) {
      const cat = lesson.category ?? "uncategorized";
      const arr = map.get(cat);
      if (arr) arr.push(lesson);
      else map.set(cat, [lesson]);
    }
    return map;
  }, [lessons]);

  // Only show category headers for the selected level — keeps the page
  // tight when only A1 is populated and A2-C2 are empty.
  const categoriesForLevel = useMemo(
    () => SPANISH_CATEGORIES.filter((c) => c.level === level),
    [level],
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-red-50 to-amber-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          Spanish · Español
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          Spanish for English Speakers
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          From <em>hola</em> to fluency — A1 through C2. Built for English speakers who want real Spanish, not translation-textbook Spanish.
        </p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          Ser vs estar from day one. Por vs para explained the way you actually need to hear it. Peninsular and Latin American variants throughout — you'll know which one you're learning and when.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {SPANISH_TOTAL_LESSONS} lessons · A1 → C2
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link to="/languages" className="font-medium text-rose-700 underline">
            ← All languages
          </Link>
        </p>
      </header>

      <nav aria-label="Choose a level" className="mb-4 flex flex-wrap gap-2">
        {SPANISH_LEVELS.map((lv) => {
          const active = lv === level;
          return (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-rose-600 bg-rose-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
              aria-pressed={active}
            >
              {CEFR_PILL_LABELS_EN[lv]}
            </button>
          );
        })}
      </nav>

      {lessons === null ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
          Loading {CEFR_PILL_LABELS_EN[level]} lessons…
        </p>
      ) : lessons.length === 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-5 text-sm text-amber-900">
          <p className="font-semibold">No {level} lessons available yet.</p>
          <p className="mt-1 text-xs text-amber-800">
            A1 is shipping first; A2 through C2 land in subsequent rounds.
            Check back, or pick another level above to see what's live.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {categoriesForLevel.map((cat) => {
            const catLessons = lessonsByCategory.get(cat.id);
            if (!catLessons || catLessons.length === 0) return null;
            return (
              <CategorySection
                key={cat.id}
                category={cat}
                lessons={catLessons}
                theme={theme}
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
  theme,
}: {
  category: SpanishCategoryMeta;
  lessons: SpanishLesson[];
  theme: LessonTheme;
}) {
  return (
    <section>
      <header className="mb-2 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          {category.title}
        </h2>
        <span className="text-xs text-slate-500">
          {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
        </span>
      </header>
      <ol className="space-y-2">
        {lessons.flatMap((lesson, i) => {
          let normalized;
          try {
            normalized = normalizeSpanishLesson(lesson, i + 1);
          } catch (err) {
            console.warn(
              "[SpanishLessonsPage] skipping malformed lesson:",
              err,
            );
            return [];
          }
          return [
            <li key={lesson.id}>
              <LessonRenderer
                lesson={normalized}
                theme={theme}
                uiLanguage="en"
              />
            </li>,
          ];
        })}
      </ol>
    </section>
  );
}
