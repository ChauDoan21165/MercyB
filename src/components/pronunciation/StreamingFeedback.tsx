// src/components/pronunciation/StreamingFeedback.tsx
//
// Live UI for the streaming pronunciation flow. Renders three things
// on top of whatever waveform / chip row the Speak tab already shows:
//
//   1. A running-score pill that updates each time a `partial` frame
//      arrives from the edge fn.
//   2. A word-by-word chip row that recolours per word as scores come
//      in. Words not yet scored appear neutral; words returned with
//      accuracy ≥ 80 turn green; 60–79 amber; < 60 rose.
//   3. A "Connection slow" warning when the first partial frame hasn't
//      arrived within FIRST_PARTIAL_WARN_MS — gives the user a heads-up
//      that the streaming path is about to fall back.
//
// The component is purely presentational. The streaming lifecycle
// (open WebSocket, push chunks, end) is owned by the host page —
// MercySpeakTab in this PR.

import { useEffect, useState } from "react";

import {
  FIRST_PARTIAL_WARN_MS,
  type StreamingPartialResult,
  type StreamingWordResult,
} from "@/lib/pronunciation/streamingScorer";

export type StreamingFeedbackProps = {
  /** Most recent partial result, or null before the first arrives. */
  partial: StreamingPartialResult | null;
  /** True once the user has tapped Record — drives the latency timer. */
  isStreaming: boolean;
  /** Optional error message from the streaming layer; renders inline. */
  error?: string | null;
};

function statusColorClass(accuracy: number): string {
  if (accuracy < 0) {
    return "border-slate-200 bg-white text-slate-600";
  }
  if (accuracy >= 80) {
    return "border-emerald-300 bg-emerald-50 text-emerald-800";
  }
  if (accuracy >= 60) {
    return "border-amber-300 bg-amber-50 text-amber-800";
  }
  return "border-rose-300 bg-rose-50 text-rose-800";
}

function scoreToneClass(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-700";
  return "text-rose-700";
}

export default function StreamingFeedback({
  partial,
  isStreaming,
  error,
}: StreamingFeedbackProps) {
  const [elapsedMs, setElapsedMs] = useState(0);

  // Latency timer — drives the "connection slow" warning until the
  // first partial frame lands. Tick every 250ms.
  useEffect(() => {
    if (!isStreaming) {
      setElapsedMs(0);
      return;
    }
    const start = Date.now();
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 250);
    return () => window.clearInterval(id);
  }, [isStreaming]);

  const words: StreamingWordResult[] = partial?.words ?? [];
  const runningScore = partial?.runningScore ?? 0;
  const showSlowWarning =
    isStreaming && partial === null && elapsedMs > FIRST_PARTIAL_WARN_MS;

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            Đang nghe Mercy chấm trực tiếp
          </div>
          <div className="text-[11px] italic text-slate-600">
            Live pronunciation feedback
          </div>
        </div>
        <div
          className={`text-2xl font-bold tabular-nums ${
            partial ? scoreToneClass(runningScore) : "text-slate-300"
          }`}
        >
          {partial ? `${runningScore}` : "—"}
          <span className="text-xs font-normal text-slate-600 ml-1">/100</span>
        </div>
      </div>

      {showSlowWarning ? (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Kết nối chậm — sắp chuyển sang chế độ chấm cuối lượt.
          <span className="block italic text-amber-700/80 mt-0.5">
            Connection slow — switching to non-streaming mode shortly.
          </span>
        </div>
      ) : null}

      {error ? (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-1.5">
        {words.length === 0 ? (
          <span className="text-xs italic text-slate-600">
            {isStreaming
              ? "Đang chờ từ đầu tiên… · Waiting for first word…"
              : "Bấm Record để bắt đầu · Tap Record to start"}
          </span>
        ) : (
          words.map((w, i) => (
            <span
              key={`${w.word}-${i}`}
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition ${statusColorClass(
                w.accuracy,
              )}`}
              title={
                w.accuracy < 0
                  ? "Đang chờ chấm"
                  : `${w.accuracy}/100${w.errorType ? ` · ${w.errorType}` : ""}`
              }
            >
              {w.word}
              {w.accuracy >= 0 ? (
                <span className="ml-1.5 font-mono opacity-70">
                  {w.accuracy}
                </span>
              ) : null}
            </span>
          ))
        )}
      </div>

      <p className="mt-3 text-[10px] leading-snug text-slate-600">
        Xanh = ổn · Vàng = gần đúng · Đỏ = chưa rõ ·{" "}
        <span className="italic">Green = good · Amber = close · Red = unclear</span>
      </p>
    </div>
  );
}
