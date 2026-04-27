// src/pages/exam-prep/ielts/ReadingItem.tsx
//
// Per-passage detail page at /exam-prep/ielts/reading/:itemId.
//
// Two-pane layout (passage left, questions right) on desktop; stacks
// on mobile. Three interactive features:
//   1. Sentence highlight — tap any sentence in the passage to mark
//      it (helps the user practice the location skill that drops VN
//      candidates' Reading bands).
//   2. Per-question text input + submit → score + per-question
//      explanation reveal.
//   3. Elapsed-time tracker — shows how long the user has spent. The
//      IELTS spec gives 60 minutes for 3 passages, so 20 minutes per
//      passage is the implied per-passage budget.

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Clock, ListChecks } from "lucide-react";

import {
  getIELTSReadingItemById,
  readingRawToBand,
  type IELTSReadingQuestion,
} from "@/data/exam-prep/ielts/reading-items";

function answerMatches(given: string, expected: string): boolean {
  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[.,;:!?]/g, "");
  // Allow GT short-answer "any of A/B/C" by accepting substring match.
  if (expected.includes("/")) {
    return expected
      .split("/")
      .map((s) => norm(s))
      .some((alt) => norm(given) === alt);
  }
  return norm(given) === norm(expected);
}

function splitParagraphs(text: string): { label: string | null; body: string }[] {
  return text
    .split(/\n\s*\n+/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const m = /^\[([A-Z])\]\s*/.exec(p);
      if (m) return { label: m[1], body: p.slice(m[0].length) };
      return { label: null, body: p };
    });
}

function splitSentences(body: string): string[] {
  // Naive but effective for English prose: split on sentence-ending
  // punctuation followed by whitespace + capital letter.
  const out: string[] = [];
  let cur = "";
  const tokens = body.split(/(?<=[.!?])\s+/g);
  for (const t of tokens) {
    cur = t.trim();
    if (cur) out.push(cur);
  }
  return out;
}

function PassagePane({
  text,
  highlightedKeys,
  onToggle,
}: {
  text: string;
  highlightedKeys: Set<string>;
  onToggle: (key: string) => void;
}) {
  const paragraphs = useMemo(() => splitParagraphs(text), [text]);
  return (
    <div className="prose prose-sm max-w-none rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {paragraphs.map((para, pi) => (
        <p key={pi} className="mb-3 text-sm leading-relaxed">
          {para.label ? (
            <span className="mr-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
              {para.label}
            </span>
          ) : null}
          {splitSentences(para.body).map((s, si) => {
            const key = `${pi}-${si}`;
            const isHighlighted = highlightedKeys.has(key);
            return (
              <span
                key={key}
                onClick={() => onToggle(key)}
                className={`cursor-pointer transition-colors ${
                  isHighlighted ? "bg-yellow-200" : "hover:bg-yellow-50"
                }`}
              >
                {s}{" "}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

function QuestionBlock({
  q,
  userAnswer,
  onChange,
  feedbackVisible,
}: {
  q: IELTSReadingQuestion;
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
        <div className="mt-2 rounded bg-amber-50 p-2 text-xs">
          <p className={`font-bold ${correct ? "text-emerald-700" : "text-rose-700"}`}>
            {correct ? "✓ Đúng" : `✗ Sai — đáp án: ${q.correct_answer}`}
          </p>
          <p className="mt-1 text-slate-700">{q.explanation_vi}</p>
        </div>
      ) : null}
    </div>
  );
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ReadingItem() {
  const { itemId = "" } = useParams<{ itemId: string }>();
  const item = getIELTSReadingItemById(itemId);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [highlightedKeys, setHighlightedKeys] = useState<Set<string>>(new Set());
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (submitted) return;
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt.current);
    }, 1000);
    return () => window.clearInterval(id);
  }, [submitted]);

  const score = useMemo(() => {
    if (!item || !submitted) return null;
    const correctCount = item.questions.reduce(
      (n, q) => (answerMatches(answers[q.number] ?? "", q.correct_answer) ? n + 1 : n),
      0,
    );
    // Pro-rate the 13-question practice onto a 40-question IELTS scale
    // so the band estimate is meaningful.
    const scaledRaw = Math.round((correctCount / item.questions.length) * 40);
    const band = readingRawToBand(scaledRaw, item.module);
    return { raw: correctCount, total: item.questions.length, scaledRaw, band };
  }, [item, answers, submitted]);

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center">
        <p className="text-sm text-slate-600">Không tìm thấy bài · Item not found.</p>
        <Link
          to="/exam-prep/ielts/reading"
          className="mt-3 inline-block font-semibold text-violet-700 underline"
        >
          ← Quay lại danh sách · Back to list
        </Link>
      </div>
    );
  }

  const handleToggleHighlight = (key: string) => {
    setHighlightedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSubmit = () => setSubmitted(true);

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setHighlightedKeys(new Set());
    startedAt.current = Date.now();
    setElapsedMs(0);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <Link
        to="/exam-prep/ielts/reading"
        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
      >
        <ChevronLeft size={14} />
        Danh sách · Back to list
      </Link>

      <header className="mt-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-800">
            {item.module === "academic" ? "Academic" : "General Training"}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-slate-500">
            Band {item.difficulty_band} · {item.estimated_time_minutes} min
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-700">
            <Clock size={12} />
            {formatElapsed(elapsedMs)}
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{item.title_vi}</h1>
        <p className="text-sm text-slate-500">{item.title_en}</p>
        <p className="mt-2 text-[11px] text-slate-500">
          Mẹo · Tap any sentence in the passage to highlight it. Đây là kỹ năng định
          vị — IELTS Reading examiner đo location skill, không phải reading speed.
        </p>
      </header>

      {/* Two-pane layout: passage on left, questions on right. Stacks on mobile. */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Passage · Đoạn văn
          </h2>
          <PassagePane
            text={item.passage_text}
            highlightedKeys={highlightedKeys}
            onToggle={handleToggleHighlight}
          />
        </div>

        <div>
          <h2 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            <ListChecks size={12} />
            Câu hỏi · Questions ({item.questions.length})
          </h2>
          <div className="space-y-2">
            {item.questions.map((q) => (
              <QuestionBlock
                key={q.number}
                q={q}
                userAnswer={answers[q.number] ?? ""}
                onChange={(v) => setAnswers((prev) => ({ ...prev, [q.number]: v }))}
                feedbackVisible={submitted}
              />
            ))}
          </div>
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-3 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow"
            >
              Nộp bài · Submit
            </button>
          ) : null}
          {submitted && score ? (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-sm font-bold text-emerald-900">
                Kết quả: {score.raw}/{score.total} — Band ước lượng (theo IELTS{" "}
                {item.module === "academic" ? "Academic" : "General Training"} 40-câu):{" "}
                <span className="text-lg">{score.band.toFixed(1)}</span>
              </p>
              <p className="text-[11px] text-emerald-800">
                Pro-rated: {score.scaledRaw}/40. Thời gian dùng:{" "}
                {formatElapsed(elapsedMs)}.
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
        </div>
      </div>

      {/* Vocabulary, strategies, mistakes — full-width sections below */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Mẹo cho người Việt · VN-reader strategies
        </h2>
        <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
          {item.vietnamese_speaker_strategies.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-violet-700">•</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

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
