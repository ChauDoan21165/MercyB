// /vocabulary/review — daily SRS review session.
//
// Loads the due queue (RLS-scoped), then walks the user through one
// card at a time. Each card has two phases:
//   1. front-only (word + IPA, "Tap to reveal")
//   2. revealed (definitions + example + four rating buttons)
//
// On each rating: applies SM-2 + persists via repository, advances to
// the next card. When the queue empties we show a "Hoàn thành" panel
// with the time of the next scheduled review (or "no upcoming reviews"
// when the user has no cards beyond today).
//
// Tone (per brief):
//   - "Lần ôn tiếp theo" never "Bạn cần học lại"
//   - "Hoàn thành" celebration on empty queue
//   - "Đã ôn N/M" progress label
//   - No shame for the "Lại / Again" rating — it's just a fact.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import {
  fetchDueQueue,
  fetchNextScheduledAt,
  recordReview,
  type VocabularyEntry,
} from "@/lib/vocabulary/repository";
import type { Rating } from "@/lib/vocabulary/sm2";

type Phase = "loading" | "reviewing" | "done" | "error" | "anon";

export type ReviewSessionViewProps = {
  /** When provided, skips the live fetch and uses this queue. Used by tests. */
  initialQueue?: VocabularyEntry[];
  /** Override clock (tests). */
  nowMs?: number;
};

export default function ReviewSessionPage() {
  return <ReviewSessionView />;
}

export function ReviewSessionView({
  initialQueue,
  nowMs,
}: ReviewSessionViewProps = {}) {
  const { user, isLoading: authLoading } = useAuth();
  const [phase, setPhase] = useState<Phase>(initialQueue ? "reviewing" : "loading");
  const [queue, setQueue] = useState<VocabularyEntry[]>(initialQueue ?? []);
  const [position, setPosition] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [completed, setCompleted] = useState<number>(0);
  const [nextScheduledAt, setNextScheduledAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<boolean>(false);

  const totalAtStart = useMemo(() => queue.length, [queue.length]);

  // Initial load — only when no queue was injected by tests.
  useEffect(() => {
    if (initialQueue) return;
    if (authLoading) return;
    if (!user) {
      setPhase("anon");
      return;
    }
    let alive = true;
    setPhase("loading");
    fetchDueQueue()
      .then(async (rows) => {
        if (!alive) return;
        if (rows.length === 0) {
          const next = await fetchNextScheduledAt().catch(() => null);
          if (!alive) return;
          setNextScheduledAt(next);
          setPhase("done");
          return;
        }
        setQueue(rows);
        setPosition(0);
        setRevealed(false);
        setCompleted(0);
        setPhase("reviewing");
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load review queue.");
        setPhase("error");
      });
    return () => {
      alive = false;
    };
  }, [authLoading, user, initialQueue]);

  const current = queue[position] ?? null;

  const onRate = useCallback(
    async (r: Rating) => {
      if (!current || rating) return;
      setRating(true);
      try {
        await recordReview({ entry: current, rating: r, nowMs });
        const nextPos = position + 1;
        setCompleted((n) => n + 1);
        if (nextPos >= queue.length) {
          const next = await fetchNextScheduledAt().catch(() => null);
          setNextScheduledAt(next);
          setPhase("done");
        } else {
          setPosition(nextPos);
          setRevealed(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save review.");
      } finally {
        setRating(false);
      }
    },
    [current, position, queue.length, rating, nowMs],
  );

  if (phase === "anon") {
    return (
      <div style={pageStyle}>
        <Header />
        <p style={emptyStyle}>
          Bạn cần đăng nhập để ôn từ vựng.
          <br />
          <span style={emptyEnStyle}>Sign in to review vocabulary.</span>
        </p>
        <Link to="/signin?next=/vocabulary/review" style={primaryBtnStyle}>
          Đăng nhập · Sign in
        </Link>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div style={pageStyle}>
        <Header />
        <p style={emptyStyle}>Đang tải hàng đợi… · Loading queue…</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div style={pageStyle}>
        <Header />
        <p style={emptyStyle}>
          Có lỗi tải hàng đợi.
          <br />
          <span style={emptyEnStyle}>{error ?? "Failed to load."}</span>
        </p>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div style={pageStyle} data-testid="review-done">
        <Header />
        <section style={doneCardStyle}>
          <div style={{ fontSize: 32 }}>🎉</div>
          <h2 style={doneTitleStyle}>Hoàn thành!</h2>
          <p style={doneSubtitleStyle}>
            {completed > 0
              ? `${completed} từ đã ôn lại.`
              : "Hôm nay bạn không có từ nào cần ôn."}
          </p>
          <p style={doneEnStyle}>
            {completed > 0 ? `${completed} words reviewed.` : "No words due today."}
          </p>
          <NextReviewLine iso={nextScheduledAt} nowMs={nowMs} />
          <div style={{ marginTop: 16 }}>
            <Link to="/vocabulary" style={secondaryBtnStyle}>
              Về thư viện · Back to library
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  return (
    <div style={pageStyle}>
      <Header />
      <ProgressBar position={completed} total={totalAtStart} />

      <section style={cardStyle} data-testid="review-card">
        <div style={wordStyle}>{current.word}</div>
        {current.ipa ? (
          <div style={ipaStyle} aria-label={`IPA ${current.ipa}`}>{current.ipa}</div>
        ) : null}

        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            style={revealBtnStyle}
            data-testid="reveal-btn"
          >
            Bấm để xem nghĩa · Tap to reveal
          </button>
        ) : (
          <>
            <p style={defViStyle} data-testid="definition-vi">
              {current.definition_vi || "(chưa có nghĩa)"}
            </p>
            {current.definition_en ? (
              <p style={defEnStyle}>{current.definition_en}</p>
            ) : null}
            {current.example_sentence ? (
              <p style={exampleStyle}>“{current.example_sentence}”</p>
            ) : null}

            <div style={ratingsRowStyle}>
              <RatingButton
                tone="red"
                vi="Lại"
                en="Again"
                disabled={rating}
                onClick={() => onRate(0)}
                testId="rate-again"
              />
              <RatingButton
                tone="orange"
                vi="Khó"
                en="Hard"
                disabled={rating}
                onClick={() => onRate(3)}
                testId="rate-hard"
              />
              <RatingButton
                tone="green"
                vi="Tốt"
                en="Good"
                disabled={rating}
                onClick={() => onRate(4)}
                testId="rate-good"
              />
              <RatingButton
                tone="blue"
                vi="Dễ"
                en="Easy"
                disabled={rating}
                onClick={() => onRate(5)}
                testId="rate-easy"
              />
            </div>
          </>
        )}
      </section>

      {error ? (
        <div style={errorBannerStyle} role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}

// ── Subcomponents ───────────────────────────────────────────────────────

function Header() {
  return (
    <header style={headerStyle}>
      <Link to="/vocabulary" style={backLinkStyle}>
        ← /vocabulary
      </Link>
      <div style={{ textAlign: "right" }}>
        <div style={titleViStyle}>Ôn từ vựng</div>
        <div style={titleEnStyle}>Vocabulary review</div>
      </div>
    </header>
  );
}

function ProgressBar({ position, total }: { position: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, (position / total) * 100);
  return (
    <div style={{ marginTop: 8 }} aria-label={`Đã ôn ${position}/${total}`}>
      <div style={progressTrackStyle}>
        <div style={{ ...progressFillStyle, width: `${pct}%` }} />
      </div>
      <div style={progressLabelStyle}>
        Đã ôn {position}/{total} · reviewed
      </div>
    </div>
  );
}

function RatingButton({
  tone,
  vi,
  en,
  disabled,
  onClick,
  testId,
}: {
  tone: "red" | "orange" | "green" | "blue";
  vi: string;
  en: string;
  disabled: boolean;
  onClick: () => void;
  testId: string;
}) {
  const palette = TONE_PALETTE[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        minWidth: 70,
        padding: "10px 8px",
        borderRadius: 12,
        border: `1px solid ${palette.border}`,
        background: palette.bg,
        color: palette.text,
        fontWeight: 800,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
      data-testid={testId}
    >
      <div style={{ fontSize: 13 }}>{vi}</div>
      <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 700 }}>{en}</div>
    </button>
  );
}

function NextReviewLine({
  iso,
  nowMs,
}: {
  iso: string | null;
  nowMs?: number;
}) {
  if (!iso) {
    return (
      <p style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", marginTop: 8 }}>
        Bạn chưa có từ nào sắp tới · No upcoming reviews yet.
      </p>
    );
  }
  const now = nowMs ?? Date.now();
  const dueMs = new Date(iso).getTime();
  const diffHours = Math.max(0, Math.round((dueMs - now) / (60 * 60 * 1000)));
  if (diffHours < 24) {
    return (
      <p style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", marginTop: 8 }}>
        Lần ôn tiếp theo sau ~{diffHours} giờ ·
        <span style={{ marginLeft: 4 }}>next review in ~{diffHours} h</span>
      </p>
    );
  }
  const diffDays = Math.round(diffHours / 24);
  return (
    <p style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", marginTop: 8 }}>
      Lần ôn tiếp theo sau ~{diffDays} ngày ·
      <span style={{ marginLeft: 4 }}>next review in ~{diffDays} d</span>
    </p>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────

const TONE_PALETTE = {
  red: {
    bg: "#fef2f2",
    border: "rgba(239,68,68,0.40)",
    text: "rgba(153,27,27,0.95)",
  },
  orange: {
    bg: "#fff7ed",
    border: "rgba(234,88,12,0.40)",
    text: "rgba(124,45,18,0.95)",
  },
  green: {
    bg: "#f0fdf4",
    border: "rgba(34,197,94,0.40)",
    text: "rgba(20,83,45,0.95)",
  },
  blue: {
    bg: "#eff6ff",
    border: "rgba(59,130,246,0.40)",
    text: "rgba(30,58,138,0.95)",
  },
} as const;

const pageStyle: React.CSSProperties = {
  maxWidth: 640,
  margin: "0 auto",
  padding: "16px 14px 80px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};

const backLinkStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(67,56,202,0.85)",
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 9999,
  background: "rgba(99,102,241,0.06)",
  border: "1px solid rgba(99,102,241,0.20)",
};

const titleViStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "rgba(15,23,42,0.92)",
};

const titleEnStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.55)",
  marginTop: 2,
};

const cardStyle: React.CSSProperties = {
  marginTop: 6,
  padding: "20px 16px 16px",
  borderRadius: 16,
  background: "white",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
  textAlign: "center",
};

const wordStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 900,
  color: "rgba(15,23,42,0.92)",
  letterSpacing: -0.5,
};

const ipaStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 16,
  color: "rgba(67,56,202,0.85)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const revealBtnStyle: React.CSSProperties = {
  marginTop: 16,
  padding: "10px 18px",
  borderRadius: 9999,
  background: "linear-gradient(150deg, #6366F1 0%, #4F46E5 100%)",
  color: "white",
  border: "none",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(79,70,229,0.25)",
};

const defViStyle: React.CSSProperties = {
  marginTop: 16,
  fontSize: 16,
  color: "rgba(15,23,42,0.92)",
  lineHeight: 1.5,
};

const defEnStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  color: "rgba(0,0,0,0.55)",
};

const exampleStyle: React.CSSProperties = {
  marginTop: 10,
  fontSize: 13,
  fontStyle: "italic",
  color: "rgba(0,0,0,0.65)",
};

const ratingsRowStyle: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
};

const progressTrackStyle: React.CSSProperties = {
  height: 4,
  background: "rgba(0,0,0,0.08)",
  borderRadius: 9999,
  overflow: "hidden",
};

const progressFillStyle: React.CSSProperties = {
  height: 4,
  background: "linear-gradient(90deg, #818CF8 0%, #6366F1 100%)",
  borderRadius: 9999,
  transition: "width 200ms",
};

const progressLabelStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(0,0,0,0.55)",
};

const doneCardStyle: React.CSSProperties = {
  marginTop: 24,
  padding: 24,
  borderRadius: 16,
  background:
    "linear-gradient(150deg, rgba(238,242,255,0.96) 0%, rgba(252,252,255,0.96) 100%)",
  border: "1px solid rgba(99,102,241,0.20)",
  textAlign: "center",
};

const doneTitleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  color: "rgba(15,23,42,0.92)",
  marginTop: 8,
};

const doneSubtitleStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 14,
  color: "rgba(0,0,0,0.7)",
};

const doneEnStyle: React.CSSProperties = {
  marginTop: 2,
  fontSize: 12,
  color: "rgba(0,0,0,0.5)",
};

const emptyStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(0,0,0,0.7)",
  marginTop: 24,
  textAlign: "center",
  lineHeight: 1.6,
};

const emptyEnStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(0,0,0,0.5)",
};

const primaryBtnStyle: React.CSSProperties = {
  alignSelf: "center",
  marginTop: 16,
  padding: "10px 18px",
  borderRadius: 9999,
  background: "linear-gradient(150deg, #6366F1 0%, #4F46E5 100%)",
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 13,
};

const secondaryBtnStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 16px",
  borderRadius: 9999,
  background: "transparent",
  color: "rgba(67,56,202,0.85)",
  border: "1px solid rgba(99,102,241,0.30)",
  fontSize: 12,
  fontWeight: 700,
  textDecoration: "none",
};

const errorBannerStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "8px 12px",
  borderRadius: 8,
  background: "#fef2f2",
  color: "#991b1b",
  fontSize: 13,
};
