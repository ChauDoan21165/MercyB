/**
 * Compact streak pill rendered in the Home top-right.
 *
 * Reads from useServerStreak (which is itself feature-flag gated by
 * SERVER_STREAKS_ENABLED). Hidden when:
 *   - Server streaks are off (hook returns loading:false, current:0)
 *   - User has streak_current = 0 (first-time / lapsed users — don't
 *     dunk on them with a "0 day streak" badge)
 *
 * Tap → scroll-to-anchor on /account#streaks (where the detailed
 * StreakHistoryPanel lives). No new route needed.
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useServerStreak } from "@/hooks/useServerStreak";

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 9999,
  background: "#fff7ed",
  border: "1px solid #fdba74",
  color: "#9a3412",
  fontSize: 13,
  fontWeight: 800,
  textDecoration: "none",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  boxShadow: "0 2px 6px rgba(154,52,18,0.08)",
  cursor: "pointer",
};

const tooltipStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  right: 0,
  minWidth: 180,
  padding: "8px 12px",
  background: "rgba(15,23,42,0.92)",
  color: "white",
  borderRadius: 10,
  fontSize: 12,
  lineHeight: 1.4,
  fontWeight: 600,
  textAlign: "left",
  pointerEvents: "none",
  boxShadow: "0 8px 24px rgba(15,23,42,0.18)",
  zIndex: 5,
};

const tooltipViStyle: React.CSSProperties = {
  display: "block",
  marginTop: 2,
  fontSize: 11,
  fontWeight: 500,
  opacity: 0.85,
};

export type StreakBadgeProps = {
  /** Override the link target if mounted somewhere with a custom destination. */
  href?: string;
};

export function StreakBadge({ href = "/account#streaks" }: StreakBadgeProps) {
  const streak = useServerStreak();
  const [showTip, setShowTip] = useState(false);

  // Hide entirely while loading, on error, or when there's nothing to brag about.
  if (streak.loading) return null;
  if (streak.error) return null;
  if (streak.current <= 0) return null;

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onFocus={() => setShowTip(true)}
      onBlur={() => setShowTip(false)}
      data-testid="streak-badge-wrap"
    >
      <Link
        to={href}
        style={pillStyle}
        aria-label={`${streak.current}-day study streak. Open streak history.`}
        data-testid="streak-badge-link"
      >
        <span aria-hidden>🔥</span>
        <span>{streak.current}</span>
      </Link>

      {showTip ? (
        <div role="tooltip" style={tooltipStyle} data-testid="streak-badge-tooltip">
          You're on a {streak.current}-day streak! Keep it going 🔥
          <span style={tooltipViStyle}>
            Bạn đang có chuỗi {streak.current} ngày! Cố lên nhé 🔥
          </span>
        </div>
      ) : null}
    </div>
  );
}
