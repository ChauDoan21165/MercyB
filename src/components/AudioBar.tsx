// src/components/AudioBar.tsx
// MB-BLUE-96.9 — 2025-12-28 (+0700)
//
// LEGACY KILL SWITCH (LOCKED)
// Any legacy <AudioBar /> MUST render the Mercy Blade talking face.

import React from "react";
import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";

type Props = any;

export default function AudioBar(props: Props) {
  const src = String(props?.src ?? props?.url ?? props?.audio ?? "").trim();
  if (!src) return null;

  const label = String(props?.label ?? props?.name ?? "Audio").trim();

  return (
    <TalkingFacePlayButton
      src={src}
      label={label}
      className="w-full max-w-none"
      fullWidthBar
    />
  );
}
