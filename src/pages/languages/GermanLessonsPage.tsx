// src/pages/languages/GermanLessonsPage.tsx — /languages/german
//
// Phase 0 PR-F: German cuts over to the shared <LessonRenderer>.
// Existing category grouping (26 GERMAN_CATEGORIES) is preserved
// verbatim — German is category-organized, not CEFR-grouped like
// Korean/Japanese. Hero copy is unchanged. The previous bespoke
// LessonTile (~175 lines) is replaced by per-lesson <LessonRenderer>.

import { Link } from "react-router-dom";

import {
  GERMAN_CATEGORIES,
  getLessonsByCategory,
  type GermanCategoryMeta,
} from "@/languages/german/lessons";
import { normalizeGermanLesson } from "@/languages/german/normalize";
import { LessonRenderer } from "@/components/languages/LessonRenderer";
import { lessonThemes } from "@/components/languages/lessonThemes";

const HERO_VI =
  "Tiếng Đức cho người Việt — từ guten Tag đến cách (cases).";
const HERO_EN =
  "German for Vietnamese learners — from hallo to der/die/das.";

export default function GermanLessonsPage() {
  const theme = lessonThemes.german;

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
          50 bài · 26 chủ đề · A1 → B2
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

      <div className="space-y-5">
        {GERMAN_CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

function CategorySection({ category }: { category: GermanCategoryMeta }) {
  const lessons = getLessonsByCategory(category.id);
  const theme = lessonThemes.german;
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
