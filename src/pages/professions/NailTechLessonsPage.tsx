// src/pages/professions/NailTechLessonsPage.tsx — /professions/nail-tech
//
// Renamed from NailTechnicianPage to avoid colliding with the existing
// `/pack/nail-tech` page (`src/pages/profession-packs/NailTechnicianPage.tsx`)
// that wraps the JSON vocab/phrase/scenario pack with tabs. This file
// ships the lesson-shape surface for the new 50-lesson layer.
//
// Landing page for the nail-technician profession pack. 50 lessons
// across 8 categories, each rendered as a tile that expands to show
// sentences, pronunciation focus, cultural notes, and tip advice.
//
// Why this page renders lessons inline instead of routing to per-room
// pages: the existing roomRegistry expects each room to have a JSON
// file in public/data/, and shipping 50 of those would expand the
// rooms:check prebuild surface considerably. The lesson IDs follow
// the nail_tech_<slug> convention so they can be migrated to full
// rooms in a follow-up without breaking deep links.

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
  NAIL_TECH_CATEGORIES,
  getLessonsByCategory,
  type NailTechCategoryMeta,
  type NailTechLesson,
} from "@/data/profession-packs/nail-technician/content";
import NAIL_PACK from "@/data/profession-packs/nail-technician";

const HERO_VI =
  "Tiếng Anh cho thợ nail. Viết cho người Việt, bởi người Việt.";
const HERO_EN =
  "English for nail technicians, built by Vietnamese, for Vietnamese.";

export default function NailTechLessonsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          {NAIL_PACK.title_en}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {NAIL_PACK.intro_vi}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          50 bài · 8 chủ đề · phiên bản hội thoại đời thực
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/professions"
            className="font-medium text-rose-700 underline"
          >
            Xem các nghề khác / View other professions
          </Link>
        </p>
      </header>

      <div className="space-y-5">
        {NAIL_TECH_CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: NailTechCategoryMeta;
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
  lesson: NailTechLesson;
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
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
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
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-700">
                    <Volume2 className="h-3 w-3" />
                    {s.pronunciation_focus.join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
              <Sparkles className="h-3 w-3" />
              Văn hoá Mỹ
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">
              {lesson.cultural_notes_vi}
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <Lightbulb className="h-3 w-3" />
              Mẹo đi tiệm
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
