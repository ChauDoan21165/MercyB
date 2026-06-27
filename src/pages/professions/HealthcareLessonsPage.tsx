// src/pages/professions/HealthcareLessonsPage.tsx — /professions/healthcare
//
// Sibling of NailTechLessonsPage / RestaurantLessonsPage / Customer-
// Service equivalents. Same UI pattern, healthcare-specific content.
//
// 50 lessons across 8 categories for VN healthcare workers in the US
// (CNAs, home health aides, dental assistants, medical interpreters).
// Anon-viewable; lesson tiles expand inline.
//
// Marketing copy is intentionally explicit about the scope: this is
// communication English, not medical training. No certification, no
// clinical advice — see content.ts header for the safety contract.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Lightbulb,
  Volume2,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  ShieldAlert,
} from "lucide-react";
import {
  HEALTHCARE_CATEGORIES,
  getHealthcareLessonsByCategory,
  type HealthcareCategoryMeta,
  type HealthcareLesson,
} from "@/data/profession-packs/healthcare/content";

const HERO_VI = "Tiếng Anh cho nhân viên y tế.";
const HERO_LINE_2_VI = "Cho CNA, nha khoa, chăm sóc tại nhà và phiên dịch y tế.";
const HERO_EN =
  "English for healthcare workers — CNAs, dental assistants, home-health aides, medical interpreters.";
const SUB_VI =
  "Nội dung tập trung vào giao tiếp — không phải hướng dẫn y khoa. Viết cho người Việt, bởi người Việt.";

const INTRO_VI =
  "50 bài học giao tiếp y tế: tiếp nhận bệnh nhân, đánh giá đau, trao đổi thuốc, chăm sóc người lớn tuổi/sa sút trí tuệ, giao tiếp khẩn cấp, nhạy cảm văn hoá, ghi chú hồ sơ. Văn hoá bệnh viện Mỹ — không phải đào tạo y khoa.";

const SAFETY_NOTE_VI =
  "Đây là tiếng Anh giao tiếp — KHÔNG phải khóa học y khoa, KHÔNG cấp chứng chỉ, KHÔNG thay thế chương trình đào tạo nursing/dental/CNA. Mọi quyết định lâm sàng phải qua bác sĩ và y tá có giấy phép.";

export default function HealthcareLessonsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 p-5">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-emerald-700" />
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Healthcare
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
          50 bài · 8 chủ đề · phiên bản giao tiếp đời thực
        </p>
        <p className="mt-1 text-xs text-slate-600">
          <Link
            to="/professions"
            className="font-medium text-emerald-700 underline"
          >
            Xem các nghề khác / View other professions
          </Link>
        </p>
      </header>

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          <ShieldAlert className="h-3 w-3" />
          Lưu ý quan trọng / Important
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-800">
          {SAFETY_NOTE_VI}
        </p>
      </div>

      <div className="space-y-5">
        {HEALTHCARE_CATEGORIES.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: HealthcareCategoryMeta;
}

function CategorySection({ category }: CategorySectionProps) {
  const lessons = getHealthcareLessonsByCategory(category.id);
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
  lesson: HealthcareLesson;
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
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-emerald-700">
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
