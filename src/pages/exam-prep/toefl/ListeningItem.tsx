// src/pages/exam-prep/toefl/ListeningItem.tsx — /exam-prep/toefl/listening/:itemId
//
// Per-item detail page. Shows the audio script, all questions with
// options, VN explanations, vocabulary focus, strategies, and
// common mistakes. Text-input answer mode with score on submit.

import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Headphones, Volume2 } from "lucide-react";
import { getTOEFLListeningItemById, type TOEFLListeningQuestion } from "@/data/exam-prep/toefl/listening-items";
import { useAudioUrl } from "@/hooks/useAudioUrl";

function answerMatches(given: string, expected: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,;:!?]/g, "");
  return norm(given) === norm(expected);
}

function QuestionBlock({ q, showKey, userAnswer, onChange, feedbackVisible }: {
  q: TOEFLListeningQuestion; showKey: boolean; userAnswer: string;
  onChange: (v: string) => void; feedbackVisible: boolean;
}) {
  const correct = feedbackVisible && answerMatches(userAnswer, q.correct_answer);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold text-slate-600">Q{q.number}</span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-600">{q.type}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-900">{q.question_text}</p>
      {q.options ? <ul className="mt-1 space-y-0.5 text-xs text-slate-700">{q.options.map((o, i) => <li key={i}>{o}</li>)}</ul> : null}
      <input type="text" value={userAnswer} onChange={(e) => onChange(e.target.value)} placeholder="Đáp án của bạn · your answer"
        className="mt-2 w-full rounded border border-slate-300 px-2 py-1 text-sm" />
      {feedbackVisible ? <p className={`mt-1 text-xs font-bold ${correct ? "text-emerald-700" : "text-rose-700"}`}>{correct ? "✓ Đúng" : `✗ Sai — đáp án: ${q.correct_answer}`}</p> : null}
      {showKey ? <div className="mt-2 rounded bg-amber-50 p-2 text-xs"><p className="font-bold text-amber-900">Đáp án: <span className="font-mono">{q.correct_answer}</span></p><p className="mt-1 text-slate-700">{q.explanation_vi}</p></div> : null}
    </div>
  );
}

export default function ListeningItem() {
  const { itemId = "" } = useParams<{ itemId: string }>();
  const item = getTOEFLListeningItemById(itemId);
  const [showKey, setShowKey] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // All hooks must run unconditionally before the `if (!item)` early return
  // (Rules of Hooks). useAudioUrl tolerates a null filename, so we feed it
  // item?.audioKey ?? null even when the item lookup misses.
  const audio = useAudioUrl(item?.audioKey ?? null);

  const score = useMemo(() => {
    if (!item || !submitted) return null;
    const correctCount = item.questions.reduce((n, q) => (answerMatches(answers[q.number] ?? "", q.correct_answer) ? n + 1 : n), 0);
    return { raw: correctCount, total: item.questions.length };
  }, [item, answers, submitted]);

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
        <p className="text-sm text-slate-600">Không tìm thấy bài · Item not found.</p>
        <Link to="/exam-prep/toefl/listening" className="mt-3 inline-block font-semibold text-sky-700 underline">← Quay lại danh sách · Back to list</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <Link to="/exam-prep/toefl/listening" className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800">
        <ChevronLeft size={14} />Danh sách · Back to list
      </Link>
      <header className="mt-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800">{item.section_label}</span>
          <span className="text-[11px] uppercase tracking-wider text-slate-600">Band {item.difficulty_band} · {item.estimated_time_minutes} min</span>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{item.topic_title_vi}</h1>
        <p className="text-sm text-slate-600">{item.topic_title_en}</p>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setShowKey((v) => !v)}
          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{showKey ? "Ẩn đáp án" : "Xem đáp án"}</button>
      </div>

      {item.audioKey ? (
        <section className="mt-4 rounded-xl border border-sky-200 bg-sky-50/70 p-4">
          <h2 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-sky-800">
            <Headphones size={12} />Nghe bài · Listen to the passage
          </h2>
          {audio.url ? (
            <audio
              controls
              preload="none"
              src={audio.url}
              className="w-full"
              data-testid="toefl-listening-audio"
            >
              Trình duyệt không hỗ trợ phát audio · Your browser doesn't support audio playback.
            </audio>
          ) : audio.loading ? (
            <p className="text-xs text-slate-600">Đang tải audio · Loading audio…</p>
          ) : (
            <p className="text-xs text-rose-700">
              Audio chưa khả dụng · Audio not available yet.
            </p>
          )}
        </section>
      ) : null}

      <section className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600"><Volume2 size={12} />Transcript · Bản ghi âm thanh</h2>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">{item.audio_script}</pre>
      </section>

      <section className="mt-4 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Câu hỏi · Questions</h2>
        {item.questions.map((q) => (
          <QuestionBlock key={q.number} q={q} showKey={showKey} userAnswer={answers[q.number] ?? ""}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [q.number]: v }))} feedbackVisible={submitted} />
        ))}
        {!submitted ? (
          <button type="button" onClick={() => { setSubmitted(true); setShowKey(true); }}
            className="mt-2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow">Nộp bài · Submit</button>
        ) : score ? (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm font-bold text-emerald-900">Kết quả: {score.raw}/{score.total}</p>
            <button type="button" onClick={() => { setAnswers({}); setSubmitted(false); setShowKey(false); }}
              className="mt-2 rounded-full border border-emerald-700 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">Làm lại · Reset</button>
          </div>
        ) : null}
      </section>

      {item.vocabulary_focus.length > 0 && (
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">Từ vựng trọng tâm · Key vocabulary</h2>
          <table className="w-full text-xs"><thead className="text-[10px] uppercase text-slate-600"><tr><th className="text-left">Từ</th><th className="text-left">Nghĩa</th><th className="text-left">IPA</th><th className="text-left">Band</th></tr></thead>
            <tbody>{item.vocabulary_focus.map((v, i) => (<tr key={i} className="border-t border-slate-100"><td className="py-1 font-semibold">{v.word}</td><td className="py-1">{v.vi_translation}</td><td className="py-1 font-mono">{v.ipa}</td><td className="py-1 text-slate-600">{v.band_level}</td></tr>))}</tbody></table>
        </section>
      )}

      {item.vietnamese_speaker_strategies.length > 0 && (
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">Mẹo cho người Việt · VN-speaker strategies</h2>
          <ul className="space-y-1 text-xs leading-relaxed text-slate-700">{item.vietnamese_speaker_strategies.map((s, i) => <li key={i} className="flex gap-2"><span className="text-sky-700">•</span><span>{s}</span></li>)}</ul>
        </section>
      )}

      {item.common_mistakes_vi.length > 0 && (
        <section className="mt-4 rounded-xl border border-rose-200 bg-rose-50/50 p-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-rose-700">Bẫy thường gặp · Common mistakes</h2>
          <ul className="space-y-1 text-xs leading-relaxed text-slate-800">{item.common_mistakes_vi.map((m, i) => <li key={i} className="flex gap-2"><span className="text-rose-700">!</span><span>{m}</span></li>)}</ul>
        </section>
      )}
    </div>
  );
}
