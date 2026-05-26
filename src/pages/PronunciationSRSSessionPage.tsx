// src/pages/PronunciationSRSSessionPage.tsx — /pronunciation/srs
//
// Drives a session loop over the pronunciation_srs_items due queue
// using PronunciationSRSCard. Queue rows come from Supabase (RLS-scoped
// to the current user). Each successful attempt is recorded via the
// record_pronunciation_attempt RPC.
//
// Flow
// 1. Resolve the pronunciation_srs_enabled feature flag. OFF → show
//    unavailable state. Loading → render nothing.
// 2. Fetch due rows for the current user (next_review_at <= now,
//    ordered oldest-due-first, limit 20). If no user is available
//    (dev / harness), fall back to MOCK_QUEUE so the page is testable
//    without auth.
// 3. Show one card at a time, keyed by row id so each prompt starts
//    in the card's "idle" phase.
// 4. On the card's onContinue (only fires after status === "ok"),
//    call record_pronunciation_attempt and advance the index.
//    scoring-failed never reaches onContinue (the card's Thử lại
//    resets it locally), and an explicit guard here re-enforces that.
// 5. When the queue is exhausted, render a summary: average overall
//    score + aggregated weak phonemes ranked by frequency.
//
// CHAU ↓↓↓ COPY FROM HERE
// — A4 Pronunciation SRS session page wired against pronunciation_srs_items
//   + record_pronunciation_attempt RPC.

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PronunciationSRSCard } from "@/components/pronunciation/PronunciationSRSCard";
import {
  VIETNAMESE_L1_PHONEME_TARGETS,
  type PronunciationResult,
} from "@/lib/pronunciation/scoringEngine";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

interface QueueItem {
  readonly id: string | null;
  readonly referenceText: string;
  readonly targetPhonemes: string;
  readonly vocabSrsId: string | null;
}

interface PronunciationSrsDueRow {
  id: string;
  target_phrase: string;
  target_phonemes: string | null;
  vocab_srs_id: string | null;
  next_review_at: string;
}

const MOCK_QUEUE: ReadonlyArray<QueueItem> = [
  { id: null, referenceText: "I think the answer is three.", targetPhonemes: "", vocabSrsId: null },
  { id: null, referenceText: "She sells sea shells.",        targetPhonemes: "", vocabSrsId: null },
  { id: null, referenceText: "Very well done.",              targetPhonemes: "", vocabSrsId: null },
];

/** Engine emits 0..100; the RPC's pronunciation_score column is 0..1.
 *  Pass through values that already sit in [0, 1] in case the engine
 *  contract changes upstream. */
function toUnitScore(score: number | null): number {
  if (score == null || Number.isNaN(score)) return 0;
  return score > 1 ? score / 100 : score;
}

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

export default function PronunciationSRSSessionPage(): React.ReactElement | null {
  const { user, isLoading: authLoading } = useAuth();
  const { enabled: flagEnabled, loading: flagLoading } = useFeatureFlag(
    "pronunciation_srs_enabled",
  );

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<PronunciationResult[]>([]);
  const [queue, setQueue] = useState<ReadonlyArray<QueueItem> | null>(null);
  const [queueError, setQueueError] = useState<string | null>(null);

  // Load due queue once the flag is on and we know the auth state.
  // Anonymous / no-session callers fall back to MOCK_QUEUE so the page
  // remains testable without auth (RequireAuth wraps the route in
  // production, so this branch only fires in dev/harness contexts).
  useEffect(() => {
    if (flagLoading || authLoading) return;
    if (!flagEnabled) return;

    if (!user) {
      setQueue(MOCK_QUEUE);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("pronunciation_srs_items")
          .select("id, target_phrase, target_phonemes, vocab_srs_id, next_review_at")
          .lte("next_review_at" as never, new Date().toISOString())
          .order("next_review_at" as never, { ascending: true })
          .limit(20);
        if (cancelled) return;
        if (error) {
          setQueueError(error.message);
          setQueue([]);
          return;
        }
        const rows = (data ?? []) as PronunciationSrsDueRow[];
        setQueue(
          rows.map((r) => ({
            id: r.id,
            referenceText: r.target_phrase,
            targetPhonemes: r.target_phonemes ?? "",
            vocabSrsId: r.vocab_srs_id,
          })),
        );
      } catch (err) {
        if (cancelled) return;
        setQueueError(err instanceof Error ? err.message : String(err));
        setQueue([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [flagLoading, flagEnabled, authLoading, user]);

  const total = queue?.length ?? 0;
  const finished = queue != null && index >= total;
  const current = !finished && queue ? queue[index] : null;

  const handleContinue = useCallback(
    async (result: PronunciationResult) => {
      // Belt-and-suspenders: the card already withholds onContinue on
      // scoring-failed, but per the integration contract we never
      // record a failed attempt and never advance.
      if (result.status !== "ok") return;

      const item = current;
      if (item && user) {
        try {
          const { error } = await supabase.rpc("record_pronunciation_attempt", {
            p_user_id: user.id,
            p_target_phrase: item.referenceText,
            p_target_phonemes: item.targetPhonemes,
            p_pronunciation_score: toUnitScore(result.overallScore),
            p_phoneme_scores: result.phonemeScores,
            p_overall_score: result.overallScore,
            p_vocab_srs_id: item.vocabSrsId,
          });
          if (error && import.meta.env.DEV) {
            console.warn(
              "[PronunciationSRSSessionPage] record_pronunciation_attempt failed",
              error,
            );
          }
        } catch (err) {
          if (import.meta.env.DEV) {
            console.warn(
              "[PronunciationSRSSessionPage] record_pronunciation_attempt threw",
              err,
            );
          }
        }
      }

      setResults((prev) => [...prev, result]);
      setIndex((prev) => prev + 1);
    },
    [current, user],
  );

  const handleRestart = useCallback(() => {
    setResults([]);
    setIndex(0);
  }, []);

  const avg = useMemo(() => averageScore(results), [results]);
  const weak = useMemo(() => aggregateWeakPhonemes(results), [results]);

  // ── Early-return branches (all hooks must be declared above) ───────────
  if (flagLoading || authLoading) return null;

  if (!flagEnabled) {
    return (
      <div
        data-testid="pronunciation-srs-unavailable"
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "24px 16px 48px",
          color: "#0f172a",
        }}
      >
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
          Tính năng này chưa mở cho tài khoản của bạn.
          <br />
          <span style={{ color: "#475569", fontSize: 13 }}>
            Pronunciation SRS isn't available yet on your account.
          </span>
        </p>
      </div>
    );
  }

  if (queue == null) return null;

  // Empty due queue takes precedence over the summary path so a fresh
  // visit with nothing due lands on the "all caught up" empty state
  // instead of a 0/0 session summary.
  if (queue.length === 0 && results.length === 0) {
    return (
      <div
        data-testid="pronunciation-srs-empty"
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "24px 16px 48px",
          color: "#0f172a",
        }}
      >
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>
          Bạn đã luyện xong hôm nay
          <br />
          <span style={{ color: "#475569", fontSize: 13, fontWeight: 400 }}>
            All caught up for today.
          </span>
        </p>
        {queueError && import.meta.env.DEV ? (
          <p style={{ marginTop: 12, fontSize: 12, color: "#991b1b" }}>
            queue load error (dev only): {queueError}
          </p>
        ) : null}
      </div>
    );
  }

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
