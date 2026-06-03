/**
 * Detailed streak panel for Account → My Progress.
 *
 * Reads from useServerStreak (server-side authoritative). Computes a
 * status indicator (active / paused-in-grace / about-to-reset) from
 * the gap between today (browser-local) and streak_last_studied_date
 * (already stored in the user's local timezone by the SQL trigger).
 *
 * Status semantics — kept in lock-step with the trigger logic in
 * supabase/migrations/20260425000000_server_side_streaks.sql:
 *
 *   active     🔥  studied today
 *   in_grace   💤  studied yesterday (streak chain still alive)
 *   warning    ⚠️  studied 2 days ago (last day of the grace window)
 *   reset      ⏸  studied 3+ days ago (next study won't extend; resets to 1)
 *
 * No 0-streak state — the parent renders nothing when streak_current = 0.
 */

import React, { useMemo } from "react";

import { useCanonicalStreak } from "@/hooks/useCanonicalStreak";
import {
  emptyState,
  graceMessage,
  labels,
  restPermissionMessage,
  splitBilingual,
  statusPills,
} from "@/components/streak/streakCopy";

const wrap: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  padding: 22,
  background: "white",
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
};

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const titleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  letterSpacing: -0.2,
  color: "rgba(10,10,10,0.92)",
  margin: 0,
};

const titleViStyle: React.CSSProperties = {
  display: "block",
  marginTop: 2,
  fontSize: 12,
  fontWeight: 500,
  color: "rgba(0,0,0,0.45)",
};

const bigNumberWrap: React.CSSProperties = {
  marginTop: 14,
  display: "flex",
  alignItems: "baseline",
  gap: 10,
  flexWrap: "wrap",
};

const bigNumberStyle: React.CSSProperties = {
  fontSize: 56,
  fontWeight: 950,
  letterSpacing: -2,
  color: "#9a3412",
  lineHeight: 1,
};

const bigUnitStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "rgba(0,0,0,0.62)",
};

const metaRowStyle: React.CSSProperties = {
  marginTop: 14,
  display: "grid",
  gap: 8,
  fontSize: 14,
  color: "rgba(0,0,0,0.78)",
};

const metaLineViStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(0,0,0,0.5)",
};

const statusPillStyle = (background: string, color: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 10px",
  borderRadius: 9999,
  background,
  color,
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
});

const noteStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 12,
  background: "#fffbeb",
  border: "1px solid #fde68a",
  borderRadius: 12,
  color: "#92400e",
  fontSize: 13,
  lineHeight: 1.5,
};

const noteViStyle: React.CSSProperties = {
  display: "block",
  marginTop: 4,
  fontSize: 12,
  color: "#a16207",
};

type StreakStatus = "active" | "in_grace" | "warning" | "reset" | "unknown";

// Visuals are component-local; labels come from the shared copy dictionary
// (streakCopy.ts). Keep this map in lock-step with the SQL trigger grace
// semantics in supabase/migrations/20260425000000_server_side_streaks.sql.
// Shame-audit fix (reports/streak-shame-audit-2026-04-26.md § F-3):
// warning state previously used ⚠️ + an alarm-amber background, which
// reads as "your streak is about to die" — exactly the pressure framing
// the rest of the copy avoids. Replaced with 🌿 (gentle, alive) and a
// softer pastel-yellow background. The status semantics are unchanged.
const STATUS_VISUALS: Record<StreakStatus, { emoji: string; label: { en: string; vi: string }; bg: string; fg: string }> = {
  active:   { emoji: "🔥", label: splitBilingual(statusPills.active),  bg: "#fff7ed", fg: "#9a3412" },
  in_grace: { emoji: "💤", label: splitBilingual(statusPills.grace),   bg: "#fefce8", fg: "#854d0e" },
  warning:  { emoji: "🌿", label: splitBilingual(statusPills.warning), bg: "#fef9c3", fg: "#854d0e" },
  reset:    { emoji: "⏸",  label: splitBilingual(statusPills.reset),   bg: "#f1f5f9", fg: "#475569" },
  unknown:  { emoji: "✨", label: { en: "Streak", vi: "Chuỗi" },       bg: "#f1f5f9", fg: "#475569" },
};

function startOfDayLocal(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseLocalDate(yyyyMmDd: string): Date | null {
  const m = yyyyMmDd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [, y, mm, dd] = m;
  const d = new Date(Number(y), Number(mm) - 1, Number(dd));
  return Number.isFinite(d.getTime()) ? d : null;
}

function dayDiff(a: Date, b: Date): number {
  return Math.round(
    (startOfDayLocal(a).getTime() - startOfDayLocal(b).getTime()) / 86_400_000,
  );
}

function deriveStatus(lastStudiedDate: string | null): StreakStatus {
  if (!lastStudiedDate) return "unknown";
  const last = parseLocalDate(lastStudiedDate);
  if (!last) return "unknown";
  const diff = dayDiff(new Date(), last);
  if (diff <= 0) return "active";   // today (or future, shouldn't happen)
  if (diff === 1) return "in_grace"; // yesterday
  if (diff === 2) return "warning";  // last day of grace
  return "reset";
}

function formatLastStudied(lastStudiedDate: string | null): {
  en: string;
  vi: string;
} {
  if (!lastStudiedDate) return { en: "—", vi: "—" };
  const d = parseLocalDate(lastStudiedDate);
  if (!d) return { en: lastStudiedDate, vi: lastStudiedDate };

  const en = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(d);
  const vi = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(d);
  return { en, vi };
}

export type StreakHistoryPanelProps = {
  /** Anchor id so the Home StreakBadge can scroll to this panel. */
  anchorId?: string;
};

export function StreakHistoryPanel({
  anchorId = "streaks",
}: StreakHistoryPanelProps) {
  const streak = useCanonicalStreak();

  const status = useMemo<StreakStatus>(
    () => deriveStatus(streak.lastStudiedDate),
    [streak.lastStudiedDate],
  );
  const visuals = STATUS_VISUALS[status];
  const lastStudied = useMemo(
    () => formatLastStudied(streak.lastStudiedDate),
    [streak.lastStudiedDate],
  );

  if (streak.loading) {
    return (
      <section id={anchorId} style={wrap} aria-label="Study streak">
        <p style={{ ...titleViStyle, marginTop: 0 }}>Loading streak…</p>
      </section>
    );
  }

  if (streak.error) {
    return (
      <section id={anchorId} style={wrap} aria-label="Study streak">
        <p style={{ ...titleViStyle, marginTop: 0, color: "#991b1b" }}>
          Couldn't load streak: {streak.error}
        </p>
      </section>
    );
  }

  // Empty state — no streak yet (first-time users or reset). Show the
  // Chau-approved motivational copy instead of a card full of zeros.
  if (streak.current <= 0) {
    const title = splitBilingual(labels.myProgress);
    return (
      <section
        id={anchorId}
        style={wrap}
        aria-label="Study streak"
        data-testid="streak-history-panel"
      >
        <header style={headerRow}>
          <h2 style={titleStyle}>
            {title.en}
            <span style={titleViStyle}>{title.vi}</span>
          </h2>
        </header>
        <p
          style={{ ...noteStyle, background: "#f0f9ff", borderColor: "#bae6fd", color: "#075985" }}
          data-testid="streak-empty-state"
        >
          {emptyState.en}
          <span style={{ ...noteViStyle, color: "#0369a1" }}>{emptyState.vi}</span>
        </p>
      </section>
    );
  }

  return (
    <section
      id={anchorId}
      style={wrap}
      aria-label="Study streak"
      data-testid="streak-history-panel"
    >
      <header style={headerRow}>
        <h2 style={titleStyle}>
          {splitBilingual(labels.myProgress).en}
          <span style={titleViStyle}>
            {splitBilingual(labels.myProgress).vi}
          </span>
        </h2>
        <span
          style={statusPillStyle(visuals.bg, visuals.fg)}
          data-testid="streak-status-pill"
        >
          <span aria-hidden>{visuals.emoji}</span>
          <span>
            {visuals.label.en} · {visuals.label.vi}
          </span>
        </span>
      </header>

      <div style={bigNumberWrap}>
        <span style={bigNumberStyle} data-testid="streak-current-big">
          {streak.current}
        </span>
        <span style={bigUnitStyle}>
          day{streak.current === 1 ? "" : "s"} · ngày
        </span>
      </div>

      <div style={metaRowStyle}>
        <div>
          <span style={{ fontWeight: 700 }}>
            {splitBilingual(labels.currentStreak).en}:
          </span>{" "}
          {streak.current} day{streak.current === 1 ? "" : "s"}
          <span style={metaLineViStyle}>
            {" "}
            · {splitBilingual(labels.currentStreak).vi}: {streak.current} ngày
          </span>
        </div>
        <div>
          <span style={{ fontWeight: 700 }}>
            {splitBilingual(labels.longestStreak).en}:
          </span>{" "}
          {streak.longest} day{streak.longest === 1 ? "" : "s"}
          <span style={metaLineViStyle}>
            {" "}
            · {splitBilingual(labels.longestStreak).vi}: {streak.longest} ngày
          </span>
        </div>
        <div>
          <span style={{ fontWeight: 700 }}>
            {splitBilingual(labels.lastStudied).en}:
          </span>{" "}
          {lastStudied.en}
          <span style={metaLineViStyle}>
            {" "}
            · {splitBilingual(labels.lastStudied).vi}: {lastStudied.vi}
          </span>
        </div>
      </div>

      <p style={noteStyle}>
        {graceMessage.en}
        <span style={noteViStyle}>{graceMessage.vi}</span>
      </p>

      {/* Shame-audit fix § F-8: surface the rest-permission line on
          warning + reset states so users in those windows see vacation
          mode as a first-class option, not a hidden tooltip on the
          home badge. Calmer slate styling so it reads as a sibling
          tip, not a second warning. */}
      {(status === "warning" || status === "reset") ? (
        <p
          style={{
            ...noteStyle,
            background: "#f8fafc",
            borderColor: "#e2e8f0",
            color: "#475569",
          }}
          data-testid="streak-rest-permission"
        >
          {restPermissionMessage.en}
          <span style={{ ...noteViStyle, color: "#64748b" }}>
            {restPermissionMessage.vi}
          </span>
        </p>
      ) : null}
    </section>
  );
}
