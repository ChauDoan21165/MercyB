/**
 * Compact "today's spend" tile for the admin home page. Same source data
 * as /admin/cost-monitoring but pulls a 1-day window so the dashboard
 * stays cheap to render.
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import {
  DEFAULT_USD_VND_RATE,
  getTotalDailyCost,
  type DailyCostPoint,
} from "@/lib/admin/costMonitoring";

const card: React.CSSProperties = {
  background: "white",
  border: "1px solid rgba(0,0,0,0.06)",
  borderRadius: 12,
  padding: 16,
  textDecoration: "none",
  color: "inherit",
  display: "block",
};
const label: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(0,0,0,0.55)",
  marginBottom: 6,
};
const value: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  color: "#0f172a",
};

function fmtVnd(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toLocaleString("vi-VN")} ₫`;
}

export default function CostSummaryWidget(): React.ReactElement {
  const [today, setToday] = useState<DailyCostPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { daily } = await getTotalDailyCost(supabase as any, 1, {
          usdVndRate: DEFAULT_USD_VND_RATE,
          topN: 0,
        });
        if (!cancelled) setToday(daily[daily.length - 1] ?? null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link to="/admin/cost-monitoring" style={card}>
      <div style={label}>Chi phí hôm nay / Today's spend</div>
      <div style={value}>
        {loading ? "…" : error ? "—" : fmtVnd(today?.vnd_cost ?? 0)}
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
        Click for full cost monitoring →
      </div>
    </Link>
  );
}
