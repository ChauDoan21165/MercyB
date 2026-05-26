// Timed practice for one TOEIC section.
//
// The component is shell-only: it loads the original sample questions
// (from sample-questions.json) for the requested section, runs a
// countdown timer matching the section's official-style budget, and
// auto-submits when the timer hits 0.
//
// Persisting attempts to Supabase / generating questions on demand are
// follow-up PRs. This shell makes the full flow runnable end-to-end on
// a Free preview before paywall and on a paid full session after.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";

import sampleData from "@/data/exam-prep/toeic/sample-questions.json";
import { getSectionById } from "@/data/exam-prep/toeic/structure";

type SubQuestion = {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation_en: string;
  explanation_vi: string;
};

type SampleQuestion = {
  id: string;
  sectionId: string;
  difficulty: "easy" | "medium" | "hard";
  prompt?: string;
  passage?: string;
  audioPrompt?: string;
  imageHint?: string;
  choices?: string[];
  correctIndex?: number;
  explanation_en?: string;
  explanation_vi?: string;
  questions?: SubQuestion[];
};

type SampleData = {
  questions: SampleQuestion[];
};

const SAMPLE: SampleData = sampleData as SampleData;

export type TOEICTimedPracticeProps = {
  sectionId: string;
};

export default function TOEICTimedPractice({
  sectionId,
}: TOEICTimedPracticeProps) {
  const nav = useNavigate();
  const section = useMemo(() => getSectionById(sectionId), [sectionId]);
  const sectionQuestions = useMemo(
    () => SAMPLE.questions.filter((q) => q.sectionId === sectionId),
    [sectionId],
  );

  const initialSeconds = (section?.timeLimitMinutes ?? 5) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [submitted, setSubmitted] = useState(false);

  // answers[questionId][subIndex|0] = chosen option index
  const [answers, setAnswers] = useState<
    Record<string, Record<number, number>>
  >({});

  const setAnswer = useCallback(
    (qid: string, subIdx: number, optIdx: number) => {
      setAnswers((prev) => ({
        ...prev,
        [qid]: { ...prev[qid], [subIdx]: optIdx },
      }));
    },
    [],
  );

  // Tick — pause once submitted.
  useEffect(() => {
    if (submitted) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setSubmitted(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [submitted]);

  if (!section) {
    return (
      <div style={{ padding: 32 }}>
        <p>Unknown TOEIC section. <Link to="/exam/toeic">Back to overview</Link>.</p>
      </div>
    );
  }

  const { score, totalAnswerable } = scoreAttempt(sectionQuestions, answers);

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");

  const onSubmit = () => setSubmitted(true);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 16px 80px" }}>
      <Link
        to="/exam/toeic"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(67,56,202,0.85)",
          textDecoration: "none",
          marginBottom: 12,
        }}
      >
        <ArrowLeft size={14} aria-hidden /> Overview · Tổng quan
      </Link>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 950,
              color: "rgba(15,23,42,0.94)",
            }}
          >
            {section.name_en}
          </h1>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(99,102,241,0.75)",
            }}
          >
            {section.name_vi}
          </div>
        </div>
        <Timer label={submitted ? "Done" : "Time left"} display={`${mins}:${secs}`} />
      </header>

      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        {sectionQuestions.map((q, qIdx) => (
          <li key={q.id} style={questionShell}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.45)", marginBottom: 4 }}>
              Question {qIdx + 1} · {q.difficulty}
            </div>
            <QuestionBlock
              question={q}
              answers={answers[q.id] ?? {}}
              onAnswer={(subIdx, optIdx) => !submitted && setAnswer(q.id, subIdx, optIdx)}
              showResults={submitted}
            />
          </li>
        ))}
      </ol>

      {!submitted ? (
        <button
          type="button"
          onClick={onSubmit}
          className="mt-6 w-full rounded-full bg-indigo-500 px-5 py-3 text-base font-black text-white shadow-[0_8px_22px_rgba(79,70,229,0.25)] hover:bg-indigo-600"
        >
          Submit · Nộp bài
        </button>
      ) : (
        <div
          style={{
            marginTop: 18,
            padding: "14px 16px",
            borderRadius: 14,
            background: "rgba(16,185,129,0.10)",
            border: "1px solid rgba(16,185,129,0.30)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(6,95,70,0.92)" }}>
            Result · Kết quả: {score} / {totalAnswerable} correct
          </div>
          <button
            type="button"
            onClick={() => nav("/exam/toeic")}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-2 text-[12px] font-black text-emerald-700"
          >
            Back to overview · Trở lại tổng quan
          </button>
        </div>
      )}
    </div>
  );
}

function Timer({ label, display }: { label: string; display: string }) {
  return (
    <div
      style={{
        padding: "8px 14px",
        borderRadius: 9999,
        background: "rgba(99,102,241,0.10)",
        border: "1px solid rgba(99,102,241,0.20)",
        color: "rgba(67,56,202,0.92)",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 800,
        fontSize: 14,
        fontVariantNumeric: "tabular-nums",
      }}
      aria-live="polite"
    >
      <Clock size={14} aria-hidden />
      <span style={{ fontSize: 11 }}>{label}</span>
      <span>{display}</span>
    </div>
  );
}

const questionShell: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(99,102,241,0.18)",
  background: "white",
};

function QuestionBlock({
  question,
  answers,
  onAnswer,
  showResults,
}: {
  question: SampleQuestion;
  answers: Record<number, number>;
  onAnswer: (subIdx: number, optIdx: number) => void;
  showResults: boolean;
}) {
  // Composite (Part 3, 4, some Part 7) — multiple sub-questions.
  if (question.questions && question.questions.length > 0) {
    return (
      <div>
        {(question.audioPrompt || question.passage) && (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              fontSize: 13,
              lineHeight: 1.6,
              padding: "10px 12px",
              background: "rgba(0,0,0,0.04)",
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            {question.audioPrompt ?? question.passage}
          </pre>
        )}
        {question.questions.map((sub, subIdx) => (
          <div key={subIdx} style={{ marginTop: subIdx > 0 ? 10 : 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(15,23,42,0.92)", marginBottom: 6 }}>
              {sub.prompt}
            </div>
            <ChoiceList
              choices={sub.choices}
              chosen={answers[subIdx]}
              correctIndex={sub.correctIndex}
              showResults={showResults}
              onChoose={(idx) => onAnswer(subIdx, idx)}
              namespace={`${question.id}-${subIdx}`}
            />
            {showResults && (
              <Explanation en={sub.explanation_en} vi={sub.explanation_vi} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Single-question (Part 1, 2, 5, 6, simple Part 7)
  return (
    <div>
      {question.imageHint && (
        <div
          style={{
            fontSize: 12,
            color: "rgba(0,0,0,0.55)",
            fontStyle: "italic",
            marginBottom: 6,
          }}
        >
          [Image: {question.imageHint}]
        </div>
      )}
      {(question.audioPrompt || question.passage || question.prompt) && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: 13,
            lineHeight: 1.6,
            padding: "10px 12px",
            background: "rgba(0,0,0,0.04)",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          {question.audioPrompt ?? question.passage ?? question.prompt}
        </pre>
      )}
      <ChoiceList
        choices={question.choices ?? []}
        chosen={answers[0]}
        correctIndex={question.correctIndex ?? -1}
        showResults={showResults}
        onChoose={(idx) => onAnswer(0, idx)}
        namespace={question.id}
      />
      {showResults && question.explanation_en && (
        <Explanation
          en={question.explanation_en}
          vi={question.explanation_vi ?? ""}
        />
      )}
    </div>
  );
}

function ChoiceList({
  choices,
  chosen,
  correctIndex,
  showResults,
  onChoose,
  namespace,
}: {
  choices: string[];
  chosen: number | undefined;
  correctIndex: number;
  showResults: boolean;
  onChoose: (idx: number) => void;
  namespace: string;
}) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
      {choices.map((c, i) => {
        const selected = chosen === i;
        const correct = showResults && i === correctIndex;
        const wrong = showResults && selected && i !== correctIndex;

        const bg = correct
          ? "rgba(16,185,129,0.14)"
          : wrong
            ? "rgba(239,68,68,0.10)"
            : selected
              ? "rgba(99,102,241,0.10)"
              : "white";
        const border = correct
          ? "1px solid rgba(16,185,129,0.55)"
          : wrong
            ? "1px solid rgba(239,68,68,0.55)"
            : selected
              ? "1px solid rgba(99,102,241,0.45)"
              : "1px solid rgba(0,0,0,0.10)";

        return (
          <li key={i}>
            <label
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "10px 12px",
                borderRadius: 12,
                background: bg,
                border,
                cursor: showResults ? "default" : "pointer",
              }}
            >
              <input
                type="radio"
                name={namespace}
                checked={selected}
                disabled={showResults}
                onChange={() => onChoose(i)}
                style={{ marginTop: 3 }}
              />
              <span style={{ fontSize: 14, lineHeight: 1.45 }}>
                <strong style={{ marginRight: 6 }}>
                  {String.fromCharCode(65 + i)}.
                </strong>
                {c}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function Explanation({ en, vi }: { en: string; vi: string }) {
  return (
    <div
      style={{
        marginTop: 8,
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(99,102,241,0.06)",
        border: "1px solid rgba(99,102,241,0.18)",
      }}
    >
      <div style={{ fontSize: 13, color: "rgba(15,23,42,0.85)" }}>{en}</div>
      {vi && (
        <div style={{ marginTop: 4, fontSize: 12, color: "rgba(67,56,202,0.85)" }}>
          {vi}
        </div>
      )}
    </div>
  );
}

// ── Scoring helper (also used by tests) ─────────────────────────────────

export function scoreAttempt(
  questions: SampleQuestion[],
  answers: Record<string, Record<number, number>>,
): { score: number; totalAnswerable: number } {
  let score = 0;
  let total = 0;
  for (const q of questions) {
    if (q.questions && q.questions.length > 0) {
      for (let i = 0; i < q.questions.length; i++) {
        total++;
        if (answers[q.id]?.[i] === q.questions[i].correctIndex) score++;
      }
    } else if (typeof q.correctIndex === "number") {
      total++;
      if (answers[q.id]?.[0] === q.correctIndex) score++;
    }
  }
  return { score, totalAnswerable: total };
}
