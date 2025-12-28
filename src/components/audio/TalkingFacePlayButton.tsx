// src/components/audio/TalkingFacePlayButton.tsx
// MB-BLUE-97.5 — 2025-12-29 (+0700)
//
// LOCKED MOTIF:
// - Small round face icon
// - Mouth continuously opens/closes while audio is playing
// - Seekable rainbow progress bar + time display
//
// HARD RULE:
// - Critical layout must NOT rely on Tailwind (so it can't collapse if Tailwind scan misses this file)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TalkingFacePlayButtonProps = {
  src: string;
  label?: string;
  className?: string;
  fullWidthBar?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmtTime(sec: number) {
  const s = Number.isFinite(sec) ? Math.max(0, sec) : 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function TalkingFacePlayButton({
  src,
  label,
  className,
  fullWidthBar,
}: TalkingFacePlayButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const safeSrc = String(src || "").trim();

  const rainbow = useMemo(
    () =>
      "linear-gradient(90deg, #ff4d4d 0%, #ffb84d 18%, #b6ff4d 36%, #4dffb8 54%, #4db8ff 72%, #b84dff 90%, #ff4dff 100%)",
    []
  );

  // Unique-ish key for <style> scoping (safe enough for our use)
  const styleKey = useMemo(() => {
    const base = safeSrc.split("/").pop() || "audio";
    return `mbtalk_${base.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  }, [safeSrc]);

  // When src changes: reset + force metadata load
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    setIsReady(false);
    setIsPlaying(false);
    setIsLoading(false);
    setDuration(0);
    setCurrent(0);

    try {
      a.pause();
      a.currentTime = 0;
      a.load();
      setIsLoading(true);
    } catch {
      // ignore
    }
  }, [safeSrc]);

  // Wire events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onLoadedMeta = () => {
      const d = Number.isFinite(a.duration) ? a.duration : 0;
      setDuration(d > 0 ? d : 0);
      setIsReady(d > 0);
      setIsLoading(false);
    };

    const onTime = () => setCurrent(a.currentTime || 0);
    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrent(0);
    };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onError = () => {
      setIsLoading(false);
      setIsReady(false);
      setIsPlaying(false);
    };

    a.addEventListener("loadedmetadata", onLoadedMeta);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("canplay", onCanPlay);
    a.addEventListener("canplaythrough", onCanPlay);
    a.addEventListener("error", onError);

    return () => {
      a.removeEventListener("loadedmetadata", onLoadedMeta);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("canplay", onCanPlay);
      a.removeEventListener("canplaythrough", onCanPlay);
      a.removeEventListener("error", onError);
    };
  }, []);

  const pct = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return clamp((current / duration) * 100, 0, 100);
  }, [current, duration]);

  const toggle = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;

    try {
      if (a.paused) {
        setIsLoading(true);
        await a.play();
      } else {
        a.pause();
      }
    } catch {
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, []);

  const seek = useCallback(
    (nextPct: number) => {
      const a = audioRef.current;
      if (!a) return;
      if (!duration || duration <= 0) return;

      const next = (clamp(nextPct, 0, 100) / 100) * duration;
      try {
        a.currentTime = next;
        setCurrent(next);
      } catch {
        // ignore
      }
    },
    [duration]
  );

  const onBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const p = (x / rect.width) * 100;
      seek(p);
    },
    [seek]
  );

  // CRITICAL INLINE STYLES
  const wrapStyle: React.CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(6px)",
  };

  const faceBtn: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "white",
    position: "relative",
    display: "grid",
    placeItems: "center",
    flex: "0 0 auto",
    cursor: "pointer",
    userSelect: "none",
    outline: "none",
  };

  const eye: React.CSSProperties = {
    width: 4,
    height: 4,
    borderRadius: 9999,
    background: "rgba(0,0,0,0.75)",
    position: "absolute",
    top: 11,
  };

  // ✅ TALKING MOUTH: a rounded pill whose height animates while playing
  const mouthBase: React.CSSProperties = {
    width: 14,
    height: 3,
    borderRadius: 9999,
    background: "rgba(0,0,0,0.85)",
    position: "absolute",
    bottom: 10,
    transformOrigin: "center",
  };

  // This class triggers keyframe animation below
  const mouthClass = isPlaying ? `${styleKey}_mouth talking` : `${styleKey}_mouth`;

  const rightStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const topRow: React.CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "rgba(0,0,0,0.65)",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const timeStyle: React.CSSProperties = {
    fontSize: 12,
    color: "rgba(0,0,0,0.55)",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    flex: "0 0 auto",
  };

  const barOuter: React.CSSProperties = {
    width: fullWidthBar ? "100%" : "min(520px, 100%)",
    height: 10,
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(0,0,0,0.06)",
    overflow: "hidden",
    cursor: duration > 0 ? "pointer" : "default",
  };

  const barFill: React.CSSProperties = {
    height: "100%",
    width: `${pct}%`,
    background: rainbow,
    transition: "width 120ms linear",
  };

  const statusStyle: React.CSSProperties = {
    fontSize: 12,
    color: "rgba(0,0,0,0.55)",
  };

  if (!safeSrc) return null;

  return (
    <div className={className} style={wrapStyle} data-mb="talking-face">
      {/* Local CSS for talking animation */}
      <style>{`
        @keyframes ${styleKey}_chomp {
          0%   { transform: scaleY(0.7); height: 2px; border-radius: 9999px; }
          50%  { transform: scaleY(1.2); height: 6px; border-radius: 10px; }
          100% { transform: scaleY(0.8); height: 3px; border-radius: 9999px; }
        }
        .${styleKey}_mouth.talking {
          animation: ${styleKey}_chomp 220ms infinite ease-in-out;
        }
      `}</style>

      {/* hidden audio element */}
      <audio ref={audioRef} src={safeSrc} preload="metadata" />

      {/* FACE BUTTON */}
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
        style={faceBtn}
      >
        <span style={{ ...eye, left: 11 }} />
        <span style={{ ...eye, right: 11 }} />
        <span className={mouthClass} style={mouthBase} />
      </button>

      {/* RIGHT SIDE: label + time + bar */}
      <div style={rightStyle}>
        <div style={topRow}>
          <div style={labelStyle} title={label || safeSrc}>
            {label || safeSrc.split("/").pop() || safeSrc}
          </div>
          <div style={timeStyle}>
            {fmtTime(current)} / {duration > 0 ? fmtTime(duration) : "--:--"}
          </div>
        </div>

        <div style={barOuter} onClick={onBarClick} aria-label="Seek bar">
          <div style={barFill} />
        </div>

        {!isReady && isLoading ? <div style={statusStyle}>Loading…</div> : null}
      </div>
    </div>
  );
}
