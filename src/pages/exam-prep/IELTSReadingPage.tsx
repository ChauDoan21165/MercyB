// src/pages/exam-prep/IELTSReadingPage.tsx — /exam/ielts/reading
//
// Lightweight reading practice. Renders the passage + the same
// self-grading question pattern as Listening, since the answer-check
// logic is the same shape.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumGate } from "@/components/exam-prep/ielts/PremiumGate";
import { IELTS_COPY } from "@/components/exam-prep/ielts/ieltsCopy";
import samples from "@/data/exam-prep/ielts/sample-questions.json";

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function IELTSReadingPage() {
  const r = (samples as typeof samples).reading;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  const correctCount = r.questions.reduce((acc, q) => {
    return normalize(answers[q.id] ?? "") === normalize(q.answer)
      ? acc + 1
      : acc;
  }, 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {IELTS_COPY.readingTitle.vi}
        </h1>
        <Button asChild size="sm" variant="ghost">
          <Link to="/exam/ielts">{IELTS_COPY.backToOverview.vi}</Link>
        </Button>
      </header>

      <PremiumGate>
        <div className="space-y-3">
          <div className="rounded-xl border border-primary/15 bg-white/80 p-4">
            <p className="text-sm font-semibold text-foreground">{r.title_vi}</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {r.passage_en}
            </p>
          </div>

          {r.questions.map((q) => (
            <div
              key={q.id}
              className="rounded-lg border border-primary/10 bg-white/80 p-3"
            >
              <p className="text-sm text-foreground">{q.prompt_vi}</p>
              <p className="mt-0.5 text-xs italic text-muted-foreground">
                {q.prompt_en}
              </p>
              <Input
                value={answers[q.id] ?? ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                }
                className="mt-2 max-w-sm"
              />
              {revealed && (
                <p className="mt-2 flex items-center gap-1 text-xs">
                  {normalize(answers[q.id] ?? "") === normalize(q.answer) ? (
                    <>
                      <CheckCircle2 size={12} className="text-primary" />
                      <span className="text-primary">{q.answer}</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={12} className="text-destructive" />
                      <span className="text-muted-foreground">
                        Đáp án:{" "}
                        <span className="text-foreground">{q.answer}</span>
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant={revealed ? "ghost" : "default"}
              onClick={() => setRevealed((x) => !x)}
            >
              {revealed ? "Ẩn đáp án" : "Kiểm tra đáp án"}
            </Button>
            {revealed && (
              <p className="text-xs text-muted-foreground">
                {correctCount} / {r.questions.length} đúng
              </p>
            )}
          </div>
        </div>
      </PremiumGate>
    </div>
  );
}
