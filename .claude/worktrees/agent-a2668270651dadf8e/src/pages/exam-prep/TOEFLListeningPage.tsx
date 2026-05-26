// src/pages/exam-prep/TOEFLListeningPage.tsx — /exam/toefl/listening
//
// Premium-gated TOEFL Listening practice. Lists all TOEFL listening
// items from listening-items.ts with type/difficulty filters.
// Each card links to the interactive detail page.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TOEFL_LISTENING_ITEMS, type TOEFLListeningItem } from "@/data/exam-prep/toefl/listening-items";
import { TOEFLPremiumGate } from "@/components/exam-prep/toefl/PremiumGate";
import { TOEFL_COPY } from "@/components/exam-prep/toefl/TOEFLCopy";
import { Button } from "@/components/ui/button";

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
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{item.section_label}</span>
        <span className="ml-auto text-[11px] font-semibold text-slate-500">{item.estimated_time_minutes} min · Band {item.difficulty_band}</span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{item.topic_title_vi}</h3>
      <p className="text-xs text-slate-500">{item.topic_title_en}</p>
    </Link>
  );
}

export default function TOEFLListeningPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all");

  const visibleItems = useMemo(() => {
    let items = TOEFL_LISTENING_ITEMS;
    if (typeFilter !== "all") items = items.filter((i) => i.type === typeFilter);
    if (diffFilter !== "all") items = items.filter((i) => i.difficulty_band === diffFilter);
    return items;
  }, [typeFilter, diffFilter]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{TOEFL_COPY.listeningTitle.vi}</h1>
        <Button asChild size="sm" variant="ghost"><Link to="/exam/toefl">{TOEFL_COPY.backToOverview.vi}</Link></Button>
      </header>
      <TOEFLPremiumGate>
        <div className="mb-3 flex flex-wrap gap-2">
          {(["all", "conversation", "lecture"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTypeFilter(t)}
              className={"rounded-full border px-3 py-1 text-xs font-semibold " + (typeFilter === t ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
              {t === "all" ? "Tất cả" : t === "conversation" ? "Hội thoại" : "Bài giảng"}
            </button>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Band:</span>
          {(["all", 5.5, 6.5, 7.5, 8.5] as const).map((b) => (
            <button key={b} type="button" onClick={() => setDiffFilter(b)}
              className={"rounded-full border px-3 py-0.5 text-[11px] font-semibold " + (diffFilter === b ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
              {b === "all" ? "tất cả" : b.toFixed(1)}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mb-3">Hiển thị {visibleItems.length} / {TOEFL_LISTENING_ITEMS.length} bài.</div>
        <div className="grid gap-3 sm:grid-cols-2">{visibleItems.map((item) => <ItemCard key={item.id} item={item} />)}</div>
      </TOEFLPremiumGate>
    </div>
  );
}
