// src/pages/challenges/ChallengeHistoryPage.tsx
// Route: /challenge/history
//
// Last 30 days of daily-challenge completions, rendered as:
//   - A 6-week calendar grid (heatmap style) where each cell is a
//     local day and the colour intensity reflects the score.
//   - A list of recent completions with score + the underlying
//     challenge text.
//
// Anonymous users get a sign-in prompt — there's no public history
// to show.

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import {
  fetchCompletionHistory,
  todayLocalISO,
  type CompletionRow,
} from "@/lib/challenges/dailyChallenge";
import { getChallengeById } from "@/data/pronunciation-challenges";

const DAYS_BACK = 30;
const CELL_SIZE = 28;

export default function ChallengeHistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [rows, setRows] = useState<CompletionRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!userId) {
        if (!cancelled) {
          setRows([]);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      const data = await fetchCompletionHistory(supabase, userId, DAYS_BACK);
      if (!cancelled) {
        setRows(data);
        setLoading(false);
      }
    };
    if (!authLoading) void run();
    return () => {
      cancelled = true;
    };
  }, [authLoading, userId]);

  const calendarDays = useMemo(() => buildCalendarDays(DAYS_BACK), []);
  const byDay = useMemo(() => indexByDay(rows ?? []), [rows]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px" }}>
      <div style={{ marginBottom: 14 }}>
        <Link
          to="/challenge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 800,
            color: "rgba(67,20,7,0.92)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={14} aria-hidden /> Quay lại thử thách hôm nay
        </Link>
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 950,
          letterSpacing: -0.4,
          color: "rgba(15,23,42,0.96)",
        }}
      >
        Lịch sử thử thách · Challenge history
      </h1>
      <p style={{ marginTop: 4, color: "rgba(0,0,0,0.55)", fontSize: 13 }}>
        30 ngày gần nhất · Last 30 days
      </p>

      {!userId && !authLoading ? (
        <SignInPrompt />
      ) : loading ? (
        <p style={{ marginTop: 16, color: "rgba(0,0,0,0.55)" }}>
          Đang tải… · Loading.
        </p>
      ) : (
        <>
          <CalendarHeatmap days={calendarDays} byDay={byDay} />
          <RecentList rows={rows ?? []} />
        </>
      )}
    </div>
  );
}

function SignInPrompt() {
  return (
    <div
      style={{
        marginTop: 18,
        padding: 16,
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.10)",
        background: "white",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, color: "rgba(0,0,0,0.78)" }}>
        Đăng nhập để xem lịch sử của mình.
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(0,0,0,0.55)" }}>
        Sign in to see your challenge history.
      </p>
      <Link
        to="/signin"
        style={{
          display: "inline-block",
          marginTop: 10,
          padding: "8px 14px",
          borderRadius: 9999,
          background: "rgba(67,20,7,0.92)",
          color: "#FFF7ED",
          fontSize: 13,
          fontWeight: 900,
          textDecoration: "none",
        }}
      >
        Sign in →
      </Link>
    </div>
  );
}

function CalendarHeatmap({
  days,
  byDay,
}: {
  days: string[];
  byDay: Map<string, CompletionRow>;
}) {
  // Group into weeks (columns), starting from Sunday.
  const cols: string[][] = [];
  let current: string[] = [];
  for (const day of days) {
    const dow = new Date(`${day}T00:00:00`).getDay(); // 0..6 Sun..Sat
    if (dow === 0 && current.length > 0) {
      cols.push(current);
      current = [];
    }
    current.push(day);
  }
  if (current.length > 0) cols.push(current);

  return (
    <section
      aria-label="Completion heatmap"
      style={{
        marginTop: 22,
        padding: 16,
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "white",
        overflowX: "auto",
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          color: "rgba(0,0,0,0.55)",
        }}
      >
        Calendar · Lịch hoàn thành
      </p>
      <div style={{ display: "flex", gap: 4 }}>
        {cols.map((col, ci) => (
          <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {col.map((day) => (
              <div
                key={day}
                title={describeDay(day, byDay.get(day))}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderRadius: 6,
                  background: cellColor(byDay.get(day)?.score),
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
                data-testid={`heatmap-cell-${day}`}
              />
            ))}
          </div>
        ))}
      </div>
      <Legend />
    </section>
  );
}

function Legend() {
  return (
    <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(0,0,0,0.55)" }}>
      <span>Ít</span>
      {[null, 50, 70, 85, 95].map((score, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 14,
            height: 14,
            borderRadius: 4,
            background: cellColor(score ?? undefined),
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        />
      ))}
      <span>Nhiều</span>
    </div>
  );
}

function RecentList({ rows }: { rows: CompletionRow[] }) {
  if (rows.length === 0) {
    return (
      <div
        style={{
          marginTop: 18,
          padding: 16,
          borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "white",
          color: "rgba(0,0,0,0.55)",
        }}
      >
        Chưa có thử thách nào hoàn thành. Quay lại trang thử thách để bắt đầu.
      </div>
    );
  }

  return (
    <section
      aria-label="Recent completions"
      style={{ marginTop: 18 }}
    >
      <h2
        style={{
          margin: "0 0 8px",
          fontSize: 14,
          fontWeight: 900,
          color: "rgba(0,0,0,0.74)",
        }}
      >
        Gần đây · Recent
      </h2>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((row) => {
          const challenge = getChallengeById(row.challenge_id);
          return (
            <li
              key={`${row.completed_local_date}-${row.challenge_id}`}
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "white",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 56,
                  textAlign: "center",
                  padding: "8px 0",
                  borderRadius: 8,
                  background: cellColor(row.score),
                  color: "rgba(15,23,42,0.92)",
                  fontWeight: 900,
                  fontSize: 14,
                }}
              >
                {row.score}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "rgba(15,23,42,0.96)" }}>
                  {challenge?.content_en ?? row.challenge_id}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                  {row.completed_local_date}
                  {challenge ? ` · ${challenge.type.replace("_", " ")}` : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function buildCalendarDays(daysBack: number): string[] {
  const out: string[] = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(todayLocalISO(d));
  }
  return out;
}

function indexByDay(rows: CompletionRow[]): Map<string, CompletionRow> {
  const m = new Map<string, CompletionRow>();
  for (const row of rows) m.set(row.completed_local_date, row);
  return m;
}

function cellColor(score: number | undefined): string {
  if (score == null) return "rgba(0,0,0,0.05)";
  if (score >= 90) return "rgba(16,185,129,0.85)";
  if (score >= 75) return "rgba(16,185,129,0.55)";
  if (score >= 60) return "rgba(245,158,11,0.55)";
  return "rgba(244,63,94,0.45)";
}

function describeDay(day: string, row: CompletionRow | undefined): string {
  if (!row) return `${day}: chưa hoàn thành`;
  return `${day}: ${row.score}/100`;
}
