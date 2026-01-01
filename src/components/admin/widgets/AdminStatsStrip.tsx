// src/components/admin/widgets/AdminStatsStrip.tsx
// MB-BLUE-101.6 — 2026-01-01 (+0700)
//
// ADMIN LIVE SNAPSHOT STRIP (READ-ONLY, MULTI-APP READY):
// - Quick operational numbers (safe SELECTs only).
// - Resilient: missing table/column → shows "—" not a crash.
// - Multi-app: accepts appId prop (from page context).
//
// Metrics (best-effort):
// - Active sessions (last 15m) from public.user_sessions.last_activity
// - Total users from public.profiles
// - Feedback last 24h from public.user_feedback.created_at
// - Tier breakdown from public.profiles.tier (computed client-side)

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Snapshot = {
  active15m: number | null;
  usersTotal: number | null;
  feedback24h: number | null;
  tiers: Record<string, number> | null;
  err?: string | null;
};

function fmt(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return String(n);
}

export default function AdminStatsStrip({
  appId = "mercy_blade",
}: {
  appId?: string;
}) {
  const [snap, setSnap] = useState<Snapshot>({
    active15m: null,
    usersTotal: null,
    feedback24h: null,
    tiers: null,
    err: null,
  });

  const since15mIso = useMemo(() => {
    const d = new Date(Date.now() - 15 * 60 * 1000);
    return d.toISOString();
  }, []);

  const since24hIso = useMemo(() => {
    const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return d.toISOString();
  }, []);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        // Active sessions (last 15m)
        const activeQ = await supabase
          .from("user_sessions")
          .select("id", { count: "exact", head: true })
          .eq("app_id", appId)
          .gte("last_activity", since15mIso);

        // Total users
        const usersQ = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("app_id", appId);

        // Feedback last 24h
        const feedbackQ = await supabase
          .from("user_feedback")
          .select("id", { count: "exact", head: true })
          .eq("app_id", appId)
          .gte("created_at", since24hIso);

        // Tier breakdown (client-side)
        const tiersMap: Record<string, number> = {};
        const tiersQ = await supabase
          .from("profiles")
          .select("tier")
          .eq("app_id", appId)
          .limit(5000);

        if (!tiersQ.error && Array.isArray(tiersQ.data)) {
          for (const row of tiersQ.data as any[]) {
            const t = (row?.tier || "unknown") as string;
            tiersMap[t] = (tiersMap[t] || 0) + 1;
          }
        }

        if (!alive) return;

        const softErr =
          activeQ.error?.message ||
          usersQ.error?.message ||
          feedbackQ.error?.message ||
          tiersQ.error?.message ||
          null;

        setSnap({
          active15m: activeQ.error ? null : (activeQ.count ?? 0),
          usersTotal: usersQ.error ? null : (usersQ.count ?? 0),
          feedback24h: feedbackQ.error ? null : (feedbackQ.count ?? 0),
          tiers: Object.keys(tiersMap).length ? tiersMap : null,
          err: softErr,
        });
      } catch (e: any) {
        if (!alive) return;
        setSnap((s) => ({ ...s, err: e?.message || "Unknown error" }));
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [appId, since15mIso, since24hIso]);

  const wrap: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 12,
    marginBottom: 14,
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    padding: 14,
    background: "white",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(0,0,0,0.55)",
    textTransform: "uppercase",
  };

  const value: React.CSSProperties = {
    marginTop: 6,
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: -0.6,
  };

  const hint: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 800,
    color: "rgba(0,0,0,0.55)",
    lineHeight: 1.5,
  };

  const tierText = snap.tiers
    ? Object.entries(snap.tiers)
        .sort((a, b) => b[1] - a[1])
        .map(([t, c]) => `${t}:${c}`)
        .join(" • ")
    : "—";

  return (
    <div>
      <div style={wrap}>
        <div style={{ ...card, gridColumn: "span 3" }}>
          <div style={label}>Active sessions (15m)</div>
          <div style={value}>{fmt(snap.active15m)}</div>
          <div style={hint}>From user_sessions.last_activity</div>
        </div>

        <div style={{ ...card, gridColumn: "span 3" }}>
          <div style={label}>Users (total)</div>
          <div style={value}>{fmt(snap.usersTotal)}</div>
          <div style={hint}>From profiles (app_id={appId})</div>
        </div>

        <div style={{ ...card, gridColumn: "span 3" }}>
          <div style={label}>Feedback (24h)</div>
          <div style={value}>{fmt(snap.feedback24h)}</div>
          <div style={hint}>From user_feedback.created_at</div>
        </div>

        <div style={{ ...card, gridColumn: "span 3" }}>
          <div style={label}>Tiers</div>
          <div style={{ ...value, fontSize: 16, letterSpacing: -0.2, lineHeight: 1.25 }}>
            {tierText}
          </div>
          <div style={hint}>Computed (profiles.tier)</div>
        </div>
      </div>

      {snap.err ? (
        <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(0,0,0,0.55)", marginBottom: 10 }}>
          Snapshot note: {snap.err}
        </div>
      ) : null}
    </div>
  );
}

/* New thing to learn:
   A dashboard is a *query contract*.
   Multi-app means the contract is always: WHERE app_id = current_context. */
