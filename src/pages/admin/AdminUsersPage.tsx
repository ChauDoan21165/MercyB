// PATH: src/pages/admin/AdminUsersPage.tsx
// File: AdminUsersPage.tsx
//
// Admin users dashboard
// - Uses DB view: public.admin_users_dashboard_v1
// - Uses KPI RPC: public.admin_users_dashboard_kpis_v1
// - No longer stitches profiles + subscriptions in React
// - Keeps filters + charts + CSV export + detail drawer
// - Adds alerts/anomaly panel
//
// IMPORTANT:
// Before using this file, create these DB objects:
// - view: public.admin_users_dashboard_v1
// - function: public.admin_users_dashboard_kpis_v1()

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminRegisteredUsers } from "@/hooks/admin/useAdminRegisteredUsers";
import type { RegisteredUserSubscriptionStatus } from "@/types/adminUsers";

type DashboardRow = {
  subscription_id: string;
  user_id: string;
  profile_id: string | null;
  email: string;
  is_admin: boolean;
  admin_level: number;
  status: string;
  environment: string;
  plan_interval: string;
  currency_code: string;
  amount_cents: number;
  quantity: number;
  created_at: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  missing_profile: boolean;
  unknown_email: boolean;
  unknown_plan: boolean;
  unknown_amount: boolean;
  anomaly_flags: string[] | null;
};

type KpiRow = {
  production_active_count: number;
  production_trialing_count: number;
  monthly_count: number;
  yearly_count: number;
  canceling_soon_count: number;
  sandbox_count: number;
  missing_profile_count: number;
  unknown_email_count: number;
  estimated_mrr: number;
  estimated_arr: number;
};

const PAGE_MAX = 1240;
const VIEW_NAME = "admin_users_dashboard_v1";
const KPI_RPC_NAME = "admin_users_dashboard_kpis_v1";
const ZERO_DECIMAL_CURRENCIES = new Set(["VND", "JPY", "KRW"]);

const EMPTY_KPIS: KpiRow = {
  production_active_count: 0,
  production_trialing_count: 0,
  monthly_count: 0,
  yearly_count: 0,
  canceling_soon_count: 0,
  sandbox_count: 0,
  missing_profile_count: 0,
  unknown_email_count: 0,
  estimated_mrr: 0,
  estimated_arr: 0,
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

function safeBool(value: unknown): boolean {
  return value === true;
}

function safeStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value
    .map((item) => safeText(item))
    .filter(Boolean);
  return items.length > 0 ? items : [];
}

function normalizeDashboardRow(row: unknown): DashboardRow | null {
  if (!row || typeof row !== "object") return null;

  const record = row as Record<string, unknown>;
  const subscriptionId = safeText(record.subscription_id);
  const userId = safeText(record.user_id);

  if (!subscriptionId || !userId) return null;

  return {
    subscription_id: subscriptionId,
    user_id: userId,
    profile_id: safeText(record.profile_id) || null,
    email: safeText(record.email, "unknown"),
    is_admin: safeBool(record.is_admin),
    admin_level: safeNumber(record.admin_level, 0),
    status: safeText(record.status, "unknown"),
    environment: safeText(record.environment, "unknown"),
    plan_interval: safeText(record.plan_interval, "unknown"),
    currency_code: safeText(record.currency_code, "USD"),
    amount_cents: safeNumber(record.amount_cents, 0),
    quantity: safeNumber(record.quantity, 1),
    created_at: safeText(record.created_at) || null,
    current_period_end: safeText(record.current_period_end) || null,
    cancel_at_period_end: safeBool(record.cancel_at_period_end),
    provider_customer_id: safeText(record.provider_customer_id) || null,
    provider_subscription_id: safeText(record.provider_subscription_id) || null,
    missing_profile: safeBool(record.missing_profile),
    unknown_email: safeBool(record.unknown_email),
    unknown_plan: safeBool(record.unknown_plan),
    unknown_amount: safeBool(record.unknown_amount),
    anomaly_flags: safeStringArray(record.anomaly_flags),
  };
}

function normalizeKpiRow(value: unknown): KpiRow {
  const row = value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};

  return {
    production_active_count: safeNumber(row.production_active_count, 0),
    production_trialing_count: safeNumber(row.production_trialing_count, 0),
    monthly_count: safeNumber(row.monthly_count, 0),
    yearly_count: safeNumber(row.yearly_count, 0),
    canceling_soon_count: safeNumber(row.canceling_soon_count, 0),
    sandbox_count: safeNumber(row.sandbox_count, 0),
    missing_profile_count: safeNumber(row.missing_profile_count, 0),
    unknown_email_count: safeNumber(row.unknown_email_count, 0),
    estimated_mrr: safeNumber(row.estimated_mrr, 0),
    estimated_arr: safeNumber(row.estimated_arr, 0),
  };
}

async function copyToClipboard(value: string): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return;
  await navigator.clipboard.writeText(value);
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

// Small pill colour map for the Registered tab. Reuses the same palette
// language as the Subscribers tab badges without coupling to that file.
function subscriptionPillStyle(
  status: RegisteredUserSubscriptionStatus,
): { bg: string; fg: string } {
  switch (status) {
    case "active":
      return { bg: "rgba(236,253,245,0.95)", fg: "rgba(6,95,70,0.94)" };
    case "trialing":
      return { bg: "rgba(254,243,199,0.95)", fg: "rgba(120,53,15,0.95)" };
    case "free":
      return { bg: "rgba(241,245,249,0.95)", fg: "rgba(51,65,85,0.92)" };
    case "unknown":
    default:
      return { bg: "rgba(254,242,242,0.95)", fg: "rgba(127,29,29,0.92)" };
  }
}

function formatMoneyFromMinorUnits(
  amountMinor: number,
  currency = "USD",
  quantity = 1,
): string {
  const code = currency.toUpperCase();
  const totalMinor = safeNumber(amountMinor, 0) * safeNumber(quantity, 1);
  const majorAmount = ZERO_DECIMAL_CURRENCIES.has(code) ? totalMinor : totalMinor / 100;
  return formatMoney(majorAmount, code);
}

function csvEscape(value: unknown): string {
  const text = safeText(value, "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function KpiCard({
  label,
  value,
  help,
}: {
  label: string;
  value: string | number;
  help?: string;
}) {
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

function AlertsPanel({
  rows,
  onApply,
}: {
  rows: DashboardRow[];
  onApply: (patch: {
    search?: string;
    environment?: string;
    status?: string;
    plan?: string;
    admin?: string;
  }) => void;
}) {
  const counts = useMemo(
    () => ({
      missingProfile: rows.filter((r) => r.missing_profile).length,
      unknownEmail: rows.filter((r) => r.unknown_email).length,
      cancelingSoon: rows.filter((r) => r.cancel_at_period_end && r.environment === "production").length,
      sandbox: rows.filter((r) => r.environment === "sandbox").length,
    }),
    [rows],
  );

  const cardWrap: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  };

  const alertCard = (tone: "red" | "amber" | "blue" | "gray"): React.CSSProperties => {
    const tones = {
      red: {
        background: "rgba(254,242,242,0.96)",
        border: "1px solid rgba(239,68,68,0.18)",
        color: "rgba(153,27,27,0.92)",
      },
      amber: {
        background: "rgba(255,251,235,0.96)",
        border: "1px solid rgba(245,158,11,0.18)",
        color: "rgba(146,64,14,0.92)",
      },
      blue: {
        background: "rgba(239,246,255,0.96)",
        border: "1px solid rgba(59,130,246,0.18)",
        color: "rgba(30,64,175,0.92)",
      },
      gray: {
        background: "rgba(248,250,252,0.96)",
        border: "1px solid rgba(0,0,0,0.08)",
        color: "rgba(51,65,85,0.92)",
      },
    };

    return {
      borderRadius: 18,
      padding: "14px 14px",
      cursor: "pointer",
      boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
      ...tones[tone],
    };
  };

  const title: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.55,
    textTransform: "uppercase",
  };

  const value: React.CSSProperties = {
    marginTop: 6,
    fontSize: 28,
    fontWeight: 950,
    lineHeight: 1.05,
  };

  const help: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.45,
    opacity: 0.88,
  };

  return (
    <div style={cardWrap}>
      <button
        type="button"
        style={alertCard("red")}
        onClick={() => onApply({ search: "missing_profile", environment: "all" })}
      >
        <div style={title}>Missing profile</div>
        <div style={value}>{counts.missingProfile}</div>
        <div style={help}>Subscribed users without a matching profile row.</div>
      </button>

      <button
        type="button"
        style={alertCard("red")}
        onClick={() => onApply({ search: "unknown_email", environment: "all" })}
      >
        <div style={title}>Unknown email</div>
        <div style={value}>{counts.unknownEmail}</div>
        <div style={help}>Rows still missing a resolved identity email.</div>
      </button>

      <button
        type="button"
        style={alertCard("amber")}
        onClick={() => onApply({ search: "canceling_soon", environment: "production" })}
      >
        <div style={title}>Canceling soon</div>
        <div style={value}>{counts.cancelingSoon}</div>
        <div style={help}>Active production subscriptions set to end at period close.</div>
      </button>

      <button
        type="button"
        style={alertCard("gray")}
        onClick={() => onApply({ environment: "sandbox", search: "" })}
      >
        <div style={title}>Sandbox rows</div>
        <div style={value}>{counts.sandbox}</div>
        <div style={help}>Test billing rows still present in the dashboard data.</div>
      </button>
    </div>
  );
}

function AdminUserDetailDrawer({
  row,
  open,
  onClose,
}: {
  row: DashboardRow | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !row) return null;

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.28)",
    zIndex: 90,
    display: "flex",
    justifyContent: "flex-end",
  };

  const drawer: React.CSSProperties = {
    width: "min(540px, 96vw)",
    height: "100%",
    background: "rgba(255,255,255,0.98)",
    borderLeft: "1px solid rgba(0,0,0,0.10)",
    boxShadow: "-12px 0 40px rgba(0,0,0,0.12)",
    overflowY: "auto",
    padding: "20px 18px 28px",
  };

  const topRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.05,
    fontWeight: 950,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -0.8,
  };

  const sub: React.CSSProperties = {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.60)",
  };

  const closeBtn: React.CSSProperties = {
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.96)",
    padding: "10px 12px",
    fontWeight: 900,
    cursor: "pointer",
  };

  const section: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(250,251,252,0.96)",
    padding: "14px 14px",
  };

  const sectionTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 900,
    color: "rgba(0,0,0,0.82)",
  };

  const grid: React.CSSProperties = {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "minmax(110px, 140px) 1fr",
    gap: "10px 12px",
  };

  const keyStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.46)",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.84)",
    overflowWrap: "anywhere",
  };

  const actionRow: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  };

  const actionBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.96)",
    color: "rgba(0,0,0,0.78)",
    fontWeight: 900,
    cursor: "pointer",
  };

  const badge = (warn = false): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 9999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: "nowrap",
    border: warn
      ? "1px solid rgba(239,68,68,0.20)"
      : "1px solid rgba(0,0,0,0.10)",
    background: warn
      ? "rgba(254,242,242,0.96)"
      : "rgba(248,250,252,0.96)",
    color: warn ? "rgba(153,27,27,0.92)" : "rgba(51,65,85,0.90)",
  });

  const anomalyFlags = Array.isArray(row.anomaly_flags) ? row.anomaly_flags : [];

  return (
    <div style={overlay} onClick={onClose}>
      <div style={drawer} onClick={(e) => e.stopPropagation()}>
        <div style={topRow}>
          <div>
            <h2 style={title}>{row.email || "unknown"}</h2>
            <div style={sub}>Subscription detail and anomaly inspection.</div>
          </div>

          <button type="button" style={closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>Identity</h3>
          <div style={grid}>
            <div style={keyStyle}>Email</div>
            <div style={valueStyle}>{row.email || "unknown"}</div>

            <div style={keyStyle}>User ID</div>
            <div style={valueStyle}>
              <code>{row.user_id}</code>
            </div>

            <div style={keyStyle}>Profile ID</div>
            <div style={valueStyle}>
              <code>{row.profile_id || "—"}</code>
            </div>

            <div style={keyStyle}>Admin</div>
            <div style={valueStyle}>{row.is_admin ? `Yes · level ${row.admin_level}` : "No"}</div>

            <div style={keyStyle}>Environment</div>
            <div style={valueStyle}>{row.environment}</div>
          </div>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>Billing</h3>
          <div style={grid}>
            <div style={keyStyle}>Status</div>
            <div style={valueStyle}>{row.status}</div>

            <div style={keyStyle}>Plan</div>
            <div style={valueStyle}>{row.plan_interval}</div>

            <div style={keyStyle}>Amount</div>
            <div style={valueStyle}>
              {row.amount_cents > 0
                ? formatMoneyFromMinorUnits(row.amount_cents, row.currency_code, row.quantity)
                : "—"}
            </div>

            <div style={keyStyle}>Subscription ID</div>
            <div style={valueStyle}>
              <code>{row.subscription_id}</code>
            </div>

            <div style={keyStyle}>Provider customer</div>
            <div style={valueStyle}>
              <code>{row.provider_customer_id || "—"}</code>
            </div>

            <div style={keyStyle}>Provider subscription</div>
            <div style={valueStyle}>
              <code>{row.provider_subscription_id || "—"}</code>
            </div>

            <div style={keyStyle}>Created</div>
            <div style={valueStyle}>{fmtDate(row.created_at)}</div>

            <div style={keyStyle}>Period end</div>
            <div style={valueStyle}>{fmtDate(row.current_period_end)}</div>

            <div style={keyStyle}>Cancel at end</div>
            <div style={valueStyle}>{row.cancel_at_period_end ? "Yes" : "No"}</div>
          </div>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>Anomalies</h3>
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {anomalyFlags.length === 0 ? (
              <span style={badge(false)}>No anomaly flags</span>
            ) : (
              anomalyFlags.map((flag) => (
                <span key={flag} style={badge(true)}>
                  {flag}
                </span>
              ))
            )}
          </div>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>Quick actions</h3>
          <div style={actionRow}>
            <button
              type="button"
              style={actionBtn}
              onClick={() => {
                if (row.email && row.email !== "unknown") {
                  void copyToClipboard(row.email);
                }
              }}
            >
              Copy email
            </button>

            <button
              type="button"
              style={actionBtn}
              onClick={() => {
                void copyToClipboard(row.user_id);
              }}
            >
              Copy user ID
            </button>

            <button
              type="button"
              style={actionBtn}
              onClick={() => {
                void copyToClipboard(row.subscription_id);
              }}
            >
              Copy subscription ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<DashboardRow | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState("production");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");

  const [kpis, setKpis] = useState<KpiRow>(EMPTY_KPIS);

  const [allProfiles, setAllProfiles] = useState<Array<{id: string; email: string; tier: string; created_at: string | null}>>([]);
  const [activeTab, setActiveTabLocal] = useState<'subscribers' | 'all_users' | 'registered'>('subscribers');

  // User-first list (auth.users via admin-list-registered-users edge fn).
  // Lazy: the hook fires its initial load on mount, but the heavy table
  // only renders when the Registered tab is active.
  const registered = useAdminRegisteredUsers();
  const requestIdRef = useRef(0);

  const load = async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setErr(null);

    try {
      const [{ data: rowsData, error: rowsError }, { data: kpiData, error: kpiError }] =
        await Promise.all([
          supabase.from(VIEW_NAME).select("*").order("created_at", { ascending: false }),
          supabase.rpc(KPI_RPC_NAME),
        ]);

      if (rowsError) throw rowsError;
      if (kpiError) throw kpiError;

      if (requestIdRef.current !== requestId) return;

      const nextRows = (Array.isArray(rowsData) ? rowsData : [])
        .map(normalizeDashboardRow)
        .filter((row): row is DashboardRow => Boolean(row));

      const rawKpis = Array.isArray(kpiData) ? kpiData[0] : kpiData;
      const nextKpis = normalizeKpiRow(rawKpis ?? EMPTY_KPIS);

      setRows(nextRows);
      setKpis(nextKpis);
      setRefreshedAt(new Date().toISOString());

      // Also load ALL profiles (free + paid)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email, tier, created_at')
        .order('created_at', { ascending: false })
        .limit(2000);
      if (profilesData) {
        const profileRows = profilesData as Array<{
          id?: unknown; email?: unknown; tier?: unknown; created_at?: unknown;
        }>;
        setAllProfiles(profileRows.map((p) => ({
          id: safeText(p.id), email: safeText(p.email, 'unknown'),
          tier: safeText(p.tier, 'free'), created_at: safeText(p.created_at) || null,
        })));
      }
    } catch (e: unknown) {
      if (requestIdRef.current !== requestId) return;
      setErr(e instanceof Error ? e.message : String(e));
      setRows([]);
      setKpis(EMPTY_KPIS);
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const environmentOptions = useMemo(() => {
    const set = new Set<string>(["all"]);
    rows.forEach((r) => set.add(safeText(r.environment, "unknown")));
    return Array.from(set);
  }, [rows]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>(["all"]);
    rows.forEach((r) => set.add(safeText(r.status, "unknown")));
    return Array.from(set);
  }, [rows]);

  const planOptions = useMemo(() => {
    const set = new Set<string>(["all"]);
    rows.forEach((r) => set.add(safeText(r.plan_interval, "unknown")));
    return Array.from(set);
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base = rows.filter((row) => {
      if (environmentFilter !== "all" && row.environment !== environmentFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (planFilter !== "all" && row.plan_interval !== planFilter) return false;

      if (adminFilter === "admin" && !row.is_admin) return false;
      if (adminFilter === "non_admin" && row.is_admin) return false;

      if (!q) return true;

      const anomalyText = Array.isArray(row.anomaly_flags) ? row.anomaly_flags.join(" ") : "";
      const quickTags = [
        row.missing_profile ? "missing_profile" : "",
        row.unknown_email ? "unknown_email" : "",
        row.cancel_at_period_end ? "canceling_soon" : "",
        row.unknown_plan ? "unknown_plan" : "",
        row.unknown_amount ? "unknown_amount" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        safeText(row.email, "unknown").toLowerCase().includes(q) ||
        safeText(row.status).toLowerCase().includes(q) ||
        safeText(row.plan_interval).toLowerCase().includes(q) ||
        safeText(row.environment).toLowerCase().includes(q) ||
        safeText(row.user_id).toLowerCase().includes(q) ||
        anomalyText.toLowerCase().includes(q) ||
        quickTags.includes(q)
      );
    });

    const sorted = [...base];

    sorted.sort((a, b) => {
      switch (sortBy) {
        case "email_asc":
          return safeText(a.email).localeCompare(safeText(b.email));
        case "email_desc":
          return safeText(b.email).localeCompare(safeText(a.email));
        case "plan_asc":
          return safeText(a.plan_interval).localeCompare(safeText(b.plan_interval));
        case "status_asc":
          return safeText(a.status).localeCompare(safeText(b.status));
        case "period_desc":
          return new Date(b.current_period_end ?? 0).getTime() - new Date(a.current_period_end ?? 0).getTime();
        case "amount_desc":
          return safeNumber(b.amount_cents) - safeNumber(a.amount_cents);
        case "created_asc":
          return new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime();
        case "created_desc":
        default:
          return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
      }
    });

    return sorted;
  }, [rows, search, environmentFilter, statusFilter, planFilter, adminFilter, sortBy]);

  const filteredTotals = useMemo(
    () => ({
      rows: filteredRows.length,
      active: filteredRows.filter((r) => r.status === "active").length,
      trialing: filteredRows.filter((r) => r.status === "trialing").length,
      admins: filteredRows.filter((r) => r.is_admin).length,
    }),
    [filteredRows],
  );

  const exportCsv = () => {
    if (typeof document === "undefined" || typeof URL === "undefined") return;

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
      "profile_id",
      "subscription_id",
      "provider_customer_id",
      "provider_subscription_id",
      "missing_profile",
      "unknown_email",
      "unknown_plan",
      "unknown_amount",
      "anomaly_flags",
    ];

    const lines = filteredRows.map((row) =>
      [
        csvEscape(row.email),
        csvEscape(row.status),
        csvEscape(row.plan_interval),
        csvEscape(row.environment),
        csvEscape(row.amount_cents),
        csvEscape(row.currency_code),
        csvEscape(row.cancel_at_period_end),
        csvEscape(row.current_period_end ?? ""),
        csvEscape(row.created_at ?? ""),
        csvEscape(row.is_admin),
        csvEscape(row.admin_level),
        csvEscape(row.user_id),
        csvEscape(row.profile_id ?? ""),
        csvEscape(row.subscription_id),
        csvEscape(row.provider_customer_id ?? ""),
        csvEscape(row.provider_subscription_id ?? ""),
        csvEscape(row.missing_profile),
        csvEscape(row.unknown_email),
        csvEscape(row.unknown_plan),
        csvEscape(row.unknown_amount),
        csvEscape(Array.isArray(row.anomaly_flags) ? row.anomaly_flags.join("|") : ""),
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

  const meta: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    color: "rgba(0,0,0,0.52)",
    fontWeight: 700,
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

  const chipRow: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  };

  const chip = (active: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 9999,
    border: active
      ? "1px solid rgba(16,185,129,0.28)"
      : "1px solid rgba(0,0,0,0.10)",
    background: active
      ? "rgba(236,253,245,0.94)"
      : "rgba(255,255,255,0.92)",
    color: active ? "rgba(6,95,70,0.92)" : "rgba(0,0,0,0.72)",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
  });

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
    background: "rgba(247,249,252,0.98)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 1,
  };

  const td: React.CSSProperties = {
    padding: "12px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    fontSize: 14,
    color: "rgba(0,0,0,0.82)",
    verticalAlign: "top",
  };

  const rowStyle = (row: DashboardRow): React.CSSProperties => {
    if (row.missing_profile) return { background: "rgba(254,242,242,0.72)" };
    if (row.cancel_at_period_end) return { background: "rgba(255,251,235,0.82)" };
    if (row.environment === "sandbox") return { background: "rgba(248,250,252,0.72)" };
    return { background: "white" };
  };

  const emailStyle: React.CSSProperties = {
    cursor: "copy",
    fontWeight: 800,
  };

  const rowBtn: React.CSSProperties = {
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: 0,
    padding: 0,
    margin: 0,
    cursor: "pointer",
    color: "inherit",
    font: "inherit",
  };

  const badge = (
    kind: "active" | "trialing" | "month" | "year" | "admin" | "plain" | "warn",
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
      case "warn":
        return {
          ...base,
          background: "rgba(254,242,242,0.96)",
          color: "rgba(153,27,27,0.92)",
          border: "1px solid rgba(239,68,68,0.20)",
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
            revenue, churn-risk signals, and a filterable audit list.
          </div>
          <div style={meta}>
            Last refreshed: {refreshedAt ? new Date(refreshedAt).toLocaleString() : "—"}
          </div>

          <div style={topActions}>
            <Link to="/admin" style={pillBtn}>
              ← Back to Admin
            </Link>
            <Link to="/admin/subscriptions" style={pillBtn}>
              Billing page
            </Link>
            <button type="button" style={pillBtn} onClick={() => void load()}>
              ↻ Refresh
            </button>
            <button type="button" style={pillBtn} onClick={exportCsv}>
              ⭳ Export CSV
            </button>
          </div>
        </div>

        <div style={kpiGrid}>
          <KpiCard label="Production active" value={kpis.production_active_count} help="Real active paid production subscriptions." />
          <KpiCard label="Production trialing" value={kpis.production_trialing_count} help="Trials not yet converted." />
          <KpiCard label="Monthly" value={kpis.monthly_count} help="Production active subscriptions billed monthly." />
          <KpiCard label="Yearly" value={kpis.yearly_count} help="Production active subscriptions billed yearly." />
          <KpiCard label="Canceling soon" value={kpis.canceling_soon_count} help="Active production users with cancel_at_period_end." />
          <KpiCard label="Sandbox rows" value={kpis.sandbox_count} help="Test billing rows still in subscriptions." />
          <KpiCard label="Missing profile" value={kpis.missing_profile_count} help="Subscriptions with no matching profile row." />
          <KpiCard label="Unknown email" value={kpis.unknown_email_count} help="Rows still missing identity email." />
          <KpiCard label="Estimated MRR" value={formatMoney(safeNumber(kpis.estimated_mrr, 0))} help="Yearly plans normalized to monthly." />
          <KpiCard label="Estimated ARR" value={formatMoney(safeNumber(kpis.estimated_arr, 0))} help="Simple annualized recurring revenue." />
          <KpiCard
            label="Conversion"
            value={`${
              kpis.production_active_count + kpis.production_trialing_count > 0
                ? Math.round(
                    (kpis.production_active_count /
                      (kpis.production_active_count + kpis.production_trialing_count)) *
                      100,
                  )
                : 0
            }%`}
            help="Active ÷ (active + trialing)."
          />
          <KpiCard
            label="Filtered rows"
            value={filteredTotals.rows}
            help="Current result set after filters."
          />
        </div>

        {/* Tab switcher */}
        <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {(['subscribers', 'all_users', 'registered'] as const).map(tab => (
            <button key={tab} type="button"
              onClick={() => setActiveTabLocal(tab)}
              style={{
                padding: '10px 18px', borderRadius: 999, fontWeight: 900, fontSize: 14, cursor: 'pointer',
                border: activeTab === tab ? '1px solid rgba(0,0,0,0.24)' : '1px solid rgba(0,0,0,0.10)',
                background: activeTab === tab ? 'black' : 'white',
                color: activeTab === tab ? 'white' : 'rgba(0,0,0,0.72)',
              }}>
              {tab === 'subscribers'
                ? `💳 Subscribers (${rows.length})`
                : tab === 'all_users'
                  ? `👥 All Users (${allProfiles.length})`
                  : `📋 Registered (${registered.users.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'all_users' && (
          <div style={{ marginTop: 18, borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)', background: 'white', padding: 16, boxShadow: '0 10px 24px rgba(0,0,0,0.04)' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900 }}>All Registered Users</h2>
            <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>All profiles including free users — {allProfiles.length} total</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Total Users', value: allProfiles.length },
                { label: 'Free (level0)', value: allProfiles.filter(p => !p.tier || p.tier === 'level0' || p.tier === 'free').length },
                { label: 'Paid', value: allProfiles.filter(p => p.tier && p.tier !== 'level0' && p.tier !== 'free').length },
                { label: 'This Month', value: allProfiles.filter(p => p.created_at && new Date(p.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length },
              ].map(stat => (
                <div key={stat.label} style={{ padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(248,250,252,0.96)' }}>
                  <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(0,0,0,0.45)', marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 950, letterSpacing: -0.7 }}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr>
                    {['Email', 'Tier', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 900, letterSpacing: 0.5, textTransform: 'uppercase', color: 'rgba(0,0,0,0.48)', background: 'rgba(247,249,252,0.98)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allProfiles.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <td style={{ padding: '10px 12px', fontSize: 14 }}>{p.email}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13 }}>
                        <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 900, background: p.tier === 'level0' || p.tier === 'free' || !p.tier ? 'rgba(248,250,252,0.96)' : 'rgba(236,253,245,0.95)', border: '1px solid rgba(0,0,0,0.10)', color: p.tier === 'level0' || p.tier === 'free' || !p.tier ? 'rgba(51,65,85,0.90)' : 'rgba(6,95,70,0.94)' }}>
                          {p.tier || 'free'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'registered' && (
          <div style={{ marginTop: 18, borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)', background: 'white', padding: 16, boxShadow: '0 10px 24px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900 }}>Registered Users</h2>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>
                  Source: <code style={{ background: 'rgba(0,0,0,0.04)', padding: '1px 6px', borderRadius: 4 }}>auth.users</code> via <code style={{ background: 'rgba(0,0,0,0.04)', padding: '1px 6px', borderRadius: 4 }}>admin-list-registered-users</code> edge fn — includes signups missing a profile row.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => registered.refresh()} disabled={registered.loading}
                  style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(0,0,0,0.10)', background: 'white', fontSize: 13, fontWeight: 700, cursor: registered.loading ? 'wait' : 'pointer', opacity: registered.loading ? 0.6 : 1 }}>
                  {registered.loading ? 'Loading…' : '↻ Refresh'}
                </button>
              </div>
            </div>

            {registered.error ? (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 12, background: 'rgba(254,226,226,0.55)', border: '1px solid rgba(220,38,38,0.25)', color: 'rgba(127,29,29,0.92)', fontSize: 13 }}>
                {registered.error}
              </div>
            ) : null}

            <div style={{ marginTop: 14, overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                <thead>
                  <tr>
                    {['Email', 'Subscription', 'Profile', 'Provider', 'Joined', 'Last sign-in'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 900, letterSpacing: 0.5, textTransform: 'uppercase', color: 'rgba(0,0,0,0.48)', background: 'rgba(247,249,252,0.98)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registered.users.length === 0 && !registered.loading ? (
                    <tr><td colSpan={6} style={{ padding: '20px 12px', textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>No registered users on this page.</td></tr>
                  ) : null}
                  {registered.users.map(u => {
                    const subStyle = subscriptionPillStyle(u.subscriptionStatus);
                    const profilePill = u.hasProfile
                      ? { bg: 'rgba(236,253,245,0.95)', fg: 'rgba(6,95,70,0.94)', label: 'yes' }
                      : { bg: 'rgba(254,242,242,0.95)', fg: 'rgba(127,29,29,0.92)', label: 'missing' };
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 12px', fontSize: 14 }}>
                          {u.email || <span style={{ color: 'rgba(127,29,29,0.85)', fontStyle: 'italic' }}>unknown</span>}
                          {u.isAdmin ? <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 900, background: 'rgba(254,243,199,0.95)', color: 'rgba(120,53,15,0.95)' }}>admin</span> : null}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 13 }}>
                          <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 900, background: subStyle.bg, color: subStyle.fg, border: '1px solid rgba(0,0,0,0.06)' }}>
                            {u.subscriptionStatus}
                          </span>
                          {u.currentPeriodEnd ? <div style={{ marginTop: 4, fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>until {new Date(u.currentPeriodEnd).toLocaleDateString()}</div> : null}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 13 }}>
                          <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 900, background: profilePill.bg, color: profilePill.fg }}>
                            {profilePill.label}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 13, color: 'rgba(0,0,0,0.62)' }}>{u.provider || '—'}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>{u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)' }}>
                Page {registered.page} · {registered.users.length} rows
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => registered.goToPage(registered.page - 1)} disabled={registered.loading || registered.page <= 1}
                  style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(0,0,0,0.10)', background: 'white', fontSize: 13, fontWeight: 700, cursor: registered.loading || registered.page <= 1 ? 'not-allowed' : 'pointer', opacity: registered.loading || registered.page <= 1 ? 0.5 : 1 }}>
                  ← Prev
                </button>
                <button type="button" onClick={() => registered.goToPage(registered.page + 1)} disabled={registered.loading || !registered.hasMore}
                  style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(0,0,0,0.10)', background: 'white', fontSize: 13, fontWeight: 700, cursor: registered.loading || !registered.hasMore ? 'not-allowed' : 'pointer', opacity: registered.loading || !registered.hasMore ? 0.5 : 1 }}>
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        <AlertsPanel
          rows={rows}
          onApply={(patch) => {
            if (typeof patch.search !== "undefined") setSearch(patch.search);
            if (typeof patch.environment !== "undefined") setEnvironmentFilter(patch.environment);
            if (typeof patch.status !== "undefined") setStatusFilter(patch.status);
            if (typeof patch.plan !== "undefined") setPlanFilter(patch.plan);
            if (typeof patch.admin !== "undefined") setAdminFilter(patch.admin);
          }}
        />

        <div style={filtersCard}>
          <div style={filtersGrid}>
            <div>
              <div style={labelStyle}>Search</div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email, plan, status, user id, anomaly…"
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
                    {option === "all" ? "All" : titleCase(option)}
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
                    {option === "all" ? "All" : titleCase(option)}
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
                    {option === "all" ? "All" : titleCase(option)}
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

          <div style={chipRow}>
            <button type="button" style={chip(statusFilter === "active")} onClick={() => setStatusFilter("active")}>
              Active
            </button>
            <button type="button" style={chip(statusFilter === "trialing")} onClick={() => setStatusFilter("trialing")}>
              Trialing
            </button>
            <button type="button" style={chip(planFilter === "month")} onClick={() => setPlanFilter("month")}>
              Monthly
            </button>
            <button type="button" style={chip(planFilter === "year")} onClick={() => setPlanFilter("year")}>
              Yearly
            </button>
            <button
              type="button"
              style={chip(search === "canceling_soon" && environmentFilter === "production")}
              onClick={() => {
                setSearch("canceling_soon");
                setEnvironmentFilter("production");
              }}
            >
              Canceling soon
            </button>
            <button
              type="button"
              style={chip(false)}
              onClick={() => {
                setSearch("");
                setEnvironmentFilter("production");
                setStatusFilter("all");
                setPlanFilter("all");
                setAdminFilter("all");
                setSortBy("created_desc");
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div style={tableCard}>
          <h2 style={chartTitle}>Members list</h2>
          <p style={chartHelp}>
            Filterable row view for support, billing audits, and quick manual checks. Click an email to copy it.
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
                      <tr key={row.subscription_id} style={rowStyle(row)}>
                        <td style={td}>
                          <button type="button" style={rowBtn} onClick={() => setSelectedRow(row)}>
                            <div
                              style={emailStyle}
                              title="Click to copy email"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (row.email && row.email !== "unknown") {
                                  void copyToClipboard(row.email);
                                }
                              }}
                            >
                              {row.email || "unknown"}
                            </div>
                          </button>
                        </td>

                        <td style={td}>
                          <button type="button" style={rowBtn} onClick={() => setSelectedRow(row)}>
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
                          </button>
                        </td>

                        <td style={td}>
                          <button type="button" style={rowBtn} onClick={() => setSelectedRow(row)}>
                            <span
                              style={badge(
                                row.plan_interval === "year"
                                  ? "year"
                                  : row.plan_interval === "month"
                                    ? "month"
                                    : "plain",
                              )}
                            >
                              {titleCase(row.plan_interval)}
                            </span>
                          </button>
                        </td>

                        <td style={td}>
                          <button type="button" style={rowBtn} onClick={() => setSelectedRow(row)}>
                            {safeNumber(row.amount_cents, 0) > 0
                              ? formatMoneyFromMinorUnits(
                                  safeNumber(row.amount_cents, 0),
                                  row.currency_code,
                                  safeNumber(row.quantity, 1),
                                )
                              : "—"}
                          </button>
                        </td>

                        <td style={td}>
                          <button type="button" style={rowBtn} onClick={() => setSelectedRow(row)}>
                            {titleCase(row.environment)}
                          </button>
                        </td>

                        <td style={td}>
                          <button type="button" style={rowBtn} onClick={() => setSelectedRow(row)}>
                            {fmtDate(row.current_period_end)}
                          </button>
                        </td>

                        <td style={td}>
                          <button type="button" style={rowBtn} onClick={() => setSelectedRow(row)}>
                            {fmtDate(row.created_at)}
                          </button>
                        </td>

                        <td style={td}>
                          <button type="button" style={rowBtn} onClick={() => setSelectedRow(row)}>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {row.cancel_at_period_end ? (
                                <span style={badge("warn")}>Cancel at period end</span>
                              ) : null}
                              {row.is_admin ? (
                                <span style={badge("admin")}>Admin L{row.admin_level}</span>
                              ) : null}
                              {row.missing_profile ? (
                                <span style={badge("warn")}>Missing profile</span>
                              ) : null}
                              {row.unknown_email ? (
                                <span style={badge("warn")}>Unknown email</span>
                              ) : null}
                            </div>
                          </button>
                        </td>

                        <td style={td}>
                          <button type="button" style={rowBtn} onClick={() => setSelectedRow(row)}>
                            <code style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                              {row.user_id}
                            </code>
                          </button>
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

      <AdminUserDetailDrawer
        row={selectedRow}
        open={!!selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}