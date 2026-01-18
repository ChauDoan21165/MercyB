// src/components/brand/MercyLogo.tsx
// MB-BLUE — Mercy Logo (shared)
// Uses exact JPG from public/brand/mercy-blade-logo.jpg

import React from "react";

type Props = {
  width?: number | string;
  height?: number | string;
  alt?: string;
  title?: string;
  style?: React.CSSProperties;
  className?: string;

  // keep for optional future use, but default is false
  crop?: boolean;
  objectPosition?: React.CSSProperties["objectPosition"];
};

export default function MercyLogo({
  width = "min(560px, 70vw)",
  height = "auto",
  alt = "Mercy Blade",
  title = "Mercy Blade",
  style,
  className,
  crop = false,
  objectPosition = "50% 50%",
}: Props) {
  return (
    <img
      src="/brand/mercy-blade-logo.jpg"
      alt={alt}
      title={title}
      className={className}
      style={{
        width,
        height,
        display: "block",
        userSelect: "none",
        objectFit: crop ? "cover" : "contain", // ✅ default contain (NO CUT)
        objectPosition,
        filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.10))",
        ...style,
      }}
      loading="eager"
      decoding="async"
    />
  );
}
