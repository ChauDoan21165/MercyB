// src/pages/exam-prep/TOEFLSpeakingPage.tsx — /exam/toefl/speaking
//
// Premium-gated TOEFL Speaking practice. Lists all TOEFL speaking
// topics from speaking-topics.ts grouped by task number.
// Each card links to the interactive detail page.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TOEFL_SPEAKING_TOPICS, type TOEFLSpeakingTopic } from "@/data/exam-prep/toefl/speaking-topics";
import { TOEFLPremiumGate } from "@/components/exam-prep/toefl/PremiumGate";
import { TOEFL_COPY } from "@/components/exam-prep/toefl/TOEFLCopy";
import { Button } from "@/components/ui/button";

type TaskFilter = "all" | 1 | 2 | 3 | 4;

const TASK_BADGE_COLORS: Record<number, string> = {
  1: "bg-emerald-100 text-emerald-800 border-emerald-200",
  2: "bg-amber-100 text-amber-800 border-amber-200",
  3: "bg-sky-100 text-sky-800 border-sky-200",
  4: "bg-violet-100 text-violet-800 border-violet-200",
};

function TopicCard({ topic }: { topic: TOEFLSpeakingTopic }) {
  return (
    <Link
      to={"/exam-prep/toefl/speaking/" + topic.id}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className={"inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " + (TASK_BADGE_COLORS[topic.task_number] ?? "bg-slate-100 text-slate-700 border-slate-200")}>
          Task {topic.task_number}
        </span>
        <span className="ml-auto text-[11px] font-semibold text-slate-500">
          {topic.preparation_seconds + topic.speaking_seconds}s
        </span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{topic.topic_title_vi}</h3>
      <p className="text-xs text-slate-500">{topic.topic_title_en}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">{topic.description_vi}</p>
    </Link>
  );
}

export default function TOEFLSpeakingPage() {
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");

  const visibleTopics = useMemo(() => {
    if (taskFilter === "all") return TOEFL_SPEAKING_TOPICS;
    return TOEFL_SPEAKING_TOPICS.filter((t) => t.task_number === taskFilter);
  }, [taskFilter]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{TOEFL_COPY.speakingTitle.vi}</h1>
        <Button asChild size="sm" variant="ghost"><Link to="/exam/toefl">{TOEFL_COPY.backToOverview.vi}</Link></Button>
      </header>
      <TOEFLPremiumGate>
        <div className="mb-4 flex flex-wrap gap-2">
          {(["all", 1, 2, 3, 4] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTaskFilter(t)}
              className={"rounded-full border px-3 py-1 text-xs font-semibold " + (taskFilter === t ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
              {t === "all" ? "Tất cả" : "Task " + t}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mb-3">Hiển thị {visibleTopics.length} / {TOEFL_SPEAKING_TOPICS.length} bài.</div>
        <div className="grid gap-3 sm:grid-cols-2">{visibleTopics.map((t) => <TopicCard key={t.id} topic={t} />)}</div>
      </TOEFLPremiumGate>
    </div>
  );
}
