// src/components/exam-prep/ielts/IELTSWritingTask.tsx
//
// Writing practice card for one of Task 1 or Task 2. Reuses the
// existing scoreEssay rubric (5 dimensions, 0-5) + maps to an IELTS
// band via rubricToBand. Word counter + countdown timer included.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scoreEssay } from "@/lib/writing-feedback/scoreEssay";
import { overallScore, type WritingRubric } from "@/lib/writing-feedback/rubric";
import {
  descriptorForBand,
  rubricToBand,
  type IELTSBand,
} from "@/data/exam-prep/ielts/band-descriptors";
import { IELTS_COPY } from "./ieltsCopy";

interface IELTSWritingTaskProps {
  taskId: "writing_task_1" | "writing_task_2";
  prompt_vi: string;
  prompt_en: string;
  minWords: number;
  /** Recommended time, seconds. UI counts down from this. */
  recommendedSec: number;
}

function countWords(text: string): number {
  const matches = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g);
  return matches ? matches.length : 0;
}

function formatMMSS(secs: number): string {
  const s = Math.max(0, Math.floor(secs));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export function IELTSWritingTask({
  taskId,
  prompt_vi,
  prompt_en,
  minWords,
  recommendedSec,
}: IELTSWritingTaskProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rubric, setRubric] = useState<WritingRubric | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(recommendedSec);
  const [timerRunning, setTimerRunning] = useState(false);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!timerRunning) return;
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [timerRunning]);

  useEffect(() => {
    if (secondsLeft === 0 && timerRunning) setTimerRunning(false);
  }, [secondsLeft, timerRunning]);

  const wordCount = useMemo(() => countWords(text), [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim().length === 0) return;
    setSubmitting(true);
    const r = scoreEssay(text);
    setRubric(r);
    setSubmitting(false);
    setTimerRunning(false);
  };

  const heading =
    taskId === "writing_task_1"
      ? IELTS_COPY.writingTask1Heading.vi
      : IELTS_COPY.writingTask2Heading.vi;

  const band = rubric ? rubricToBand(overallScore(rubric)) : null;
  const descriptor = band !== null ? descriptorForBand(band) : null;
  const tooShort = wordCount > 0 && wordCount < minWords;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-primary/15 bg-white/80 p-4">
        <p className="text-sm font-semibold text-foreground">{heading}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
          {IELTS_COPY.writingPrompt.vi}
        </p>
        <p className="mt-1 text-sm text-foreground">{prompt_vi}</p>
        <p className="mt-1 text-xs italic text-muted-foreground">{prompt_en}</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {IELTS_COPY.writingTimerLabel.vi}:{" "}
          <span className="font-mono text-foreground">
            {formatMMSS(secondsLeft)}
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setTimerRunning((r) => !r)}
        >
          {timerRunning ? "Dừng" : "Bắt đầu"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={IELTS_COPY.writingInputPlaceholder.vi}
          rows={12}
          className="w-full resize-y rounded-md border border-input bg-background p-3 text-sm leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className={tooShort ? "text-amber-600" : undefined}>
            {IELTS_COPY.writingWordCount(wordCount, minWords).vi}
          </span>
          <Button type="submit" disabled={submitting || text.trim().length === 0}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {IELTS_COPY.writingSubmitCta.vi}
          </Button>
        </div>
      </form>

      {rubric && band !== null && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {IELTS_COPY.writingBandHeading.vi}
          </p>
          <p className="mt-1 text-3xl font-semibold text-foreground">
            {band}
            <span className="ml-1 text-base font-normal text-muted-foreground">
              / 9
            </span>
          </p>
          {descriptor && (
            <p className="mt-1 text-sm text-foreground">
              {descriptor.label_vi} — {descriptor.summary_vi}
            </p>
          )}
          {tooShort && (
            <p className="mt-2 text-xs text-amber-700">
              {IELTS_COPY.writingTooShort.vi}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
