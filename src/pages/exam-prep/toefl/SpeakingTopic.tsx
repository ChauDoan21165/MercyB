// src/pages/exam-prep/toefl/SpeakingTopic.tsx — /exam-prep/toefl/speaking/:topicId
//
// Per-topic detail page. Shows prompt, reading/listening for integrated
// tasks, sample responses (band 7 + band 5 with error notes), tips, and
// vocabulary.

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Clock, Lightbulb, AlertTriangle } from "lucide-react";
import { findTOEFLSpeakingTopicById, type TOEFLSpeakingVocabularyItem } from "@/data/exam-prep/toefl/speaking-topics";

export default function SpeakingTopic() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = useMemo(() => topicId ? findTOEFLSpeakingTopicById(topicId) : null, [topicId]);

  if (!topic) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 text-center">
        <p className="text-slate-600">Topic not found.</p>
        <Link to="/exam-prep/toefl/speaking" className="text-sm text-emerald-700 underline">Back to Speaking topics</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-5">
        <Link to="/exam-prep/toefl/speaking" className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800">
          <ChevronLeft size={14} />Quay lại danh sách chủ đề
        </Link>
        <h1 className="mt-2 text-xl font-bold text-slate-900">{topic.topic_title_vi}</h1>
        <p className="text-sm text-slate-600">{topic.topic_title_en}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
          <span className="rounded bg-slate-100 px-1.5 py-0.5 uppercase">Task {topic.task_number} — {topic.task_type.replace(/_/g, " ")}</span>
          <span>·</span><Clock size={12} /><span>Prep: {topic.preparation_seconds}s</span>
          <span>·</span><span>Speak: {topic.speaking_seconds}s</span>
        </div>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-4 mb-4">
        <h2 className="text-sm font-bold text-slate-700 mb-1">Đề bài (Prompt)</h2>
        <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">{topic.prompt_vi}</p>
        <p className="mt-2 text-xs italic text-slate-600 whitespace-pre-line">{topic.prompt_en}</p>
      </div>

      {topic.reading_passage && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
          <h2 className="text-sm font-bold text-slate-700 mb-1">Bài đọc (Reading)</h2>
          <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">{topic.reading_passage}</p>
        </div>
      )}

      {topic.listening_transcript && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
          <h2 className="text-sm font-bold text-slate-700 mb-1">Bài nghe (Listening Transcript)</h2>
          <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">{topic.listening_transcript}</p>
        </div>
      )}

      {/* Band 7 sample */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Câu trả lời mẫu Band 7</h2>
        <p className="text-sm leading-relaxed text-slate-800">{topic.sample_response_en}</p>
      </div>

      {/* Band 5 sample with error notes */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Câu trả lời mẫu Band 5 (có lỗi)</h2>
        <p className="text-sm leading-relaxed text-slate-800 mb-2">{topic.sample_response_band5_en}</p>
        {topic.band5_error_notes_vi.length > 0 && (
          <div className="rounded bg-rose-50 p-2 text-xs">
            <p className="font-semibold text-rose-800 mb-1">Ghi chú lỗi:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700">{topic.band5_error_notes_vi.map((note, i) => <li key={i}>{note}</li>)}</ul>
          </div>
        )}
      </div>

      {topic.vietnamese_speaker_tips.length > 0 && (
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 mb-4">
          <h2 className="flex items-center gap-1 text-sm font-bold text-sky-800 mb-2"><Lightbulb size={14} /> Mẹo cho người Việt (Tips)</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">{topic.vietnamese_speaker_tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
        </div>
      )}

      {topic.key_vocabulary.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-bold text-slate-700 mb-2">Từ vựng chính (Key vocabulary)</h2>
          <ul className="space-y-2">{topic.key_vocabulary.map((v: TOEFLSpeakingVocabularyItem, i: number) => (
            <li key={i} className="text-sm">
              <span className="font-semibold text-slate-900">{v.word}</span>
              <span className="text-xs text-slate-600 ml-1">{v.pronunciation_ipa}</span>
              <span className="ml-1 rounded bg-slate-100 px-1 py-0.5 text-[10px] uppercase text-slate-600">{v.level}</span>
              <span className="block text-xs text-slate-600">{v.translation_vi}</span>
            </li>
          ))}</ul>
        </div>
      )}
    </div>
  );
}
