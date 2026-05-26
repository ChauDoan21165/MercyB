// Home badge: "📚 N từ cần ôn".
//
// Reads the user's due-vocabulary count on mount. Hidden when:
//   - the user is anonymous
//   - count == 0 (no review queue, no surface-area noise)
//   - the fetch failed (silent — Home keeps loading the rest of itself)
//
// Tap → /vocabulary/review.

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { fetchDueCount } from "@/lib/vocabulary/repository";

export default function VocabularyReviewBadge() {
  const { user } = useAuth();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setCount(null);
      return;
    }
    let alive = true;
    fetchDueCount()
      .then((n) => {
        if (!alive) return;
        setCount(n);
      })
      .catch(() => {
        if (!alive) return;
        setCount(null);
      });
    return () => {
      alive = false;
    };
  }, [user?.id]);

  const dismissed = count === null || count <= 0;

  // Auto-hidden by the brief: zero is silent.
  if (dismissed) return null;

  return (
    <Link to="/vocabulary/review" style={badgeStyle} data-testid="vocab-review-badge">
      <span aria-hidden style={{ fontSize: 16 }}>📚</span>
      <span style={textStyle}>
        <span style={viStyle}>{count} từ cần ôn</span>
        <span style={enStyle}>{count} word{count === 1 ? "" : "s"} due</span>
      </span>
      <span aria-hidden style={{ fontSize: 14 }}>→</span>
    </Link>
  );
}

const badgeStyle: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 14px",
  borderRadius: 14,
  background: "rgba(99,102,241,0.06)",
  border: "1px solid rgba(99,102,241,0.20)",
  color: "rgba(67,56,202,0.95)",
  textDecoration: "none",
};

const textStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const viStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
};

const enStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.55)",
  marginTop: 1,
};
