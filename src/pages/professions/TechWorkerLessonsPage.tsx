// src/pages/professions/TechWorkerLessonsPage.tsx
// Route: /professions/tech-worker
//
// Landing page for the tech-worker profession pack. 50 lessons across
// 8 categories — interviews, standup, PR review, bug reporting, demos,
// on-call, career, team dynamics. Mirrors the nail-tech and
// customer-service pages so the look-and-feel stays consistent across
// the profession-pack series.
//
// Lessons render inline (expandable tiles) — same rationale as the
// other pages: avoid expanding the roomRegistry by 50 JSON files. The
// tech_worker_<slug> IDs are forward-compatible if any lesson is
// promoted to a full room later.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Lightbulb,
  Volume2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  TECH_WORKER_CATEGORIES,
  TECH_WORKER_PACK,
  getLessonsByCategory,
  type TechWorkerCategoryMeta,
  type TechWorkerLesson,
} from "@/data/profession-packs/tech-worker/content";

const HERO_VI =
  "Tiếng Anh cho người làm tech: dev, QA, PM, designer và DevOps.";
const HERO_EN =
  "English for tech workers — engineers, QA, technical PMs, designers, devops.";
const SUBHEAD_VI =
  "Viết cho người Việt — học cách giao tiếp trong môi trường kỹ thuật ở Mỹ.";

export default function TechWorkerLessonsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-violet-50 to-blue-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
          {TECH_WORKER_PACK.title_en}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-sm font-semibold text-indigo-800">
          {SUBHEAD_VI}
        </p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {TECH_WORKER_PACK.intro_vi}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          50 bài · 8 chủ đề · phiên bản hội thoại đời thực
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/professions"
            className="font-medium text-indigo-700 underline"
          >
            Xem các nghề khác / View other professions
          </Link>
        </p>
      </header>

      <div className="space-y-5">
        {TECH_WORKER_CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: TechWorkerCategoryMeta;
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
  lesson: TechWorkerLesson;
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
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-700">
                    <Volume2 className="h-3 w-3" />
                    {s.pronunciation_focus.join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              <Code2 className="h-3 w-3" />
              Văn hoá kỹ thuật ở Mỹ
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">
              {lesson.cultural_notes_vi}
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <Lightbulb className="h-3 w-3" />
              Mẹo nghề
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
