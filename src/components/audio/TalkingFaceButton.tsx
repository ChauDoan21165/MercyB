/**
 * TalkingFaceButton — v83.3
 * Generated: 2025-12-22 14:14 (+0700)
 * Reporter: teacher GPT
 *
 * Core UI motif (LOCKED):
 * - Small round face icon
 * - Mouth OPEN while audio is playing
 * - Mouth CLOSED when paused
 *
 * Notes:
 * - Visual-only component (no audio logic)
 * - isPlaying controls animation (fast + deterministic)
 */

import * as React from "react";

type Props = {
  isPlaying: boolean;
  onClick?: () => void;
  size?: number; // px
  disabled?: boolean;
  className?: string;
  title?: string;
  "aria-label"?: string;
};

export function TalkingFaceButton({
  isPlaying,
  onClick,
  size = 32,
  disabled,
  className = "",
  title,
  "aria-label": ariaLabel,
}: Props) {
  const px = Math.max(24, Math.min(44, Math.floor(size)));

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || (isPlaying ? "Pause" : "Play")}
      className={[
        "inline-flex items-center justify-center rounded-full border bg-background shadow-sm",
        "transition-transform active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent",
        className,
      ].join(" ")}
      style={{ width: px, height: px }}
    >
      {/* FACE */}
      <div
        className="relative"
        style={{ width: Math.round(px * 0.72), height: Math.round(px * 0.72) }}
      >
        {/* Eyes */}
        <div
          className="absolute rounded-full bg-foreground"
          style={{
            width: Math.round(px * 0.10),
            height: Math.round(px * 0.10),
            left: Math.round(px * 0.14),
            top: Math.round(px * 0.18),
          }}
        />
        <div
          className="absolute rounded-full bg-foreground"
          style={{
            width: Math.round(px * 0.10),
            height: Math.round(px * 0.10),
            right: Math.round(px * 0.14),
            top: Math.round(px * 0.18),
          }}
        />

        {/* Mouth (OPEN/CLOSE) */}
        <div
          className={[
            "absolute left-1/2 -translate-x-1/2",
            "border border-foreground",
            "transition-all duration-150 ease-out",
            isPlaying ? "bg-foreground/10" : "bg-transparent",
          ].join(" ")}
          style={{
            top: Math.round(px * 0.40),
            width: Math.round(px * 0.22),
            height: isPlaying ? Math.round(px * 0.18) : Math.max(2, Math.round(px * 0.04)),
            borderRadius: isPlaying ? 999 : 999,
          }}
        />
      </div>
    </button>
  );
}
