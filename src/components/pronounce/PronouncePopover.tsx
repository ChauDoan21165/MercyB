import React, { useEffect, useMemo, useRef, useState } from "react";

type PronounceResult = {
  score: number; // 0..100
  good?: string;
  fix?: string;
  stress_hint?: string;
};

type Props = {
  word: string;
  /** VIP gate: pass true only for VIP3+ */
  enabled: boolean;
  /** Called with recorded audio. You implement the backend later. */
  onAnalyze: (args: { word: string; audioBlob: Blob }) => Promise<PronounceResult>;
  /** Optional: play reference audio you already have (no TTS) */
  onPlayReference?: (word: string) => void;

  /** UI */
  maxSeconds?: number; // default 5
  className?: string;

  /** Optional: if parent wants to know when it opens/closes */
  onOpenChange?: (open: boolean) => void;
};

type Phase = "idle" | "recording" | "analyzing" | "result" | "error";

function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const mm = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/**
 * PronouncePopover (ADD-ONLY)
 * - anchored mini card
 * - max 5s recording
 * - single component, no global state
 * - ESC / click-outside closes
 */
export default function PronouncePopover({
  word,
  enabled,
  onAnalyze,
  onPlayReference,
  maxSeconds = 5,
  className,
  onOpenChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errMsg, setErrMsg] = useState<string>("");
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<PronounceResult | null>(null);

  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const tickRef = useRef<number | null>(null);
  const stopTimerRef = useRef<number | null>(null);

  const canUseMic = useMemo(() => {
    if (!enabled) return false;
    // Safari/iOS etc may require https + user gesture; we keep it simple here
    return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
  }, [enabled]);

  const close = () => {
    setOpen(false);
    setPhase("idle");
    setErrMsg("");
    setElapsed(0);
    setResult(null);
    cleanupRecording();
    onOpenChange?.(false);
  };

  const openPopover = () => {
    if (!enabled) return;
    setOpen(true);
    setPhase("idle");
    setErrMsg("");
    setElapsed(0);
    setResult(null);
    onOpenChange?.(true);
  };

  // click outside / esc
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (popRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      close();
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDocDown);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDocDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function cleanupRecording() {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    try {
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        mediaRef.current.stop();
      }
    } catch {
      // ignore
    }
    mediaRef.current = null;
    chunksRef.current = [];
  }

  async function startRecording() {
    if (!canUseMic) {
      setPhase("error");
      setErrMsg("Microphone not available in this browser.");
      return;
    }

    setErrMsg("");
    setResult(null);
    setElapsed(0);
    setPhase("recording");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRef.current = rec;
      chunksRef.current = [];

      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      rec.onstop = async () => {
        // stop tracks
        stream.getTracks().forEach((t) => t.stop());

        // if user closed early or never recorded
        if (chunksRef.current.length === 0) return;

        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        chunksRef.current = [];

        setPhase("analyzing");
        try {
          const r = await onAnalyze({ word, audioBlob: blob });
          setResult(r);
          setPhase("result");
        } catch (e: any) {
          setPhase("error");
          setErrMsg(e?.message || "Analyze failed.");
        }
      };

      rec.start();

      const startedAt = Date.now();
      tickRef.current = window.setInterval(() => {
        const s = (Date.now() - startedAt) / 1000;
        setElapsed(s);
      }, 150);

      stopTimerRef.current = window.setTimeout(() => {
        stopRecording();
      }, maxSeconds * 1000);
    } catch (e: any) {
      setPhase("error");
      setErrMsg(e?.message || "Mic permission denied.");
    }
  }

  function stopRecording() {
    if (phase !== "recording") return;
    try {
      mediaRef.current?.stop();
    } catch {
      // ignore
    }
    // interval/timers cleaned in onstop + cleanupRecording guard
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }

  function tryAgain() {
    setErrMsg("");
    setResult(null);
    setElapsed(0);
    setPhase("idle");
  }

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <span ref={anchorRef} className={className} style={{ position: "relative", display: "inline-flex" }}>
      {/* The tiny mic trigger */}
      <button
        type="button"
        onClick={() => (open ? close() : openPopover())}
        disabled={!enabled}
        title={enabled ? "Pronunciation (VIP3)" : "VIP3 feature"}
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.18)",
          background: enabled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.60)",
          fontSize: 12,
          fontWeight: 900,
          lineHeight: "22px",
          textAlign: "center",
          opacity: enabled ? 1 : 0.55,
          cursor: enabled ? "pointer" : "not-allowed",
          userSelect: "none",
        }}
      >
        🎤
      </button>

      {/* Popover card */}
      {open && (
        <div
          ref={popRef}
          role="dialog"
          aria-label={`Pronounce ${word}`}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 80,
            width: 280,
            maxWidth: "min(90vw, 320px)",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.96)",
            boxShadow: "0 14px 40px rgba(0,0,0,0.12)",
            padding: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontWeight: 900, fontSize: 13 }}>
              Pronounce: <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{word}</span>
            </div>
            <button
              type="button"
              onClick={close}
              style={{
                width: 28,
                height: 28,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "rgba(255,255,255,0.92)",
                fontWeight: 900,
              }}
              title="Close"
            >
              ✕
            </button>
          </div>

          <div style={{ marginTop: 10 }}>
            {!canUseMic && enabled ? (
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                Mic not available (needs HTTPS + browser support).
              </div>
            ) : null}

            {phase === "idle" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={!canUseMic}
                  style={{
                    borderRadius: 14,
                    padding: "10px 12px",
                    border: "1px solid rgba(0,0,0,0.14)",
                    background: "rgba(255,255,255,0.98)",
                    fontWeight: 900,
                    cursor: canUseMic ? "pointer" : "not-allowed",
                  }}
                >
                  ● Tap to record (max {maxSeconds}s)
                </button>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {onPlayReference && (
                    <button
                      type="button"
                      onClick={() => onPlayReference(word)}
                      style={{
                        flex: "0 0 auto",
                        borderRadius: 999,
                        padding: "8px 10px",
                        border: "1px solid rgba(0,0,0,0.14)",
                        background: "rgba(255,255,255,0.92)",
                        fontWeight: 900,
                        fontSize: 12,
                      }}
                    >
                      ▶︎ Reference
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={close}
                    style={{
                      flex: "0 0 auto",
                      borderRadius: 999,
                      padding: "8px 10px",
                      border: "1px solid rgba(0,0,0,0.14)",
                      background: "rgba(255,255,255,0.92)",
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {phase === "recording" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 900 }}>
                  ● Recording… {formatTime(elapsed)} / {formatTime(maxSeconds)}
                </div>

                <button
                  type="button"
                  onClick={stopRecording}
                  style={{
                    borderRadius: 14,
                    padding: "10px 12px",
                    border: "1px solid rgba(0,0,0,0.14)",
                    background: "rgba(255,255,255,0.98)",
                    fontWeight: 900,
                  }}
                >
                  Stop
                </button>
              </div>
            )}

            {phase === "analyzing" && (
              <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.8, padding: "10px 2px" }}>
                Analyzing pronunciation…
              </div>
            )}

            {phase === "result" && result && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 900 }}>
                  Pronunciation: {Math.round(result.score)}%
                </div>

                <div style={{ fontSize: 12, lineHeight: 1.35 }}>
                  {result.good ? <div>✓ {result.good}</div> : null}
                  {result.fix ? <div>✗ {result.fix}</div> : null}
                  {result.stress_hint ? <div style={{ marginTop: 6, opacity: 0.85 }}>{result.stress_hint}</div> : null}
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {onPlayReference && (
                    <button
                      type="button"
                      onClick={() => onPlayReference(word)}
                      style={{
                        borderRadius: 999,
                        padding: "8px 10px",
                        border: "1px solid rgba(0,0,0,0.14)",
                        background: "rgba(255,255,255,0.92)",
                        fontWeight: 900,
                        fontSize: 12,
                      }}
                    >
                      ▶︎ Reference
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={tryAgain}
                    style={{
                      borderRadius: 999,
                      padding: "8px 10px",
                      border: "1px solid rgba(0,0,0,0.14)",
                      background: "rgba(255,255,255,0.92)",
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {phase === "error" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(160,0,0,0.9)" }}>
                  Error
                </div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{errMsg || "Something went wrong."}</div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={tryAgain}
                    style={{
                      borderRadius: 999,
                      padding: "8px 10px",
                      border: "1px solid rgba(0,0,0,0.14)",
                      background: "rgba(255,255,255,0.92)",
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    style={{
                      borderRadius: 999,
                      padding: "8px 10px",
                      border: "1px solid rgba(0,0,0,0.14)",
                      background: "rgba(255,255,255,0.92)",
                      fontWeight: 900,
                      fontSize: 12,
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
