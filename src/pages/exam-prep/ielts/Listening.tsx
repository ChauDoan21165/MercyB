// src/pages/exam-prep/ielts/Listening.tsx
//
// IELTS Listening content-pack landing at /exam-prep/ielts/listening.
//
// Open marketing surface — separate from the existing premium-gated
// /exam/ielts/listening practice route. Lists 30 items grouped by
// section with section + difficulty filters; each card links to the
// detail page where the script, questions, vocab, and strategies live.
//
// Mirrors the pattern from A4's IELTS Speaking page (PR #183) and
// A1's VSTEP Speaking page (PR #166). VI-first throughout.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Headphones } from "lucide-react";

import {
  IELTS_LISTENING_ITEMS,
  IELTS_LISTENING_BY_SECTION,
  type IELTSListeningSection,
  type IELTSListeningItem,
} from "@/data/exam-prep/ielts/listening-items";

type SectionFilter = "all" | IELTSListeningSection;
type DifficultyFilter = "all" | 5.5 | 6.5 | 7.5 | 8.5;

const SECTION_LABEL: Record<IELTSListeningSection, { vi: string; en: string }> = {
  1: { vi: "Phần 1 — Đối thoại đời sống", en: "Section 1 — Social conversation" },
  2: { vi: "Phần 2 — Độc thoại đời sống", en: "Section 2 — Social monologue" },
  3: { vi: "Phần 3 — Thảo luận học thuật", en: "Section 3 — Academic discussion" },
  4: { vi: "Phần 4 — Bài giảng học thuật", en: "Section 4 — Academic lecture" },
};

const SECTION_BADGE: Record<IELTSListeningSection, string> = {
  1: "bg-emerald-100 text-emerald-800 border-emerald-200",
  2: "bg-amber-100 text-amber-800 border-amber-200",
  3: "bg-sky-100 text-sky-800 border-sky-200",
  4: "bg-violet-100 text-violet-800 border-violet-200",
};

function ItemCard({ item }: { item: IELTSListeningItem }) {
  return (
    <Link
      to={`/exam-prep/ielts/listening/${item.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${SECTION_BADGE[item.section]}`}
        >
          Section {item.section}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
          {item.context}
        </span>
        <span className="ml-auto text-[11px] font-semibold text-slate-600">
          {item.estimated_time_minutes} min · Band {item.difficulty_band}
        </span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{item.topic_title_vi}</h3>
      <p className="text-xs text-slate-600">{item.topic_title_en}</p>
    </Link>
  );
}

export default function Listening() {
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");

  const visibleItems = useMemo(() => {
    let items: IELTSListeningItem[] =
      sectionFilter === "all"
        ? IELTS_LISTENING_ITEMS
        : IELTS_LISTENING_BY_SECTION[sectionFilter];
    if (difficultyFilter !== "all") {
      items = items.filter((i) => i.difficulty_band === difficultyFilter);
    }
    return items;
  }, [sectionFilter, difficultyFilter]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <header className="mb-5">
        <Link
          to="/exam/ielts"
          className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800"
        >
          <ChevronLeft size={14} />
          Quay lại tổng quan IELTS · Back to IELTS overview
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <Headphones size={22} className="text-sky-700" />
          <h1 className="text-2xl font-extrabold text-slate-900">
            IELTS Listening · Luyện nghe
          </h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          IELTS Listening — luyện với tất cả accent (UK, AU, US). Phản hồi
          tiếng Việt cho từng câu sai. 30 bài tập trải đều bốn phần thi: 8 bài
          Phần 1, 8 bài Phần 2, 8 bài Phần 3, 6 bài Phần 4 (lectures).
        </p>
        <p className="mt-1 text-xs text-slate-600">
          30 practice items across all 4 sections. Original scripts based on
          the public IELTS test specification.
        </p>
      </header>

      {/* Section filter */}
      <div className="mb-3 flex flex-wrap gap-2">
        {(["all", 1, 2, 3, 4] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSectionFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              sectionFilter === s
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {s === "all" ? "Tất cả phần" : `Phần ${s}`}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
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

      <div className="text-xs text-slate-600">
        Hiển thị {visibleItems.length} / {IELTS_LISTENING_ITEMS.length} bài.
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {visibleItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
