// src/components/exam-prep/ielts/IELTSListeningPractice.tsx
//
// Listening practice with a transcript fallback. Audio is intentionally
// not bundled tonight — the placeholder flag in the JSON tells us
// whether to render an audio player or the transcript-only mode.
// Self-grading: user types answers, we compare against the stored key.

import React, { useState } from "react";
import { CheckCircle2, Headphones, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IELTS_COPY } from "./ieltsCopy";

export type ListeningQuestion = {
  id: string;
  prompt_vi: string;
  prompt_en: string;
  answer: string;
};

interface IELTSListeningPracticeProps {
  audioUrl: string | null;
  transcript_en: string;
  questions: ReadonlyArray<ListeningQuestion>;
}

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function IELTSListeningPractice({
  audioUrl,
  transcript_en,
  questions,
}: IELTSListeningPracticeProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  const correctCount = questions.reduce((acc, q) => {
    return normalizeAnswer(answers[q.id] ?? "") === normalizeAnswer(q.answer)
      ? acc + 1
      : acc;
  }, 0);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-primary/15 bg-white/80 p-4">
        <div className="flex items-center gap-2">
          <Headphones size={16} />
          <p className="text-sm font-semibold text-foreground">
            {IELTS_COPY.listeningTitle.vi}
          </p>
        </div>

        {audioUrl ? (
          <audio controls className="mt-3 w-full" src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            {IELTS_COPY.listeningAudioPlaceholder.vi}
          </p>
        )}

        <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
          {IELTS_COPY.listeningTranscriptLabel.vi}
        </p>
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">
          {transcript_en}
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
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
                {normalizeAnswer(answers[q.id] ?? "") ===
                normalizeAnswer(q.answer) ? (
                  <>
                    <CheckCircle2 size={12} className="text-primary" />
                    <span className="text-primary">{q.answer}</span>
                  </>
                ) : (
                  <>
                    <XCircle size={12} className="text-destructive" />
                    <span className="text-muted-foreground">
                      Đáp án: <span className="text-foreground">{q.answer}</span>
                    </span>
                  </>
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant={revealed ? "ghost" : "default"}
          onClick={() => setRevealed((r) => !r)}
        >
          {revealed ? "Ẩn đáp án" : "Kiểm tra đáp án"}
        </Button>
        {revealed && (
          <p className="text-xs text-muted-foreground">
            {correctCount} / {questions.length} đúng
          </p>
        )}
      </div>
    </div>
  );
}
