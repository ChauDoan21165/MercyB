// src/pages/exam-prep/ielts/Speaking.tsx
//
// IELTS Speaking content-pack landing page at /exam-prep/ielts/speaking.
//
// This is the OPEN marketing surface — separate from the existing
// /exam/ielts/speaking premium-gated practice route. This page lists
// 30 topics across all 3 parts, each linking to a detail page where
// the full content (questions, vocabulary, strategies, sample answers)
// is shown.
//
// VN-first per project policy: VI labels are primary, EN supports.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  IELTS_SPEAKING_TOPICS,
  IELTS_SPEAKING_TOPICS_BY_PART,
  type IELTSSpeakingPart,
  type IELTSSpeakingTopic,
} from "@/data/exam-prep/ielts/speaking-topics";

type PartFilter = "all" | 1 | 2 | 3;

const PART_LABELS: Record<IELTSSpeakingPart, { vi: string; en: string }> = {
  1: { vi: "Phần 1 — Phỏng vấn ngắn", en: "Part 1 — Introduction" },
  2: { vi: "Phần 2 — Cue card / nói dài", en: "Part 2 — Long turn" },
  3: { vi: "Phần 3 — Thảo luận", en: "Part 3 — Discussion" },
};

const PART_BADGE_COLOR: Record<IELTSSpeakingPart, string> = {
  1: "bg-emerald-100 text-emerald-800 border-emerald-200",
  2: "bg-amber-100 text-amber-800 border-amber-200",
  3: "bg-sky-100 text-sky-800 border-sky-200",
};

export default function Speaking() {
  const [partFilter, setPartFilter] = useState<PartFilter>("all");

  const visibleTopics = useMemo(() => {
    if (partFilter === "all") return IELTS_SPEAKING_TOPICS;
    return IELTS_SPEAKING_TOPICS_BY_PART[partFilter];
  }, [partFilter]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <header className="mb-5">
        <Link
          to="/exam/ielts"
          className="text-xs text-slate-500 hover:text-slate-800"
        >
          ← Trở về tổng quan IELTS · IELTS overview
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          IELTS Speaking — 30 chủ đề luyện tập
        </h1>
        <p className="text-sm text-slate-500 italic mt-1">
          IELTS Speaking — 30 practice topics across all three parts
        </p>
        <p className="text-sm text-slate-700 mt-3 leading-relaxed">
          Phản hồi tiếng Việt — biết chính xác band đang ở đâu và làm thế nào để lên.
          Mỗi chủ đề có từ vựng theo band, mẹo dành riêng cho người Việt, và
          mẫu câu trả lời band 7 + band 5 (kèm ghi chú lỗi).
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 mb-5 border-b border-slate-200 pb-2">
        <FilterButton
          active={partFilter === "all"}
          onClick={() => setPartFilter("all")}
        >
          Tất cả · All ({IELTS_SPEAKING_TOPICS.length})
        </FilterButton>
        {([1, 2, 3] as IELTSSpeakingPart[]).map((p) => (
          <FilterButton
            key={p}
            active={partFilter === p}
            onClick={() => setPartFilter(p)}
          >
            {PART_LABELS[p].vi} ({IELTS_SPEAKING_TOPICS_BY_PART[p].length})
          </FilterButton>
        ))}
      </nav>

      {partFilter === "all" ? (
        <div className="space-y-7">
          {([1, 2, 3] as IELTSSpeakingPart[]).map((p) => (
            <section key={p}>
              <h2 className="text-base font-bold text-slate-800 mb-3">
                {PART_LABELS[p].vi}
                <span className="text-xs italic text-slate-500 ml-2">
                  · {PART_LABELS[p].en}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {IELTS_SPEAKING_TOPICS_BY_PART[p].map((t) => (
                  <TopicCard key={t.id} topic={t} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleTopics.map((t) => (
            <TopicCard key={t.id} topic={t} />
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-8 leading-relaxed">
        Nội dung tự viết theo định dạng IELTS công khai (IDP / British Council).
        Mọi câu hỏi mẫu và đáp án minh hoạ đều là nguyên gốc — không sao chép từ
        sách Cambridge hay nhà xuất bản nào.
      </p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function TopicCard({ topic }: { topic: IELTSSpeakingTopic }) {
  return (
    <Link
      to={`/exam-prep/ielts/speaking/${topic.id}`}
      className="block p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 transition no-underline"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-900 leading-snug">
          {topic.topic_title_vi}
        </h3>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap border ${
            PART_BADGE_COLOR[topic.part]
          }`}
        >
          Part {topic.part}
        </span>
      </div>
      <p className="text-xs italic text-slate-500 mb-2">
        {topic.topic_title_en}
      </p>
      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
        {topic.description_vi}
      </p>
      <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
        <span>{topic.estimated_time_minutes} phút · min</span>
        <span className="text-emerald-700 font-semibold">
          Bắt đầu · Start →
        </span>
      </div>
    </Link>
  );
}
