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
 *
 * Streaks v2: optional props let the parent decorate the pill with
 * forgiveness-mechanism status icons:
 *   ❄️  freeze active for today
 *   🏖️  vacation mode on
 *   🛡️  insurance available (count rendered next to the shield)
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useServerStreak } from "@/hooks/useServerStreak";
import {
  formatStreakTooltip,
  freezeMessage,
  vacationMessage,
  insuranceMessage,
} from "@/components/streak/streakCopy";

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

const v2IconStyle: React.CSSProperties = {
  marginLeft: 4,
  fontSize: 12,
  lineHeight: 1,
};

const insuranceCountStyle: React.CSSProperties = {
  marginLeft: 1,
  fontSize: 11,
  fontWeight: 700,
  opacity: 0.8,
};

export type StreakBadgeProps = {
  /** Override the link target if mounted somewhere with a custom destination. */
  href?: string;
  /** Streaks v2 — show ❄️ when the user has a freeze active today. */
  freezeActive?: boolean;
  /** Streaks v2 — show 🏖️ when the user is in their vacation window. */
  onVacation?: boolean;
  /** Streaks v2 — show 🛡️ × N when N insurance uses are available. */
  insuranceAvailable?: number;
};

export function StreakBadge({
  href = "/account#streaks",
  freezeActive = false,
  onVacation = false,
  insuranceAvailable = 0,
}: StreakBadgeProps) {
  const streak = useServerStreak();
  const [showTip, setShowTip] = useState(false);

  // Hide entirely while loading, on error, or when there's nothing to brag about.
  if (streak.loading) return null;
  if (streak.error) return null;
  if (streak.current <= 0) return null;

  const v2Tooltip = onVacation
    ? vacationMessage
    : freezeActive
      ? freezeMessage
      : insuranceAvailable > 0
        ? insuranceMessage
        : null;

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
        {onVacation ? (
          <span aria-hidden style={v2IconStyle} data-testid="streak-badge-vacation">
            🏖️
          </span>
        ) : freezeActive ? (
          <span aria-hidden style={v2IconStyle} data-testid="streak-badge-freeze">
            ❄️
          </span>
        ) : null}
        {!onVacation && insuranceAvailable > 0 ? (
          <span style={v2IconStyle} data-testid="streak-badge-insurance">
            <span aria-hidden>🛡️</span>
            <span style={insuranceCountStyle}>{insuranceAvailable}</span>
          </span>
        ) : null}
      </Link>

      {showTip ? (() => {
        const baseTip = formatStreakTooltip(streak.current);
        const tip = v2Tooltip ?? baseTip;
        return (
          <div role="tooltip" style={tooltipStyle} data-testid="streak-badge-tooltip">
            {tip.en}
            <span style={tooltipViStyle}>{tip.vi}</span>
          </div>
        );
      })() : null}
    </div>
  );
}
