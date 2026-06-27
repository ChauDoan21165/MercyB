// src/pages/languages/IndonesianLessonsPage.tsx — /languages/indonesian
//
// Public Indonesian lesson page. Renders validated local A1-C2 lesson arrays
// from src/languages/indonesian/index.ts; generated extra/** lessons stay out
// of this product surface.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  INDONESIAN_CATEGORIES,
  INDONESIAN_LESSONS_BY_LEVEL,
  INDONESIAN_TOTAL_LESSONS,
  INDONESIAN_VALIDATED_LEVELS,
  normalizeIndonesianLesson,
  type IndonesianCategoryMeta,
  type IndonesianLessonInput,
  type IndonesianLevel,
} from "@/languages/indonesian";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillLabel,
} from "@/components/languages/lessonThemes";
import type { LessonTheme } from "@/components/languages/LessonRenderer.types";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";
import type { LessonUiLang } from "@/components/mercy-guide/tabs/LanguageLessonsView";

const HERO_VI =
  "Tiếng Indonesia cho người Việt — từ giao tiếp hằng ngày đến văn phong học thuật.";
const HERO_EN =
  "Indonesian — practical Bahasa Indonesia lessons from daily life to advanced register.";

export default function IndonesianLessonsPage() {
  const theme = lessonThemes.indonesian;
  const [level, setLevel] = useState<IndonesianLevel>("A1");
  const [uiLang] = useLessonUiLang();

  const lessons = INDONESIAN_LESSONS_BY_LEVEL[level] ?? [];

  const lessonsByCategory = useMemo(() => {
    const map = new Map<string, IndonesianLessonInput[]>();
    for (const lesson of lessons) {
      const cat = String((lesson as { category?: unknown }).category ?? "uncategorized");
      const arr = map.get(cat);
      if (arr) arr.push(lesson);
      else map.set(cat, [lesson]);
    }
    return map;
  }, [lessons]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-rose-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
          Tiếng Indonesia · Bahasa Indonesia
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {uiLang === "en" ? HERO_EN : HERO_VI}
        </h1>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {uiLang === "en"
            ? "A1 to C2 Indonesian lessons with practical dialogues, grammar, vocabulary, register notes, and clear Vietnamese/English explanations."
            : "Bài học tiếng Indonesia từ A1 đến C2: hội thoại thực tế, ngữ pháp, từ vựng, ghi chú văn phong, giải thích rõ bằng tiếng Việt và tiếng Anh."}
        </p>
        <p className="mt-3 text-xs text-slate-600">
          {INDONESIAN_TOTAL_LESSONS} {uiLang === "en" ? "lessons" : "bài"} · A1 → C2
        </p>
        <p className="mt-1 text-xs text-slate-600">
          <Link
            to="/languages"
            className="font-medium text-red-700 underline"
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>
      </header>

      <nav
        aria-label={uiLang === "en" ? "Choose level" : "Chọn cấp độ"}
        className="mb-4 flex flex-wrap gap-2"
      >
        {INDONESIAN_VALIDATED_LEVELS.map((lv) => {
          const active = lv === level;
          return (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-red-700 bg-red-700 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
              aria-pressed={active}
            >
              {cefrPillLabel(lv, uiLang)}
            </button>
          );
        })}
      </nav>

      {lessons.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-600">
          {uiLang === "en"
            ? "No lessons available for this level yet."
            : "Chưa có bài học cho cấp độ này."}
        </p>
      ) : (
        <div className="space-y-5">
          {INDONESIAN_CATEGORIES.map((cat) => {
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
  category: IndonesianCategoryMeta;
  lessons: IndonesianLessonInput[];
  theme: LessonTheme;
  uiLanguage: LessonUiLang;
}) {
  return (
    <section>
      <header className="mb-2 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          {uiLanguage === "en" ? category.title_en : category.title_vi}
        </h2>
        <span className="text-xs text-slate-600">
          {lessons.length}{" "}
          {uiLanguage === "en"
            ? lessons.length === 1
              ? "lesson"
              : "lessons"
            : "bài"}
        </span>
      </header>
      <ol className="space-y-2">
        {lessons.flatMap((lesson, i) => {
          try {
            return [
              <li key={lesson.id}>
                <LessonRenderer
                  lesson={normalizeIndonesianLesson(lesson, i + 1)}
                  theme={theme}
                  uiLanguage={uiLanguage}
                />
              </li>,
            ];
          } catch (err) {
            console.warn(
              "[IndonesianLessonsPage] skipping malformed lesson:",
              err,
            );
            return [];
          }
        })}
      </ol>
    </section>
  );
}
