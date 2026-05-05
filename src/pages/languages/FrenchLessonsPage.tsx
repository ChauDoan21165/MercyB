// src/pages/languages/FrenchLessonsPage.tsx — /languages/french
//
// Phase 0 PR-E: French cuts over to the shared <LessonRenderer>.
// Lesson rendering goes through normalizeFrenchLesson → LessonRenderer;
// category grouping (FRENCH_CATEGORIES + getLessonsByCategory) stays at
// the page level since it's French-specific UX.

import { Link } from "react-router-dom";

import {
  FRENCH_CATEGORIES,
  getLessonsByCategory,
  type FrenchCategoryMeta,
} from "@/languages/french/lessons";
import { normalizeFrenchLesson } from "@/languages/french/normalize";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import { lessonThemes } from "@/components/languages/lessonThemes";
import type { LessonTheme } from "@/components/languages/LessonRenderer.types";

const HERO_VI =
  "Tiếng Pháp cho người Việt — từ chào hỏi đến gọi món ăn.";
const HERO_EN =
  "French for Vietnamese learners — from bonjour to l'addition.";

export default function FrenchLessonsPage() {
  const theme = lessonThemes.french;
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
          50 bài · 26 chủ đề · A1 → B2
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

      <div className="space-y-5">
        {FRENCH_CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} category={cat} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  theme,
}: {
  category: FrenchCategoryMeta;
  theme: LessonTheme;
}) {
  const lessons = getLessonsByCategory(category.id);
  if (lessons.length === 0) return null;
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
        {lessons.map((lesson, i) => (
          <li key={lesson.id}>
            <LessonRenderer
              lesson={normalizeFrenchLesson(lesson, i + 1)}
              theme={theme}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
