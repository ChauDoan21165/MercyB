import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { UserProgressRow } from "@/hooks/useUserProgress";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmtMinutes(n?: number | null) {
  const v = Number(n ?? 0);
  if (v < 60) return `${v} min`;
  const h = Math.floor(v / 60);
  const m = v % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function fmtTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function HomeProgressCards(props: { rows: UserProgressRow[]; loading?: boolean; error?: string | null }) {
  const nav = useNavigate();
  const { rows, loading, error } = props;

  const { continueRow, minutes7d, minutes30d, listRows } = useMemo(() => {
    const roomRows = (rows ?? []).filter((r) => r.entity_type === "room" && r.room_id);
    const first = roomRows[0] ?? null;

    // Use the first row (most recently updated) as the source for minutes_7d/30d
    const m7 = Number(first?.minutes_7d ?? 0);
    const m30 = Number(first?.minutes_30d ?? 0);

    return {
      continueRow: first,
      minutes7d: m7,
      minutes30d: m30,
      listRows: roomRows.slice(0, 12),
    };
  }, [rows]);

  return (
    <div style={{ marginTop: 14 }}>
      {/* Error */}
      {error ? (
        <div style={{ padding: 12, borderRadius: 14, border: "1px solid rgba(255,0,0,0.35)", marginBottom: 12 }}>
          {error}
        </div>
      ) : null}

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        {/* Continue card */}
        <div
          style={{
            gridColumn: "1 / -1",
            borderRadius: 18,
            padding: 16,
            border: "1px solid rgba(255,255,255,0.14)",
            background:
              "linear-gradient(135deg, rgba(255,80,160,0.10), rgba(120,90,255,0.08), rgba(0,200,255,0.06))",
            boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.2 }}>Continue</div>
              <div style={{ marginTop: 6, opacity: 0.85, fontSize: 13 }}>
                {loading ? "Loading your latest progress…" : continueRow?.room_id ? continueRow.room_id : "No progress yet — start any room."}
              </div>
              <div style={{ marginTop: 6, opacity: 0.75, fontSize: 12 }}>
                Last study: {loading ? "…" : fmtTime(continueRow?.last_study_at)}
              </div>
            </div>

            <button
              disabled={loading || !continueRow?.room_id}
              onClick={() => nav(continueRow?.room_id ? `/room/${continueRow.room_id}` : "/tiers")}
              style={{
                padding: "10px 14px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(0,0,0,0.25)",
                color: "inherit",
                fontWeight: 700,
                cursor: loading ? "default" : "pointer",
                minWidth: 180,
              }}
            >
              {continueRow?.room_id ? "Continue this room" : "Explore rooms"}
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.8 }}>
              <span>Progress</span>
              <span>{clamp(Number(continueRow?.progress_pct ?? 0), 0, 100)}%</span>
            </div>
            <div style={{ marginTop: 6, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${clamp(Number(continueRow?.progress_pct ?? 0), 0, 100)}%`,
                  background: "linear-gradient(90deg, rgba(255,80,160,0.9), rgba(120,90,255,0.9), rgba(0,200,255,0.9))",
                }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
              Repeat count: {Number(continueRow?.repeat_count ?? 0)}
            </div>
          </div>
        </div>

        {/* Week */}
        <div style={{ borderRadius: 18, padding: 14, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 800 }}>This week</div>
          <div style={{ marginTop: 10, fontSize: 26, fontWeight: 900 }}>{loading ? "…" : fmtMinutes(minutes7d)}</div>
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>Total study time (last 7 days)</div>
        </div>

        {/* Month */}
        <div style={{ borderRadius: 18, padding: 14, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 800 }}>This month</div>
          <div style={{ marginTop: 10, fontSize: 26, fontWeight: 900 }}>{loading ? "…" : fmtMinutes(minutes30d)}</div>
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>Total study time (last 30 days)</div>
        </div>
      </div>

      {/* List */}
      <div style={{ marginTop: 14, borderRadius: 18, border: "1px solid rgba(255,255,255,0.14)", overflow: "hidden" }}>
        <div style={{ padding: 12, background: "rgba(255,255,255,0.03)", fontWeight: 800 }}>Your recent rooms</div>

        {loading ? (
          <div style={{ padding: 12, opacity: 0.75 }}>Loading…</div>
        ) : listRows.length === 0 ? (
          <div style={{ padding: 12, opacity: 0.75 }}>No progress yet.</div>
        ) : (
          listRows.map((r) => (
            <button
              key={`${r.room_id}-${r.entry_id ?? ""}-${r.keyword_en ?? ""}`}
              onClick={() => r.room_id && nav(`/room/${r.room_id}`)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: 12,
                border: "none",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <div style={{ fontWeight: 750 }}>{r.room_id}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{fmtTime(r.last_study_at)}</div>
              </div>
              <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, opacity: 0.8 }}>
                <span>Progress {clamp(Number(r.progress_pct ?? 0), 0, 100)}%</span>
                <span>Repeats {Number(r.repeat_count ?? 0)}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
