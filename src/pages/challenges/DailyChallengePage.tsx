// src/pages/challenges/DailyChallengePage.tsx
// Route: /challenge
//
// Single-screen daily pronunciation challenge.
//
// Lifecycle:
//   1. On mount, ask the server for "today's challenge" via the
//      pick_todays_challenge RPC (falls back to the local picker on
//      RPC error so the page still renders during database drift).
//   2. Look up whether the user already has a completion for today.
//      If yes, show the completed state with the score and an
//      offer to retake. If no, show the recorder.
//   3. After SpeechDrill emits a score, surface a "Hoàn thành" CTA
//      that upserts the row (one per local day per user).
//
// Anonymous users: show the challenge content and a sign-in prompt
// instead of the recorder. We don't gate /challenge at the router so
// search engines and curious anon visitors can still see the prompt.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, History as HistoryIcon, Mic } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { SpeechDrill, type SpeechAttemptEvent } from "@/components/speech/SpeechDrill";
import {
  fetchTodaysChallenge,
  fetchTodaysCompletion,
  recordChallengeCompletion,
  type CompletionRow,
} from "@/lib/challenges/dailyChallenge";
import {
  pickTodaysChallenge,
} from "@/lib/challenges/dailyChallenge";
import type { DailyChallenge } from "@/data/pronunciation-challenges";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function DailyChallengePage() {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState<CompletionRow | null>(null);
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      if (!userId) {
        if (!cancelled) {
          setChallenge(pickTodaysChallenge(null));
          setLoading(false);
        }
        return;
      }
      const [c, existing] = await Promise.all([
        fetchTodaysChallenge(supabase, userId),
        fetchTodaysCompletion(supabase, userId),
      ]);
      if (!cancelled) {
        // If they already completed today, show THE challenge they
        // completed (server picker should also return that one).
        if (existing) {
          setCompletion(existing);
          // Best-effort: pick the local copy of that exact row.
          // fetchTodaysChallenge already returns it via the RPC, so
          // we trust whichever is non-null and matches.
          setChallenge(
            c && c.id === existing.challenge_id
              ? c
              : pickTodaysChallenge(userId) ?? c,
          );
        } else {
          setChallenge(c);
        }
        setLoading(false);
      }
    };
    if (!authLoading) void run();
    return () => {
      cancelled = true;
    };
  }, [authLoading, userId]);

  const handleAttempt = useCallback((event: SpeechAttemptEvent) => {
    setPendingScore(Math.round(event.score.overallScore));
    setSaveState("idle");
    setSaveError(null);
  }, []);

  const handleComplete = useCallback(async () => {
    if (!userId || !challenge || pendingScore == null) return;
    setSaveState("saving");
    setSaveError(null);
    const result = await recordChallengeCompletion(supabase, {
      userId,
      challengeId: challenge.id,
      score: pendingScore,
    });
    if (result.ok) {
      setSaveState("saved");
      setCompletion({
        challenge_id: challenge.id,
        completed_at: new Date().toISOString(),
        completed_local_date: new Date().toISOString().slice(0, 10),
        score: pendingScore,
        audio_url: null,
      });
    } else {
      setSaveState("error");
      setSaveError(result.error);
    }
  }, [userId, challenge, pendingScore]);

  const heroTitle = useMemo(
    () =>
      completion
        ? "Hoàn thành thử thách hôm nay"
        : "Thử thách hôm nay",
    [completion],
  );

  if (loading || authLoading) {
    return (
      <Shell>
        <p style={{ color: "rgba(0,0,0,0.55)" }}>
          Đang tải… · Loading today&apos;s challenge.
        </p>
      </Shell>
    );
  }

  if (!challenge) {
    return (
      <Shell>
        <p style={{ color: "rgba(0,0,0,0.55)" }}>
          Không có thử thách hôm nay. Quay lại sau.
        </p>
      </Shell>
    );
  }

  return (
    <Shell title={heroTitle}>
      <ChallengeCard
        challenge={challenge}
        completion={completion}
        canRecord={Boolean(userId)}
        pendingScore={pendingScore}
        saveState={saveState}
        saveError={saveError}
        onAttempt={handleAttempt}
        onComplete={handleComplete}
      />
      <div style={{ marginTop: 22, textAlign: "center" }}>
        <Link
          to="/challenge/history"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 9999,
            border: "1px solid rgba(0,0,0,0.10)",
            background: "white",
            color: "rgba(0,0,0,0.74)",
            fontSize: 13,
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          <HistoryIcon size={14} aria-hidden /> Lịch sử · History
        </Link>
      </div>
    </Shell>
  );
}

function Shell({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px" }}>
      <header style={{ marginBottom: 18 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: "rgba(180,83,9,0.92)",
          }}
        >
          Daily challenge
        </p>
        <h1
          style={{
            margin: "4px 0 0",
            fontSize: 28,
            fontWeight: 950,
            letterSpacing: -0.4,
            color: "rgba(15,23,42,0.96)",
          }}
        >
          {title ?? "Thử thách hôm nay"}
        </h1>
      </header>
      {children}
    </div>
  );
}

function ChallengeCard({
  challenge,
  completion,
  canRecord,
  pendingScore,
  saveState,
  saveError,
  onAttempt,
  onComplete,
}: {
  challenge: DailyChallenge;
  completion: CompletionRow | null;
  canRecord: boolean;
  pendingScore: number | null;
  saveState: SaveState;
  saveError: string | null;
  onAttempt: (event: SpeechAttemptEvent) => void;
  onComplete: () => void;
}) {
  const completedScore = completion?.score ?? null;
  const showRecorder = canRecord && completion == null;
  const showRetake = canRecord && completion != null;
  const [retaking, setRetaking] = useState(false);

  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px solid rgba(234,88,12,0.20)",
        background:
          "linear-gradient(150deg, #FFE9C7 0%, #FED7AA 28%, #FDBA74 62%, #FB923C 100%)",
        padding: 22,
        boxShadow: "0 18px 38px rgba(234,88,12,0.18)",
        color: "rgba(67,20,7,0.96)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 10px",
          borderRadius: 9999,
          background: "rgba(255,255,255,0.55)",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        <span aria-hidden>🎤</span>
        <span>
          {challenge.type === "tongue_twister"
            ? "Tongue twister · Tăng tốc lưỡi"
            : challenge.type === "minimal_pair"
              ? "Minimal pair · Cặp âm dễ nhầm"
              : "Phoneme drill · Luyện một âm"}{" "}
          · {challenge.difficulty}
        </span>
      </div>

      <p
        style={{
          marginTop: 14,
          marginBottom: 0,
          fontSize: 22,
          fontWeight: 900,
          lineHeight: 1.35,
          letterSpacing: -0.2,
        }}
      >
        {challenge.content_en}
      </p>

      <p
        style={{
          marginTop: 10,
          marginBottom: 0,
          fontSize: 14,
          fontWeight: 700,
          opacity: 0.85,
          lineHeight: 1.5,
        }}
      >
        {challenge.content_vi_explanation}
      </p>

      {challenge.target_phonemes.length > 0 ? (
        <div style={{ marginTop: 10, fontSize: 12, fontWeight: 800, opacity: 0.7 }}>
          Phonemes:{" "}
          {challenge.target_phonemes.map((p) => `/${p}/`).join(" · ")}
        </div>
      ) : null}

      {completedScore != null && !retaking ? (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,255,255,0.65)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "rgba(6,78,59,0.96)",
            fontWeight: 800,
          }}
          data-testid="challenge-completed-banner"
        >
          <CheckCircle2 size={18} aria-hidden />
          <span>
            🔥 Hôm nay bạn đã làm rồi — {completedScore}/100 ·{" "}
            Studied today, score {completedScore}/100.
          </span>
        </div>
      ) : null}

      <div style={{ marginTop: 18 }}>
        {showRecorder ? (
          <SpeechDrill
            targetSentence={challenge.content_en}
            onAttempt={onAttempt}
          />
        ) : null}
        {showRetake && retaking ? (
          <SpeechDrill
            targetSentence={challenge.content_en}
            onAttempt={onAttempt}
          />
        ) : null}
        {showRetake && !retaking ? (
          <button
            type="button"
            onClick={() => setRetaking(true)}
            style={retakeButtonStyle}
          >
            Luyện lại · Practice again
          </button>
        ) : null}
        {!canRecord ? (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,255,255,0.65)",
              color: "rgba(67,20,7,0.92)",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <span aria-hidden style={{ marginRight: 6 }}>
              <Mic size={14} />
            </span>
            Đăng nhập để ghi âm và lưu điểm · Sign in to record and save your
            score.
            <div style={{ marginTop: 8 }}>
              <Link
                to="/signin"
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: 9999,
                  background: "rgba(67,20,7,0.92)",
                  color: "#FFF7ED",
                  fontSize: 12,
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                Sign in →
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {pendingScore != null && (showRecorder || retaking) ? (
        <div style={{ marginTop: 16 }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 800,
              color: "rgba(67,20,7,0.92)",
            }}
          >
            Điểm vừa rồi · Last attempt: <strong>{pendingScore}/100</strong>
          </p>
          <button
            type="button"
            onClick={onComplete}
            disabled={saveState === "saving"}
            style={ctaButtonStyle(saveState)}
            data-testid="challenge-complete-button"
          >
            {saveState === "saved"
              ? "✓ Đã lưu · Saved"
              : saveState === "saving"
                ? "Đang lưu… · Saving"
                : "Hoàn thành · Complete"}
          </button>
          {saveError ? (
            <p style={{ marginTop: 6, fontSize: 12, color: "#7F1D1D" }}>
              Lỗi · Error: {saveError}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

const retakeButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 9999,
  border: "1px solid rgba(67,20,7,0.92)",
  background: "rgba(255,255,255,0.85)",
  color: "rgba(67,20,7,0.92)",
  fontWeight: 800,
  fontSize: 13,
  cursor: "pointer",
};

function ctaButtonStyle(state: SaveState): React.CSSProperties {
  const saved = state === "saved";
  return {
    marginTop: 10,
    padding: "10px 18px",
    borderRadius: 9999,
    border: "none",
    background: saved ? "rgba(16,185,129,0.92)" : "rgba(67,20,7,0.92)",
    color: "#FFF7ED",
    fontWeight: 900,
    fontSize: 14,
    cursor: state === "saving" ? "wait" : "pointer",
  };
}
