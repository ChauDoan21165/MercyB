// ContinueJourneyCard.tsx

import React from "react";

type ContinueJourneyCardProps = {
  roomId: string;
  title: string;
  onContinue: () => void;
};

export default function ContinueJourneyCard({
  roomId,
  title,
  onContinue,
}: ContinueJourneyCardProps) {
  return (
    <button
      type="button"
      onClick={onContinue}
      aria-label={`Continue room ${title}`}
      title={roomId}
      style={{
        width: "100%",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,0.9)",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: 0.5,
          color: "rgba(0,0,0,0.5)",
        }}
      >
        CONTINUE
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 18,
          fontWeight: 800,
          color: "rgba(0,0,0,0.86)",
          lineHeight: 1.35,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 14,
          fontWeight: 700,
          color: "rgba(0,0,0,0.62)",
        }}
      >
        Continue your journey →
      </div>
    </button>
  );
}