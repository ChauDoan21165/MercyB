// src/pages/languages/GermanLessonsPage.tsx — /languages/german
//
// Phase 0 PR-F: German cuts over to the shared <LessonRenderer>.
// Existing category grouping (26 GERMAN_CATEGORIES) is preserved
// verbatim — German is category-organized within each level.
//
// Lazy-load split: the page loads only the selected level's lessons
// (lessons-a1.ts ... lessons-c2.ts) on demand and groups them into
// categories at render time.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  GERMAN_CATEGORIES,
  GERMAN_TOTAL_LESSONS,
  loadLessonsForLevel,
  type GermanCategoryMeta,
  type GermanCefrLevel,
  type GermanLesson,
} from "@/languages/german/lessons";
import { normalizeGermanLesson } from "@/languages/german/normalize";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillLabels,
} from "@/components/languages/lessonThemes";

const HERO_VI =
  "Tiếng Đức cho người Việt — từ guten Tag đến cách (cases).";
const HERO_EN =
  "German for Vietnamese learners — from hallo to der/die/das.";

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

  useEffect(() => {
    let cancelled = false;
    setLessons(null);
    loadLessonsForLevel(level)
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[GermanLessonsPage] level load failed", level, err);
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
      <header className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
          Tiếng Đức · German
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          Phát âm viết riêng cho người Việt. Umlaut (ü, ö), 'ch' ich-Laut, giống danh từ — giải thích theo cách người Việt hiểu.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {GERMAN_TOTAL_LESSONS} bài · A1 → C2
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium text-red-700 underline"
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>
      </header>

      <nav
        aria-label="Chọn cấp độ"
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
              {cefrPillLabels[lv] ?? lv}
            </button>
          );
        })}
      </nav>

      {lessons === null ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
          Đang tải bài học cấp độ {cefrPillLabels[level] ?? level}…
        </p>
      ) : lessons.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
          Chưa có bài học cho cấp độ này.
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
}: {
  category: GermanCategoryMeta;
  lessons: GermanLesson[];
}) {
  const theme = lessonThemes.german;
  return (
    <section>
      <header className="mb-2 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          {category.title_vi}
        </h2>
        <span className="text-xs text-slate-500">
          {category.title_en} · {lessons.length} bài
        </span>
      </header>
      <ol className="space-y-2">
        {lessons.map((lesson, idx) => {
          const normalized = normalizeGermanLesson(lesson, idx + 1);
          return (
            <li key={lesson.id}>
              <LessonRenderer lesson={normalized} theme={theme} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
