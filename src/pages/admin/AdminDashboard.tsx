// src/pages/admin/AdminDashboard.tsx
/**
 * MercyBlade Blue Launch Map — v83.3 (AUTHORITATIVE)
 * Generated: 2025-12-22 (+0700)
 * Reporter: teacher GPT
 *
 * PURPOSE:
 * Minimal Admin Dashboard (necessary only).
 * Shows KPI cards sourced from Edge Function `admin-stats`.
 * No Lovable bloat. No fake metrics. No extra panels.
 */

import { useMemo } from "react";
import { RefreshCw, Users, Home, DollarSign, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAdminStats } from "@/hooks/admin/useAdminStats";

function formatMoneyUSD(n: number): string {
  // Keep predictable formatting; avoid locale surprises.
  const safe = Number.isFinite(n) ? n : 0;
  return `$${safe.toFixed(2)}`;
}

export default function AdminDashboard() {
  const { loading, error, stats, lastUpdatedAt, refresh } = useAdminStats();

  const cards = useMemo(() => {
    const totalUsers = stats?.totalUsers ?? 0;
    const activeToday = stats?.activeToday ?? 0;
    const totalRooms = stats?.totalRooms ?? 0;
    const revenueMonth = stats?.revenueMonth ?? 0;

    return [
      {
        key: "totalUsers",
        title: "Total Users",
        value: String(totalUsers),
        icon: Users,
        hint: "profiles (count)",
      },
      {
        key: "activeToday",
        title: "Active Today",
        value: String(activeToday),
        icon: Activity,
        hint: "MVP: may be 0 until tracked",
      },
      {
        key: "totalRooms",
        title: "Total Rooms",
        value: String(totalRooms),
        icon: Home,
        hint: "rooms (is_active=true)",
      },
      {
        key: "revenueMonth",
        title: "Revenue (Month)",
        value: formatMoneyUSD(revenueMonth),
        icon: DollarSign,
        hint: "payment_transactions (completed)",
      },
    ] as const;
  }, [stats]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-foreground truncate">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Source: Edge Function <span className="font-mono">admin-stats</span>
            {lastUpdatedAt ? (
              <>
                {" "}
                • Last updated: <span className="font-mono">{new Date(lastUpdatedAt).toLocaleString()}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refresh()}
            disabled={loading}
            className="gap-2"
            title="Refresh stats"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-sm text-destructive">Admin stats error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground whitespace-pre-wrap">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              If this is 401/403: you are not logged in, or you are not an admin (has_role).
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.key} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-semibold">{c.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading && !stats ? "…" : c.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.hint}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Notes (truth)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-foreground">
            This dashboard is intentionally minimal. It exists to reduce operational risk, not to look “advanced”.
          </p>
          <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
            <li>Active Today may stay 0 until sign-in/session tracking exists.</li>
            <li>Revenue uses completed transactions only; keep idempotency in payment pipeline.</li>
            <li>If numbers look wrong, trust DB tables first; UI is just an opinion.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
