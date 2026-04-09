// PATH: src/pages/admin/AdminUsersPage.tsx
//
// Admin users + subscription analytics dashboard
// - Production-focused subscription overview
// - Counts + charts + filters
// - Includes free-user estimate from profiles
// - Includes simple SaaS KPIs:
//   * active / trialing / free
//   * monthly / yearly
//   * cancel at period end
//   * estimated MRR / ARR
//   * simple conversion and churn-risk view
// - Export CSV
//
// Notes:
// - Assumes public.profiles contains: user_id, email, is_admin, admin_level
// - Assumes public.subscriptions contains the billing fields already verified in SQL
// - Safe for browser use under existing AdminRoute, but your DB policies must still restrict reads to admins

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

type ProfileRow = {
  user_id: string;
  email: string | null;
  is_admin: boolean | null;
  admin_level: number | null;
};

type SubscriptionRow = {
  id: string;
  user_id: string;
  status: string | null;
  environment: string | null;
  billing_interval: string | null;
  billing_interval_count: number | null;
  currency_code: string | null;
  quantity: number | null;
  created_at: string | null;
  current_period_end: string | null;
  current_period_end_at: string | null;
  cancel_at_period_end: boolean | null;
  raw_payload: unknown;
};

type DashboardRow = {
  subscriptionId: string;
  userId: string;
  email: string;
  status: string;
  environment: string;
  planInterval: string;
  currencyCode: string;
  amountCents: number;
  quantity: number;
  createdAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isAdmin: boolean;
  adminLevel: number;
};

type FreeUserRow = {
  userId: string;
  email: string;
  isAdmin: boolean;
  adminLevel: number;
};

type KpiCardProps = {
  label: string;
  value: string | number;
  help?: string;
};

const PAGE_MAX = 1240;

function safeText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function norm(value: unknown, fallback = "unknown"): string {
  const v = safeText(value).toLowerCase();
  return v || fallback;
}

function fmtDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function titleCase(value: string): string {
  if (!value) return "Unknown";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function formatMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${Math.round(amount)}`;
  }
}

function monthKey(value: string | null): string {
  if (!value) return "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
  });
}

function readPlanInterval(
  billingInterval: string | null,
  rawPayload: unknown,
): string {
  const direct = norm(billingInterval, "");
  if (direct) return direct;

  const payload =
    rawPayload && typeof rawPayload === "object"
      ? (rawPayload as Record<string, unknown>)
      : null;

  const plan =
    payload?.plan && typeof payload.plan === "object"
      ? (payload.plan as Record<string, unknown>)
      : null;

  const planInterval = norm(plan?.interval, "");
  if (planInterval) return planInterval;

  const items =
    payload?.items && typeof payload.items === "object"
      ? (payload.items as Record<string, unknown>)
      : null;

  const data = Array.isArray(items?.data) ? items?.data : [];
  const first = data[0];
  const firstObj =
    first && typeof first === "object" ? (first as Record<string, unknown>) : null;

  const price =
    firstObj?.price && typeof firstObj.price === "object"
      ? (firstObj.price as Record<string, unknown>)
      : null;

  const recurring =
    price?.recurring && typeof price.recurring === "object"
      ? (price.recurring as Record<string, unknown>)
      : null;

  const recurringInterval = norm(recurring?.interval, "");
  if (recurringInterval) return recurringInterval;

  return "unknown";
}

function readCurrency(
  currencyCode: string | null,
  rawPayload: unknown,
): string {
  const direct = norm(currencyCode, "");
  if (direct) return direct.toUpperCase();

  const payload =
    rawPayload && typeof rawPayload === "object"
      ? (rawPayload as Record<string, unknown>)
      : null;

  const payloadCurrency = safeText(payload?.currency, "").toUpperCase();
  if (payloadCurrency) return payloadCurrency;

  const plan =
    payload?.plan && typeof payload.plan === "object"
      ? (payload.plan as Record<string, unknown>)
      : null;

  const planCurrency = safeText(plan?.currency, "").toUpperCase();
  if (planCurrency) return planCurrency;

  return "USD";
}

function readAmountCents(rawPayload: unknown): number {
  const payload =
    rawPayload && typeof rawPayload === "object"
      ? (rawPayload as Record<string, unknown>)
      : null;

  const plan =
    payload?.plan && typeof payload.plan === "object"
      ? (payload.plan as Record<string, unknown>)
      : null;

  const directPlanAmount = safeNumber(plan?.amount, 0);
  if (directPlanAmount > 0) return directPlanAmount;

  const items =
    payload?.items && typeof payload.items === "object"
      ? (payload.items as Record<string, unknown>)
      : null;

  const data = Array.isArray(items?.data) ? items?.data : [];
  const first = data[0];
  const firstObj =
    first && typeof first === "object" ? (first as Record<string, unknown>) : null;

  const price =
    firstObj?.price && typeof firstObj.price === "object"
      ? (price = firstObj.price as Record<string, unknown>)
      : null;

  const unitAmount = safeNumber(price?.unit_amount, 0);
  if (unitAmount > 0) return unitAmount;

  return 0;
}

function sumBy<T extends { value: number }>(items: T[]): number {
  return items.reduce((acc, item) => acc + item.value, 0);
}

function csvEscape(value: unknown): string {
  const text = safeText(value, "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function KpiCard({ label, value, help }: KpiCardProps) {
  const card: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.90)",
    padding: "16px 16px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.45)",
  };

  const valueStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 30,
    lineHeight: 1.05,
    fontWeight: 950,
    color: "rgba(0,0,0,0.88)",
    letterSpacing: -0.7,
  };

  const helpStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.5,
    color: "rgba(0,0,0,0.60)",
  };

  return (
    <div style={card}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value}</div>
      {help ? <div style={helpStyle}>{help}</div> : null}
    </div>
  );
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [freeUsers, setFreeUsers] = useState<FreeUserRow[]>([]);

  const [search, setSearch] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState("production");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");

  useEffect(() => {
    let alive = true;

    void (async () => {
      try {
        setLoading(true);
        setErr(null);

        const [{ data: profileData, error: profileError }, { data: subData, error: subError }] =
          await Promise.all([
            supabase
              .from("profiles")
              .select("user_id, email, is_admin, admin_level")
              .order("email", { ascending: true }),
            supabase
              .from("subscriptions")
              .select(
                "id, user_id, status, environment, billing_interval, billing_interval_count, currency_code, quantity, created_at, current_period_end, current_period_end_at, cancel_at_period_end, raw_payload",
              )
              .order("created_at", { ascending: false }),
          ]);

        if (!alive) return;

        if (profileError) throw profileError;
        if (subError) throw subError;

        const profiles = Array.isArray(profileData)
          ? (profileData as ProfileRow[])
          : [];
        const subscriptions = Array.isArray(subData)
          ? (subData as SubscriptionRow[])
          : [];

        const profileMap = new Map<string, ProfileRow>();
        for (const profile of profiles) {
          if (profile?.user_id) {
            profileMap.set(profile.user_id, profile);
          }
        }

        const merged: DashboardRow[] = subscriptions.map((sub) => {
          const profile = profileMap.get(sub.user_id);

          const email = safeText(profile?.email, "unknown");
          const status = norm(sub.status, "unknown");
          const environment = norm(sub.environment, "unknown");
          const planInterval = readPlanInterval(sub.billing_interval, sub.raw_payload);
          const amountCents = readAmountCents(sub.raw_payload);
          const currencyCode = readCurrency(sub.currency_code, sub.raw_payload);

          return {
            subscriptionId: sub.id,
            userId: sub.user_id,
            email,
            status,
            environment,
            planInterval,
            currencyCode,
            amountCents,
            quantity: Math.max(1, safeNumber(sub.quantity, 1)),
            createdAt: sub.created_at,
            currentPeriodEnd: sub.current_period_end_at ?? sub.current_period_end,
            cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
            isAdmin:
              Boolean(profile?.is_admin) ||
              Number(profile?.admin_level ?? 0) >= 1,
            adminLevel: Number(profile?.admin_level ?? 0) || 0,
          };
        });

        const activeProductionUserIds = new Set(
          merged
            .filter((row) => row.environment === "production" && row.status === "active")
            .map((row) => row.userId),
        );

        const freeRows: FreeUserRow[] = profiles
          .filter((profile) => profile.user_id && !activeProductionUserIds.has(profile.user_id))
          .map((profile) => ({
            userId: profile.user_id,
            email: safeText(profile.email, "unknown"),
            isAdmin:
              Boolean(profile.is_admin) ||
              Number(profile.admin_level ?? 0) >= 1,
            adminLevel: Number(profile.admin_level ?? 0) || 0,
          }));

        setRows(merged);
        setFreeUsers(freeRows);
      } catch (e: unknown) {
        if (!alive) return;
        setErr(e instanceof Error ? e.message : String(e));
        setRows([]);
        setFreeUsers([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const environmentOptions = useMemo(() => {
    const set = new Set<string>(["all"]);
    rows.forEach((r) => set.add(r.environment));
    return Array.from(set);
  }, [rows]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>(["all"]);
    rows.forEach((r) => set.add(r.status));
    return Array.from(set);
  }, [rows]);

  const planOptions = useMemo(() => {
    const set = new Set<string>(["all"]);
    rows.forEach((r) => set.add(r.planInterval));
    return Array.from(set);
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base = rows.filter((row) => {
      if (environmentFilter !== "all" && row.environment !== environmentFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (planFilter !== "all" && row.planInterval !== planFilter) return false;

      if (adminFilter === "admin" && !row.isAdmin) return false;
      if (adminFilter === "non_admin" && row.isAdmin) return false;

      if (!q) return true;

      return (
        row.email.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q) ||
        row.planInterval.toLowerCase().includes(q) ||
        row.environment.toLowerCase().includes(q) ||
        row.userId.toLowerCase().includes(q)
      );
    });

    const sorted = [...base];

    sorted.sort((a, b) => {
      switch (sortBy) {
        case "email_asc":
          return a.email.localeCompare(b.email);
        case "email_desc":
          return b.email.localeCompare(a.email);
        case "plan_asc":
          return a.planInterval.localeCompare(b.planInterval);
        case "status_asc":
          return a.status.localeCompare(b.status);
        case "period_desc":
          return new Date(b.currentPeriodEnd ?? 0).getTime() - new Date(a.currentPeriodEnd ?? 0).getTime();
        case "amount_desc":
          return b.amountCents - a.amountCents;
        case "created_asc":
          return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
        case "created_desc":
        default:
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
      }
    });

    return sorted;
  }, [rows, search, environmentFilter, statusFilter, planFilter, adminFilter, sortBy]);

  const productionRows = useMemo(
    () => rows.filter((r) => r.environment === "production"),
    [rows],
  );

  const productionActiveRows = useMemo(
    () => productionRows.filter((r) => r.status === "active"),
    [productionRows],
  );

  const productionTrialRows = useMemo(
    () => productionRows.filter((r) => r.status === "trialing"),
    [productionRows],
  );

  const monthlyActiveRows = useMemo(
    () => productionActiveRows.filter((r) => r.planInterval === "month"),
    [productionActiveRows],
  );

  const yearlyActiveRows = useMemo(
    () => productionActiveRows.filter((r) => r.planInterval === "year"),
    [productionActiveRows],
  );

  const cancelingSoonRows = useMemo(
    () => productionActiveRows.filter((r) => r.cancelAtPeriodEnd),
    [productionActiveRows],
  );

  const productionActiveCount = productionActiveRows.length;
  const productionTrialCount = productionTrialRows.length;
  const monthlyCount = monthlyActiveRows.length;
  const yearlyCount = yearlyActiveRows.length;
  const sandboxCount = rows.filter((r) => r.environment === "sandbox").length;
  const cancelingSoonCount = cancelingSoonRows.length;
  const freeUsersCount = freeUsers.filter((u) => !u.isAdmin).length;

  const estimatedMrr = useMemo(() => {
    let total = 0;

    for (const row of monthlyActiveRows) {
      total += (row.amountCents * row.quantity) / 100;
    }

    for (const row of yearlyActiveRows) {
      total += ((row.amountCents * row.quantity) / 100) / 12;
    }

    return total;
  }, [monthlyActiveRows, yearlyActiveRows]);

  const estimatedArr = estimatedMrr * 12;

  const simpleConversionPct = useMemo(() => {
    const denom = productionActiveCount + productionTrialCount;
    if (denom <= 0) return 0;
    return (productionActiveCount / denom) * 100;
  }, [productionActiveCount, productionTrialCount]);

  const churnRiskPct = useMemo(() => {
    if (productionActiveCount <= 0) return 0;
    return (cancelingSoonCount / productionActiveCount) * 100;
  }, [cancelingSoonCount, productionActiveCount]);

  const statusChartData = useMemo(() => {
    const map = new Map<string, number>();
    filteredRows.forEach((row) => {
      map.set(row.status, (map.get(row.status) ?? 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name: titleCase(name),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRows]);

  const planChartData = useMemo(() => {
    const map = new Map<string, number>();
    filteredRows.forEach((row) => {
      map.set(row.planInterval, (map.get(row.planInterval) ?? 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name: titleCase(name),
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRows]);

  const growthChartData = useMemo(() => {
    const map = new Map<string, number>();

    productionActiveRows.forEach((row) => {
      const key = monthKey(row.createdAt);
      map.set(key, (map.get(key) ?? 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => {
        const da = new Date(`${a.name} 01`).getTime();
        const db = new Date(`${b.name} 01`).getTime();
        return da - db;
      });
  }, [productionActiveRows]);

  const filteredTotals = useMemo(
    () => ({
      rows: filteredRows.length,
      active: filteredRows.filter((r) => r.status === "active").length,
      trialing: filteredRows.filter((r) => r.status === "trialing").length,
      admins: filteredRows.filter((r) => r.isAdmin).length,
    }),
    [filteredRows],
  );

  const exportCsv = () => {
    const header = [
      "email",
      "status",
      "plan_interval",
      "environment",
      "amount_cents",
      "currency_code",
      "cancel_at_period_end",
      "current_period_end",
      "created_at",
      "is_admin",
      "admin_level",
      "user_id",
      "subscription_id",
    ];

    const lines = filteredRows.map((row) =>
      [
        csvEscape(row.email),
        csvEscape(row.status),
        csvEscape(row.planInterval),
        csvEscape(row.environment),
        csvEscape(row.amountCents),
        csvEscape(row.currencyCode),
        csvEscape(row.cancelAtPeriodEnd),
        csvEscape(row.currentPeriodEnd ?? ""),
        csvEscape(row.createdAt ?? ""),
        csvEscape(row.isAdmin),
        csvEscape(row.adminLevel),
        csvEscape(row.userId),
        csvEscape(row.subscriptionId),
      ].join(","),
    );

    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-users-dashboard.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #FAFBFC 0%, #F7F8FA 100%)",
  };

  const frame: React.CSSProperties = {
    maxWidth: PAGE_MAX,
    margin: "0 auto",
    padding: "24px 18px 40px",
  };

  const headerCard: React.CSSProperties = {
    borderRadius: 24,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,249,252,0.94))",
    padding: "22px 20px",
    boxShadow: "0 14px 34px rgba(0,0,0,0.05)",
  };

  const eyebrow: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.45)",
  };

  const title: React.CSSProperties = {
    margin: "8px 0 0",
    fontSize: 38,
    lineHeight: 1.05,
    fontWeight: 950,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -1.0,
  };

  const sub: React.CSSProperties = {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 1.65,
    color: "rgba(0,0,0,0.64)",
    maxWidth: 860,
  };

  const topActions: React.CSSProperties = {
    marginTop: 14,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  };

  const pillBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    color: "rgba(0,0,0,0.78)",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
  };

  const kpiGrid: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  };

  const filtersCard: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.92)",
    padding: "16px 16px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  };

  const filtersGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "2fr repeat(5, minmax(130px, 1fr))",
    gap: 10,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.5,
    color: "rgba(0,0,0,0.45)",
    marginBottom: 6,
    textTransform: "uppercase",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.96)",
    padding: "12px 12px",
    fontSize: 14,
    color: "rgba(0,0,0,0.82)",
    outline: "none",
  };

  const chartGrid: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 14,
  };

  const chartCard: React.CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.94)",
    padding: "16px 16px 12px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
    minHeight: 340,
  };

  const chartTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 20,
    lineHeight: 1.1,
    fontWeight: 900,
    color: "rgba(0,0,0,0.86)",
    letterSpacing: -0.35,
  };

  const chartHelp: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 13,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.58)",
  };

  const tableCard: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.94)",
    padding: "16px 16px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  };

  const tableWrap: React.CSSProperties = {
    marginTop: 14,
    overflowX: "auto",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "white",
  };

  const table: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 1100,
  };

  const th: React.CSSProperties = {
    padding: "12px 12px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.48)",
    background: "rgba(247,249,252,0.95)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    whiteSpace: "nowrap",
  };

  const td: React.CSSProperties = {
    padding: "12px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    fontSize: 14,
    color: "rgba(0,0,0,0.82)",
    verticalAlign: "top",
  };

  const clickEmail: React.CSSProperties = {
    cursor: "copy",
    fontWeight: 800,
  };

  const badge = (
    kind: "active" | "trialing" | "month" | "year" | "admin" | "plain",
  ): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      borderRadius: 9999,
      padding: "6px 10px",
      fontSize: 12,
      fontWeight: 900,
      border: "1px solid rgba(0,0,0,0.10)",
      whiteSpace: "nowrap",
    };

    switch (kind) {
      case "active":
        return {
          ...base,
          background: "rgba(236,253,245,0.95)",
          color: "rgba(6,95,70,0.94)",
          border: "1px solid rgba(16,185,129,0.20)",
        };
      case "trialing":
        return {
          ...base,
          background: "rgba(239,246,255,0.96)",
          color: "rgba(30,64,175,0.92)",
          border: "1px solid rgba(59,130,246,0.20)",
        };
      case "month":
        return {
          ...base,
          background: "rgba(245,243,255,0.96)",
          color: "rgba(91,33,182,0.92)",
          border: "1px solid rgba(139,92,246,0.20)",
        };
      case "year":
        return {
          ...base,
          background: "rgba(255,247,237,0.96)",
          color: "rgba(154,52,18,0.92)",
          border: "1px solid rgba(249,115,22,0.20)",
        };
      case "admin":
        return {
          ...base,
          background: "rgba(255,250,235,0.96)",
          color: "rgba(146,64,14,0.94)",
          border: "1px solid rgba(245,158,11,0.20)",
        };
      default:
        return {
          ...base,
          background: "rgba(248,250,252,0.96)",
          color: "rgba(51,65,85,0.90)",
        };
    }
  };

  return (
    <div style={wrap}>
      <div style={frame}>
        <div style={headerCard}>
          <div style={eyebrow}>Admin / Users</div>
          <h1 style={title}>Users & subscriptions dashboard</h1>
          <div style={sub}>
            Production-focused SaaS view of your members, billing state, estimated recurring
            revenue, churn-risk signals, and a filterable audit list. This gives you a much
            more useful owner dashboard than a plain table.
          </div>

          <div style={topActions}>
            <Link to="/admin" style={pillBtn}>
              ← Back to Admin
            </Link>
            <Link to="/admin/subscriptions" style={pillBtn}>
              Billing page
            </Link>
            <button type="button" style={pillBtn} onClick={exportCsv}>
              ⭳ Export CSV
            </button>
          </div>
        </div>

        <div style={kpiGrid}>
          <KpiCard
            label="Production active"
            value={productionActiveCount}
            help="Real active paid production subscriptions."
          />
          <KpiCard
            label="Production trialing"
            value={productionTrialCount}
            help="Trials not yet converted."
          />
          <KpiCard
            label="Free users"
            value={freeUsersCount}
            help="Profiles without an active production subscription."
          />
          <KpiCard
            label="Monthly"
            value={monthlyCount}
            help="Production active subscriptions billed monthly."
          />
          <KpiCard
            label="Yearly"
            value={yearlyCount}
            help="Production active subscriptions billed yearly."
          />
          <KpiCard
            label="Canceling soon"
            value={cancelingSoonCount}
            help="Active production users with cancel_at_period_end."
          />
          <KpiCard
            label="Estimated MRR"
            value={formatMoney(estimatedMrr)}
            help="Yearly plans normalized to monthly."
          />
          <KpiCard
            label="Estimated ARR"
            value={formatMoney(estimatedArr)}
            help="Simple annualized recurring revenue."
          />
          <KpiCard
            label="Conversion"
            value={`${simpleConversionPct.toFixed(0)}%`}
            help="Active ÷ (active + trialing)."
          />
          <KpiCard
            label="Churn risk"
            value={`${churnRiskPct.toFixed(0)}%`}
            help="Canceling soon ÷ active."
          />
          <KpiCard
            label="Sandbox rows"
            value={sandboxCount}
            help="Test billing rows still in subscriptions."
          />
          <KpiCard
            label="Filtered rows"
            value={filteredTotals.rows}
            help="Current result set after filters."
          />
        </div>

        <div style={filtersCard}>
          <div style={filtersGrid}>
            <div>
              <div style={labelStyle}>Search</div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email, plan, status, user id…"
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>Environment</div>
              <select
                value={environmentFilter}
                onChange={(e) => setEnvironmentFilter(e.target.value)}
                style={inputStyle}
              >
                {environmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {titleCase(option)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={labelStyle}>Status</div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={inputStyle}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {titleCase(option)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={labelStyle}>Plan</div>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                style={inputStyle}
              >
                {planOptions.map((option) => (
                  <option key={option} value={option}>
                    {titleCase(option)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={labelStyle}>Admin</div>
              <select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
                style={inputStyle}
              >
                <option value="all">All</option>
                <option value="admin">Admins only</option>
                <option value="non_admin">Non-admins</option>
              </select>
            </div>

            <div>
              <div style={labelStyle}>Sort</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={inputStyle}
              >
                <option value="created_desc">Newest first</option>
                <option value="created_asc">Oldest first</option>
                <option value="email_asc">Email A → Z</option>
                <option value="email_desc">Email Z → A</option>
                <option value="plan_asc">Plan</option>
                <option value="status_asc">Status</option>
                <option value="period_desc">Period end</option>
                <option value="amount_desc">Highest amount</option>
              </select>
            </div>
          </div>
        </div>

        <div style={chartGrid}>
          <div style={chartCard}>
            <h2 style={chartTitle}>Status breakdown</h2>
            <p style={chartHelp}>
              Current filtered set by subscription status.
            </p>

            <div style={{ width: "100%", height: 250, marginTop: 10 }}>
              <ResponsiveContainer>
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 8, fontSize: 13, color: "rgba(0,0,0,0.60)" }}>
              Total shown: {sumBy(statusChartData)}
            </div>
          </div>

          <div style={chartCard}>
            <h2 style={chartTitle}>Plan interval breakdown</h2>
            <p style={chartHelp}>
              Monthly, yearly, and any unknown interval values in the filtered set.
            </p>

            <div style={{ width: "100%", height: 250, marginTop: 10 }}>
              <ResponsiveContainer>
                <BarChart data={planChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 8, fontSize: 13, color: "rgba(0,0,0,0.60)" }}>
              Total shown: {sumBy(planChartData)}
            </div>
          </div>

          <div style={chartCard}>
            <h2 style={chartTitle}>New active subscriptions over time</h2>
            <p style={chartHelp}>
              Simple growth view based on production active subscription created dates.
            </p>

            <div style={{ width: "100%", height: 250, marginTop: 10 }}>
              <ResponsiveContainer>
                <LineChart data={growthChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 8, fontSize: 13, color: "rgba(0,0,0,0.60)" }}>
              Active production rows charted: {productionActiveCount}
            </div>
          </div>
        </div>

        <div style={tableCard}>
          <h2 style={chartTitle}>Members list</h2>
          <p style={chartHelp}>
            Filterable row view for support, billing audits, and quick manual checks. Click an
            email to copy it.
          </p>

          {loading ? (
            <div style={{ marginTop: 14, fontSize: 14, color: "rgba(0,0,0,0.60)" }}>
              Loading users dashboard…
            </div>
          ) : err ? (
            <div
              style={{
                marginTop: 14,
                borderRadius: 14,
                border: "1px solid rgba(220,38,38,0.20)",
                background: "rgba(254,242,242,0.90)",
                padding: "12px 14px",
                color: "rgba(127,29,29,0.92)",
                fontWeight: 700,
              }}
            >
              Failed to load admin users dashboard: {err}
            </div>
          ) : (
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Email</th>
                    <th style={th}>Status</th>
                    <th style={th}>Plan</th>
                    <th style={th}>Amount</th>
                    <th style={th}>Environment</th>
                    <th style={th}>Period end</th>
                    <th style={th}>Created</th>
                    <th style={th}>Flags</th>
                    <th style={th}>User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td style={td} colSpan={9}>
                        No rows match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr
                        key={row.subscriptionId}
                        style={{
                          background:
                            row.environment === "production"
                              ? "white"
                              : "rgba(248,250,252,0.72)",
                        }}
                      >
                        <td style={td}>
                          <div
                            style={clickEmail}
                            title="Click to copy email"
                            onClick={() => {
                              if (row.email && row.email !== "unknown") {
                                void navigator.clipboard.writeText(row.email);
                              }
                            }}
                          >
                            {row.email || "unknown"}
                          </div>
                        </td>
                        <td style={td}>
                          <span
                            style={badge(
                              row.status === "trialing"
                                ? "trialing"
                                : row.status === "active"
                                  ? "active"
                                  : "plain",
                            )}
                          >
                            {titleCase(row.status)}
                          </span>
                        </td>
                        <td style={td}>
                          <span
                            style={badge(
                              row.planInterval === "year"
                                ? "year"
                                : row.planInterval === "month"
                                  ? "month"
                                  : "plain",
                            )}
                          >
                            {titleCase(row.planInterval)}
                          </span>
                        </td>
                        <td style={td}>
                          {row.amountCents > 0
                            ? formatMoney((row.amountCents * row.quantity) / 100, row.currencyCode)
                            : "—"}
                        </td>
                        <td style={td}>{titleCase(row.environment)}</td>
                        <td style={td}>{fmtDate(row.currentPeriodEnd)}</td>
                        <td style={td}>{fmtDate(row.createdAt)}</td>
                        <td style={td}>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {row.cancelAtPeriodEnd ? (
                              <span style={badge("plain")}>Cancel at period end</span>
                            ) : null}
                            {row.isAdmin ? (
                              <span style={badge("admin")}>
                                Admin L{row.adminLevel}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td style={td}>
                          <code style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                            {row.userId}
                          </code>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}