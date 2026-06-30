// "So sánh với lần trước / Compare to previous attempt" panel.
//
// Renders below the score block in MercySpeakTab when a learner has
// 2+ attempts on the same sentence in this session. Shows:
//
//   - Trend arrow (↑/↓/→) with bilingual label.
//   - Score timeline: small horizontal strip with one block per
//     attempt, latest highlighted, best marked with a star.
//   - Most-improved + most-regressed phonemes between the latest
//     two attempts (cloud-only — local fallback shows score timeline
//     only).
//   - "Nghe lại lần tốt nhất" — replay the audio of the highest-
//     scoring attempt. Hidden when the blob has been dropped.
//
// All math is delegated to ../lib/pronunciation/sessionAttempts so
// this component stays focused on layout + interaction.

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Loader2,
  Play,
  RotateCcw,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  computePhonemeDeltas,
  computeTrend,
  getBestAttempt,
  hasPhonemeData,
  type AttemptRecord,
  type Trend,
} from "@/lib/pronunciation/sessionAttempts";

export type RetakeComparisonProps = {
  history: AttemptRecord[];
  /** Caller's reset handler — clears the history state in MercySpeakTab. */
  onReset: () => void;
};

const COLLAPSE_AT_ATTEMPT = 4;

export default function RetakeComparison({ history, onReset }: RetakeComparisonProps) {
  // Default expanded after attempt 2, collapsed after attempt 4 (per spec
  // "to reduce visual noise"). Re-evaluates only when we cross a
  // threshold — manual collapse/expand by the user is preserved across
  // re-renders within the same threshold.
  const [collapsed, setCollapsed] = useState(false);
  const lastAutoCollapseDecisionRef = useRef<boolean | null>(null);
  useEffect(() => {
    const shouldCollapse = history.length >= COLLAPSE_AT_ATTEMPT;
    if (lastAutoCollapseDecisionRef.current !== shouldCollapse) {
      lastAutoCollapseDecisionRef.current = shouldCollapse;
      setCollapsed(shouldCollapse);
    }
  }, [history.length]);

  // Replay-best player state.
  const [replayState, setReplayState] = useState<"idle" | "playing">("idle");
  const replayAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    return () => {
      replayAudioRef.current?.pause();
      replayAudioRef.current = null;
    };
  }, []);

  if (history.length < 2) return null;

  const trend = computeTrend(history);
  const best = getBestAttempt(history);
  const { improved, regressed } = computePhonemeDeltas(history);
  const cloudReady = hasPhonemeData(history);
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];

  const onReplayBest = () => {
    if (!best?.audioBlob) return;
    if (replayState === "playing") {
      replayAudioRef.current?.pause();
      setReplayState("idle");
      return;
    }
    try {
      const url = URL.createObjectURL(best.audioBlob);
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setReplayState("idle");
        replayAudioRef.current = null;
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setReplayState("idle");
        replayAudioRef.current = null;
      };
      replayAudioRef.current = audio;
      setReplayState("playing");
      void audio.play().catch(() => {
        setReplayState("idle");
        replayAudioRef.current = null;
      });
    } catch {
      setReplayState("idle");
    }
  };

  return (
    <section
      aria-label="So sánh với lần trước · Compare to previous"
      className="mt-3 rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/70 to-white p-3 md:p-4 shadow-sm"
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <TrendIcon trend={trend} />
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-indigo-900 truncate">
              {trendLabelVi(trend, latest.overallScore, previous.overallScore)}
            </div>
            <div className="text-[11px] font-semibold text-indigo-700/70 truncate">
              {trendLabelEn(trend, latest.overallScore, previous.overallScore)}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Mở rộng / Expand" : "Thu gọn / Collapse"}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-indigo-700 hover:bg-indigo-100"
        >
          {collapsed ? <ChevronDown className="h-4 w-4" aria-hidden /> : <ChevronUp className="h-4 w-4" aria-hidden />}
        </button>
      </header>

      {!collapsed && (
        <>
          {/* Score timeline */}
          <ol
            aria-label="Lịch sử điểm · Score history"
            className="mt-3 flex items-end gap-1.5 overflow-x-auto"
          >
            {history.map((a) => {
              const isLatest = a.attemptNumber === latest.attemptNumber;
              const isBest = best?.attemptNumber === a.attemptNumber;
              const tone =
                a.overallScore >= 85 ? "bg-emerald-500" :
                a.overallScore >= 60 ? "bg-amber-500" :
                                       "bg-rose-500";
              const height = Math.max(20, Math.round(a.overallScore * 0.6));
              return (
                <li
                  key={a.attemptNumber}
                  className={`flex flex-col items-center text-[10px] font-bold ${isLatest ? "text-indigo-900" : "text-slate-600"}`}
                >
                  <span className="mb-1 inline-flex items-center gap-0.5">
                    {isBest && <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />}
                    {a.overallScore}
                  </span>
                  <span
                    aria-label={`Lần ${a.attemptNumber}: ${a.overallScore}`}
                    title={`Lần ${a.attemptNumber}: ${a.overallScore} / 100`}
                    className={`block w-5 rounded-md ${tone} ${isLatest ? "ring-2 ring-offset-1 ring-indigo-400" : ""}`}
                    style={{ height }}
                  />
                  <span className="mt-1 tabular-nums">#{a.attemptNumber}</span>
                </li>
              );
            })}
          </ol>

          {/* Best-attempt indicator + replay */}
          {best && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2">
              <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
              <span className="min-w-0 flex-1 text-[12px] text-amber-900">
                <span className="block font-bold">
                  Lần tốt nhất: lần #{best.attemptNumber} ({best.overallScore}/100)
                </span>
                <span className="block text-amber-800/80">
                  Best attempt: #{best.attemptNumber} ({best.overallScore}/100)
                </span>
              </span>
              {best.audioBlob ? (
                <button
                  type="button"
                  onClick={onReplayBest}
                  aria-label={`Nghe lại lần tốt nhất · Replay best attempt`}
                  className="inline-flex h-8 items-center gap-1 rounded-full bg-amber-500 px-3 text-[12px] font-bold text-white shadow-sm hover:bg-amber-600 disabled:opacity-60"
                >
                  {replayState === "playing" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  ) : (
                    <Play className="h-3.5 w-3.5" aria-hidden />
                  )}
                  Nghe lại · Replay
                </button>
              ) : null}
            </div>
          )}

          {/* Phoneme deltas (cloud only) */}
          {cloudReady && (improved.length > 0 || regressed.length > 0) && (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {improved.length > 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-900">
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                    Tiến bộ · Improved
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {improved.map((d) => (
                      <li key={`up-${d.phoneme}`} className="flex items-center gap-2 text-[12px]">
                        <span className="inline-flex min-w-[40px] justify-center rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] font-bold text-emerald-900">
                          /{d.phoneme}/
                        </span>
                        <span className="text-emerald-900 tabular-nums">
                          {d.previousScore} → {d.latestScore}
                        </span>
                        <span className="ml-auto inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700">
                          <ArrowUp className="h-3 w-3" aria-hidden /> +{d.delta}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {regressed.length > 0 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-2.5">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-rose-900">
                    <TrendingDown className="h-3.5 w-3.5" aria-hidden />
                    Cần luyện lại · Needs work
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {regressed.map((d) => (
                      <li key={`down-${d.phoneme}`} className="flex items-center gap-2 text-[12px]">
                        <span className="inline-flex min-w-[40px] justify-center rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] font-bold text-rose-900">
                          /{d.phoneme}/
                        </span>
                        <span className="text-rose-900 tabular-nums">
                          {d.previousScore} → {d.latestScore}
                        </span>
                        <span className="ml-auto inline-flex items-center gap-0.5 text-[11px] font-bold text-rose-700">
                          <ArrowDown className="h-3 w-3" aria-hidden /> {d.delta}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Manual reset */}
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onReset}
              aria-label="Bắt đầu lại lịch sử so sánh · Reset comparison history"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-800"
            >
              <RotateCcw className="h-3 w-3" aria-hidden />
              Bắt đầu lại · Reset
            </button>
          </div>
        </>
      )}
    </section>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") return <ArrowUp className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />;
  if (trend === "down") return <ArrowDown className="h-5 w-5 shrink-0 text-rose-600" aria-hidden />;
  return <ArrowRight className="h-5 w-5 shrink-0 text-slate-600" aria-hidden />;
}

function trendLabelVi(trend: Trend, latest: number, prev: number): string {
  const diff = latest - prev;
  if (trend === "up") return `Tiến bộ! ${prev} → ${latest} (+${diff})`;
  if (trend === "down") return `Hơi tụt: ${prev} → ${latest} (${diff})`;
  return `Giữ nguyên: ${prev} → ${latest}`;
}

function trendLabelEn(trend: Trend, latest: number, prev: number): string {
  const diff = latest - prev;
  if (trend === "up") return `Improving — ${prev} → ${latest} (+${diff})`;
  if (trend === "down") return `Slipping — ${prev} → ${latest} (${diff})`;
  return `Steady — ${prev} → ${latest}`;
}
