// src/pages/exam-prep/toefl/Listening.tsx — /exam-prep/toefl/listening
//
// TOEFL Listening content-pack landing page. Open marketing surface —
// separate from premium-gated /exam/toefl/listening.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Headphones } from "lucide-react";
import { TOEFL_LISTENING_ITEMS, type TOEFLListeningItem } from "@/data/exam-prep/toefl/listening-items";

type TypeFilter = "all" | "conversation" | "lecture";
type DiffFilter = "all" | 5.5 | 6.5 | 7.5 | 8.5;

const TYPE_BADGE: Record<string, string> = {
  conversation: "bg-emerald-100 text-emerald-800 border-emerald-200",
  lecture: "bg-violet-100 text-violet-800 border-violet-200",
};

function ItemCard({ item }: { item: TOEFLListeningItem }) {
  return (
    <Link to={"/exam-prep/toefl/listening/" + item.id} className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
      <div className="mb-1 flex items-center gap-2">
        <span className={"inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " + (TYPE_BADGE[item.type] ?? "bg-slate-100 text-slate-700 border-slate-200")}>
          {item.type === "conversation" ? "Hội thoại" : "Bài giảng"}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{item.section_label}</span>
        <span className="ml-auto text-[11px] font-semibold text-slate-600">{item.estimated_time_minutes} min · Band {item.difficulty_band}</span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{item.topic_title_vi}</h3>
      <p className="text-xs text-slate-600">{item.topic_title_en}</p>
    </Link>
  );
}

export default function Listening() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all");
  const visibleItems = useMemo(() => {
    let items = TOEFL_LISTENING_ITEMS;
    if (typeFilter !== "all") items = items.filter((i) => i.type === typeFilter);
    if (diffFilter !== "all") items = items.filter((i) => i.difficulty_band === diffFilter);
    return items;
  }, [typeFilter, diffFilter]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <header className="mb-5">
        <Link to="/exam/toefl" className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800">
          <ChevronLeft size={14} />Quay lại tổng quan TOEFL · Back to TOEFL overview
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <Headphones size={22} className="text-sky-700" />
          <h1 className="text-2xl font-extrabold text-slate-900">TOEFL Listening · Luyện nghe</h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          TOEFL Listening — luyện với giọng Bắc Mỹ chuẩn TOEFL. Phản hồi tiếng Việt cho từng câu. 3 hội thoại campus + 6 bài giảng học thuật.
        </p>
        <p className="mt-1 text-xs text-slate-600">{TOEFL_LISTENING_ITEMS.length} practice items. Original scripts based on the public TOEFL iBT test specification.</p>
      </header>
      <div className="mb-3 flex flex-wrap gap-2">
        {(["all", "conversation", "lecture"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTypeFilter(t)}
            className={"rounded-full border px-3 py-1 text-xs font-semibold " + (typeFilter === t ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
            {t === "all" ? "Tất cả" : t === "conversation" ? "Hội thoại" : "Bài giảng"}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Band:</span>
        {(["all", 5.5, 6.5, 7.5, 8.5] as const).map((b) => (
          <button key={b} type="button" onClick={() => setDiffFilter(b)}
            className={"rounded-full border px-3 py-0.5 text-[11px] font-semibold " + (diffFilter === b ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>{b === "all" ? "tất cả" : b.toFixed(1)}</button>
        ))}
      </div>
      <div className="text-xs text-slate-600">Hiển thị {visibleItems.length} / {TOEFL_LISTENING_ITEMS.length} bài.</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{visibleItems.map((item) => <ItemCard key={item.id} item={item} />)}</div>
    </div>
  );
}
