// RoomTile.tsx

import React from "react";

type RoomTileProps = {
  title: string;
  subtitle?: string;
  onClick: () => void;
};

export default function RoomTile({
  title,
  subtitle,
  onClick,
}: RoomTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open room ${title}`}
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
          fontSize: 18,
          fontWeight: 900,
          lineHeight: 1.35,
          color: "rgba(0,0,0,0.9)",
        }}
      >
        {title}
      </div>

      {subtitle ? (
        <div
          style={{
            marginTop: 6,
            fontSize: 14,
            color: "rgba(0,0,0,0.65)",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 10,
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(0,0,0,0.6)",
        }}
      >
        Enter room →
      </div>
    </button>
  );
}