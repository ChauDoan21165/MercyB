// src/pages/exam-prep/toefl/WritingTopic.tsx — /exam-prep/toefl/writing/:topicId
//
// Per-topic detail page. Shows prompt, approach outline, tips,
// vocabulary, and for Integrated tasks the reading + lecture transcript.

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Clock, BookOpen, Lightbulb } from "lucide-react";
import { findTOEFLWritingTopicById, type TOEFLVocabularyItem } from "@/data/exam-prep/toefl/writing-topics";

export default function WritingTopic() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = useMemo(() => topicId ? findTOEFLWritingTopicById(topicId) : null, [topicId]);

  if (!topic) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 text-center">
        <p className="text-slate-500">Topic not found.</p>
        <Link to="/exam-prep/toefl/writing" className="text-sm text-emerald-700 underline">Back to Writing topics</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-5">
        <Link to="/exam-prep/toefl/writing" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} />Quay lại danh sách chủ đề
        </Link>
        <h1 className="mt-2 text-xl font-bold text-slate-900">{topic.topic_title_vi}</h1>
        <p className="text-sm text-slate-500">{topic.topic_title_en}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded bg-slate-100 px-1.5 py-0.5 uppercase">{topic.task_type.replace(/_/g, " ")}</span>
          <span>·</span><Clock size={12} /><span>{topic.recommended_minutes} min</span>
          <span>·</span><span>{topic.min_words} words min</span>
        </div>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-4 mb-4">
        <h2 className="text-sm font-bold text-slate-700 mb-1">{topic.task_type === "integrated" ? "Đề bài (Prompt)" : "Tình huống thảo luận (Discussion)"}</h2>
        <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">{topic.prompt_vi}</p>
        <p className="mt-2 text-xs italic text-slate-500 whitespace-pre-line">{topic.prompt_en}</p>
      </div>

      {topic.integrated && (
        <>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
            <h2 className="text-sm font-bold text-slate-700 mb-1">Bài đọc (Reading Passage)</h2>
            <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">{topic.integrated.reading_passage}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
            <h2 className="text-sm font-bold text-slate-700 mb-1">Bài giảng (Lecture Transcript)</h2>
            <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">{topic.integrated.lecture_transcript}</p>
            <p className="mt-2 text-xs text-slate-500">Quan hệ với bài đọc: {topic.integrated.lecture_relationship === "challenges" ? "Phản biện" : "Ủng hộ"}</p>
          </div>
        </>
      )}

      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 mb-4">
        <h2 className="flex items-center gap-1 text-sm font-bold text-amber-800 mb-2"><BookOpen size={14} /> Dàn bài gợi ý (Approach outline)</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">{topic.approach_outline_vi.map((step: string, i: number) => <li key={i}>{step}</li>)}</ol>
      </div>

      {topic.vietnamese_speaker_tips.length > 0 && (
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 mb-4">
          <h2 className="flex items-center gap-1 text-sm font-bold text-sky-800 mb-2"><Lightbulb size={14} /> Mẹo cho người Việt (Tips)</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">{topic.vietnamese_speaker_tips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}</ul>
        </div>
      )}

      {topic.key_vocabulary.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 mb-4">
          <h2 className="text-sm font-bold text-slate-700 mb-2">Từ vựng chính (Key vocabulary)</h2>
          <ul className="space-y-2">{topic.key_vocabulary.map((v: TOEFLVocabularyItem, i: number) => (
            <li key={i} className="text-sm">
              <span className="font-semibold text-slate-900">{v.word}</span>
              <span className="text-xs text-slate-500 ml-1">{v.pronunciation_ipa}</span>
              <span className="ml-1 rounded bg-slate-100 px-1 py-0.5 text-[10px] uppercase text-slate-500">{v.level}</span>
              <span className="block text-xs text-slate-600">{v.translation_vi}</span>
            </li>
          ))}</ul>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">{topic.description_en}</p>
    </div>
  );
}
