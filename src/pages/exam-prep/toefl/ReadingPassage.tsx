// src/pages/exam-prep/toefl/ReadingPassage.tsx — /exam-prep/toefl/reading/:passageId
//
// Per-passage detail page. Shows the full academic passage,
// all 10 questions with text-input answers, VN explanations,
// and a score summary on submission.

import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, CheckCircle2, XCircle } from "lucide-react";
import { getTOEFLReadingPassageById, type TOEFLReadingQuestion } from "@/data/exam-prep/toefl/reading-passages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function QuestionBlock({ q, showKey, userAnswer, onChange, feedbackVisible }: {
  q: TOEFLReadingQuestion;
  showKey: boolean;
  userAnswer: string;
  onChange: (v: string) => void;
  feedbackVisible: boolean;
}) {
  const correct = feedbackVisible && normalize(userAnswer) === normalize(q.correct_answer);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold text-slate-500">Q{q.number}</span>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-600">{q.type.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-900">{q.question_text}</p>
      {q.options ? (
        <ul className="mt-1 space-y-0.5 text-xs text-slate-700">{q.options.map((opt, i) => <li key={i}>{opt}</li>)}</ul>
      ) : null}
      <Input value={userAnswer} onChange={(e) => onChange(e.target.value)} className="mt-2 max-w-sm" />
      {showKey && <p className="mt-1 text-xs text-slate-500"><span className="font-semibold">Đáp án:</span> {q.correct_answer}</p>}
      {showKey && q.explanation_vi && <p className="mt-0.5 text-xs italic text-slate-500">{q.explanation_vi}</p>}
      {feedbackVisible && (
        <p className="mt-1 flex items-center gap-1 text-xs">
          {correct ? (<><CheckCircle2 size={12} className="text-primary" /><span className="text-primary">Đúng</span></>) :
           (<><XCircle size={12} className="text-destructive" /><span className="text-destructive">Sai</span></>)}
        </p>
      )}
    </div>
  );
}

export default function ReadingPassage() {
  const { passageId } = useParams<{ passageId: string }>();
  const passage = useMemo(() => passageId ? getTOEFLReadingPassageById(passageId) : null, [passageId]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState(false);

  if (!passage) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 text-center">
        <p className="text-slate-500">Passage not found.</p>
        <Link to="/exam-prep/toefl/reading" className="text-sm text-amber-700 underline">Back to Reading list</Link>
      </div>
    );
  }

  const correctCount = passage.questions.reduce((acc, q) => normalize(answers[q.number] ?? "") === normalize(q.correct_answer) ? acc + 1 : acc, 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4">
        <Link to="/exam-prep/toefl/reading" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} />Quay lại danh sách bài đọc
        </Link>
        <h1 className="mt-2 text-xl font-bold text-slate-900">{passage.title_vi}</h1>
        <p className="text-sm text-slate-500">{passage.title_en}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span>Band {passage.band}</span><span>·</span><span>{passage.time_minutes} min</span><span>·</span><span>{passage.questions.length} questions</span>
        </div>
      </header>
      <div className="rounded-xl border border-primary/15 bg-white/80 p-4 mb-4">
        <p className="text-xs font-semibold text-slate-500 mb-1">{passage.summary_vi}</p>
        <div className="whitespace-pre-line text-sm leading-relaxed text-slate-800">{passage.passage_en}</div>
      </div>
      <div className="space-y-3">
        {passage.questions.map((q) => (
          <QuestionBlock key={q.number} q={q} showKey={revealed} userAnswer={answers[q.number] ?? ""}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [q.number]: v }))} feedbackVisible={checked} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button type="button" variant={revealed ? "ghost" : "default"} onClick={() => { setRevealed(!revealed); if (!revealed) setChecked(true); }}>
          {revealed ? "Ẩn đáp án" : "Kiểm tra đáp án"}
        </Button>
        {checked && <p className="text-xs text-slate-500">{correctCount} / {passage.questions.length} đúng</p>}
      </div>
    </div>
  );
}
