// src/pages/exam-prep/toefl/Writing.tsx — /exam-prep/toefl/writing
//
// TOEFL Writing content-pack landing page. Open marketing surface.

import { Link } from "react-router-dom";
import { PenLine, ChevronLeft } from "lucide-react";
import { TOEFL_WRITING_TOPICS, type TOEFLWritingTopic } from "@/data/exam-prep/toefl/writing-topics";

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
    <Link to={"/exam-prep/toefl/writing/" + topic.id} className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
      <div className="mb-1 flex items-center gap-2">
        <span className={"inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " + (TYPE_BADGES[topic.task_type] ?? "bg-slate-100")}>{TYPE_LABELS[topic.task_type] ?? topic.task_type}</span>
        <span className="ml-auto text-[11px] font-semibold text-slate-500">{topic.recommended_minutes} min</span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{topic.topic_title_vi}</h3>
      <p className="text-xs text-slate-500">{topic.topic_title_en}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">{topic.description_vi}</p>
    </Link>
  );
}

export default function Writing() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <header className="mb-5">
        <Link to="/exam/toefl" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} />Quay lại tổng quan TOEFL · Back to TOEFL overview
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <PenLine size={22} className="text-emerald-700" />
          <h1 className="text-2xl font-extrabold text-slate-900">TOEFL Writing · Luyện viết</h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">Luyện TOEFL Writing Task 1 (Integrated) và Task 2 (Academic Discussion) với đề bài thực tế, dàn bài gợi ý và từ vựng chọn lọc cho người Việt.</p>
      </header>
      <div className="text-xs text-slate-500 mb-3">{TOEFL_WRITING_TOPICS.length} chủ đề.</div>
      <div className="grid gap-3 sm:grid-cols-2">{TOEFL_WRITING_TOPICS.map((topic) => <TopicCard key={topic.id} topic={topic} />)}</div>
    </div>
  );
}
