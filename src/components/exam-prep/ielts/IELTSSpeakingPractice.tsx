// src/components/exam-prep/ielts/IELTSSpeakingPractice.tsx
//
// Shell for the three Speaking parts. Microphone capture + transcription
// is intentionally out of scope tonight — daytime work integrates STT.
// This component renders the prompts + a simple stopwatch so users can
// practise reading-aloud-and-timing themselves.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMercyVoice } from "@/hooks/useMercyVoice";
import { IELTS_COPY } from "./ieltsCopy";

interface IELTSSpeakingPracticeProps {
  partTitle: string;
  prompts_vi: string[];
  prompts_en?: string[];
  /** Optional countdown — used by Part 2 (60s prep + 120s speaking). */
  countdownSec?: number;
  sample_answer_band_7?: string;
  sample_answer_band_5?: string;
}

type SampleBand = "band7" | "band5";

function formatMMSS(secs: number): string {
  const s = Math.max(0, Math.floor(secs));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

function stripAnnotations(text: string): string {
  return text.replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
}

export function IELTSSpeakingPractice({
  partTitle,
  prompts_vi,
  prompts_en,
  countdownSec,
  sample_answer_band_7,
  sample_answer_band_5,
}: IELTSSpeakingPracticeProps) {
  const mercyVoice = useMercyVoice();
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState<number>(countdownSec ?? 0);
  const [samplesOpen, setSamplesOpen] = useState(false);
  const [playingSample, setPlayingSample] = useState<SampleBand | null>(null);
  const tickRef = useRef<number | null>(null);
  const hasSampleAnswers = Boolean(sample_answer_band_7 || sample_answer_band_5);

  const stopSamplePlayback = useCallback(() => {
    mercyVoice.cancel();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlayingSample(null);
  }, [mercyVoice]);

  const browserFallback = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
          resolve();
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.95;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }),
    [],
  );

  const handleSamplePlayback = useCallback(
    async (band: SampleBand, answerText: string) => {
      if (playingSample === band) {
        stopSamplePlayback();
        return;
      }

      stopSamplePlayback();
      setPlayingSample(band);
      const textToSpeak = band === "band5" ? stripAnnotations(answerText) : answerText;

      try {
        await mercyVoice.speak({
          text: textToSpeak,
          language: "en",
          browserFallback,
        });
      } finally {
        setPlayingSample((current) => (current === band ? null : current));
      }
    },
    [browserFallback, mercyVoice, playingSample, stopSamplePlayback],
  );

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

        {hasSampleAnswers && (
          <div className="mt-4 border-t border-primary/10 pt-3">
            <button
              type="button"
              className="text-left text-sm font-semibold text-primary underline-offset-4 hover:underline"
              onClick={() => setSamplesOpen((open) => !open)}
              aria-expanded={samplesOpen}
            >
              Xem câu trả lời mẫu · See sample answers
            </button>

            {samplesOpen && (
              <div className="mt-3 space-y-3">
                {sample_answer_band_7 && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-emerald-800">
                        Band 7 ✓
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleSamplePlayback("band7", sample_answer_band_7)}
                      >
                        {playingSample === "band7" ? (
                          <Square className="mr-2 h-4 w-4" />
                        ) : (
                          <Volume2 className="mr-2 h-4 w-4" />
                        )}
                        {playingSample === "band7" ? "Dừng" : "Nghe"}
                      </Button>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {sample_answer_band_7}
                    </p>
                  </div>
                )}

                {sample_answer_band_5 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-amber-800">
                        Band 5 — chú ý lỗi · note the errors
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleSamplePlayback("band5", sample_answer_band_5)}
                      >
                        {playingSample === "band5" ? (
                          <Square className="mr-2 h-4 w-4" />
                        ) : (
                          <Volume2 className="mr-2 h-4 w-4" />
                        )}
                        {playingSample === "band5" ? "Dừng" : "Nghe"}
                      </Button>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {sample_answer_band_5}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
