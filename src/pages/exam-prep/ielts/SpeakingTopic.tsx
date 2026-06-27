// src/pages/exam-prep/ielts/SpeakingTopic.tsx
//
// IELTS Speaking topic detail at /exam-prep/ielts/speaking/:topicId.
//
// Renders the full content for one topic: questions, vocabulary,
// VN-speaker strategies, sample band-7 + band-5 answers, plus a
// "Practice with Mercy" CTA that opens MercyGuide with the topic
// pre-loaded as practice text.

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getTopicById,
  type IELTSBandLevel,
} from "@/data/exam-prep/ielts/speaking-topics";
import { buildLessonPracticePath } from "@/lib/speech/lessonPractice";

const BAND_BADGE: Record<IELTSBandLevel, string> = {
  5: "bg-rose-100 text-rose-800",
  6: "bg-amber-100 text-amber-800",
  7: "bg-emerald-100 text-emerald-800",
  8: "bg-sky-100 text-sky-800",
  9: "bg-violet-100 text-violet-800",
};

export default function SpeakingTopic() {
  const { topicId = "" } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const topic = getTopicById(topicId);

  if (!topic) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
        <p className="text-sm text-slate-600">
          Không tìm thấy chủ đề · Topic not found.
        </p>
        <Link
          to="/exam-prep/ielts/speaking"
          className="mt-3 inline-block text-emerald-700 font-semibold underline"
        >
          ← Quay lại danh sách · Back to list
        </Link>
      </div>
    );
  }

  function startPracticeWithMercy() {
    if (!topic) return;
    navigate(buildLessonPracticePath({
      source: "ielts-speaking",
      lessonId: topic.id,
    }));
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-5">
        <Link
          to="/exam-prep/ielts/speaking"
          className="text-xs text-slate-600 hover:text-slate-800"
        >
          ← Tất cả chủ đề Speaking · All Speaking topics
        </Link>
        <div className="flex items-center gap-2 mt-2 mb-1">
          <span className="text-[10px] uppercase tracking-wide font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            IELTS Speaking · Part {topic.part}
          </span>
          <span className="text-xs text-slate-600">
            · {topic.estimated_time_minutes} phút · min
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {topic.topic_title_vi}
        </h1>
        <p className="text-sm italic text-slate-600 mt-1">
          {topic.topic_title_en}
        </p>
      </header>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
          Khi nào chủ đề này xuất hiện · When this comes up
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          {topic.description_vi}
        </p>
      </section>

      {topic.cue_card_text ? (
        <section className="mb-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-5">
          <h2 className="text-sm font-bold text-amber-900 mb-2 uppercase tracking-wide">
            Cue card
          </h2>
          <p className="text-sm font-semibold text-slate-900 mb-2">
            {topic.sample_questions[0]}
          </p>
          <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
            {topic.cue_card_text}
          </pre>
        </section>
      ) : (
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
            Câu hỏi mẫu · Sample questions
          </h2>
          <ol className="space-y-2 list-decimal list-inside">
            {topic.sample_questions.map((q, i) => (
              <li key={i} className="text-sm text-slate-700 leading-relaxed">
                {q}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
          Từ vựng theo band · Vocabulary by band
        </h2>
        <div className="space-y-2">
          {topic.vocabulary_focus.map((v) => (
            <div
              key={v.word}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-slate-900">
                  {v.word}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    BAND_BADGE[v.band_level]
                  }`}
                >
                  Band {v.band_level}+
                </span>
              </div>
              <div className="text-xs font-mono text-amber-700 mb-1">
                {v.ipa}
              </div>
              <div className="text-sm text-slate-700">
                {v.vi_translation}
              </div>
              <div className="text-xs text-slate-600 italic mt-2 leading-relaxed">
                "{v.example_use_in_topic}"
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
        <h2 className="text-sm font-bold text-rose-900 mb-2 uppercase tracking-wide">
          Mẹo riêng cho người Việt · Vietnamese-speaker strategies
        </h2>
        <ul className="space-y-2 text-sm text-slate-800">
          {topic.vietnamese_speaker_strategies.map((tip, i) => (
            <li key={i} className="leading-relaxed">
              <span className="text-rose-700 font-bold mr-1">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <h2 className="text-sm font-bold text-emerald-900 mb-2 uppercase tracking-wide">
          Mẫu câu trả lời band 7 · Band 7 sample
        </h2>
        <p className="text-sm text-slate-800 leading-relaxed">
          {topic.sample_strong_answer_band_7}
        </p>
      </section>

      <section className="mb-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
        <h2 className="text-sm font-bold text-amber-900 mb-2 uppercase tracking-wide">
          Mẫu band 5 — chỗ nào yếu? · Band 5 weak sample (annotated)
        </h2>
        <p className="text-sm text-slate-800 leading-relaxed">
          {topic.sample_weak_answer_band_5}
        </p>
        <p className="text-[11px] text-slate-600 italic mt-2">
          Ghi chú trong [ngoặc vuông] chỉ rõ lỗi cần sửa.
          · Annotations in [square brackets] mark specific weaknesses.
        </p>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={startPracticeWithMercy}
          className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
        >
          Luyện với Mercy · Practice with Mercy
        </button>
        <Link
          to="/exam-prep/ielts/speaking"
          className="text-sm text-slate-600 hover:text-slate-900 underline"
        >
          ← Chủ đề khác · Other topics
        </Link>
      </div>
    </article>
  );
}
