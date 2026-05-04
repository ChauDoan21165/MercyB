// src/pages/languages/GermanLessonsPage.tsx — /languages/german
//
// Landing page for the German language module. 5 lessons across 5
// categories, each rendered as a tile that expands to show sentences,
// pronunciation focus, cultural notes, and tip advice.
//
// Pattern mirrors NailTechLessonsPage for UI consistency.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  Volume2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  GERMAN_CATEGORIES,
  getLessonsByCategory,
  type GermanCategoryMeta,
  type GermanLesson,
} from "@/languages/german/lessons";

const HERO_VI =
  "Tiếng Đức cho người Việt — từ guten Tag đến cách (cases).";
const HERO_EN =
  "German for Vietnamese learners — from hallo to der/die/das.";

export default function GermanLessonsPage() {
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
          20 bài · phát âm thực tế
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

interface CategorySectionProps {
  category: GermanCategoryMeta;
}

function CategorySection({ category }: CategorySectionProps) {
  const lessons = getLessonsByCategory(category.id);
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
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonTile lesson={lesson} />
          </li>
        ))}
      </ol>
    </section>
  );
}

interface LessonTileProps {
  lesson: GermanLesson;
}

function LessonTile({ lesson }: LessonTileProps) {
  const [open, setOpen] = useState(false);
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900">
            {lesson.title_vi}
          </p>
          <p className="text-xs text-slate-500">{lesson.title_en}</p>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 space-y-3">
          <ol className="space-y-2">
            {lesson.sentences.map((s, i) => (
              <li
                key={i}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <p className="text-sm font-medium text-slate-900">{s.en}</p>
                <p className="mt-1 text-xs text-slate-600">{s.vi}</p>
                {s.pronunciation_focus.length > 0 && (
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-red-700">
                    <Volume2 className="h-3 w-3" />
                    {s.pronunciation_focus.join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className="rounded-lg border border-red-100 bg-red-50/60 p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-red-700">
              <Sparkles className="h-3 w-3" />
              Văn hoá Đức
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">
              {lesson.cultural_notes_vi}
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <Lightbulb className="h-3 w-3" />
              Mẹo học
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">
              {lesson.tip_advice_vi}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
