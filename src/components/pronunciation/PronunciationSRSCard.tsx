// src/components/pronunciation/PronunciationSRSCard.tsx
//
// Single-card pronunciation drill UI for the SRS scheduler. Shows the
// target phrase, records one attempt, calls A2's scorePronunciation,
// renders the score + weak phonemes (or a retry message on failure),
// and lets the learner retry or continue to the next card.
//
// UI only — the only "backend" touchpoint is scorePronunciation itself
// (provided by A2). No direct supabase / fetch calls live in this file.

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  scorePronunciation,
  VIETNAMESE_L1_PHONEME_TARGETS,
  type PronunciationResult,
} from "@/lib/pronunciation/scoringEngine";

export interface PronunciationSRSCardProps {
  /** Target phrase the learner should read aloud. Required. */
  referenceText: string;
  /** Optional phoneme targets to surface even if the cloud doesn't
   *  flag them — passed straight through to scorePronunciation. */
  expectedPhonemes?: readonly string[];
  /** Called when the learner taps "Tiếp tục" after a successful score.
   *  Parent owns SRS scheduling — this card is presentational. */
  onContinue?: (result: PronunciationResult) => void;
}

type CardPhase =
  | { kind: "idle" }
  | { kind: "recording" }
  | { kind: "scoring" }
  | { kind: "result"; result: PronunciationResult }
  | { kind: "permission-denied" };

const PHONEME_LABEL_BY_SYMBOL: ReadonlyMap<string, string> = new Map(
  VIETNAMESE_L1_PHONEME_TARGETS.map((t) => [t.phoneme, t.label]),
);

function phonemeLabel(symbol: string): string {
  return PHONEME_LABEL_BY_SYMBOL.get(symbol) ?? symbol;
}

function scoreTone(score: number | null): {
  bg: string;
  border: string;
  text: string;
} {
  if (score == null) return { bg: "#f8fafc", border: "#e2e8f0", text: "#475569" };
  if (score >= 85) return { bg: "#ecfdf5", border: "#a7f3d0", text: "#047857" };
  if (score >= 70) return { bg: "#f0f9ff", border: "#bae6fd", text: "#0c4a6e" };
  if (score >= 50) return { bg: "#fffbeb", border: "#fde68a", text: "#92400e" };
  return { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" };
}

export function PronunciationSRSCard({
  referenceText,
  expectedPhonemes,
  onContinue,
}: PronunciationSRSCardProps): React.ReactElement {
  const [phase, setPhase] = useState<CardPhase>({ kind: "idle" });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
  }, []);

  // Make sure we never leak the mic if the parent unmounts mid-record.
  useEffect(() => stopTracks, [stopTracks]);

  const handleScore = useCallback(
    async (blob: Blob) => {
      setPhase({ kind: "scoring" });
      try {
        const result = await scorePronunciation(
          blob,
          referenceText,
          expectedPhonemes,
        );
        setPhase({ kind: "result", result });
      } catch (err) {
        // scorePronunciation already swallows cloud errors and returns
        // a "scoring-failed" result, but we still treat any thrown
        // exception as a failed attempt rather than crashing the card.
        if (import.meta.env.DEV) {
          console.warn("[PronunciationSRSCard] scorePronunciation threw", err);
        }
        setPhase({
          kind: "result",
          result: {
            status: "scoring-failed",
            overallScore: null,
            phonemeScores: [],
            weakPhonemes: [],
            transcription: "",
            referenceText,
          },
        });
      }
    },
    [referenceText, expectedPhonemes],
  );

  const startRecording = useCallback(async () => {
    // Guard against double-submit / overlapping taps while a previous
    // attempt is still being scored.
    if (phase.kind === "scoring" || phase.kind === "recording") return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      setPhase({ kind: "permission-denied" });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        chunksRef.current = [];
        stopTracks();
        void handleScore(blob);
      };
      recorderRef.current = recorder;
      recorder.start();
      setPhase({ kind: "recording" });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[PronunciationSRSCard] mic permission failed", err);
      }
      stopTracks();
      setPhase({ kind: "permission-denied" });
    }
  }, [handleScore, stopTracks, phase.kind]);

  const stopRecording = useCallback(() => {
    // Once we've handed off to the scorer, ignore further taps so a
    // double-stop can't race the onstop → handleScore transition.
    if (phase.kind !== "recording") return;
    const r = recorderRef.current;
    recorderRef.current = null;
    if (r && r.state !== "inactive") {
      r.stop();
    } else {
      stopTracks();
      setPhase({ kind: "idle" });
    }
  }, [stopTracks, phase.kind]);

  const reset = useCallback(() => {
    // Don't allow a "Try again" tap to interrupt an in-flight score.
    if (phase.kind === "scoring") return;
    stopTracks();
    setPhase({ kind: "idle" });
  }, [stopTracks, phase.kind]);

  return (
    <article
      data-testid="pronunciation-srs-card"
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: 18,
        borderRadius: 18,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        color: "#0f172a",
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
          Đọc theo · Read aloud
        </p>
        <p
          data-testid="pronunciation-srs-target"
          style={{
            margin: "6px 0 0",
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.4,
            color: "#0f172a",
          }}
        >
          {referenceText}
        </p>
      </div>

      <PhaseBody
        phase={phase}
        onStart={startRecording}
        onStop={stopRecording}
        onRetry={reset}
        onContinue={() => {
          if (phase.kind === "result" && onContinue) onContinue(phase.result);
        }}
      />
    </article>
  );
}

function PhaseBody({
  phase,
  onStart,
  onStop,
  onRetry,
  onContinue,
}: {
  phase: CardPhase;
  onStart: () => void;
  onStop: () => void;
  onRetry: () => void;
  onContinue: () => void;
}): React.ReactElement {
  if (phase.kind === "idle") {
    return (
      <PrimaryButton
        testId="pronunciation-srs-start"
        onClick={onStart}
        label="Bắt đầu ghi âm"
        sublabel="Start recording"
      />
    );
  }

  if (phase.kind === "recording") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p
          aria-live="polite"
          style={{
            margin: 0,
            fontSize: 13,
            color: "#0c4a6e",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: "#dc2626",
            }}
          />
          Đang ghi âm… · Recording…
        </p>
        <PrimaryButton
          testId="pronunciation-srs-stop"
          onClick={onStop}
          label="Dừng ghi âm"
          sublabel="Stop recording"
          variant="dark"
        />
      </div>
    );
  }

  if (phase.kind === "scoring") {
    return (
      <div
        data-testid="pronunciation-srs-scoring"
        aria-live="polite"
        aria-busy="true"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 0",
        }}
      >
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 14,
            height: 14,
            borderRadius: 9999,
            border: "2px solid #cbd5e1",
            borderTopColor: "#0f172a",
            animation: "mb-srs-spin 0.8s linear infinite",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#0f172a",
            lineHeight: 1.4,
          }}
        >
          Đang chấm điểm... / Scoring your pronunciation...
        </p>
        <style>{`@keyframes mb-srs-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (phase.kind === "permission-denied") {
    return (
      <div
        data-testid="pronunciation-srs-permission-denied"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#991b1b",
            lineHeight: 1.5,
          }}
        >
          Trình duyệt chưa cho phép micro. Hãy bật quyền micro trong cài đặt
          rồi thử lại.
          <br />
          <span style={{ color: "#475569", fontSize: 13 }}>
            Microphone permission was denied. Allow it in your browser
            settings, then try again.
          </span>
        </p>
        <PrimaryButton
          testId="pronunciation-srs-retry"
          onClick={onRetry}
          label="Thử lại"
          sublabel="Try again"
        />
      </div>
    );
  }

  // phase.kind === "result"
  const { result } = phase;
  if (result.status === "scoring-failed") {
    return (
      <div
        data-testid="pronunciation-srs-result-failed"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#92400e",
            lineHeight: 1.5,
          }}
        >
          Không chấm điểm được. Mạng có thể đang chậm — hãy thử lại.
          <br />
          <span style={{ color: "#475569", fontSize: 13 }}>
            Couldn't score this attempt. Please try again.
          </span>
        </p>
        <PrimaryButton
          testId="pronunciation-srs-retry"
          onClick={onRetry}
          label="Thử lại"
          sublabel="Try again"
        />
      </div>
    );
  }

  // result.status === "ok"
  const tone = scoreTone(result.overallScore);
  return (
    <div
      data-testid="pronunciation-srs-result-ok"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div
        style={{
          padding: 14,
          borderRadius: 14,
          border: `1px solid ${tone.border}`,
          background: tone.bg,
          display: "flex",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span
          data-testid="pronunciation-srs-score"
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: tone.text,
            lineHeight: 1,
          }}
        >
          {result.overallScore ?? "—"}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: tone.text,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Điểm phát âm · Pronunciation score
        </span>
      </div>

      {result.weakPhonemes.length > 0 ? (
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
            data-testid="pronunciation-srs-weak"
            style={{
              marginTop: 6,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {result.weakPhonemes.map((p) => (
              <span
                key={p}
                style={{
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 9999,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#0f172a",
                }}
                title={phonemeLabel(p)}
              >
                /{p}/{" "}
                <span style={{ color: "#64748b" }}>{phonemeLabel(p)}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <PrimaryButton
          testId="pronunciation-srs-retry"
          onClick={onRetry}
          label="Thử lại"
          sublabel="Try again"
          variant="ghost"
        />
        <PrimaryButton
          testId="pronunciation-srs-continue"
          onClick={onContinue}
          label="Tiếp tục"
          sublabel="Continue"
        />
      </div>
    </div>
  );
}

function PrimaryButton({
  testId,
  onClick,
  label,
  sublabel,
  variant = "default",
}: {
  testId: string;
  onClick: () => void;
  label: string;
  sublabel: string;
  variant?: "default" | "dark" | "ghost";
}): React.ReactElement {
  const styles =
    variant === "dark"
      ? { bg: "#0f172a", color: "#ffffff", border: "1px solid #0f172a" }
      : variant === "ghost"
        ? { bg: "#ffffff", color: "#0f172a", border: "1px solid #e2e8f0" }
        : { bg: "#0f172a", color: "#ffffff", border: "1px solid #0f172a" };

  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      style={{
        background: styles.bg,
        color: styles.color,
        border: styles.border,
        borderRadius: 9999,
        padding: "10px 18px",
        minHeight: 40,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        lineHeight: 1.2,
      }}
    >
      <span>{label}</span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          opacity: 0.75,
          marginTop: 1,
        }}
      >
        {sublabel}
      </span>
    </button>
  );
}

export default PronunciationSRSCard;
