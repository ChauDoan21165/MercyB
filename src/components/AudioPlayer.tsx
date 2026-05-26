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
import { toAudioKey } from "@/lib/roomAudioResolver";

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

function pickKey(props: Props): string {
  const raw = props.src || props.url || props.audioSrc || "";
  return toAudioKey(raw) ?? "";
}

function fallbackLabel(key: string): string {
  const s = String(key || "").trim();
  if (!s) return "";
  return s.split("/").pop() || s;
}

// Named export (legacy imports)
export function AudioPlayer(props: Props) {
  // Phase 2: pass the canonical key down; TalkingFacePlayButton's useAudioUrl
  // produces the playable URL (Supabase signed or local, per key family).
  const key = pickKey(props);
  if (!key) return null;

  const label = String(props.label || props.title || "").trim() || fallbackLabel(key);

  return (
    <TalkingFacePlayButton
      src={key}
      label={label}
      className={props.className}
      fullWidthBar={props.fullWidthBar ?? true}
    />
  );
}

// Default export (legacy imports)
export default AudioPlayer;
