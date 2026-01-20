// src/components/audio/TalkingFacePlayButton.tsx
// MB-BLUE-99.3 → MB-BLUE-99.3-host-repeat-target — 2026-01-18 (+0700)
/**
 * TalkingFacePlayButton (AUTHORITATIVE UI MOTIF)
 * - Small round face with eyes + cheeks
 * - Eyes blink (subtle)
 * - Mouth "talks" (opens/closes) while playing, closes when paused
 * - Seekable MP3 progress bar + time display
 *
 * LOCKED:
 * - No global audio state assumptions here
 * - Safe standalone Audio() per instance (current architecture)
 *
 * NEW (Mercy Host repeat loop, NO AI):
 * - On actual audio "play" event, dispatch `mb:host-repeat-target`
 * - On actual audio "ended" event, dispatch `mb:host-repeat-target` again (phase="end")
 * - Payload: { phase, audioUrl, label, startedAt, endedAt, srcKey, hostContext? }
 * - Room/entry context is OPTIONAL and can be attached by the caller.
 *
 * OPTIONAL (Host-controlled replay):
 * - Listen for `mb:host-repeat-play` and replay if srcKey matches.
 */

import React, { useEffect, useId, useMemo, useRef, useState } from "react";

function fmtTime(n: number) {
  if (!Number.isFinite(n) || n < 0) n = 0;
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  src: string;
  label?: string;
  className?: string;
  fullWidthBar?: boolean;

  /**
   * OPTIONAL: If caller knows room/entry context, pass it through.
   * This keeps TalkingFacePlayButton standalone, but allows RoomRenderer
   * to wire room-aware repeat coaching without coupling.
   */
  hostContext?: {
    roomId?: string;
    entryId?: string;
    text_en?: string;
    text_vi?: string;
    keyword?: string;
  };
};

export default function TalkingFacePlayButton({
  src,
  label,
  className,
  fullWidthBar,
  hostContext,
}: Props) {
  const uid = useId().replace(/[:]/g, "");
  const gradId = `mbFaceGrad_${uid}`;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Used to stamp start/end times consistently for host dispatch.
  const startedAtRef = useRef<string | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  const safeSrc = String(src || "").trim();
  const shownLabel = String(label || "").trim();

  const pct = useMemo(() => {
    if (!dur || dur <= 0) return 0;
    return Math.max(0, Math.min(1, t / dur));
  }, [t, dur]);

  // Dispatch repeat-target to Mercy Host on actual play/ended
  const dispatchHostRepeatTarget = (phase: "start" | "end", audioUrl: string) => {
    try {
      if (typeof window === "undefined") return;

      const nowIso = new Date().toISOString();
      if (phase === "start") startedAtRef.current = nowIso;

      const detail = {
        phase,
        audioUrl,
        label: shownLabel || undefined,
        startedAt: startedAtRef.current ?? (phase === "start" ? nowIso : undefined),
        endedAt: phase === "end" ? nowIso : undefined,
        srcKey: audioUrl,
        hostContext: hostContext ?? undefined,
      };

      window.dispatchEvent(new CustomEvent("mb:host-repeat-target", { detail }));
    } catch {
      // Never crash because of host dispatch
    }
  };

  // OPTIONAL: Host requests replay (no coupling)
  useEffect(() => {
    function onHostRepeatPlay(e: any) {
      try {
        const d = e?.detail;
        const key = d?.srcKey ?? d?.audioUrl ?? null;
        if (!key) return;
        if (!safeSrc) return;
        if (String(key) !== safeSrc) return;

        const a = audioRef.current;
        if (!a) return;

        // If ended earlier, start again from 0
        if (!Number.isFinite(a.currentTime) || a.currentTime >= (a.duration || 0)) {
          a.currentTime = 0;
        }
        a.play().catch(() => {});
      } catch {
        // ignore
      }
    }

    if (typeof window === "undefined") return;
    window.addEventListener("mb:host-repeat-play", onHostRepeatPlay as any);
    return () => window.removeEventListener("mb:host-repeat-play", onHostRepeatPlay as any);
  }, [safeSrc]);

  useEffect(() => {
    setReady(false);
    setPlaying(false);
    setT(0);
    setDur(0);
    startedAtRef.current = null;

    const a = new Audio();
    a.preload = "metadata";
    a.src = safeSrc;

    audioRef.current = a;

    const onLoaded = () => {
      setReady(true);
      setDur(Number.isFinite(a.duration) ? a.duration : 0);
    };
    const onTime = () => setT(a.currentTime || 0);
    const onPlay = () => {
      setPlaying(true);
      // IMPORTANT: dispatch on the real play event (not on click),
      // so it reflects actual playback start.
      if (safeSrc) dispatchHostRepeatTarget("start", safeSrc);
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setT(0);
      // IMPORTANT: dispatch end signal so Host can open "Repeat after me"
      if (safeSrc) dispatchHostRepeatTarget("end", safeSrc);
    };

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);

    return () => {
      a.pause();
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [safeSrc, hostContext, shownLabel]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const seek = (nextPct: number) => {
    const a = audioRef.current;
    if (!a || !dur) return;
    a.currentTime = Math.max(0, Math.min(dur, nextPct * dur));
  };

  return (
    <div
      className={className || ""}
      data-mb-talkingface
      data-playing={playing ? "true" : "false"}
      data-fullwidth={fullWidthBar ? "true" : "false"}
    >
      <style>{`
        [data-mb-talkingface]{ width: 100%; }

        [data-mb-talkingface] .mb-row{
          display:flex;
          align-items:center;
          gap: 12px;
          width: 100%;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 18px;
          background: rgba(255,255,255,0.78);
          padding: 10px 12px;
        }

        [data-mb-talkingface] .mb-faceBtn{
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.16);
          background: rgba(255,255,255,0.92);
          display:flex;
          align-items:center;
          justify-content:center;
          flex: 0 0 auto;
        }

        [data-mb-talkingface] .mb-mid{
          flex: 1 1 auto;
          min-width: 0;
        }

        [data-mb-talkingface] .mb-label{
          font-size: 12px;
          font-weight: 800;
          opacity: 0.70;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 6px;
        }

        [data-mb-talkingface] .mb-barRow{
          display:flex;
          align-items:center;
          gap: 10px;
        }

        [data-mb-talkingface] .mb-range{
          flex: 1 1 auto;
          width: 100%;
        }

        [data-mb-talkingface] .mb-time{
          flex: 0 0 auto;
          font-size: 12px;
          font-weight: 900;
          opacity: 0.65;
          white-space: nowrap;
        }

        /* Face animation */
        [data-mb-talkingface] .mb-eye{
          transform-origin: center;
          animation: mbBlink 5.6s infinite;
        }
        [data-mb-talkingface] .mb-eye.mb-eye2{
          animation-delay: 0.08s;
        }
        @keyframes mbBlink{
          0%, 92%, 100% { transform: scaleY(1); }
          93% { transform: scaleY(0.12); }
          95% { transform: scaleY(1); }
        }

        /* Mouth talks ONLY when playing */
        [data-mb-talkingface][data-playing="true"] .mb-mouthOpen{
          transform-origin: center;
          animation: mbTalk 240ms infinite;
        }
        @keyframes mbTalk{
          0%   { transform: scaleY(0.65); }
          50%  { transform: scaleY(1.05); }
          100% { transform: scaleY(0.70); }
        }

        /* Cheeks (soft pink) */
        [data-mb-talkingface] .mb-cheek{
          fill: rgba(255, 105, 180, 0.35);
        }
      `}</style>

      <div className="mb-row">
        <button
          type="button"
          className="mb-faceBtn"
          onClick={toggle}
          title={playing ? "Pause" : "Play"}
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          {/* Face icon */}
          <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff4d6d" />
                <stop offset="35%" stopColor="#ffbe0b" />
                <stop offset="70%" stopColor="#3a86ff" />
                <stop offset="100%" stopColor="#06d6a0" />
              </linearGradient>
            </defs>

            {/* Outer halo */}
            <circle cx="32" cy="32" r="27" fill={`url(#${gradId})`} opacity="0.25" />
            <circle cx="32" cy="32" r="26" fill="white" opacity="0.92" />

            {/* cheeks */}
            <ellipse className="mb-cheek" cx="21.5" cy="36.5" rx="6.2" ry="4.2" />
            <ellipse className="mb-cheek" cx="42.5" cy="36.5" rx="6.2" ry="4.2" />

            {/* eyes */}
            <circle className="mb-eye" cx="24" cy="26" r="3" fill="black" opacity="0.72" />
            <circle className="mb-eye mb-eye2" cx="40" cy="26" r="3" fill="black" opacity="0.72" />

            {/* mouth: closed when paused; open+talking when playing */}
            {playing ? (
              <ellipse
                className="mb-mouthOpen"
                cx="32"
                cy="41"
                rx="10"
                ry="6"
                fill="black"
                opacity="0.68"
              />
            ) : (
              <rect x="22" y="40" width="20" height="3.5" rx="2" fill="black" opacity="0.55" />
            )}
          </svg>
        </button>

        <div className="mb-mid">
          {shownLabel ? <div className="mb-label">{shownLabel}</div> : null}

          <div className="mb-barRow">
            <input
              className="mb-range"
              type="range"
              min={0}
              max={1000}
              step={1}
              value={Math.round(pct * 1000)}
              onChange={(e) => seek(Number(e.target.value) / 1000)}
              aria-label="Seek audio"
              disabled={!ready || !dur}
            />
            <div className="mb-time">
              {fmtTime(t)} / {fmtTime(dur)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** teacher GPT — new thing to learn (2 lines):
 * If you want Mercy Host to “know” learning started, dispatch on the real `audio.play` event, not on click.
 * Keep context optional: players emit signals; rooms add meaning. */
