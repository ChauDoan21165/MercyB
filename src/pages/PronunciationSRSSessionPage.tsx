// src/pages/PronunciationSRSSessionPage.tsx — /pronunciation/srs
//
// Drives a session loop over a queue of pronunciation prompts using
// PronunciationSRSCard. Mock queue for now (no backend / RPC yet).
//
// Flow
// 1. Show one card at a time, keyed by index so each prompt starts
//    in the card's "idle" phase.
// 2. On the card's onContinue (only fires after status === "ok"),
//    push the result and advance the index.
// 3. scoring-failed branch is handled inside the card (Thử lại resets
//    to idle without firing onContinue), so failures never advance.
// 4. When the queue is exhausted, render a summary: average overall
//    score + aggregated weak phonemes ranked by frequency.
//
// Backend touch surface: none. The card calls A2's scorePronunciation
// internally; this page never imports supabase / fetch / RPC.
//
// CHAU ↓↓↓ COPY FROM HERE
// — A4 Pronunciation SRS session page wired against PronunciationSRSCard.

import * as React from "react";
import { useCallback, useMemo, useState } from "react";

import { PronunciationSRSCard } from "@/components/pronunciation/PronunciationSRSCard";
import {
  VIETNAMESE_L1_PHONEME_TARGETS,
  type PronunciationResult,
} from "@/lib/pronunciation/scoringEngine";

interface QueueItem {
  readonly referenceText: string;
}

const MOCK_QUEUE: ReadonlyArray<QueueItem> = [
  { referenceText: "I think the answer is three." },
  { referenceText: "She sells sea shells." },
  { referenceText: "Very well done." },
];

const PHONEME_LABEL_BY_SYMBOL: ReadonlyMap<string, string> = new Map(
  VIETNAMESE_L1_PHONEME_TARGETS.map((t) => [t.phoneme, t.label]),
);

function phonemeLabel(symbol: string): string {
  return PHONEME_LABEL_BY_SYMBOL.get(symbol) ?? symbol;
}

interface AggregatedWeakPhoneme {
  phoneme: string;
  count: number;
}

function aggregateWeakPhonemes(
  results: ReadonlyArray<PronunciationResult>,
): AggregatedWeakPhoneme[] {
  const counts = new Map<string, number>();
  for (const r of results) {
    for (const p of r.weakPhonemes) {
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([phoneme, count]) => ({ phoneme, count }))
    .sort((a, b) => b.count - a.count || a.phoneme.localeCompare(b.phoneme));
}

function averageScore(results: ReadonlyArray<PronunciationResult>): number | null {
  const scores = results
    .map((r) => r.overallScore)
    .filter((s): s is number => typeof s === "number");
  if (scores.length === 0) return null;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  return Math.round(sum / scores.length);
}

export default function PronunciationSRSSessionPage(): React.ReactElement {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<PronunciationResult[]>([]);

  const queue = MOCK_QUEUE;
  const total = queue.length;
  const finished = index >= total;
  const current = finished ? null : queue[index];

  const handleContinue = useCallback((result: PronunciationResult) => {
    // Card only invokes onContinue on status === "ok". scoring-failed
    // is handled inside the card (Thử lại stays on the same prompt).
    setResults((prev) => [...prev, result]);
    setIndex((prev) => prev + 1);
  }, []);

  const handleRestart = useCallback(() => {
    setResults([]);
    setIndex(0);
  }, []);

  const avg = useMemo(() => averageScore(results), [results]);
  const weak = useMemo(() => aggregateWeakPhonemes(results), [results]);

  return (
    <div
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "24px 16px 48px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        color: "#0f172a",
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Luyện phát âm · Pronunciation SRS
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {finished
            ? "Hoàn thành phiên · Session complete"
            : "Phiên luyện tập · Practice session"}
        </h1>
        <p
          data-testid="pronunciation-srs-progress"
          style={{ margin: 0, fontSize: 13, color: "#475569" }}
        >
          {finished
            ? `${total} / ${total}`
            : `Câu ${index + 1} / ${total} · Prompt ${index + 1} of ${total}`}
        </p>
      </header>

      {!finished && current ? (
        <PronunciationSRSCard
          key={index}
          referenceText={current.referenceText}
          onContinue={handleContinue}
        />
      ) : (
        <SessionSummary
          total={total}
          attempts={results.length}
          averageScore={avg}
          weakPhonemes={weak}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

function SessionSummary({
  total,
  attempts,
  averageScore: avg,
  weakPhonemes,
  onRestart,
}: {
  total: number;
  attempts: number;
  averageScore: number | null;
  weakPhonemes: ReadonlyArray<AggregatedWeakPhoneme>;
  onRestart: () => void;
}): React.ReactElement {
  return (
    <section
      data-testid="pronunciation-srs-summary"
      style={{
        padding: 18,
        borderRadius: 18,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Tổng kết · Summary
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 14,
            color: "#475569",
          }}
        >
          {attempts} / {total} câu đã chấm điểm · {attempts} of {total} prompts
          scored
        </p>
      </div>

      <div
        style={{
          padding: 14,
          borderRadius: 14,
          border: "1px solid #bae6fd",
          background: "#f0f9ff",
          display: "flex",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span
          data-testid="pronunciation-srs-summary-average"
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#0c4a6e",
            lineHeight: 1,
          }}
        >
          {avg ?? "—"}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#0c4a6e",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Điểm trung bình · Average score
        </span>
      </div>

      {weakPhonemes.length > 0 ? (
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Cần luyện thêm · Phonemes to practice
          </p>
          <div
            data-testid="pronunciation-srs-summary-weak"
            style={{
              marginTop: 6,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {weakPhonemes.map((w) => (
              <span
                key={w.phoneme}
                style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 9999,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#0f172a",
                }}
                title={phonemeLabel(w.phoneme)}
              >
                /{w.phoneme}/{" "}
                <span style={{ color: "#64748b" }}>
                  {phonemeLabel(w.phoneme)} · ×{w.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#475569",
          }}
        >
          Không phát hiện âm yếu trong phiên này · No weak phonemes flagged
          this session.
        </p>
      )}

      <button
        type="button"
        data-testid="pronunciation-srs-summary-restart"
        onClick={onRestart}
        style={{
          alignSelf: "flex-start",
          background: "#0f172a",
          color: "#ffffff",
          border: "1px solid #0f172a",
          borderRadius: 9999,
          padding: "10px 18px",
          minHeight: 40,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Luyện lại · Practice again
      </button>
    </section>
  );
}
