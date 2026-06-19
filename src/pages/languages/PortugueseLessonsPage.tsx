// src/pages/languages/PortugueseLessonsPage.tsx — /languages/portuguese
//
// Public Portuguese lesson page. A4 deliberately renders the validated local
// A1-C2 arrays from src/languages/portuguese/index.ts instead of Supabase:
// Portuguese rows in public.lessons have not been proven, while A3 validated
// the local top-level curriculum. The generated extra/** bank, audio, and tutor
// support remain out of scope.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  PORTUGUESE_CATEGORIES,
  PORTUGUESE_LESSONS_BY_LEVEL,
  PORTUGUESE_TOTAL_LESSONS,
  PORTUGUESE_VALIDATED_LEVELS,
  normalizePortugueseLesson,
  type PortugueseCategoryMeta,
  type PortugueseLessonInput,
  type PortugueseLevel,
} from "@/languages/portuguese";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import {
  lessonThemes,
  cefrPillLabel,
} from "@/components/languages/lessonThemes";
import type { LessonTheme } from "@/components/languages/LessonRenderer.types";
import { useLessonUiLang } from "@/components/LessonUiLangToggle";
import type { LessonUiLang } from "@/components/mercy-guide/tabs/LanguageLessonsView";

const HERO_VI =
  "Tiếng Bồ Đào Nha Brazil cho người Việt — từ chào hỏi đến tranh luận học thuật.";
const HERO_EN =
  "Brazilian Portuguese — real-life lessons, explained clearly. From oi to academic debate.";

export default function PortugueseLessonsPage() {
  const theme = lessonThemes.portuguese;
  const [level, setLevel] = useState<PortugueseLevel>("A1");
  const [uiLang] = useLessonUiLang();

  const lessons = PORTUGUESE_LESSONS_BY_LEVEL[level] ?? [];

  const lessonsByCategory = useMemo(() => {
    const map = new Map<string, PortugueseLessonInput[]>();
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
      <header className="mb-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-red-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Tiếng Bồ Đào Nha · Brazilian Portuguese
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {uiLang === "en" ? HERO_EN : HERO_VI}
        </h1>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {uiLang === "en"
            ? "Brazilian pronunciation, practical dialogues, vocabulary, grammar, and culture notes across A1 to C2."
            : "Phát âm Brazil, hội thoại thực tế, từ vựng, ngữ pháp và ghi chú văn hoá từ A1 đến C2."}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {PORTUGUESE_TOTAL_LESSONS} {uiLang === "en" ? "lessons" : "bài"} · A1 → C2
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium text-emerald-700 underline"
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>
      </header>

      <nav
        aria-label={uiLang === "en" ? "Choose level" : "Chọn cấp độ"}
        className="mb-4 flex flex-wrap gap-2"
      >
        {PORTUGUESE_VALIDATED_LEVELS.map((lv) => {
          const active = lv === level;
          return (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                active
                  ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
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
        <p className="rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-500">
          {uiLang === "en"
            ? "No lessons available for this level yet."
            : "Chưa có bài học cho cấp độ này."}
        </p>
      ) : (
        <div className="space-y-5">
          {PORTUGUESE_CATEGORIES.map((cat) => {
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
  category: PortugueseCategoryMeta;
  lessons: PortugueseLessonInput[];
  theme: LessonTheme;
  uiLanguage: LessonUiLang;
}) {
  return (
    <section>
      <header className="mb-2 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          {uiLanguage === "en" ? category.title_en : category.title_vi}
        </h2>
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
        {lessons.flatMap((lesson, i) => {
          try {
            return [
              <li key={lesson.id}>
                <LessonRenderer
                  lesson={normalizePortugueseLesson(lesson, i + 1)}
                  theme={theme}
                  uiLanguage={uiLanguage}
                />
              </li>,
            ];
          } catch (err) {
            console.warn(
              "[PortugueseLessonsPage] skipping malformed lesson:",
              err,
            );
            return [];
          }
        })}
      </ol>
    </section>
  );
}
