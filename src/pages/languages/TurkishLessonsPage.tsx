// src/pages/languages/TurkishLessonsPage.tsx — /languages/turkish
//
// Public Turkish lesson page. Renders the local A1-C2 lesson arrays from
// src/languages/turkish/index.ts as the first consumer of the language barrel.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useLessonUiLang } from "@/components/LessonUiLangToggle";
import AITutorCtaBanner from "@/components/languages/AITutorCtaBanner";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import type { LessonTheme } from "@/components/languages/LessonRenderer.types";
import {
  cefrPillLabel,
  lessonThemes,
} from "@/components/languages/lessonThemes";
import type { LessonUiLang } from "@/components/mercy-guide/tabs/LanguageLessonsView";
import {
  TURKISH_CATEGORIES,
  TURKISH_LESSONS_BY_LEVEL,
  TURKISH_TOTAL_LESSONS,
  TURKISH_VALIDATED_LEVELS,
  normalizeTurkishLesson,
  type TurkishCategoryMeta,
  type TurkishLessonInput,
  type TurkishLevel,
} from "@/languages/turkish";

const HERO_VI =
  "Tiếng Thổ Nhĩ Kỳ cho người Việt — từ chào hỏi đến tranh luận học thuật.";
const HERO_EN =
  "Turkish — practical local lessons from greetings to academic debate.";

export default function TurkishLessonsPage() {
  const theme = lessonThemes.turkish;
  const [level, setLevel] = useState<TurkishLevel>("A1");
  const [uiLang] = useLessonUiLang();

  const lessons = TURKISH_LESSONS_BY_LEVEL[level] ?? [];

  const lessonsByCategory = useMemo(() => {
    const map = new Map<string, TurkishLessonInput[]>();
    for (const lesson of lessons) {
      const existing = map.get(lesson.category);
      if (existing) existing.push(lesson);
      else map.set(lesson.category, [lesson]);
    }
    return map;
  }, [lessons]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-sky-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
          Tiếng Thổ Nhĩ Kỳ · Türkçe
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900">
          {uiLang === "en" ? HERO_EN : HERO_VI}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {uiLang === "en"
            ? "A1 to C2 Turkish lessons with vowel harmony, cases, daily life, shopping, work, healthcare, formal register, media, debate, and academic language."
            : "Bài học tiếng Thổ Nhĩ Kỳ từ A1 đến C2: hài hòa nguyên âm, các cách, sinh hoạt, mua sắm, công việc, y tế, văn phong trang trọng, truyền thông, tranh luận và học thuật."}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {TURKISH_TOTAL_LESSONS} {uiLang === "en" ? "lessons" : "bài"} · A1 → C2
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium text-red-700 underline"
          >
            Xem ngôn ngữ khác / View other languages
          </Link>
        </p>
        <AITutorCtaBanner uiLang={uiLang} target="tr" />
      </header>

      <nav
        aria-label={uiLang === "en" ? "Choose level" : "Chọn cấp độ"}
        className="mb-4 flex flex-wrap gap-2"
      >
        {TURKISH_VALIDATED_LEVELS.map((lv) => {
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

      <div className="space-y-5">
        {TURKISH_CATEGORIES.map((category) => {
          const categoryLessons = lessonsByCategory.get(category.id);
          if (!categoryLessons || categoryLessons.length === 0) return null;
          return (
            <CategorySection
              key={category.id}
              category={category}
              lessons={categoryLessons}
              theme={theme}
              uiLanguage={uiLang}
            />
          );
        })}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  lessons,
  theme,
  uiLanguage,
}: {
  category: TurkishCategoryMeta;
  lessons: TurkishLessonInput[];
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
                  lesson={normalizeTurkishLesson(lesson, i + 1)}
                  theme={theme}
                  uiLanguage={uiLanguage}
                />
              </li>,
            ];
          } catch (err) {
            console.warn("[TurkishLessonsPage] skipping malformed lesson:", err);
            return [];
          }
        })}
      </ol>
    </section>
  );
}
