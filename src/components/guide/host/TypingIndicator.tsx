// src/components/guide/host/TypingIndicator.tsx
import React from "react";

export default function TypingIndicator({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <span
      aria-label="typing"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        opacity: 0.75,
        userSelect: "none",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor", opacity: 0.45 }} />
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor", opacity: 0.65 }} />
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor", opacity: 0.85 }} />
    </span>
  );
}