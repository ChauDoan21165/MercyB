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

import { useServerStreak } from "@/hooks/useServerStreak";

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

type StatusVisuals = {
  emoji: string;
  labelEn: string;
  labelVi: string;
  bg: string;
  fg: string;
};

const STATUS_VISUALS: Record<StreakStatus, StatusVisuals> = {
  active:   { emoji: "🔥", labelEn: "Active",        labelVi: "Đang duy trì",  bg: "#fff7ed", fg: "#9a3412" },
  in_grace: { emoji: "💤", labelEn: "Grace period",  labelVi: "Còn ân hạn",    bg: "#fefce8", fg: "#854d0e" },
  warning:  { emoji: "⚠️", labelEn: "Almost lost",   labelVi: "Sắp mất chuỗi", bg: "#fef3c7", fg: "#b45309" },
  reset:    { emoji: "⏸",  labelEn: "Reset",         labelVi: "Đã reset",      bg: "#f1f5f9", fg: "#475569" },
  unknown:  { emoji: "✨", labelEn: "Streak",        labelVi: "Chuỗi",         bg: "#f1f5f9", fg: "#475569" },
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
  const streak = useServerStreak();

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

  return (
    <section
      id={anchorId}
      style={wrap}
      aria-label="Study streak"
      data-testid="streak-history-panel"
    >
      <header style={headerRow}>
        <h2 style={titleStyle}>
          My Progress
          <span style={titleViStyle}>Tiến độ của tôi</span>
        </h2>
        <span
          style={statusPillStyle(visuals.bg, visuals.fg)}
          data-testid="streak-status-pill"
        >
          <span aria-hidden>{visuals.emoji}</span>
          <span>
            {visuals.labelEn} · {visuals.labelVi}
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
          <span style={{ fontWeight: 700 }}>Current streak:</span>{" "}
          {streak.current} day{streak.current === 1 ? "" : "s"}
          <span style={metaLineViStyle}>
            {" "}
            · Chuỗi hiện tại: {streak.current} ngày
          </span>
        </div>
        <div>
          <span style={{ fontWeight: 700 }}>Longest streak:</span>{" "}
          {streak.longest} day{streak.longest === 1 ? "" : "s"}
          <span style={metaLineViStyle}>
            {" "}
            · Chuỗi dài nhất: {streak.longest} ngày
          </span>
        </div>
        <div>
          <span style={{ fontWeight: 700 }}>Last studied:</span>{" "}
          {lastStudied.en}
          <span style={metaLineViStyle}>
            {" "}
            · Học lần cuối: {lastStudied.vi}
          </span>
        </div>
      </div>

      <p style={noteStyle}>
        You have <strong>1 day of grace left</strong>. Study anything today to
        protect your streak!
        <span style={noteViStyle}>
          Bạn còn <strong>1 ngày ân hạn</strong>. Học bất kỳ gì hôm nay là giữ
          được chuỗi ngay!
        </span>
      </p>
    </section>
  );
}
