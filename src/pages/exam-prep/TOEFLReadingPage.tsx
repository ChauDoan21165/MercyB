// src/pages/exam-prep/TOEFLReadingPage.tsx — /exam/toefl/reading
//
// Premium-gated TOEFL Reading practice. Lists all TOEFL reading
// passages from reading-passages.ts with topic/band filters.
// Each card links to the interactive detail page.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TOEFL_READING_PASSAGES,
  listTOEFLReadingPassages,
  type TOEFLReadingPassage,
} from "@/data/exam-prep/toefl/reading-passages";
import { TOEFLPremiumGate } from "@/components/exam-prep/toefl/PremiumGate";
import { TOEFL_COPY } from "@/components/exam-prep/toefl/TOEFLCopy";
import { Button } from "@/components/ui/button";

type TopicFilter = "all" | string;

const TOPIC_COLORS: Record<string, string> = {
  history: "bg-amber-100 text-amber-800 border-amber-200",
  environmental_science: "bg-emerald-100 text-emerald-800 border-emerald-200",
  psychology: "bg-sky-100 text-sky-800 border-sky-200",
  astronomy: "bg-violet-100 text-violet-800 border-violet-200",
};
const BAND_BADGE: Record<number, string> = {
  5.5: "bg-emerald-100 text-emerald-800 border-emerald-200",
  6.5: "bg-amber-100 text-amber-800 border-amber-200",
  7.5: "bg-sky-100 text-sky-800 border-sky-200",
  8.5: "bg-violet-100 text-violet-800 border-violet-200",
};

function PassageCard({ passage }: { passage: TOEFLReadingPassage }) {
  return (
    <Link
      to={"/exam-prep/toefl/reading/" + passage.id}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className={"inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " + (BAND_BADGE[passage.band] ?? "bg-slate-100 text-slate-700 border-slate-200")}>
          Band {passage.band}
        </span>
        <span className={"inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " + (TOPIC_COLORS[passage.topic_family] ?? "bg-slate-100 text-slate-700 border-slate-200")}>
          {passage.topic_family.replace(/_/g, " ")}
        </span>
        <span className="ml-auto text-[11px] font-semibold text-slate-500">
          {passage.time_minutes} min · {passage.questions.length} Q
        </span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{passage.title_vi}</h3>
      <p className="text-xs text-slate-500">{passage.title_en}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">{passage.summary_vi}</p>
    </Link>
  );
}

export default function TOEFLReadingPage() {
  const allPassages = useMemo(() => listTOEFLReadingPassages(), []);
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("all");
  const [bandFilter, setBandFilter] = useState<number | "all">("all");

  const topicFamilies = useMemo(
    () => [...new Set(allPassages.map((p) => p.topic_family))],
    [allPassages],
  );

  const visiblePassages = useMemo(() => {
    let items = allPassages;
    if (topicFilter !== "all") items = items.filter((p) => p.topic_family === topicFilter);
    if (bandFilter !== "all") items = items.filter((p) => p.band === bandFilter);
    return items;
  }, [allPassages, topicFilter, bandFilter]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{TOEFL_COPY.readingTitle.vi}</h1>
        <Button asChild size="sm" variant="ghost"><Link to="/exam/toefl">{TOEFL_COPY.backToOverview.vi}</Link></Button>
      </header>
      <TOEFLPremiumGate>
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setTopicFilter("all")}
            className={"rounded-full border px-3 py-1 text-xs font-semibold " + (topicFilter === "all" ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
            Tất cả chủ đề
          </button>
          {topicFamilies.map((tf) => (
            <button key={tf} type="button" onClick={() => setTopicFilter(tf)}
              className={"rounded-full border px-3 py-1 text-xs font-semibold " + (topicFilter === tf ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
              {tf.replace(/_/g, " ")}
            </button>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Band:</span>
          {(["all", 5.5, 6.5, 7.5, 8.5] as const).map((b) => (
            <button key={b} type="button" onClick={() => setBandFilter(b)}
              className={"rounded-full border px-3 py-0.5 text-[11px] font-semibold " + (bandFilter === b ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
              {b === "all" ? "tất cả" : b.toFixed(1)}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mb-3">Hiển thị {visiblePassages.length} / {allPassages.length} bài.</div>
        <div className="space-y-3">{visiblePassages.map((p) => <PassageCard key={p.id} passage={p} />)}</div>
      </TOEFLPremiumGate>
    </div>
  );
}
