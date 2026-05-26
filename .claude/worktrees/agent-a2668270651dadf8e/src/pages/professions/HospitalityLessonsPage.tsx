// src/pages/professions/HospitalityLessonsPage.tsx — /professions/hospitality
//
// Sixth profession-pack page. Same UI pattern as the earlier verticals
// (nail-tech, restaurant, customer-service, healthcare, tech-worker).
// 50 lessons across 8 categories for VN front-of-house, housekeeping,
// concierge, valet, and banquet staff in US hotels.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  Volume2,
  ChevronDown,
  ChevronUp,
  Hotel,
} from "lucide-react";
import {
  HOSPITALITY_CATEGORIES,
  getHospitalityLessonsByCategory,
  type HospitalityCategoryMeta,
  type HospitalityLesson,
} from "@/data/profession-packs/hospitality/content";

const HERO_VI = "Tiếng Anh cho ngành khách sạn.";
const HERO_LINE_2_VI = "Cho lễ tân, dọn phòng, concierge, valet và tiệc sự kiện.";
const HERO_EN =
  "English for hotel workers — front desk, housekeeping, concierge, valet, banquet servers.";
const SUB_VI =
  "Viết cho người Việt — học cách giao tiếp với khách Mỹ và khách quốc tế.";

const INTRO_VI =
  "50 bài: nhận và trả phòng, concierge, dọn phòng, xử lý phàn nàn, tiệc & sự kiện, lễ phép qua điện thoại, khách không nói tiếng Anh, hiểu biết văn hoá. Giọng giao tiếp chuẩn trong khách sạn Mỹ — không phải tiếng Anh sách giáo khoa.";

export default function HospitalityLessonsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50 p-5">
        <div className="flex items-center gap-2">
          <Hotel className="h-5 w-5 text-violet-700" />
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
            Hospitality
          </p>
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {HERO_VI}
        </h1>
        <p className="text-base font-semibold text-slate-800">
          {HERO_LINE_2_VI}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-600">{HERO_EN}</p>
        <p className="mt-3 text-sm italic text-slate-700">{SUB_VI}</p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">{INTRO_VI}</p>
        <p className="mt-3 text-xs text-slate-500">
          50 bài · 8 chủ đề · phiên bản giao tiếp khách sạn đời thực
        </p>
        <p className="mt-1 text-xs text-slate-500">
          <Link
            to="/professions"
            className="font-medium text-violet-700 underline"
          >
            Xem các nghề khác / View other professions
          </Link>
        </p>
      </header>

      <div className="space-y-5">
        {HOSPITALITY_CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: HospitalityCategoryMeta;
}

function CategorySection({ category }: CategorySectionProps) {
  const lessons = getHospitalityLessonsByCategory(category.id);
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
  lesson: HospitalityLesson;
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
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-violet-700">
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
              Mẹo đi làm
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
