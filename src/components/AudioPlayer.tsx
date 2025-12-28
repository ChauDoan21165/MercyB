// src/components/AudioPlayer.tsx
// MB-BLUE-97.4 — 2025-12-28 (+0700)
//
// LOCKED (Mercy Blade):
// - Native audio UI must NEVER appear.
// - Legacy <AudioPlayer> must render ONLY the Mercy Blade TalkingFacePlayButton motif.
// - This file is the compatibility bridge: old code can keep importing AudioPlayer,
//   but the UI is always the talking face + progress bar (no filename/time/slider leaks).

import React from "react";
import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";

type Props = {
  // legacy variants
  src?: string;
  url?: string;
  audioSrc?: string;

  // label variants
  label?: string;
  title?: string;

  className?: string;

  // keep parity with TalkingFacePlayButton
  fullWidthBar?: boolean;
};

function normalizeAudioSrc(src: string): string {
  const s = String(src || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  let p = s.replace(/^\/+/, "");

  // tolerate odd paths but ends with mp3 -> keep leaf
  if (p.includes("/") && !p.startsWith("audio/") && p.toLowerCase().endsWith(".mp3")) {
    const leaf = p.split("/").pop() || p;
    p = leaf;
  }

  if (p.startsWith("audio/")) return `/${p}`;
  return `/audio/${p}`;
}

function pickSrc(props: Props): string {
  const raw = props.src || props.url || props.audioSrc || "";
  return normalizeAudioSrc(raw);
}

function fallbackLabel(src: string): string {
  const s = String(src || "").trim();
  if (!s) return "";
  return s.split("/").pop() || s;
}

// Named export (legacy imports)
export function AudioPlayer(props: Props) {
  const src = pickSrc(props);
  if (!src) return null;

  const label = String(props.label || props.title || "").trim() || fallbackLabel(src);

  return (
    <TalkingFacePlayButton
      src={src}
      label={label}
      className={props.className}
      fullWidthBar={props.fullWidthBar ?? true}
    />
  );
}

// Default export (legacy imports)
export default AudioPlayer;
