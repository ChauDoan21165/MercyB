// src/pages/exam-prep/IELTSListeningPage.tsx — /exam/ielts/listening
//
// Premium-gated IELTS Listening practice. Lists all 30 real listening
// items from listening-items.ts with section/difficulty filters. Each card
// links to the interactive detail page. Replaces sample-questions.json stub.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IELTS_LISTENING_ITEMS, IELTS_LISTENING_BY_SECTION, type IELTSListeningSection, type IELTSListeningItem } from "@/data/exam-prep/ielts/listening-items";
import { PremiumGate } from "@/components/exam-prep/ielts/PremiumGate";
import { IELTS_COPY } from "@/components/exam-prep/ielts/ieltsCopy";
import { Button } from "@/components/ui/button";

type SectionFilter = "all" | IELTSListeningSection;
type DiffFilter = "all" | 5.5 | 6.5 | 7.5 | 8.5;

const SECTION_BADGE: Record<IELTSListeningSection, string> = { 1: "bg-emerald-100 text-emerald-800 border-emerald-200", 2: "bg-amber-100 text-amber-800 border-amber-200", 3: "bg-sky-100 text-sky-800 border-sky-200", 4: "bg-violet-100 text-violet-800 border-violet-200" };

function ItemCard({ item }: { item: IELTSListeningItem }) { return ( <Link to={"/exam-prep/ielts/listening/" + item.id} className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"><div className="mb-1 flex items-center gap-2"><span className={"inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " + SECTION_BADGE[item.section]}>Section {item.section}</span><span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{item.context}</span><span className="ml-auto text-[11px] font-semibold text-slate-600">{item.estimated_time_minutes} min · Band {item.difficulty_band}</span></div><h3 className="text-base font-bold text-slate-900">{item.topic_title_vi}</h3><p className="text-xs text-slate-600">{item.topic_title_en}</p></Link> ); }

export default function IELTSListeningPage() {
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all");
  const visibleItems = useMemo(() => { let items = sectionFilter === "all" ? IELTS_LISTENING_ITEMS : IELTS_LISTENING_BY_SECTION[sectionFilter]; if (diffFilter !== "all") items = items.filter((i) => i.difficulty_band === diffFilter); return items; }, [sectionFilter, diffFilter]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-semibold text-foreground">{IELTS_COPY.listeningTitle.vi}</h1><Button asChild size="sm" variant="ghost"><Link to="/exam/ielts">{IELTS_COPY.backToOverview.vi}</Link></Button></header>
      <PremiumGate>
        <div className="mb-3 flex flex-wrap gap-2">{(["all", 1, 2, 3, 4] as const).map((s) => (<button key={s} type="button" onClick={() => setSectionFilter(s)} className={"rounded-full border px-3 py-1 text-xs font-semibold " + (sectionFilter === s ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>{s === "all" ? "Tất cả phần" : "Phần " + s}</button>))}</div>
        <div className="mb-4 flex flex-wrap items-center gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Band:</span>{(["all", 5.5, 6.5, 7.5, 8.5] as const).map((b) => (<button key={b} type="button" onClick={() => setDiffFilter(b)} className={"rounded-full border px-3 py-0.5 text-[11px] font-semibold " + (diffFilter === b ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>{b === "all" ? "tất cả" : b.toFixed(1)}</button>))}</div>
        <div className="text-xs text-slate-600 mb-3">Hiển thị {visibleItems.length} / {IELTS_LISTENING_ITEMS.length} bài.</div>
        <div className="grid gap-3 sm:grid-cols-2">{visibleItems.map((item) => <ItemCard key={item.id} item={item} />)}</div>
      </PremiumGate>
    </div>
  );
}
