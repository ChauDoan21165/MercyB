// src/pages/exam-prep/ielts/Reading.tsx
//
// IELTS Reading content-pack landing at /exam-prep/ielts/reading.
//
// Open marketing surface — separate from the existing premium-gated
// /exam/ielts/reading practice route. Lists the 12 academic reading
// passages grouped by category, with category + difficulty filters;
// each card links to the detail page where the passage, questions,
// vocabulary, and Vietnamese-speaker strategies live.
//
// Mirrors the Listening pattern (PR #197) and the VSTEP / IELTS
// Speaking landing pages. VI-first throughout.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft } from "lucide-react";

import {
  IELTS_READING_PASSAGES,
  IELTS_READING_BY_CATEGORY,
  type IELTSReadingCategory,
  type IELTSReadingPassage,
} from "@/data/exam-prep/ielts/reading-passages";

type CategoryFilter = "all" | IELTSReadingCategory;
type DifficultyFilter = "all" | 6.0 | 6.5 | 7.0 | 7.5 | 8.0 | 8.5;

const CATEGORY_LABEL: Record<
  IELTSReadingCategory,
  { vi: string; en: string }
> = {
  history: { vi: "Lịch sử", en: "History" },
  geography: { vi: "Địa lý", en: "Geography" },
  science: { vi: "Khoa học", en: "Science" },
  economics: { vi: "Kinh tế", en: "Economics" },
};

const CATEGORY_BADGE: Record<IELTSReadingCategory, string> = {
  history: "bg-amber-100 text-amber-800 border-amber-200",
  geography: "bg-emerald-100 text-emerald-800 border-emerald-200",
  science: "bg-sky-100 text-sky-800 border-sky-200",
  economics: "bg-violet-100 text-violet-800 border-violet-200",
};

function PassageCard({ passage }: { passage: IELTSReadingPassage }) {
  return (
    <Link
      to={`/exam-prep/ielts/reading/${passage.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CATEGORY_BADGE[passage.category]}`}
        >
          {CATEGORY_LABEL[passage.category].vi}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {CATEGORY_LABEL[passage.category].en}
        </span>
        <span className="ml-auto text-[11px] font-semibold text-slate-500">
          {passage.estimated_time_minutes} min · Band {passage.difficulty_band.toFixed(1)}
        </span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{passage.topic_title_vi}</h3>
      <p className="text-xs text-slate-500">{passage.topic_title_en}</p>
      <p className="mt-2 text-[11px] text-slate-500">
        ~{passage.word_count} từ · {passage.questions.length} câu hỏi
      </p>
    </Link>
  );
}

export default function Reading() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");

  const visiblePassages = useMemo(() => {
    let passages: IELTSReadingPassage[] =
      categoryFilter === "all"
        ? IELTS_READING_PASSAGES
        : IELTS_READING_BY_CATEGORY[categoryFilter];
    if (difficultyFilter !== "all") {
      passages = passages.filter((p) => p.difficulty_band === difficultyFilter);
    }
    return passages;
  }, [categoryFilter, difficultyFilter]);

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
          <BookOpen size={22} className="text-sky-700" />
          <h1 className="text-2xl font-extrabold text-slate-900">
            IELTS Reading · Luyện đọc
          </h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          IELTS Academic Reading — 12 đoạn văn theo định dạng đề thật, viết riêng cho
          MercyBlade trên các chủ đề lịch sử, địa lý, khoa học và kinh tế. Mỗi bài đi
          kèm bộ câu hỏi đầy đủ, giải thích bằng tiếng Việt, từ vựng quan trọng và
          mẹo đặc trưng cho người Việt học IELTS.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          12 academic reading passages across 4 categories. Original prose based on the
          public IELTS Academic Reading specification.
        </p>
      </header>

      {/* Category filter */}
      <div className="mb-3 flex flex-wrap gap-2">
        {(["all", "history", "geography", "science", "economics"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategoryFilter(c)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              categoryFilter === c
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {c === "all" ? "Tất cả chủ đề" : CATEGORY_LABEL[c].vi}
          </button>
        ))}
      </div>

      {/* Difficulty filter — only the bands that appear in this pack */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Band:
        </span>
        {(["all", 6.5, 7.0, 7.5] as const).map((b) => (
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
        Hiển thị {visiblePassages.length} / {IELTS_READING_PASSAGES.length} bài.
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {visiblePassages.map((passage) => (
          <PassageCard key={passage.id} passage={passage} />
        ))}
      </div>
    </div>
  );
}
