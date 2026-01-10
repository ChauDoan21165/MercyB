import React from "react";

type Props = {
  className?: string;
  heightPx?: number;
};

/**
 * MercyUnityBand
 * - Slim, still, no text, no animation
 * - Signals: “Many parts. One Mercy.”
 */
export function MercyUnityBand({ className = "", heightPx = 8 }: Props) {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        height: `${heightPx}px`,
        background:
          "linear-gradient(90deg, #4A90E2 0%, #50E3C2 25%, #7ED321 50%, #F8E71C 75%, #F5A623 100%)",
        opacity: 0.9, // keep soft, not neon
      }}
      aria-hidden="true"
    />
  );
}
