// FILE: TalkingFaceIcon.tsx
// PATH: src/components/guide/TalkingFaceIcon.tsx
// VERSION: MB-BLUE-101.7c — 2026-01-09 (+0700)
// NOTE: Visual-only upgrade — higher contrast, clearer expression, friendly look.

import React from "react";

type Props = {
  size?: number;
  isTalking?: boolean;
  isLoading?: boolean;
  title?: string;
};

export default function TalkingFaceIcon({
  size = 28,
  isTalking = false,
  isLoading = false,
  title = "Mercy Host",
}: Props) {
  const s = Math.max(16, Math.floor(size));
  const stroke = Math.max(1.4, s / 24);
  const mouthOpen = isTalking || isLoading;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      style={{ display: "block" }}
    >
      <title>{title}</title>

      <defs>
        {/* Stronger rainbow glow */}
        <radialGradient id="mbGlow" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,1)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="72%" stopColor="rgba(255,170,0,0.35)" />
          <stop offset="82%" stopColor="rgba(255,90,140,0.32)" />
          <stop offset="90%" stopColor="rgba(120,100,255,0.28)" />
          <stop offset="100%" stopColor="rgba(0,180,255,0.18)" />
        </radialGradient>

        {/* Face fill */}
        <radialGradient id="mbFace" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="85%" stopColor="#f5f6f8" />
          <stop offset="100%" stopColor="#eceef2" />
        </radialGradient>

        {/* Stronger cheek blush */}
        <radialGradient id="mbCheek" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(255,120,150,0.45)" />
          <stop offset="70%" stopColor="rgba(255,120,150,0.15)" />
          <stop offset="100%" stopColor="rgba(255,120,150,0)" />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="50" cy="50" r="48" fill="url(#mbGlow)" />

      {/* Face */}
      <circle
        cx="50"
        cy="50"
        r="34"
        fill="url(#mbFace)"
        stroke="rgba(0,0,0,0.28)"
        strokeWidth={stroke}
      />

      {/* Cheeks */}
      <circle cx="35" cy="58" r="11" fill="url(#mbCheek)" />
      <circle cx="65" cy="58" r="11" fill="url(#mbCheek)" />

      {/* Eyes */}
      <circle cx="39" cy="45" r="3.8" fill="rgba(0,0,0,0.85)" />
      <circle cx="61" cy="45" r="3.8" fill="rgba(0,0,0,0.85)" />

      {/* Eyebrows — darker + clearer */}
      <path
        d="M32 38 Q39 34 46 38"
        stroke="rgba(0,0,0,0.65)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M54 38 Q61 34 68 38"
        stroke="rgba(0,0,0,0.65)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />

      {/* Mouth */}
      {mouthOpen ? (
        <>
          <ellipse
            cx="50"
            cy="64"
            rx="9.5"
            ry="7.5"
            fill="rgba(0,0,0,0.85)"
          />
          <ellipse
            cx="50"
            cy="66"
            rx="6"
            ry="4"
            fill="rgba(255,255,255,0.22)"
          />
        </>
      ) : (
        <path
          d="M40 62 Q50 70 60 62"
          stroke="rgba(0,0,0,0.75)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
