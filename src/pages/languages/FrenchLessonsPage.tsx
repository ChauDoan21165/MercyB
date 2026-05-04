// src/pages/languages/FrenchLessonsPage.tsx — /languages/french
//
// Landing page for the French language module. 50 lessons across 26
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
  FRENCH_CATEGORIES,
  getLessonsByCategory,
  type FrenchCategoryMeta,
  type FrenchLesson,
} from "@/languages/french/lessons";

const HERO_VI =
  "Tiếng Pháp cho người Việt — từ chào hỏi đến gọi món ăn.";
const HERO_EN =
  "French for Vietnamese learners — from bonjour to l'addition.";

export default function FrenchLessonsPage() {
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
          50 bài · 26 chủ đề · từ cơ bản đến B2
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
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: FrenchCategoryMeta;
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
  lesson: FrenchLesson;
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
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-700">
                    <Volume2 className="h-3 w-3" />
                    {s.pronunciation_focus.join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              <Sparkles className="h-3 w-3" />
              Văn hoá Pháp
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
          {lesson.vocabulary && lesson.vocabulary.length > 0 && (
            <div className="rounded-lg border border-green-100 bg-green-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                <Sparkles className="h-3 w-3" />
                Từ vựng ({lesson.vocabulary.length} từ)
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {lesson.vocabulary.map((v, vi) => (
                  <div key={vi} className="text-xs">
                    <span className="font-semibold text-slate-800">{v.word}</span>
                    <span className="text-slate-500"> — {v.vi}</span>
                    <span className="block text-[10px] text-slate-400">{v.pronunciation_vi}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lesson.dialogue && lesson.dialogue.length > 0 && (
            <div className="rounded-lg border border-purple-100 bg-purple-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                <Sparkles className="h-3 w-3" />
                Hội thoại
              </p>
              <div className="mt-2 space-y-2">
                {lesson.dialogue.map((d, di) => (
                  <div key={di} className="text-xs">
                    <span className="font-bold text-purple-700">{d.speaker}:</span>
                    <span className="text-slate-700"> {d.text}</span>
                    <span className="block text-[10px] text-slate-400 ml-4">{d.en}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lesson.exercises && lesson.exercises.length > 0 && (
            <div className="rounded-lg border border-orange-100 bg-orange-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                <Lightbulb className="h-3 w-3" />
                Bài tập
              </p>
              <ol className="mt-2 space-y-2">
                {lesson.exercises.map((ex, ei) => (
                  <li key={ei} className="text-xs text-slate-700">
                    <span className="font-semibold">{ei + 1}. {ex.type === "fill-blank" ? "Điền vào chỗ trống" : ex.type === "matching" ? "Nối" : "Dịch"}:</span>
                    <span> {ex.question || ex.vietnamese || ex.instruction || ""}</span>
                    {ex.answer && <span className="block text-[10px] text-green-600 mt-0.5">→ {ex.answer}</span>}
                    {ex.french && <span className="block text-[10px] text-green-600 mt-0.5">→ {ex.french}</span>}
                    {ex.pairs && <span className="block text-[10px] text-green-600 mt-0.5">→ {ex.pairs.map((p: string[]) => p.join(" - ")).join(", ")}</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}

        </div>
      )}
    </article>
  );
}
