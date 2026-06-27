// src/pages/exam-prep/TOEFLWritingPage.tsx — /exam/toefl/writing
//
// Premium-gated TOEFL Writing practice. Lists all TOEFL writing
// topics from writing-topics.ts with task type labels.
// Each card links to the interactive detail page.

import { Link } from "react-router-dom";
import { TOEFL_WRITING_TOPICS, type TOEFLWritingTopic } from "@/data/exam-prep/toefl/writing-topics";
import { TOEFLPremiumGate } from "@/components/exam-prep/toefl/PremiumGate";
import { TOEFL_COPY } from "@/components/exam-prep/toefl/TOEFLCopy";
import { Button } from "@/components/ui/button";

const TYPE_BADGES: Record<string, string> = {
  integrated: "bg-amber-100 text-amber-800 border-amber-200",
  academic_discussion: "bg-sky-100 text-sky-800 border-sky-200",
};

const TYPE_LABELS: Record<string, string> = {
  integrated: "Integrated Writing",
  academic_discussion: "Academic Discussion",
};

function TopicCard({ topic }: { topic: TOEFLWritingTopic }) {
  return (
    <Link
      to={"/exam-prep/toefl/writing/" + topic.id}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className={"inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " + (TYPE_BADGES[topic.task_type] ?? "bg-slate-100")}>
          {TYPE_LABELS[topic.task_type] ?? topic.task_type}
        </span>
        <span className="ml-auto text-[11px] font-semibold text-slate-600">{topic.recommended_minutes} min</span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{topic.topic_title_vi}</h3>
      <p className="text-xs text-slate-600">{topic.topic_title_en}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">{topic.description_vi}</p>
    </Link>
  );
}

export default function TOEFLWritingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{TOEFL_COPY.writingTitle.vi}</h1>
        <Button asChild size="sm" variant="ghost"><Link to="/exam/toefl">{TOEFL_COPY.backToOverview.vi}</Link></Button>
      </header>
      <TOEFLPremiumGate>
        <div className="text-xs text-slate-600 mb-3">{TOEFL_WRITING_TOPICS.length} chủ đề.</div>
        <div className="space-y-3">
          {TOEFL_WRITING_TOPICS.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </TOEFLPremiumGate>
    </div>
  );
}
