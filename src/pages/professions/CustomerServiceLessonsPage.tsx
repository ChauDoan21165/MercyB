// src/pages/professions/CustomerServiceLessonsPage.tsx
// Route: /professions/customer-service
//
// Landing page for the customer-service profession pack. 50 lessons
// across 8 categories — call centers, retail support, banking
// front-line, telecom, e-commerce CS. Mirrors NailTechLessonsPage in
// shape so the feel is consistent across the profession-pack vertical.
//
// Lessons render inline (expandable tiles) instead of routing to per-room
// pages — same rationale as the nail-tech page: expanding the
// roomRegistry by 50 JSON files is heavyweight, and the customer_service_<slug>
// IDs are forward-compatible if we promote any of these lessons to
// full rooms later.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Headset,
  Lightbulb,
  Volume2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  CUSTOMER_SERVICE_CATEGORIES,
  CUSTOMER_SERVICE_PACK,
  getLessonsByCategory,
  type CustomerServiceCategoryMeta,
  type CustomerServiceLesson,
} from "@/data/profession-packs/customer-service/content";

const HERO_VI =
  "Tiếng Anh cho chăm sóc khách hàng: tổng đài, hỗ trợ bán lẻ và giao dịch ngân hàng.";
const HERO_EN =
  "English for customer service workers — call centers, retail support, banking, telecom, e-commerce.";
const SUBHEAD_VI =
  "Viết cho người Việt — học cách xử lý khách Mỹ một cách chuyên nghiệp.";

export default function CustomerServiceLessonsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
          {CUSTOMER_SERVICE_PACK.title_en}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-sm font-semibold text-sky-800">
          {SUBHEAD_VI}
        </p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {CUSTOMER_SERVICE_PACK.intro_vi}
        </p>
        <p className="mt-3 text-xs text-slate-600">
          50 bài · 8 chủ đề · phiên bản hội thoại đời thực
        </p>
        <p className="mt-1 text-xs text-slate-600">
          <Link
            to="/professions"
            className="font-medium text-sky-700 underline"
          >
            Xem các nghề khác / View other professions
          </Link>
        </p>
      </header>

      <div className="space-y-5">
        {CUSTOMER_SERVICE_CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: CustomerServiceCategoryMeta;
}

function CategorySection({ category }: CategorySectionProps) {
  const lessons = getLessonsByCategory(category.id);
  return (
    <section>
      <header className="mb-2 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          {category.title_vi}
        </h2>
        <span className="text-xs text-slate-600">
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
  lesson: CustomerServiceLesson;
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
          <p className="text-xs text-slate-600">{lesson.title_en}</p>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-600" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-600" />
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

          <div className="rounded-lg border border-sky-100 bg-sky-50/60 p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
              <Headset className="h-3 w-3" />
              Văn hoá Mỹ
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-700">
              {lesson.cultural_notes_vi}
            </p>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <Lightbulb className="h-3 w-3" />
              Mẹo tổng đài
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
