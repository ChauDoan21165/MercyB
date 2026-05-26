// src/components/audio/TalkingFacePlayButton.tsx

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useAudioUrl } from "@/hooks/useAudioUrl";

function fmtTime(n: number) {
  if (!Number.isFinite(n) || n < 0) n = 0;
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Loading-state pattern (canonical — mirror this in the 11 other audio consumers):
 *
 *   - While `loading === true` (Supabase signing in flight for adult-room audio),
 *     disable the play button but DO NOT show a spinner.
 *   - Kids/music/absolute keys have `loading === false` on first render (hook's
 *     sync seed via tryResolveLocal), so there is no loading flash.
 *   - Supabase signing typically completes in <500ms — imperceptible to users.
 *   - On Supabase failure (`error != null`), `url` still holds the local fallback,
 *     so playback continues silently degraded. Error is available for telemetry.
 *   - On playback 403 (signed URL expired after sleep-wake), <audio>'s onError
 *     calls `refresh()`, which drops the cache entry and re-signs atomically.
 */
type Props = {
  src: string;
  label?: string;
  className?: string;
  fullWidthBar?: boolean;
  hostContext?: {
    roomId?: string;
    entryId?: string;
    text_en?: string;
    text_vi?: string;
    keyword?: string;
  };
};

export default function TalkingFacePlayButton({
  src, label, className, fullWidthBar, hostContext,
}: Props) {
  const uid = useId().replace(/[:]/g, "");
  const gradId     = `mbFaceGrad_${uid}`;
  const glowId     = `mbGlow_${uid}`;
  const skinId     = `mbSkin_${uid}`;
  const hairId     = `mbHair_${uid}`;
  const clipId     = `mbClip_${uid}`;

  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const startedAtRef   = useRef<string | null>(null);

  const [ready,       setReady]       = useState(false);
  const [playing,     setPlaying]     = useState(false);
  const [t,           setT]           = useState(0);
  const [dur,         setDur]         = useState(0);
  // mouth open amount 0..1
  const [mouthOpen,   setMouthOpen]   = useState(0);
  const mouthRafRef   = useRef<number | null>(null);

  const safeSrc   = String(src || "").trim();
  const shownLabel = String(label || "").trim();

  // Phase 2: useAudioUrl handles local short-circuit (kids/music) + Supabase sign + fallback.
  const { url: resolvedSrc, loading, refresh } = useAudioUrl(safeSrc);
  const isLocked = !loading && !resolvedSrc;

  const pct = useMemo(() => {
    if (!dur || dur <= 0) return 0;
    return Math.max(0, Math.min(1, t / dur));
  }, [t, dur]);

  // Animate mouth open/close
  useEffect(() => {
    if (!playing) {
      if (mouthRafRef.current) cancelAnimationFrame(mouthRafRef.current);
      setMouthOpen(0);
      return;
    }
    let phase = 0;
    const animate = () => {
      phase += 0.18;
      const v = 0.35 + 0.65 * Math.abs(Math.sin(phase));
      setMouthOpen(v);
      mouthRafRef.current = requestAnimationFrame(animate);
    };
    mouthRafRef.current = requestAnimationFrame(animate);
    return () => { if (mouthRafRef.current) cancelAnimationFrame(mouthRafRef.current); };
  }, [playing]);

  const dispatchHostRepeatTarget = (phase: "start" | "end", audioUrl: string) => {
    try {
      if (typeof window === "undefined") return;
      const nowIso = new Date().toISOString();
      if (phase === "start") startedAtRef.current = nowIso;
      window.dispatchEvent(new CustomEvent("mb:host-repeat-target", {
        detail: { phase, audioUrl, label: shownLabel || undefined,
          startedAt: startedAtRef.current ?? (phase === "start" ? nowIso : undefined),
          endedAt: phase === "end" ? nowIso : undefined,
          srcKey: safeSrc, hostContext: hostContext ?? undefined },
      }));
    } catch {}
  };

  useEffect(() => {
    function onHostRepeatPlay(e: any) {
      try {
        const key = e?.detail?.srcKey ?? e?.detail?.audioUrl ?? null;
        if (!key || !safeSrc || String(key) !== safeSrc) return;
        const a = audioRef.current;
        if (!a) return;
        if (!Number.isFinite(a.currentTime) || a.currentTime >= (a.duration || 0)) a.currentTime = 0;
        a.play().catch(() => {});
      } catch {}
    }
    if (typeof window === "undefined") return;
    window.addEventListener("mb:host-repeat-play", onHostRepeatPlay as any);
    return () => window.removeEventListener("mb:host-repeat-play", onHostRepeatPlay as any);
  }, [safeSrc]);

  useEffect(() => {
    setReady(false); setPlaying(false); setT(0); setDur(0);
    startedAtRef.current = null;
    if (isLocked || !resolvedSrc) { audioRef.current = null; return; }
    const a = new Audio();
    a.preload = "metadata";
    a.src = resolvedSrc;
    audioRef.current = a;
    const onLoaded = () => { setReady(true); setDur(Number.isFinite(a.duration) ? a.duration : 0); };
    const onTime   = () => setT(a.currentTime || 0);
    const onPlay   = () => { setPlaying(true);  dispatchHostRepeatTarget("start", resolvedSrc!); };
    const onPause  = () => setPlaying(false);
    const onEnded  = () => { setPlaying(false); setT(0); dispatchHostRepeatTarget("end", resolvedSrc!); };
    // 403 self-heal: if playback errors after a signed URL expires (sleep-wake
    // edge case), invalidate the cache + re-sign so the next render attempts fresh.
    const onError  = () => { refresh(); };
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);
    return () => {
      a.pause();
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [resolvedSrc, isLocked, refresh]);

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

  // Derived mouth shape
  const mouthRy = 1.5 + mouthOpen * 7;
  const mouthRx = 11;
  const mouthY  = 43;

  return (
    <div
      className={className || ""}
      data-mb-talkingface
      data-playing={playing ? "true" : "false"}
      data-locked={isLocked ? "true" : "false"}
    >
      <style>{`
        [data-mb-talkingface] { width: 100%; }

        [data-mb-talkingface] .mb-row {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          border: 1px solid rgba(255,138,101,0.18);
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(255,248,242,0.98) 0%, rgba(255,252,248,0.96) 100%);
          padding: 10px 14px 10px 10px;
          box-shadow: 0 4px 20px rgba(255,138,101,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        [data-mb-talkingface]:not([data-locked="true"]) .mb-row:hover {
          box-shadow: 0 8px 28px rgba(255,138,101,0.14), inset 0 1px 0 rgba(255,255,255,0.9);
          border-color: rgba(255,138,101,0.30);
        }
        [data-mb-talkingface][data-locked="true"] .mb-row { opacity: 0.60; }

        /* Face button */
        [data-mb-talkingface] .mb-faceBtn {
          width: 54px;
          height: 54px;
          border-radius: 999px;
          border: none;
          background: transparent;
          padding: 0;
          flex: 0 0 54px;
          cursor: pointer;
          position: relative;
          transition: transform 0.15s;
        }
        [data-mb-talkingface] .mb-faceBtn:hover { transform: scale(1.06); }
        [data-mb-talkingface] .mb-faceBtn:active { transform: scale(0.97); }
        [data-mb-talkingface][data-locked="true"] .mb-faceBtn { cursor: not-allowed; }

        /* Pulse ring when playing */
        [data-mb-talkingface][data-playing="true"] .mb-faceBtn::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 999px;
          border: 2px solid rgba(255,107,107,0.40);
          animation: mbPulseRing 1.4s ease-out infinite;
        }
        @keyframes mbPulseRing {
          0%   { transform: scale(0.92); opacity: 1; }
          100% { transform: scale(1.18); opacity: 0; }
        }

        /* Blink */
        [data-mb-talkingface] .mb-eye-l,
        [data-mb-talkingface] .mb-eye-r {
          animation: mbBlink 5.2s ease-in-out infinite;
        }
        [data-mb-talkingface] .mb-eye-r { animation-delay: 0.06s; }
        @keyframes mbBlink {
          0%, 90%, 100% { transform: scaleY(1);    }
          92%           { transform: scaleY(0.08); }
          94%           { transform: scaleY(1);    }
        }

        /* Mid section */
        [data-mb-talkingface] .mb-mid {
          flex: 1 1 auto;
          min-width: 0;
        }
        [data-mb-talkingface] .mb-label {
          font-size: 12px;
          font-weight: 700;
          color: rgba(0,0,0,0.62);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 7px;
          letter-spacing: 0.01em;
        }
        [data-mb-talkingface] .mb-barRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        [data-mb-talkingface] .mb-range {
          flex: 1 1 auto;
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 999px;
          background: rgba(0,0,0,0.10);
          outline: none;
          cursor: pointer;
        }
        [data-mb-talkingface] .mb-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #FF6B6B, #FF8E53);
          box-shadow: 0 2px 6px rgba(255,107,107,0.40);
          cursor: pointer;
          transition: transform 0.15s;
        }
        [data-mb-talkingface] .mb-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
        [data-mb-talkingface] .mb-range::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 999px;
        }
        [data-mb-talkingface] .mb-time {
          flex: 0 0 auto;
          font-size: 11px;
          font-weight: 700;
          color: rgba(0,0,0,0.42);
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <div className="mb-row">
        {/* ── Talking Face ── */}
        <button
          type="button"
          className="mb-faceBtn"
          onClick={isLocked ? undefined : toggle}
          title={isLocked ? "Locked" : playing ? "Pause" : "Play"}
          aria-label={isLocked ? "Audio locked" : playing ? "Pause" : "Play"}
          disabled={isLocked}
        >
          <svg width="54" height="54" viewBox="0 0 64 64" aria-hidden="true">
            <defs>
              {/* Radial glow behind face */}
              <radialGradient id={glowId} cx="50%" cy="45%" r="50%">
                <stop offset="0%"   stopColor={playing ? "#FFB347" : "#FFD4C2"} stopOpacity="0.6" />
                <stop offset="100%" stopColor={playing ? "#FF6B6B" : "#FFB39A"} stopOpacity="0"   />
              </radialGradient>
              {/* Skin gradient */}
              <radialGradient id={skinId} cx="42%" cy="35%" r="60%">
                <stop offset="0%"   stopColor="#FFE0C8" />
                <stop offset="60%"  stopColor="#FFCBA4" />
                <stop offset="100%" stopColor="#F5B080" />
              </radialGradient>
              {/* Hair gradient */}
              <linearGradient id={hairId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#3D2314" />
                <stop offset="100%" stopColor="#6B3A2A" />
              </linearGradient>
              {/* Rainbow ring */}
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#FF6B6B" />
                <stop offset="33%"  stopColor="#FFD93D" />
                <stop offset="66%"  stopColor="#6BCBFF" />
                <stop offset="100%" stopColor="#6BCB77" />
              </linearGradient>
              <clipPath id={clipId}>
                <circle cx="32" cy="32" r="26" />
              </clipPath>
            </defs>

            {/* Glow halo */}
            <circle cx="32" cy="32" r="30" fill={`url(#${glowId})`} />

            {/* Rainbow border ring */}
            <circle cx="32" cy="32" r="27" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.5" opacity={playing ? "1" : "0.55"} />

            {/* Face base */}
            <circle cx="32" cy="32" r="25" fill={`url(#${skinId})`} clipPath={`url(#${clipId})`} />

            {/* Hair — top sweep */}
            <ellipse cx="32" cy="13" rx="17" ry="10" fill={`url(#${hairId})`} clipPath={`url(#${clipId})`} />
            <ellipse cx="14" cy="26" rx="5"  ry="12" fill={`url(#${hairId})`} clipPath={`url(#${clipId})`} />
            <ellipse cx="50" cy="26" rx="5"  ry="12" fill={`url(#${hairId})`} clipPath={`url(#${clipId})`} />

            {/* Cheeks */}
            <ellipse cx="19" cy="38" rx="7" ry="4.5" fill="rgba(255,160,120,0.35)" />
            <ellipse cx="45" cy="38" rx="7" ry="4.5" fill="rgba(255,160,120,0.35)" />

            {/* Left eye */}
            <g className="mb-eye-l" style={{ transformOrigin: "24px 27px" }}>
              <ellipse cx="24" cy="27" rx="4.5" ry="5" fill="white" />
              <ellipse cx="24.8" cy="27.5" rx="2.8" ry="3.2" fill="#2C1A0E" />
              <ellipse cx="25.5" cy="26.2" rx="1.1" ry="1.2" fill="white" />
              <ellipse cx="23.5" cy="28.5" rx="0.5" ry="0.5" fill="white" opacity="0.6" />
            </g>

            {/* Right eye */}
            <g className="mb-eye-r" style={{ transformOrigin: "40px 27px" }}>
              <ellipse cx="40" cy="27" rx="4.5" ry="5" fill="white" />
              <ellipse cx="40.8" cy="27.5" rx="2.8" ry="3.2" fill="#2C1A0E" />
              <ellipse cx="41.5" cy="26.2" rx="1.1" ry="1.2" fill="white" />
              <ellipse cx="39.5" cy="28.5" rx="0.5" ry="0.5" fill="white" opacity="0.6" />
            </g>

            {/* Eyebrows */}
            <path d="M20 21.5 Q24 19.5 28 21" stroke="#5C3317" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M36 21 Q40 19.5 44 21.5" stroke="#5C3317" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Nose */}
            <path d="M32 31 Q30 35 28.5 35.5 Q30.5 36.5 32 36.5 Q33.5 36.5 35.5 35.5 Q34 35 32 31Z"
              fill="rgba(180,100,60,0.20)" />

            {/* Mouth */}
            {mouthOpen > 0.15 ? (
              <>
                {/* Open mouth — lip + teeth + tongue */}
                <ellipse cx="32" cy={mouthY} rx={mouthRx} ry={mouthRy + 1}
                  fill="rgba(80,20,10,0.85)" />
                {/* Teeth */}
                {mouthRy > 3 && (
                  <ellipse cx="32" cy={mouthY - mouthRy * 0.35} rx={mouthRx * 0.8} ry={Math.max(1, mouthRy * 0.45)}
                    fill="rgba(255,255,255,0.90)" />
                )}
                {/* Tongue */}
                {mouthRy > 5 && (
                  <ellipse cx="32" cy={mouthY + mouthRy * 0.3} rx={mouthRx * 0.55} ry={Math.max(1, mouthRy * 0.35)}
                    fill="rgba(230,100,110,0.80)" />
                )}
                {/* Upper lip */}
                <path d={`M ${32 - mouthRx} ${mouthY} Q ${32 - mouthRx * 0.5} ${mouthY - mouthRy - 2} 32 ${mouthY - mouthRy - 1} Q ${32 + mouthRx * 0.5} ${mouthY - mouthRy - 2} ${32 + mouthRx} ${mouthY}`}
                  fill="rgba(200,80,80,0.50)" />
              </>
            ) : (
              /* Closed smile */
              <path d="M22 41 Q32 47 42 41" stroke="rgba(160,70,50,0.75)" strokeWidth="2.2"
                fill="none" strokeLinecap="round" />
            )}

            {/* Ear left */}
            <ellipse cx="7" cy="33" rx="3.5" ry="5.5" fill="#FFCBA4" />
            <ellipse cx="7.5" cy="33" rx="2" ry="3.5" fill="rgba(200,120,90,0.30)" />
            {/* Ear right */}
            <ellipse cx="57" cy="33" rx="3.5" ry="5.5" fill="#FFCBA4" />
            <ellipse cx="56.5" cy="33" rx="2" ry="3.5" fill="rgba(200,120,90,0.30)" />

            {/* Play/pause overlay indicator — tiny dot bottom right */}
            <circle cx="48" cy="48" r="7" fill={playing ? "#FF6B6B" : "rgba(0,0,0,0.15)"} />
            {playing ? (
              <>
                <rect x="45.5" y="45" width="2.5" height="6" rx="1" fill="white" />
                <rect x="49.5" y="45" width="2.5" height="6" rx="1" fill="white" />
              </>
            ) : (
              <polygon points="46,45 46,51 52,48" fill="white" />
            )}
          </svg>
        </button>

        {/* ── Progress + label ── */}
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
              onChange={e => seek(Number(e.target.value) / 1000)}
              aria-label="Seek audio"
              disabled={!ready || !dur || isLocked}
              style={{
                background: `linear-gradient(to right, #FF6B6B ${pct * 100}%, rgba(0,0,0,0.10) ${pct * 100}%)`,
              }}
            />
            <div className="mb-time">{fmtTime(t)} / {fmtTime(dur)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
