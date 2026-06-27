// src/pages/professions/RestaurantLessonsPage.tsx — /professions/restaurant
//
// Sibling of NailTechLessonsPage. Same UI pattern, different content.
// 50 lessons across 8 categories for VN restaurant workers in the US.
// Anon-viewable; lesson tiles expand inline (same trade-off documented
// in NailTechLessonsPage.tsx — keeps roomRegistry's prebuild surface
// stable for now).

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  Volume2,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
} from "lucide-react";
import {
  RESTAURANT_CATEGORIES,
  getRestaurantLessonsByCategory,
  type RestaurantCategoryMeta,
  type RestaurantLesson,
} from "@/data/profession-packs/restaurant/content";

const HERO_VI = "Tiếng Anh dành cho người làm nhà hàng.";
const HERO_LINE_2_VI = "Cho server, host, đầu bếp, busser.";
const HERO_EN = "English for restaurant workers — servers, hosts, cooks, bussers.";
const SUB_VI =
  "Viết cho người Việt, bởi người Việt — giống như rất nhiều người Việt đang làm việc ở các nhà hàng Mỹ ngay lúc này.";

const INTRO_VI =
  "50 bài học thực tế: chào khách, gọi nước, giải thích menu, xử lý dị ứng, phàn nàn, gợi ý món Việt cho khách Mỹ, thanh toán + tip. Văn hoá nhà hàng Mỹ — không phải tiếng Anh sách giáo khoa.";

export default function RestaurantLessonsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-5">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-amber-700" />
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Restaurant
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
        <p className="mt-3 text-xs text-slate-600">
          50 bài · 8 chủ đề · phiên bản hội thoại đời thực
        </p>
        <p className="mt-1 text-xs text-slate-600">
          <Link
            to="/professions"
            className="font-medium text-amber-700 underline"
          >
            Xem các nghề khác / View other professions
          </Link>
        </p>
      </header>

      <div className="space-y-5">
        {RESTAURANT_CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: RestaurantCategoryMeta;
}

function CategorySection({ category }: CategorySectionProps) {
  const lessons = getRestaurantLessonsByCategory(category.id);
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
  lesson: RestaurantLesson;
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
