/**
 * Iteration wrapper around <SpeechDrill>.
 *
 * Takes a list of sentences and walks the learner through them one at a
 * time, using the existing <SpeechDrill> primitive for each card. When
 * all sentences are done, calls onComplete and renders a brief finish
 * card.
 *
 * Used by:
 *   - <RoomPronunciationPractice> modal — practices a room's keywords.
 *   - (Future) <SpeechDrillPage> — could replace its inlined iteration
 *     to share this code; left untouched for now to minimize blast
 *     radius while the new modal lands.
 *
 * Why this is its own component (not a `sentences` prop on SpeechDrill):
 *   <SpeechDrill> is a single-card primitive — already shipped, tested,
 *   used in production by /speak. Overloading it with iteration logic
 *   would push state-machine complexity (current index, finish state)
 *   into a component whose contract is "score one sentence". A wrapper
 *   keeps each layer's job clear.
 */

import React, { useMemo, useState } from "react";

import { SpeechDrill } from "@/components/speech/SpeechDrill";
import type { ScoreResult } from "@/lib/pronunciation/scorer";

export type SessionSentence = {
  /** What the learner is asked to say (English). */
  target_en: string;
  /** Bilingual translation displayed beneath. */
  target_vi: string;
  /**
   * Optional metadata (e.g. the original keyword) — kept for callers that
   * want to reason about the current sentence's origin without re-matching
   * the target string. Not surfaced anywhere downstream today; Wave 2
   * Step 3 (per-attempt persistence) will wire an onAttempt path that uses it.
   */
  meta?: Record<string, unknown>;
};

export type SpeechDrillSessionProps = {
  sentences: SessionSentence[];
  /** Fires per scored attempt at the SpeechDrill level. */
  onScore?: (score: ScoreResult) => void;
  /** Fires when the user reaches the end (sentencesCompleted = sentences.length). */
  onComplete?: (sentencesCompleted: number) => void;
};

const wrap: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const progressBarTrack: React.CSSProperties = {
  height: 4,
  width: "100%",
  background: "rgba(0,0,0,0.08)",
  borderRadius: 9999,
  overflow: "hidden",
};

const progressLabel: React.CSSProperties = {
  marginTop: 8,
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(0,0,0,0.6)",
};

const finishCard: React.CSSProperties = {
  border: "1px solid rgba(217,119,6,0.18)",
  borderRadius: 22,
  padding: 28,
  background: "#fffbeb",
  textAlign: "center",
};

export function SpeechDrillSession({
  sentences,
  onScore,
  onComplete,
}: SpeechDrillSessionProps) {
  const [index, setIndex] = useState(0);
  const total = sentences.length;
  const isDone = index >= total;
  const current = sentences[index];

  const progressPct = useMemo(() => {
    if (total === 0) return 0;
    return Math.min(100, Math.round((index / total) * 100));
  }, [index, total]);

  if (total === 0) {
    return (
      <div style={wrap}>
        <p style={{ ...progressLabel, fontSize: 14 }}>
          No sentences to practice yet.
        </p>
      </div>
    );
  }

  if (isDone) {
    return (
      <div style={wrap}>
        <section style={finishCard} role="region" aria-label="Practice complete">
          <div style={{ fontSize: 36 }} aria-hidden>
            ✨
          </div>
          <h2
            style={{
              marginTop: 8,
              fontSize: 18,
              fontWeight: 900,
              color: "rgba(10,10,10,0.94)",
            }}
          >
            Practice complete — {total} sentence{total === 1 ? "" : "s"}.
            <span
              style={{
                display: "block",
                marginTop: 6,
                fontSize: 13,
                fontWeight: 500,
                color: "#a16207",
              }}
            >
              Hoàn thành — {total} câu.
            </span>
          </h2>
        </section>
      </div>
    );
  }

  const ordinal = index + 1;

  return (
    <div style={wrap}>
      <section aria-label="Progress">
        <div style={progressBarTrack}>
          <div
            style={{
              height: "100%",
              width: `${progressPct}%`,
              background: "#d97706",
              borderRadius: 9999,
              transition: "width 240ms ease",
            }}
            role="progressbar"
            aria-valuenow={ordinal}
            aria-valuemin={1}
            aria-valuemax={total}
          />
        </div>
        <div style={progressLabel}>
          Sentence {ordinal} of {total} · Câu {ordinal}/{total}
        </div>
      </section>

      <SpeechDrill
        // Force a clean mount per sentence so the internal state machine
        // resets — same trick SpeechDrillPage uses.
        key={index}
        targetSentence={current.target_en}
        targetSentenceVi={current.target_vi}
        onScore={onScore}
        onNext={() => {
          const nextIndex = index + 1;
          setIndex(nextIndex);
          if (nextIndex >= total) onComplete?.(total);
        }}
      />
    </div>
  );
}
