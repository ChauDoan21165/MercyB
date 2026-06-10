// src/pages/exam-prep/ielts/ListeningItem.tsx
//
// Per-item detail page at /exam-prep/ielts/listening/:itemId.
//
// Shows the audio script, all questions with options, vocabulary,
// VN-speaker strategies, and common mistakes. Three interactive
// affordances:
//   1. "Practice with audio" — uses useMercyVoice (PR #159) to TTS the
//      script via the ElevenLabs cloud voice. Contract C1: there is NO
//      silent browser-TTS fallback. If the cloud voice is unavailable we
//      show an explicit error + retry rather than read the script in a
//      robotic device voice.
//   2. "Take the practice test" — collapses the script + key, shows
//      questions one at a time with text-input answers, then computes
//      a band estimate via listeningRawToBand() at the end.
//   3. "View answer key" — reveals all correct answers + Vietnamese
//      explanations alongside each question.

import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ListChecks, Pause, Play, Volume2 } from "lucide-react";

import {
  getIELTSListeningItemById,
  listeningRawToBand,
  type IELTSListeningQuestion,
} from "@/data/exam-prep/ielts/listening-items";
import { useMercyVoice } from "@/hooks/useMercyVoice";

type Mode = "study" | "test";

// Vietnamese-first. Shown when the cloud voice can't play; paired with a
// retry control. C1 forbids silently dropping to a browser voice.
const AUDIO_UNAVAILABLE_MESSAGE =
  "Hiện chưa phát được giọng đọc. Vui lòng thử lại.";

function answerMatches(given: string, expected: string): boolean {
  const norm = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,;:!?]/g, "");
  return norm(given) === norm(expected);
}

function QuestionBlock({
  q,
  showKey,
  userAnswer,
  onChange,
  feedbackVisible,
}: {
  q: IELTSListeningQuestion;
  showKey: boolean;
  userAnswer: string;
  onChange: (v: string) => void;
  feedbackVisible: boolean;
}) {
  const correct = feedbackVisible && answerMatches(userAnswer, q.correct_answer);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold text-slate-500">Q{q.number}</span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-600">
          {q.type.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-900">{q.question_text}</p>
      {q.options ? (
        <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
          {q.options.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      ) : null}
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Đáp án của bạn · your answer"
        className="mt-2 w-full rounded border border-slate-300 px-2 py-1 text-sm"
      />
      {feedbackVisible ? (
        <p
          className={`mt-1 text-xs font-bold ${
            correct ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {correct ? "✓ Đúng" : `✗ Sai — đáp án: ${q.correct_answer}`}
        </p>
      ) : null}
      {showKey ? (
        <div className="mt-2 rounded bg-amber-50 p-2 text-xs">
          <p className="font-bold text-amber-900">
            Đáp án: <span className="font-mono">{q.correct_answer}</span>
          </p>
          <p className="mt-1 text-slate-700">{q.explanation_vi}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function ListeningItem() {
  const { itemId = "" } = useParams<{ itemId: string }>();
  const item = getIELTSListeningItemById(itemId);
  const { speak, cancel, supported } = useMercyVoice();

  const [mode, setMode] = useState<Mode>("study");
  const [showKey, setShowKey] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!item || !submitted) return null;
    const correctCount = item.questions.reduce(
      (n, q) => (answerMatches(answers[q.number] ?? "", q.correct_answer) ? n + 1 : n),
      0,
    );
    // Pro-rate the per-item score onto the 40-question IELTS scale so
    // the band estimate is meaningful even on a 5-question practice.
    const scaled = Math.round((correctCount / item.questions.length) * 40);
    return {
      raw: correctCount,
      total: item.questions.length,
      scaledRaw: scaled,
      band: listeningRawToBand(scaled),
    };
  }, [item, answers, submitted]);

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
        <p className="text-sm text-slate-600">Không tìm thấy bài · Item not found.</p>
        <Link
          to="/exam-prep/ielts/listening"
          className="mt-3 inline-block font-semibold text-sky-700 underline"
        >
          ← Quay lại danh sách · Back to list
        </Link>
      </div>
    );
  }

  const handlePlayAudio = async () => {
    if (audioActive) {
      cancel();
      setAudioActive(false);
      return;
    }
    setAudioError(null);
    setAudioActive(true);
    // C1: cloud voice only — no silent browser-TTS fallback. If cloud TTS is
    // unavailable (flag off / no key / network / playback error) the hook
    // returns cloud:false; surface an explicit error + retry instead of
    // reading the script in a robotic device voice.
    const res = await speak({
      text: item.audio_script,
      language: "en",
      // No-op: the hook's browserFallback is deprecated/ignored under C1. Kept
      // only to satisfy the current (pre-keystone) required-param signature; it
      // never runs, so no browser voice can leak in.
      browserFallback: () => {},
      onCloudEnd: () => setAudioActive(false),
    });
    if (!res.cloud) {
      setAudioActive(false);
      setAudioError(AUDIO_UNAVAILABLE_MESSAGE);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowKey(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowKey(false);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <Link
        to="/exam-prep/ielts/listening"
        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
      >
        <ChevronLeft size={14} />
        Danh sách · Back to list
      </Link>

      <header className="mt-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800">
            Section {item.section}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-slate-500">
            Band {item.difficulty_band} · {item.estimated_time_minutes} min
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
          {item.topic_title_vi}
        </h1>
        <p className="text-sm text-slate-500">{item.topic_title_en}</p>
      </header>

      {/* Audio + mode controls */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handlePlayAudio}
          disabled={!supported}
          className="inline-flex items-center gap-1 rounded-full border border-sky-600 bg-sky-600 px-3 py-1 text-xs font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {audioActive ? <Pause size={14} /> : <Play size={14} />}
          {audioActive ? "Dừng" : "Nghe bài · Practice with audio"}
        </button>
        <button
          type="button"
          onClick={() => setMode((m) => (m === "study" ? "test" : "study"))}
          className="inline-flex items-center gap-1 rounded-full border border-amber-600 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
        >
          <ListChecks size={14} />
          {mode === "study" ? "Làm bài · Take the test" : "Quay lại học · Back to study"}
        </button>
        <button
          type="button"
          onClick={() => setShowKey((v) => !v)}
          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
        >
          {showKey ? "Ẩn đáp án · Hide key" : "Xem đáp án · Show answer key"}
        </button>
      </div>
      {!supported ? (
        <p className="mt-2 text-[11px] text-slate-500">
          Trình duyệt hiện không hỗ trợ TTS — bạn có thể đọc transcript bên dưới.
        </p>
      ) : null}
      {audioError ? (
        <div
          role="alert"
          className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800"
        >
          <span>{audioError}</span>
          <button
            type="button"
            onClick={handlePlayAudio}
            className="rounded-full border border-rose-600 bg-white px-3 py-1 font-semibold text-rose-700 hover:bg-rose-100"
          >
            Thử lại · Retry
          </button>
        </div>
      ) : null}

      {/* Script — hidden when actively testing for cleaner focus */}
      {mode === "study" ? (
        <section className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Volume2 size={12} />
            Transcript · Bản ghi âm thanh
          </h2>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
            {item.audio_script}
          </pre>
        </section>
      ) : null}

      {/* Questions */}
      <section className="mt-4 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Câu hỏi · Questions
        </h2>
        {item.questions.map((q) => (
          <QuestionBlock
            key={q.number}
            q={q}
            showKey={showKey}
            userAnswer={answers[q.number] ?? ""}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [q.number]: v }))}
            feedbackVisible={submitted}
          />
        ))}
        {mode === "test" && !submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow"
          >
            Nộp bài · Submit
          </button>
        ) : null}
        {submitted && score ? (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm font-bold text-emerald-900">
              Kết quả: {score.raw}/{score.total} — Band ước lượng (theo IELTS 40-câu):{" "}
              <span className="text-lg">{score.band.toFixed(1)}</span>
            </p>
            <p className="text-[11px] text-emerald-800">
              Pro-rated to a 40-question paper: {score.scaledRaw}/40 → band{" "}
              {score.band.toFixed(1)}.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 rounded-full border border-emerald-700 bg-white px-3 py-1 text-xs font-semibold text-emerald-700"
            >
              Làm lại · Reset
            </button>
          </div>
        ) : null}
      </section>

      {/* Vocabulary */}
      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Từ vựng trọng tâm · Key vocabulary
        </h2>
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase text-slate-500">
            <tr>
              <th className="text-left">Từ</th>
              <th className="text-left">Nghĩa</th>
              <th className="text-left">IPA</th>
              <th className="text-left">Band</th>
            </tr>
          </thead>
          <tbody>
            {item.vocabulary_focus.map((v, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-1 font-semibold">{v.word}</td>
                <td className="py-1">{v.vi_translation}</td>
                <td className="py-1 font-mono">{v.ipa}</td>
                <td className="py-1 text-slate-500">{v.band_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Strategies */}
      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Mẹo cho người Việt · VN-speaker strategies
        </h2>
        <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
          {item.vietnamese_speaker_strategies.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-sky-700">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Common mistakes */}
      <section className="mt-4 rounded-xl border border-rose-200 bg-rose-50/50 p-4">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-rose-700">
          Bẫy thường gặp · Common mistakes
        </h2>
        <ul className="space-y-1 text-xs leading-relaxed text-slate-800">
          {item.common_mistakes_vi.map((m, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-rose-700">!</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
