// src/components/exam-prep/ielts/IELTSSpeakingPractice.tsx
//
// Shell for the three Speaking parts. Microphone capture + transcription
// is intentionally out of scope tonight — daytime work integrates STT.
// This component renders the prompts + a simple stopwatch so users can
// practise reading-aloud-and-timing themselves.

import React, { useEffect, useRef, useState } from "react";
import { Mic, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IELTS_COPY } from "./ieltsCopy";

interface IELTSSpeakingPracticeProps {
  partTitle: string;
  prompts_vi: string[];
  prompts_en?: string[];
  /** Optional countdown — used by Part 2 (60s prep + 120s speaking). */
  countdownSec?: number;
}

function formatMMSS(secs: number): string {
  const s = Math.max(0, Math.floor(secs));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export function IELTSSpeakingPractice({
  partTitle,
  prompts_vi,
  prompts_en,
  countdownSec,
}: IELTSSpeakingPracticeProps) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState<number>(countdownSec ?? 0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => {
      setSeconds((s) => (countdownSec ? Math.max(0, s - 1) : s + 1));
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [running, countdownSec]);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-primary/15 bg-white/80 p-4">
        <div className="flex items-center gap-2">
          <Mic size={16} />
          <p className="text-sm font-semibold text-foreground">{partTitle}</p>
        </div>
        <ul className="mt-2 space-y-2">
          {prompts_vi.map((p, i) => (
            <li key={i} className="text-sm text-foreground">
              <span className="mr-2 font-mono text-xs text-muted-foreground">
                {i + 1}.
              </span>
              {p}
              {prompts_en?.[i] && (
                <span className="mt-0.5 block text-xs italic text-muted-foreground">
                  {prompts_en[i]}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-primary/15 bg-white/80 p-3">
        <span className="font-mono text-base font-semibold text-foreground">
          {formatMMSS(seconds)}
        </span>
        <Button
          type="button"
          size="sm"
          variant={running ? "destructive" : "default"}
          onClick={() => setRunning((r) => !r)}
        >
          {running ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              {IELTS_COPY.speakingStopTimerCta.vi}
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {IELTS_COPY.speakingStartTimerCta.vi}
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {IELTS_COPY.speakingMicShellHint.vi}
      </p>
    </div>
  );
}
