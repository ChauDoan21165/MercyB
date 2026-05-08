// src/components/exam-prep/ielts/IELTSSpeakingPractice.tsx
//
// Shell for the three Speaking parts. Microphone capture + transcription
// is intentionally out of scope. This component renders the prompts +
// a stopwatch so users can practise reading-aloud-and-timing themselves,
// plus pre-generated sample audio for band 5 and band 7 answers.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioUrl } from "@/hooks/useAudioUrl";
import { IELTS_COPY } from "./ieltsCopy";

interface IELTSSpeakingPracticeProps {
  partTitle: string;
  prompts_vi: string[];
  prompts_en?: string[];
  /** Stable topic id from speaking-topics.ts — used to build the pre-generated audio key. */
  topicId?: string;
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

export function IELTSSpeakingPractice({
  partTitle,
  prompts_vi,
  prompts_en,
  topicId,
  countdownSec,
  sample_answer_band_7,
  sample_answer_band_5,
}: IELTSSpeakingPracticeProps) {
  // Build deterministic pre-generated audio keys matching the files
  // uploaded to Supabase room-audio by scripts/generate-ielts-speaking-audio.ts
  const band7Key = topicId ? `ielts-speaking/${topicId}/band7.mp3` : null;
  const band5Key = topicId ? `ielts-speaking/${topicId}/band5.mp3` : null;
  const { url: band7Url, loading: band7Loading, error: band7Error } = useAudioUrl(band7Key);
  const { url: band5Url, loading: band5Loading, error: band5Error } = useAudioUrl(band5Key);

  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState<number>(countdownSec ?? 0);
  const [samplesOpen, setSamplesOpen] = useState(false);
  const [playingSample, setPlayingSample] = useState<SampleBand | null>(null);
  const [audioFailed, setAudioFailed] = useState<SampleBand | null>(null);
  const tickRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasSampleAnswers = Boolean(sample_answer_band_7 || sample_answer_band_5);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stopAudioPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingSample(null);
  }, []);

  const handleSamplePlayback = useCallback(
    (band: SampleBand) => {
      // Toggle: if same band is playing, pause it
      if (playingSample === band) {
        stopAudioPlayback();
        return;
      }

      // Stop any previous playback
      stopAudioPlayback();
      setAudioFailed(null);

      const url = band === "band7" ? band7Url : band5Url;
      const loading = band === "band7" ? band7Loading : band5Loading;
      const error = band === "band7" ? band7Error : band5Error;

      // Still resolving the Supabase public URL — show playing state
      if (loading || !url) {
        setPlayingSample(band);
        return;
      }

      // Pre-generated file may not exist yet — mark as failed rather
      // than burning live TTS quota
      if (error) {
        setAudioFailed(band);
        setPlayingSample(null);
        return;
      }

      const audio = new Audio(url);
      audio.preload = "metadata";

      setPlayingSample(band);

      audio.onended = () => {
        setPlayingSample(null);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setPlayingSample(null);
        setAudioFailed(band);
        audioRef.current = null;
      };

      audio.play().catch(() => {
        setPlayingSample(null);
        setAudioFailed(band);
        audioRef.current = null;
      });

      audioRef.current = audio;
    },
    [playingSample, stopAudioPlayback, band7Url, band5Url, band7Loading, band5Loading, band7Error, band5Error],
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
                        variant={audioFailed === "band7" ? "ghost" : "outline"}
                        onClick={() => handleSamplePlayback("band7")}
                        disabled={band7Loading}
                      >
                        {playingSample === "band7" ? (
                          band7Loading ? null : <Square className="mr-2 h-4 w-4" />
                        ) : (
                          <Volume2 className="mr-2 h-4 w-4" />
                        )}
                        {band7Loading ? "Đang tải…" : playingSample === "band7" ? "Dừng" : "Nghe"}
                      </Button>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {sample_answer_band_7}
                    </p>
                    {audioFailed === "band7" && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-amber-700">
                        <span>🔊</span>
                        <span>
                          Audio đang được chuẩn bị — vui lòng thử lại sau.
                        </span>
                      </p>
                    )}
                    {band7Error && !band7Loading && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-amber-700">
                        <span>🔊</span>
                        <span>
                          Audio đang được chuẩn bị — vui lòng thử lại sau.
                        </span>
                      </p>
                    )}
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
                        variant={audioFailed === "band5" ? "ghost" : "outline"}
                        onClick={() => handleSamplePlayback("band5")}
                        disabled={band5Loading}
                      >
                        {playingSample === "band5" ? (
                          band5Loading ? null : <Square className="mr-2 h-4 w-4" />
                        ) : (
                          <Volume2 className="mr-2 h-4 w-4" />
                        )}
                        {band5Loading ? "Đang tải…" : playingSample === "band5" ? "Dừng" : "Nghe"}
                      </Button>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {sample_answer_band_5}
                    </p>
                    {audioFailed === "band5" && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-amber-700">
                        <span>🔊</span>
                        <span>
                          Audio đang được chuẩn bị — vui lòng thử lại sau.
                        </span>
                      </p>
                    )}
                    {band5Error && !band5Loading && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-amber-700">
                        <span>🔊</span>
                        <span>
                          Audio đang được chuẩn bị — vui lòng thử lại sau.
                        </span>
                      </p>
                    )}
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