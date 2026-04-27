// src/pages/exam-prep/ielts/Reading.tsx
//
// IELTS Reading content-pack landing at /exam-prep/ielts/reading.
//
// Open marketing surface — separate from the existing premium-gated
// /exam/ielts/reading practice route. 12 original passages on neutral
// factual topics (history, geography, science, economics) — scope-cut
// to half count from the original 24-passage spec so each passage runs
// at full IELTS-spec length and survives examiner review.
//
// Mirrors the structural pattern from PR #197 (Listening) and PR #166
// (VSTEP). VI-first throughout; copyright posture in the data file
// header.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft } from "lucide-react";

import {
  IELTS_READING_BY_MODULE,
  IELTS_READING_ITEMS,
  type IELTSReadingItem,
  type IELTSReadingModule,
} from "@/data/exam-prep/ielts/reading-items";

type ModuleFilter = "all" | IELTSReadingModule;
type DifficultyFilter = "all" | 5.5 | 6.5 | 7.5 | 8.5;

const MODULE_LABEL: Record<IELTSReadingModule, { vi: string; en: string }> = {
  academic: { vi: "Học thuật", en: "Academic" },
  general_training: { vi: "Đời sống / GT", en: "General Training" },
};

const MODULE_BADGE: Record<IELTSReadingModule, string> = {
  academic: "bg-violet-100 text-violet-800 border-violet-200",
  general_training: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

function ItemCard({ item }: { item: IELTSReadingItem }) {
  return (
    <Link
      to={`/exam-prep/ielts/reading/${item.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${MODULE_BADGE[item.module]}`}
        >
          {MODULE_LABEL[item.module].en}
        </span>
        <span className="ml-auto text-[11px] font-semibold text-slate-500">
          {item.estimated_time_minutes} min · Band {item.difficulty_band}
        </span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{item.title_vi}</h3>
      <p className="text-xs text-slate-500">{item.title_en}</p>
      <p className="mt-1 text-[11px] text-slate-500">
        {item.questions.length} câu hỏi · {item.questions.length} questions
      </p>
    </Link>
  );
}

export default function Reading() {
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");

  const visibleItems = useMemo(() => {
    let items: IELTSReadingItem[] =
      moduleFilter === "all"
        ? IELTS_READING_ITEMS
        : IELTS_READING_BY_MODULE[moduleFilter];
    if (difficultyFilter !== "all") {
      items = items.filter((i) => i.difficulty_band === difficultyFilter);
    }
    return items;
  }, [moduleFilter, difficultyFilter]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <header className="mb-5">
        <Link
          to="/exam/ielts"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
        >
          <ChevronLeft size={14} />
          Quay lại tổng quan IELTS · Back to IELTS overview
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <BookOpen size={22} className="text-violet-700" />
          <h1 className="text-2xl font-extrabold text-slate-900">
            IELTS Reading · Luyện đọc
          </h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          IELTS Reading — passage gốc, phản hồi tiếng Việt, chiến thuật cho
          người Việt. 12 passages chuẩn IELTS-spec (700–900 từ), trải đều cả
          hai module (Academic + General Training) và bốn band khó (5.5 →
          8.5).
        </p>
        <p className="mt-1 text-xs text-slate-500">
          12 original passages on neutral factual topics — history, geography,
          science, economics. All written for MercyBlade, no commercial-prep-book copy.
        </p>
      </header>

      {/* Module filter */}
      <div className="mb-3 flex flex-wrap gap-2">
        {(["all", "academic", "general_training"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setModuleFilter(m)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              moduleFilter === m
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {m === "all"
              ? "Tất cả module"
              : MODULE_LABEL[m].vi}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Band:
        </span>
        {(["all", 5.5, 6.5, 7.5, 8.5] as const).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setDifficultyFilter(b)}
            className={`rounded-full border px-3 py-0.5 text-[11px] font-semibold ${
              difficultyFilter === b
                ? "border-amber-600 bg-amber-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {b === "all" ? "tất cả" : b.toFixed(1)}
          </button>
        ))}
      </div>

      <div className="text-xs text-slate-500">
        Hiển thị {visibleItems.length} / {IELTS_READING_ITEMS.length} passage.
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {visibleItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
