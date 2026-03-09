// TopicSection.tsx

import React from "react";

type TopicSectionProps = {
  title: string;
  rooms: Array<{ id: string; title: string }>;
  onOpenRoom: (roomId: string) => void;
  onSeeAll?: () => void;
};

export default function TopicSection({
  title,
  rooms,
  onOpenRoom,
  onSeeAll,
}: TopicSectionProps) {
  return (
    <section
      style={{
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 12,
          gap: 10,
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 900,
            margin: 0,
            flex: 1,
          }}
        >
          {title}
        </h2>

        {onSeeAll ? (
          <button
            type="button"
            onClick={onSeeAll}
            style={{
              fontSize: 13,
              fontWeight: 800,
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 999,
              padding: "6px 12px",
              background: "white",
              cursor: "pointer",
            }}
          >
            See all
          </button>
        ) : null}
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => onOpenRoom(room.id)}
            style={{
              width: "100%",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 14,
              padding: 14,
              background: "rgba(255,255,255,0.9)",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                lineHeight: 1.35,
              }}
            >
              {room.title}
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                fontWeight: 700,
                color: "rgba(0,0,0,0.6)",
              }}
            >
              Open room →
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}