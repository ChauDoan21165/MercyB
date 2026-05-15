// src/pages/languages/FrenchLessonsPage.tsx — /languages/french
//
// Phase 0 PR-E: French cuts over to the shared <LessonRenderer>.
// Lesson rendering goes through normalizeFrenchLesson → LessonRenderer;
// category grouping (FRENCH_CATEGORIES) stays at the page level since
// it's French-specific UX.
//
// Lazy-load split: the page loads only the selected level's lessons
// (lessons-a1.ts ... lessons-c2.ts) on demand and groups them into
// categories at render time.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FRENCH_CATEGORIES,
  FRENCH_TOTAL_LESSONS,
  type FrenchCategoryMeta,
  type FrenchCefrLevel,
  type FrenchLesson,
} from "@/languages/french/lessons";
import { normalizeFrenchLesson } from "@/languages/french/normalize";
import { fetchLessonsBatch } from "@/hooks/useLessonData";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillLabels,
} from "@/components/languages/lessonThemes";
import type { LessonTheme } from "@/components/languages/LessonRenderer.types";
import LessonUiLangToggle, {
  useLessonUiLang,
} from "@/components/mercy-guide/tabs/LessonUiLangToggle";
import type { LessonUiLang } from "@/components/mercy-guide/tabs/LanguageLessonsView";

const HERO_VI =
  "Tiếng Pháp cho người Việt — từ chào hỏi đến gọi món ăn.";
const HERO_EN =
  "French for Vietnamese learners — from bonjour to l'addition.";

const FRENCH_LEVELS: ReadonlyArray<FrenchCefrLevel> = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export default function FrenchLessonsPage() {
  const theme = lessonThemes.french;
  const [level, setLevel] = useState<FrenchCefrLevel>("A1");
  const [lessons, setLessons] = useState<FrenchLesson[] | null>(null);
  const [uiLang, setUiLang] = useLessonUiLang();

  useEffect(() => {
    let cancelled = false;
    setLessons(null);
    fetchLessonsBatch<FrenchLesson>("french", level.toLowerCase())
      .then((arr) => {
        if (!cancelled) setLessons(arr);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[FrenchLessonsPage] fetch failed", level, err);
          setLessons([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

  const lessonsByCategory = useMemo(() => {
    const map = new Map<string, FrenchLesson[]>();
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
      <header className="mb-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Tiếng Pháp · French
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          Phát âm viết riêng cho người Việt. Âm mũi, âm câm, liaison — giải thích theo cách người Việt hiểu.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {FRENCH_TOTAL_LESSONS} bài · A1 → C2
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium text-blue-700 underline"
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>
      </header>

      <div className="mb-3 flex justify-end">
        <LessonUiLangToggle value={uiLang} onChange={setUiLang} />
      </div>

      <nav
        aria-label="Chọn cấp độ"
        className="mb-4 flex flex-wrap gap-2"
      >
        {FRENCH_LEVELS.map((lv) => {
          const active = lv === level;
          return (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
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
          {FRENCH_CATEGORIES.map((cat) => {
            const catLessons = lessonsByCategory.get(cat.id);
            if (!catLessons || catLessons.length === 0) return null;
            return (
              <CategorySection
                key={cat.id}
                category={cat}
                lessons={catLessons}
                theme={theme}
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
  theme,
  uiLanguage,
}: {
  category: FrenchCategoryMeta;
  lessons: FrenchLesson[];
  theme: LessonTheme;
  uiLanguage: LessonUiLang;
}) {
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
        {lessons.flatMap((lesson, i) => {
          // Defensive: skip rows whose content is malformed rather than
          // crash the whole category.
          let normalized;
          try {
            normalized = normalizeFrenchLesson(lesson, i + 1);
          } catch (err) {
            console.warn(
              "[FrenchLessonsPage] skipping malformed lesson:",
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
