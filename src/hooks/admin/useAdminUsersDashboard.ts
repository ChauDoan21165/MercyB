// PATH: src/hooks/admin/useAdminUsersDashboard.ts

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  AdminUsersChartPoint,
  AdminUsersFiltersState,
  AdminUsersKpis,
  AdminUsersRow,
  FreeUserRow,
} from "@/types/adminUsers";

type ProfileRow = {
  id?: string | null;
  user_id?: string | null;
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
  currency_code: string | null;
  quantity: number | null;
  created_at: string | null;
  current_period_end: string | null;
  current_period_end_at: string | null;
  cancel_at_period_end: boolean | null;
  raw_payload: unknown;
};

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

function monthKey(value: string | null): string {
  if (!value) return "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString("en-GB", { year: "numeric", month: "short" });
}

function readPlanInterval(billingInterval: string | null, rawPayload: unknown): string {
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

  const data = Array.isArray(items?.data) ? items.data : [];
  const first =
    data[0] && typeof data[0] === "object"
      ? (data[0] as Record<string, unknown>)
      : null;

  const price =
    first?.price && typeof first.price === "object"
      ? (first.price as Record<string, unknown>)
      : null;

  const recurring =
    price?.recurring && typeof price.recurring === "object"
      ? (price.recurring as Record<string, unknown>)
      : null;

  return norm(recurring?.interval, "unknown");
}

function readCurrency(currencyCode: string | null, rawPayload: unknown): string {
  const direct = norm(currencyCode, "");
  if (direct) return direct.toUpperCase();

  const payload =
    rawPayload && typeof rawPayload === "object"
      ? (rawPayload as Record<string, unknown>)
      : null;

  const payloadCurrency = safeText(payload?.currency, "").toUpperCase();
  if (payloadCurrency) return payloadCurrency;

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

  const data = Array.isArray(items?.data) ? items.data : [];
  const first =
    data[0] && typeof data[0] === "object"
      ? (data[0] as Record<string, unknown>)
      : null;

  const price =
    first?.price && typeof first.price === "object"
      ? (first.price as Record<string, unknown>)
      : null;

  const unitAmount = safeNumber(price?.unit_amount, 0);
  if (unitAmount > 0) return unitAmount;

  return 0;
}

function profileKey(profile: ProfileRow): string | null {
  return safeText(profile.user_id || profile.id || "", "") || null;
}

function buildAnomalyFlags(row: Omit<AdminUsersRow, "anomalyFlags">, hasProfile: boolean): string[] {
  const flags: string[] = [];

  if (!hasProfile) flags.push("missing_profile");
  if (!row.email || row.email === "unknown") flags.push("unknown_email");
  if (!row.planInterval || row.planInterval === "unknown") flags.push("unknown_plan");
  if (row.amountCents <= 0 && row.status === "active") flags.push("unknown_amount");
  if (row.cancelAtPeriodEnd) flags.push("canceling_soon");
  if (row.environment === "sandbox") flags.push("sandbox_row");

  return flags;
}

function csvEscape(value: unknown): string {
  const text = safeText(value, "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function useAdminUsersDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rows, setRows] = useState<AdminUsersRow[]>([]);
  const [freeUsers, setFreeUsers] = useState<FreeUserRow[]>([]);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);

  const [filters, setFilters] = useState<AdminUsersFiltersState>({
    search: "",
    environment: "production",
    status: "all",
    plan: "all",
    admin: "all",
    sort: "created_desc",
  });

  const [selectedRow, setSelectedRow] = useState<AdminUsersRow | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select(
          "id, user_id, status, environment, billing_interval, currency_code, quantity, created_at, current_period_end, current_period_end_at, cancel_at_period_end, raw_payload",
        )
        .order("created_at", { ascending: false });

      if (subError) throw subError;

      const subscriptions = Array.isArray(subData) ? (subData as SubscriptionRow[]) : [];
      const subscriptionUserIds = Array.from(
        new Set(subscriptions.map((s) => safeText(s.user_id, "")).filter(Boolean)),
      );

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, user_id, email, is_admin, admin_level")
        .or(
          subscriptionUserIds.length > 0
            ? `user_id.in.(${subscriptionUserIds.join(",")}),id.in.(${subscriptionUserIds.join(",")})`
            : "id.is.null",
        );

      if (profileError) throw profileError;

      const profiles = Array.isArray(profileData) ? (profileData as ProfileRow[]) : [];
      const profileMap = new Map<string, ProfileRow>();

      for (const profile of profiles) {
        const key = profileKey(profile);
        if (key) profileMap.set(key, profile);
      }

      const merged: AdminUsersRow[] = subscriptions.map((sub) => {
        const profile = profileMap.get(sub.user_id);

        const baseRow = {
          subscriptionId: sub.id,
          userId: sub.user_id,
          email: safeText(profile?.email, "unknown"),
          status: norm(sub.status, "unknown"),
          environment: norm(sub.environment, "unknown"),
          planInterval: readPlanInterval(sub.billing_interval, sub.raw_payload),
          currencyCode: readCurrency(sub.currency_code, sub.raw_payload),
          amountCents: readAmountCents(sub.raw_payload),
          quantity: Math.max(1, safeNumber(sub.quantity, 1)),
          createdAt: sub.created_at,
          currentPeriodEnd: sub.current_period_end_at ?? sub.current_period_end,
          cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
          isAdmin: Boolean(profile?.is_admin) || Number(profile?.admin_level ?? 0) >= 1,
          adminLevel: Number(profile?.admin_level ?? 0) || 0,
        };

        return {
          ...baseRow,
          anomalyFlags: buildAnomalyFlags(baseRow, Boolean(profile)),
        };
      });

      const activeProductionUserIds = new Set(
        merged
          .filter((row) => row.environment === "production" && row.status === "active")
          .map((row) => row.userId),
      );

      const freeRows: FreeUserRow[] = profiles
        .map((profile) => {
          const key = profileKey(profile);
          if (!key) return null;

          return {
            userId: key,
            email: safeText(profile.email, "unknown"),
            isAdmin: Boolean(profile.is_admin) || Number(profile.admin_level ?? 0) >= 1,
            adminLevel: Number(profile.admin_level ?? 0) || 0,
          };
        })
        .filter((row): row is FreeUserRow => Boolean(row))
        .filter((row) => !activeProductionUserIds.has(row.userId));

      setRows(merged);
      setFreeUsers(freeRows);
      setRefreshedAt(new Date().toISOString());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setRows([]);
      setFreeUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const filteredRows = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    const base = rows.filter((row) => {
      if (filters.environment !== "all" && row.environment !== filters.environment) return false;
      if (filters.status !== "all" && row.status !== filters.status) return false;
      if (filters.plan !== "all" && row.planInterval !== filters.plan) return false;
      if (filters.admin === "admin" && !row.isAdmin) return false;
      if (filters.admin === "non_admin" && row.isAdmin) return false;

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
      switch (filters.sort) {
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
  }, [rows, filters]);

  const productionRows = useMemo(() => rows.filter((r) => r.environment === "production"), [rows]);
  const productionActiveRows = useMemo(() => productionRows.filter((r) => r.status === "active"), [productionRows]);
  const productionTrialRows = useMemo(() => productionRows.filter((r) => r.status === "trialing"), [productionRows]);
  const monthlyActiveRows = useMemo(() => productionActiveRows.filter((r) => r.planInterval === "month"), [productionActiveRows]);
  const yearlyActiveRows = useMemo(() => productionActiveRows.filter((r) => r.planInterval === "year"), [productionActiveRows]);
  const cancelingSoonRows = useMemo(() => productionActiveRows.filter((r) => r.cancelAtPeriodEnd), [productionActiveRows]);

  const estimatedMrr = useMemo(() => {
    let total = 0;
    for (const row of monthlyActiveRows) total += (row.amountCents * row.quantity) / 100;
    for (const row of yearlyActiveRows) total += ((row.amountCents * row.quantity) / 100) / 12;
    return total;
  }, [monthlyActiveRows, yearlyActiveRows]);

  const estimatedArr = estimatedMrr * 12;
  const conversionPct =
    productionActiveRows.length + productionTrialRows.length > 0
      ? (productionActiveRows.length / (productionActiveRows.length + productionTrialRows.length)) * 100
      : 0;

  const churnRiskPct =
    productionActiveRows.length > 0
      ? (cancelingSoonRows.length / productionActiveRows.length) * 100
      : 0;

  const kpis: AdminUsersKpis = useMemo(
    () => ({
      productionActiveCount: productionActiveRows.length,
      productionTrialCount: productionTrialRows.length,
      freeUsersCount: freeUsers.filter((u) => !u.isAdmin).length,
      monthlyCount: monthlyActiveRows.length,
      yearlyCount: yearlyActiveRows.length,
      cancelingSoonCount: cancelingSoonRows.length,
      sandboxCount: rows.filter((r) => r.environment === "sandbox").length,
      filteredRows: filteredRows.length,
      estimatedMrr,
      estimatedArr,
      conversionPct,
      churnRiskPct,
      missingProfileCount: rows.filter((r) => r.anomalyFlags.includes("missing_profile")).length,
      unknownEmailCount: rows.filter((r) => r.anomalyFlags.includes("unknown_email")).length,
    }),
    [
      cancelingSoonRows.length,
      churnRiskPct,
      conversionPct,
      estimatedArr,
      estimatedMrr,
      filteredRows.length,
      freeUsers,
      monthlyActiveRows.length,
      productionActiveRows.length,
      productionTrialRows.length,
      rows,
      yearlyActiveRows.length,
    ],
  );

  const statusChartData: AdminUsersChartPoint[] = useMemo(() => {
    const map = new Map<string, number>();
    filteredRows.forEach((row) => map.set(row.status, (map.get(row.status) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRows]);

  const planChartData: AdminUsersChartPoint[] = useMemo(() => {
    const map = new Map<string, number>();
    filteredRows.forEach((row) => map.set(row.planInterval, (map.get(row.planInterval) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRows]);

  const growthChartData: AdminUsersChartPoint[] = useMemo(() => {
    const map = new Map<string, number>();
    productionActiveRows.forEach((row) => {
      const key = monthKey(row.createdAt);
      map.set(key, (map.get(key) ?? 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const da = new Date(`${a.name} 01`).getTime();
        const db = new Date(`${b.name} 01`).getTime();
        return da - db;
      });
  }, [productionActiveRows]);

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
      "anomaly_flags",
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
        csvEscape(row.anomalyFlags.join("|")),
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

  return {
    loading,
    error,
    rows,
    filteredRows,
    freeUsers,
    refreshedAt,
    filters,
    setFilters,
    selectedRow,
    setSelectedRow,
    refresh,
    exportCsv,
    kpis,
    statusChartData,
    planChartData,
    growthChartData,
  };
}