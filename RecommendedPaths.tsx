// RecommendedPaths.tsx

import React from "react";

type RecommendedPathsProps = {
  onOpenPath: (pathId: string, firstRoomId: string) => void;
};

type PathItem = {
  id: string;
  title: string;
  description: string;
  firstRoomId: string;
};

const PATHS: PathItem[] = [
  {
    id: "reflection",
    title: "Reflection Path",
    description: "Explore thoughtful rooms about awareness and inner life.",
    firstRoomId: "reflection-intro",
  },
  {
    id: "communication",
    title: "Communication Path",
    description: "Practice expressing ideas clearly in English.",
    firstRoomId: "communication-intro",
  },
  {
    id: "curiosity",
    title: "Curiosity Path",
    description: "Follow questions about people, culture, and meaning.",
    firstRoomId: "curiosity-intro",
  },
];

export default function RecommendedPaths({
  onOpenPath,
}: RecommendedPathsProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
      }}
    >
      {PATHS.map((path) => (
        <button
          key={path.id}
          type="button"
          onClick={() => onOpenPath(path.id, path.firstRoomId)}
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
              fontSize: 16,
              fontWeight: 900,
              color: "rgba(0,0,0,0.9)",
            }}
          >
            {path.title}
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 14,
              color: "rgba(0,0,0,0.65)",
              lineHeight: 1.4,
            }}
          >
            {path.description}
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(0,0,0,0.6)",
            }}
          >
            Start path →
          </div>
        </button>
      ))}
    </div>
  );
}